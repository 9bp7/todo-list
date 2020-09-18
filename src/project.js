const Project = (name) => {
  let tasks = [];
  const addTask = (task) => tasks.push(task);
  const getTasks = () => tasks;
  return {addTask, getTasks};
}

export {Project};