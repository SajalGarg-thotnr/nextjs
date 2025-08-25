"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

export default function CustomerConcent() {
  const router = useRouter();
  const [isConsented, setIsConsented] = useState(false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if we have the required data
    const token = window && window?.sessionStorage.getItem("jwtToken");
    const requestId = window && window?.sessionStorage.getItem("requestId");

    if (!token || !requestId) {
      router.push("/home");
      return;
    }
  }, [router]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isConsented) {
      setError("Please accept the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = window && window?.sessionStorage.getItem("jwtToken");
      const requestId = window && window?.sessionStorage.getItem("requestId");
      // const code = window && window?.sessionStorage.getItem('code');

      if (!token || !requestId) {
        throw new Error("Missing required data");
      }

      console.log("Submitting consent with:", {
        consentCheckbox: isConsented,
        whatsappToggle: whatsappUpdates,
        smsToggle: smsUpdates,
        requestId,
        token,
      });

      // const response = await fetch(`https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/concent?code=${code}`, {
      const response = await fetch(
        `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/concent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            requestId,
          },
          body: JSON.stringify({
            // jwtToken: token,
            // requestId
            consentCheckbox: isConsented,
            whatsappToggle: whatsappUpdates,
            smsToggle: smsUpdates,
          }),
        }
      );

      // const data = await response.json();

      if (!response.ok) {
        // throw new Error(data.error || 'Failed to submit consent');
      }


      showToast('Consent submitted successfully', 'success');
      // Store consent status in session storage
      window && window?.sessionStorage.setItem("consentSubmitted", "true");
      router.push("/upload");
    } catch (error) {
      showToast(
        "Error in Submitting Consent, Try Again after sometime",
        "error"
      );
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit consent. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 pb-20 space-y-6">
      <h1 className="text-2xl font-medium text-[#393F3C]">Consent Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-sm text-[#595959] font-[400] text-[14px] space-y-4">
          <p>
            Bajaj Auto Limited (hereinafter referred to as "We" or "Us" or
            "Organisation" or "BAL") collects and processes personal data with
            respect to the communication provided by us. From time to time, we
            share the information with other service providers for Registration,
            loan and other related services. For more details, kindly refer our{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </p>

          <div className="space-y-2">
            <h2 className="font-medium text-gray-800">
              Documents for ID Proof
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aadhar card</li>
              <li>Pan card</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-gray-800">
              Documents for Address Proof (Any Two)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aadhar Card</li>
              <li>Light Bill</li>
              <li>Telephone Bill</li>
              <li>Passport</li>
              <li>Home Tax Receipt</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-gray-800">
              Document for Rented Address Proof
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Registered rent agreement</li>
              <li>Owner's Light Bill</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 pt-4">
            <input
              type="checkbox"
              id="consent"
              checked={isConsented}
              onChange={(e) => {
                setIsConsented(e.target.checked);
                setError("");
              }}
              className="mt-1 scale-[1.7]"
            />
            <label htmlFor="consent" className="text-sm">
              I authorise and consent to BAL, its representatives and
              third-party service providers to collect, use and disclose my PII
              for providing me with requested services relating to BAL and its
              products.
            </label>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#006AD0] text-white py-3 rounded-[4px] ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {/* Toggle buttons for WhatsApp and SMS consent */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg">Receive updates via Whatsapp</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg">Receive updates via SMS</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsUpdates}
                onChange={(e) => setSmsUpdates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>
      </form>
    </main>
  );
}
