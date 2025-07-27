'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchApps();
    }
  }, [status, router]);

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      const data = await response.json();
      if (data.success) {
        setApps(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this app?')) {
      try {
        const response = await fetch(`/api/admin/posts/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          fetchApps();
        }
      } catch (error) {
        console.error('Error deleting app:', error);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="space-x-4">
            <Link
              href="/admin/create"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add New App
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    App Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apps.map((app) => (
                  <tr key={app._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link
                        href={`/admin/edit/${app._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/apps/${app._id}`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}