import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";
import {AllModals, Modal, ConfirmCancelModal} from "./modals.js";

let inboxProject = Project("Inbox", true);
AllProjects.addProject(inboxProject);
let toDo = ToDoItem('This is complete first', 'More info about this amazing thing', "2020-09-19", "high", null, null);
toDo.setComplete('true');
inboxProject.addTask(toDo);
let toDo2 = ToDoItem('Do something amazing', 'More info about this amazing thing', "2020-09-19", "low", null, null);
inboxProject.addTask(toDo2);
let toDo3 = ToDoItem('This is complete', 'More info about this amazing thing', "2020-09-19", "high", null, null);
toDo3.setComplete('true');
inboxProject.addTask(toDo3);
let toDo4 = ToDoItem('Do another great thing', 'More info about this amazing thing', "2020-09-19", "med", null, null);
inboxProject.addTask(toDo4);
let toDo5 = ToDoItem('Do another great thing', 'More info about this amazing thing', "2020-09-19", "med", null, null);
inboxProject.addTask(toDo5);
//ViewHandler.displayProject(0);

//let modalTest = Modal('New Task');
//let modalTest2 = Modal('Edit Task');
function confirm() {
  console.log('confirm')
}
function cancel() {
  console.log('cancel');
}

let modalTest3 = ConfirmCancelModal('Delete Project', 'Do you really wish to delete this project?', confirm, cancel, "Delete Project", "Cancel", true);
modalTest3.show();

inboxProject = Project("Personal");
AllProjects.addProject(inboxProject);
inboxProject = Project("Work");
AllProjects.addProject(inboxProject);


ViewHandler.displayAllProjects();
//ViewHandler.displayOneProject(1);

//let myModal = Modal("New Task");
//myModal.show();
//NewTaskModal.show();

//ViewHandler.updateSideBar();
//ViewHandler.trackNewProjectButtons();
