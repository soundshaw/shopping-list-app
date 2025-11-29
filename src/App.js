import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import ListOverviewPage from "./components/ListOverviewPage";
import ListDetailPage from "./components/ListDetailPage";
import ArchivedListsPage from "./components/ArchivedListsPage";
import * as api from "./api";
import "./App.css";

function App() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getLists()
      .then((data) => {
        setLists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data from server.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/lists" />} />
          <Route
            path="/lists"
            element={<ListOverviewPage lists={lists} setLists={setLists} />}
          />
          <Route
            path="/list/:id"
            element={<ListDetailPage lists={lists} setLists={setLists} />}
          />
          <Route
            path="/archived"
            element={<ArchivedListsPage lists={lists} setLists={setLists} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
