const doc = document;
const todoListEl = doc.querySelector('.todo-list');
const chkFilter = doc.querySelector('.todo-filter-block input');
const addTodoForm = doc.forms.addTodoForm;
const addTodo = addTodoForm.addTodo;
const addTodoBtn = addTodoForm.addTodoBtn;
const clearTodo = doc.querySelector('.todo-clear');

let isFiltered = chkFilter.checked;

const todos = [
  { id: 1, text: 'Todo 1', completed: false },
  { id: 2, text: 'Todo 2', completed: false },
  { id: 3, text: 'Todo 3', completed: false },
];

let lastId = todos.length 
  ? todos[todos.length - 1].id
  : 0;

 renderTodoList(todos, todoListEl);

chkFilter.onchange = function() {
  isFiltered = this.checked;
  renderTodoList(todos, todoListEl);
}

addTodoBtn.onclick = function() {
  const text = addTodo.value;
  const id = ++lastId;
  const newTodo = {
    id: id,
    text: text,
    completed: false,
  }
  todos.push(newTodo);
  renderTodoList(todos, todoListEl);
}

// Functions
function getFilteredTodos(data) {
  let filteredTodos = [];
  if (isFiltered) {
    filteredTodos = data.filter(function(todo) {
      return !todo.completed;
    });
  } else {
    filteredTodos = data.filter(function(todo) {
      return todo;
    });
  }
  return filteredTodos;
}

function delTodo() {
  todos.splice((this.parentElement.dataset.id - 1), 1);
  renderTodoList(todos, todoListEl);
  return;
}

function renderTodoList(rawData, parentEl) {
  if (!checkValidArgs(rawData, parentEl)) {
    return;
  }

  const data = getFilteredTodos(rawData);

  let todoChksEls;
  let delBtn;

  let todoItems = data
    .map(function(item, index) {
      const todoItem = `
        <li class="todo-item" data-id="${ item.id }">
          <span class="todo-item__number mr-1">${ index + 1 }</span>
          <input 
            class="todo-item__completed mr-1" 
            type="checkbox" 
            ${ item.completed ? 'checked' : '' }
          >
          <p class="todo-item__text mr-1${ item.completed ? ' todo-item__text_completed' : '' }">
            ${ item.text }
          </p>
          <button class="todo-item__delBtn">del</button>
        </li>
      `;
      return todoItem })
    .join('');
    
  parentEl.innerHTML = todoItems;
  
  todoChksEls = doc.querySelectorAll('.todo-item__completed');
  if (!todoChksEls.length) {
    console.warn('Todo checks not found !!!');
    return;
  }

  todoChksEls.forEach(function(chk) {
    chk.onchange = function() {
      const id = this.parentElement.dataset.id;
      const todo = data.find(function(item) {
        return item.id == id
      });

      if (!todo) {
        return;
      }

      todo.completed = !todo.completed;
      renderTodoList(todos, todoListEl);
    }
  });

  delBtn = doc.querySelectorAll('.todo-item__delBtn');

  // видалення
  for (let i = 0; i < todos.length; i++) {
    delBtn[i].onclick = delTodo;
  }

}

function checkValidArgs(data, parentEl) {
  
  if (!parentEl) {
    console.warn('Parent Elemetn not found');
    return; 
  }
  if (!Array.isArray(data)) {
    console.warn('Arg data mast be Array');
    return;
  }

  return true;
}

// const jsonData = JSON.stringify(todos);
// localStorage.setItem('todos', jsonData);

const rawData = localStorage.getItem('todos');
const userData = JSON.parse(rawData);
console.log(userData);


