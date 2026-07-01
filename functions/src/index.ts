import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

admin.initializeApp();
const db = admin.firestore();

/**
 * Creates a Cashfree order securely from backend.
 * Expects: planId, planName, coachingId, userId, amount, currency in request body.
 */
export const createCashfreeOrder = onRequest({ cors: true }, async (req, res) => {
  try {
    const { planId, planName, coachingId, userId, amount, currency } = req.body;

    if (!planId || !coachingId || !userId || !amount) {
      res.status(400).json({ error: "Missing required fields: planId, coachingId, userId, amount" });
      return;
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const cashfreeEnv = process.env.CASHFREE_ENV || "TEST";

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: "Cashfree API keys are not configured in environment variables" });
      return;
    }

    // Get User Details to enrich Customer info
    let userProfile: any = null;
    try {
      const userSnap = await db.collection("users").doc(userId).get();
      if (userSnap.exists) {
        userProfile = userSnap.data();
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }

    const orderId = "cf_order_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
    const cashfreeUrl = cashfreeEnv === "PROD" 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: currency || "INR",
      customer_details: {
        customer_id: userId,
        customer_name: userProfile?.name || "Customer",
        customer_email: userProfile?.email || "customer@example.com",
        customer_phone: userProfile?.mobile || "9999999999"
      },
      order_meta: {
        return_url: `${process.env.APP_URL || "https://coachingos.app"}/billing-callback?order_id={order_id}`,
        notify_url: `https://${process.env.LOCATION || "us-central1"}-${process.env.PROJECT_ID || "long-wind-w0bnn"}.cloudfunctions.net/cashfreeWebhook`
      }
    };

    // Make post call to Cashfree
    const response = await fetch(cashfreeUrl, {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseData: any = await response.json();

    if (!response.ok) {
      console.error("Cashfree Order creation call failed:", responseData);
      res.status(response.status).json({ 
        error: responseData.message || "Failed to initiate payment order with Cashfree",
        details: responseData
      });
      return;
    }

    // Write a pending payment history record
    await db.collection("payments").doc(orderId).set({
      id: orderId,
      coachingId,
      userId,
      amount: Number(amount),
      currency: currency || "INR",
      planId,
      planName: planName || "StarterPlan",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderSessionId: responseData.payment_session_id,
      paymentGateway: "cashfree",
      isSimulated: false,
      cashfreeResponse: responseData
    });

    res.json({
      success: true,
      order_id: orderId,
      order_session_id: responseData.payment_session_id,
      order_status: responseData.order_status,
      order_amount: responseData.order_amount,
      responseData
    });
  } catch (err: any) {
    console.error("Cloud Function Create Cashfree Order Error:", err);
    res.status(500).json({ error: "Internal server error during order creation", message: err.message });
  }
});

/**
 * Cashfree Webhook Listener.
 * Receives POST webhooks from Cashfree. Verifies signature & updates subscription status.
 */
export const cashfreeWebhook = onRequest(async (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const timestamp = req.headers["x-webhook-timestamp"] as string;

  if (!signature || !timestamp) {
    res.status(400).send("Missing x-webhook-signature or x-webhook-timestamp headers");
    return;
  }

  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  if (!clientSecret) {
    console.error("Server Configuration Error: CASHFREE_CLIENT_SECRET is not configured");
    res.status(500).send("Server configuration error");
    return;
  }

  // Get raw body buffer from Cloud Function request
  const rawBody = req.rawBody ? req.rawBody.toString() : "";

  // Signature verification using HMAC SHA256 base64
  const payloadToSign = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", clientSecret)
    .update(payloadToSign)
    .digest("base64");

  if (signature !== expectedSignature) {
    console.error("Signature verification failed!", { signature, expectedSignature });
    res.status(401).send("Invalid webhook signature");
    return;
  }

  try {
    const webhookData = JSON.parse(rawBody);
    console.log("Cashfree Webhook payload signature verified. EventType:", webhookData.event);

    const eventType = webhookData.event;
    const orderId = webhookData.data?.order?.order_id;
    const cfPaymentId = webhookData.data?.payment?.cf_payment_id;

    if (!orderId) {
      res.status(400).send("Missing order_id in webhook payload");
      return;
    }

    // 1. Webhook Idempotency Check (prevent duplicate updates)
    const idempotencyKey = `${orderId}_${cfPaymentId || "refund"}_${eventType}`;
    const idempotencyRef = db.collection("processed_webhooks").doc(idempotencyKey);
    const idempotencyDoc = await idempotencyRef.get();

    if (idempotencyDoc.exists) {
      console.log(`Idempotency Check: Event already processed. Token: ${idempotencyKey}`);
      res.status(200).send("Webhook already processed (Duplicate)");
      return;
    }

    // 2. Load payment record
    const paymentRef = db.collection("payments").doc(orderId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      console.error(`Payment record not found for Order: ${orderId}`);
      res.status(404).send("Payment record not found");
      return;
    }

    const paymentData = paymentDoc.data();
    if (!paymentData) {
      res.status(500).send("Payment record has no data");
      return;
    }

    // 3. Process events
    if (eventType === "PAYMENT_SUCCESS" || eventType === "ORDER_PAID") {
      // Update payment record to success
      await paymentRef.update({
        status: "success",
        cashfreePaymentId: cfPaymentId ? String(cfPaymentId) : "",
        paymentMethod: webhookData.data?.payment?.payment_method || {},
        updatedAt: new Date().toISOString(),
        webhookResponse: webhookData
      });

      // Update coaching subscription to active
      const durationDays = paymentData.planName?.toLowerCase().includes("annual") ? 365 : 30;
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + durationDays);

      await db.collection("coachings").doc(paymentData.coachingId).update({
        "subscription.status": "active",
        "subscription.plan": paymentData.planName || "Starter",
        "subscription.endsAt": endsAt.toISOString()
      });

      console.log(`Coaching ${paymentData.coachingId} subscription activated for plan ${paymentData.planName}`);

    } else if (eventType === "PAYMENT_FAILED" || eventType === "ORDER_FAILED") {
      // Update payment record to failed
      await paymentRef.update({
        status: "failed",
        updatedAt: new Date().toISOString(),
        webhookResponse: webhookData
      });
      console.log(`Payment failed event processed for Order: ${orderId}`);

    } else if (eventType === "REFUND_SUCCESSFUL") {
      // Update payment status to refunded
      await paymentRef.update({
        status: "refunded",
        updatedAt: new Date().toISOString(),
        refundResponse: webhookData
      });

      // Update coaching subscription to expired
      await db.collection("coachings").doc(paymentData.coachingId).update({
        "subscription.status": "expired"
      });
      console.log(`Refund successful event processed. Subscription deactivated for Coaching: ${paymentData.coachingId}`);
    }

    // 4. Record idempotency token
    await idempotencyRef.set({
      processedAt: new Date().toISOString(),
      eventType,
      orderId,
      cfPaymentId: cfPaymentId ? String(cfPaymentId) : ""
    });

    res.status(200).send("Webhook successfully verified and processed");
  } catch (err: any) {
    console.error("Webhook Handler Error:", err);
    res.status(500).send("Error processing webhook: " + err.message);
  }
});
