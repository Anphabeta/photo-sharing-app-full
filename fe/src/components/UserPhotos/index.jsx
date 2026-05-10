import React, { useState, useEffect } from "react";
import { Typography, CardMedia, Link, Divider, Card } from "@mui/material";

import "./styles.css";
import { useParams } from "react-router-dom";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ onOwnerChange }) {
  const { userId } = useParams();
  // const imgList = models.photoOfUserModel(userId);
  // const userDetail = models.userModel(userId);
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchModel.get(`/photo/${userId}`);
      setImgList(data);
    }
    fetchData();
  }, []);

  const [userDetail, setUserDetail] = useState({});
  useEffect(() => {
    async function fetchData() {
      const data = await fetchModel.get(`/user/${userId}`);
      setUserDetail(data);
      onOwnerChange(`Photos of ${userDetail.first_name}`);
    }
    fetchData();
  }, [userDetail]);

  return (
    <>
      {imgList?.map((imgInfo) => (
        <Card sx={{ margin: 2, backgroundColor: "#F5ECDA" }} key={imgInfo._id}>
          <Typography variant="body1">{imgInfo.date_time}</Typography>
          <CardMedia
            component="img"
            image={require(`../../images/${imgInfo.file_name}`)}
            alt={imgInfo.file_name}
          />
          <Card sx={{ backgroundColor: "#F5ECDA" }}>
            {imgInfo.comments?.map(({ date_time, user, comment }) => (
              <div key={user._id}>
                <Link href={`/users/${user._id}`}>
                  <Typography variant="h6">{user.first_name}</Typography>
                </Link>
                <Typography variant="body2">{date_time}</Typography>
                <Typography variant="body1" sx={{ margin: 1 }}>
                  {comment}
                </Typography>
                <Divider />
              </div>
            ))}
          </Card>
        </Card>
      ))}
    </>
  );
}

export default UserPhotos;
