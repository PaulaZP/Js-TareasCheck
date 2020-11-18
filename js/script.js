//
// Lista de tareas
//

//
// Variables globales.
//

// MODELO - API User ID - CAMBIARLO al User ID que tienen asignado.
const uid = 1;

// MODELO - Lista de tareas (Array).
let tareas = [];

// VISTA - Lista de tareas (DOM).
const lista = document.getElementById('task-list');

// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');

const ocultar = document.getElementById('hide-completed');

//
// Funciones.
//

// MODELO - taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {
  ocultar.addEventListener('click', (event) => {
    const check = event.currentTarget
    const inco = tareas.filter((tarea) =>{
      return tarea.complete
    })
    if (check == true) {
      inco.style.display = 'block';
      tareas.style.display = 'none';
    }else{
      tareas.style.display = 'block';
    }
  })
  const tareaEncontrada = tareas.find((tarea) => tarea._id === id);
  if (tareaEncontrada) {
    tareaEncontrada.complete = complete;
    const tareaActualizada = {
      name: tareaEncontrada.name,
      complete,
      date: tareaEncontrada.date,
    };
    const fetchOptions = {
      method: 'PUT',
      body: JSON.stringify(tareaActualizada),
    };
    fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${29}`, fetchOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
}

// MODELO - deleteTask(): Borra una tarea.
function deleteTask(id) {
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto la borra.
    if (tareas[i]._id === id) {
      tareas.splice(i, 1);
      const fetchOptions = {
        method: 'DELETE',
      };
      fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${29}`, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      break;
    }
  }
}

// VISTA - apendTaskDOM(): Agrega una nueva tarea al DOM.
function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  checkbox.dataset.taskId = tarea._id;
  // Label.
  const label = document.createElement('label');
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.dataset.taskId = tarea._id;
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  lista.appendChild(item);
  // CONTROLADOR - Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {
    const complete = event.currentTarget.checked;
    const taskId = event.currentTarget.dataset.taskId;
    taskStatus(taskId, complete);
  });
  // CONTROLADOR - Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const taskId = event.currentTarget.dataset.taskId;
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}

// VISTA - refreshTasksDOM(): Refresca la lista completa de tareas en el DOM.
function refreshTasksDOM(tasks) {
  lista.innerHTML = '';
  tasks.forEach((task) => {
    appendTaskDOM(task);
  });
}

// MODELO - addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);

  // Envía la nueva tarea al API.

  // Opciones para el fetch.
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
  };
  // Ejecuta el fetch.
  fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${29}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      // Agrega la tarea al DOM.
      appendTaskDOM(data);
    });
}

//
// Inicialización del programa.
//

// CONTROLADOR - Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();

  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);

  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
});

// MODELO - Inicialización a partir del API.
fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${29}`)
  .then((response) => response.json())
  .then((data) => {
    tareas = data;
    // VISTA - Inicialización de la lista del DOM, a partir de las tareas existentes.
    refreshTasksDOM(tareas);
  });
