const BASE_URL = "http://localhost:3001";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}

export async function getLists() {
  const res = await fetch(`${BASE_URL}/lists`);
  return handleResponse(res);
}

export async function getList(id) {
  const res = await fetch(`${BASE_URL}/lists/${id}`);
  if (res.status === 404) return null;
  return handleResponse(res);
}

export async function createList(name, owner) {
  const body = {
    id: Date.now().toString(),
    name,
    owner,
    members: [{ id: owner.toLowerCase(), name: owner }],
    items: [],
    archived: false
  };
  const res = await fetch(`${BASE_URL}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function deleteList(id) {
  const res = await fetch(`${BASE_URL}/lists/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete failed");
  }
  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function toggleArchive(id) {
  const currentRes = await fetch(`${BASE_URL}/lists/${id}`);
  const current = await handleResponse(currentRes);

  const res = await fetch(`${BASE_URL}/lists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ archived: !current.archived })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function renameList(id, newName) {
  const res = await fetch(`${BASE_URL}/lists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName })
  });
  await handleResponse(res);
  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function addItem(listId, itemName) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const newItem = {
    id: Date.now().toString(),
    name: itemName,
    done: false
  };

  const updatedItems = [...list.items, newItem];

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: updatedItems })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function toggleItem(listId, itemId) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const updatedItems = list.items.map((it) =>
    it.id === itemId ? { ...it, done: !it.done } : it
  );

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: updatedItems })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function removeItem(listId, itemId) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const updatedItems = list.items.filter((it) => it.id !== itemId);

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: updatedItems })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function addMember(listId, memberName) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const already = list.members.some(
    (m) => m.name.toLowerCase() === memberName.toLowerCase()
  );
  if (already) {
    const resAll = await fetch(`${BASE_URL}/lists`);
    return handleResponse(resAll);
  }

  const newMember = {
    id: Date.now().toString(),
    name: memberName
  };

  const updatedMembers = [...list.members, newMember];

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members: updatedMembers })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function removeMember(listId, memberId) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const updatedMembers = list.members.filter((m) => m.id !== memberId);

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members: updatedMembers })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}

export async function leaveList(listId, userName) {
  const listRes = await fetch(`${BASE_URL}/lists/${listId}`);
  const list = await handleResponse(listRes);

  const updatedMembers = list.members.filter((m) => m.name !== userName);

  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members: updatedMembers })
  });
  await handleResponse(res);

  const resAll = await fetch(`${BASE_URL}/lists`);
  return handleResponse(resAll);
}
