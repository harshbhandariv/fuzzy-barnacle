import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Nav({ isLoggedIn }: any) {
  const classes = useStyles();
  return (
    <div className={`${classes.root} Navbar`}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Safe Auth
            </Link>
          </Typography>
          {isLoggedIn === false ? (
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  margin: "0em 1em",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "0em 1em" }}
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="contained"
                color="primary"
                href="http://localhost:4000/api/auth/logout"
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
