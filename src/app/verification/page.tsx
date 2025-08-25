"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

export default function Verification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [requestId, setRequestId] = useState("");
  const [mobile, setmobile] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has requestId in sessionStorage
    const storedRequestId =
      window && window?.sessionStorage.getItem("requestId");
    if (!storedRequestId) {
      // If no requestId, redirect to home
      router.replace("/home");
      return;
    }
    setRequestId(storedRequestId);

    // Check if user is already verified (has JWT token)
    const token = window && window?.sessionStorage.getItem("jwtToken");
    setmobile(window?.sessionStorage.getItem("mno") || "");
    if (token) {
      router.replace("/concent");
      return;
    }

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      setLoading(true);
      setError("");
      // const code = window && window?.sessionStorage.getItem('code');
      const res = await fetch(
        `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/verification/resend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error("Failed to resend OTP");

      // Reset timer
      setResendTimer(30);
      showToast("OTP resend successfully", "success");
    } catch (err) {
      showToast("Failed to resend OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // const code = window && window?.sessionStorage.getItem('code');
      const res = await fetch(
        `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/verification/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId, otp: otpValue }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid OTP");
      }

      const data = await res.json();
      // Store JWT token
      window && window?.sessionStorage.setItem("jwtToken", "jwtToken");
      // Redirect to consent page
      router.replace("/concent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="space-y-2 mt-10">
        <h1 className="text-[22px] font-[#393F3C] font-[600]">
          OTP Verification
        </h1>
        <p className="text-[#595959] font-[400] text-[14px]">
          We have sent a verification code to
        </p>
        <p className="text-[#121212] font-[500] text-[16px]">
          +91 {mobile ? mobile : "****"}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between w-[275px]">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="tel"
              maxLength={1}
              className="w-12 h-12 text-center text-xl font-semibold border border-[#D1D1D1] rounded-[4px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={otp[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              disabled={loading}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-xs flex justify-between">
          <span className="text-[#121212] font-[600]">
            Didn't get the OTP?{" "}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || loading}
            className={`${resendTimer > 0 ? "text-gray-400" : "text-blue-600"}`}
          >
            {resendTimer > 0 ? `Resend SMS in ${resendTimer}s` : "Resend OTP"}
          </button>
        </p>

        <button
          onClick={handleVerify}
          disabled={loading || otp.some((digit) => !digit)}
          className={`w-full bg-[#006AD0] text-white py-3 rounded-[4px] !mt-[40px] ${
            loading || otp.some((digit) => !digit)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </main>
  );
}
