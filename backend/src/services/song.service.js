const Song = require('../models/song.model')
const Artist = require('../models/artist.model')
const CustomError = require('../errors/CustomError')

class SongService {
  static async findAll({ page, limit }) {
    const [songs, total] = await Promise.all([
      Song.find(page, limit),
      Song.count()
    ])
    return {
      data: songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static async findById(id) {
    const song = await Song.findById(id)
    if (!song) throw new CustomError(404, 'Song not found')
    return song
  }

  static async create(data) {
    const artist = await Artist.findById(data.artistId)
    if (!artist) throw new CustomError(400, 'Artist not found')
    const songId = await Song.create(data)
    return this.findById(songId)
  }

  static async update(id, data) {
    const song = await this.findById(id)
    if (!song) throw new CustomError(404, 'Song not found')
    if (data.artistId) {
      const artist = await Artist.findById(data.artistId)
      if (!artist) throw new CustomError(400, 'Artist not found')
    }
    const updatedSong = { ...song, ...data }
    await Song.update(id, updatedSong)
    return this.findById(id)
  }

  static async delete(id) {
    const song = await this.findById(id)
    if (!song) throw new CustomError(404, 'Song not found')
    return Song.delete(id).then(() => ({ message: 'Song deleted successfully' }))
  }
}

module.exports = SongService