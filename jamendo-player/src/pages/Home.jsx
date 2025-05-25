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
        <div className="home-page with-audio-player">
            <Navbar onSearch={handleSearch} />
            <div className="home-container">
                <div className="genre-section">
                    <h2 className="section-title">Genres</h2>
                    <div className="genre-grid">
                        {genres.map((g) => (
                            <GenreCard
                                key={g}
                                genre={g}
                                image={`https://source.unsplash.com/160x100/?${g}`}
                                onClick={() => handleGenreClick(g)}
                            />
                        ))}
                    </div>
                </div>
                <div className="track-section">
                    <h2 className="section-title">Tracks</h2>
                    <div className="track-grid">
                        {tracks.map((t) => (
                            <div key={t.id} onClick={() => setSelectedTrack(t)} className="track-card">
                                <img src={t.album_image} alt={t.name} className="track-image" />
                                <div className="track-info">
                                    <p className="track-name">{t.name}</p>
                                    <p className="track-artist">{t.artist_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AudioPlayer track={selectedTrack} />
        </div>
    );
};

export default Home;