import { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Paper, TextField, Button, Alert, 
  InputAdornment, IconButton, Collapse,
  ToggleButtonGroup, ToggleButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

// 市场类型
type Market = 'ASHARE' | 'HKEX' | 'US';

// 证券类型
type SecurityType = 'STOCK' | 'ETF' | 'BOND';

// 各个市场的默认费率
// A股默认费率
const CN_COMMISSION_RATE = 0.00012; // 佣金率
const CN_MIN_COMMISSION = 5; // 最低佣金(仅股票)
const CN_STAMP_DUTY_RATE = 0.0005; // 印花税率（卖出）
const CN_TRANSFER_FEE_RATE = 0.00001; // 过户费率（沪市）

// 港股默认费率
const HK_COMMISSION_RATE = 0.0007; // 佣金率
const HK_MIN_COMMISSION = 50; // 最低佣金
const HK_STAMP_DUTY_RATE = 0.001; // 印花税率（双向）
const HK_TRADING_FEE_RATE = 0.00005; // 交易费
const HK_SETTLEMENT_FEE_RATE = 0.00002; // 结算费

// 美股默认费率
const US_COMMISSION_RATE = 0.0003; // 佣金率
const US_MIN_COMMISSION = 1; // 最低佣金
const US_SEC_FEE_RATE = 0.0000229; // SEC监管费（卖出）

// 在组件外部定义一个隐藏spinner的样式
const hideNumberInputArrows = {
  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  },
  '& input[type=number]': {
    '-moz-appearance': 'textfield'
  }
};

// 结果类型接口
interface CalculationResult {
  buyPrice: number;
  sellPrice: number;
  percentChange: number;
}

