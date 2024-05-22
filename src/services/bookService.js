import axios from 'axios';

export const fetchBooks = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${limit}`);
    return response.data.docs || []; 
  } catch (error) {
    console.error('Error fetching books:', error);
    return []; 
  }
};

export const fetchAuthorDetails = async (authorName) => {
  try {
    const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${authorName}`);
    return response.data.docs[0] || {}; 
  } catch (error) {
    console.error('Error fetching author details:', error);
    return {}; // Return an empty object in case of error
  }
};




