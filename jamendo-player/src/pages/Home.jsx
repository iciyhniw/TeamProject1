import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GenreCard from '../components/GenreCard';
import AudioPlayer from '../components/AudioPlayer';
import { getTracksByGenre, searchTracks } from '../api';


const genres = ["pop", "rock", "jazz", "hiphop", "electronic", "classical", "reggae"];

const Home = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleGenreClick = async (genre) => {
    const result = await getTracksByGenre(genre);
    setTracks(result);
  };

  const handleSearch = async (query) => {
    const result = await searchTracks(query);
    setTracks(result);
  };

  return (
    <div className="container with-audio-player">
      <Navbar onSearch={handleSearch} />
      <div className="flex">
        {genres.map((g) => (
          <GenreCard
            key={g}
            genre={g}
            image={`https://source.unsplash.com/160x100/?${g}`}
            onClick={() => handleGenreClick(g)}
          />
        ))}
      </div>
      <div className="grid">
        {tracks.map((t) => (
          <div key={t.id} onClick={() => setSelectedTrack(t)} className="genre-card">
            <img src={t.album_image} alt={t.name} />
            <p>{t.name} — {t.artist_name}</p>
          </div>
        ))}
      </div>
      <AudioPlayer track={selectedTrack} />
    </div>
  );
};

export default Home;
