import Link from 'next/link';

export default function SomethingWentWrong() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Something Went Wrong</h1>
      <p className="text-gray-600 mb-6">An unexpected error has occurred. Please try again later.</p>
      <Link href="/home">
        <button className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Go to Home</button>
      </Link>
    </div>
  );
} 