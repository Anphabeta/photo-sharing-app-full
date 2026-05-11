const express = require("express");
const session = require("express-session");
const path = require("path");
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

app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,               // Cho phép gửi/nhận cookie session
  })
);
app.use(express.json());

// Serve ảnh tĩnh: ưu tiên be/images/ (upload mới), fallback sang fe/src/images/ (ảnh sample)
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/images", express.static(path.join(__dirname, "../fe/src/images")));

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/admin", LoginRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
