"use strict";

// ==========================================
// Shared helpers
// ==========================================

const getElement = (id) => document.getElementById(id);

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function showMessage(id, text, isError = false) {
  const element = getElement(id);

  element.textContent = text;
  element.classList.toggle("error", isError);
}

// ==========================================
// Hamburger navigation
// ==========================================

const menuToggle = getElement("menu-toggle");
const navigation = getElement("main-navigation");

function setMenuOpen(isOpen) {
  navigation.classList.toggle("is-open", isOpen);

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
}

menuToggle.addEventListener("click", () => {
  const isOpen =
    menuToggle.getAttribute("aria-expanded") === "true";

  setMenuOpen(!isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("click", (event) => {
  if (
    !menuToggle.contains(event.target) &&
    !navigation.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

window.matchMedia("(max-width: 760px)")
  .addEventListener("change", () => setMenuOpen(false));

// ==========================================
// Task 1: Counter
// ==========================================

let counter = 0;

function renderCounter() {
  getElement("counter-value").textContent = counter;
  getElement("decrease").disabled = counter === 0;

  getElement("increase").disabled =
    counter === Number.MAX_SAFE_INTEGER;
}

getElement("increase").addEventListener("click", () => {
  if (counter < Number.MAX_SAFE_INTEGER) {
    counter += 1;
  }

  renderCounter();
});

getElement("decrease").addEventListener("click", () => {
  counter = Math.max(0, counter - 1);
  renderCounter();
});

getElement("reset-counter").addEventListener("click", () => {
  counter = 0;
  renderCounter();
});

// ==========================================
// Task 1: Theme toggle with localStorage
// ==========================================

const THEME_KEY = "zeeshan-day4-theme";
const themeToggle = getElement("theme-toggle");

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;

  themeToggle.textContent =
    isDark ? "Light mode" : "Dark mode";

  themeToggle.setAttribute("aria-pressed", String(isDark));

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );

  getElement("theme-status").textContent =
    `Current theme: ${isDark ? "Dark" : "Light"} mode`;
}

const savedTheme = readStorage(THEME_KEY);

applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const newTheme =
    document.documentElement.dataset.theme === "dark"
      ? "light"
      : "dark";

  applyTheme(newTheme);

  if (!writeStorage(THEME_KEY, newTheme)) {
    getElement("theme-status").textContent +=
      " — Browser storage is unavailable; this choice cannot be saved.";
  }
});

// ==========================================
// Task 2: Registration validation
// ==========================================

const registrationForm = getElement("registration-form");

const registrationFields = {
  name: getElement("full-name"),
  email: getElement("email"),
  password: getElement("password"),
  confirm: getElement("confirm-password")
};

const errorIds = {
  name: "name-error",
  email: "email-error",
  password: "password-error",
  confirm: "confirm-error"
};

let registrationAttempted = false;

function getFieldError(fieldName) {
  const value = registrationFields[fieldName].value;

  if (fieldName === "name") {
    return value.trim() ? "" : "Please enter your name.";
  }

  if (fieldName === "email") {
    const email = value.trim();

    if (!email) {
      return "Please enter your email address.";
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return validEmail &&
      !registrationFields.email.validity.typeMismatch
      ? ""
      : "Please enter a valid email address.";
  }

  if (fieldName === "password") {
    if (!value) {
      return "Please enter a password.";
    }

    return value.length >= 8
      ? ""
      : "Password must contain at least 8 characters.";
  }

  if (fieldName === "confirm") {
    if (!value) {
      return "Please confirm your password.";
    }

    return value === registrationFields.password.value
      ? ""
      : "Passwords do not match.";
  }

  return "";
}

function validateField(fieldName) {
  const error = getFieldError(fieldName);
  const input = registrationFields[fieldName];

  getElement(errorIds[fieldName]).textContent = error;
  input.setAttribute("aria-invalid", String(Boolean(error)));

  return !error;
}

Object.entries(registrationFields).forEach(([name, input]) => {
  input.addEventListener("blur", () => validateField(name));

  input.addEventListener("input", () => {
    showMessage("registration-message", "");

    if (
      registrationAttempted ||
      input.getAttribute("aria-invalid") === "true"
    ) {
      validateField(name);
    }

    if (
      name === "password" &&
      (
        registrationAttempted ||
        registrationFields.confirm.value !== ""
      )
    ) {
      validateField("confirm");
    }
  });
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  registrationAttempted = true;

  const results = Object.keys(registrationFields).map(
    (name) => validateField(name)
  );

  if (!results.every(Boolean)) {
    showMessage(
      "registration-message",
      "Please correct the highlighted fields before continuing.",
      true
    );

    const firstInvalid = Object.values(registrationFields).find(
      (input) => input.getAttribute("aria-invalid") === "true"
    );

    firstInvalid.focus();
    return;
  }

  const name = registrationFields.name.value.trim();

  showMessage(
    "registration-message",
    `Success, ${name}! All fields are valid. This demo does not create an account.`
  );

  // Do not store, log, or transmit passwords.
  registrationFields.password.value = "";
  registrationFields.confirm.value = "";

  getElement("show-passwords").checked = false;

  registrationFields.password.type = "password";
  registrationFields.confirm.type = "password";

  registrationAttempted = false;
});

getElement("show-passwords").addEventListener(
  "change",
  (event) => {
    const type = event.target.checked ? "text" : "password";

    registrationFields.password.type = type;
    registrationFields.confirm.type = type;
  }
);

// ==========================================
// Task 3: To-do app
// ==========================================

const TASKS_KEY = "zeeshan-day4-tasks";
let activeFilter = "all";
let editingTaskId = null;

function isValidDate(value) {
  if (value === "") {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (year < 1) {
    return false;
  }

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function loadTasks() {
  const saved = readStorage(TASKS_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const usedIds = new Set();

    return parsed.filter((task) => {
      const valid =
        task !== null &&
        typeof task === "object" &&
        typeof task.id === "string" &&
        task.id.length > 0 &&
        !usedIds.has(task.id) &&
        typeof task.title === "string" &&
        task.title.trim().length > 0 &&
        task.title.length <= 150 &&
        typeof task.done === "boolean" &&
        typeof task.dueDate === "string" &&
        isValidDate(task.dueDate);

      if (valid) {
        usedIds.add(task.id);
      }

      return valid;
    });
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  return writeStorage(TASKS_KEY, JSON.stringify(tasks));
}

function finishTaskChange(message) {
  const saved = saveTasks();

  renderTasks();

  showMessage(
    "task-message",
    saved
      ? message
      : `${message} Browser storage is unavailable; changes will reset after refresh.`,
    !saved
  );
}

function createTaskId() {
  let id;

  do {
    id = window.crypto &&
      typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } while (tasks.some((task) => task.id === id));

  return id;
}

function getToday() {
  const date = new Date();

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDueDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function renderStats() {
  const doneCount = tasks.filter((task) => task.done).length;
  const pendingCount = tasks.length - doneCount;

  getElement("total-tasks").textContent = tasks.length;
  getElement("pending-tasks").textContent = pendingCount;
  getElement("completed-tasks").textContent = doneCount;

  getElement("pending-summary").textContent =
    `${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} pending`;
}

function createActionButton(label, className, handler) {
  const button = createElement(
    "button",
    `small-button ${className}`,
    label
  );

  button.type = "button";
  button.addEventListener("click", handler);

  return button;
}

function createEditForm(task) {
  const form = createElement("form", "edit-form");

  const titleField = createElement("div", "field");
  const titleLabel = createElement("label", "", "Task description");
  const titleInput = createElement("input");

  titleInput.id = `edit-title-${task.id}`;
  titleInput.type = "text";
  titleInput.maxLength = 150;
  titleInput.required = true;
  titleInput.value = task.title;
  titleLabel.htmlFor = titleInput.id;

  titleField.append(titleLabel, titleInput);

  const dateField = createElement("div", "field");
  const dateLabel = createElement("label", "", "Due date");
  const dateInput = createElement("input");

  dateInput.id = `edit-date-${task.id}`;
  dateInput.type = "date";
  dateInput.max = "9999-12-31";
  dateInput.value = task.dueDate;
  dateLabel.htmlFor = dateInput.id;

  dateField.append(dateLabel, dateInput);

  const actions = createElement("div", "edit-actions");

  const saveButton = createElement("button", "button", "Save");
  saveButton.type = "submit";

  const cancelButton = createActionButton("Cancel", "", () => {
    editingTaskId = null;
    renderTasks();
    focusTaskEditButton(task.id);
  });

  actions.append(saveButton, cancelButton);
  form.append(titleField, dateField, actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();

    if (!title) {
      showMessage("task-message", "Task description cannot be empty.", true);
      titleInput.focus();
      return;
    }

    if (!isValidDate(dateInput.value)) {
      showMessage("task-message", "Please enter a valid due date.", true);
      dateInput.focus();
      return;
    }

    task.title = title;
    task.dueDate = dateInput.value;
    editingTaskId = null;

    finishTaskChange("Task updated successfully.");
    focusTaskEditButton(task.id);
  });

  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      editingTaskId = null;
      renderTasks();
      focusTaskEditButton(task.id);
    }
  });

  return form;
}

function focusTaskEditButton(id) {
  const button = getElement(`edit-button-${id}`);

  if (button) {
    button.focus();
  }
}

function renderTasks() {
  const list = getElement("task-list");
  list.replaceChildren();

  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === "done") {
      return task.done;
    }

    if (activeFilter === "pending") {
      return !task.done;
    }

    return true;
  });

  visibleTasks.forEach((task) => {
    const item = createElement(
      "li",
      task.done ? "task-item done" : "task-item"
    );

    if (editingTaskId === task.id) {
      item.append(createEditForm(task));
      list.append(item);
      return;
    }

    const checkbox = createElement("input");
    checkbox.id = `complete-${task.id}`;
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.setAttribute(
      "aria-label",
      `${task.done ? "Mark pending" : "Mark complete"}: ${task.title}`
    );

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;

      finishTaskChange(
        task.done ? "Task completed." : "Task marked pending."
      );

      const updatedCheckbox = getElement(`complete-${task.id}`);

      if (updatedCheckbox) {
        updatedCheckbox.focus();
      } else {
        getElement("task-input").focus();
      }
    });

    const content = createElement("div", "task-content");
    content.append(createElement("p", "task-title", task.title));

    if (task.dueDate) {
      const overdue = !task.done && task.dueDate < getToday();

      const dateLabel = createElement(
        "span",
        overdue ? "task-date-label overdue" : "task-date-label",
        `${overdue ? "Overdue" : "Due"} · ${formatDueDate(task.dueDate)}`
      );

      content.append(dateLabel);
    }

    const actions = createElement("div", "task-actions");

    const editButton = createActionButton("Edit", "", () => {
      editingTaskId = task.id;
      showMessage("task-message", "");
      renderTasks();

      getElement(`edit-title-${task.id}`).focus();
    });

    editButton.id = `edit-button-${task.id}`;
    editButton.setAttribute("aria-label", `Edit task: ${task.title}`);

    const deleteButton = createActionButton("Delete", "delete", () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);

      if (editingTaskId === task.id) {
        editingTaskId = null;
      }

      finishTaskChange("Task deleted.");
      getElement("task-input").focus();
    });

    deleteButton.setAttribute(
      "aria-label",
      `Delete task: ${task.title}`
    );

    actions.append(editButton, deleteButton);
    item.append(checkbox, content, actions);
    list.append(item);
  });

  const emptyState = getElement("empty-state");
  emptyState.hidden = visibleTasks.length > 0;

  if (tasks.length === 0) {
    emptyState.querySelector("h3").textContent = "No tasks yet.";
    emptyState.querySelector("p").textContent =
      "Add your first task to get started.";
  } else {
    emptyState.querySelector("h3").textContent =
      "No tasks in this view.";

    emptyState.querySelector("p").textContent =
      "Choose another filter to see your tasks.";
  }

  renderStats();
}

getElement("task-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = getElement("task-input").value.trim();
  const dueDate = getElement("task-date").value;

  if (!title) {
    showMessage("task-message", "Please enter a task description.", true);
    getElement("task-input").focus();
    return;
  }

  if (!isValidDate(dueDate)) {
    showMessage("task-message", "Please enter a valid due date.", true);
    return;
  }

  tasks.push({
    id: createTaskId(),
    title,
    dueDate,
    done: false
  });

  // Show all tasks so the new task is visible immediately.
  activeFilter = "all";
  editingTaskId = null;
  updateFilterButtons();

  event.target.reset();
  finishTaskChange("Task added successfully.");
  getElement("task-input").focus();
});

function updateFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    editingTaskId = null;

    updateFilterButtons();
    renderTasks();
    showMessage("task-message", "");
  });
});

// Refresh overdue labels when returning to the page.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && editingTaskId === null) {
    renderTasks();
  }
});

// ==========================================
// Initial rendering
// ==========================================

renderCounter();
updateFilterButtons();
renderTasks();