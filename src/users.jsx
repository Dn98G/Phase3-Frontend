import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <>
      <h3>USER</h3>
      <div>
        <search></search>
        <button>Add User</button>
      </div>
      <br />
      <div>
        <search></search>
        <button>Search User</button>
      </div>
      {users.map((note) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
        </div>
      ))}
    </>
  );
}