// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check for saved tasks and boards in local storage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || ['general'];
    renderBoards(savedBoards);
    renderTasks(savedTasks, 'general');
});

function showAlert(message) {
    // Create the alert element
    var alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.textContent = message;
  
    document.body.appendChild(alertElement);
  
    alertElement.style.display = 'block';
  
    setTimeout(function() {
      alertElement.style.display = 'none';
      document.body.removeChild(alertElement);
    }, 5000); 
  }
  

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
    // Create a modal for adding a new board
    const modal = document.createElement('div');
    modal.className = 'modal';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter the name for the new board';
    input.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            // If Enter is pressed, simulate a click on the confirm button
            confirmButton.click();
        }
    });

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Create Board';
    confirmButton.addEventListener('click', function () {
        const newBoardName = input.value.trim();
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
            
            // Close the modal
            document.body.removeChild(modal);
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    modal.appendChild(input);
    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);

    document.body.appendChild(modal);

    // Focus on the input field when the modal appears
    input.focus();
}


function deleteBoard() {
    const selectedBoard = document.getElementById('boardSelect').value;

    if (selectedBoard !== 'default') {
        // Create a modal for deleting the board
        const modal = document.createElement('div');
        modal.className = 'modal';

        const message = document.createElement('p');
        message.textContent = `Are you sure you want to delete the board "${selectedBoard}"?`;

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Yes';
        confirmButton.addEventListener('click', function () {
            const savedBoards = getSavedBoards();
            const updatedBoards = savedBoards.filter(board => board !== selectedBoard);
            saveBoards(updatedBoards);
            renderBoards(updatedBoards);
            renderTasks([]);

            // Close the modal
            document.body.removeChild(modal);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', function () {
            // Close the modal without deleting the board
            document.body.removeChild(modal);
        });

        modal.appendChild(message);
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);

        document.body.appendChild(modal);
    }
}


function renderBoards(boards) {
    const boardSelect = document.getElementById('boardSelect');
    boardSelect.textContent = ''; 

    const options = boards.map(board => {
        const option = document.createElement('option');
        option.value = board;
        option.textContent = board;
        return option;
    });

    boardSelect.append(...options);
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
    tasksList.textContent = '';

    const selectedBoard = document.getElementById('boardSelect').value;
    const savedTasks = getSavedTasks(selectedBoard);

    const savedTasksLength = savedTasks.length;

    for (let index = 0; index < savedTasksLength; index++) {
        const task = savedTasks[index];
        const li = document.createElement('li');
        li.textContent = `${task.text} ${task.dueDate}`;

        const span = document.createElement('span');
        span.textContent = '\u00d7';
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
    }

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