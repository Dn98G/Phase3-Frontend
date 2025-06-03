import { useEffect, useState } from "react";

export default function Tags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      });
  }, []);

  return (
    <>
      <h3>TAGS</h3>
      <div>
        <search></search>
        <button>Enter Tag ID</button>
      </div>
      {tags.map((tag) => (
        <div key={tag.id}>
          <h3>{tags.name}</h3>
        </div>
      ))}
    </>
  );
}