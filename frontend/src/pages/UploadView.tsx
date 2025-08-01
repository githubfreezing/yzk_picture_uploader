import { fetchUserOptions } from '../api/fetchUserOptions';
import type { Country, UserOptions } from '../api/types';

// UploadView.tsx
import {
  Container, Typography, Button, Box, FormControl,
  InputLabel, Select, MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// type Country = '国内' | '海外' | 'イン・ジャパン';

// type UserOptions = {
//   [key in Country]?: {
//     regions?: {
//       [region: string]: string[]
//     },
//     names?: string[]
//   }
// };

const UploadView = () => {
  const [country, setCountry] = useState<Country | ''>('');
  const [region, setRegion] = useState('');
  const [name, setName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<UserOptions>({});

  // useEffect(() => {
  //   fetch(`${apiBaseUrl}/users-list`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("APIエラー");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("取得したユーザー一覧:", data);
  //       setOptions(data);
  //     })
  //     .catch((err) => {
  //       console.error("ユーザー一覧取得エラー:", err);
  //     });
  // }, []);
  useEffect(() => {
    fetchUserOptions()
      .then((data) => {
        console.log("取得したユーザー一覧!!!:", data);
        setOptions(data);
      })
      .catch((err) => {
        console.error("ユーザー一覧取得エラー!!!:", err);
      });
  }, []);

  const handleCountryChange = (e: SelectChangeEvent) => {
    const value = e.target.value as Country;
    setCountry(value);
    setRegion('');
    setName('');
  };

  const getNameOptions = (): string[] => {
    if (!country) return [];
    if (country === 'イン・ジャパン') {
      return options[country]?.names || options[country]?.regions?.['なし'] || [];
    }
    if (region && options[country]?.regions?.[region]) {
      return options[country].regions[region];
    }
    return [];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (!country || !name) {
      alert("国と氏名を選択してください");
      return;
    }
    if (selectedFiles.length === 0) {
      alert('ファイルを選択してください');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    formData.append('country', country);
    formData.append('region', region);
    formData.append('name', name);

    fetch(`${apiBaseUrl}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert(`アップロード成功: ${data.message}`);
      })
      .catch(err => {
        console.error('アップロード失敗:', err);
        alert('アップロードに失敗しました');
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4">ファイルアップロード</Typography>

        <FormControl fullWidth>
          <InputLabel>国</InputLabel>
          <Select value={country} label="国" onChange={handleCountryChange}>
            <MenuItem value="国内">国内</MenuItem>
            <MenuItem value="海外">海外</MenuItem>
            <MenuItem value="イン・ジャパン">イン・ジャパン</MenuItem>
          </Select>
        </FormControl>

        {country && country !== 'イン・ジャパン' && options[country]?.regions && (
          <FormControl fullWidth>
            <InputLabel>地域</InputLabel>
            <Select value={region} label="地域" onChange={(e) => setRegion(e.target.value)}>
              {Object.keys(options[country].regions || {}).map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {country && (
          <FormControl fullWidth>
            <InputLabel>氏名</InputLabel>
            <Select value={name} label="氏名" onChange={(e) => setName(e.target.value)}>
              {getNameOptions().map((n) => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <input type="file" onChange={handleFileChange} multiple />
        <Button variant="contained" onClick={handleUpload}>アップロード</Button>
      </Box>
    </Container>
  );
};

export default UploadView;

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // UploadView.tsx
// import {
//   Container, Typography, Button, Box, FormControl,
//   InputLabel, Select, MenuItem,
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import type { SelectChangeEvent } from '@mui/material';

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// type Country = '国内' | '海外' | 'イン・ジャパン';

// type UserOptions = {
//   [key in Country]?: {
//     regions?: {
//       [region: string]: string[]
//     },
//     names?: string[]
//   }
// };

// const UploadView = () => {
//   const [country, setCountry] = useState<Country | ''>('');
//   const [region, setRegion] = useState('');
//   const [name, setName] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [options, setOptions] = useState<UserOptions>({});

//   useEffect(() => {
//     fetch(`${apiBaseUrl}/users-list`)
//       .then((res) => {
//         if (!res.ok) throw new Error("APIエラー");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("取得したユーザー一覧:", data);
//         setOptions(data);
//       })
//       .catch((err) => {
//         console.error("ユーザー一覧取得エラー:", err);
//       });
//   }, []);

//   const handleCountryChange = (e: SelectChangeEvent) => {
//     const value = e.target.value as Country;
//     setCountry(value);
//     setRegion('');
//     setName('');
//   };

//   const getNameOptions = (): string[] => {
//     if (!country) return [];
//     if (country === 'イン・ジャパン') {
//       return options[country]?.names || options[country]?.regions?.['なし'] || [];
//     }
//     if (region && options[country]?.regions?.[region]) {
//       return options[country].regions[region];
//     }
//     return [];
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedFiles(Array.from(e.target.files));
//     }
//   };

//   const handleUpload = () => {
//     if (!country || !name) {
//       alert("国と氏名を選択してください");
//       return;
//     }
//     if (selectedFiles.length === 0) {
//       alert('ファイルを選択してください');
//       return;
//     }

//     const formData = new FormData();
//     selectedFiles.forEach((file) => formData.append('files', file));
//     formData.append('country', country);
//     formData.append('region', region);
//     formData.append('name', name);

//     fetch(`${apiBaseUrl}/upload`, {
//       method: 'POST',
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(data => {
//         alert(`アップロード成功: ${data.message}`);
//       })
//       .catch(err => {
//         console.error('アップロード失敗:', err);
//         alert('アップロードに失敗しました');
//       });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box mt={8} display="flex" flexDirection="column" gap={2}>
//         <Typography variant="h4">ファイルアップロード</Typography>

//         <FormControl fullWidth>
//           <InputLabel>国</InputLabel>
//           <Select value={country} label="国" onChange={handleCountryChange}>
//             <MenuItem value="国内">国内</MenuItem>
//             <MenuItem value="海外">海外</MenuItem>
//             <MenuItem value="イン・ジャパン">イン・ジャパン</MenuItem>
//           </Select>
//         </FormControl>

//         {country && country !== 'イン・ジャパン' && options[country]?.regions && (
//           <FormControl fullWidth>
//             <InputLabel>地域</InputLabel>
//             <Select value={region} label="地域" onChange={(e) => setRegion(e.target.value)}>
//               {Object.keys(options[country].regions || {}).map((r) => (
//                 <MenuItem key={r} value={r}>{r}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         {country && (
//           <FormControl fullWidth>
//             <InputLabel>氏名</InputLabel>
//             <Select value={name} label="氏名" onChange={(e) => setName(e.target.value)}>
//               {getNameOptions().map((n) => (
//                 <MenuItem key={n} value={n}>{n}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         <input type="file" onChange={handleFileChange} multiple />
//         <Button variant="contained" onClick={handleUpload}>アップロード</Button>
//       </Box>
//     </Container>
//   );
// };

// export default UploadView;