const express = require("express");
const mongooose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportFunc = require("./config/passport");
const cors = require("cors");
const path = require('path'); 

const users = require("./routes/api/users");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:3000"
}));

// DB config
const db = require("./config/keys").mongoURI;

const PORT = 5001;

// Connect to MongoDB
mongooose
    .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(console.log("Successfully connected to the database"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

passportFunc(passport);

// Routes
app.use("/api/users", users);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server up and running on port ${port}`));