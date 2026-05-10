const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/:id", async (request, response) => {
  if (!request.session.userId) {
    return response.status(401).send("May chưa đăng nhập");
  }
  try {
    const photosOfUser = await Photo.find({
      user_id: request.params.id,
    }).select("_id user_id comments file_name date_time");

    const photosResponse = JSON.parse(JSON.stringify(photosOfUser));

    for (let photo of photosResponse) {
      if (photo.comments && photo.comments.length > 0) {
        for (let cmt of photo.comments) {
          cmt.user = await User.findById(cmt.user_id).select(
            "first_name last_name",
          );
          delete cmt.user_id;
        }
      }
    }

    response.status(200).send(photosResponse);
  } catch (error) {
    response.status(400).send({ error: "Breaking Bad" });
  }
});

module.exports = router;
