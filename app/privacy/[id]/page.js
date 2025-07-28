import Link from "next/link";

async function getApp(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  const data = await res.json();
  return data.data || null;
}

export default async function PrivacyPolicy({ params }) {
  const app = await getApp(params.id);

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            App Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The app you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Browse Our Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Policy Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-10">
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="pt-10 bg-gray-100 mx-auto text-center">
            <h1 className="text-4xl text-teal-600 font-bold mb-2">{app.name}</h1>
            <p className="text-xl text-gray-500">Privacy Policy</p>
          </div>
          {/* App Image */}
          <div className="bg-gray-100 flex items-center justify-center p-8">
            <img
              src={app.image}
              alt={app.name}
              className="max-h-60 object-contain"
            />
          </div>

          {/* Policy Content */}
          <div className="p-8 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-teal-600">
                Privacy Policy - {app.name} App
              </h2>
              <Link
                href={`/apps/${params.id}`}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to App
              </Link>
            </div>

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: app.privacy.replace(/\n/g, "<br>"),
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>

          <Link
            href={`/apps/${params.id}`}
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
            View App Details
          </Link>
        </div>
      </div>
    </div>
  );
}
