import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const BASE_URL = 'https://api.jamendo.com/v3.0';

export const searchTracks = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/tracks`, {
      params: {
        client_id: CLIENT_ID,
        format: 'json',
        limit: 20,
        namesearch: query
      }
    });
    return res.data.results;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

export const getTracksByGenre = async (genre) => {
  try {
    const res = await axios.get(`${BASE_URL}/tracks`, {
      params: {
        client_id: CLIENT_ID,
        format: 'json',
        limit: 10,
        tags: genre
      }
    });
    return res.data.results;
  } catch (error) {
    console.error('Error getting tracks by genre:', error);
    return [];
  }
};