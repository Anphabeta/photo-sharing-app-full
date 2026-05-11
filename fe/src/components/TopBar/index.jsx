import React, { useRef, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

const API_BASE = "http://localhost:8081";

/**
 * TopBar — hiển thị trạng thái đăng nhập và nút Add Photo / Logout.
 */
function TopBar({ owner, loginUser, onLogout, onPhotoAdded }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  // ── Logout ──────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetchModel.post("/admin/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    }
    onLogout();
    navigate("/login");
  };

  // ── Upload ảnh ──────────────────────────────────────────
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input để có thể chọn lại cùng file
    e.target.value = "";

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(`${API_BASE}/api/photo/new`, {
        method: "POST",
        credentials: "include",
        body: formData, // Không set Content-Type header — browser tự thêm boundary
      });

      const data = await response.json();

      if (response.ok && data._id) {
        setSnack({ open: true, message: "Tải ảnh lên thành công!", severity: "success" });
        // Thông báo cho parent refresh / navigate sang trang ảnh của mình
        if (onPhotoAdded) onPhotoAdded(data);
        else navigate(`/photos/${loginUser._id}`);
      } else {
        setSnack({ open: true, message: data?.message || "Tải ảnh thất bại.", severity: "error" });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setSnack({ open: true, message: "Lỗi kết nối khi tải ảnh.", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ fontWeight: "bold" }}>
            Photo Sharing App
          </Typography>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            {loginUser ? (
              <>
                <Typography variant="h6" color="inherit">
                  Hi {loginUser.first_name || loginUser.username}
                </Typography>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleAddPhotoClick}
                  disabled={uploading}
                  sx={{
                    borderColor: "rgba(255,255,255,0.7)",
                    "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  {uploading ? "Đang tải..." : "Add Photo"}
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    borderColor: "rgba(255,255,255,0.7)",
                    "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Typography variant="h6" color="inherit">
                Please Login
              </Typography>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Snackbar thông báo kết quả upload */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default TopBar;
