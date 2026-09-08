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
      <header className="app-header">
        <div>
          <span className="eyebrow">Team coaching workspace</span>
          <h1>Team Tools</h1>
          <p className="lede">Interactive models for making team dynamics visible, discussable and easier to improve.</p>
        </div>
        <div className="status-pill"><span className="status-dot" />Live workspace</div>
      </header>

      <ErrorViewer />

      <main className="tool-grid">
        <section className="tool-card tool-card--entry">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2>Team entry</h2>
              <p>Add or select the people taking part in this session.</p>
            </div>
          </div>
          <div className="tool-surface"><Entry /></div>
        </section>

        <section className="tool-card">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2>Comfort model</h2>
              <p>Explore where the team sits between comfort, stretch and chaos.</p>
            </div>
          </div>
          <div className="tool-surface model-surface"><ComfortStore /></div>
        </section>

        <section className="tool-card">
          <div className="section-heading">
            <span className="section-number">03</span>
            <div>
              <h2>Tuckman model</h2>
              <p>Visualise team development across forming, storming, norming and performing.</p>
            </div>
          </div>
          <div className="tool-surface model-surface"><TuckmanStore /></div>
        </section>
      </main>

      <aside className="console-card">
        <div className="section-heading compact">
          <span className="section-number">LOG</span>
          <div><h2>Session activity</h2><p>Diagnostic output from the current workspace.</p></div>
        </div>
        <ConsoleViewer />
      </aside>
    </div>
  );
}

export default App;
