// components/Layout.tsx
import { AppBar, Toolbar, Container, Button, Stack, Box } from '@mui/material';
import LogoutButton from './LogoutButton';
import { Link as RouterLink } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              to="/upload-view"
              variant="outlined"
              color="primary"
            >
              アップロード画面
            </Button>
            <Button
              component={RouterLink}
              to="/display-view"
              variant="outlined"
              color="primary"
            >
              表示画面
            </Button>
          </Stack>
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',    // 横方向の中央寄せ
            // justifyContent: 'center', // 縦方向の中央寄せ
            minHeight: '80vh',        // 画面の高さに応じて調整
          }}
        >
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Layout;

// // components/Layout.tsx
// import { AppBar, Toolbar, Box, Container, Button, Stack } from '@mui/material';
// import LogoutButton from './LogoutButton';
// import { Link as RouterLink } from 'react-router-dom';

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <>
//       <AppBar position="fixed" color="default" elevation={1}>
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           {/* 左側のナビゲーションリンク */}
//           <Stack direction="row" spacing={2}>
//             <Button
//               component={RouterLink}
//               to="/upload-view"
//               variant="outlined"
//               color="primary"
//             >
//               アップロード画面
//             </Button>
//             <Button
//               component={RouterLink}
//               to="/display-view"
//               variant="outlined"
//               color="primary"
//             >
//               表示画面
//             </Button>
//           </Stack>

//           {/* 右側のログアウトボタン */}
//           <LogoutButton />
//         </Toolbar>
//       </AppBar>

//       {/* AppBar の高さ分のスペース確保 */}
//       <Toolbar />

//       <Container sx={{ mt: 4 }}>
//         {children}
//       </Container>
//     </>
//   );
// };

// export default Layout;
