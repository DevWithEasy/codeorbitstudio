import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/libs/auth';

async function getApps() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts`);

  if (!res.ok) {
    console.error('Failed to fetch posts:', res.status, res.statusText);
    return [];
  }

  try {
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return [];
  }
}

export default async function Home() {
  const apps = await getApps();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-3 px-6 shadow-md">
          <div className="container mx-auto flex justify-end">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium">Welcome, {session.user?.name || 'Admin'}</span>
              <Link 
                href="/admin/dashboard"
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Dashboard
              </Link>
              <Link 
                href="/api/auth/signout"
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-center"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">CodeOrbitStudio</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional App Development Team from Bangladesh creating innovative digital solutions
          </p>
          <Link 
            href="#apps" 
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Explore Our Apps
          </Link>
        </div>
      </div>

      {/* Apps Section */}
      <section id="apps" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Applications</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our portfolio of innovative mobile applications designed to enhance your digital experience.
            </p>
          </div>
          
          {apps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No apps available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {apps.map((app) => (
                <div 
                  key={app._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={app.image} 
                      alt={app.name} 
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{app.name}</h3>
                    <p className="text-gray-600 mb-5 line-clamp-2">{app.shortDescription}</p>
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/apps/${app._id}`} 
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        View Details →
                      </Link>
                      <div className="flex space-x-3">
                        {app.playStore_url && (
                          <a 
                            href={app.playStore_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-700 transition-colors duration-200"
                            aria-label="Available on Play Store"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                            </svg>
                          </a>
                        )}
                        {app.appStore_url && (
                          <a 
                            href={app.appStore_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            aria-label="Available on App Store"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.1 12.6v-1.8c1.4-.6 2.4-2 2.4-3.6 0-2.1-1.7-3.8-3.8-3.8-1.8 0-3.3 1.2-3.8 2.8h-1.8c.5-2.4 2.5-4.2 5-4.2 2.8 0 5 2.2 5 5 0 2.3-1.5 4.2-3.6 4.8zm-2.4-2.2v1.8c1.4.6 2.4 2 2.4 3.6 0 2.1-1.7 3.8-3.8 3.8-1.8 0-3.3-1.2-3.8-2.8h-1.8c.5 2.4 2.5 4.2 5 4.2 2.8 0 5-2.2 5-5 0-2.3-1.5-4.2-3.6-4.8zm-1.2-3.6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4.2 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">CodeOrbitStudio</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Professional app development team creating innovative digital solutions for businesses and individuals.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CodeOrbitStudio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}