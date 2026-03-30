import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth);

  
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-secondary font-medium animate-pulse">Verifying Session...</p>
      </div>
    );
  }

  
  
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && user && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;