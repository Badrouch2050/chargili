import React, { useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItemChild {
  title: string;
  path: string;
  icon: React.ReactElement;
}

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItemChild[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Tableau de bord',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'Agents',
    icon: <PeopleIcon />,
    path: '/agents'
  },
  {
    title: 'Clients',
    icon: <PeopleIcon />,
    path: '/clients'
  },
  {
    title: 'Transactions',
    icon: <ReceiptIcon />,
    path: '/transactions'
  },
  {
    title: 'Stock',
    icon: <InventoryIcon />,
    children: [
      {
        title: 'Cartes',
        path: '/stock/cards',
        icon: <CreditCardIcon />
      },
      {
        title: 'Balance',
        path: '/stock/balance',
        icon: <AccountBalanceIcon />
      }
    ]
  },
  {
    title: 'Paramètres',
    icon: <SettingsIcon />,
    children: [
      {
        title: 'Taux de Change',
        path: '/parameters/exchange-rates',
        icon: <CurrencyExchangeIcon />
      },
      {
        title: 'Devises',
        path: '/parameters/currency',
        icon: <CurrencyExchangeIcon />
      }
    ]
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({
    'Paramètres': true,
    'Stock': true
  });

  useEffect(() => {
    console.log('Menu items:', menuItems);
    console.log('Open state:', open);
    console.log('Current location:', location.pathname);
  }, [open, location]);

  const handleClick = (title: string) => {
    setOpen(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Box sx={{ 
      width: 240,
      backgroundColor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider',
      height: '100vh',
      overflow: 'auto'
    }}>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem
              button
              onClick={() => item.children ? handleClick(item.title) : item.path && navigate(item.path)}
              sx={{
                backgroundColor: open[item.title] ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ color: open[item.title] ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: open[item.title] ? 'bold' : 'normal'
                }}
              />
            </ListItem>
            {item.children && (
              <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem
                      key={child.path}
                      button
                      onClick={() => navigate(child.path)}
                      sx={{ 
                        pl: 4,
                        backgroundColor: location.pathname === child.path ? 'action.selected' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: location.pathname === child.path ? 'primary.main' : 'inherit',
                        minWidth: 40
                      }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={child.title}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === child.path ? 'bold' : 'normal'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
            {item.title === 'Stock' && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 