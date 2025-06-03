import { useEffect, useState } from "react";

export default function Users() {
  const [save, setSave] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <>
      <h3>SAVE</h3>
      <div>
        <search></search>
        <button>Edit</button>
      </div>
      <br />
      <div>
        <search></search>
        <button>Save</button>
      </div>
      {users.map((note) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
        </div>
      ))}
    </>
  );
}