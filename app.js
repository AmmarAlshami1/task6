function DOMContentLoaded() {
  return new Promise((resolve, _reject) => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
}
/// function for load dom
async function mainFunction() {
  await DOMContentLoaded();

  const addButton = document.getElementById("add_button");
  addButton.addEventListener("click", addTask);

  const initialcompleted = JSON.parse(localStorage.getItem("completed"));
  if (initialcompleted === null) {
    initialcompleted = [];
  }
  initialcompleted.forEach((taskFromLocalStoragecompleted) => {
    const emptyEvent = document.querySelector(
      "#completed-tasks input[type='checkbox']"
    );
    handleIncomplete(taskFromLocalStoragecompleted);
  });

  const initialIncompleted = JSON.parse(localStorage.getItem("incompleted"));
  if (initialIncompleted === null) {
    initialIncompleted = [];
  }
  initialIncompleted.forEach((taskFromLocalStorage) => {
    const emptyEvent = null;
    addTask(emptyEvent, taskFromLocalStorage);
  });

  /// handle only existing tasks
  document
    .querySelectorAll("#incomplete-tasks input[type='checkbox']")
    .forEach((checkBox) => {
      checkBox.addEventListener("change", handleAddToCompleted);
    });

  document
    .querySelectorAll("#completed-tasks input[type='checkbox']")
    .forEach((checkBox) => {
      checkBox.addEventListener("change", handleCompleted);
    });

  document
    .querySelectorAll("#completed-tasks .delete")
    .forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        const taskName = parent.querySelector("input[type='text']").value;
        deleteTaskCompleted(parent, taskName);
      });
    });
  document
    .querySelectorAll("#incomplete-tasks .delete")
    .forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        const taskName = parent.querySelector("input[type='text']").value;
        deleteTask(parent, taskName);
      });
    });

  document.querySelectorAll(".edit").forEach((editButton) => {
    editButton.addEventListener("click", handleEdit);
  });

  document.querySelectorAll(".save").forEach((saveButton) => {
    saveButton.addEventListener("click", handleSave);
  });
}

mainFunction();

/// function for create new Task
function createTask(taskName) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const input = document.createElement("input");
  input.type = "text";

  input.value = taskName;
  input.readOnly = true;

  const save = document.createElement("button");
  save.className = "save hide";
  save.textContent = "Save";

  save.addEventListener("click", handleSave);

  const edit = document.createElement("button");
  edit.className = "edit";
  edit.textContent = "Edit";

  edit.addEventListener("click", handleEdit);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", (e) => {
    const parent = e.target.parentElement;
    const taskName = parent.querySelector("input[type='text']").value;
    deleteTask(parent, taskName);
  });

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(save);
  li.appendChild(edit);
  li.appendChild(deleteButton);

  return li;
}

/// function for create completed task
function createCompleted(taskName) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  const input = document.createElement("input");
  input.type = "text";
  input.value = taskName;
  input.readOnly = true;

  const save = document.createElement("button");
  save.className = "save hide";
  save.textContent = "Save";
  save.addEventListener("click", handleSave);

  const edit = document.createElement("button");
  edit.className = "edit";
  edit.textContent = "Edit";

  edit.addEventListener("click", handleEdit);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", (e) => {
    const parent = e.target.parentElement;
    const taskName = parent.querySelector("input[type='text']").value;
    deleteTask(parent, taskName);
  });

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(save);
  li.appendChild(edit);
  li.appendChild(deleteButton);

  return li;
}

