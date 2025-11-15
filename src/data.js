export const shoppingLists = [
  {
    id: "1",
    name: "Weekend Shopping",
    owner: "Me",
    members: [
      { id: "me", name: "Me" },
      { id: "john", name: "John" },
      { id: "anna", name: "Anna" }
    ],
    items: [
      { id: "1", name: "Milk", done: true },
      { id: "2", name: "Bread", done: false },
      { id: "3", name: "Cheese", done: false }
    ],
    archived: false
  },
  {
    id: "2",
    name: "Office Supplies",
    owner: "John",
    members: [
      { id: "john", name: "John" },
      { id: "me", name: "Me" }
    ],
    items: [
      { id: "1", name: "Paper", done: false },
      { id: "2", name: "Pens", done: false }
    ],
    archived: false
  },
  {
    id: "3",
    name: "Holiday Shopping",
    owner: "Me",
    members: [
      { id: "me", name: "Me" },
      { id: "lucy", name: "Lucy" },
      { id: "david", name: "David" }
    ],
    items: [
      { id: "1", name: "Suitcase", done: true },
      { id: "2", name: "Sunscreen", done: false },
      { id: "3", name: "Beach towel", done: false },
      { id: "4", name: "Travel adapter", done: true }
    ],
    archived: true
  }
];
