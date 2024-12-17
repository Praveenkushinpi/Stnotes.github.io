const addNoteBtn = document.getElementById('addNoteBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const notesContainer = document.getElementById('notesContainer');
const searchBar = document.getElementById('searchBar');

// Load notes from local storage
window.onload = () => {
  const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
  savedNotes.forEach((noteData) => addNote(noteData.text, noteData.color, noteData.font, noteData.position));
};

// Save notes to local storage
function saveNotes() {
  const notes = Array.from(document.querySelectorAll('.note')).map((note) => ({
    text: note.querySelector('textarea').value,
    color: note.style.backgroundColor,
    font: note.style.fontSize,
    position: { left: note.style.left, top: note.style.top },
  }));
  localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

// Add a new note
addNoteBtn.addEventListener('click', () => addNote());

// Delete all notes functionality
deleteAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all notes?')) {
    notesContainer.innerHTML = '';
    localStorage.removeItem('stickyNotes');
  }
});

// Create a note with optional customization
function addNote(text = '', color = '#fffbe7', font = '16px', position = { left: '10px', top: '10px' }) {
  const note = document.createElement('div');
  note.classList.add('note');
  note.style.backgroundColor = color;
  note.style.fontSize = font;
  note.style.left = position.left;
  note.style.top = position.top;
  note.style.position = 'absolute';
  note.innerHTML = `
    <button class="delete">x</button>
    <textarea>${text}</textarea>
    <div class="customize">
      <input type="color" class="colorPicker" value="${color}">
      <label>Font Size: <input type="number" class="fontSizeInput" value="${parseInt(font)}" min="8" max="36"></label>
      <button class="move">Move</button>
    </div>
  `;
  
  // Delete note functionality
  note.querySelector('.delete').addEventListener('click', () => {
    notesContainer.removeChild(note);
    saveNotes();
  });

  // Change background color
  note.querySelector('.colorPicker').addEventListener('input', (e) => {
    note.style.backgroundColor = e.target.value;
    saveNotes();
  });

  // Change font size
  note.querySelector('.fontSizeInput').addEventListener('input', (e) => {
    note.style.fontSize = `${e.target.value}px`;
    saveNotes();
  });

  // Drag and drop functionality
  let isDragging = false;
  note.querySelector('.move').addEventListener('mousedown', (e) => {
    isDragging = true;
    let offsetX = e.clientX - note.offsetLeft;
    let offsetY = e.clientY - note.offsetTop;
    const onMouseMove = (e) => {
      if (isDragging) {
        note.style.left = `${e.clientX - offsetX}px`;
        note.style.top = `${e.clientY - offsetY}px`;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      saveNotes();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  notesContainer.appendChild(note);
  saveNotes();
}

// Search functionality
searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.note').forEach((note) => {
    const text = note.querySelector('textarea').value.toLowerCase();
    note.style.display = text.includes(query) ? 'block' : 'none';
  });
});
