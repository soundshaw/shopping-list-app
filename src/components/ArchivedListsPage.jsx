import React from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

export default function ArchivedListsPage({ lists, setLists }) {
  const navigate = useNavigate();
  const currentUser = "Me";

  const archivedLists = lists.filter(
    (l) =>
      l.archived &&
      (l.owner === currentUser ||
        l.members.some((m) => m.name === currentUser))
  );

  const restoreList = async (id) => {
    try {
      const updated = await api.toggleArchive(id);
      setLists(updated);
    } catch (e) {
      console.error(e);
      alert("Failed to restore list.");
    }
  };

  const deleteList = async (id, name) => {
    const confirmDelete = window.confirm(
      `Delete archived list "${name}" permanently?`
    );
    if (!confirmDelete) return;
    try {
      const updated = await api.deleteList(id);
      setLists(updated);
    } catch (e) {
      console.error(e);
      alert("Failed to delete list.");
    }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/lists")}>
        Back
      </button>
      <h2>Archived Shopping Lists</h2>

      {archivedLists.length > 0 ? (
        <div className="list-grid">
          {archivedLists.map((list) => (
            <div
              key={list.id}
              className="shopping-list-card archived"
              onClick={() => navigate(`/list/${list.id}`)}
            >
              <div>
                <div className="list-title">{list.name}</div>
                <div className="list-owner">Owner: {list.owner}</div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  className="restore-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    restoreList(list.id);
                  }}
                >
                  Restore
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id, list.name);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No archived lists.</p>
      )}
    </div>
  );
}
