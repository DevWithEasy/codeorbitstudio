import Link from 'next/link';

async function getApp(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  const data = await res.json();
  return data.data || null;
}

export default async function PrivacyPolicy({ params }) {
  const app = await getApp(params.id);

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">App not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={app.image} 
            alt={app.name} 
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{app.name} - Privacy Policy</h1>
              <Link 
                href={`/apps/${params.id}`}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to App
              </Link>
            </div>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: app.privacy.replace(/\n/g, '<br>') }} />
          </div>
        </div>
      </div>
    </div>
  );
}