"use client";

import Toast from "@/components/Toast";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { showToast } from "@/utils/toast";

function maskMobileNumber(mobile: string) {
  // Mask all but last 4 digits
  if (!mobile) return "";
  const visible = mobile.slice(-4);
  return "+91 ****" + visible;
}

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const apiCalledRef = useRef(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [requestId, setRequestId] = useState("");
  // Check for missing ID in the URL

  // const url = Array.isArray(params?.id) ? params.id.join('') : params?.id ?? '';
  // const decodedUrl = decodeURIComponent(url);
  // let parts = decodedUrl?.split("&code=");

  const id = params?.id as string | undefined;
  // const id = parts?.[0] as string | undefined;
  // const code = parts?.[1];

  if (!id) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4 px-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-700 px-4">
            There is something went wrong kindly check the SMS or link again.
          </p>
        </div>
      </main>
    );
  }

  useEffect(() => {
    window && window?.sessionStorage.clear();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (apiCalledRef.current) return; // Prevent multiple API calls
      apiCalledRef.current = true;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/customer?request=${id}`
        );

        let data;
        if (!res.ok) {
          // Try to parse the error response
          try {
            data = await res.json();
            if (
              data.error &&
              data.errorDetails?.includes(
                "Link is invalid or expired, contact your dealer."
              )
            ) {
              setExpired(true);
              setError("Link is invalid or expired, Contact your dealer.");
            } else {
              setError(
                "Something went wrong. Kindly check the SMS or link again."
              );
            }
          } catch (parseErr) {
            // If parsing fails, fallback to generic error
            setError(
              "Something went wrong. Kindly check the SMS or link again."
            );
          }
          setMobile("");
          return;
        }

        data = await res.json();
        if (!data.mobileNumber) {
          setError(
            "There is something went wrong kindly check the SMS or link again."
          );
          setMobile("");
        } else {
          setMobile(data.mobileNumber);
          window && window?.sessionStorage.setItem("mno", data.mobileNumber);
          // window && window?.sessionStorage.setItem('code', code);
          setRequestId(data.requestId);
        }
      } catch (err) {
        setError("Something went wrong. Kindly check the SMS or link again.");
        setMobile("");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-700">Loading...</p>
        </div>
      </main>
    );
  }
  if (error || !mobile) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4 px-4">
            Something went wrong
          </h1>
          <p className="text-gray-700 px-4">
            {expired
              ? "Link is invalid or expired, Contact your dealer."
              : "There is something went wrong kindly check the SMS or link again."}
          </p>
        </div>
      </main>
    );
  }

  const handleVerify = async () => {
    try {
      setSendingOtp(true);
      // const res = await fetch( `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/verification/send?code=${code}`, {
      const res = await fetch(
        `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/verification/send`,
        {
          method: "POST",
          body: JSON.stringify({ requestId: id }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to send OTP");

      // Store requestId in sessionStorage for use in verification page
      window && window?.sessionStorage.setItem("requestId", requestId);
      showToast("OTP Sent Successfully", "success");
      router.push("/verification");
    } catch (err) {
      // setError('Failed to send OTP. Please try again.');
      showToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <main className="flex flex-col items-center aspect[1/1]">
      <div className="relative w-full aspect-[1/1]">
        <Image
          src="/bajaj-70-years.jpg"
          alt="Bajaj 70 Years"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center mt-7 mb-7">
        <h1 className="text-[26px] font-[600] text-[#0B6636]">
          Thank you for booking
        </h1>
      </div>

      <div className="text-center">
        <p className="text-[#121212] text-[16px] font-[500]">
          Please click on continue to upload your documents.
        </p>
      </div>

      <div className="text-center fixed bottom-10 w-full px-4 max-w-md">
        <p className="text-[14px] text-[#767676] mb-4">
          {loading
            ? "Loading..."
            : error
            ? error
            : `We will send an OTP on ${maskMobileNumber(mobile)}`}
        </p>

        <button
          onClick={handleVerify}
          disabled={sendingOtp}
          className={`w-[90%] bg-[#006AD0] text-white py-3 rounded-[4px] ${
            sendingOtp ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {sendingOtp ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </main>
  );
}
