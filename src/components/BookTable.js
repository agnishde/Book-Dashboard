import React, { useState, useEffect } from 'react';
import { fetchBooks, fetchAuthorDetails } from '../services/bookService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, Paper, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import SearchBar from './SearchBar';
import { CSVLink } from 'react-csv';

const headers = [
  { label: 'Title', key: 'title' },
  { label: 'Author', key: 'authorDetails.name' },
  { label: 'First Publish Year', key: 'first_publish_year' },
  { label: 'Ratings Average', key: 'ratings_average' },
  { label: 'Subject', key: 'subject' },
  { label: 'Author Birth Date', key: 'authorDetails.birth_date' },
  { label: 'Author Top Work', key: 'authorDetails.top_work' }
];

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(searchQuery, page + 1, rowsPerPage);
        const booksWithAuthorDetails = await Promise.all(
          data.map(async (book) => {
            const authorDetails = await fetchAuthorDetails(book.author_name[0]);
            return { ...book, authorDetails };
          })
        );
        setBooks(booksWithAuthorDetails);
      } catch (error) {
        setError('Failed to fetch books');
      }
      setLoading(false);
    };

    fetchData();
  }, [page, rowsPerPage, searchQuery]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedBook({ ...selectedBook, [field]: value });
  };

  const handleEditSave = () => {
    setBooks(books.map(book => (book.key === selectedBook.key ? selectedBook : book)));
    setEditDialogOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <CSVLink data={books} headers={headers} filename="books.csv">
        <Button>Download CSV</Button>
      </CSVLink>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={orderBy === 'title'} direction={order} onClick={(e) => handleRequestSort(e, 'title')}>
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === 'author'} direction={order} onClick={(e) => handleRequestSort(e, 'author')}>
                    Author
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === 'first_publish_year'} direction={order} onClick={(e) => handleRequestSort(e, 'first_publish_year')}>
                    First Publish Year
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === 'ratings_average'} direction={order} onClick={(e) => handleRequestSort(e, 'ratings_average')}>
                    Ratings Average
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === 'subject'} direction={order} onClick={(e) => handleRequestSort(e, 'subject')}>
                    Subject
                  </TableSortLabel>
                </TableCell>
                <TableCell>Author Birth Date</TableCell>
                <TableCell>Author Top Work</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.authorDetails.name}</TableCell>
                  <TableCell>{book.first_publish_year}</TableCell>
                  <TableCell>{book.ratings_average || 'N/A'}</TableCell>
                  <TableCell>{book.subject ? book.subject.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{book.authorDetails.birth_date || 'N/A'}</TableCell>
                  <TableCell>{book.authorDetails.top_work || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(book)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={100} // This should ideally come from the API response
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the details of the book.</DialogContentText>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={selectedBook?.title || ''}
            onChange={(e) => handleEditChange('title', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            value={selectedBook?.authorDetails.name || ''}
            onChange={(e) => handleEditChange('author', e.target.value)}
          />
          <TextField
            margin="dense"
            label="First Publish Year"
            fullWidth
            value={selectedBook?.first_publish_year || ''}
            onChange={(e) => handleEditChange('first_publish_year', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Ratings Average"
            fullWidth
            value={selectedBook?.ratings_average || ''}
            onChange={(e) => handleEditChange('ratings_average', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            value={selectedBook?.subject ? selectedBook.subject.join(', ') : ''}
            onChange={(e) => handleEditChange('subject', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author Birth Date"
            fullWidth
            value={selectedBook?.authorDetails.birth_date || ''}
            onChange={(e) => handleEditChange('birth_date', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author Top Work"
            fullWidth
            value={selectedBook?.authorDetails.top_work || ''}
            onChange={(e) => handleEditChange('top_work', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookTable;







