import "./App.css";

import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = (props) => {
  const [owner, setOwner] = useState("");

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar owner={owner} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/users/:userId"
                  element={<UserDetail onOwnerChange={setOwner} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotos onOwnerChange={setOwner} />}
                />
                <Route path="/users" element={<UserList />} />
                <Route path="/login" element={<LoginRegister />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
