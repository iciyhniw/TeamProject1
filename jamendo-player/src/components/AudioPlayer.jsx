import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

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
  };

  useEffect(() => {
    if (!track || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = volume;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, [track, volume]);

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

  // Альтернативна функція для скачування
  const handleDownload = async () => {
    if (!track || !track.audio) {
      alert('Немає доступного файлу для завантаження.');
      return;
    }

    try {
      // Завантажуємо файл як Blob
      const response = await fetch(track.audio, {
        method: 'GET',
        mode: 'cors', // Додаємо CORS, якщо потрібно
        headers: {
          'Accept': 'audio/mpeg', // Вказуємо тип файлу
        },
      });

      if (!response.ok) {
        throw new Error(`Помилка завантаження: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${track.name}_${track.artist_name}.mp3`; // Ім'я файлу
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Очищаємо пам’ять

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
        <button className="like">♥</button>
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
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;