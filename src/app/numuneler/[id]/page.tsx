import { getSampleById } from '@/lib/sample-db';
import { notFound } from 'next/navigation';
import SampleDetail from '@/components/numuneler/SampleDetail';
import { Suspense } from 'react';

// Update PageProps to use Promise for params
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Load fallback component
function LoadingFallback() {
  return (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Numune yükleniyor...</p>
    </div>
  );
}

// Error component
function ErrorDisplay() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Hata: Numune Yüklenemedi</h1>
      <p className="text-gray-600">Numune verisi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
    </div>
  );
}

// Update the server component to handle Promise-based params
export default async function SamplePage({ params }: PageProps) {
  // Await the params Promise to get the id
  const resolvedParams = await params;
  
  if (!resolvedParams) {
    return notFound();
  }
  
  const id = resolvedParams.id;
  
  if (!id) {
    return notFound();
  }
  
  try {
    console.log(`Fetching sample with ID: ${id}`);
    
    // Fetch the sample on the server side
    const sample = await getSampleById(id);
    
    // Handle case where sample is not found
    if (!sample) {
      console.log(`Sample with ID ${id} not found`);
      return notFound();
    }
    
    // Pass the pre-fetched data to a client component for rendering with suspense fallback
    return (
      <Suspense fallback={<LoadingFallback />}>
        <SampleDetail sample={sample} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading sample:", error);
    // Return an error state component
    return <ErrorDisplay />;
  }
}
