const ToDoItem = (title, description, dueDate, priority, notes, checklist) => {
  let completed = false;
  let completionDate = null;
  const creationDate = Date.now();

  const setTitle = (newTitle) => title = newTitle;
  const setDescription = (newDescription) => description = newDescription;
  const setDueDate = (newDueDate) => dueDate = newDueDate;
  const setPriority = (newPriority) => priority = newPriority;
  const setNotes = (newNotes) => notes = newNotes;
  const setChecklist = (newChecklist) => checklist = newChecklist;
  const setComplete = (isComplete) => {
    completed = isComplete;
    if(isComplete) {
      completionDate = Date.now();
    }
  };

  const getTitle = () => title;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  const getChecklist = () => checklist;
  const getComplete = () => completed;
  const getCompletionDate = () => completionDate;
  const getCreationDate = () => creationDate;
  return {setComplete, getComplete, getCompletionDate, getCreationDate, setTitle, setDescription, setDueDate, setPriority, setNotes, setChecklist, getTitle, getDescription, getDueDate, getPriority, getNotes, getChecklist};
};

export {ToDoItem};