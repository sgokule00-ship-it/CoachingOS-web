import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Read Firebase config
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

// Initialize standard Firebase client
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Capture raw body for signature verification
  app.use(express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    }
  }));
  app.use(express.urlencoded({ extended: true }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API to get Cashfree Config (Client-side modes/keys only - never secret key)
  app.get("/api/cashfree/config", (_req, res) => {
    res.json({
      clientId: process.env.CASHFREE_CLIENT_ID || "",
      env: process.env.CASHFREE_ENV || "TEST",
      isConfigured: !!(process.env.CASHFREE_CLIENT_ID && process.env.CASHFREE_CLIENT_SECRET)
    });
  });

  // API to create Cashfree Order
  app.post("/api/cashfree/create-order", async (req: any, res: any) => {
    try {
      const { planId, planName, coachingId, userId, amount, currency } = req.body;

      if (!planId || !coachingId || !userId || !amount) {
        return res.status(400).json({ error: "Missing required fields: planId, coachingId, userId, amount" });
      }

      // Check if credentials are set
      const clientId = process.env.CASHFREE_CLIENT_ID;
      const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
      const cashfreeEnv = process.env.CASHFREE_ENV || "TEST";

      if (!clientId || !clientSecret) {
        // Return simulated checkout order info to allow sandbox flow without crashing
        const orderId = "sim_order_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
        const orderSessionId = "sim_session_" + Math.random().toString(36).substring(2, 15);
        
        // Store simulated order in payments history
        const pendingPaymentRef = doc(db, "payments", orderId);
        await setDoc(pendingPaymentRef, {
          id: orderId,
          coachingId,
          userId,
          amount: Number(amount),
          currency: currency || "INR",
          planId,
          planName: planName || "Starter",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderSessionId,
          paymentGateway: "cashfree",
          isSimulated: true
        });

        return res.json({
          success: true,
          isSimulated: true,
          order_id: orderId,
          order_session_id: orderSessionId,
          order_status: "ACTIVE",
          order_amount: amount
        });
      }

      // Retrieve User Profile to get contact info
      let userProfile: any = null;
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          userProfile = userDoc.data();
        }
      } catch (e) {
        console.error("Failed to fetch user profile:", e);
      }

      const orderId = "cf_order_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
      const cashfreeUrl = cashfreeEnv === "PROD" 
        ? "https://api.cashfree.com/pg/orders" 
        : "https://sandbox.cashfree.com/pg/orders";

      // Call Cashfree API to Create Order
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
          return_url: `${process.env.APP_URL || "http://localhost:3000"}/billing-callback?order_id={order_id}`,
          notify_url: `${process.env.APP_URL || "http://localhost:3000"}/api/cashfree/webhook`
        }
      };

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
        console.error("Cashfree Order Creation failed:", responseData);
        return res.status(response.status).json({ 
          error: responseData.message || "Failed to create order with Cashfree",
          details: responseData
        });
      }

      // Store record in Firestore payments history
      const paymentRef = doc(db, "payments", orderId);
      await setDoc(paymentRef, {
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

      return res.json({
        success: true,
        order_id: orderId,
        order_session_id: responseData.payment_session_id,
        order_status: responseData.order_status,
        order_amount: responseData.order_amount,
        responseData
      });
    } catch (err: any) {
      console.error("Create Cashfree Order Error:", err);
      return res.status(500).json({ error: "Internal server error during order creation" });
    }
  });

  // Simulated Instant Payment Completion for Sandbox (Bypassing external gateway)
  app.post("/api/cashfree/sim-complete-payment", async (req: any, res: any) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Missing orderId" });
      }

      const paymentRef = doc(db, "payments", orderId);
      const paymentDoc = await getDoc(paymentRef);

      if (!paymentDoc.exists()) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      const paymentData = paymentDoc.data();
      if (paymentData.status !== "pending") {
        return res.json({ success: true, message: "Payment already processed", payment: paymentData });
      }

      // Update payment to successful
      await updateDoc(paymentRef, {
        status: "success",
        cashfreePaymentId: "sim_pay_" + Math.random().toString(36).substring(2, 10),
        paymentMethod: "SIMULATED",
        updatedAt: new Date().toISOString()
      });

      // Update coaching subscription to active
      const coachingRef = doc(db, "coachings", paymentData.coachingId);
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + 30); // 30 days access

      await updateDoc(coachingRef, {
        "subscription.status": "active",
        "subscription.plan": paymentData.planName || "Starter",
        "subscription.endsAt": endsAt.toISOString()
      });

      return res.json({ success: true, message: "Simulated payment succeeded" });
    } catch (err: any) {
      console.error("Simulation Payment Complete Error:", err);
      return res.status(500).json({ error: "Failed to simulate payment" });
    }
  });

  // Webhook Receiver with signature verification
  app.post("/api/cashfree/webhook", async (req: any, res: any) => {
    const rawBody = req.rawBody || "";
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;

    console.log("Cashfree Webhook received headers:", { signature, timestamp });

    if (!signature || !timestamp) {
      console.error("Webhook verification error: Missing signature or timestamp header");
      return res.status(401).json({ error: "Missing x-webhook-signature or x-webhook-timestamp headers" });
    }

    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientSecret) {
      console.error("CASHFREE_CLIENT_SECRET environment variable is missing on server");
      return res.status(500).json({ error: "Cashfree client secret is not configured" });
    }

    // Verify webhook authenticity
    const payloadToSign = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac("sha256", clientSecret)
      .update(payloadToSign)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("Webhook signature mismatch!", { signature, expectedSignature });
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    try {
      const webhookData = JSON.parse(rawBody);
      console.log("Parsed Webhook event:", webhookData.event);

      const eventType = webhookData.event;
      const orderId = webhookData.data?.order?.order_id;
      const cfPaymentId = webhookData.data?.payment?.cf_payment_id;

      if (!orderId) {
        return res.status(400).json({ error: "Missing order_id in webhook data" });
      }

      // Webhook Idempotency check: prevent processing same transaction again
      const idempotencyKey = `${orderId}_${cfPaymentId || "refund"}_${eventType}`;
      const idempotencyRef = doc(db, "processed_webhooks", idempotencyKey);
      const idempotencyDoc = await getDoc(idempotencyRef);

      if (idempotencyDoc.exists()) {
        console.log(`Duplicate webhook event ignored (idempotency): ${idempotencyKey}`);
        return res.status(200).json({ status: "ignored", message: "Duplicate event already processed" });
      }

      // Fetch payment record
      const paymentRef = doc(db, "payments", orderId);
      const paymentDoc = await getDoc(paymentRef);

      if (!paymentDoc.exists()) {
        console.error(`Payment record not found for Order ID: ${orderId}`);
        return res.status(404).json({ error: "Associated payment record not found" });
      }

      const paymentData = paymentDoc.data();

      // Handle Success payment
      if (eventType === "PAYMENT_SUCCESS" || eventType === "ORDER_PAID") {
        // Update payment status
        await updateDoc(paymentRef, {
          status: "success",
          cashfreePaymentId: cfPaymentId ? String(cfPaymentId) : "",
          paymentMethod: webhookData.data?.payment?.payment_method || {},
          updatedAt: new Date().toISOString(),
          webhookResponse: webhookData
        });

        // Update coaching subscription to active
        const coachingRef = doc(db, "coachings", paymentData.coachingId);
        const durationDays = paymentData.planName?.toLowerCase().includes("annual") ? 365 : 30;
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + durationDays);

        await updateDoc(coachingRef, {
          "subscription.status": "active",
          "subscription.plan": paymentData.planName || "Starter",
          "subscription.endsAt": endsAt.toISOString()
        });

        console.log(`Coaching ${paymentData.coachingId} subscription activated for plan ${paymentData.planName}`);

      } else if (eventType === "PAYMENT_FAILED" || eventType === "ORDER_FAILED") {
        // Update payment status to failed
        await updateDoc(paymentRef, {
          status: "failed",
          updatedAt: new Date().toISOString(),
          webhookResponse: webhookData
        });
        console.log(`Payment failed for Order ID: ${orderId}`);

      } else if (eventType === "REFUND_SUCCESSFUL") {
        // Handle refunds gracefully
        await updateDoc(paymentRef, {
          status: "refunded",
          updatedAt: new Date().toISOString(),
          refundResponse: webhookData
        });
        
        // Optionally expire subscription if fully refunded
        const coachingRef = doc(db, "coachings", paymentData.coachingId);
        await updateDoc(coachingRef, {
          "subscription.status": "expired"
        });
        console.log(`Refund successfully processed. Expired subscription for coaching ${paymentData.coachingId}`);
      }

      // Record idempotency token so we never reprocess
      await setDoc(idempotencyRef, {
        processedAt: new Date().toISOString(),
        eventType,
        orderId,
        cfPaymentId: cfPaymentId ? String(cfPaymentId) : ""
      });

      return res.status(200).json({ status: "success", message: "Webhook processed" });

    } catch (err: any) {
      console.error("Webhook processing error:", err);
      return res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  // Vite development middleware or production static site server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
