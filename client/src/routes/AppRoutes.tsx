import { Routes, Route } from 'react-router-dom';
import { PublicRoutes } from './PublicRoute';

export const AppRoutes = () => {
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};