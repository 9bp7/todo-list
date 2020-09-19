const ToDoItem = (title, description, dueDate, priority, notes, checklist) => {
  const getTitle = () => title;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  const getChecklist = () => checklist;
  return {getTitle, getDescription, getDueDate, getPriority, getNotes, getChecklist};
};

export {ToDoItem};