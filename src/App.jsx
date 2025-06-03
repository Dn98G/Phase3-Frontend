import { useEffect, useState } from "react";
import Notes from "./notes";
import Tags from "./tags";
import Users from "./users";

function App() {
  return (
    <>
      <Notes />
      <Tags />
      <Users />
    </>
  );
}

export default App;
