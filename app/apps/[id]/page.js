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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">App Not Found</h1>
          <p className="text-gray-600 mb-6">The app you're looking for doesn't exist or may have been removed.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Browse Our Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* App Details */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* App Image */}
          <div className="bg-gray-100 flex items-center justify-center p-8">
            <img 
              src={app.image} 
              alt={app.name} 
              className="max-h-80 object-contain"
            />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{app.name}</h1>
            <p className="text-xl opacity-90">{app.shortDescription}</p>
          </div>

          {/* App Content */}
          <div className="p-8">
            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              {app.playStore_url && (
                <a 
                  href={app.playStore_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                  </svg>
                  <span>Get on Play Store</span>
                </a>
              )}
              {app.appStore_url && (
                <a 
                  href={app.appStore_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.1 12.6v-1.8c1.4-.6 2.4-2 2.4-3.6 0-2.1-1.7-3.8-3.8-3.8-1.8 0-3.3 1.2-3.8 2.8h-1.8c.5-2.4 2.5-4.2 5-4.2 2.8 0 5 2.2 5 5 0 2.3-1.5 4.2-3.6 4.8zm-2.4-2.2v1.8c1.4.6 2.4 2 2.4 3.6 0 2.1-1.7 3.8-3.8 3.8-1.8 0-3.3-1.2-3.8-2.8h-1.8c.5 2.4 2.5 4.2 5 4.2 2.8 0 5-2.2 5-5 0-2.3-1.5-4.2-3.6-4.8zm-1.2-3.6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4.2 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                  </svg>
                  <span>Download on App Store</span>
                </a>
              )}
              <Link 
                href={`/privacy/${params.id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                <span>Privacy Policy</span>
              </Link>
            </div>

            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Key Features</h2>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: app.features.replace(/\n/g, '<br>') }} 
              />
            </div>

            {/* Privacy Policy Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Privacy Policy</h2>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: app.privacy.replace(/\n/g, '<br>') }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back to Apps Link */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to All Apps
        </Link>
      </div>
    </div>
  );
}