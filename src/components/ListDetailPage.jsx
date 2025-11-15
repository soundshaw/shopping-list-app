import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ListDetailPage({ lists, setLists }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = lists.find((l) => l.id === id);

  const [items, setItems] = useState(list ? list.items : []);
  const [members, setMembers] = useState(list ? list.members : []);
  const [newItem, setNewItem] = useState("");
  const [filterDone, setFilterDone] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState(list ? list.name : "");
  const [newMember, setNewMember] = useState("");

  const currentUser = "Me";
  const isOwner = list?.owner === currentUser;
  const isArchived = list?.archived;

  const saveToLocalStorage = (updatedLists) => {
    setLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  const updateList = (changes) => {
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, ...changes } : l
    );
    saveToLocalStorage(updatedLists);
  };

  useEffect(() => {
    if (!list) return;
    setItems(list.items);
    setMembers(list.members);
    setListName(list.name);
  }, [list]);

  const toggleItem = (itemId) => {
    const updatedItems = items.map((it) =>
      it.id === itemId ? { ...it, done: !it.done } : it
    );
    setItems(updatedItems);
    updateList({ items: updatedItems });
  };

  const removeItem = (itemId) => {
    const updatedItems = items.filter((it) => it.id !== itemId);
    setItems(updatedItems);
    updateList({ items: updatedItems });
  };

  const addItem = () => {
    if (newItem.trim() === "" || isArchived) return;
    const updatedItems = [
      ...items,
      { id: Date.now().toString(), name: newItem, done: false }
    ];
    setItems(updatedItems);
    setNewItem("");
    updateList({ items: updatedItems });
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (isArchived) return;
    updateList({ name: listName });
    setIsEditingName(false);
  };

  const handleRenameBlur = () => {
    if (isArchived) return;
    updateList({ name: listName });
    setIsEditingName(false);
  };

  const addMember = () => {
    if (newMember.trim() === "" || isArchived) return;
    if (members.some((m) => m.name.toLowerCase() === newMember.toLowerCase())) {
      setNewMember("");
      return;
    }
    const updatedMembers = [
      ...members,
      { id: Date.now().toString(), name: newMember }
    ];
    setMembers(updatedMembers);
    updateList({ members: updatedMembers });
    setNewMember("");
  };

  const removeMember = (memberId) => {
    if (isArchived) return;
    const updatedMembers = members.filter((m) => m.id !== memberId);
    setMembers(updatedMembers);
    updateList({ members: updatedMembers });
  };

  const toggleArchive = () => {
    updateList({ archived: !isArchived });
  };

  const leaveList = () => {
    const updatedLists = lists
      .map((l) => {
        if (l.id === id) {
          const updatedMembers = l.members.filter(
            (m) => m.name !== currentUser
          );
          return { ...l, members: updatedMembers };
        }
        return l;
      })
      .filter(
        (l) =>
          l.owner === currentUser ||
          l.members.some((m) => m.name === currentUser)
      );

    saveToLocalStorage(updatedLists);
    navigate("/lists");
  };

  const deleteList = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the list "${listName}"?`
    );
    if (!confirmDelete) return;

    const updatedLists = lists.filter((l) => l.id !== id);
    saveToLocalStorage(updatedLists);
    navigate("/lists");
  };

  const filteredItems = filterDone ? items : items.filter((it) => !it.done);

  if (!list)
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate("/lists")}>
          Back
        </button>
        <p>List not found</p>
      </div>
    );

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
              value={listName}
              onChange={(e) => setListName(e.target.value)}
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
            {listName}{" "}
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
          {members.map((m) => (
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
              style={{ width: "140px" }}
            >
              {isArchived ? "Restore List" : "Archive List"}
            </button>
            <button
              onClick={deleteList}
              className="delete-btn"
              style={{ marginLeft: "10px", width: "140px" }}
            >
              Delete List
            </button>
          </>
        )}
        {!isOwner && !isArchived && (
          <button
            onClick={leaveList}
            style={{ backgroundColor: "#f39c12", marginLeft: "10px" }}
          >
            Leave List
          </button>
        )}
      </div>
    </div>
  );
}
