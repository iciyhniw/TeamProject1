import React, { useState, useRef, useEffect } from 'react';
import '../styles/AudioPlayer.css';

const AudioPlayer = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Стан для поточного треку
  const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem('playlist') || '[]')); // Плейлист із localStorage
  const audioRef = useRef(null);

  // Оновлення стану isLiked і плейлиста при зміні треку
  useEffect(() => {
    if (!track) return;
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist') || '[]');
    setPlaylist(storedPlaylist);
    setIsLiked(storedPlaylist.some(item => item.audio === track.audio));
    // Знаходимо індекс поточного треку в плейлисті
    const trackIndex = storedPlaylist.findIndex(item => item.audio === track.audio);
    setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0);
  }, [track]);

  // Функція для оновлення аудіо при зміні треку
  const updateTrack = (newIndex) => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex(newIndex);
    const newTrack = playlist[newIndex];
    if (audioRef.current) {
      audioRef.current.src = newTrack.audio;
      audioRef.current.load();
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Помилка відтворення:', err));
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Помилка відтворення:', err));
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
    let updatedPlaylist = [...playlist];
    const isTrackInPlaylist = updatedPlaylist.some(item => item.audio === track.audio);

    if (!isTrackInPlaylist) {
      updatedPlaylist.push({
        name: track.name,
        artist_name: track.artist_name,
        audio: track.audio
      });
      localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
      setPlaylist(updatedPlaylist);
      setIsLiked(true);
      alert(`Додано "${track.name}" до плейлиста!`);
    } else {
      updatedPlaylist = updatedPlaylist.filter(item => item.audio !== track.audio);
      localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
      setPlaylist(updatedPlaylist);
      setIsLiked(false);
      alert(`Видалено "${track.name}" з плейлиста!`);
    }
    // Оновлюємо індекс поточного треку після зміни плейлиста
    const trackIndex = updatedPlaylist.findIndex(item => item.audio === track.audio);
    setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0);
  };

  // Обробка кнопки "назад"
  const handlePrevious = () => {
    if (playlist.length <= 1) return; // Нічого не робимо, якщо плейлист порожній або має 1 трек
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1; // Зациклення до останнього треку
    updateTrack(newIndex);
  };

  // Обробка кнопки "вперед"
  const handleNext = () => {
    if (playlist.length <= 1) return; // Нічого не робимо, якщо плейлист порожній або має 1 трек
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0; // Зациклення до першого треку
    updateTrack(newIndex);
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

  // Оновлюємо відображення назви треку з плейлиста, якщо є
  const displayTrack = playlist.length > 0 && currentTrackIndex < playlist.length ? playlist[currentTrackIndex] : track;

  return (
    <div className="audio-player">
      <h4>
        {displayTrack.name} - {displayTrack.artist_name}
      </h4>
      <audio
        ref={audioRef}
        src={displayTrack.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          handleNext(); // Автоматично відтворюємо наступний трек після завершення
        }}
      />
      <span className="time">{formatTime(currentTime)}</span>
      <div className="controls">
        <button className={`like ${isLiked ? 'liked' : ''}`} onClick={handleLike}>♥</button>
        <button className="previous" onClick={handlePrevious}>⏪</button>
        <button className="play-pause" onClick={togglePlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="next" onClick={handleNext}>⏩</button>
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
            src={
              isMuted
                ? 'https://cdn-icons-png.flaticon.com/512/565/565284.png'
                : 'https://cdn-icons-png.flaticon.com/512/565/565297.png'
            }
            alt={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
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