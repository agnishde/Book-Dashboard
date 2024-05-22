import React from 'react';
import BookTable from './components/BookTable';
import { Container, Typography } from '@mui/material';

const App = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Dashboard
      </Typography>
      <BookTable />
    </Container>
  );
};

export default App;


