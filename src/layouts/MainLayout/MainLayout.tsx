import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import SideMenu, { MenuItem } from '../../components/SideMenu/SideMenu';
import Overview from '../../features/Overview/Overview';
import MarketData from '../../features/MarketData/MarketData';
import Calculators from '../../features/Calculators/Calculators';
import Portfolio from '../../features/Portfolio/Portfolio';
import Settings from '../../features/Settings/Settings';

// 组件映射
const componentMap: Record<string, React.ReactNode> = {
  'overview': <Overview />,
  'market-data': <MarketData />,
  'calculators': <Calculators />,
  'portfolio': <Portfolio />,
  'settings': <Settings />,
};

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeContent, setActiveContent] = useState<string>('overview');

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setActiveContent(menuItem.id);
  };

  return (
    <Box sx={{ 
      position: 'relative', // 设置相对定位作为定位上下文
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden'
    }}>
      <CssBaseline />
      
      {/* 主内容区域 - 填满整个空间 */}
      <Box
        component="main"
        sx={{ 
          width: '100%', // 固定为100%宽度
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          width: '100%', 
          height: '100%',
          p: 2 // 添加内边距
        }}>
          {componentMap[activeContent]}
        </Box>
      </Box>
      
      {/* 右侧菜单 - 使用绝对定位覆盖在主内容上方 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          zIndex: 1200, // 确保在主内容之上
        }}
      >
        <SideMenu 
          open={menuOpen} 
          onToggle={handleMenuToggle}
          onMenuItemClick={handleMenuItemClick} 
        />
      </Box>
    </Box>
  );
}