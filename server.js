const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");

/* PAGE ROUTES */

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname,  "login-system/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname,  "login-system/signup.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "login-system/index.html"));
});

app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname,  "login-system/jobs.html"));
});

app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname,  "login-system/history.html"));
});

app.use(express.static(path.join("login-system")));
app.use(express.static(__dirname + "/login-system"));  // ⭐ VERY IMPORTANT


const uri = "mongodb+srv://Amruta:Amruta2005@cluster0.f9jrxfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let usersCollection;
let applicationsCollection;

async function startServer() {

  await client.connect();
  console.log("Connected to MongoDB!");

  const db = client.db("recruaDB");

  usersCollection = db.collection("users");
  applicationsCollection = db.collection("applications");

  console.log("Database ready");

  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

}

startServer();



/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Job Portal Server is Running");
});



/* SIGNUP ROUTE */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


/* APPLY JOB ROUTE */

app.post("/apply", async (req, res) => {

const application = {

name: req.body.name,
job: req.body.job,
email: req.body.resume,
appliedDate: new Date()

};

await applicationsCollection.insertOne(application);

console.log("Application stored:", application);

res.send("Application submitted successfully");

});

app.post("/login", async (req, res) => {

const email = req.body.email;
const password = req.body.password;

const user = await usersCollection.findOne({
  email: email,
  password: password
});

if(user){
  res.send("Login successful");
}else{
  res.send("Invalid email or password");
}

});


app.post("/signup", async (req, res) => {

const existingUser = await usersCollection.findOne({
  email: req.body.email
});

if(existingUser){
  return res.send("User already exists");
}

const user = {
  name: req.body.name,
  email: req.body.email,
  password: req.body.password
};

await usersCollection.insertOne(user);

res.send("User registered successfully");

});