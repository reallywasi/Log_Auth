import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js"; // to be used as a middleware
import dotenv from 'dotenv';
dotenv.config();

//==========================================================================
const app = express();

app.use(express.json());
app.use(cors());

//morgan ==> library to log all the http request inside the console

app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about your stack

const port = 8080;

//==========================================================================

// HTTP GET Request

app.get("/", (req, res) => {
  res.status(201).json("home get request");
});
//==========================================================================
//____API ROUTES____

app.use("/api", router);

//==========================================================================
// start server only when we'll have a valid connection
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("cannot connect to server");
    }
  })
  .catch((error) => {
    console.log("INVALID DATABASE CONNECTION", error);
  });

