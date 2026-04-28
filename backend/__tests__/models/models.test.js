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

const Artist = require('../../src/models/artist.model')
const Song = require('../../src/models/song.model')
const Poll = require('../../src/models/poll.model')
const User = require('../../src/models/user.model')

describe('Artist Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('find', () => {
    it('should return artists with pagination', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])
      const result = await Artist.find(1, 10)
      expect(result).toEqual([{ id: 1, name: 'Artist 1' }])
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM artists LIMIT ? OFFSET ?', [10, 0])
    })

    it('should calculate offset correctly', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result =await Artist.find(3, 10)
      expect(result).toEqual([])
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM artists LIMIT ? OFFSET ?', [10, 20])
    })
  })

  describe('count', () => {
    it('should return total count', async () => {
      mockQuery.mockResolvedValueOnce([[{ total: 50 }]])
      const result = await Artist.count()
      expect(result).toBe(50)
    })
  })

  describe('findById', () => {
    it('should return artist by id', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Artist 1' }]])
      const result = await Artist.findById(1)
      expect(result).toEqual({ id: 1, name: 'Artist 1' })
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM artists WHERE id = ?', [1])
    })

    it('should return undefined if not found', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result = await Artist.findById(999)
      expect(result).toBeUndefined()
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM artists WHERE id = ?', [999])
    })
  })

  describe('create', () => {
    it('should insert and return id', async () => {
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }])
      const result = await Artist.create({ name: 'New Artist' })
      expect(result).toBe(1)
      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO artists (name) VALUES (?)', ['New Artist'])
    })
  })

  describe('update', () => {
    it('should update artist', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Artist.update(1, { name: 'Updated Name' })
      expect(mockQuery).toHaveBeenCalledWith('UPDATE artists SET name = ? WHERE id = ?', ['Updated Name', 1])
    })
  })

  describe('delete', () => {
    it('should delete artist', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Artist.delete(1)
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM artists WHERE id = ?', [1])
    })
  })
})

describe('Song Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('find', () => {
    it('should return songs with pagination', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])
      const result = await Song.find(1, 10)
      expect(result).toEqual([{ id: 1, title: 'Song 1', artistId: 1 }])
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, title, artist_id AS artistId FROM songs LIMIT ? OFFSET ?', [10, 0] )
    })

    it('should calculate offset correctly', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result = await Song.find(2, 5)
      expect(result).toEqual([])
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, title, artist_id AS artistId FROM songs LIMIT ? OFFSET ?', [5, 5])
    })
  })

  describe('count', () => {
    it('should return total count', async () => {
      mockQuery.mockResolvedValueOnce([[{ total: 100 }]])
      const result = await Song.count()
      expect(result).toBe(100)
    })
  })

  describe('findById', () => {
    it('should return song by id', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, title: 'Song 1', artistId: 1 }]])
      const result = await Song.findById(1)
      expect(result).toEqual({ id: 1, title: 'Song 1', artistId: 1 })
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, title, artist_id AS artistId FROM songs WHERE id = ?', [1])
    })

    it('should return undefined if not found', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result = await Song.findById(999)
      expect(result).toBeUndefined()
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, title, artist_id AS artistId FROM songs WHERE id = ?', [999])
    })
  })

  describe('create', () => {
    it('should insert and return id', async () => {
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }])
      const result = await Song.create({ title: 'New Song', artistId: 1 })
      expect(result).toBe(1)
      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO songs (title, artist_id) VALUES (?, ?)', ['New Song', 1])
    })
  })

  describe('update', () => {
    it('should update song', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Song.update(1, { title: 'Updated Song', artistId: 1 })
      expect(mockQuery).toHaveBeenCalledWith('UPDATE songs SET title = ?, artist_id = ? WHERE id = ?', ['Updated Song', 1, 1])
    })
  })

  describe('delete', () => {
    it('should delete song', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Song.delete(1)
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM songs WHERE id = ?', [1])
    })
  })
})

