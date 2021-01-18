---
name: 'Milestone: Back-end II'
about: Focus on building out Auth and connecting to APIs
title: 'Milestone: Back-end II'
labels: ''
assignees: ''

---

---

name: "Milestone: Back-end II"
about: Focus on building out Auth and connecting to APIs
title: "Milestone: Back-end II"
labels: milestone

---

During this milestone I will be working on creating my migrations, models, seed data, validation, and route structure.

### Integrations:
**Spotify(https://developer.spotify.com/)**
- Listen to playlist on user's account

Example:
**[Github](https://developer.github.com/v3/)**
- Get list of user's gists
- Create new gists
- Edit gist
- Delete gist

### Auth:
- /api/auth
  - POST /signup
    - **Request Body**: firstname, lastname, username, email, password
    - **Response Data**: token (string), loggedIn (boolean)
  - POST /login
    - **Request Body**: email, password
    - **Response Data**: token (string), loggedIn (boolean)
  - POST /forgot
    - **Request Body**: email
    - **Response Data**: 200 status code (sends email)
  - POST /reset
    - **Request Query**: reset_token
    - **Request Body**: newPassword
    - **Response Data**: token (string), loggedIn (boolean)

Example:
Custom Authentication
- /api/auth
  - POST /signup
    - **Request Body**: name, email, password
    - **Response Data**: token (string), loggedIn (boolean)
  - POST /login
    - **Request Body**: email, password
    - **Response Data**: token (string), loggedIn (boolean)
  - POST /forgot
    - **Request Body**: email
    - **Response Data**: 200 status code (sends email)
  - POST /reset
    - **Request Query**: reset_token
    - **Request Body**: newPassword
    - **Response Data**: token (string), loggedIn (boolean)

### Things I might struggle with...
I'm weak in authentication for login.
