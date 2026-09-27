import { useEffect, useState } from 'react';
import api from '../api/axios';

const Home = () => {
  const [healthStatus, setHealthStatus] = useState('Checking API status...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health');
        setHealthStatus(response.data.message);
      } catch (error) {
        setHealthStatus('API Unreachable');
        console.error('Health check failed', error);
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center bg-slate-900 text-slate-50">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-400">Enterprise Intelligence Platform</h1>
      <p className="text-lg md:text-xl text-slate-400">
        Backend Status: <span className="font-semibold text-indigo-300">{healthStatus}</span>
      </p>
    </div>
  );
};

export default Home;
