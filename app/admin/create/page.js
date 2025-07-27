'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(
  () => import('@/components/TiptapEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="border rounded bg-white p-4 min-h-[200px]">
        Loading editor...
      </div>
    )
  }
);

export default function CreateApp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    features: '',
    privacy: '',
    playStore_url: '',
    appStore_url: '',
    shortDescription: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'unauthenticated') {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('features', formData.features);
      formDataToSend.append('privacy', formData.privacy);
      formDataToSend.append('playStore_url', formData.playStore_url);
      formDataToSend.append('appStore_url', formData.appStore_url);
      formDataToSend.append('shortDescription', formData.shortDescription);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Failed to create app');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Create New App</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">App Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">App Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Features</label>
              <TiptapEditor
                content={formData.features}
                onChange={(html) => setFormData({...formData, features: html})}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Privacy Policy</label>
              <TiptapEditor
                content={formData.privacy}
                onChange={(html) => setFormData({...formData, privacy: html})}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Play Store URL</label>
              <input
                type="url"
                name="playStore_url"
                value={formData.playStore_url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">App Store URL</label>
              <input
                type="url"
                name="appStore_url"
                value={formData.appStore_url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Creating...' : 'Create App'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}