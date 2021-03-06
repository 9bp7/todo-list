import { Project } from "./project.js";
import { AllProjects } from "./allProjects.js";
import { ViewHandler } from "./viewHandler.js";

if (!AllProjects.saveExists()) {
  let inboxProject = Project("Inbox", true);
  AllProjects.addProject(inboxProject);
} else {
  AllProjects.load();
}

ViewHandler.displayAllProjects();
