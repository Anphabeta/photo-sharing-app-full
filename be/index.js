const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const LoginRouter = require("./routes/LoginRouter");

dbConnect();

app.use(
  session({
    secret: "who-die-first-is-gay",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/admin", LoginRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
