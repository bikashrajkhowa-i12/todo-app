require("dotenv").config(); //loads the data of .env file
const apiRoutes = require("./routes");

//necessary imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //allows the frontend(react) to communicate to the backend

const app = express(); //Creates an instance of our Express app (our web server).

app.use(cors()); //Enables Cross-Origin requests (so React on port 3000 can call Express on port 5000).
app.use(express.json()); // Lets Express automatically parse incoming JSON in requests.

//now mongodb connections
mongoose
  .connect(process.env.MONGODB_URI, {
    //both are not mandatory for the newer versions
    useNewUrlParser: true, //Tells Mongoose to use the new MongoDB connection string parser. Setting it true ensures full compatibility with newer MongoDB URI formats.
    useUnifiedTopology: true, //This option provides better server monitoring, fewer bugs, and improved reliability for connecting to clusters.
  })
  .then(() => console.log(`✅ MongoDB connected`))
  .catch((err) => console.error(`❌ MongoDB connection error:`, err));

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const Task = mongoose.model("Task", TaskSchema);
//routes
//app.use('/api', apiRoutes(app))  TODO
// Routes
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
