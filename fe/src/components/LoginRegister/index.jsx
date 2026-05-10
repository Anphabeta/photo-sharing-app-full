import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister() {
  const [username, setUsername] = useState("");
  const [beRes, setBeRes] = useState(null);
  const [isSuc, setIsSuc] = useState(true);

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleClick = async () => {
    console.log("clicked");
    try {
      const data = await fetchModel.post("/admin/login", {
        username: username,
      });
      setBeRes(data);
      setIsSuc(beRes.message === "success");
    } catch (error) {
      setIsSuc(false);
    }
  };

  return (
    <>
      <TextField label="Username" value={username} onChange={handleChange} />
      <Button onClick={handleClick}>Submit</Button>
      {!isSuc && (
        <Typography sx={{ color: "red" }}>Đăng nhập thất bại</Typography>
      )}
    </>
  );
}

export default LoginRegister;
