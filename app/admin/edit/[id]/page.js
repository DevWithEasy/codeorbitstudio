'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg bg-gray-50 p-4 min-h-[200px] flex items-center justify-center">
      <span className="text-gray-500">Loading editor...</span>
    </div>
  ),
});

export default function EditApp({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    features: '',
    privacy: '',
    playStore_url: '',
    appStore_url: '',
    shortDescription: '',
    currentImage: '',
    currentPublicId: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchApp();
    }
  }, [status, router, params.id]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const fetchApp = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch app');
      }

      if (data.success) {
        setFormData({
          name: data.data.name,
          features: data.data.features,
          privacy: data.data.privacy,
          playStore_url: data.data.playStore_url,
          appStore_url: data.data.appStore_url,
          shortDescription: data.data.shortDescription,
          currentImage: data.data.image,
          currentPublicId: data.data.imagePublicId,
        });
      }
    } catch (error) {
      setError(error.message || 'Error loading app data');
      console.error('Error fetching app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setImage(file);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleFeaturesChange = (html) => {
    setFormData(prev => ({ ...prev, features: html }));
  };

  const handlePrivacyChange = (html) => {
    setFormData(prev => ({ ...prev, privacy: html }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('features', formData.features);
      formDataToSend.append('privacy', formData.privacy);
      formDataToSend.append('playStore_url', formData.playStore_url);
      formDataToSend.append('appStore_url', formData.appStore_url);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('currentImage', formData.currentImage);
      formDataToSend.append('currentPublicId', formData.currentPublicId);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update app');
      }

      if (data.success) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700">Loading app data...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit App</h1>
            <p className="text-gray-600">Update your application details</p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">App Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
                {formData.currentImage && (
                  <div className="mb-4">
                    <img
                      src={formData.currentImage}
                      alt="Current App"
                      className="h-40 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Image (Leave blank to keep current)
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="pt-1 text-sm text-gray-600">
                            {image ? image.name : 'Upload a new image'}
                          </p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="opacity-0" 
                        />
                      </label>
                    </div>
                  </div>
                  {preview && (
                    <div className="flex-shrink-0">
                      <div className="h-32 w-32 rounded-lg overflow-hidden border border-gray-200">
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features *</label>
                <TiptapEditor
                  content={formData.features}
                  onChange={handleFeaturesChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy *</label>
                <TiptapEditor
                  content={formData.privacy}
                  onChange={handlePrivacyChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Play Store URL *</label>
                  <input
                    type="url"
                    name="playStore_url"
                    value={formData.playStore_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">App Store URL *</label>
                  <input
                    type="url"
                    name="appStore_url"
                    value={formData.appStore_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400 transition-colors duration-200 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                    </svg>
                    Update App
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}