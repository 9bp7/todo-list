const AllProjects = (() => {
  let projects = [];
  const addProject = (project) => projects.push(project);
  const getAllProjects = () => projects;
  const getProject = (projectID) => {
    return projects[projectID];
  };
  return {addProject, getAllProjects, getProject};
})();

export {AllProjects};