import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GenreCard from '../components/GenreCard';
import AudioPlayer from '../components/AudioPlayer';
import { getTracksByGenre, searchTracks } from '../api';


const genres = ["pop", "rock", "jazz", "hiphop", "electronic", "classical", "reggae"];

const Search = () => {
    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const location = useLocation();

    const handleSearch = async (query) => {
        if (query.trim()) {
            const result = await searchTracks(query);
            setTracks(result);
        } else {
            setTracks([]);
        }
    };

    const handleGenreClick = async (genre) => {
        const result = await getTracksByGenre(genre);
        setTracks(result);
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        if (query) {
            handleSearch(query);
        }
    }, [location]);

    return (
        <div className="search-page with-audio-player">
            <div className="search-container">
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
                                <p className="track-info">{t.name} — {t.artist_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AudioPlayer track={selectedTrack} />
        </div>
    );
};

export default Search;