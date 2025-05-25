import React, { useState, useRef, useEffect } from 'react';
import '../styles/AudioPlayer.css';


const AudioPlayer = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // New state for like status
  const audioRef = useRef(null);

  // Check if the track is already in the playlist on component mount
  useEffect(() => {
    if (!track) return;
    const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
    setIsLiked(playlist.some(item => item.audio === track.audio));
  }, [track]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleLike = () => {
    if (!track) return;

    // Get or initialize playlist
    let playlist = JSON.parse(localStorage.getItem('playlist') || '[]');

    // Check if track is already in playlist
    const isTrackInPlaylist = playlist.some(item => item.audio === track.audio);

    if (!isTrackInPlaylist) {
      // Add track to playlist
      playlist.push({
        name: track.name,
        artist_name: track.artist_name,
        audio: track.audio
      });
      localStorage.setItem('playlist', JSON.stringify(playlist));
      setIsLiked(true);
      alert(`Додано "${track.name}" до плейлиста!`);
    } else {
      // Remove track from playlist
      playlist = playlist.filter(item => item.audio !== track.audio);
      localStorage.setItem('playlist', JSON.stringify(playlist));
      setIsLiked(false);
      alert(`Видалено "${track.name}" з плейлиста!`);
    }
  };

  useEffect(() => {
    if (!track || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, [track, volume, isMuted]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const handleShare = async () => {
    if (!track) return;

    const shareText = `Слухай "${track.name}" від ${track.artist_name}! 🎵\n${window.location.href}?track=${encodeURIComponent(track.audio)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${track.name} - ${track.artist_name}`,
          text: `Слухай цю пісню!`,
          url: window.location.href,
        });
        console.log('Пісня успішно поділена!');
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
    if (!track || !track.audio) {
      alert('Немає доступного файлу для завантаження.');
      return;
    }

    try {
      const response = await fetch(track.audio, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'audio/mpeg',
        },
      });

      if (!response.ok) {
        throw new Error(`Помилка завантаження: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${track.name}_${track.artist_name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Пісня завантажується...');
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
      alert('Не вдалося завантажити пісню. Перевірте URL або серверні налаштування.');
    }
  };

  if (!track) return null;

  return (
    <div className="audio-player">
      <h4>
        {track.name} - {track.artist_name}
      </h4>
      <audio
        ref={audioRef}
        src={track.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <span className="time">{formatTime(currentTime)}</span>
      <div className="controls">
        <button className={`like ${isLiked ? 'liked' : ''}`} onClick={handleLike}>♥</button>
        <button className="previous">⏪</button>
        <button className="play-pause" onClick={togglePlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="next">⏩</button>
        <button className="share" onClick={handleShare}>📤</button>
        <button className="download" onClick={handleDownload}>⬇️</button>
      </div>
      <span className="time">{formatTime(duration)}</span>
      <div className="progress-bar" onClick={handleSeek}>
        <div className="progress" style={{ width: `${progressPercentage}%` }} />
      </div>
      <div className="volume">
        <button className="mute-toggle" onClick={toggleMute}>
          <img
            src={isMuted ? 'https://cdn-icons-png.flaticon.com/512/786/786374.png' : 'https://cdn-icons-png.flaticon.com/512/727/727606.png'}
            alt={isMuted ? 'Unmute' : 'Mute'}
            className="mute-icon"
          />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;