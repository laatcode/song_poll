# Song Poll API

Backend para sistema de encuestas de canciones.

## Endpoints

### Artists

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/artists` | Obtener todos los artistas (paginación) |
| GET | `/api/artists/:id` | Obtener artista por ID |
| POST | `/api/artists` | Crear artista |
| PATCH | `/api/artists/:id` | Actualizar artista |
| DELETE | `/api/artists/:id` | Eliminar artista |

### Songs

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/songs` | Obtener todas las canciones (paginación) |
| GET | `/api/songs/:id` | Obtener canción por ID |
| POST | `/api/songs` | Crear canción |
| PATCH | `/api/songs/:id` | Actualizar canción |
| DELETE | `/api/songs/:id` | Eliminar canción |

### Polls

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/polls` | Obtener todas las encuestas (paginación) |
| GET | `/api/polls/:id` | Obtener encuesta por ID |
| POST | `/api/polls` | Crear encuesta |
| PATCH | `/api/polls/:id` | Actualizar encuesta |
| DELETE | `/api/polls/:id` | Eliminar encuesta |
| POST | `/api/polls/:id/songs` | Agregar canciones a encuesta |
| DELETE | `/api/polls/:id/songs` | Eliminar canciones de encuesta |

## Paginación

Todos los endpoints GET soportan paginación:

```
GET /api/artists?page=1&limit=10
```

## Respuesta

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Desarrollo

```bash
npm install
npm run dev    # Iniciar con Docker
npm start     # Iniciar sin Docker
npm test      # Ejecutar tests

## Migraciones SQL

Las migraciones están en `/db/migrations/`.
Ejecutarlas con el comando npm db:migrations.

## Documentación Swagger

Acceder a: `http://localhost:5000/api/docs`

JSON: `http://localhost:5000/api/docs.json`
```