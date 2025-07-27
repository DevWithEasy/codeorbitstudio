import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/libs/auth';

async function getApps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const apps = await getApps();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen">
      {/* Admin Header Bar */}
      {isAdmin && (
        <div className="bg-gray-800 text-white py-2 px-4 flex justify-end">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, Admin</span>
            <Link 
              href="/admin/dashboard"
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/api/auth/signout"
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </Link>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="bg-blue-600 text-white py-20 relative">
        {/* Admin Login Button (only shows when not logged in) */}
        {!isAdmin && (
          <div className="absolute top-4 right-4">
            <Link 
              href="/admin/login"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100"
            >
              Admin Login
            </Link>
          </div>
        )}

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">CodeOrbitStudio</h1>
          <p className="text-xl mb-8">Professional App Development Team from Bangladesh</p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
            Explore Our Apps
          </button>
        </div>
      </div>

      {/* Apps Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Applications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={app.image} 
                alt={app.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                <p className="text-gray-600 mb-4">{app.shortDescription}</p>
                <div className="flex justify-between">
                  <Link 
                    href={`/apps/${app._id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    {app.playStore_url && (
                      <a 
                        href={app.playStore_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        Play Store
                      </a>
                    )}
                    {app.appStore_url && (
                      <a 
                        href={app.appStore_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        App Store
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}