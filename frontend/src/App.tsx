import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes'; // ← ルーティング定義ファイルへ

const App = () => {
  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
};

export default App;
