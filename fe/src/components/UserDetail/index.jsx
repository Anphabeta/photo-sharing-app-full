import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail({ onOwnerChange }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function fetchData() {
      const data = await fetchModel.get(`/user/${userId}`);
      setUserDetail(data);
      onOwnerChange(data.first_name); // dùng data thay vì state cũ
    }

    fetchData();
  }, [userId]); // chỉ re-run khi userId thay đổi, không phải khi userDetail thay đổi

  // const userDetail = models.userModel(userId);

  return (
    <>
      <Typography variant="h3">
        {userDetail.first_name} {userDetail.last_name}
      </Typography>
      <Typography variant="h5">{userDetail.occupation}</Typography>
      <Typography variant="h5">{userDetail.location}</Typography>
      <Typography variant="body1">{userDetail.description}</Typography>
      <Button variant="contained" onClick={() => navigate(`/photos/${userId}`)}>See Image</Button>
    </>
  );
}

export default UserDetail;
