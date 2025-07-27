'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAdminPage() {
  const [message, setMessage] = useState('Creating admin user...');
  const [credentials, setCredentials] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const createAdmin = async () => {
      try {
        const response = await fetch('/api/admin/create-admin');
        const data = await response.json();
        
        if (data.success) {
          setMessage('Admin created successfully!');
          setCredentials(data.credentials);
        } else {
          setMessage(data.error || 'Failed to create admin');
        }
      } catch (error) {
        setMessage('Error creating admin user');
      }
    };

    createAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Creation</h1>
        
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p className="text-center">{message}</p>
          
          {credentials && (
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <h3 className="font-medium mb-2">Login Credentials:</h3>
              <p>Email: {credentials.email}</p>
              <p>Password: {credentials.password}</p>
              <button
                onClick={() => router.push('/admin/login')}
                className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {message.includes('already exists') && (
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}