export default function Calculators() {
  // 市场选择
  const [market, setMarket] = useState<Market>('ASHARE');
  
  // 证券类型选择
  const [securityType, setSecurityType] = useState<SecurityType>('STOCK');

  // 基本输入
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [shareCount, setShareCount] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 费率设置
  const [showFeeSettings, setShowFeeSettings] = useState(false);
  const [commissionRate, setCommissionRate] = useState<string>(CN_COMMISSION_RATE.toString());
  const [minCommission, setMinCommission] = useState<string>(CN_MIN_COMMISSION.toString());
  const [stampDutyRate, setStampDutyRate] = useState<string>(CN_STAMP_DUTY_RATE.toString());
  const [transferFeeRate, setTransferFeeRate] = useState<string>(CN_TRANSFER_FEE_RATE.toString());
  
  // 港股特殊费率
  const [tradingFeeRate, setTradingFeeRate] = useState<string>(HK_TRADING_FEE_RATE.toString());
  const [settlementFeeRate, setSettlementFeeRate] = useState<string>(HK_SETTLEMENT_FEE_RATE.toString());
  
  // 美股特殊费率
  const [secFeeRate, setSecFeeRate] = useState<string>(US_SEC_FEE_RATE.toString());

  // 当市场变化时，重置费率为该市场的默认费率
  useEffect(() => {
    switch (market) {
      case 'ASHARE':
        setCommissionRate(CN_COMMISSION_RATE.toString());
        setMinCommission(CN_MIN_COMMISSION.toString());
        setStampDutyRate(CN_STAMP_DUTY_RATE.toString());
        setTransferFeeRate(CN_TRANSFER_FEE_RATE.toString());
        break;
      case 'HKEX':
        setCommissionRate(HK_COMMISSION_RATE.toString());
        setMinCommission(HK_MIN_COMMISSION.toString());
        setStampDutyRate(HK_STAMP_DUTY_RATE.toString());
        setTransferFeeRate('0'); // 港股无过户费
        setTradingFeeRate(HK_TRADING_FEE_RATE.toString());
        setSettlementFeeRate(HK_SETTLEMENT_FEE_RATE.toString());
        break;
      case 'US':
        setCommissionRate(US_COMMISSION_RATE.toString());
        setMinCommission(US_MIN_COMMISSION.toString());
        setStampDutyRate('0'); // 美股无印花税
        setTransferFeeRate('0'); // 美股无过户费
        setSecFeeRate(US_SEC_FEE_RATE.toString());
        break;
    }
  }, [market]);

  // 处理市场变更
  const handleMarketChange = (
    event: React.MouseEvent<HTMLElement>,
    newMarket: Market,
  ) => {
    if (newMarket !== null) {
      setMarket(newMarket);
      setCalculationResult(null); // 清除之前的计算结果
    }
  };

  // 处理证券类型变更
  const handleSecurityTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: SecurityType,
  ) => {
    if (newType !== null) {
      setSecurityType(newType);
      setCalculationResult(null); // 清除之前的计算结果
    }
  };

  // 重置费率到当前市场默认值
  const resetToDefaultFees = () => {
    switch (market) {
      case 'ASHARE':
        setCommissionRate(CN_COMMISSION_RATE.toString());
        setMinCommission(CN_MIN_COMMISSION.toString());
        setStampDutyRate(CN_STAMP_DUTY_RATE.toString());
        setTransferFeeRate(CN_TRANSFER_FEE_RATE.toString());
        break;
      case 'HKEX':
        setCommissionRate(HK_COMMISSION_RATE.toString());
        setMinCommission(HK_MIN_COMMISSION.toString());
        setStampDutyRate(HK_STAMP_DUTY_RATE.toString());
        setTradingFeeRate(HK_TRADING_FEE_RATE.toString());
        setSettlementFeeRate(HK_SETTLEMENT_FEE_RATE.toString());
        break;
      case 'US':
        setCommissionRate(US_COMMISSION_RATE.toString());
        setMinCommission(US_MIN_COMMISSION.toString());
        setSecFeeRate(US_SEC_FEE_RATE.toString());
        break;
    }
  };

  // 计算盈亏平衡价
  const calculateBreakEvenPrice = () => {
    const P_buy = parseFloat(buyPrice);
    const N = parseInt(shareCount);
    const commission_rate = parseFloat(commissionRate);
    const min_commission = parseFloat(minCommission);
    
    // 输入验证
    if (isNaN(P_buy) || isNaN(N) || P_buy <= 0 || N <= 0) {
      setError('请输入有效的买入价格和交易股数');
      setCalculationResult(null);
      return;
    }

    // 费率验证
    if (isNaN(commission_rate) || commission_rate < 0 || isNaN(min_commission) || min_commission < 0) {
      setError('请输入有效的基础费率参数');
      setCalculationResult(null);
      return;
    }

    setError(null);

    // 定义总成本和总收入函数
    function totalCost(P: number, isBuy: boolean): number {
      const amount = N * P;
      
      // 根据证券类型决定是否应用最低佣金限制
      // ETF和债券没有最低佣金要求
      const commission = securityType === 'STOCK' 
        ? Math.max(min_commission, amount * commission_rate)
        : amount * commission_rate;
      
      if (market === 'ASHARE') {
        const stamp_duty_rate = parseFloat(stampDutyRate);
        const transfer_fee_rate = parseFloat(transferFeeRate);
        
        if (isBuy) {
          const transfer_fee = amount * transfer_fee_rate; // 沪市过户费
          return amount + commission + transfer_fee;
        } else {
          const stamp_duty = amount * stamp_duty_rate; // 卖出印花税
          const transfer_fee = amount * transfer_fee_rate; // 沪市过户费
          return amount - commission - stamp_duty - transfer_fee;
        }
      }
      else if (market === 'HKEX') {
        const stamp_duty_rate = parseFloat(stampDutyRate);
        const trading_fee_rate = parseFloat(tradingFeeRate);
        const settlement_fee_rate = parseFloat(settlementFeeRate);
        
        // 港股买卖双向征收印花税和交易费
        const stamp_duty = amount * stamp_duty_rate;
        const trading_fee = amount * trading_fee_rate;
        const settlement_fee = amount * settlement_fee_rate;
        
        if (isBuy) {
          return amount + commission + stamp_duty + trading_fee + settlement_fee;
        } else {
          return amount - commission - stamp_duty - trading_fee - settlement_fee;
        }
      }
      else if (market === 'US') {
        const sec_fee_rate = parseFloat(secFeeRate);
        
        if (isBuy) {
          return amount + commission;
        } else {
          // 美股卖出收SEC费
          const sec_fee = amount * sec_fee_rate;
          return amount - commission - sec_fee;
        }
      }
      
      return 0; // 不应该到这里
    }

    // 二分法求解盈亏平衡价
    let low = P_buy;
    let high = P_buy * 5; // 假设上限为买入价的5倍，确保范围足够
    const epsilon = 0.000001; // 计算精度
    let mid;
    
    while (high - low > epsilon) {
      mid = (low + high) / 2;
      if (totalCost(P_buy, true) < totalCost(mid, false)) {
        high = mid;
      } else {
        low = mid;
      }
    }

    const P_sell = (low + high) / 2;
    
    // 计算涨跌百分比
    const percentChange = ((P_sell / P_buy) - 1) * 100;
    
    // 构建结果对象 - 简化版
    const result: CalculationResult = {
      buyPrice: P_buy,
      sellPrice: P_sell,
      percentChange: percentChange
    };
    
    setCalculationResult(result);
  };

  // 获取当前市场的币种
  const getCurrencyUnit = () => {
    switch (market) {
      case 'ASHARE': return '元';
      case 'HKEX': return '港元';
      case 'US': return '美元';
      default: return '元';
    }
  };

  // 格式化金额显示
  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  // 生成结果文本
  const getResultText = () => {
    if (!calculationResult) return '';
    
    const currencyUnit = getCurrencyUnit();
    const priceText = `${formatAmount(calculationResult.sellPrice)} ${currencyUnit}/股`;
    const percentText = `(${calculationResult.percentChange.toFixed(2)}%)`;
    
    return `盈亏平衡价: ${priceText} ${percentText}`;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        盈亏平衡价计算器
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={7} 
          sx={{ width: { xs: '100%', sm: '800px' } }}> {/* 固定宽度容器 */}
          <Paper 
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              width: '100%', // 使用100%填充父容器
              height: 'auto', // 自动高度
            }}
          >
            <Box sx={{ mb: 2, mt: 1 }}>
              <ToggleButtonGroup
                color="primary"
                value={market}
                exclusive
                onChange={handleMarketChange}
                aria-label="市场选择"
                size="small"
                fullWidth
              >
                <ToggleButton value="ASHARE">A股</ToggleButton>
                <ToggleButton value="HKEX">港股</ToggleButton>
                <ToggleButton value="US">美股</ToggleButton>
              </ToggleButtonGroup>
              
              {/* 证券类型选择 */}
              <ToggleButtonGroup
                color="primary"
                value={securityType}
                exclusive
                onChange={handleSecurityTypeChange}
                aria-label="证券类型选择"
                size="small"
                fullWidth
                sx={{ mt: 1 }}
              >
                <ToggleButton value="STOCK">股票</ToggleButton>
                <ToggleButton value="ETF">ETF</ToggleButton>
                <ToggleButton value="BOND">债券</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              计算考虑交易成本后不亏不赚的卖出价格
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <TextField
                label="买入价格"
                type="number"
                fullWidth
                margin="normal"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{getCurrencyUnit()}/股</InputAdornment>,
                }}
                inputProps={{ 
                  min: 0, 
                  step: 0.01,
                  inputMode: 'decimal'
                }}
                sx={hideNumberInputArrows}
              />
              
              <TextField
                label="交易股数"
                type="number"
                fullWidth
                margin="normal"
                value={shareCount}
                onChange={(e) => setShareCount(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">股</InputAdornment>,
                }}
                inputProps={{ 
                  min: 1, 
                  step: 100,
                  inputMode: 'decimal'
                }}
                sx={hideNumberInputArrows}
              />
            </Box>
            
            {/* 费率设置部分 */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => setShowFeeSettings(!showFeeSettings)}
                endIcon={<ExpandMoreIcon sx={{ transform: showFeeSettings ? 'rotate(180deg)' : 'none' }} />}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                费率设置
              </Button>
              
              <Collapse in={showFeeSettings}>
                <Box sx={{ pl: 1, pr: 1, pt: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      自定义{market === 'ASHARE' ? 'A股' : market === 'HKEX' ? '港股' : '美股'}费率
                    </Typography>
                    <IconButton size="small" onClick={resetToDefaultFees} title="重置为默认值">
                      <SettingsBackupRestoreIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="佣金率"
                        type="number"
                        fullWidth
                        size="small"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ 
                          min: 0, 
                          step: 0.0001,
                          inputMode: 'decimal'
                        }}
                        sx={hideNumberInputArrows}
                      />
                    </Grid>
                    
                    {/* 只有股票才显示最低佣金选项 */}
                    {securityType === 'STOCK' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="最低佣金"
                          type="number"
                          fullWidth
                          size="small"
                          value={minCommission}
                          onChange={(e) => setMinCommission(e.target.value)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">{getCurrencyUnit()}</InputAdornment>,
                          }}
                          inputProps={{ 
                            min: 0, 
                            step: 1,
                            inputMode: 'decimal'
                          }}
                          sx={hideNumberInputArrows}
                        />
                      </Grid>
                    )}

                    {/* A股特有费率 */}
                    {market === 'ASHARE' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="印花税率(卖出)"
                            type="number"
                            fullWidth
                            size="small"
                            value={stampDutyRate}
                            onChange={(e) => setStampDutyRate(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ 
                              min: 0, 
                              step: 0.0001,
                              inputMode: 'decimal'
                            }}
                            sx={hideNumberInputArrows}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="过户费率"
                            type="number"
                            fullWidth
                            size="small"
                            value={transferFeeRate}
                            onChange={(e) => setTransferFeeRate(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ 
                              min: 0, 
                              step: 0.00001,
                              inputMode: 'decimal'
                            }}
                            sx={hideNumberInputArrows}
                          />
                        </Grid>
                      </>
                    )}

                    {/* 港股特有费率 */}
                    {market === 'HKEX' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="印花税率(双向)"
                            type="number"
                            fullWidth
                            size="small"
                            value={stampDutyRate}
                            onChange={(e) => setStampDutyRate(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ 
                              min: 0, 
                              step: 0.0001,
                              inputMode: 'decimal'
                            }}
                            sx={hideNumberInputArrows}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="交易征费"
                            type="number"
                            fullWidth
                            size="small"
                            value={tradingFeeRate}
                            onChange={(e) => setTradingFeeRate(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ 
                              min: 0, 
                              step: 0.00001,
                              inputMode: 'decimal'
                            }}
                            sx={hideNumberInputArrows}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="结算费"
                            type="number"
                            fullWidth
                            size="small"
                            value={settlementFeeRate}
                            onChange={(e) => setSettlementFeeRate(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ 
                              min: 0, 
                              step: 0.00001,
                              inputMode: 'decimal'
                            }}
                            sx={hideNumberInputArrows}
                          />
                        </Grid>
                      </>
                    )}

                    {/* 美股特有费率 */}
                    {market === 'US' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="SEC监管费(卖出)"
                          type="number"
                          fullWidth
                          size="small"
                          value={secFeeRate}
                          onChange={(e) => setSecFeeRate(e.target.value)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          inputProps={{ 
                            min: 0, 
                            step: 0.000001,
                            inputMode: 'decimal'
                          }}
                          sx={hideNumberInputArrows}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Collapse>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={calculateBreakEvenPrice}
              sx={{ mt: 1 }}
            >
              计算盈亏平衡价
            </Button>
            
            {/* 错误信息显示 */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* 计算结果 - 使用Alert替代表格 */}
            {calculationResult && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 2,
                  '& .MuiAlert-message': {
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                }}
              >
                {getResultText()}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}