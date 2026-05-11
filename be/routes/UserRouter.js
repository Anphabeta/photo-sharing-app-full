const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// GET /api/user/list — Danh sách tất cả user (yêu cầu đăng nhập)
router.get("/list", requireAuth, async (request, response) => {
  try {
    const data = await User.find({}).select("_id first_name last_name");
    response.status(200).send(data);
  } catch (error) {
    response.status(500).send({ error: "Lỗi server." });
  }
});

// POST /api/user — Đăng ký người dùng mới (public)
router.post("/", async (request, response) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = request.body;

  // Validate các trường bắt buộc
  if (!first_name || !first_name.trim()) {
    return response.status(400).send({ message: "first_name không được để trống." });
  }
  if (!last_name || !last_name.trim()) {
    return response.status(400).send({ message: "last_name không được để trống." });
  }
  if (!login_name || !login_name.trim()) {
    return response.status(400).send({ message: "login_name không được để trống." });
  }
  if (!password || !password.trim()) {
    return response.status(400).send({ message: "password không được để trống." });
  }

  try {
    // Kiểm tra login_name đã tồn tại chưa
    const existing = await User.findOne({ login_name: login_name.trim() });
    if (existing) {
      return response.status(400).send({ message: "Tên đăng nhập đã được sử dụng." });
    }

    const newUser = new User({
      login_name: login_name.trim(),
      password: password,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location?.trim() || "",
      description: description?.trim() || "",
      occupation: occupation?.trim() || "",
    });

    await newUser.save();

    // Trả về thông tin user (có chứa login_name)
    response.status(201).send({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (error) {
    console.error("Register error:", error);
    response.status(400).send({ message: "Đăng ký thất bại. Vui lòng thử lại." });
  }
});

// GET /api/user/:id — Chi tiết một user (yêu cầu đăng nhập)
router.get("/:id", requireAuth, async (request, response) => {
  try {
    const userDetail = await User.findOne({ _id: request.params.id });
    if (!userDetail) {
      return response.status(404).send({ error: "Không tìm thấy người dùng." });
    }
    response.status(200).send(userDetail);
  } catch (error) {
    response.status(400).send({ error: "Bad Request." });
  }
});

module.exports = router;
