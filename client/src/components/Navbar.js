import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import SpellcheckIcon from '@mui/icons-material/Spellcheck'; // New Icon

function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DescriptionIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            POLICE RECORDS SYSTEM
          </Typography>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<SearchIcon />}
              variant={location.pathname === '/' ? 'outlined' : 'text'}
            >
              Search Names
            </Button>
            <Button
              component={Link}
              to="/entry"
              color="inherit"
              startIcon={<PersonAddIcon />}
              variant={location.pathname === '/entry' ? 'outlined' : 'text'}
            >
              Add New Record
            </Button>
            <Button
              component={Link}
              to="/grammar-checker" // New Route
              color="inherit"
              startIcon={<SpellcheckIcon />} // Grammar Icon
              variant={location.pathname === '/grammar-checker' ? 'outlined' : 'text'}
            >
              Grammar Checker
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
