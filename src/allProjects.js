const AllProjects = (() => {
  let projects = [];
  const addProject = (project) => projects.push(project);
  const getAllProjects = () => projects;
  const getProject = (projectID) => {
    return projects[projectID];
  };
  const getProjectCount = () => projects.length;
  const getProjectIndex = (project) => projects.indexOf(project);
  return {addProject, getAllProjects, getProject, getProjectCount, getProjectIndex};
})();

export {AllProjects};