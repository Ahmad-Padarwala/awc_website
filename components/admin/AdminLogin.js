import Toast, { ErrorToast } from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AdminLogin = () => {
  // global state
  const router = useRouter();

  // state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // hadnle input value when it is change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // login submit
  const loginAuth = (e) => {
    e.preventDefault();

    const data = {
      username: loginData.username,
      password: loginData.password,
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/login/router`;
    axios
      .post(url, data)
      .then((response) => {
        localStorage.setItem("token", response.data.token); // Save token  in local storage
        router.push("/admin/admindashboard");
      })
      .catch((error) => {
        console.log(error);
        ErrorToast("Password is In correct");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin/admindashboard");
    }
  }, []);

  //page render
  return (
    <>
      <div>
        <form className="login_form_box">
          <h1 className="text-white">LOGIN</h1>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="username_input"
            value={loginData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="username_input"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="submit"
            className="login_btn"
            onClick={loginAuth}
            value="Login"
          />
        </form>
      </div>
      <Toast />
    </>
  );
};

export default AdminLogin;
