import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 * Chỉ hiển thị danh sách người dùng khi đã đăng nhập (loginUser != null).
 */
function UserList({ loginUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Chỉ fetch khi đã đăng nhập
    if (!loginUser) {
      setUsers([]);
      return;
    }

    async function fetchData() {
      const data = await fetchModel.get("/user/list");
      setUsers(data);
    }
    fetchData();
  }, [loginUser]); // re-run khi trạng thái login thay đổi

  if (!loginUser) {
    return (
      <Typography variant="body2" sx={{ padding: 2, color: "text.secondary" }}>
        Vui lòng đăng nhập để xem danh sách người dùng.
      </Typography>
    );
  }

  return (
    <div>
      <List component="nav">
        {users.map((item) => (
          <div key={item._id}>
            <Link to={`/users/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItem>
                <ListItemText primary={item.first_name} />
              </ListItem>
            </Link>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;
