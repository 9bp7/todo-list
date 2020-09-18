const Project = (title, favourite = false) => {
  let tasks = [];
  const addTask = (task) => tasks.push(task);
  const getTasks = () => tasks;
  const getTitle = () => title;
  const isFavourite = () => favourite;
  return {addTask, getTasks, getTitle, isFavourite};
}

export {Project};