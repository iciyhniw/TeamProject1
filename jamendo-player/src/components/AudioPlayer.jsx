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
            src={isMuted ? 'data:image/jpeg;base64,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' : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZH1o0intPRQLoeZv7Kg_z0eJeBkXwO7USA&s'}
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