import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";

export default function ListOverviewPage({ lists, setLists }) {
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = "Me";

  const addList = async () => {
    const trimmedName = newListName.trim();
    if (trimmedName === "") {
      setErrorMessage("List name cannot be empty.");
      return;
    }

    const duplicate = lists.some(
      (l) => l.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      setErrorMessage(
        "A list with this name already exists. Please choose another name."
      );
      return;
    }

    try {
      const updatedLists = await api.createList(trimmedName, currentUser);
      setLists(updatedLists);
      setNewListName("");
      setErrorMessage("");
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to create list.");
    }
  };

  const deleteList = async (id, name, owner) => {
    if (owner !== currentUser) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the list "${name}"?`
    );
    if (!confirmDelete) return;
    try {
      const updatedLists = await api.deleteList(id);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to delete list.");
    }
  };

  const toggleArchive = async (id) => {
    try {
      const updatedLists = await api.toggleArchive(id);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to update archive state.");
    }
  };

  const visibleLists = lists.filter(
    (l) =>
      (showArchived || !l.archived) &&
      (l.owner === currentUser ||
        l.members.some((m) => m.name === currentUser))
  );

  return (
    <div className="page">
      <h2>My Shopping Lists</h2>

      <div className="list-grid">
        {visibleLists.length > 0 ? (
          visibleLists.map((list) => (
            <div
              key={list.id}
              className={`shopping-list-card ${list.archived ? "archived" : ""}`}
              onClick={() => navigate(`/list/${list.id}`)}
            >
              <div>
                <div className="list-title">
                  {list.name} {list.archived && "(Archived)"}
                </div>
                <div className="list-owner">
                  {list.owner === currentUser
                    ? "You are the Owner"
                    : `Owner: ${list.owner}`}
                </div>
              </div>

              {list.owner === currentUser && (
                <div style={{ display: "flex", gap: "6px" }}>
                  {!list.archived ? (
                    <button
                      className="archive-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(list.id);
                      }}
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(list.id);
                      }}
                    >
                      Restore
                    </button>
                  )}

                  {!list.archived && (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteList(list.id, list.name, list.owner);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No lists to show.</p>
        )}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button className="filter-btn" onClick={() => setIsModalOpen(true)}>
          + New List
        </button>

        <button
          className="filter-btn"
          onClick={() => setShowArchived((prev) => !prev)}
        >
          {showArchived
            ? "Show only active lists"
            : "Show including archived"}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>Create New Shopping List</h3>
            <input
              value={newListName}
              onChange={(e) => {
                setNewListName(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter list name..."
            />
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="modal-actions">
              <button onClick={addList}>Create</button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewListName("");
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
