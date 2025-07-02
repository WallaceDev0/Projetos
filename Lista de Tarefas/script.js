// Seletores
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const toggleDark = document.getElementById('toggle-dark');
const iconDarkmode = document.getElementById('icon-darkmode');

// SVGs
const svgAdd = `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const svgCheck = `<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const svgEdit = `<svg viewBox="0 0 24 24"><path d="M12.4 6.4l5.2 5.2M4 20h4.8l9.6-9.6a1.5 1.5 0 0 0 0-2.1l-2.7-2.7a1.5 1.5 0 0 0-2.1 0L4 15.2V20z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const svgDelete = `<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6h16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const svgSun = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
const svgMoon = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;

// Estado
let todos = [];

// Carregar do localStorage
function loadTodos() {
  const data = localStorage.getItem('todos-hardcore');
  todos = data ? JSON.parse(data) : [];
}

function saveTodos() {
  localStorage.setItem('todos-hardcore', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';
  if (todos.length === 0) {
    // Placeholder é tratado pelo CSS
    return;
  }
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    // Texto
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    span.tabIndex = 0;
    // Editar
    span.addEventListener('dblclick', () => editTodo(idx, span));
    li.appendChild(span);
    // Ações
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    // Concluir
    const btnDone = document.createElement('button');
    btnDone.title = 'Concluir';
    btnDone.setAttribute('aria-label', 'Concluir tarefa');
    btnDone.innerHTML = svgCheck;
    btnDone.onclick = () => toggleComplete(idx);
    btnDone.tabIndex = 0;
    actions.appendChild(btnDone);
    // Editar
    const btnEdit = document.createElement('button');
    btnEdit.title = 'Editar';
    btnEdit.setAttribute('aria-label', 'Editar tarefa');
    btnEdit.innerHTML = svgEdit;
    btnEdit.onclick = () => editTodo(idx, span);
    btnEdit.tabIndex = 0;
    actions.appendChild(btnEdit);
    // Remover
    const btnDel = document.createElement('button');
    btnDel.title = 'Remover';
    btnDel.setAttribute('aria-label', 'Remover tarefa');
    btnDel.innerHTML = svgDelete;
    btnDel.onclick = () => removeTodoAnimated(idx, li);
    btnDel.tabIndex = 0;
    actions.appendChild(btnDel);
    li.appendChild(actions);
    list.appendChild(li);
    // Feedback visual ao adicionar
    li.style.boxShadow = '0 0 0 2px #2563eb33';
    setTimeout(() => { li.style.boxShadow = ''; }, 350);
  });
}

function addTodo(text) {
  todos.unshift({ text, completed: false });
  saveTodos();
  renderTodos();
}

function removeTodo(idx) {
  todos.splice(idx, 1);
  saveTodos();
  renderTodos();
}

function toggleComplete(idx) {
  todos[idx].completed = !todos[idx].completed;
  saveTodos();
  renderTodos();
}

function editTodo(idx, span) {
  const oldText = todos[idx].text;
  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.value = oldText;
  inputEdit.className = 'todo-text';
  inputEdit.maxLength = 100;
  span.replaceWith(inputEdit);
  inputEdit.focus();
  inputEdit.select();
  inputEdit.onblur = () => finishEdit();
  inputEdit.onkeydown = (e) => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') cancelEdit();
  };
  function finishEdit() {
    const newText = inputEdit.value.trim();
    if (newText && newText !== oldText) {
      todos[idx].text = newText;
      saveTodos();
    }
    renderTodos();
  }
  function cancelEdit() {
    renderTodos();
  }
}

function removeTodoAnimated(idx, li) {
  li.classList.add('removing');
  setTimeout(() => {
    removeTodo(idx);
  }, 250);
}

form.onsubmit = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
    input.focus();
  }
};

// Dark mode
function setDarkMode(on) {
  document.body.classList.toggle('dark', on);
  localStorage.setItem('dark-hardcore', on ? '1' : '0');
  iconDarkmode.innerHTML = on ? svgSun : svgMoon;
}

toggleDark.onclick = () => {
  setDarkMode(!document.body.classList.contains('dark'));
};

function loadDarkMode() {
  const dark = localStorage.getItem('dark-hardcore') === '1';
  setDarkMode(dark);
}

// Inicialização
function injectAddIcon() {
  const btn = document.querySelector('#todo-form button .icon-add');
  if (btn) btn.innerHTML = svgAdd;
}

loadTodos();
renderTodos();
loadDarkMode();
injectAddIcon(); 