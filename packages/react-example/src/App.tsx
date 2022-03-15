import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const addCount = () => {
    setCount((num) => {
      return num + 1;
    });
  };
  if (count === 2) {
    // Simulate a JS error
    throw new Error("I crashed!");
  }
  return (
    <div className='App'>
      <header className='App-header' onClick={addCount}>
        please click: {count}
      </header>
    </div>
  );
}

export default App;
