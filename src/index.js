import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";
import {AllModals, Modal, PopupModal, ConfirmCancelModal, FormModal} from "./modals.js";

//localStorage.clear();
  
if(!AllProjects.saveExists()) {
  let inboxProject = Project("Inbox", true);
  AllProjects.addProject(inboxProject);
} else {
  AllProjects.load();
}

ViewHandler.displayAllProjects();
