// to add a task on clicking the add button
document.getElementById("add_button").addEventListener("click", function() {
    var taskInput = document.getElementById("task_input"); // getting the task input element
    var task = taskInput.value.trim(); // removing the whitespace of task input

    if (task !== "") { // checking if task is entered and not empty
        addTask(task, false); // calling the addTask function to add task // initially marked as incomplete
        saveTask(task, false); // saving the task to local storage
        taskInput.value = ''; // clearing the task input
    } else {
        alert("Please Enter a Task."); 
    }
});

var colorIndex = 0; // setting the initial index as 0
const colors = ["color-1", "color-2", "color-3", "color-4", "color-5"]; // array of colors class

// for adding tasks 
function addTask(task, isCompleted) {
    var taskList = document.getElementById("task_list");  // getting the task list element
    var listItem = document.createElement("li"); // creating a list element
    listItem.textContent = task; // setting the text content of task
    listItem.classList.add(colors[colorIndex % colors.length]); // add a color class to the task
    colorIndex++;
// for checkbox to display the status of tasks
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.addEventListener("change", function() {
        listItem.classList.toggle("completed", checkbox.checked); // toggle the completed class based on checkbox status
        updateTaskStatus(task, checkbox.checked); // update the task status in local storage
    });
// for delete button
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteTask(task); // to delete the task from local storage
        listItem.remove(); // to remove the task from the list
    });
// for edit button
    var editButton  = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function() {
        editTask(task, listItem); // calling the editTask function to edit the task
    });

    if (isCompleted) {
        listItem.classList.add("completed"); // if the task is completed, add the completed class
    }

    listItem.appendChild(checkbox); // adding checkbox to the list item
    listItem.appendChild(editButton); // adding the edit button to the list item
    listItem.appendChild(deleteButton); // adding delete button to list item
    taskList.appendChild(listItem); // adding the list item to task list
}

// function to update task status in local storage
function updateTaskStatus(task, isCompleted) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(function(t) {
        if(t.task === task) {
            return{task: t.task, completed: isCompleted};
        }
        else {
            return t;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// to store the task in local storage
function saveTask(task, isCompleted) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || []; // getting the task from local storage else initializing the empty array if none
    tasks.push({ task: task, completed: isCompleted }); // adding the new task to the array
    localStorage.setItem("tasks", JSON.stringify(tasks)); // saving the updated task array to local storage
}

// to edit the task
function editTask(task, listItem) {
    // for the editor area
    var editInput = document.createElement("input");
    editInput.type = "value";
    editInput.value = task;
    // for save button
    var saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    listItem.innerHTML = " "; // replacing the existing content with edit input and save button (clearing the content instead of creating a seperate area for editing)
    // adding elements to list item
    listItem.appendChild(editInput);
    listItem.appendChild(saveButton);

    saveButton.addEventListener("click", function() {
        var updatedTask = editInput.value.trim(); // getting the updated task value
        if(updatedTask !== "") {
            listItem.textContent = updatedTask; // setting the updated task text
            updateTask(task, updatedTask); // calling the updateTask function
            addTaskButton(listItem, updatedTask, false); // to add buttons (checkbox, edit and delete) to updated tasks
        }
        else {
            alert("Please Enter a Task");
        }
    });
}

//for updating the Task in local storage
function updateTask(oldTask, newTask) {    
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    updatedTask = tasks.map(function(t) {
        if(t.task === oldTask) {
            t.task = newTask; // update the task with new value(task)
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTask));
}

// for adding buttons(checkbox, edit and delete) to a task
function addTaskButton(listItem, task, isCompleted) {
// for checkbox to display the status of tasks
var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = isCompleted;
checkbox.addEventListener("change", function() {
    listItem.classList.toggle("completed", checkbox.checked);
    updateTaskStatus(task, checkbox.checked);
});
// for delete button
var deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.addEventListener("click", function() {
    deleteTask(task);
    listItem.remove(); // else taskList.removeChild(listItem)
});
// for edit button
var editButton  = document.createElement("button");
editButton.textContent = "Edit";
editButton.addEventListener("click", function() {
    editTask(task, listItem);
});

if (isCompleted) {
    listItem.classList.add("completed");
}

listItem.appendChild(checkbox); // adding checkbox
listItem.appendChild(editButton); // adding edit button
listItem.appendChild(deleteButton); // adding delete button

}

// to delete the task from local storage
function deleteTask(task) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(function(t) {
        return t.task !== task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// loading the tasks from local storage
function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || []; // getting items from local storage
    tasks.forEach(function(t) { // iterating over each task
        addTask(t.task, t.completed);
    });
}

// load tasks when window is loaded
window.onload = loadTasks;
