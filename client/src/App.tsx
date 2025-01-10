import { AuthProvider } from './contexts';
import { BrowserRouter as Router } from 'react-router-dom';
// import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from './components';
import { AppRoutes } from './routes';

export const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};
