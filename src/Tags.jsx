import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:8001"; 

export default function TagsComponent() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "" });
  const [searchId, setSearchId] = useState("");
  const [foundTag, setFoundTag] = useState(null);
  const [editTag, setEditTag] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${backendUrl}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      alert("Unable to load tags.");
    }
  };

  const handleNewTagChange = (e) => {
    setNewTag({ name: e.target.value });
  };

  const handleEditTagChange = (e) => {
    setEditTag((prev) => ({ ...prev, name: e.target.value }));
  };

  const addTag = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/tags`, newTag);
      setNewTag({ name: "" });
      fetchTags();
      alert("Tag added.");
    } catch (error) {
      console.error("Failed to add tag:", error);
      alert("Could not add tag.");
    }
  };

  const searchTag = async () => {
    if (!searchId) {
      alert("Please enter a tag ID.");
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/tags/${searchId}`);
      setFoundTag(response.data);
    } catch (error) {
      console.error("Tag not found:", error);
      setFoundTag(null);
      alert(`No tag found with ID ${searchId}.`);
    }
  };

  const startEditing = (tag) => {
    setEditTag({ ...tag });
  };

  const updateTag = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${backendUrl}/tags/${editTag.id}`, editTag);
      setEditTag(null);
      fetchTags();
      alert("Tag updated.");
    } catch (error) {
      console.error("Failed to update tag:", error);
      alert("Could not update tag.");
    }
  };

  const deleteTag = async (id) => {
    if (window.confirm(`Delete tag with ID ${id}?`)) {
      try {
        await axios.delete(`${backendUrl}/tags/${id}`);
        fetchTags();
        setFoundTag(null);
        alert("Tag deleted.");
      } catch (error) {
        console.error("Failed to delete tag:", error);
        alert("Could not delete tag.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Tag Management</h2>

      {/* Add Tag */}
      <div style={styles.section}>
        <h3>Add New Tag</h3>
        <form onSubmit={addTag} style={styles.form}>
          <input
            type="text"
            placeholder="Tag name"
            value={newTag.name}
            onChange={handleNewTagChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Tag
          </button>
        </form>
      </div>

      {/* Search Tag */}
      <div style={styles.section}>
        <h3>Search Tag by ID</h3>
        <input
          type="number"
          placeholder="Tag ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchTag} style={styles.button}>
          Search
        </button>
        {foundTag && (
          <div style={styles.searchResult}>
            <h4>Tag Found:</h4>
            <p>
              <strong>ID:</strong> {foundTag.id}
            </p>
            <p>
              <strong>Name:</strong> {foundTag.name}
            </p>
            <button
              onClick={() => startEditing(foundTag)}
              style={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => deleteTag(foundTag.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Tag */}
      {editTag && (
        <div style={styles.section}>
          <h3>Edit Tag (ID: {editTag.id})</h3>
          <form onSubmit={updateTag} style={styles.form}>
            <input
              type="text"
              value={editTag.name}
              onChange={handleEditTagChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditTag(null)}
              style={{ ...styles.button, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Tags */}
      <div style={styles.section}>
        <h3>All Tags</h3>
        {tags.length ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(tags) && tags.length > 0 ? (
                tags.map((tag) => (
                  <tr key={tag.id}>
                    <td style={styles.td}>{tag.id}</td>
                    <td style={styles.td}>{tag.name}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => startEditing(tag)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={styles.td}>
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>No tags found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    border: "1px solid #dee2e6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    padding: "8px",
    marginRight: "5px",
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  searchResult: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #007bff",
    backgroundColor: "#e9f7ff",
    borderRadius: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  th: {
    border: "1px solid #dee2e6",
    padding: "10px",
    backgroundColor: "#e9ecef",
  },
  td: {
    border: "1px solid #dee2e6",
    padding: "10px",
  },
};
