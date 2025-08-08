//route/index.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import UploadView from '../pages/UploadView';
import DisplayView from '../pages/DisplayView';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout';

import Login from '../pages/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login-sample"
        element={
            <Login />
        }
      />
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/upload-view"
        element={
          <ProtectedRoute>
            <Layout>
              <UploadView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/display-view"
        element={
          <ProtectedRoute>
            <Layout>
              <DisplayView />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
