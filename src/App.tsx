import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ControlCenter } from "./pages/ControlCenter";
import { Audience } from "./pages/Audience";
import "./App.css";

function App() {
  return (
    <Router>
      <div id="App">
        <Routes>
          {/* Base route */}
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to the Jumbotron App
                </h1>
                <div className="text-lg mb-4">
                  Please use a large screen for the best experience. This may
                  not work well on mobile devices or tablets.
                </div>
                <Link to="/control-center" className="px-4 py-2">
                  Go to Control Center
                </Link>
                <Link to="/audience" className="px-4 py-2">
                  Go to Audience
                </Link>
              </div>
            }
          />
          {/* Control Center route */}
          <Route path="/control-center" element={<ControlCenter />} />
          {/* Audience route */}
          <Route path="/audience" element={<Audience />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
