import Link from "next/link";

async function getApp(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  const data = await res.json();
  return data.data || null;
}

export default async function AppDetails({ params }) {
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
            <h1 className="text-3xl font-bold mb-4">{app.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{app.shortDescription}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {app.playStore_url && (
                <a 
                  href={app.playStore_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <span>Get on Play Store</span>
                </a>
              )}
              {app.appStore_url && (
                <a 
                  href={app.appStore_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <span>Download on App Store</span>
                </a>
              )}
              <Link 
                href={`/privacy/${params.id}`}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
              >
                <span>Privacy Policy</span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: app.features.replace(/\n/g, '<br>') }} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: app.privacy.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}