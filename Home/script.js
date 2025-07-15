const todos = [
  {
    id: 1,
    text: "Take the trash",
    isCompleted: true,
  },

  {
    id: 2,
    text: "Visit yuh friend",
    isCompleted: true,
  },

  {
    id: 3,
    text: "Cook",
    isCompleted: false,
  },
];

const todoJSON = JSON.stringify(todos);
console.log(todoJSON);
