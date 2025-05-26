import React from 'react';

const GenreCard = ({ genre, onClick }) => (
  <div className="genre-card" onClick={onClick}>
    <h3>{genre}</h3>
  </div>
);

export default GenreCard;
