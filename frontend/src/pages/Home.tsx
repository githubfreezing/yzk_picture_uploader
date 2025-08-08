//pages/Home.tsx
import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Home = () => {  
  console.log('#####URL#####', `${apiBaseUrl}/login`);

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('ログイン試行中：', email);

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('サーバーエラー');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'サーバーエラー');
      }

      console.log('サーバー応答:', data.message);
      alert(`ログイン成功：${data.message}`);
      //ログイン情報の保存
      localStorage.setItem('token', data.token); // ← トークン保存
      console.log('トークン:', data.token);
      navigate('/upload-view'); // ✅ ログイン成功した場合に遷移

    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログイン失敗：エラーが発生しました');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={0} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          ログイン
        </Typography>

        <TextField
          label="メールアドレス"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          ログイン
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
