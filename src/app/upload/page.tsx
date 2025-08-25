"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  description?: string;
  file: File | null;
  setFile: (file: File | null) => void;
  allowedTypes: string[];
  maxSize: number;
  documentType: string;
  fileType: string;
  onUpload?: (file: File) => Promise<void>;
}

function FileUpload({
  label,
  description,
  file,
  setFile,
  allowedTypes,
  maxSize,
  documentType,
  fileType,
  onUpload,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedTypes.includes(fileExt)) {
      showToast(
        `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
        "error"
      );
      return;
    }

    if (selectedFile.size > maxSize * 1024 * 1024) {
      showToast(`File too large. Max ${maxSize}MB allowed.`, "error");
      return;
    }

    setFile(selectedFile);

    if (onUpload) {
      setUploading(true);
      try {
        await onUpload(selectedFile);
      } catch (error) {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative border-2 border-dashed rounded-[4px] p-4 flex flex-col items-center justify-center min-h-[120px]">
      {file ? (
        <div className="w-full flex flex-col items-center">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-20 object-contain mb-2"
            />
          ) : (
            <div className="flex flex-col items-center mb-2">
              <span className="text-2xl">📄</span>
              <span className="text-xs mt-1">{file.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <label className="flex flex-col items-center cursor-pointer w-full">
            <Image
              src="/uploadIcon.png"
              alt="stepper"
              width={30}
              height={30}
              priority
              className="mb-2"
            />

            <span className="text-sm text-gray-500 font-[400] mb-1">
              {label}
            </span>
            {description && (
              <span className="text-xs text-gray-400 text-center">
                {description}
              </span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={allowedTypes.map((ext) => `.${ext}`).join(",")}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <span className="text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
}

export default function DocumentUpload() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  const [panNumber, setPanNumber] = useState("");
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadharFrontId, setAadharFrontId] = useState("");
  const [aadharBackId, setAadharBackId] = useState("");
  const [panFileId, setPanFileId] = useState("");

  const [houseType, setHouseType] = useState<"owned" | "rented">("owned");
  const [addressDocType, setAddressDocType] = useState("");
  const [addressDocFile, setAddressDocFile] = useState<File | null>(null);
  const [addressDocId, setAddressDocId] = useState("");
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [rentAgreementId, setRentAgreementId] = useState("");
  const [ownerLightBill, setOwnerLightBill] = useState<File | null>(null);
  const [ownerLightBillId, setOwnerLightBillId] = useState("");

  // Fetch document requirements
  useEffect(() => {
    // const code = window && window?.sessionStorage.getItem('code');
    const requestId = window && window?.sessionStorage.getItem("requestId");
    // if (!code || !requestId) {
    if (!requestId) {
      setError("Missing required session data");
      setLoading(false);
      return;
    }

    fetch(
      `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/upload`,
      {
        headers: { "Content-Type": "application/json", requestId },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPageData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load document requirements");
        setLoading(false);
      });
  }, []);

  // Update the file upload handler
  const handleFileUpload = async (
    file: File,
    documentType: string,
    fileType: string
  ): Promise<string> => {
    // const code = window && window?.sessionStorage.getItem('code');
    const requestId = window && window?.sessionStorage.getItem("requestId");

    // if (!code || !requestId) {
    if (!requestId) {
      throw new Error("Missing required session data");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/file-upload`,
      {
        method: "POST",
        headers: {
          requestId: requestId,
          documentType: documentType,
          fileType: fileType,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      showToast(error || "Upload failed", "error");
      throw new Error(error);
    }

    const data = await res.json();
    showToast("File uploaded successfully", "success");
    return data.requestId; // Use requestId from response
  };

  // Validate inputs and proceed to step 2
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Aadhaar format check (fallback if API doesn't provide regex)
    const defaultAadhaarPattern = "^[2-9]{1}[0-9]{3}\\s?[0-9]{4}\\s?[0-9]{4}$";
    let aadhaarRegex: RegExp;
    try {
      aadhaarRegex = new RegExp(aadharDoc?.regex || defaultAadhaarPattern);
    } catch {
      aadhaarRegex = new RegExp(defaultAadhaarPattern);
    }
    if (!aadharNumber || !aadhaarRegex.test(aadharNumber.trim())) {
      showToast("Please enter a valid Aadhaar number", "error");
      return;
    }

    // PAN format check (fallback if API doesn't provide regex)
    const defaultPanPattern = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
    let panRegex: RegExp;
    try {
      panRegex = new RegExp(panDoc?.regex || defaultPanPattern);
    } catch {
      panRegex = new RegExp(defaultPanPattern);
    }
    if (!panNumber || !panRegex.test(panNumber.trim().toUpperCase())) {
      showToast("Please enter a valid PAN number", "error");
      return;
    }

    // Validate required uploads
    if (!aadharFrontId || !aadharBackId || !panFileId) {
      showToast("Please upload all required ID proof documents", "error");
      return;
    }

    setStep(2);
  };

  // Handle final submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const code = window && window?.sessionStorage.getItem('code');
    const requestId = window && window?.sessionStorage.getItem("requestId");

    if (!requestId) {
      showToast("Missing session data", "error");
      return;
    }

    // Validate step 2 data
    if (houseType === "owned") {
      if (!addressDocType || !addressDocId) {
        showToast("Please select and upload address proof document", "error");
        return;
      }
    } else {
      if (!rentAgreementId || !ownerLightBillId) {
        showToast(
          "Please upload both rent agreement and owner's light bill",
          "error"
        );
        return;
      }
    }

    try {
      setLoading(true);

      // Submit both steps data together
      const payload = {
        requestId,
        idProof: {
          aadharNumber,
          panNumber,
          documents: {
            aadharFront: aadharFrontId,
            aadharBack: aadharBackId,
            panCard: panFileId,
          },
        },
        addressProof:
          houseType === "owned"
            ? {
                houseType,
                addressDocType,
                documents: {
                  addressProof: addressDocId,
                },
              }
            : {
                houseType,
                documents: {
                  rentAgreement: rentAgreementId,
                  ownerLightBill: ownerLightBillId,
                },
              },
      };

      // Call mock API to submit all data
      const res = await fetch(
        `https://funcapp-bajajoneanddone-dagrdscabkhbd2hf.centralindia-01.azurewebsites.net/api/documents/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            requestId: requestId,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to submit documents");

      showToast("Documents submitted successfully", "success");
      router.push("/complete");
    } catch (error) {
      router.push('/complete');
      showToast('Failed to submit documents. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!pageData) return null;

  // Find document types from API data
  const idProofCollection = pageData.collections.find(
    (c: any) => c.collectionType === "ID_PROOF"
  );
  const addressProofCollection = pageData.collections.find(
    (c: any) => c.collectionType === "ADDRESS_PROOF"
  );
  const rentedProofCollection = pageData.collections.find(
    (c: any) => c.collectionType === "RENTED_ADDRESS_PROOF"
  );

  const aadharDoc = idProofCollection?.documents.find(
    (d: any) => d.documentType === "AADHAR_CARD"
  );
  const panDoc = idProofCollection?.documents.find(
    (d: any) => d.documentType === "PAN_CARD"
  );
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-medium">{pageData.title}</h1>
      <p className="text-gray-600 text-sm">{pageData.instructions}</p>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* ID Proof Step */}
        <div className="flex items-center w-[42%]">
          <div
            className={`flex w-full items-center gap-2 px-1 py-2 flex-col rounded-full border-2 font-medium transition-all text-[15px]
              ${step === 1 ? 'border-blue-500 text-blue-600 bg-white' : step > 1 ? 'border-green-600 text-green-600 bg-white' : 'border-gray-300 text-gray-400 bg-white'}`}
          >
            <span className="inline-flex items-center justify-center w-5 h-5 mr-2 border rounded-full bg-blue-600">
              {step > 1 ? (
                // Green checkmark
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <span className={`font-bold text-[12px] ${step === 1 ? 'text-white' : 'text-gray-400'}`}>1</span>
              )}
            </span>
            ID Proof
          </div>
        </div>
        <span className="text-gray-400 text-xl">
          <Image
            src="/stepperArrow.png"
            alt="stepper"
            width={24}
            height={24}
            priority
          />
        </span>
        {/* Address Proof Step */}
        <div className="flex items-center w-[42%]">
          <div
            className={`flex w-full items-center gap-2 px-1 py-2 flex-col rounded-full border-2 font-medium transition-all  text-[15px]
              ${step === 2 ? 'border-blue-500 text-blue-600 bg-white' : step > 2 ? 'border-green-600 text-green-600 bg-white' : 'border-gray-300 text-gray-400 bg-white'}`}
          >
            <span
              className={`inline-flex items-center justify-center w-5 h-5 mr-2 border rounded-full ${
                step === 2 ? "bg-blue-600" : "bg-white"
              }`}
            >
              {step > 2 ? (
                // Green checkmark
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <span className={`font-bold text-[12px] ${step === 2 ? 'text-white' : 'text-gray-400'}`}>2</span>
              )}
            </span>
            Address Proof
          </div>
        </div>
      </div>

      <form className="space-y-6">
        {step === 1 ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                {aadharDoc?.codeLabel || "Enter Aadhaar Number"}
              </label>
              <input
                type="text"
                // pattern={aadharDoc?.regex || '^[2-9]{1}[0-9]{3}\\s?[0-9]{4}\\s?[0-9]{4}$'}
                placeholder={aadharDoc?.codeHint || "Aadhaar Number"}
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="w-full p-3 border rounded-[4px] mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                {aadharDoc?.requiredFiles.map((file: any) =>
                  file.fileType === "FRONT" ? (
                    <FileUpload
                      key="front"
                      label={file.displayName}
                      description={`(max file size ${file.maxFileSizeMB} MB)`}
                      file={aadharFront}
                      setFile={setAadharFront}
                      allowedTypes={file.allowedFileTypes}
                      maxSize={file.maxFileSizeMB}
                      documentType="AADHAR_CARD"
                      fileType="FRONT"
                      onUpload={async (file) => {
                        const requestId = await handleFileUpload(
                          file,
                          "AADHAR_CARD",
                          "FRONT"
                        );
                        setAadharFrontId(requestId);
                      }}
                    />
                  ) : (
                    <FileUpload
                      key="back"
                      label={file.displayName}
                      description={`(max file size ${file.maxFileSizeMB} MB)`}
                      file={aadharBack}
                      setFile={setAadharBack}
                      allowedTypes={file.allowedFileTypes}
                      maxSize={file.maxFileSizeMB}
                      documentType="AADHAR_CARD"
                      fileType="BACK"
                      onUpload={async (file) => {
                        const requestId = await handleFileUpload(
                          file,
                          "AADHAR_CARD",
                          "BACK"
                        );
                        setAadharBackId(requestId);
                      }}
                    />
                  )
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 mt-4">
                {panDoc?.codeLabel || "Enter PAN Number"}
              </label>
              <input
                type="text"
                // pattern={panDoc?.regex || '[A-Z]{5}[0-9]{4}[A-Z]{1}'}
                placeholder={panDoc?.codeHint || "PAN Number"}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full p-3 border rounded-[4px] mb-4"
              />
              {panDoc?.requiredFiles.map((file: any) => (
                <FileUpload
                  key={file.fileType}
                  label={file.displayName}
                  description={`(max file size ${file.maxFileSizeMB} MB)`}
                  file={panFile}
                  setFile={setPanFile}
                  allowedTypes={file.allowedFileTypes}
                  maxSize={file.maxFileSizeMB}
                  documentType="PAN_CARD"
                  fileType="FRONT"
                  onUpload={async (file) => {
                    const requestId = await handleFileUpload(
                      file,
                      "PAN_CARD",
                      "FRONT"
                    );
                    setPanFileId(requestId);
                  }}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleContinue}
                className="bg-[#006AD0] text-white py-3 px-12 rounded-[4px] mx-auto"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* House Type Radio Buttons */}
            <div className="flex gap-4 mb-4">
              {/* {['owned', 'rented'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer select-none transition-all
                    ${houseType === type ? 'border-blue-500 text-blue-600 bg-white' : 'border-gray-300 text-gray-500 bg-white'}`}
                >
                  <span className="relative flex items-center justify-center w-5 h-5 mr-2">
                    <input
                      type="radio"
                      name="houseType"
                      value={type}
                      checked={houseType === type}
                      onChange={() => setHouseType(type as 'owned' | 'rented')}
                      className="appearance-none w-5 h-5 rounded-full border-2 border-current checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
                    />
                    {houseType === type && (
                      <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></span>
                    )}
                  </span>
                  {type === 'owned' ? 'Owned House' : 'Rented House'}
                </label>
              ))} */}
              {rentedProofCollection && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="houseType"
                      value="owned"
                      checked={houseType === "owned"}
                      onChange={() => setHouseType("owned")}
                      className="accent-blue-600 scale-[1.5]"
                    />
                    Owned House
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="houseType"
                      value="rented"
                      checked={houseType === "rented"}
                      onChange={() => setHouseType("rented")}
                      className="accent-blue-600  scale-[1.5]"
                    />
                    Rented House
                  </label>
                </>
              )}
            </div>

            {houseType === "owned" ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Address Proof
                  </label>
                  <select
                    className="w-full p-3 border rounded-[4px]"
                    value={addressDocType}
                    onChange={(e) => setAddressDocType(e.target.value)}
                  >
                    <option value="">Select Document</option>
                    {addressProofCollection?.documents.map((doc: any) => (
                      <option key={doc.documentType} value={doc.documentType}>
                        {doc.documentType
                          .split("_")
                          .map(
                            (word: string) =>
                              word.charAt(0) + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </option>
                    ))}
                  </select>
                </div>
                {addressDocType &&
                  addressProofCollection?.documents
                    .find((doc: any) => doc.documentType === addressDocType)
                    ?.requiredFiles.map((file: any) => (
                      <FileUpload
                        key={file.fileType}
                        label={file.displayName}
                        description={`(max file size ${file.maxFileSizeMB} MB)`}
                        file={addressDocFile}
                        setFile={setAddressDocFile}
                        allowedTypes={file.allowedFileTypes}
                        maxSize={file.maxFileSizeMB}
                        documentType={addressDocType}
                        fileType="DOCUMENT"
                        onUpload={async (file) => {
                          const requestId = await handleFileUpload(
                            file,
                            addressDocType,
                            "DOCUMENT"
                          );
                          setAddressDocId(requestId);
                        }}
                      />
                    ))}
              </>
            ) : (
              <>
                {rentedProofCollection?.documents.map((doc: any) => {
                  const isRentAgreement = doc.documentType === "RENT_AGREEMENT";
                  return doc.requiredFiles.map((file: any) => (
                    <div key={doc.documentType} className="mb-4">
                      <h3 className="text-sm font-medium mb-2">
                        {isRentAgreement
                          ? "Registered Rent Agreement"
                          : "Owner's Light Bill"}
                      </h3>
                      <FileUpload
                        label={file.displayName}
                        description={`(max file size ${file.maxFileSizeMB} MB)`}
                        file={isRentAgreement ? rentAgreement : ownerLightBill}
                        setFile={
                          isRentAgreement ? setRentAgreement : setOwnerLightBill
                        }
                        allowedTypes={file.allowedFileTypes}
                        maxSize={file.maxFileSizeMB}
                        documentType={doc.documentType}
                        fileType="DOCUMENT"
                        onUpload={async (file) => {
                          const requestId = await handleFileUpload(
                            file,
                            doc.documentType,
                            "DOCUMENT"
                          );
                          if (isRentAgreement) {
                            setRentAgreementId(requestId);
                          } else {
                            setOwnerLightBillId(requestId);
                          }
                        }}
                      />
                    </div>
                  ));
                })}
              </>
            )}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#006AD0] text-white py-3 px-12 rounded-[4px] mx-auto"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
