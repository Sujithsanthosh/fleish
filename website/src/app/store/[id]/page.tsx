// Server Component - exports generateStaticParams for static export
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

// Import client component
import StoreDetailClient from './StoreDetailClient';
import { STORE_DATA } from './storeData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { id } = await params;
  const store = STORE_DATA[id];
  
  if (!store) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Store Not Found</h1>
          <p className="text-slate-400">The store you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </main>
    );
  }

  return <StoreDetailClient store={store} />;
}