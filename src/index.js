import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";

let inboxProject = Project("Inbox", true);
AllProjects.addProject(inboxProject);
ViewHandler.displayProject(0);

ViewHandler.updateSideBar();
ViewHandler.trackNewProjectButtons();
