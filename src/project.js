const Project = (title, favourite = false) => {
  let tasks = [];
  const addTask = (task) => tasks.push(task);
  const getTask = (position) => tasks[position];
  const getTasks = () => tasks;
  const getTitle = () => title;
  const isFavourite = () => favourite;
  return {addTask, getTask, getTasks, getTitle, isFavourite};
}

export {Project};