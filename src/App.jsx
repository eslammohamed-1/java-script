import { useState } from 'react';
import { modules } from './data/courses';
import DayPicker from './components/DayPicker';
import Layout from './components/Layout';

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState(null);

  const activeModule = modules.find((m) => m.id === activeModuleId);

  return (
    <>
      {!activeModule ? (
        <>
          <header className="app-header">
            <div className="app-header__brand">
              <div className="app-header__logo">JS</div>
              <span>كورس DOM & Events</span>
            </div>
          </header>
          <DayPicker
            modules={modules}
            onSelect={(id) => setActiveModuleId(id)}
          />
        </>
      ) : (
        <Layout
          module={activeModule}
          moduleId={activeModule.id}
          onBack={() => setActiveModuleId(null)}
        />
      )}
    </>
  );
}
