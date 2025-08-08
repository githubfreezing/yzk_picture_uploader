import { fetchUserOptions } from '../api/fetchUserOptions';
import type { Country, UserOptions } from '../api/types';

import {
  Container,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import { Checkbox, FormControlLabel } from '@mui/material';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DisplayView = () => {

  const [country, setCountry] = useState<Country | ''>('');
  const [region, setRegion] = useState('');
  const [name, setName] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [options, setOptions] = useState<UserOptions>({});
  //ダウンロードするファイルを選択するためのファイル
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchUserOptions()
      .then((data) => {
        console.log("取得したユーザー一覧!D!!:", data);
        setOptions(data);
      })
      .catch((err) => {
        console.error("ユーザー一覧取得エラー!D!!:", err);
      });
  }, []);
  
  const handleCountryChange = (e: SelectChangeEvent) => {
    const value = e.target.value as Country;
    setCountry(value);
    setRegion('');
    setName('');
    setImageUrls([]);
  };

  const handleDisplay = async () => {
    if (!country || !name || (country !== 'イン・ジャパン' && !region)) {
      alert('すべての項目を選択してください');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/display`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          region,
          name,
        }),
      });

      if (!response.ok) throw new Error('表示に失敗しました');

      const data = await response.json();
      setImageUrls(data.files || []);
    } catch (error) {
      console.error(error);
      alert('画像の取得中にエラーが発生しました');
    }
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

  // チェックボックス変更のハンドラー
  const handleCheckboxChange = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url)
        ? prev.filter((u) => u !== url)
        : [...prev, url]
    );
  };

const handleDownloadSelected = async () => {
  if (!country || !name || (country !== 'イン・ジャパン' && !region)) {
    alert('すべての項目を選択してください');
    return;
  }

  if (selectedUrls.length === 0) {
    alert('画像を選択してください');
    return;
  }

  // URLからファイル名を抽出
  const filenames = selectedUrls.map(url => {
    const urlParts = url.split("?")[0].split("/");
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  });

  const response = await fetch(`${apiBaseUrl}/download-zip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      country,
      region,
      name,
      filenames  // 選択したファイル名リストを送信
    }),
  });

  if (!response.ok) {
    alert('ZIPファイルの作成に失敗しました');
    return;
  }

  const blob = await response.blob();
  saveAs(blob, `${name}_selected_images.zip`);
};

  return (
    <Container maxWidth="md">

      <Box mt={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4" gutterBottom>
          画像表示ビュー
        </Typography>

        <FormControl fullWidth>
          <InputLabel>国</InputLabel>
          <Select value={country} label="国" onChange={handleCountryChange}>
            <MenuItem value="国内">国内</MenuItem>
            <MenuItem value="海外">海外</MenuItem>
            <MenuItem value="イン・ジャパン">イン・ジャパン</MenuItem>
          </Select>
        </FormControl>

        {/* {country && country !== 'イン・ジャパン' && options[country]?.regions && (
          <FormControl fullWidth>
            <InputLabel>地域</InputLabel>
            <Select value={region} label="地域" onChange={(e) => setRegion(e.target.value)}>
              {Object.keys(options[country].regions || {}).map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )} */}
        {country && options[country]?.regions && (
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

        <Button variant="contained" color="secondary" onClick={handleDisplay}>
          表示
        </Button>

        {imageUrls.length > 0 && (
          <Box mt={4} width="100%">
            <Typography variant="h6">画像一覧</Typography>
            <Grid container spacing={2}>
              {imageUrls.map((url, idx) => (
                <Grid key={url} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <Card>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedUrls.includes(url)}
                          onChange={() => handleCheckboxChange(url)}
                        />
                      }
                      label={`image-${idx + 1}`}
                    />
                    <CardMedia
                      component="img"
                      image={url}
                      alt={`image-${idx}`}
                      sx={{
                        height: 200,
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button variant="contained" color="primary" onClick={handleDownloadSelected}>
              選択した画像をダウンロード
            </Button>

          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DisplayView;
