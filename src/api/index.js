const BASE = `${import.meta.env.VITE_API_URL}/api`;
export const MEDIA_URL = import.meta.env.VITE_API_URL;

export const getArtists = () => fetch(`${BASE}/artists`).then((r) => r.json());
export const getGenres = () => fetch(`${BASE}/genres`).then((r) => r.json());
export const getSongs = () => fetch(`${BASE}/songs`).then((r) => r.json());
export const getSong = (id) =>
  fetch(`${BASE}/songs/${id}`).then((r) => r.json());

export const createSong = (data) =>
  fetch(`${BASE}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateSong = (id, data) =>
  fetch(`${BASE}/songs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteSong = (id) =>
  fetch(`${BASE}/songs/${id}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const createArtist = (data) =>
  fetch(`${BASE}/artists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateArtist = (id, data) =>
  fetch(`${BASE}/artists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteArtist = (id) =>
  fetch(`${BASE}/artists/${id}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const createGenre = (data) =>
  fetch(`${BASE}/genres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMoods = () => fetch(`${BASE}/moods`).then((r) => r.json());

export const getSongGenres = (songId) =>
  fetch(`${BASE}/songs/${songId}/genres`).then((r) => r.json());
export const addSongGenre = (songId, genreId) =>
  fetch(`${BASE}/songs/${songId}/genres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ genre_id: genreId }),
  }).then((r) => r.json());
export const removeSongGenre = (songId, genreId) =>
  fetch(`${BASE}/songs/${songId}/genres/${genreId}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const getSongMoods = (songId) =>
  fetch(`${BASE}/songs/${songId}/moods`).then((r) => r.json());
export const addSongMood = (songId, moodId) =>
  fetch(`${BASE}/songs/${songId}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood_id: moodId }),
  }).then((r) => r.json());
export const removeSongMood = (songId, moodId) =>
  fetch(`${BASE}/songs/${songId}/moods/${moodId}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const createMood = (data) =>
  fetch(`${BASE}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getSongLinks = (songId) =>
  fetch(`${BASE}/songs/${songId}/links`).then((r) => r.json());
export const addSongLink = (songId, data) =>
  fetch(`${BASE}/songs/${songId}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
export const deleteSongLink = (songId, linkId) =>
  fetch(`${BASE}/songs/${songId}/links/${linkId}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const getSongAudio = (songId) =>
  fetch(`${BASE}/songs/${songId}/audio`).then((r) => r.json());

export const uploadAudio = (songId, formData) =>
  fetch(`${BASE}/songs/${songId}/audio`, {
    method: "POST",
    body: formData, // no Content-Type header — browser sets it automatically for FormData
  }).then((r) => r.json());

export const deleteAudio = (songId, audioId) =>
  fetch(`${BASE}/songs/${songId}/audio/${audioId}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const getList = (category) =>
  fetch(`${BASE}/lists/${category}`).then((r) => r.json());
export const addToList = (category, value) =>
  fetch(`${BASE}/lists/${category}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  }).then((r) => r.json());

export const getAlbums = () => fetch(`${BASE}/albums`).then((r) => r.json());

export const getAlbum = (id) =>
  fetch(`${BASE}/albums/${id}`).then((r) => r.json());

export const createAlbum = (data) =>
  fetch(`${BASE}/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateAlbum = (id, data) =>
  fetch(`${BASE}/albums/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteAlbum = (id) =>
  fetch(`${BASE}/albums/${id}`, { method: "DELETE" }).then((r) => r.json());

export const addSongToAlbum = (albumId, data) =>
  fetch(`${BASE}/albums/${albumId}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const removeSongFromAlbum = (albumId, songId) =>
  fetch(`${BASE}/albums/${albumId}/songs/${songId}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const getSongAlbums = (songId) =>
  fetch(`${BASE}/songs/${songId}/albums`).then((r) => r.json());

export const getDashboard = () =>
  fetch(`${BASE}/dashboard`).then((r) => r.json());

export const getSongImages = (songId) =>
  fetch(`${BASE}/songs/${songId}/images`).then((r) => r.json());

export const uploadSongImage = (songId, formData) =>
  fetch(`${BASE}/songs/${songId}/images`, {
    method: "POST",
    body: formData,
  }).then((r) => r.json());

export const deleteSongImage = (songId, imageId) =>
  fetch(`${BASE}/songs/${songId}/images/${imageId}`, {
    method: "DELETE",
  }).then((r) => r.json());
