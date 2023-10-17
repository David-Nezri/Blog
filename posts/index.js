//imports for service
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

//get request method and create API
app.get("/posts", (req, res) => {
  res.send(posts);
});

//post request method and create API 
app.post("/posts", async (req, res) => {
    //create uniq id
  const id = randomBytes(4).toString("hex");
  //we put all kind of data into a object 
  const { title } = req.body;

  //the post get the uniq id for ech post
  posts[id] = {
    id,
    title,
  };
 
  //we using microservices architecture so all the data path thru the event-bus service
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
