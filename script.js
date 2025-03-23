// Base URL for JSON Server
const BASE_URL = 'http://localhost:3000';

// DOM elements
const filmList = document.getElementById('films');
const title = document.getElementById('title');
const poster = document.getElementById('poster');
const container = document.getElementById('film-posters');
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
      films.forEach(film => {
        renderFilmItem(film);
      });

      if (!currentFilm) {
        displayFilmDetails(films[0]); // Show first film's details
      } else {
        const updated = films.find(f => f.id === currentFilm.id);
        if (updated) displayFilmDetails(updated);
      }
    })
    .catch(err => console.error('Error loading films:', err));
}

function fetchAllFilms() {
    fetch("http://localhost:3000/films")
      .then(res => res.json())
      .then(films => {
        films.forEach(film => renderFilmItem(film));
      });
  }
// Render each film in the film list
function renderFilmItem(film) {
  const li = document.createElement('li');
  li.className = 'film item';
  li.textContent = film.title;
  li.classList.add('film', 'item');
  li.dataset.id = film.id;

  const posterImg = document.createElement('img');
  posterImg.src = film.poster;
  posterImg.alt = `${film.title} Poster`;
  posterImg.classList.add('film-poster'); // Add your own CSS if needed

  const titleSpan = document.createElement('span');
  titleSpan.textContent = film.title;

  // Append poster and title to the list item
  li.appendChild(posterImg);
  li.appendChild(titleSpan);

  if (film.capacity - film.tickets_sold === 0) {
    li.classList.add('sold-out');
  }

  li.addEventListener('click', () => {
    fetch(`${BASE_URL}/films/${film.id}`)
      .then(res => res.json())
      .then(updatedFilm => displayFilmDetails(updatedFilm))
      .catch(err => console.error('Error fetching film details:', err));
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');

  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the li click
    deleteFilm(film.id, li); // Use `li` to remove from DOM
  });

  li.appendChild(deleteBtn);
  filmList.appendChild(li);
}

function renderFilmItem(film) {
    const li = document.createElement('li');
    li.className = 'film item';
    li.dataset.id = film.id;
  
    // Create poster image
    const posterImg = document.createElement('img');
    posterImg.src = film.poster;
    posterImg.alt = `${film.title} Poster`;
    posterImg.classList.add('film-poster'); // Add your own CSS if needed
  
    // Create title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = film.title;
  
    // Append poster and title to the list item
    li.appendChild(posterImg);
    li.appendChild(titleSpan);
  
    // Sold out class
    if (film.capacity - film.tickets_sold === 0) {
      li.classList.add('sold-out');
    }
  
    // Click to show film details
    li.addEventListener('click', () => {
      fetch(`${BASE_URL}/films/${film.id}`)
        .then(res => res.json())
        .then(updatedFilm => displayFilmDetails(updatedFilm))
        .catch(err => console.error('Error fetching film details:', err));
    });
  
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering film click
      deleteFilm(film.id, li);
    });
  
    li.appendChild(deleteBtn);
    filmList.appendChild(li);
  }
  
  

function deleteFilm(id, listItem) {
    fetch(`http://localhost:3000/films/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete film.");
        listItem.remove(); // Remove it from the DOM
      })
      .catch((err) => {
        console.error("Error deleting film:", err);
      });
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
      const newTicketsSold = currentFilm.tickets_sold + 1;
  
      // Send PATCH request to update the backend
      fetch(`${BASE_URL}/films/${currentFilm.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold })
      })
        .then(res => res.json())
        .then(updatedFilm => {
          // Update local film object and UI
          displayFilmDetails(updatedFilm);
  
          // Update the film item in the sidebar (mark sold-out if needed)
          const filmItem = [...filmList.children].find(li => li.dataset.id == updatedFilm.id);
          if (filmItem) {
            const isSoldOut = updatedFilm.capacity - updatedFilm.tickets_sold === 0;
            filmItem.classList.toggle('sold-out', isSoldOut);
          }
  
          // Create ticket (optional)
          createTicket(updatedFilm.id);
        })
        .catch(err => console.error('Error buying ticket:', err));
    }
  });
  
  
  // Clear film details if no films are left
  function clearFilmDetails() {
    title.textContent = '';
    poster.src = '';
    runtime.textContent = '';
    showtime.textContent = '';
    description.textContent = '';
    availableTickets.textContent = '';
    ticketBtn.textContent = 'Buy Ticket';
    ticketBtn.disabled = true;
  }  

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

function createTicket(filmId) {
    fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ film_id: filmId })
    })
      .then(res => res.json())
      .then(data => console.log('Ticket created:', data))
      .catch(err => console.error('Error creating ticket:', err));
  }
  
// Load everything on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFilms();
});
