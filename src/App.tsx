import React from 'react';
import ComfortStore from "./React/Comfort/Store"
import TuckmanStore from "./React/Tuckman/Store"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
       
      </header>
      <ComfortStore />
      <TuckmanStore />
    </div>
  );
}

export default App;
