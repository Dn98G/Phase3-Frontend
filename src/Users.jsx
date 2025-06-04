import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:8001";

export default function UsersComponent() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "" });
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users`);
    //  const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:",
        error
      );
      alert("Failed to fetch users.");
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/users`, newUser);
      alert("User added successfully!");
      setNewUser({ username: "", email: "" });
      fetchAllUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  const searchUser = async () => {
    if (!searchId) {
      alert("Please enter a user ID to search.");
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/users/${searchId}`);
      setFoundUser(response.data);
    } catch (error) {
      console.error("Error searching user:", error);
      setFoundUser(null);
      alert(`User with ID ${searchId} not found.`);
    }
  };

  const initiateEdit = (user) => {
    setEditUser({ ...user });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${backendUrl}/users/${editUser.id}`, editUser);
      alert("User updated successfully!");
      setEditUser(null);
      fetchAllUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const deleteUser = async (id) => {
    if (
      window.confirm(`Are you sure you want to delete user with ID: ${id}?`)
    ) {
      try {
        await axios.delete(`${backendUrl}/users/${id}`);
        alert("User deleted successfully!");
        fetchAllUsers();
        setFoundUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>A NOTE APP</h2>

      <div style={styles.section}>
        <h3>Add New User</h3>
        <form onSubmit={addUser} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleNewUserChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add User
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h3>Search User by ID</h3>
        <input
          type="number"
          placeholder="User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchUser} style={styles.button}>
          Search
        </button>
        {foundUser && (
          <div style={styles.searchResult}>
            <h4>User Found:</h4>
            <p>
              <strong>ID:</strong> {foundUser.id}
            </p>
            <p>
              <strong>Username:</strong> {foundUser.username}
            </p>
            <p>
              <strong>Email:</strong> {foundUser.email}
            </p>
            <button
              onClick={() => initiateEdit(foundUser)}
              style={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => deleteUser(foundUser.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editUser && (
        <div style={styles.section}>
          <h3>Edit User (ID: {editUser.id})</h3>
          <form onSubmit={updateUser} style={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={editUser.username}
              onChange={handleEditUserChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editUser.email}
              onChange={handleEditUserChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Update User
            </button>
            <button
              type="button"
              onClick={() => setEditUser(null)}
              style={{ ...styles.button, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={styles.section}>
        <h3>All Users</h3>
        {Array.isArray(users) && users.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => initiateEdit(user)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(15, 15, 15, 0.1)",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solidrgb(28, 104, 180)",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    width: "100%",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
  },
  editButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#ffc107",
    color: "black",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
  },
  searchResult: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solidrgb(50, 128, 212)",
    borderRadius: "5px",
    backgroundColor: "#e9f7ff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #dee2e6",
    padding: "12px",
    backgroundColor: "#e9ecef",
    textAlign: "left",
  },
  td: {
    border: "1px solid #dee2e6",
    padding: "12px",
    textAlign: "left",
  },
};
