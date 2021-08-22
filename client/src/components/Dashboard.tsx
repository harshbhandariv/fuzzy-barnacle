import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { secureFetch } from "../App";
// import { secureFetch } from "../App";

export default function Dashboard({ isLoggedIn }: any) {
  const [user, setUser] = useState({ name: "", email: "", pic: "" });
  const history = useHistory();
  useEffect(
    function () {
      secureFetch("/api/whoami")
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          history.push("/login");
        });
    },
    [history]
  );
  if (!isLoggedIn) {
    history.push("/");
  }
  return (
    <div>
      <Typography variant="h1">Dashboard</Typography>
      <div>
        <img src={user.pic} alt={user.name} />
      </div>
      <div>{user.name}</div>
      <div>{user.email}</div>
    </div>
  );
}
