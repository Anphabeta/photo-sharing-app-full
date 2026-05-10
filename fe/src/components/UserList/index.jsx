import React, { useState, useEffect } from "react";
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchModel.get("/user/list");

      setUsers(data);
    }
    fetchData();
  });

  return (
    <div>
      <List component="nav">
        {users.map((item) => (
          <div key={item._id}>
            <Link href={`/users/${item._id}`}>
              <ListItem>
                <ListItemText primary={item.first_name} />
              </ListItem>
            </Link>
            <Divider />
          </div>
        ))}
      </List>
      <Typography variant="body1">
        The model comes in from models.userListModel()
      </Typography>
    </div>
  );
}

export default UserList;
