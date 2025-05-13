import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Dashboard, People, LocalAtm, Settings, ExitToApp, Group, Inventory, ExpandLess, ExpandMore, CurrencyExchange, Support, Gavel } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { removeToken } from '../../services/auth/tokenService';
import { RootState } from '../../store/store';

const drawerWidth = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

interface SubMenuItem {
  text: string;
  path: string;
  icon?: React.ReactElement;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  subItems?: SubMenuItem[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [stockOpen, setStockOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleLogout = () => {
    removeToken();
    dispatch(logout());
    navigate('/login');
  };

  const handleStockClick = () => {
    setStockOpen(!stockOpen);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Gestion des Agents', icon: <People />, path: '/agents' },
    { text: 'Gestion des Clients', icon: <Group />, path: '/clients' },
    { text: 'Transactions', icon: <LocalAtm />, path: '/transactions' },
    { 
      text: 'Stock', 
      icon: <Inventory />, 
      path: '/stock',
      subItems: [
        { text: 'Cartes', path: '/stock/cards' },
        { text: 'Solde', path: '/stock/balance' }
      ]
    },
    { 
      text: 'Paramètres', 
      icon: <Settings />, 
      path: '/parameters',
      subItems: [
        { text: 'Taux de Change', path: '/parameters/exchange-rates', icon: <CurrencyExchange /> },
        { text: 'Devises', path: '/parameters/currency', icon: <CurrencyExchange /> },
        { text: 'Devises Principales', path: '/parameters/main-currency', icon: <CurrencyExchange /> },
        { text: 'Opérateurs', path: '/parameters/operators', icon: <CurrencyExchange /> },
        { text: 'Commissions', path: '/parameters/commissions', icon: <CurrencyExchange /> },
        { text: 'Tickets de Support', path: '/parameters/support-tickets', icon: <Support /> },
        { text: 'Gestion des Litiges', path: '/parameters/disputes', icon: <Gavel /> }
      ]
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            CHARGILI Backoffice
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItemButton 
                  onClick={() => item.subItems ? (item.text === 'Stock' ? handleStockClick() : handleSettingsClick()) : navigate(item.path)}
                  selected={location.pathname.startsWith(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.subItems && (item.text === 'Stock' ? (stockOpen ? <ExpandLess /> : <ExpandMore />) : (settingsOpen ? <ExpandLess /> : <ExpandMore />))}
                </ListItemButton>
                {item.subItems && (
                  <Collapse in={item.text === 'Stock' ? stockOpen : settingsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.text}
                          sx={{ pl: 4 }}
                          onClick={() => navigate(subItem.path)}
                          selected={location.pathname === subItem.path}
                        >
                          {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 