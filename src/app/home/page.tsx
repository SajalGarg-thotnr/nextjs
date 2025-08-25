'use client';

export default function HomeError() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-700 px-6">There is something went wrong kindly check the SMS or link again.</p>
      </div>
    </main>
  );
} 