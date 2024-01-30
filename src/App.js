import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load the last playing audio file and its position on page reload
    const storedTrackIndex = localStorage.getItem('currentTrackIndex');
    if (storedTrackIndex !== null) {
      setCurrentTrackIndex(parseInt(storedTrackIndex));
    }
  }, []);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (storedPlaylist) {
      setPlaylist(storedPlaylist);
    }
  }, []);

  useEffect(() => {
    if (playlist.length > 0) {
      audio.src = playlist[currentTrackIndex].url;
      audio.load();
      if (isPlaying) {
        audio.play();
      }
    }
  }, [playlist, currentTrackIndex, isPlaying, audio]);

  useEffect(() => {
    const handleEnded = () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        // Loop back to the beginning of the playlist
        setCurrentTrackIndex(0);
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, currentTrackIndex, playlist]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const newPlaylist = [...playlist, { title: file.name, url: URL.createObjectURL(file) }];
    setPlaylist(newPlaylist);
    localStorage.setItem('playlist', JSON.stringify(newPlaylist));
  };

  const handlePlay = () => {
    setIsPlaying(true);
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  };

  const handlePause = () => {
    setIsPlaying(false);
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  };

  const handleTrackChange = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {playlist.length > 0 && (
        <div>
          <h2>Playlist</h2>
          <ul>
            {playlist.map((track, index) => (
              <li key={index} onClick={() => handleTrackChange(index)}>
                {track.title}
              </li>
            ))}
          </ul>
          <h2>Now Playing</h2>
          <p>{playlist[currentTrackIndex].title}</p>
          <button onClick={isPlaying ? handlePause : handlePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
