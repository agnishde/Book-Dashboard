import axios from 'axios';

export const fetchBooks = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`https://openlibrary.org/works.json?page=${page}&limit=${limit}`);
    return response.data.entries || []; // Ensure it returns an array
  } catch (error) {
    console.error('Error fetching books:', error);
    return []; // Return an empty array in case of error
  }
};

export const fetchAuthorDetails = async (authorKey) => {
  try {
    const response = await axios.get(`https://openlibrary.org/authors/${authorKey}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching author details:', error);
    return {}; // Return an empty object in case of error
  }
};

