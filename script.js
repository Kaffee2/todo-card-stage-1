const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const statusText = document.querySelector('[data-testid="test-todo-status"]');
const card = document.querySelector('[data-testid="test-todo-card"]');

const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const descBox = document.querySelector('[data-testid="test-todo-collapsible-section"]');

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');

const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

const title = document.querySelector('[data-testid="test-todo-title"]');
const desc = document.querySelector('[data-testid="test-todo-description"]');

const editTitle = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDesc = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPriority = document.querySelector('[data-testid="test-todo-edit-priority-select"]');

const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const priorityText = document.querySelector('[data-testid="test-todo-priority"]');

const timeEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueEl = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

// INITIAL STATE
let dueDate = new Date("2026-03-01T18:00:00Z");

// STATUS SYNC
function updateStatus(val) {
  statusText.textContent = val;

  if (val === "Done") {
    checkbox.checked = true;
    card.classList.add("completed");
    timeEl.textContent = "Completed";
  } else {
    checkbox.checked = false;
    card.classList.remove("completed");
  }
}

checkbox.addEventListener("change", () => {
  updateStatus(checkbox.checked ? "Done" : "Pending");
});

statusControl.addEventListener("change", () => {
  updateStatus(statusControl.value);
});

// EXPAND / COLLAPSE
expandBtn.addEventListener("click", () => {
  const expanded = expandBtn.getAttribute("aria-expanded") === "true";

  expandBtn.setAttribute("aria-expanded", !expanded);
  descBox.classList.toggle("collapsed");

  expandBtn.textContent = expanded ? "Show more" : "Show less";
});

// EDIT MODE
editBtn.addEventListener("click", () => {
  editForm.classList.remove("hidden");

  editTitle.value = title.textContent;
  editDesc.value = desc.textContent;
  editPriority.value = priorityText.textContent;
});

saveBtn.addEventListener("click", () => {
  title.textContent = editTitle.value;
  desc.textContent = editDesc.value;
  priorityText.textContent = editPriority.value;

  setPriority(editPriority.value);

  editForm.classList.add("hidden");
});

cancelBtn.addEventListener("click", () => {
  editForm.classList.add("hidden");
});

// PRIORITY
function setPriority(val) {
  priorityIndicator.className = "";
  priorityIndicator.classList.add(val.toLowerCase());
}
setPriority("High");

// TIME LOGIC
function updateTime() {
  if (statusText.textContent === "Done") return;

  const now = new Date();
  const diff = dueDate - now;

  if (diff < 0) {
    overdueEl.textContent = "Overdue";
    overdueEl.classList.add("overdue");

    const hours = Math.floor(Math.abs(diff) / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      timeEl.textContent = `Overdue by ${days} day(s)`;
    } else {
      timeEl.textContent = `Overdue by ${hours} hour(s)`;
    }

    return;
  }

  overdueEl.textContent = "";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    timeEl.textContent = `Due in ${days} day(s)`;
  } else if (hours > 0) {
    timeEl.textContent = `Due in ${hours} hour(s)`;
  } else {
    timeEl.textContent = `Due in ${minutes} minute(s)`;
  }
}

updateTime();
setInterval(updateTime, 60000);