const express = require("express");
const router = express.Router();

const User = require("../db/userModel");

// GET /api/admin/session — Kiểm tra session hiện tại, trả về user nếu còn đăng nhập
router.get("/session", async (request, response) => {
  if (!request.session || !request.session.userId) {
    return response.status(401).send({ message: "Chưa đăng nhập." });
  }
  try {
    const user = await User.findById(request.session.userId);
    if (!user) {
      return response.status(401).send({ message: "Session không hợp lệ." });
    }
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send({ message: "Lỗi server." });
  }
});

// POST /api/admin/login
router.post("/login", async (request, response) => {
  const { login_name, password } = request.body;

  if (!login_name || !password) {
    return response.status(400).send({ message: "Vui lòng nhập tên đăng nhập và mật khẩu." });
  }

  try {
    const user = await User.findOne({ login_name: login_name });

    if (!user) {
      return response.status(400).send({ message: "Tên đăng nhập không tồn tại." });
    }

    if (user.password !== password) {
      return response.status(400).send({ message: "Mật khẩu không đúng." });
    }

    // Lưu thông tin vào session
    request.session.userId = user._id;

    // Trả về thông tin user (bắt buộc có _id)
    response.status(200).send(user);
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).send({ message: "Lỗi server." });
  }
});


// POST /api/admin/logout
router.post("/logout", (request, response) => {
  // Trả về 400 nếu người dùng chưa đăng nhập
  if (!request.session || !request.session.userId) {
    return response.status(400).send({ message: "Không có phiên đăng nhập nào đang hoạt động." });
  }

  request.session.destroy((err) => {
    if (err) {
      return response.status(500).send({ message: "Lỗi khi đăng xuất." });
    }
    response.status(200).send({ message: "Đăng xuất thành công." });
  });
});

module.exports = router;
