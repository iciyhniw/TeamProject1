import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ track }) => {
  // Викликаємо всі Hooks на верхньому рівні, до будь-яких умов
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Format time (e.g., 0:47)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle progress bar click to seek
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Set initial volume and duration when audio metadata loads
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, [volume]);

  // Calculate progress percentage for the progress bar
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // Переміщуємо умову після всіх Hooks
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
        <button className="shuffle">⤓</button>
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