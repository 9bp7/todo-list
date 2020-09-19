const ToDoItem = (title, description, dueDate, priority, notes, checklist) => {
  const setTitle = (newTitle) => title = newTitle;
  const setDescription = (newDescription) => description = newDescription;
  const setDueDate = (newDueDate) => dueDate = newDueDate;
  const setPriority = (newPriority) => priority = newPriority;
  const setNotes = (newNotes) => notes = newNotes;
  const setChecklist = (newChecklist) => checklist = newChecklist;

  const getTitle = () => title;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  const getChecklist = () => checklist;
  return {setTitle, setDescription, setDueDate, setPriority, setNotes, setChecklist, getTitle, getDescription, getDueDate, getPriority, getNotes, getChecklist};
};

export {ToDoItem};