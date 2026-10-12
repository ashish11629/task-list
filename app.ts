import { Task, TaskStatus, addTask, deleteTask, filterByStatus, updateTaskStatus } from "./model.js";

let tasks: Task[] = [];
let filter: "all" | TaskStatus = "all";

const titleInput = document.getElementById("title") as HTMLInputElement;
const statusSelect = document.getElementById("status") as HTMLSelectElement;
const addBtn = document.getElementById("add") as HTMLButtonElement;
const listEl = document.getElementById("list") as HTMLUListElement;
const chipsEl = document.getElementById("chips") as HTMLDivElement;

const filters: Array<"all" | TaskStatus> = ["all", "todo", "in-progress", "done"];

function renderChips(): void {
  chipsEl.innerHTML = filters
    .map((option) => {
      const label = option === "all" ? "All" : option;
      const active = option === filter ? " active" : "";
      return `<button type="button" data-filter="${option}" class="chip${active}">${label}</button>`;
    })
    .join("");
}

function render(): void {
  const visibleTasks = filterByStatus(tasks, filter);

  listEl.innerHTML = visibleTasks
    .map(
      (task) => `
        <li class="task" data-id="${task.id}">
          <span>${task.title}</span>
          <select data-id="${task.id}" class="task-status">
            <option value="todo" ${task.status === "todo" ? "selected" : ""}>todo</option>
            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>in-progress</option>
            <option value="done" ${task.status === "done" ? "selected" : ""}>done</option>
          </select>
          <button type="button" data-delete-id="${task.id}">Delete</button>
        </li>
      `,
    )
    .join("");

  if (visibleTasks.length === 0) {
    listEl.innerHTML = "<li class=\"task\">No tasks in this filter.</li>";
  }

  renderChips();
}

addBtn.onclick = () => {
  const title = titleInput.value.trim();
  const status = statusSelect.value as TaskStatus;

  if (!title) {
    return;
  }

  tasks = addTask(tasks, title, status);
  titleInput.value = "";
  titleInput.focus();
  render();
};

chipsEl.onclick = (event) => {
  const target = event.target as HTMLElement;
  const selectedFilter = target.dataset.filter as "all" | TaskStatus | undefined;

  if (!selectedFilter) {
    return;
  }

  filter = selectedFilter;
  render();
};

listEl.onchange = (event) => {
  const target = event.target as HTMLSelectElement;
  const taskId = Number(target.dataset.id);
  const status = target.value as TaskStatus;

  if (!Number.isFinite(taskId)) {
    return;
  }

  tasks = updateTaskStatus(tasks, taskId, status);
  render();
};

listEl.onclick = (event) => {
  const target = event.target as HTMLElement;
  const taskId = Number(target.dataset.deleteId);

  if (!Number.isFinite(taskId)) {
    return;
  }

  tasks = deleteTask(tasks, taskId);
  render();
};

render();