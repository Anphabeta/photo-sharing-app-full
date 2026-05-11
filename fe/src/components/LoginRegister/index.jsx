import { Button, TextField, Typography, Box, Paper, Tab, Tabs, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./style.css";

// ────────────────────────────────────────────────
// Form Đăng nhập
// ────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginName.trim() || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchModel.post("/admin/login", {
        login_name: loginName.trim(),
        password: password,
      });
      if (data && data._id) {
        onLogin(data);
        navigate(`/users/${data._id}`);
      } else {
        setErrorMsg(data?.message || "Đăng nhập thất bại.");
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
      <TextField
        label="Tên đăng nhập"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        autoFocus
      />
      <TextField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
      />
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        fullWidth
        sx={{ mt: 1 }}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </Box>
  );
}

// ────────────────────────────────────────────────
// Form Đăng ký
// ────────────────────────────────────────────────
function RegisterForm() {
  const emptyForm = {
    login_name: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleRegister = async () => {
    // Validate phía client
    if (!form.first_name.trim()) {
      setErrorMsg("Họ không được để trống.");
      return;
    }
    if (!form.last_name.trim()) {
      setErrorMsg("Tên không được để trống.");
      return;
    }
    if (!form.login_name.trim()) {
      setErrorMsg("Tên đăng nhập không được để trống.");
      return;
    }
    if (!form.password) {
      setErrorMsg("Mật khẩu không được để trống.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const data = await fetchModel.post("/user", {
        login_name: form.login_name.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        occupation: form.occupation.trim(),
      });

      if (data && data._id) {
        setSuccessMsg(`Đăng ký thành công! Chào mừng ${data.first_name} ${data.last_name}. Bạn có thể đăng nhập ngay.`);
        setForm(emptyForm);
      } else {
        setErrorMsg(data?.message || "Đăng ký thất bại.");
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
      {/* Thông tin bắt buộc */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="Họ *"
          value={form.first_name}
          onChange={set("first_name")}
          fullWidth
          size="small"
        />
        <TextField
          label="Tên *"
          value={form.last_name}
          onChange={set("last_name")}
          fullWidth
          size="small"
        />
      </Box>
      <TextField
        label="Tên đăng nhập *"
        value={form.login_name}
        onChange={set("login_name")}
        fullWidth
        size="small"
      />
      <TextField
        label="Mật khẩu *"
        type="password"
        value={form.password}
        onChange={set("password")}
        fullWidth
        size="small"
      />
      <TextField
        label="Xác nhận mật khẩu *"
        type="password"
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        fullWidth
        size="small"
        error={form.confirmPassword !== "" && form.password !== form.confirmPassword}
        helperText={
          form.confirmPassword !== "" && form.password !== form.confirmPassword
            ? "Mật khẩu không khớp"
            : ""
        }
      />

      {/* Thông tin tùy chọn */}
      <TextField
        label="Địa điểm"
        value={form.location}
        onChange={set("location")}
        fullWidth
        size="small"
      />
      <TextField
        label="Nghề nghiệp"
        value={form.occupation}
        onChange={set("occupation")}
        fullWidth
        size="small"
      />
      <TextField
        label="Mô tả bản thân"
        value={form.description}
        onChange={set("description")}
        fullWidth
        size="small"
        multiline
        minRows={2}
      />

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Button
        variant="contained"
        onClick={handleRegister}
        disabled={loading}
        fullWidth
      >
        {loading ? "Đang đăng ký..." : "Register Me"}
      </Button>
    </Box>
  );
}

// ────────────────────────────────────────────────
// Component chính: LoginRegister (tabs)
// ────────────────────────────────────────────────
function LoginRegister({ onLogin }) {
  const [tab, setTab] = useState(0);

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="60vh" pt={4}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 440 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
          Photo Sharing App
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 1 }}>
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        {tab === 0 && <LoginForm onLogin={onLogin} />}
        {tab === 1 && <RegisterForm />}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
