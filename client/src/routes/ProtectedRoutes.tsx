// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/common/useAuth';
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requireAdmin?: boolean;
// }

// export const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
//   const { user, isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (!isAuthenticated || (requireAdmin && !user?.isAdmin)) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

export {};