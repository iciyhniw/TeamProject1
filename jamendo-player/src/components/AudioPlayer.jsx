import React from 'react';


const AudioPlayer = ({ track }) => {
  if (!track) return null;
  return (
    <div className="audio-player">
      <h4>{track.name} - {track.artist_name}</h4>
      <audio controls src={track.audio}></audio>
    </div>
  );
};

export default AudioPlayer;
