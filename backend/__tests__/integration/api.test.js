const request = require('supertest')

const mockQuery = jest.fn()

jest.mock('../../db/config', () => ({
  query: mockQuery,
  getConnection: jest.fn().mockResolvedValue({
    beginTransaction: jest.fn(),
    query: mockQuery,
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn()
  })
}))

const app = require('../../src/app')

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /', () => {
    it('should return server running message', async () => {
      const res = await request(app).get('/')
      expect(res.text).toBe('Server running')
    })
  })

  describe('Artist API', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    
    describe('GET /api/artists', () => {
      it('should return empty array when no artists', async () => {
        mockQuery
          .mockResolvedValueOnce([[]])  // find()
          .mockResolvedValueOnce([[{ total: 0 }]])  // count()
        const res = await request(app).get('/api/artists')
        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([])
        expect(res.body.pagination.totalPages).toBe(0)
      })

      it('should return paginated artists', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // find()
          .mockResolvedValueOnce([[{ total: 1 }]])  // count()
        const res = await request(app).get('/api/artists?page=1&limit=10')
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.pagination.total).toBe(1)
      })
    })

    describe('GET /api/artists/1', () => {
      it('should return an error when artist is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).get('/api/artists/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Artist not found')
      })

      it('should return the artist found', async () => {
        mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // findById(1)
        const res = await request(app).get('/api/artists/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, name: 'Artist 1' })
      })
    })

    describe('POST /api/artists', () => {
      it('should return the artist created', async () => {
        mockQuery
          .mockResolvedValueOnce([{ insertId: 1 }])  // create()
          .mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // findById(1)
        const res = await request(app).post('/api/artists').send({ name: 'Artist 1' })
        expect(res.status).toBe(201)
        expect(res.body).toEqual({ id: 1, name: 'Artist 1' })
      })
    })

    describe('PATCH /api/artists/1', () => {
      it('should return an error when artist is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).patch('/api/artists/1').send({ name: 'Artist 2' })
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Artist not found')
      })

      it('should return the artist updated', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // findById(1) before update
          .mockResolvedValueOnce([[]])  // update()
          .mockResolvedValueOnce([[{ id: 1, name: 'Artist 2' }]])  // findById(1) after update
        const res = await request(app).patch('/api/artists/1').send({ name: 'Artist 2' })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, name: 'Artist 2' })
      })
    })

    describe('DELETE /api/artists/1', () => {
      it('should return an error when artist is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).delete('/api/artists/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Artist not found')
      })

      it('should return message that the artist was deleted', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // findById(1) before delete
          .mockResolvedValueOnce([[]])  // delete()
        const res = await request(app).delete('/api/artists/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ message: 'Artist deleted successfully' })
      })
    })
  })

  describe('Song API', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('GET /api/songs', () => {
      it('should return empty array when no songs', async () => {
        mockQuery
          .mockResolvedValueOnce([[]])  // find()
          .mockResolvedValueOnce([[{ total: 0 }]])  // count()
        const res = await request(app).get('/api/songs')
        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([])
        expect(res.body.pagination.totalPages).toBe(0)
      })

      it('should return paginated songs', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // find()
          .mockResolvedValueOnce([[{ total: 1 }]])  // count()
        const res = await request(app).get('/api/songs?page=1&limit=10')
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.pagination.total).toBe(1)
      })
    })

    describe('GET /api/songs/1', () => {
      it('should return an error when song is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).get('/api/songs/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Song not found')
      })

      it('should return the song found', async () => {
        mockQuery.mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // findById(1)
        const res = await request(app).get('/api/songs/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, title: 'Song 1', artistId: 1 })
      })
    })

    describe('POST /api/songs', () => {
      it('should return the song created', async () => {
        mockQuery
        .mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])  // Artist.findById(1)
        .mockResolvedValueOnce([{ insertId: 1 }])  // create()
        .mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // findById(1)
        const res = await request(app).post('/api/songs').send({ title: 'Song 1', artistId: 1 })
        expect(res.status).toBe(201)
        expect(res.body).toEqual({ id: 1, title: 'Song 1', artistId: 1 })
      })
    })

    describe('PATCH /api/songs/1', () => {
      it('should return an error when song is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).patch('/api/songs/1').send({ title: 'Song 2' })
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Song not found')
      })

      it('should return an error when the artist is not found', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // findById(1)
          .mockResolvedValueOnce([[]])  // Artist.findById(2)
        const res = await request(app).patch('/api/songs/1').send({ title: 'Song 2', artistId: 2 })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Artist not found')
      })

      it('should return the song updated', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // findById(1) before update
          .mockResolvedValueOnce([[]])  // update()
          .mockResolvedValueOnce([[{ id: 1, title: 'Song 2', artistId: 1 }]])  // findById(1) after update
        const res = await request(app).patch('/api/songs/1').send({ title: 'Song 2' })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, title: 'Song 2', artistId: 1 })
      })
    })

    describe('DELETE /api/songs/1', () => {
      it('should return an error when song is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).delete('/api/songs/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Song not found')
      })

      it('should return message that the song was deleted', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])  // findById(1) before delete
          .mockResolvedValueOnce([[]])  // delete()
        const res = await request(app).delete('/api/songs/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ message: 'Song deleted successfully' })
      })
    })
  })

  describe('Poll APIs', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('GET /api/polls', () => {
      it('should return empty array when no polls', async () => {
        mockQuery
          .mockResolvedValueOnce([[]])  // find() - polls
          .mockResolvedValueOnce([[{ total: 0 }]])  // count()
        const res = await request(app).get('/api/polls')
        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([])
      })

      it('should return paginated polls', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 2 }]])  // find()
          .mockResolvedValueOnce([[{ SongId: 1 }, { SongId: 2 }]])  // findSongsById(pollId)
          .mockResolvedValueOnce([[{ total: 1 }]])  // count()
        const res = await request(app).get('/api/polls?page=1&limit=10')
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.data[0].songs).toHaveLength(2)
        expect(res.body.pagination.total).toBe(1)
      })
    })

    describe('GET /api/polls/1', () => {
      it('should return an error when poll is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).get('/api/polls/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Poll not found')
      })

      it('should return the poll found', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 2 }]])  // findById(1)
          .mockResolvedValueOnce([[{ SongId: 1 }, { SongId: 2 }]])  // findSongsById(1)
        const res = await request(app).get('/api/polls/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 2, songs: [{ SongId: 1 }, { SongId: 2 }] })
      })
    })

    describe('POST /api/polls', () => {
      it('should return the poll created', async () => {
        mockQuery
          .mockResolvedValueOnce([{ insertId: 1 }])  // Insert into polls
          .mockResolvedValueOnce([{ insertId: 0 }])  // Insert into polls_songs 1
          .mockResolvedValueOnce([{ insertId: 0 }])  // Insert into polls_songs 2
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 2 }]])  // findById(1)
          .mockResolvedValueOnce([[{ SongId: 1 }, { SongId: 2 }]])  // findSongsById(1)
        const res = await request(app).post('/api/polls').send({ name: 'Poll 1', description: 'Description 1', songs: [{ songId: 1 }, { songId: 2 }] })
        expect(res.status).toBe(201)
        expect(res.body).toEqual({ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 2, songs: [{ SongId: 1 }, { SongId: 2 }] })
      })
    })

    describe('PATCH /api/polls/1', () => {
      it('should return an error when poll is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).patch('/api/polls/1').send({ name: 'Poll 2' })
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Poll not found')
      })

      it('should return the poll updated', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 1 }]])  // findById(1) before update
          .mockResolvedValueOnce([[{ SongId: 1 }, { SongId: 2 }]])  // findSongsById(1)
          .mockResolvedValueOnce([[]])  // update()
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 2', description: 'Description 2', statusId: 2 }]])  // findById(1) after update
          .mockResolvedValueOnce([[{ SongId: 1 }, { SongId: 2 }]])  // findSongsById(1)
        const res = await request(app).patch('/api/polls/1').send({ name: 'Poll 2', statusId: 2 })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, name: 'Poll 2', description: 'Description 2', statusId: 2, songs: [{ SongId: 1 }, { SongId: 2 }] })
      })
    })

    describe('DELETE /api/polls/1', () => {
      it('should return an error when poll is not found', async () => {
        mockQuery.mockResolvedValueOnce([[]])  // findById(1)
        const res = await request(app).delete('/api/polls/1')
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Poll not found')
      })

      it('should return message that the poll was deleted', async () => {
        mockQuery
          .mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', description: 'Description 1', statusId: 1 }]])  // findById(1) before delete
          .mockResolvedValueOnce([[[{ songId: 1 }, { songId: 2 }]]])  // findSongsById(1)
          .mockResolvedValueOnce([[]])  // delete()
        const res = await request(app).delete('/api/polls/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ message: 'Poll deleted successfully' })
      })
    })
  })

  describe('Error handling', () => {
    it('should return 404 for non-existent route', async () => {
      const res = await request(app).get('/api/nonexistent')
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Route Not Found')
    })
  })
})