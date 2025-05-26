import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import '../styles/AudioPlayer.css';

const AudioPlayer = ({ track, onTrackEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    if (track) {
      setPlaylist(prevPlaylist => {
        const newPlaylist = [...prevPlaylist];
        const existingIndex = newPlaylist.findIndex(t => t.id === track.id);
        
        if (existingIndex === -1) {
          newPlaylist.push(track);
          setCurrentTrackIndex(newPlaylist.length - 1);
        } else {
          setCurrentTrackIndex(existingIndex);
        }
        
        return newPlaylist;
      });
    }
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;

    const playAudio = async () => {
      try {
        if (isPlaying) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error('Playback error:', error);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (!track) return;
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist') || '[]');
    setIsLiked(savedPlaylist.some(item => item.audio === track.audio));
  }, [track]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onTrackEnd) {
        onTrackEnd();
      }
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrack = playlist[currentTrackIndex];

  const handleLike = () => {
    if (!currentTrack) return;

    let savedPlaylist = JSON.parse(localStorage.getItem('playlist') || '[]');
    const isTrackInPlaylist = savedPlaylist.some(item => item.audio === currentTrack.audio);

    if (!isTrackInPlaylist) {
      savedPlaylist.push({
        name: currentTrack.name,
        artist_name: currentTrack.artist_name,
        audio: currentTrack.audio
      });
      localStorage.setItem('playlist', JSON.stringify(savedPlaylist));
      setIsLiked(true);
    } else {
      savedPlaylist = savedPlaylist.filter(item => item.audio !== currentTrack.audio);
      localStorage.setItem('playlist', JSON.stringify(savedPlaylist));
      setIsLiked(false);
    }
  };

  const handleShare = async () => {
    if (!currentTrack) return;

    const shareText = `Слухай "${currentTrack.name}" від ${currentTrack.artist_name}! 🎵\n${window.location.href}?track=${encodeURIComponent(currentTrack.audio)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentTrack.name} - ${currentTrack.artist_name}`,
          text: `Слухай цю пісню!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Помилка поділу:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Посилання на пісню скопійовано в буфер обміну!'))
        .catch((err) => console.error('Помилка копіювання:', err));
    }
  };

  const handleDownload = async () => {
    if (!currentTrack || !currentTrack.audio) {
      alert('Немає доступного файлу для завантаження.');
      return;
    }

    try {
      const response = await fetch(currentTrack.audio);
      if (!response.ok) throw new Error(`Помилка завантаження: ${response.statusText}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentTrack.name}_${currentTrack.artist_name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
      alert('Не вдалося завантажити пісню.');
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <div className="audio-player">
      <div className="player-main">
        <div className="track-info">
          <h4>{currentTrack?.name || 'No track selected'}</h4>
          <p>{currentTrack?.artist_name || ''}</p>
        </div>
        
        <audio
          ref={audioRef}
          src={currentTrack?.audio}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button 
            className={`control-button shuffle ${isShuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <i className="fas fa-random"></i>
          </button>
          
          <button 
            className="control-button previous"
            onClick={handlePrevious}
            title="Previous"
          >
            <FaStepBackward />
          </button>
          
          <button 
            className="control-button play-pause"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <button 
            className="control-button next"
            onClick={handleNext}
            title="Next"
          >
            <FaStepForward />
          </button>
          
          <button 
            className={`control-button repeat ${isRepeat ? 'active' : ''}`}
            onClick={toggleRepeat}
            title="Repeat"
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>
      </div>

      <div className="player-actions">
        <button 
          className={`action-button like ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Remove from playlist' : 'Add to playlist'}
        >
          <i className="fas fa-heart"></i>
        </button>
        
        <button 
          className="action-button share"
          onClick={handleShare}
          title="Share"
        >
          <i className="fas fa-share-alt"></i>
        </button>
        
        <button 
          className="action-button download"
          onClick={handleDownload}
          title="Download"
        >
          <i className="fas fa-download"></i>
        </button>
        
        <div className="volume-control">
          <button 
            className="action-button volume"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;