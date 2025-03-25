import { Box, Typography, Grid, Paper } from '@mui/material';

export default function Overview() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系统概览
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              市场概览
            </Typography>
            <Typography variant="body2">
              这里将显示市场主要指数和趋势数据
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              最近交易
            </Typography>
            <Typography variant="body2">
              这里将显示最近交易活动的摘要
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              绩效指标
            </Typography>
            <Typography variant="body2">
              这里将显示关键绩效指标
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}