const express = require("express");
const path = require("path");
const multer = require("multer");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// Cấu hình multer: lưu file vào be/images/ với tên ngẫu nhiên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    // Tên file duy nhất: timestamp + số ngẫu nhiên + phần mở rộng gốc
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh."), false);
    }
  },
});

// POST /api/photo/new — Tải ảnh lên (yêu cầu đăng nhập)
router.post("/new", requireAuth, upload.single("photo"), async (request, response) => {
  // Multer đã xử lý file; nếu không có file thì request.file sẽ là undefined
  if (!request.file) {
    return response.status(400).send({ message: "Không có file ảnh trong yêu cầu." });
  }

  try {
    const newPhoto = new Photo({
      file_name: request.file.filename,
      date_time: new Date(),
      user_id: request.session.userId,
      comments: [],
    });

    await newPhoto.save();
    response.status(201).send(newPhoto);
  } catch (error) {
    console.error("Upload error:", error);
    response.status(400).send({ message: "Lưu ảnh thất bại." });
  }
});

// GET /api/photo/:id — Lấy ảnh của một user (yêu cầu đăng nhập)
router.get("/:id", requireAuth, async (request, response) => {
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
    response.status(400).send({ error: "Bad Request." });
  }
});

// POST /api/photo/commentsOfPhoto/:photo_id — Thêm bình luận vào ảnh (yêu cầu đăng nhập)
router.post("/commentsOfPhoto/:photo_id", requireAuth, async (request, response) => {
  const { comment } = request.body;

  // Từ chối bình luận trống
  if (!comment || comment.trim() === "") {
    return response.status(400).send({ message: "Bình luận không được để trống." });
  }

  try {
    const photo = await Photo.findById(request.params.photo_id);

    if (!photo) {
      return response.status(404).send({ message: "Không tìm thấy ảnh." });
    }

    // Tạo comment mới — user_id lấy từ session, date_time tự động
    const newComment = {
      comment: comment.trim(),
      date_time: new Date(),
      user_id: request.session.userId,
    };

    photo.comments.push(newComment);
    await photo.save();

    // Trả về photo đã được cập nhật (kèm thông tin user của từng comment)
    const updatedPhoto = JSON.parse(JSON.stringify(photo));
    for (let cmt of updatedPhoto.comments) {
      cmt.user = await User.findById(cmt.user_id).select("_id first_name last_name");
      delete cmt.user_id;
    }

    response.status(200).send(updatedPhoto);
  } catch (error) {
    console.error("Comment error:", error);
    response.status(400).send({ message: "Lỗi khi thêm bình luận." });
  }
});

module.exports = router;

