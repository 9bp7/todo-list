import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";
import {Modal, NewTaskModal} from "./modals.js";

let inboxProject = Project("Inbox", true);
AllProjects.addProject(inboxProject);
let toDo = ToDoItem('Test', 'More info about the test', null, null, null, null);
inboxProject.addTask(toDo);
ViewHandler.displayProject(0);

inboxProject = Project("Personal");
AllProjects.addProject(inboxProject);
inboxProject = Project("Work");
AllProjects.addProject(inboxProject);

//let myModal = Modal("New Task");
//myModal.show();
//NewTaskModal.show();

ViewHandler.updateSideBar();
ViewHandler.trackNewProjectButtons();
