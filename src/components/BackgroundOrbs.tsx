import React from "react";

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Light Mode Orbs */}
      <div className="absolute -top-[15%] -left-[15%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/15 rounded-full blur-[100px] md:blur-[140px] transition-all duration-700" />
      <div className="absolute -bottom-[15%] -right-[15%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-600/15 rounded-full blur-[100px] md:blur-[140px] transition-all duration-700" />
      <div className="absolute top-[40%] left-[30%] w-[60%] h-[60%] bg-purple-300/10 dark:bg-purple-600/10 rounded-full blur-[120px] md:blur-[160px] transition-all duration-700" />
      <div className="absolute top-[10%] right-[20%] w-[35%] h-[35%] bg-pink-300/5 dark:bg-pink-600/5 rounded-full blur-[100px] transition-all duration-700" />
    </div>
  );
};
