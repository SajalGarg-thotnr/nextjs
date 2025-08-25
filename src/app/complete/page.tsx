'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Complete() {
  const router = useRouter();
  useEffect(() => {
    // Check if requestId and codeID exist in sessionStorage
    const requestId = window && window?.sessionStorage.getItem('requestId');
    // const code = window && window?.sessionStorage.getItem('code');

    // if (requestId && code) {
      if (requestId) {
      // Set timeout to redirect after 15 seconds
      const timeout = setTimeout(() => {
        // router.push('/'); 
        // router.replace(`/home/${requestId}&code=${code}`);
        router.replace(`/home/${requestId}`);
      }, 15000); // 15 seconds in milliseconds

      // Clean up the timeout on component unmount
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    // <main className="min-h-screen p-8">
    //   <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
    //     <div className="mb-6">
    //       <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
    //         <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    //         </svg>
    //       </div>
    //     </div>
        
    //     <h1 className="text-3xl font-bold text-gray-900 mb-4">
    //       Application Complete!
    //     </h1>
        
    //     <p className="text-lg text-gray-600 mb-8">
    //       Thank you for completing your application. We have received your documents and will process them shortly.
    //     </p>

        

        
    //   </div>
    // </main>
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center text-center mt-[-50px]">
        <div>
          <Image
            src="/successIcon.png"
            alt="Success"
            width={300}
            height={300}
            priority
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="mt-[-50px] text-[30px] font-[500] text-[#4E4E4E] mb-4">Thank you!</h1>
        <p className="text-[16px] text-[#595959] font-[400]">Your documents have been<br></br>uploaded successfully.</p>
      </div>
    </main>
  )
}
