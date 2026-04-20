const joi = require('joi')

describe('Artist Validator', () => {
  const { createArtistSchema, updateArtistSchema, getArtistSchema } = require('../../src/validators/artist.validator')

  describe('createArtistSchema', () => {
    it('should validate valid data', () => {
      const data = { name: 'The Beatles' }
      const { error } = createArtistSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject empty object', () => {
      const { error } = createArtistSchema.validate({})
      expect(error).toBeDefined()
    })

    it('should reject null', () => {
      const { error } = createArtistSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject short name', () => {
      const { error } = createArtistSchema.validate({ name: 'ab' })
      expect(error).toBeDefined()
    })

    it('should reject long name', () => {
      const { error } = createArtistSchema.validate({ name: 'a'.repeat(41) })
      expect(error).toBeDefined()
    })
  })

  describe('updateArtistSchema', () => {
    it('should validate valid data', () => {
      const data = { name: 'New Artist Name' }
      const { error } = updateArtistSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject empty object', () => {
      const { error } = updateArtistSchema.validate({})
      expect(error).toBeDefined()
    })

    it('should reject null object', () => {
      const { error } = updateArtistSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject short name', () => {
      const { error } = createArtistSchema.validate({ name: 'ab' })
      expect(error).toBeDefined()
    })

    it('should reject long name', () => {
      const { error } = createArtistSchema.validate({ name: 'a'.repeat(41) })
      expect(error).toBeDefined()
    })
  })

  describe('getArtistSchema', () => {
    it('should validate valid id', () => {
      const data = { id: 1 }
      const { error } = getArtistSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject negative id', () => {
      const { error } = getArtistSchema.validate({ id: -1 })
      expect(error).toBeDefined()
    })

    it('should reject non-integer id', () => {
      const { error } = getArtistSchema.validate({ id: 1.5 })
      expect(error).toBeDefined()
    })
  })
})

describe('Song Validator', () => {
  const { createSongSchema, updateSongSchema, getSongSchema } = require('../../src/validators/song.validator')

  describe('createSongSchema', () => {
    it('should validate valid data', () => {
      const data = { title: 'Hey Jude', artistId: 1 }
      const { error } = createSongSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject empty object', () => {
      const { error } = createSongSchema.validate({})
      expect(error).toBeDefined()
    })

    it('should reject null', () => {
      const { error } = createSongSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject short name', () => {
      const { error } = createSongSchema.validate({ title: 'ab', artistId: 1 })
      expect(error).toBeDefined()
    })

    it('should reject long name', () => {
      const { error } = createSongSchema.validate({ title: 'a'.repeat(41), artistId: 1 })
      expect(error).toBeDefined()
    })

    it('should reject missing title', () => {
      const { error } = createSongSchema.validate({ artistId: 1 })
      expect(error).toBeDefined()
    })

    it('should reject missing artistId', () => {
      const { error } = createSongSchema.validate({ title: 'Hey Jude' })
      expect(error).toBeDefined()
    })
  })

  describe('updateSongSchema', () => {
    it('should validate with only title', () => {
      const data = { title: 'New Song' }
      const { error } = updateSongSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should validate with only artistId', () => {
      const data = { artistId: 2 }
      const { error } = updateSongSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should validate valid data with both title and artistId', () => {
      const data = { title: 'New Artist Name', artistId: 2 }
      const { error } = updateSongSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject null object', () => {
      const { error } = updateSongSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject short name', () => {
      const { error } = createSongSchema.validate({ title: 'ab', artistId: 1 })
      expect(error).toBeDefined()
    })

    it('should reject long name', () => {
      const { error } = createSongSchema.validate({ title: 'a'.repeat(41), artistId: 1 })
      expect(error).toBeDefined()
    })
  })

  describe('getSongSchema', () => {
    it('should validate valid id', () => {
      const data = { id: 1 }
      const { error } = getSongSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject negative id', () => {
      const { error } = getSongSchema.validate({ id: -1 })
      expect(error).toBeDefined()
    })

    it('should reject non-integer id', () => {
      const { error } = getSongSchema.validate({ id: 1.5 })
      expect(error).toBeDefined()
    })
  })
})

describe('Poll Validator', () => {
  const { createPollSchema, updatePollSchema, getPollSchema, editSongsSchema } = require('../../src/validators/poll.validator')

  describe('createPollSchema', () => {
    it('should validate valid data', () => {
      const data = {
        name: 'Best Song Poll',
        description: 'Vote for your favorite',
        songs: [{ songId: 1 }, { songId: 2 }]
      }
      const { error } = createPollSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject empty object', () => {
      const { error } = createPollSchema.validate({})
      expect(error).toBeDefined()
    })

    it('should reject null', () => {
      const { error } = createPollSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject missing name', () => {
      const data = { description: 'test', songs: [{ songId: 1 }] }
      const { error } = createPollSchema.validate(data)
      expect(error).toBeDefined()
    })

    it('should reject short name', () => {
      const { error } = createPollSchema.validate({ name: 'ab', description: 'test', songs: [{ songId: 1 }] })
      expect(error).toBeDefined()
    })

    it('should reject long name', () => {
      const { error } = createPollSchema.validate({ name: 'a'.repeat(41), description: 'test', songs: [{ songId: 1 }] })
      expect(error).toBeDefined()
    })

    it('should reject missing description', () => {
      const data = { name: 'test', songs: [{ songId: 1 }] }
      const { error } = createPollSchema.validate(data)
      expect(error).toBeDefined()
    })

    it('should reject short description', () => {
      const { error } = createPollSchema.validate({ name: 'test', description: 'ab', songs: [{ songId: 1 }] })
      expect(error).toBeDefined()
    })

    it('should reject empty songs array', () => {
      const data = { name: 'test', description: 'test', songs: [] }
      const { error } = createPollSchema.validate(data)
      expect(error).toBeDefined()
    })

    it('should reject missing songs', () => {
      const data = { name: 'test', description: 'test' }
      const { error } = createPollSchema.validate(data)
      expect(error).toBeDefined()
    })
  })

  describe('updatePollSchema', () => {
    it('should validate only with statusId', () => {
      const data = { statusId: 1 }
      const { error } = updatePollSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should validate only with name', () => {
      const data = { name: 'test' }
      const { error } = updatePollSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should validate with description', () => {
      const data = { description: 'test' }
      const { error } = updatePollSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject invalid statusId', () => {
      const data = { statusId: 5 }
      const { error } = updatePollSchema.validate(data)
      expect(error).toBeDefined()
    })

    it('should reject null object', () => {
      const { error } = updatePollSchema.validate(null)
      expect(error).toBeDefined()
    })
  })

  describe('editSongsSchema', () => {
    it('should validate valid song array', () => {
      const data = [{ songId: 1 }, { songId: 2 }]
      const { error } = editSongsSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject empty array', () => {
      const { error } = editSongsSchema.validate([])
      expect(error).toBeDefined()
    })

    it('should reject null object', () => {
      const { error } = editSongsSchema.validate(null)
      expect(error).toBeDefined()
    })

    it('should reject empty object', () => {
      const { error } = editSongsSchema.validate({})
      expect(error).toBeDefined()
    })

    it('should reject array with invalid object ', () => {
      const { error } = editSongsSchema.validate([{}])
      expect(error).toBeDefined()
    })

    it('should reject array with invalid object with string songId', () => {
      const { error } = editSongsSchema.validate([{ songId: "a" }])
      expect(error).toBeDefined()
    })
  })
})