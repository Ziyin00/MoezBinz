import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logout, clearError } from '../store/slices/authSlice';
import { useAuthZustand } from '../hooks/useAuthZustand';

// Example component showing both Redux and Zustand usage
const ExampleUsage: React.FC = () => {
  // Redux usage
  const dispatch = useAppDispatch();
  const { user: reduxUser, isAuthenticated: reduxIsAuthenticated, isLoading: reduxIsLoading } = useAppSelector((state) => state.auth);

  // Zustand usage
  const { user: zustandUser, isAuthenticated: zustandIsAuthenticated, isLoading: zustandIsLoading, login: zustandLogin } = useAuthZustand();

  const handleReduxLogin = async () => {
    try {
      await dispatch(loginUser({ email: 'test@example.com', password: 'password123' })).unwrap();
    } catch (error) {
      console.error('Redux login failed:', error);
    }
  };

  const handleZustandLogin = async () => {
    try {
      await zustandLogin({ email: 'test@example.com', password: 'password123' });
    } catch (error) {
      console.error('Zustand login failed:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">State Management Examples</h1>
      
      {/* Redux Example */}
      <div className="border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Redux Toolkit Example</h2>
        <div className="space-y-4">
          <p>User: {reduxUser ? `${reduxUser.firstName} ${reduxUser.lastName}` : 'Not logged in'}</p>
          <p>Authenticated: {reduxIsAuthenticated ? 'Yes' : 'No'}</p>
          <p>Loading: {reduxIsLoading ? 'Yes' : 'No'}</p>
          <button 
            onClick={handleReduxLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Redux Login
          </button>
          <button 
            onClick={() => dispatch(logout())}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
          >
            Redux Logout
          </button>
        </div>
      </div>

      {/* Zustand Example */}
      <div className="border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Zustand Example</h2>
        <div className="space-y-4">
          <p>User: {zustandUser ? `${zustandUser.firstName} ${zustandUser.lastName}` : 'Not logged in'}</p>
          <p>Authenticated: {zustandIsAuthenticated ? 'Yes' : 'No'}</p>
          <p>Loading: {zustandIsLoading ? 'Yes' : 'No'}</p>
          <button 
            onClick={handleZustandLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Zustand Login
          </button>
          <button 
            onClick={() => useAuthStore.getState().logout()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
          >
            Zustand Logout
          </button>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="border p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Redux Toolkit:</strong> Use for complex state management, time-travel debugging, and when you need predictable state updates.</p>
          <p><strong>Zustand:</strong> Use for simpler state management, when you want less boilerplate, and for component-specific state.</p>
          <p><strong>Recommendation:</strong> Use Redux for global app state (auth, user data) and Zustand for local component state or simple global state.</p>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
