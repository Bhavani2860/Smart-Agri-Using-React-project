import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  IconButton,
  Box
} from '@mui/material';
import { 
  Home as HomeIcon,
  Agricultural as AgriculturalIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Agri Platform
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/crop-advisory"
            startIcon={<AgriculturalIcon />}
          >
            Crop Advisory
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/market-prices"
            startIcon={<AttachMoneyIcon />}
          >
            Market Prices
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/resource-tools"
            startIcon={<SettingsIcon />}
          >
            Resource Tools
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
