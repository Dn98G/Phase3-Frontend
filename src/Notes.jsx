import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:8001";

export default function NotesComponent() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    user_id: "",
  });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/notes`);
      setNotes(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load notes");
    }
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditingNote((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewNote((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/notes`, newNote);
      setNewNote({ title: "", content: "", user_id: "" });
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Failed to add note");
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${backendUrl}/notes/${editingNote.id}`, editingNote);
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        await axios.delete(`${backendUrl}/notes/${id}`);
        fetchNotes();
      } catch (err) {
        console.error(err);
        alert("Failed to delete note");
      }
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <form onSubmit={addNote}>
        <input
          name="title"
          placeholder="Title"
          value={newNote.title}
          onChange={handleChange}
        />
        <input
          name="content"
          placeholder="Content"
          value={newNote.content}
          onChange={handleChange}
        />
        <input
          name="user_id"
          placeholder="User ID"
          value={newNote.user_id}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>

      {editingNote && (
        <form onSubmit={updateNote}>
          <input
            name="title"
            value={editingNote.title}
            onChange={(e) => handleChange(e, true)}
          />
          <input
            name="content"
            value={editingNote.content}
            onChange={(e) => handleChange(e, true)}
          />
          <input
            name="user_id"
            value={editingNote.user_id}
            onChange={(e) => handleChange(e, true)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingNote(null)}>
            Cancel
          </button>
        </form>
      )}

      <ul>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}</strong>: {note.content} (User:{" "}
              {note.user_id})
              <button onClick={() => startEdit(note)}>Edit</button>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No notes found.</li>
        )}
      </ul>
    </div>
  );
}
