import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./style.css";

export default function Todo() {
  const [toDos, setToDos] = useState([]);
  const [addToDo, setAddToDo] = useState("");
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("all");

  const addToDoList = () => {
    if (addToDo.trim() !== "") {
      const newTodo = {
        id: uuidv4(),
        text: addToDo,
        completed: false,
        isEditing: false,
      };
      const updatedToDos = [...toDos, newTodo];
      setToDos(updatedToDos);
      localStorage.setItem("todo list", JSON.stringify(updatedToDos));
      setAddToDo("");
    }
  };

  const toggleCompleted = (id) => {
    const updatedToDos = toDos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDos(updatedToDos);
    localStorage.setItem("todo list", JSON.stringify(updatedToDos));
  };

  const editTodo = (id) => {
    const updatedToDos = toDos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: true } : todo
    );
    setToDos(updatedToDos);
    localStorage.setItem("todo list", JSON.stringify(updatedToDos));
    const todoToEdit = updatedToDos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditValue(todoToEdit.text);
    }
  };

  const saveTodo = (id) => {
    const updatedToDos = toDos.map((todo) =>
      todo.id === id ? { ...todo, text: editValue, isEditing: false } : todo
    );
    setToDos(updatedToDos);
    localStorage.setItem("todo list", JSON.stringify(updatedToDos));
  };

  const deleteTodo = (id) => {
    const updatedToDos = toDos.filter((todo) => todo.id !== id);
    setToDos(updatedToDos);
    localStorage.setItem("todo list", JSON.stringify(updatedToDos));
  };

  const filteredToDos = useMemo(() => {
    return toDos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "completed") return todo.completed;
      if (filter === "uncompleted") return !todo.completed;
      return true;
    });
  }, [filter, toDos]);

  useEffect(() => {
    const localToDos = JSON.parse(localStorage.getItem("todo list"));
    setToDos(localToDos);
  }, []);

  return (
    <div className="container">
      <div className="filer">
        <div>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("uncompleted")}>Uncompleted</button>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={addToDo}
            placeholder="Add a new task"
            onChange={(e) => setAddToDo(e.target.value)}
          />
          <button
            onClick={addToDoList}
            disabled={addToDo.length == 0}
            style={{
              backgroundColor: addToDo.length == 0 ? "transparent" : "#007bff",
              color: addToDo.length == 0 ? "#ddd" : "#fff",
            }}
          >
            Add
          </button>
        </div>
      </div>
      <div className="todos">
        {filteredToDos.map((todo) => (
          <div key={todo.id} className="task-list">
            {todo.isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <p
                className="taskText"
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </p>
            )}
            <button onClick={() => toggleCompleted(todo.id)}>
              {todo.completed ? "Completed" : "Uncompleted"}
            </button>
            {todo.isEditing ? (
              <button onClick={() => saveTodo(todo.id)}>Save</button>
            ) : (
              <button onClick={() => editTodo(todo.id)}>Edit</button>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
