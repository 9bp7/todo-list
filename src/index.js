import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {ViewHandler} from "./viewHandler.js";

let myProject = Project("Personal");

let myToDo = ToDoItem("Eat cereal", "", null, null, "", null);
let myToDo2 = ToDoItem("Eat cereal", "", null, null, "", null);
let myToDo3 = ToDoItem("Eat cereal", "", null, null, "", null);
let myToDo4 = ToDoItem("Eat cereal", "", null, null, "", null);

myProject.addTask(myToDo);
myProject.addTask(myToDo2);
myProject.addTask(myToDo3);
myProject.addTask(myToDo4);

myProject.getTasks().forEach(task => console.log(task.getTitle()));

ViewHandler.trackNewProjectButtons();