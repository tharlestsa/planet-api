import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import SideBar from './components/SideBar';


function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography align="center" variant="h2" component="h2" gutterBottom>
            Planet Images
          </Typography>
          <SideBar />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
