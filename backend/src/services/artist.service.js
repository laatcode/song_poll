const Artist = require('../models/artist.model')
const CustomError = require('../errors/CustomError')

class ArtistService {
  static async findAll({ page, limit }) {
    const [artists, total] = await Promise.all([
      Artist.find(page, limit),
      Artist.count()
    ])
    return {
      data: artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static async findById(id) {
    const artist = await Artist.findById(id)
    if (!artist) throw new CustomError(404, 'Artist not found')
    return artist
  }

  static async create(data) {
    const artistId = await Artist.create(data)
    return this.findById(artistId)
  }

  static async update(id, data) {
    const artist = await this.findById(id)
    if (!artist) throw new CustomError(404, 'Artist not found')
    const artistUpdated = { ...artist, ...data }
    await Artist.update(id, artistUpdated)
    return this.findById(id)
  }

  static async delete(id) {
    const artist = await this.findById(id)
    if (!artist) throw new CustomError(404, 'Artist not found')
    return Artist.delete(id).then(() => ({ message: 'Artist deleted successfully' }))
  }
}

module.exports = ArtistService