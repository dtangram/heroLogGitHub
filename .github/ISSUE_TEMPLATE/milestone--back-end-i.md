---
name: 'Milestone: Back-end I'
about: Focus on building out models and route structure
title: 'Milestone: Back-end I'
labels: ''
assignees: ''

---

---

name: "Milestone: Back-end I"
about: Focus on building out models and route structure
title: "Milestone: Back-end II"
labels: milestone

---

During this milestone, I will be working on creating my migrations, models, seed data, validation, and CRUD.

###  Models:
User
  - id (uuidV1)
  - firstname (string, notNull, minLength: 3)
  - lastname (string, notNull, minLength: 3)
  - email (string, notNull, minLength: 3)
  - username (string, notNull, minLength: 3)
  - password (string, Null, minLength: 6)
  - access_token (string, Null)
  - type (enum['spotify', 'standard'], notNull, in: ['spotify', 'standard'])
  - createdAt (date, notNull)
  - updatedAt (date, notNull)
  
Songs
  - id (uuidV1)
  - title (string, notNull)
  - artist (string, notNull)
  - album (string, notNull)
  - year (integer, notNull)
  - createdAt (date, notNull)
  - updatedAt (date, notNull)
  
Playlist
  - id (uuidV1)
  - title (string, notNull)
  - song (notNull)
  - createdAt (date, notNull)
  - updatedAt (date, notNull)

Example:
1. Quiz
  - id (uuid, uuidV1)
  - name (string, notNull, minLength: 5)
  - type (enum['private', 'public'], notNull, in: ['private', 'public'])

### Routes:
- /api/users
  - GET /
    - **Request Parameter**: id
  - POST /user/new
    - **Request Body**: username, firstname, lastname, email, password, access_token, type
    - **Response Parameter**: id
  - PUT /user/:id
    - **Response Parameter**: id
  - DELETE /user/:id
    - **Response Parameter**: id
    
- /api/profile
  - GET /
    - **Request Parameter**: id
    - **Request Body**: username, firstname, lastname, email
    
- /api/playlist
  - GET /
    - **Request Parameter**: userid
  - POST /playlist/new
    - **Request Parameter**: id
    - **Request Body**: title, song
  - PUT /playlist/:id
    - **Request Parameter**: id
  - DELETE /playlist/:id
    - **Response Parameter**: id
    
- /api/song
  - GET /
    - **Request Parameter**: userid
  - POST /song/new
    - **Request Parameter**: id
    - **Request Body**: title, artist, album, year
  - PUT /song/:id
    - **Request Parameter**: id
  - DELETE /song/:id
    - **Response Parameter**: id


Example:
- /api/quizzes
  - GET /
    - **Request Body**: N/A
    - **Response Data**: array of quizzes [{name: '', type: 'private|public'}]
  - POST /quiz
    - **Request Body**: name, type
    - **Response Data**: id

### Things I might struggle with...
Storing tokens in the database is where I'm weak. I may need help figuring out how allow users to choose songs to add to their playlist.