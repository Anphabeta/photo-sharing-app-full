const express = require("express");
const router = express();

const User = require("../db/userModel");

router.post("/login", async (request, response) => {
  const user = await User.find({ login_name: request.body.login_name });
  if (user) {
    request.session.userId = user._id;
    response.send({ message: "success" });
  } else {
    response.status(400).send("May ngu");
  }
});

router.post("/logout", (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      response.status(500).send("error logging out");
    } else {
      response.redirect("/");
    }
  });
});

module.exports = router;
