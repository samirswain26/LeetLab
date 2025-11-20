import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem('authToken', token);
          
          // Fetch user data with the token
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/auth/me`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setAuthUser(data.user);
            toast.success('Login successful!');
            navigate('/dashboard'); // Change to your dashboard route
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthUser]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Authenticating...</h2>
        <p className="text-base-content/60">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;