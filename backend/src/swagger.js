const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Song Poll API',
      version: '1.0.0',
      description: 'API para sistema de encuestas de canciones',
      contact: {
        name: 'laatcode'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      { name: 'Artists', description: 'Operaciones de artistas' },
      { name: 'Songs', description: 'Operaciones de canciones' },
      { name: 'Polls', description: 'Operaciones de encuestas' }
    ],
    paths: {
      '/api/artists': {
        get: {
          tags: ['Artists'],
          summary: 'Obtener todos los artistas',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: {
            200: {
              description: 'Lista de artistas con paginación',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Artist' } },
                      pagination: { $ref: '#/components/schemas/Pagination' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Artists'],
          summary: 'Crear artista',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: { name: { type: 'string', minLength: 3, maxLength: 40 } }
                }
              }
            }
          },
          responses: { 201: { description: 'Artista creado' } }
        }
      },
      '/api/artists/{id}': {
        get: {
          tags: ['Artists'],
          summary: 'Obtener artista por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Artista' }, 404: { description: 'No encontrado' } }
        },
        patch: {
          tags: ['Artists'],
          summary: 'Actualizar artista',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } }
              }
            }
          },
          responses: { 200: { description: 'Artista actualizado' }, 404: { description: 'No encontrado' } }
        },
        delete: {
          tags: ['Artists'],
          summary: 'Eliminar artista',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Eliminado' }, 404: { description: 'No encontrado' } }
        }
      },
      '/api/songs': {
        get: {
          tags: ['Songs'],
          summary: 'Obtener todas las canciones',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: { 200: { description: 'Lista de canciones con paginación' } }
        },
        post: {
          tags: ['Songs'],
          summary: 'Crear canción',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'artistId'],
                  properties: {
                    title: { type: 'string', minLength: 3, maxLength: 40 },
                    artistId: { type: 'integer' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Canción creada' }, 404: { description: 'Artista no encontrado' } }
        }
      },
      '/api/songs/{id}': {
        get: {
          tags: ['Songs'],
          summary: 'Obtener canción por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Canción' }, 404: { description: 'No encontrada' } }
        },
        patch: {
          tags: ['Songs'],
          summary: 'Actualizar canción',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    artistId: { type: 'integer' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Canción actualizada' }, 404: { description: 'No encontrada' } }
        },
        delete: {
          tags: ['Songs'],
          summary: 'Eliminar canción',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Eliminada' }, 404: { description: 'No encontrada' } }
        }
      },
      '/api/polls': {
        get: {
          tags: ['Polls'],
          summary: 'Obtener todas las encuestas',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: { 200: { description: 'Lista de encuestas' } }
        },
        post: {
          tags: ['Polls'],
          summary: 'Crear encuesta',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'description', 'songs'],
                  properties: {
                    name: { type: 'string', minLength: 3, maxLength: 40 },
                    description: { type: 'string', minLength: 3 },
                    songs: {
                      type: 'array',
                      items: { type: 'object', properties: { songId: { type: 'integer' } } },
                      minItems: 1
                    }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Encuesta creada' } }
        }
      },
      '/api/polls/{id}': {
        get: {
          tags: ['Polls'],
          summary: 'Obtener encuesta por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Encuesta' }, 404: { description: 'No encontrada' } }
        },
        patch: {
          tags: ['Polls'],
          summary: 'Actualizar encuesta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    statusId: { type: 'integer', enum: [0, 1, 2] }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Encuesta actualizada' }, 404: { description: 'No encontrada' } }
        },
        delete: {
          tags: ['Polls'],
          summary: 'Eliminar encuesta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Eliminada' }, 404: { description: 'No encontrada' } }
        }
      },
      '/api/polls/{id}/songs': {
        post: {
          tags: ['Polls'],
          summary: 'Agregar canciones a encuesta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'object', properties: { songId: { type: 'integer' } } },
                  minItems: 1
                }
              }
            }
          },
          responses: { 200: { description: 'Canciones agregadas' }, 404: { description: 'Encuesta no encontrada' } }
        },
        delete: {
          tags: ['Polls'],
          summary: 'Eliminar canciones de encuesta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'object', properties: { songId: { type: 'integer' } } }
                }
              }
            }
          },
          responses: { 200: { description: 'Canciones eliminadas' }, 404: { description: 'Encuesta no encontrada' } }
        }
      }
    },
    components: {
      schemas: {
        Artist: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          }
        },
        Song: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            artistId: { type: 'integer' }
          }
        },
        Poll: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            statusId: { type: 'integer' },
            songs: { type: 'array', items: { type: 'object', properties: { songId: { type: 'integer' } } } }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec