import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GenreCard from '../components/GenreCard';
import AudioPlayer from '../components/AudioPlayer';
import { getTracksByGenre, searchTracks } from '../api';
import '../styles/Search.css';

const genres = ["pop", "rock", "jazz", "hiphop", "electronic", "classical", "reggae"];

const Search = () => {
    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setTracks([]);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await searchTracks(query);
            setTracks(result);
        } catch (error) {
            setError('Failed to search tracks: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenreClick = async (genre) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await getTracksByGenre(genre);
            setTracks(result);
        } catch (error) {
            setError('Failed to fetch tracks: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        if (query) {
            setSearchQuery(query);
            handleSearch(query);
        }
    }, [location]);

    return (
        <div className="search-page with-audio-player">
            <div className="search-container">
                <div className="search-header">
                    <input
                        type="text"
                        placeholder="Search for songs, artists..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        className="search-input"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
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
                            <h2 className="section-title">
                                {searchQuery ? `Search Results for "${searchQuery}"` : 'Tracks'}
                            </h2>
                            <div className="track-grid">
                                {tracks.map((t) => (
                                    <div 
                                        key={t.id} 
                                        onClick={() => setSelectedTrack(t)} 
                                        className="track-card"
                                    >
                                        <img src={t.album_image} alt={t.name} className="track-image" />
                                        <div className="track-info">
                                            <p className="track-name">{t.name}</p>
                                            <p className="track-artist">{t.artist_name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {tracks.length === 0 && searchQuery && (
                                <div className="no-results">
                                    No tracks found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <AudioPlayer track={selectedTrack} />
        </div>
    );
};

export default Search;