const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  if (!request.session.userId) {
    return response.status(401).send("May chưa đăng nhập");
  }
  try {
    const data = await User.find({}).select("_id first_name last_name");
    response.status(200).send(data);
  } catch (error) {
    response.status(500).send({ error: "Server Errrrroooooorrrrr" });
  }
});

router.get("/:id", async (request, response) => {
  if (!request.session.userId) {
    return response.status(401).send("May chưa đăng nhập");
  }
  try {
    const userDetail = await User.findOne({ _id: request.params.id });
    response.status(200).send(userDetail);
  } catch (error) {
    response.status(400).send({ error: "Bad Request :)))" });
  }
});

module.exports = router;
