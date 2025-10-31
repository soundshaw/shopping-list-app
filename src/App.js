import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ListOverviewPage from "./components/ListOverviewPage";
import ListDetailPage from "./components/ListDetailPage";
import ArchivedListsPage from "./components/ArchivedListsPage";
import "./App.css";
import { shoppingLists as initialData } from "./data";

function App() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("shoppingLists");
    if (stored) {
      setLists(JSON.parse(stored));
    } else {
      setLists(initialData);
      localStorage.setItem("shoppingLists", JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      localStorage.setItem("shoppingLists", JSON.stringify(lists));
    }
  }, [lists]);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/lists" />} />
          <Route path="/lists" element={<ListOverviewPage lists={lists} setLists={setLists} />} />
          <Route path="/list/:id" element={<ListDetailPage lists={lists} setLists={setLists} />} />
          <Route path="/archived" element={<ArchivedListsPage lists={lists} setLists={setLists} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

