🎬 Flatadango Movie Theater
Welcome to Flatadango, a mini web application for browsing films, viewing detailed information, and buying tickets in a simulated movie theater experience.

This project demonstrates DOM manipulation, event handling, RESTful API interaction (CRUD), and dynamic UI updates using JavaScript, HTML, and CSS, with a JSON server acting as the backend.

🚀 Features
Browse Movies: Sidebar lists all currently showing films with posters and titles.

Detailed View: Click a film to view its poster, runtime, showtime, description, and available tickets.

Buy Tickets: Decrease ticket availability in real-time when purchasing.

Sold Out Handling: Films marked as "Sold Out" become unclickable and grayed out.

Delete Films: Admin-style delete button removes a film from the UI and backend.

State Persistence: Selected film is remembered using localStorage.

📁 Project Structure
bash
Flatadango/
├── index.html       # Main HTML layout
├── style.css        # Styles and responsive layout
├── script.js        # Application logic and event handling
├── db.json          # JSON Server data source

🧑‍💻 Technologies Used
JavaScript (Vanilla)

HTML5 & CSS3

JSON Server (as a fake RESTful API)

🛠️ How to Run This Project
1. Clone the Repository
bash
git clone https://github.com/yourusername/flatadango.git
cd flatadango
2. Set Up JSON Server
Make sure you have json-server installed globally or in your project:

bash
npm install -g json-server
Then, run the server with your db.json:

bash
json-server --watch db.json
This should run on: http://localhost:3000

3. Open the App
Simply open index.html in your browser.

🧩 Core Functionalities Explained
Load Films
Fetches film data from the JSON server and displays them in the sidebar with clickable posters.

Display Film Details
Updates the main section to show the currently selected movie’s info, poster, and remaining tickets.

Buy Tickets
Decreases tickets_sold, updates the UI, and prevents further purchase when capacity is reached.

Delete Film
Removes film from the server and DOM with a single click (useful for admin control).

LocalStorage
Remembers the last selected film across page refreshes.


📚 Future Improvements
Add film search or filters

Add admin panel for adding/editing films

User login for personalized ticket tracking

Confirmation dialogs for deleting

👩🏾‍💻 Author
Njue Sharon Kendi
Moringa School