import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArchivedListsPage({ lists, setLists }) {
  const navigate = useNavigate();
  const currentUser = "Me";

  const saveToLocalStorage = (updatedLists) => {
    setLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  const restoreList = (id) => {
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, archived: false } : l
    );
    saveToLocalStorage(updatedLists);
  };

  const deleteList = (id) => {
    const confirmDelete = window.confirm("Delete this archived list permanently?");
    if (!confirmDelete) return;
    const updatedLists = lists.filter((l) => l.id !== id);
    saveToLocalStorage(updatedLists);
  };

  const archivedLists = lists.filter(
    (l) =>
      l.archived &&
      (l.owner === currentUser ||
        l.members.some((m) => m.name === currentUser))
  );

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/lists")}>
        Back
      </button>
      <h2>Archived Shopping Lists</h2>

      {archivedLists.length > 0 ? (
        archivedLists.map((list) => (
          <div
            key={list.id}
            className="shopping-list-card archived"
            onClick={() => navigate(`/list/${list.id}`)}
          >
            <div>
              <div className="list-title">{list.name}</div>
              <div className="list-owner">Owner: {list.owner}</div>
            </div>
            <div>
              <button
                className="restore-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  restoreList(list.id);
                }}
              >
                Restore
              </button>
              {list.owner === currentUser && (
                <button
                  className="delete-btn"
                  style={{ marginLeft: "8px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No archived lists.</p>
      )}
    </div>
  );
}