/// function for add task
function addTask(_e, taskFromLocalStorage) {
  let taskInput;
  let taskName;
  let li;
  const listOfIncompleteTasks = document.getElementById("incomplete-tasks");
  if (!taskFromLocalStorage) {
    taskInput = document.getElementById("new-task");
    taskName = taskInput.value;
    li = createTask(taskName);
    taskInput.value = ""; // empty out the add input
    let existingLocalItem = JSON.parse(localStorage.getItem("incompleted"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    }
    existingLocalItem.push(taskName);
    localStorage.setItem("incompleted", JSON.stringify(existingLocalItem));
  } else {
    li = createTask(taskFromLocalStorage);
  }

  listOfIncompleteTasks.prepend(li);

  listOfIncompleteTasks
    .querySelectorAll("li input[type='checkbox']")[0]
    .addEventListener("change", handleAddToCompleted);
}

/// function for Completed
function handleAddToCompleted(e) {
  const checked = e.target.checked;
  const parent = e.target.parentElement;
  if (checked) {
    let li;
    const inputValue = parent.querySelector("input[type='text']").value;
    const listOfcompletedTasks = document.getElementById("completed-tasks");
    li = createCompleted(inputValue);
    let existingLocalItem = JSON.parse(localStorage.getItem("completed"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    } else {
      existingLocalItem.push(inputValue);
      localStorage.setItem("completed", JSON.stringify(existingLocalItem));
    }
    listOfcompletedTasks.prepend(li);
    deleteTask(parent, inputValue);
    listOfcompletedTasks
      .querySelectorAll("li input[type='checkbox']")[0]
      .addEventListener("change", handleCompleted);
  }
}

/// function for return Task ToDo
function handleCompleted(e) {
  const checked = e.target.checked;
  const parent = e.target.parentElement;
  if (!checked) {
    let li;
    const taskName = parent.querySelector("input[type='text']").value;
    const listOfIncompleteTasks = document.getElementById("incomplete-tasks");
    li = createTask(taskName);
    let existingLocalItem = JSON.parse(localStorage.getItem("incompleted"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    } else {
      existingLocalItem.push(taskName);
      localStorage.setItem("incompleted", JSON.stringify(existingLocalItem));
    }
    listOfIncompleteTasks.prepend(li);
    listOfIncompleteTasks
      .querySelectorAll("li input[type='checkbox']")[0]
      .addEventListener("change", handleAddToCompleted);
    deleteTaskCompleted(parent, taskName);
  }
}

/// function for Completed
function handleIncomplete(taskFromLocalStoragecompleted) {
  const listOfcompletedTasks = document.getElementById("completed-tasks");
  let taskName;
  let li;
  const listOfIncompleteTasks = document.getElementById("completed-tasks");
  if (taskFromLocalStoragecompleted) {
    taskName = taskFromLocalStoragecompleted;
    li = createCompleted(taskName);
    listOfcompletedTasks.prepend(li);
    let existingLocalItem = JSON.parse(localStorage.getItem("completed"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    }
  } else {
    li = createCompleted(listOfIncompleteTasks);
  }
}

/// function for return Task ToDo
function handleReturnToUnCompleted(taskFromLocalStorage) {
  const listOfIncompleteTasks = document.getElementById("incomplete-tasks");
  if (!taskFromLocalStorage) {
    let li;
    taskName = parent.querySelector("input[type='text']").value;
    li = createTask(taskName);
    let existingLocalItem = JSON.parse(localStorage.getItem("incompleted"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    }
    existingLocalItem.push(taskName);
    localStorage.setItem("incompleted", JSON.stringify(existingLocalItem));
  } else {
    li = createTask(taskFromLocalStorage);
  }
}

/// function for Delete Task
function deleteTask(element, taskName) {
  element.remove();
  let incompleteLocalStorage = JSON.parse(localStorage.getItem("incompleted"));
  if (incompleteLocalStorage !== null) {
    incompleteLocalStorage = incompleteLocalStorage.filter(
      (task) => task !== taskName
    );
    localStorage.setItem("incompleted", JSON.stringify(incompleteLocalStorage));
  }
}

/// function for Delete Task
function deleteTaskCompleted(element, taskName) {
  element.remove();
  let incompleteLocalStorage = JSON.parse(localStorage.getItem("completed"));
  if (incompleteLocalStorage !== null) {
    incompleteLocalStorage = incompleteLocalStorage.filter(
      (task) => task !== taskName
    );
    localStorage.setItem("completed", JSON.stringify(incompleteLocalStorage));
  }
}

/// function for Edit Task
function handleEdit(e) {
  const el = e.target;
  el.classList.add("hide");
  const parent = el.parentElement;
  const input = parent.querySelector("input[type='text']");
  input.readOnly = false;
  input.focus();
  const save = parent.querySelector(".save");
  save.classList.remove("hide");
}

/// function for Save Task
function handleSave(e) {
  const el = e.target;
  el.classList.add("hide");
  const parent = el.parentElement;
  const input = parent.querySelector("input[type='text']");
  input.readOnly = true;
  const edit = parent.querySelector(".edit");
  edit.classList.remove("hide");
}