describe('Poll Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('find', () => {
    it('should return polls with pagination', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', statusId: 1 }]])
      const result = await Poll.find(1, 10)
      expect(result).toEqual([{ id: 1, name: 'Poll 1', statusId: 1 }])
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, name, description, status_id AS statusId FROM polls LIMIT ? OFFSET ?', [10, 0])
    })

    it('should calculate offset correctly', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result =await Poll.find(3, 10)
      expect(result).toEqual([])
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, name, description, status_id AS statusId FROM polls LIMIT ? OFFSET ?', [10, 20])
    })
  })

  describe('count', () => {
    it('should return total count', async () => {
      mockQuery.mockResolvedValueOnce([[{ total: 25 }]])
      const result = await Poll.count()
      expect(result).toBe(25)
    })
  })

  describe('findById', () => {
    it('should return poll by id', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Poll 1', statusId: 1 }]])
      const result = await Poll.findById(1)
      expect(result).toEqual({ id: 1, name: 'Poll 1', statusId: 1 })
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, name, description, status_id AS statusId FROM polls WHERE id = ?', [1])
    })

    it('should return undefined if not found', async () => {
      mockQuery.mockResolvedValueOnce([[]])
      const result = await Poll.findById(999)
      expect(result).toBeUndefined()
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, name, description, status_id AS statusId FROM polls WHERE id = ?', [999])
    })
  })

  describe('findSongsById', () => {
    it('should return songs for poll', async () => {
      mockQuery.mockResolvedValueOnce([[{ songId: 1 }, { songId: 2 }]])
      const result = await Poll.findSongsById(1)
      expect(result).toEqual([{ songId: 1 }, { songId: 2 }])
      expect(mockQuery).toHaveBeenCalledWith('SELECT song_id AS songId FROM polls_songs WHERE poll_id = ?', [1])
    })
  })

  describe('create', () => {
    it('should insert and return id', async () => {
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }]) // Insert polls
      mockQuery.mockResolvedValueOnce([{ insertId: 0 }]) // Insert polls_songs 1
      mockQuery.mockResolvedValueOnce([{ insertId: 0 }]) // Insert polls_songs 2
      const result = await Poll.create({ name: 'New Poll', description: 'Poll description', songs: [{ songId: 1 }, { songId: 2 }] })
      expect(result).toBe(1)
      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO polls (name, description) VALUES (?, ?)', ['New Poll', 'Poll description'])
      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO polls_songs (poll_id, song_id) VALUES (?, ?)', [1, 1])
      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO polls_songs (poll_id, song_id) VALUES (?, ?)', [1, 2])
    })
  })

  describe('update', () => {
    it('should update poll', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Poll.update(1, { name: 'Updated Poll', description: 'Updated description', statusId: 2 })
      expect(mockQuery).toHaveBeenCalledWith('UPDATE polls SET name = ?, description = ?, status_id = ? WHERE id = ?', ['Updated Poll', 'Updated description', 2, 1])
    })
  })

  describe('delete', () => {
    it('should delete poll', async () => {
      mockQuery.mockResolvedValueOnce([])
      await Poll.delete(1)
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM polls WHERE id = ?', [1])
    })
  })
})

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByUsername', () => {
    it('should return the user data with the specified username', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, username: 'username1', password: 'hashedpassword' }]])
      const result = await User.findByUsername('username1')
      expect(result).toEqual({ id: 1, username: 'username1', password: 'hashedpassword' })
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE username = ?', ["username1"])
    })
  })

  describe('findById', () => {
    it('should return the id and username of the user with the specified id', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1, username: 'username1' }]])
      const result = await User.findById(1)
      expect(result).toEqual({ id: 1, username: 'username1' })
      expect(mockQuery).toHaveBeenCalledWith('SELECT id, username FROM users WHERE id = ?', [1])
    })
  })
})