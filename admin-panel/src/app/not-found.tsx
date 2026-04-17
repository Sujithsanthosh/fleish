'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-emerald-600">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  );
}
