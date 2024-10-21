import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { Label, Note } from "./types"; 
import { dummyNotesList } from "./constant"; 
import { ClickCounter, ToggleTheme } from "./hooksExercise";
import { ThemeContext, themes } from "./ThemeContext";

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
  };

  const removeNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    const idx: number = activeHearts.indexOf(id);
    if (idx !== -1) {
      setHearts(activeHearts.filter((heartId) => heartId !== id));
    }
  };

  const setActive = (id: number) => {
    const idx: number = activeHearts.indexOf(id);
    if (idx === -1) {
      setHearts([...activeHearts, id]);
    } else {
      setHearts(activeHearts.filter((heartId) => heartId !== id));
    }
  };

  const isActive = (id: number) => activeHearts.includes(id);

  useEffect(() => {
    console.log("Updated active hearts:", activeHearts);
  }, [activeHearts]);

  const [currentTheme, setCurrentTheme] = useState(themes.light);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === themes.light ? themes.dark : themes.light);
  };

  return (
    <ThemeContext.Provider value={currentTheme}>
      <div className='app-container'
        style={{
          background: currentTheme.background,  // Use currentTheme instead of theme
          color: currentTheme.foreground,       // Use currentTheme instead of theme
        }}>
        <form className="note-form" onSubmit={createNoteHandler}>
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
            <div key={note.id} className="note-item"
            style={{
              background: currentTheme.notes,  // Use currentTheme instead of theme
            }}
            >
              <div className="notes-header">
                <button onClick={() => setActive(note.id)}>
                  {isActive(note.id) ? '❤️' : '♡'}
                </button>
                <button onClick={() => removeNote(note.id)}>x</button>
              </div>
              <div>
                <h2 contentEditable="true">{note.title}</h2>
                <p contentEditable="true">{note.content}</p>
                <p contentEditable="true">{note.label}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={toggleTheme}>Toggle Theme</button>

        <div id="active-container">
          <h3>List of favorites:</h3>
          {activeHearts.map((id) => {
            const matchingNote = notes.find((note) => note.id === id);
            return matchingNote ? (
              <div key={id}>
                <span>{matchingNote.title}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
