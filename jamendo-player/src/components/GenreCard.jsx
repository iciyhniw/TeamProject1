import React from 'react';

const genreEmojis = {
    pop: "🎤",
    rock: "🎸",
    jazz: "🎷",
    hiphop: "🎧",
    electronic: "🔊",
    classical: "🎼",
    reggae: "🌴"
};

const genreGradients = {
    pop: "from-pink-400 to-purple-500",
    rock: "from-gray-700 to-red-600",
    jazz: "from-amber-400 to-orange-500",
    hiphop: "from-green-400 to-blue-500",
    electronic: "from-cyan-400 to-purple-600",
    classical: "from-indigo-300 to-blue-400",
    reggae: "from-green-400 to-yellow-400"
};

const GenreCard = ({ genre, onClick }) => (
    <div
        className={`genre-card bg-gradient-to-br ${genreGradients[genre] || 'from-gray-400 to-gray-600'}`}
        onClick={onClick}
    >
        <div className="genre-emoji">
            {genreEmojis[genre] || "🎵"}
        </div>
        <h3 className="genre-title">{genre}</h3>
    </div>
);

export default GenreCard;