# JavaScript Day 4 Workspace

An interactive practice project by **Zeeshan Fida** for the **Tech SG Studio internship**, built with HTML, CSS, and JavaScript.

## Tasks

### 1. Counter and Theme Toggle

- Increase, decrease, and reset the counter.
- Prevent the counter from going below zero.
- Switch between light and dark mode.
- Save the selected theme in localStorage and restore it after refresh.

### 2. Registration Form Validation

- Validate name, email, password, and confirm password.
- Show error messages below invalid fields.
- Require a password of at least 8 characters.
- Check that both passwords match.
- Prevent invalid submission and show success when all fields are valid.
- Include a show-password option.

This is a frontend validation demo. It does not create accounts, save passwords, or send registration data to a server.

### 3. To-Do App

- Add tasks using the button or Enter key.
- Mark tasks complete or pending.
- Delete tasks.
- Filter by All, Pending, or Done.
- Display total, pending, and completed counts.
- Edit task descriptions and optional due dates.
- Highlight overdue pending tasks.
- Save tasks in localStorage.

## Interface

- Responsive layout for desktop and mobile
- Mobile hamburger navigation
- Light and dark themes
- Accessible labels and keyboard controls
- Separate HTML, CSS, and JavaScript files
- No frameworks or external dependencies

## Files

- `index.html` — Page structure and forms
- `style.css` — Styling, themes, and responsive layouts
- `script.js` — Events, validation, counter, and task management
- `README.md` — Project documentation

## Run Locally

1. Download or clone the repository.
2. Keep the project files in the same folder.
3. Open `index.html` in a browser.

You can also run the project using VS Code Live Server.

No installation or build command is required.

## Storage

Theme preferences and tasks are stored in the current browser using localStorage.

Data is not synced across devices. Clearing browser storage removes saved data. If storage is unavailable, the interface still works and displays a saving warning.

## Manual Checks

- Confirm the counter cannot go below zero.
- Change the theme and refresh the page.
- Submit empty or invalid registration fields.
- Try a short password and mismatched passwords.
- Submit valid details and check the success message.
- Add, complete, filter, edit, and delete tasks.
- Refresh the page to check saved tasks.
- Check the hamburger menu on a mobile-sized screen.

## Author

**Zeeshan Fida**

Tech SG Studio — Day 4 JavaScript Practice
