const AllProjects = (() => {
  let projects = [];
  const addProject = (project) => projects.push(project);
  return {addProject};
})();

export {AllProjects};