import { useEffect, useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/notes")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
      });
  }, []);

  return (
    <>
      <h3>NOTES</h3>
      <div>
        <search></search>
        <button>Search Notes</button>
      </div>
      <br />
      <div>
        <del></del>
        <button>Delete</button>
      </div>
      <br />
      {notes.map((note) => (
        <div key={note.id}>
          <h3>{notes.name}</h3>
        </div>
      ))}
    </>
    
  );
}