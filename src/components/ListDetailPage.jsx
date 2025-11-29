import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api";

export default function ListDetailPage({ lists, setLists }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = lists.find((l) => l.id === id);

  const [newItem, setNewItem] = useState("");
  const [filterDone, setFilterDone] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [newMember, setNewMember] = useState("");

  const currentUser = "Me";
  const isOwner = list?.owner === currentUser;
  const isArchived = list?.archived;

  useEffect(() => {
    if (list) {
      setTempName(list.name);
    }
  }, [list]);

  const filteredItems =
    list && list.items
      ? filterDone
        ? list.items
        : list.items.filter((it) => !it.done)
      : [];

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!list || !isOwner || isArchived) return;
    const trimmed = tempName.trim();
    if (trimmed === "") return;
    try {
      const updatedLists = await api.renameList(id, trimmed);
      setLists(updatedLists);
      setIsEditingName(false);
    } catch (e) {
      console.error(e);
      alert("Failed to rename list.");
    }
  };

  const handleRenameBlur = async () => {
    if (!list || !isOwner || isArchived) {
      setIsEditingName(false);
      return;
    }
    const trimmed = tempName.trim();
    if (trimmed === "") {
      setIsEditingName(false);
      setTempName(list.name);
      return;
    }
    try {
      const updatedLists = await api.renameList(id, trimmed);
      setLists(updatedLists);
      setIsEditingName(false);
    } catch (e) {
      console.error(e);
      alert("Failed to rename list.");
    }
  };

  const addItem = async () => {
    if (!list || isArchived) return;
    const trimmed = newItem.trim();
    if (trimmed === "") return;
    try {
      const updatedLists = await api.addItem(id, trimmed);
      setLists(updatedLists);
      setNewItem("");
    } catch (e) {
      console.error(e);
      alert("Failed to add item.");
    }
  };

  const toggleItem = async (itemId) => {
    if (!list || isArchived) return;
    try {
      const updatedLists = await api.toggleItem(id, itemId);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to update item.");
    }
  };

  const removeItem = async (itemId) => {
    if (!list || isArchived) return;
    try {
      const updatedLists = await api.removeItem(id, itemId);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to remove item.");
    }
  };

  const addMember = async () => {
    if (!list || !isOwner || isArchived) return;
    const trimmed = newMember.trim();
    if (trimmed === "") return;
    try {
      const updatedLists = await api.addMember(id, trimmed);
      setLists(updatedLists);
      setNewMember("");
    } catch (e) {
      console.error(e);
      alert("Failed to add member.");
    }
  };

  const removeMember = async (memberId) => {
    if (!list || !isOwner || isArchived) return;
    try {
      const updatedLists = await api.removeMember(id, memberId);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to remove member.");
    }
  };

  const toggleArchive = async () => {
    if (!list || !isOwner) return;
    try {
      const updatedLists = await api.toggleArchive(id);
      setLists(updatedLists);
    } catch (e) {
      console.error(e);
      alert("Failed to change archive state.");
    }
  };

  const leaveList = async () => {
    if (!list || isOwner || isArchived) return;
    try {
      const updatedLists = await api.leaveList(id, currentUser);
      setLists(updatedLists);
      navigate("/lists");
    } catch (e) {
      console.error(e);
      alert("Failed to leave list.");
    }
  };

  const deleteList = async () => {
    if (!list || !isOwner) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the list "${list.name}"?`
    );
    if (!confirmDelete) return;
    try {
      const updatedLists = await api.deleteList(id);
      setLists(updatedLists);
      navigate("/lists");
    } catch (e) {
      console.error(e);
      alert("Failed to delete list.");
    }
  };

  if (!list) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate("/lists")}>
          Back
        </button>
        <p>List not found</p>
      </div>
    );
  }

  return (
    <div className="page detail-page">
      <button className="back-btn" onClick={() => navigate("/lists")}>
        ← Back
      </button>

      <div className="detail-header">
        {isEditingName && isOwner && !isArchived ? (
          <form onSubmit={handleRenameSubmit}>
            <input
              className="rename-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRenameBlur}
              autoFocus
            />
          </form>
        ) : (
          <h2
            onClick={
              isOwner && !isArchived ? () => setIsEditingName(true) : undefined
            }
            className={isOwner && !isArchived ? "editable-title" : ""}
          >
            {list.name}{" "}
            {isArchived && <span className="archived-label">(Archived)</span>}
            {isOwner && !isArchived && <span className="edit-hint">✏️</span>}
          </h2>
        )}
      </div>

      <div className="detail-section">
        <h3>Items</h3>
        <div className="detail-card">
          <button
            className="filter-btn"
            onClick={() => setFilterDone((prev) => !prev)}
          >
            {filterDone ? "Show only undone" : "Show all"}
          </button>

          {filteredItems.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-left">
                <input
                  type="checkbox"
                  checked={item.done}
                  disabled={isArchived}
                  onChange={() => toggleItem(item.id)}
                />
                <span className={item.done ? "done" : ""}>{item.name}</span>
              </div>
              {!isArchived && (
                <button onClick={() => removeItem(item.id)}>Remove</button>
              )}
            </div>
          ))}

          {!isArchived && (
            <div className="add-section">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new item..."
              />
              <button onClick={addItem}>Add</button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Members</h3>
        <div className="detail-card">
          {list.members.map((m) => (
            <div key={m.id} className="member-row">
              <span>
                {m.name}
                {m.name === list.owner && " (Owner)"}
              </span>
              {isOwner && m.name !== list.owner && !isArchived && (
                <button onClick={() => removeMember(m.id)}>Remove</button>
              )}
            </div>
          ))}

          {isOwner && !isArchived && (
            <div className="add-section">
              <input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Add new member..."
              />
              <button onClick={addMember}>Add Member</button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-footer">
        {isOwner && (
          <>
            <button
              onClick={toggleArchive}
              className={isArchived ? "restore-btn" : "archive-btn"}
            >
              {isArchived ? "Restore List" : "Archive List"}
            </button>
            <button onClick={deleteList} className="delete-btn">
              Delete List
            </button>
          </>
        )}
        {!isOwner && !isArchived && (
          <button
            onClick={leaveList}
            style={{ backgroundColor: "#f39c12" }}
          >
            Leave List
          </button>
        )}
      </div>
    </div>
  );
}
