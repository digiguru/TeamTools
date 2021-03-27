import React from 'react';
import ComfortStore from "./React/Comfort/Store"
import TuckmanStore from "./React/Tuckman/Store"
import './Shared/styles.css'
import Entry from "./Entry/Entry"
import { ErrorViewer } from './Shared/ErrorViewer'
import { ConsoleViewer } from './Shared/ConsoleViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Team Tools</h1>
      </header>
      <ErrorViewer />
      <h3>Entry</h3>
      <Entry />
      <h2>Comfort Model</h2>
      <ComfortStore />
      <h2>Tuckman Model</h2>
      <TuckmanStore />
      <ConsoleViewer />
    </div>
  );
}

export default App;
