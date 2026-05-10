import React from "react";
import { AppBar, Toolbar, Typography, Link } from "@mui/material";

import "./styles.css";
import { useParams } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ owner }) {
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Link href="/login">
          <Typography variant="h5" color="white">
            Login
          </Typography>
        </Link>

        <Typography variant="h5" color="inherit" sx={{ marginLeft: "auto" }}>
          {owner}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
