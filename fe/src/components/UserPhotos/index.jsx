import React, { useState, useEffect } from "react";
import {
  Typography,
  CardMedia,
  Divider,
  Card,
  TextField,
  Button,
  Box,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

// ─── Helper: format thời gian thân thiện người dùng ────────────────────────
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── CommentForm ─────────────────────────────────────────────────────────────
function CommentForm({ photoId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Bình luận không được để trống.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updatedPhoto = await fetchModel.post(
        `/photo/commentsOfPhoto/${photoId}`,
        { comment: text.trim() }
      );
      if (updatedPhoto && updatedPhoto._id) {
        setText("");
        onCommentAdded(updatedPhoto);
      } else {
        setError(updatedPhoto?.message || "Gửi bình luận thất bại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1.5, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
        Thêm bình luận
      </Typography>
      <TextField
        label="Viết bình luận... (Enter để gửi)"
        multiline
        minRows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        size="small"
      />
      {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        size="small"
        sx={{ alignSelf: "flex-end" }}
      >
        {loading ? "Đang gửi..." : "Gửi bình luận"}
      </Button>
    </Box>
  );
}

// ─── CommentList ──────────────────────────────────────────────────────────────
function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2, color: "text.disabled", fontStyle: "italic" }}>
        Chưa có bình luận nào.
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowY: "auto", maxHeight: 400 }}>
      {comments.map(({ _id, date_time, user, comment }) => (
        <Box key={_id || `${user?._id}-${date_time}`}>
          <Box sx={{ px: 1.5, pt: 1.5 }}>
            <Link to={`/users/${user?._id}`} style={{ textDecoration: "none" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "primary.main", display: "inline" }}
              >
                {user?.first_name} {user?.last_name}
              </Typography>
            </Link>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", ml: 1, display: "inline" }}>
              {formatTime(date_time)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {comment}
            </Typography>
          </Box>
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
}

// ─── UserPhotos ───────────────────────────────────────────────────────────────
function UserPhotos({ onOwnerChange }) {
  const { userId } = useParams();
  const [imgList, setImgList] = useState([]);
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("md")); // md = 900px+

  useEffect(() => {
    async function fetchPhotos() {
      const data = await fetchModel.get(`/photo/${userId}`);
      setImgList(data);
    }
    fetchPhotos();
  }, [userId]);

  useEffect(() => {
    async function fetchUser() {
      const data = await fetchModel.get(`/user/${userId}`);
      onOwnerChange(`Photos of ${data.first_name}`);
    }
    fetchUser();
  }, [userId]);

  const handleCommentAdded = (updatedPhoto) => {
    setImgList((prev) =>
      prev.map((img) => (img._id === updatedPhoto._id ? updatedPhoto : img))
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      {imgList?.map((imgInfo) => (
        <Card
          key={imgInfo._id}
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
            backgroundColor: "#FEFAF4",
          }}
        >
          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{ display: "block", px: 2, pt: 1.5, color: "text.secondary", fontStyle: "italic" }}
          >
            📷 {formatTime(imgInfo.date_time)}
          </Typography>

          {/* Layout: ảnh + bình luận — hàng ngang (md+) hoặc dọc (nhỏ hơn) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              gap: 0,
            }}
          >
            {/* ── Ảnh ── */}
            <Box
              sx={{
                flex: isWide ? "0 0 55%" : "1 1 auto",
                maxWidth: isWide ? "55%" : "100%",
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:8081/images/${imgInfo.file_name}`}
                alt={imgInfo.file_name}
                sx={{
                  width: "100%",
                  maxHeight: 480,
                  objectFit: "contain",   // không crop, co lại vừa khung
                  backgroundColor: "#000",
                }}
              />
            </Box>

            {/* ── Bình luận ── */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderLeft: isWide ? "1px solid rgba(0,0,0,0.08)" : "none",
                borderTop: isWide ? "none" : "1px solid rgba(0,0,0,0.08)",
                minWidth: 0,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <CommentList comments={imgInfo.comments} />
              </Box>
              <CommentForm
                photoId={imgInfo._id}
                onCommentAdded={handleCommentAdded}
              />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
