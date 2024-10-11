import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constant"; // Import the dummyNotesList from the appropriate module
import { ClickCounter, ToggleTheme } from "./hooksExercise";


function App() {
  const [activeHearts, setHearts] = useState<number[]>([]);
  const [notes, setNotes] = useState(dummyNotesList);
  const initialNote = {
    id: -1,
    title: "",
    content: "",
    label: Label.personal,
  };
  const [createNote, setCreateNote] = useState(initialNote);

  const createNoteHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotes([...notes, createNote]);
    setCreateNote(initialNote);
  }

  const removeNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    const idx: number = activeHearts.indexOf(id);
    if (idx !== -1) {
      // heart was not active. make it active
      setHearts(activeHearts.filter((heartId) => heartId !== id));
    }
  }
  const setActive = (id: number) => {
    const idx: number = activeHearts.indexOf(id);
    if (idx == -1) {
      // heart was not active. make it active
      console.log("this heart not active");
      setHearts([...activeHearts, id]);
    }
    else {
      // heart was active, make it not
      console.log("This heart is active");
      setHearts(activeHearts.filter((heartId) => heartId !== id));
    }
    console.log(id);
  };

  const isActive = (id: number) => activeHearts.includes(id);

  useEffect(() => {
    console.log("Updated active hearts:", activeHearts);
  }, [activeHearts]);

  return (
    <div className='app-container'>
      <form className="note-form" onSubmit={createNoteHandler} >
        <div>
          <input
            placeholder="Note Title"
            onChange={(event) =>
              setCreateNote({ ...createNote, title: event.target.value })}
            required>
          </input>
        </div>

        <div>
          <textarea
            onChange={(event) =>
              setCreateNote({ ...createNote, content: event.target.value })}
            required>
          </textarea>
        </div>

        <div>
          <select
            onChange={(event) =>
              setCreateNote({ ...createNote, label: event.target.value as Label })}
            required>
            <option value={Label.personal}>Personal</option>
            <option value={Label.study}>Study</option>
            <option value={Label.work}>Work</option>
            <option value={Label.other}>Other</option>
          </select>
        </div>

        <div><button type="submit">Create Note</button></div>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            contentEditable="true">
            <div className="notes-header">
              <button onClick={() => setActive(note.id)}>
                {isActive(note.id) ? '❤️' : '♡'}
              </button>
              <button onClick={() => removeNote(note.id)}
              >x</button>
            </div>
            <h2> {note.title} </h2>
            <p> {note.content} </p>
            <p> {note.label} </p>
          </div>
        ))}
      </div>
      <ToggleTheme />
      <div id="active-container" >
        <h3>List of favorites:</h3>
        {activeHearts.map((id) => {
          // Find the matching note in the dummyNotesList using the id
          const matchingNote = notes.find((note) => note.id === id);

          // Display the note title if a matching note is found
          return matchingNote ? (
            <div key={id}>
              <span>{matchingNote.title}</span>
            </div>
          ) : null;
        })}
      </div>
    </div>

  );
}

export default App;