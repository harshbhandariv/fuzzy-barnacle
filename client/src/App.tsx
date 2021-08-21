import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Nav from "./components/Nav";

export function secureFetch(uri: string) {
  return axios.get(uri, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
let accessToken = "";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(function () {
    axios
      .get("/api/auth/refresh_token")
      .then(({ data }) => {
        setIsLoading(false);
        if (data.accessToken) {
          accessToken = data.accessToken;
          setIsLoggedIn(true);
        }
      })
      .catch(({ response: { data } }) => {
        if (data.error === "No cookie present") {
          setIsLoading(false);
          setIsLoggedIn(false);
        } else {
          setIsError(true);
        }
      });
  }, []);
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isLoggedIn) {
      intervalId = setInterval(() => {
        axios
          .get("/api/auth/refresh_token")
          .then(({ data }) => {
            if (data.accessToken) {
              accessToken = data.accessToken;
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
            }
          })
          .catch(({ response }) => {
            setIsLoggedIn(false);
          });
      }, 14 * 1000 * 60);
    }
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);
  if (isLoading) {
    return <Spinner />;
  } else if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <div className="App">
        <BrowserRouter>
          <Nav isLoggedIn={isLoggedIn} />
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/login">
              <Login isLoggedIn={isLoggedIn} />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
};

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
}

export default App;
