import React, { useState, useEffect } from 'react';
import { fetchBooks, fetchAuthorDetails } from '../services/bookService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, Paper, CircularProgress } from '@mui/material';
import SearchBar from './SearchBar';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(page + 1, rowsPerPage);
        const booksWithAuthorDetails = await Promise.all(
          data.map(async (book) => {
            const authorDetails = await fetchAuthorDetails(book.authors[0].key);
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
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchBooks(1, rowsPerPage); // Fetch all books and then filter
          const booksWithAuthorDetails = await Promise.all(
            data.map(async (book) => {
              const authorDetails = await fetchAuthorDetails(book.authors[0].key);
              return { ...book, authorDetails };
            })
          );
          const filteredBooks = booksWithAuthorDetails.filter(book => book.authorDetails.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setBooks(filteredBooks);
        } catch (error) {
          setError('Failed to fetch books');
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [searchQuery, rowsPerPage]);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
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
    </div>
  );
};

export default BookTable;


