import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";
import {AllModals, Modal, PopupModal, ConfirmCancelModal, FormModal} from "./modals.js";

let inboxProject = Project("Inbox", true);
AllProjects.addProject(inboxProject);
/*let toDo = ToDoItem('This is complete first', 'More info about this amazing thing', "2020-09-19", "high", null, null);
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
inboxProject.addTask(toDo5);*/
//ViewHandler.displayProject(0);





/*let myFormModal = FormModal('New Task', addTask, null, 'Add Task', 'Cancel');

function addTask(formData) {
  let errors = false;
  for (let pair of formData.entries()) {
    if(pair[0] === 'modifytask-name') {
      if(pair[1].length === 0) {
        myFormModal.addErrorLabel('You need to enter a task name!', pair[0]);
        errors = true;
      } else {
        myFormModal.removeErrorLabel(pair[0]);
      }      
    }
  }

  if(!errors) {

  }
}

function cancel() {
  console.log('cancel');
}

let newTaskHTML =
  `<input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name" tabindex="0">
    <input type="text" id="modifytask-desc" name="modifytask-desc" placeholder="Description"> 
    <label for="modifytask-duedate">Due date (optional):</label>   
    <input type="date" id="modifytask-duedate" name="modifytask-duedate">
    <label for="modifytask-duedate">Priority:</label>   
    <select id="modifytask-priority" name="modifytask-priority">
      <option value="low">Low</option>
      <option value="med">Medium</option>
      <option value="high">High</option>
    </select>
    <textarea id="modifytask-notes" name="modifytask-notes" rows="3" placeholder="Add additional notes here"></textarea>`;


myFormModal.addFormHTML(newTaskHTML);
myFormModal.show();*/

//let modalTest3 = ConfirmCancelModal('Delete Project', 'Do you really wish to delete this project?', confirm, cancel, "Delete Project", "Cancel", true);
//modalTest3.show();

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
