import { useEffect, useState } from "react";
import axios from "axios";
import { isEmpty } from "lodash";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState(``);

  //fetch all tasks
  useEffect(() => {
    axios
      .get("/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(`Error fetching tasks:`, err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!text.trim()) return;

    axios
      .post("/api/tasks", { text })
      .then((res) => {
        setTasks((prev) => [...prev, res.data]);
        setText("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`/api/tasks/${id}`)
      .then(() => setTasks((prev) => prev.filter((task) => task._id !== id)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        justifyContent: "center",
        border: "2px solid black", // <-- This adds the border
        borderRadius: "8px", // optional rounded corners
        maxWidth: "400px", // optional max width to keep it neat
        margin: "20px auto",
      }}
    >
      <h1>📝 Todo List</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a task"
      />
      <button style={{ marginLeft: "10px" }} onClick={addTask}>
        Add
      </button>
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          justifyContent: "center",
          border: "1px solid black", // <-- This adds the border
          borderRadius: "8px", // optional rounded corners
          maxWidth: "300px", // optional max width to keep it neat
          margin: "20px auto",
        }}
      >
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "20px",
            textAlign: "left",
          }}
        >
          {isEmpty(tasks) || tasks.length <= 0 ? (
            <i>Your todo-list is empty!</i>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                style={{
                  listStyleType: "disc", // keeps bullet
                  marginBottom: "10px",
                  position: "relative",
                  paddingRight: "90px", // gives space for buttons
                }}
              >
                {task.text}

                <span
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                  }}
                >
                  <button onClick={() => ""}>&#8987;</button>
                  <button
                    style={{ marginLeft: "5px" }}
                    onClick={() => deleteTask(task._id)}
                  >
                    &#128465;
                  </button>
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
