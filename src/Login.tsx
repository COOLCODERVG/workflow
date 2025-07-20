import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertDestructive } from "./components/Alert";
import picture from "./assets/bg.png";
import logo from "./assets/logo.png";

const Loginform = () => {
  const [email, setEmail] = useState("demouser@workflow.com");
  const [password, setPassword] = useState("Testuser!");
  const [err, setErr] = useState("");

  const history = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}login/`, {
        username: email,
        password: password,
      });
      setErr("");

      // Update this line to retrieve the token correctly
      const token = response.data["access_token"]; // assuming 'access' is the key for the Bearer token

      // Set the Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("access_token", token); // store as 'access_token'
      localStorage.setItem("Data", JSON.stringify(response.data));
      history("/home");
    } catch (error: any) {
      setErr(error.response?.data?.detail || "Login failed, please try again."); // handle error properly
    }
  };

  return (
    <div className="flex w-screen relative h-screen">
      {err && <AlertDestructive description={`${err}, Please try again`} />}
      <div className="w-[40%] h-screen my-auto relative">
        <form
          onSubmit={handleLogin}
          className="w-[70%] mx-auto h-fit my-auto pt-[15vh] flex flex-col"
        >
          <div className="flex gap-4">
            <img
              src={logo}
              className=" w-[12vw] -mt-[5vh] mx-auto rounded-xl"
              alt="Logo"
            />
          </div>
          <h1 className="text-center font-bold text-[3.5ch] mt-10">
            Log in to your account
          </h1>
          <h2 className="text-center text-gray-400 text-[1.9ch] mb-[7vh]">
            Login with the predefined credentials below (*Demonstration purposes only).
          </h2>
          <Label className="text-lg mb-1">Email</Label>
          <input
            type="email"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh]"
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <Label className="text-lg mt-[3vh] mb-1">Password</Label>
          <input
            type="password"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] mb-[2vh]"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <h2 className="text-center text-gray-400 text-[1.5ch] mb-[6vh]">
            Forgot your password?{" "}
            <a href="/forgot-password/" className="text-blue-400">
              Reset it
            </a>
          </h2>
          <Button
            type="submit"
            className="bg-white px-[15%] text-black w-fit mx-auto hover:bg-gray-100 transition-all"
          >
            Login
          </Button>
        </form>
        <h2 className="absolute bottom-[1vw] left-[1vw] text-gray-200 text-[1.3ch]">
          Copyright © Varshith Gude 2024. All rights reserved.
        </h2>
      </div>
      <img
        className="w-[60%] object-cover object-right"
        src={picture}
        alt="Background"
      />
    </div>
  );
};

export default Loginform;