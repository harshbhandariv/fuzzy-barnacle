import { Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Login({ isLoggedIn }: any) {
  const history = useHistory();
  if (isLoggedIn) {
    history.push("/");
  }
  return (
    <div>
      <Typography variant="h1">Login</Typography>
      <Button
        href="http://localhost:4000/api/auth/github"
        variant="outlined"
        style={{ margin: "16px" }}
      >
        Github
      </Button>
      <Button
        href="http://localhost:4000/api/auth/google"
        variant="outlined"
        style={{ margin: "16px" }}
      >
        Google
      </Button>
    </div>
  );
}
