// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check for saved tasks and boards in local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || ['general'];
    renderBoards(savedBoards);
    renderTasks(savedTasks, 'general'); // Display tasks for the default board
});

function showAlert(message) {
    // Create the alert element
    var alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.textContent = message;
  
    // Append the alert to the body
    document.body.appendChild(alertElement);
  
    // Display the alert
    alertElement.style.display = 'block';
  
    // Hide the alert after a few seconds (adjust the timeout as needed)
    setTimeout(function() {
      alertElement.style.display = 'none';
      // Remove the alert element from the DOM after it's hidden
      document.body.removeChild(alertElement);
    }, 5000); // 5000 milliseconds (5 seconds) in this example
  }
  
  // Example usage:
  // showAlert('You must write something!');
  

function addTask() {
    const inputBox = document.getElementById('input-box');
    const dueDateInput = document.getElementById('dueDate');
    const taskText = inputBox.value.trim();
    const dueDate = dueDateInput.value;

    if (inputBox.value === '') {
        // alert('You must write something!');
        showAlert('You must write something!')
    } else {
        const selectedBoard = document.getElementById('boardSelect').value;
        const task = {
            text: taskText,
            dueDate: dueDate,
            completed: false,
            board: selectedBoard,
        };

        const savedTasks = getSavedTasks(selectedBoard);
        savedTasks.push(task);
        saveTasks(savedTasks, selectedBoard);
        renderTasks(savedTasks, selectedBoard);
        inputBox.value = '';
        dueDateInput.value = '';
    }
}

function changeBoard() {
    const selectedBoard = document.getElementById('boardSelect').value;
    const savedTasks = getSavedTasks(selectedBoard);
    renderTasks(savedTasks, selectedBoard);
}

function addNewBoard() {
    const newBoardName = prompt('Enter the name for the new board:');
    if (newBoardName) {
        const boardSelect = document.getElementById('boardSelect');
        const newOption = document.createElement('option');
        newOption.value = newBoardName;
        newOption.textContent = newBoardName;
        boardSelect.appendChild(newOption);
        boardSelect.value = newBoardName;
        changeBoard(); // Update the displayed tasks for the new board

        const savedBoards = getSavedBoards();
        savedBoards.push(newBoardName);
        saveBoards(savedBoards);
    }
}

function deleteBoard() {
    const selectedBoard = document.getElementById('boardSelect').value;
    if (selectedBoard !== 'default') {
        const confirmed = confirm(`Are you sure you want to delete the board "${selectedBoard}"?`);
        if (confirmed) {
            const savedBoards = getSavedBoards();
            const updatedBoards = savedBoards.filter(board => board !== selectedBoard);
            saveBoards(updatedBoards);
            renderBoards(updatedBoards);
            renderTasks([]);
        }
    }
}

function renderBoards(boards) {
    const boardSelect = document.getElementById('boardSelect');
    boardSelect.innerHTML = ''; 
    boards.forEach((board) => {
        const option = document.createElement('option');
        option.value = board;
        option.textContent = board;
        boardSelect.appendChild(option);
    });
}

function getSavedTasks(board) {
    const savedTasks = JSON.parse(localStorage.getItem(`tasks-${board}`)) || [];
    return savedTasks;
}

function saveTasks(tasks, board) {
    localStorage.setItem(`tasks-${board}`, JSON.stringify(tasks));
}

function renderTasks() {
    const tasksList = document.getElementById('list-container');
    tasksList.innerHTML = '';

    const selectedBoard = document.getElementById('boardSelect').value;
    const savedTasks = getSavedTasks(selectedBoard);

    savedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${task.text} ${task.dueDate}`;

        const span = document.createElement('span');
        span.innerHTML = '\u00d7';
        span.addEventListener('click', () => deleteTask(index, selectedBoard));

        li.appendChild(span);

        li.addEventListener('click', function (e) {
            if (e.target.tagName === 'LI') {
                li.classList.toggle('checked');
                toggleTaskCompletion(index, selectedBoard);
            }
        });

        if (task.completed) {
            li.classList.add('checked');
        }

        tasksList.appendChild(li);
    });
}
function getSavedBoards() {
    return JSON.parse(localStorage.getItem('boards')) || [];
}

function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
}

function toggleTaskCompletion(index, board) {
    const savedTasks = getSavedTasks(board);
    savedTasks[index].completed = !savedTasks[index].completed;
    saveTasks(savedTasks, board);
    renderTasks();
}

function deleteTask(index, board) {
    const savedTasks = getSavedTasks(board);
    savedTasks.splice(index, 1);
    saveTasks(savedTasks, board);
    renderTasks(savedTasks, board);
}