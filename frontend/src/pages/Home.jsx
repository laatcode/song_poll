import { useState, useEffect } from 'react';
import { pollApi } from '../api/services/poll.service';
import { Music, Heart, Loader2 } from 'lucide-react';
import './styles/Home.css';

export default function Home() {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState(null);
  const [votedSong, setVotedSong] = useState(null);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    loadPoll();
  }, []);

  const loadPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const activePoll = await pollApi.getActivePoll();
      
      if (!activePoll) {
        setPoll(null);
        return;
      }
      
      setPoll(activePoll);
    } catch (err) {
      setError('Error al cargar la encuesta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (songId) => {
    if (voted || voting) return;
    
    try {
      setVoting(true);
      setVotedSong(songId);
      await pollApi.vote({
        songId
      });
      setVoted(true);
      setMessage('¡Gracias por votar! Su voto ha sido registrado exitosamente.');
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('¡Ya ha votado previamente! Gracias por participar.');
        setVotedSong(null);
        setVoted(true);
      } else {
        setError(err.response?.data?.message || 'Error al votar');
      }
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <Loader2 className="spinner" size={48} />
          <p>Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="home">
        <div className="no-poll">
          <Music size={64} />
          <h1>Song Poll</h1>
          <p>No hay ninguna encuesta activa en este momento.</p>
          <p>Vuelve más tarde para votar por tu canción favorita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1><Music /> Song Poll</h1>
      </header>

      <main className="home-main">
        <section className="poll-info">
          <h2>{poll.description}</h2>
        </section>

        {error && <div className="error-message">{error}</div>}

        {voted && (
          <div className="voted-message">
            <Heart className="heart-icon" />
            <p>{message}</p>
          </div>
        )}

        <section className="songs-grid">
          {poll.songs?.map((song, index) => (
            <div
              key={song.id}
              className={`song-card ${votedSong === song.id ? 'selected' : ''} ${voted && votedSong !== song.id ? 'disabled' : ''}`}
              onClick={() => handleVote(song.id)}
            >
              <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.artistName}</p>
              </div>
              {voting && votedSong === song.songId && (
                <Loader2 className="spinner-small" />
              )}
              {!voting && !voted && (
                <Heart className="vote-icon" />
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}