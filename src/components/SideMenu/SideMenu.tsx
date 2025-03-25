import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  ShowChart as ShowChartIcon,
  Calculate as CalculateIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// 菜单展开和收起时的宽度
export const drawerWidth = 240;
export const closedDrawerWidth = 60;

// 菜单项定义
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// 预定义的菜单项
export const menuItems: MenuItem[] = [
  { id: 'overview', title: '概览', icon: <DashboardIcon /> },
  { id: 'market-data', title: '市场数据', icon: <ShowChartIcon /> },
  { id: 'calculators', title: '盈亏平衡计算器', icon: <CalculateIcon /> },
  { id: 'portfolio', title: '投资组合', icon: <AccountBalanceIcon /> },
  { id: 'settings', title: '设置', icon: <SettingsIcon /> },
];

interface SideMenuProps {
  open: boolean;
  onToggle: () => void;
  onMenuItemClick: (menuItem: MenuItem) => void;
}

export default function SideMenu({ open, onToggle, onMenuItemClick }: SideMenuProps) {
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: open ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth, // 保持固定宽度
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transform: open ? 'translateX(0)' : `translateX(${drawerWidth - closedDrawerWidth}px)`, // 修正方向
          transition: theme => theme.transitions.create('transform', { // 改为transform动画
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open={true} // 始终打开，只是位置变化
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'flex-start', // 始终左对齐
          padding: 1,
          minHeight: 64,
          overflowX: 'visible',
        }}
      >
        {/* 将按钮放在最前面 */}
        <IconButton 
          onClick={onToggle}
        >
          {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        
        {/* 标题改为在按钮右侧 */}
        <Typography 
        variant="h5" 
        noWrap 
        component="div" 
        sx={{ 
        flexGrow: 1,
        whiteSpace: 'nowrap' // 确保标题不会换行
        }}
        >
        TurnipCannery
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Tooltip title={open ? '' : item.title} placement="left">
              <ListItemButton 
                onClick={() => onMenuItemClick(item)}
                sx={{ 
                  px: 2,
                  minHeight: 48,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  primaryTypographyProps={{
                    noWrap: true,
                    style: { whiteSpace: 'nowrap' }
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}