import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import  { useState } from "react";
import axios from "axios";
import { AlertDestructive } from "./components/Alert";
import {AlertInfo} from "./components/infoAlert";
import picture from "./assets/login2.png";
import logo from "./assets/logo.png";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = async (e:any) => {
    e.preventDefault();
    try {
       await axios.post(`${import.meta.env.VITE_URL}password_reset/`, {
        email: email,
      });
      setErr("");
      setInfo(`Email was sent to ${email}, please check your email for further instructions.`);
    } catch (error:any) {
        setInfo("");
      setErr(error.response.data.email ); 
    }
  };

  return (
    <div className="flex w-screen relative h-screen">
      {err && (
        <AlertDestructive description={`${err}`} />
      )}
      {info && (
        <AlertInfo description={`${info}`} />
      )}
      <div className="w-[40%] h-screen my-auto relative">
        <form onSubmit={handleLogin} className="w-[70%] mx-auto h-fit my-auto pt-[15vh] flex flex-col">
          <div className="flex gap-4">
            <img src={logo} className="mb-[8vh] w-[3vw] mx-auto rounded-xl" alt="Logo" />
          </div>
          <h1 className="text-center font-bold text-[3ch]">Request password reset email</h1>
          <h2 className="text-center text-gray-400 text-[1.9ch] mb-[6vh]">Please enter you email below</h2>
          <Label className="text-lg mb-1">Email</Label>
          <input
            type="email"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh]"
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h2 className="text-center mt-[2vh] text-gray-400 text-[1.5ch] mb-[8vh]">
            Remember your password? <a href="/" className="text-blue-400">log in</a>
          </h2>
          <Button type="submit" className="bg-white px-[15%] text-black w-fit mx-auto hover:bg-gray-100 transition-all">
            Submit
          </Button>
        </form>
        <h2 className="absolute bottom-[1vw] left-[1vw] text-gray-200 text-[1.3ch]">
          Copyright © Dyne Research 2024. All rights reserved.
        </h2>
      </div>
      <img className="w-[60%] object-cover object-right" src={picture} alt="Background" />
    </div>
  );
};

export default ForgotPasssword;