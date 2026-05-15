import api from '../client';

export const pollApi = {
  getActivePoll: async () => {
    const { pollId } = await api.get('/polls/getActivePollId').then(res => res.data ).catch(err => console.log(err));
    const poll = await api.get(`/polls/${pollId}`).then(res => res.data);

    poll.songs = await Promise.all(poll.songs.map(async song =>
      await api.get(`/songs/${song.songId}`).then(async res => {
        res.data
        return {
          ...res.data,
          artistName: await api.get(`/artists/${res.data.artistId}`).then(artistRes => artistRes.data.name)
        }
      })
    ));

    return poll;
  },
  getAll: async (page = 1, limit = 100) => {
    const [pollsRes, songsRes, artistsRes] = await Promise.all([
      api.get(`/polls?page=${page}&limit=${limit}`),
      api.get(`/songs?page=${page}&limit=${limit}`),
      api.get(`/artists?page=${page}&limit=${limit}`)
    ]);
    const artists = artistsRes.data.data || [];
    const allSongs = songsRes.data.data || [];
    const songsWithArtists = allSongs.map(song => ({
      ...song,
      artistName: artists.find(a => a.id === song.artistId)?.name || 'Unknown'
    }));
    const polls = pollsRes.data.data || [];
    const pollsWithSongs = polls.map(poll => ({
      ...poll,
      songs: (poll.songs || []).map(ps => {
        const fullSong = songsWithArtists.find(s => s.id === ps.songId);
        return fullSong ? { ...ps, title: fullSong.title, artistName: fullSong.artistName } : ps;
      })
    }));
    return { data: { polls: pollsWithSongs, pagination: pollsRes.data.pagination } };
  },
  getById: async (id) => {
    const [pollRes, songsRes, artistsRes] = await Promise.all([
      api.get(`/polls/${id}`),
      api.get('/songs?page=1&limit=100'),
      api.get('/artists?page=1&limit=100')
    ]);
    const artists = artistsRes.data.artists || [];
    const allSongs = songsRes.data.songs || [];
    const songsWithArtists = allSongs.map(song => ({
      ...song,
      artistName: artists.find(a => a.id === song.artistId)?.name || 'Unknown'
    }));
    const poll = pollRes.data;
    const songs = (poll.songs || []).map(ps => {
      const fullSong = songsWithArtists.find(s => s.id === ps.songId);
      return fullSong ? { ...ps, title: fullSong.title, artistName: fullSong.artistName } : ps;
    });
    return { data: { ...poll, songs } };
  },
  create: (data) => api.post('/polls', data),
  update: (id, data) => api.patch(`/polls/${id}`, data),
  delete: (id) => api.delete(`/polls/${id}`),
  addSongs: (id, songs) => api.post(`/polls/${id}/songs`, songs),
  deleteSongs: (id, songs) => api.delete(`/polls/${id}/songs`, { data: songs }),
  activate: (id) => api.post('/polls/activate', { id }),
  deactivate: (id) => api.post('/polls/deactivate', { id }),
  vote: (data) => api.post('/polls/vote', data),
  getResults: () => api.get('/polls/votes'),
};