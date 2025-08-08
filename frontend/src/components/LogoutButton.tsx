// components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout}>
      ログアウト
    </Button>
  );
};

export default LogoutButton;