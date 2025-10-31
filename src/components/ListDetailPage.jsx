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

  const saveToLocalStorage = (updatedLists) => {
    setLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
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
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, items: updatedItems } : l
    );
    setItems(updatedItems);
    saveToLocalStorage(updatedLists);
  };

  const removeItem = (itemId) => {
    const updatedItems = items.filter((it) => it.id !== itemId);
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, items: updatedItems } : l
    );
    setItems(updatedItems);
    saveToLocalStorage(updatedLists);
  };

  const addItem = () => {
    if (newItem.trim() === "") return;
    const updatedItems = [
      ...items,
      { id: Date.now().toString(), name: newItem, done: false }
    ];
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, items: updatedItems } : l
    );
    setItems(updatedItems);
    setNewItem("");
    saveToLocalStorage(updatedLists);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, name: listName } : l
    );
    setIsEditingName(false);
    saveToLocalStorage(updatedLists);
  };

  const handleRenameBlur = () => {
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, name: listName } : l
    );
    setIsEditingName(false);
    saveToLocalStorage(updatedLists);
  };

  const addMember = () => {
    if (newMember.trim() === "") return;
    if (members.some((m) => m.name.toLowerCase() === newMember.toLowerCase())) {
      setNewMember("");
      return;
    }
    const updatedMembers = [
      ...members,
      { id: Date.now().toString(), name: newMember }
    ];
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, members: updatedMembers } : l
    );
    setMembers(updatedMembers);
    setNewMember("");
    saveToLocalStorage(updatedLists);
  };

  const removeMember = (memberId) => {
    const updatedMembers = members.filter((m) => m.id !== memberId);
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, members: updatedMembers } : l
    );
    setMembers(updatedMembers);
    saveToLocalStorage(updatedLists);
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
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/lists")}>
        Back
      </button>

      <div className="list-header">
        {isEditingName && isOwner ? (
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
            onClick={isOwner ? () => setIsEditingName(true) : undefined}
            className={isOwner ? "editable-title" : ""}
          >
            {listName}
            {isOwner && <span className="edit-hint">✏️</span>}
          </h2>
        )}
      </div>

      <div className="section">
        <h3>Items</h3>
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
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.done ? "done" : ""}>{item.name}</span>
            </div>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}

        {(isOwner || members.some((m) => m.name === currentUser)) && (
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

      <div className="section">
        <h3>Members</h3>

        {members.map((m) => (
          <div key={m.id} className="member-row">
            <span>
              {m.name}
              {m.name === list.owner && " (Owner)"}
            </span>
            {isOwner && m.name !== list.owner && (
              <button onClick={() => removeMember(m.id)}>Remove</button>
            )}
          </div>
        ))}

        {isOwner && (
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

      <div className="section" style={{ marginTop: "30px" }}>
        {isOwner ? (
          <button
            onClick={deleteList}
            style={{ backgroundColor: "#d33636", marginTop: "10px" }}
          >
            Delete List
          </button>
        ) : (
          <button
            onClick={leaveList}
            style={{ backgroundColor: "#f39c12", marginTop: "10px" }}
          >
            Leave List
          </button>
        )}
      </div>
    </div>
  );
}
