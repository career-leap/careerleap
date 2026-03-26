import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ApiTest() {
  const [status, setStatus] = useState('Testing connection...');
  const [users, setUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setStatus('✅ Backend connected!');
        setUsers(data.users || 0);
        setLoading(false);
      } catch (err) {
        console.error('Connection error:', err);
        setStatus(`❌ Error: ${err.message}`);
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className={`p-4 rounded-lg ${
        loading ? 'bg-yellow-100 text-yellow-800' :
        status.includes('✅') ? 'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800'
      }`}>
        <h3 className="font-bold">Backend Connection Test</h3>
        <p>{status}</p>
        {!loading && status.includes('✅') && <p>Users in database: {users}</p>}
        <p className="text-xs opacity-75 mt-2">API URL: {API_URL}</p>
      </div>
    </div>
  );
}