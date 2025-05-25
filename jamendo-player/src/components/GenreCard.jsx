import React from 'react';

const GenreCard = ({ genre, image, onClick }) => (
  <div className="genre-card" onClick={onClick}>
    <img src={image} alt={genre} />
    <h3>{genre}</h3>
  </div>
);

export default GenreCard;
