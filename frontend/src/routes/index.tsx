import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import UploadView from '../pages/UploadView';
import DisplayView from '../pages/DisplayView.tsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload-view" element={<UploadView />} />
      <Route path="/display-view" element={<DisplayView />} />
    </Routes>
  );
};

export default AppRoutes;