import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Load tasks from local storage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  const addTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task = {
      ...newTask,
      id: uuidv4()
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      completed: false
    });
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    if (!editingTask || editingTask.title.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask({
      ...editingTask,
      [name]: value
    });
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>To-Do List</h1>
      
      <div className="task-form">
        <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={editingTask ? editingTask.title : newTask.title}
          onChange={editingTask ? handleEditChange : handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Task description (optional)"
          value={editingTask ? editingTask.description : newTask.description}
          onChange={editingTask ? handleEditChange : handleInputChange}
        />
        <div className="form-row">
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={editingTask ? editingTask.dueDate : newTask.dueDate}
              onChange={editingTask ? handleEditChange : handleInputChange}
            />
          </label>
          <label>
            Priority:
            <select
              name="priority"
              value={editingTask ? editingTask.priority : newTask.priority}
              onChange={editingTask ? handleEditChange : handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        {editingTask ? (
          <div className="form-actions">
            <button onClick={saveEdit}>Save Changes</button>
            <button className="cancel" onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>

      <div className="filter-controls">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p>No tasks found. Add a new task to get started!</p>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`task ${task.completed ? 'completed' : ''} priority-${task.priority}`}
            >
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => startEditing(task)}>Edit</button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;