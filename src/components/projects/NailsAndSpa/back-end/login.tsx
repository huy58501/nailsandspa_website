import React, { useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "react-bootstrap";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import "@/src/styles/projects/NailsAndSpa/back-end/main.css";

export default function Login() {
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("admin");
  const [regisUsername, setRegisUsername] = useState<string>("");
  const [regisPassword, setRegisPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [signUpMessage, setSingUpErrorMessage] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://nailsandspa-e594ee8666f0.herokuapp.com/api/auth/login",
        {
          username: username,
          password: password,
        }
      );
      const token = response.data.token;
      Cookies.set("token", token, { expires: 6 });
      Cookies.set("user", username, { expires: 6 });
      // localStorage.setItem('token', token); // Example
      if (response.status === 200) {
        window.location.href = "/projects/sweetienails/dashboard";
      } else {
        console.error("Unexpected status code:", response.status);
        setErrorMessage("Username or password incorrect !!!");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorMessage("Error occurred during login");
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "https://nailsandspa-e594ee8666f0.herokuapp.com/api/auth/signUp",
        {
          username: regisUsername,
          password: regisPassword,
        }
      );
      if (response.status === 201) {
        // Assuming the server returns 201 Created on successful sign up
        setSingUpErrorMessage("You are Sign Up successful !!!");
        setRegisUsername("");
        setRegisPassword("");
        setVisible(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setRegisPassword("");
          setSingUpErrorMessage("Password cannot be empty, try again !!!");
        } else if (error.response.status === 409) {
          setRegisUsername("");
          setRegisPassword("");
          setSingUpErrorMessage("Username already exists, try again !!!");
        } else {
          setSingUpErrorMessage(
            "An unexpected error occurred, please try again later."
          );
        }
      } else {
        console.error("Error occurred during sign up:", error);
        setSingUpErrorMessage(
          "An unexpected error occurred, please try again later."
        );
      }
    }
  };

  return (
    <>
      <Card
        style={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "100px",
          border: "none",
        }}
      >
        <div className="flex flex-column md:flex-row">
          <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Username</label>
              <InputText
                id="username"
                type="text"
                className="w-12rem"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Password</label>
              <InputText
                id="password"
                type="password"
                className={`w-12rem ${errorMessage ? "p-invalid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <Button
              label="Login"
              icon="pi pi-user"
              className="w-10rem mx-auto"
              onClick={handleLogin}
            ></Button>
          </div>
          <div className="w-full md:w-2">
            <Divider layout="vertical" className="hidden md:flex">
              <b>OR</b>
            </Divider>
            <Divider
              layout="horizontal"
              className="flex md:hidden"
              align="center"
            >
              <b>OR</b>
            </Divider>
          </div>
          <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              severity="success"
              className="w-10rem"
              onClick={() => setVisible(true)}
            ></Button>
            <Dialog
              header="Sign Up"
              visible={visible}
              style={{ width: "30vw" }}
              onHide={() => setVisible(false)}
              breakpoints={{ "960px": "75vw", "641px": "80vw" }}
            >
              <div
                style={{ paddingTop: "20px" }}
                className="flex flex-wrap justify-content-center align-items-center gap-2"
              >
                <label className="w-6rem">Username</label>
                <InputText
                  id="username"
                  type="text"
                  className="w-12rem"
                  value={regisUsername}
                  onChange={(e) => setRegisUsername(e.target.value)}
                />
              </div>
              <div
                style={{ paddingTop: "20px" }}
                className="flex flex-wrap justify-content-center align-items-center gap-2"
              >
                <label className="w-6rem">Password</label>
                <InputText
                  id="password"
                  type="password"
                  className={`w-12rem ${signUpMessage ? "p-invalid" : ""}`}
                  value={regisPassword}
                  onChange={(e) => setRegisPassword(e.target.value)}
                />
              </div>
              {signUpMessage && (
                <div
                  style={{ color: "green", textAlign: "center", width: "100%" }}
                >
                  {signUpMessage}
                </div>
              )}
              <div
                style={{ paddingTop: "20px" }}
                className="flex justify-content-center"
              >
                <Button
                  label="Sign Up"
                  icon="pi pi-user"
                  className="w-10rem"
                  onClick={handleSignUp}
                ></Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  label="Cancel"
                  icon="pi pi-user"
                  className="w-10rem"
                  onClick={() => setVisible(false)}
                ></Button>
              </div>
            </Dialog>
          </div>
        </div>
      </Card>
    </>
  );
}
