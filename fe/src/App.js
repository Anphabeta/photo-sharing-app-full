import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import fetchModel from "./lib/fetchModelData";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = (props) => {
  const [loginUser, setLoginUser] = useState(null);
  const [owner, setOwner] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false); // tránh flash redirect

  // Khi app mount: kiểm tra session backend để restore trạng thái đăng nhập
  useEffect(() => {
    fetchModel.get("/admin/session")
      .then((user) => {
        if (user && user._id) {
          setLoginUser(user);
        }
      })
      .catch(() => {}) // 401 = chưa đăng nhập, bỏ qua
      .finally(() => setSessionChecked(true));
  }, []);

  const handleLogin = (user) => {
    setLoginUser(user);
  };

  const handleLogout = () => {
    setLoginUser(null);
    setOwner("");
  };

  // Higher-order component bảo vệ route: nếu chưa đăng nhập thì redirect về /login
  const ProtectedRoute = ({ element }) => {
    return loginUser ? element : <Navigate to="/login" replace />;
  };

  // Chờ session check xong mới render route — tránh flash về /login
  if (!sessionChecked) return null;

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar owner={owner} loginUser={loginUser} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList loginUser={loginUser} />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute
                      element={<UserDetail onOwnerChange={setOwner} />}
                    />
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <ProtectedRoute
                      element={<UserPhotos onOwnerChange={setOwner} />}
                    />
                  }
                />
                <Route
                  path="/users"
                  element={<ProtectedRoute element={<UserList loginUser={loginUser} />} />}
                />
                <Route
                  path="/login"
                  element={
                    loginUser ? (
                      <Navigate to="/users" replace />
                    ) : (
                      <LoginRegister onLogin={handleLogin} />
                    )
                  }
                />
                {/* Mặc định redirect về /login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
