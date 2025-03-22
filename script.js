// Base URL for JSON Server
const BASE_URL = 'http://localhost:3000';

// DOM elements
const filmList = document.getElementById('films');
const title = document.getElementById('title');
const poster = document.getElementById('poster');
const runtime = document.getElementById('runtime');
const showtime = document.getElementById('showtime');
const description = document.getElementById('description');
const ticketBtn = document.getElementById('buy-ticket');
const availableTickets = document.getElementById('available-tickets');

let currentFilm = null;

// Fetch all films and render them in the sidebar
function loadFilms() {
  fetch(`${BASE_URL}/films`)
    .then(res => res.json())
    .then(films => {
      filmList.innerHTML = ''; // Clear placeholder
      films.forEach(film => renderFilmItem(film));
      displayFilmDetails(films[0]); // Show first film's details
    })
    .catch(err => console.error('Error loading films:', err));
}

// Render each film in the film list
function renderFilmItem(film) {
  const li = document.createElement('li');
  li.textContent = film.title;
  li.classList.add('film', 'item');
  li.dataset.id = film.id;

  if (film.capacity - film.tickets_sold === 0) {
    li.classList.add('sold-out');
  }

  li.addEventListener('click', () => displayFilmDetails(film));
  filmList.appendChild(li);
}

// Display the selected film's details
function displayFilmDetails(film) {
  currentFilm = film;
  title.textContent = film.title;
  poster.src = film.poster;
  runtime.textContent = `${film.runtime} minutes`;
  showtime.textContent = film.showtime;
  description.textContent = film.description;

  const ticketsAvailable = film.capacity - film.tickets_sold;
  availableTickets.textContent = ticketsAvailable;

  ticketBtn.textContent = ticketsAvailable > 0 ? 'Buy Ticket' : 'Sold Out';
  ticketBtn.disabled = ticketsAvailable === 0;
}

// Handle Buy Ticket click
ticketBtn.addEventListener('click', () => {
  if (!currentFilm) return;

  let ticketsLeft = currentFilm.capacity - currentFilm.tickets_sold;

  if (ticketsLeft > 0) {
    currentFilm.tickets_sold += 1;
    updateTickets(currentFilm.id, currentFilm.tickets_sold);
    availableTickets.textContent = currentFilm.capacity - currentFilm.tickets_sold;

    if (currentFilm.capacity - currentFilm.tickets_sold === 0) {
      ticketBtn.textContent = 'Sold Out';
      ticketBtn.disabled = true;
      // Optional: update menu item style to sold out
      const soldOutFilm = [...filmList.children].find(li => li.dataset.id == currentFilm.id);
      soldOutFilm.classList.add('sold-out');
    }
  }
});

// PATCH request to update tickets_sold
function updateTickets(id, ticketsSold) {
  fetch(`${BASE_URL}/films/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickets_sold: ticketsSold })
  })
  .then(res => res.json())
  .then(data => console.log('Ticket updated:', data))
  .catch(err => console.error('Error updating ticket:', err));
}

// Load everything on page load
document.addEventListener('DOMContentLoaded', loadFilms);
