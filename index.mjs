
// import librery 
import express from "express";
import cors from "cors";
import Jwt from "jsonwebtoken";

// import js file
import { } from "./Server/config.mjs";
import userModel from "./Server/users.mjs";
import taskModel from "./Server/tasks.mjs";

const app = express();
const jwtKey = "tms-miraki";
const port = process.env.PORT || 3500;

// use cors because it's allow share the resources across the application.
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
});

// User SignUp API's
app.post('/signup', async (req, res) => {

    let data = new userModel(req.body);
    data = await data.save();
    data = data.toObject();
    delete data.password;
    res.send(data);
    res.end();
});


// User Login API's
app.post('/login', async (req, res) => {

    if (req.body.email && req.body.password) {

        let data = await userModel.findOne(req.body).select('-password');

        if (data) {
            Jwt.sign({ data }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Data went wrong" });
                } else
                    res.send({ data, auth: token });
            })
        } else {
            res.send("Result : Data not found");
        }
    } else {
        res.send("Data Not Found");
    }
})

// Add Product API's
app.post('/add-task', verifyToken, async (req, res) => {

    let data = new taskModel(req.body);
    data = await data.save();
    res.send(data);
})


// Render Product List
app.get('/task-list', verifyToken, async (req, res) => {

    let data = await taskModel.find();
    if (data.length > 0) {
        res.send(data);
    } else {
        res.send("Data not found");
    }
})

// Delete Product API's
app.delete('/delete-task/:id', verifyToken, async (req, res) => {

    let data = await taskModel.deleteOne({ _id: req.params.id });
    res.send(data);
})

// First Get the data from database for updating data
app.get('/get-task/:id', verifyToken, async (req, res) => {

    let data = await taskModel.findOne({ _id: req.params.id });
    if (data) {
        res.send(data);
    } else {
        res.send("Data not found");
    }
})

// Update Product API's
app.put('/update-task/:id', verifyToken, async (req, res) => {

    let data = await taskModel.updateOne({ _id: req.params.id }, { $set: req.body });
    if (data) {
        res.send(data);
    } else {
        res.send("Data not updated");
    }
})

// Search API's
app.get('/search-task/:key', verifyToken, async (req, res) => {

    let data = await taskModel.find(
        {
            "$or": [
                { name: { $regex: req.params.key } },
                { company: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }
            ]
        });
    res.send(data);
})


function verifyToken(req, res, next) {

    let token = req.headers["authorization"];

    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(403).send({ result: "Please enter correct token with headers" });
            } else {
                next();
            }
        })
    } else {
        res.status(401).send({ result: "Please provide token with headers" });
    }
    // console.log("Middleware created...!", token);
}

app.get("/", (req, res) => res.type('html').send(html));


// Listen port 3500 on server
app.listen(port, () => {
    console.log("Server Started...!");
})


const html = `

<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
     Congratulation for successfully deployment...!
    </section>
  </body>
</html>

`