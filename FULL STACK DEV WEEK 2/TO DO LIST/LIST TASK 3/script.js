let tasks = [];
let currentFilter = "all";
let listVisible = true;

// 5-theme toggle system
const themes = ["default", "dark"];
let currentThemeIndex = 0;

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  document.body.className = themes[currentThemeIndex];
  document.querySelector('.dom-buttons button:first-child').textContent = `Theme: ${themes[currentThemeIndex]}`;
  console.log(`Theme changed to: ${themes[currentThemeIndex]}`); // Debug log
}

function renderTasks() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";
  list.style.display = listVisible ? "block" : "none";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.color = "#94a3b8";
    emptyMessage.style.fontStyle = "italic";
    emptyMessage.style.listStyle = "none";
    emptyMessage.style.padding = "12px";

    if (currentFilter === "active") {
      emptyMessage.textContent = "No tasks currently active.";
    } else if (currentFilter === "completed") {
      emptyMessage.textContent = "No completed tasks yet.";
    } else {
      emptyMessage.textContent = "No tasks yet. Add one!";
    }

    list.appendChild(emptyMessage);
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "active";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(index);

    const taskLeft = document.createElement("div");
    taskLeft.className = "task-left";

    const span = document.createElement("span");
    span.textContent = task.text;

    const status = document.createElement("div");
    status.className = "status";
    status.textContent = task.completed ? "✔ Completed" : "• Active";

    taskLeft.appendChild(span);
    taskLeft.appendChild(status);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(index);

    li.appendChild(checkbox);
    li.appendChild(taskLeft);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    input.value = "";
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function done() {
  window.alert("Done!");
}

function toggleList() {
  listVisible = !listVisible;
  renderTasks();
}

document.getElementById("todo-input").addEventListener("keyup", function (e) {
  if (e.key === "Enter") addTask();
});

window.onload = () => {
  renderTasks();
  document.querySelector('.dom-buttons button:first-child').textContent = `Theme: ${themes[currentThemeIndex]}`;
  console.log(`Initial theme: ${themes[currentThemeIndex]}`); // Debug log
};