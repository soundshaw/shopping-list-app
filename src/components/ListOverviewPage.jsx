import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListOverviewPage({ lists, setLists }) {
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");
  const currentUser = "Me";

  const saveToLocalStorage = (updatedLists) => {
    setLists(updatedLists);
    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
  };

  const addList = () => {
    if (newListName.trim() === "") return;
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      owner: currentUser,
      members: [{ id: "me", name: currentUser }],
      items: [],
      archived: false
    };
    const updatedLists = [...lists, newList];
    saveToLocalStorage(updatedLists);
    setNewListName("");
  };

  const visibleLists = lists.filter(
    (l) =>
      !l.archived &&
      (l.owner === currentUser ||
        l.members.some((m) => m.name === currentUser))
  );

  return (
    <div className="page">
      <h2>My Shopping Lists</h2>

      <div className="list-container">
        {visibleLists.length > 0 ? (
          visibleLists.map((list) => (
            <div
              key={list.id}
              className="shopping-list-card"
              onClick={() => navigate(`/list/${list.id}`)}
            >
              <div className="list-title">{list.name}</div>
              <div className="list-owner">
                {list.owner === currentUser
                  ? "You are the Owner"
                  : `Owner: ${list.owner}`}
              </div>
            </div>
          ))
        ) : (
          <p>No lists to show.</p>
        )}
      </div>

      <div className="add-section">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New shopping list name..."
        />
        <button onClick={addList}>Add Shopping List</button>
      </div>
    </div>
  );
}
