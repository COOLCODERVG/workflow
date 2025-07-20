import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertDestructive } from "./components/Alert";
import picture from "./assets/bg.png";
import logo from "./assets/logo.png";
import Select from "react-select";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [department, setDepartment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [poppassword, setPopPassword] = useState("");
  const [popover, setPopover] = useState(false);
  const history = useNavigate();

  const departments = [
    { value: "Game Design", label: "Game Design" },
    { value: "Programming", label: "Programming" },
    { value: "Art and Animation", label: "Art and Animation" },
    { value: "Narrative Design", label: "Narrative Design" },
    { value: "Marketing and Sales", label: "Marketing and Sales" },
    {
      value: "Business Development and Partnerships",
      label: "Business Development and Partnerships",
    },
    { value: "Human Resources", label: "Human Resources" },
    {
      value: "Finance and Administration",
      label: "Finance and Administration",
    },
    { value: "Legal and Compliance", label: "Legal and Compliance" },
    { value: "IT and Infrastructure", label: "IT and Infrastructure" },
    {
      value: "Website Development and Design",
      label: "Website Development and Design",
    },
    { value: "Stem Research", label: "Stem Research" },
  ];
  const handleAccess = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}validatepass/`, {
        password: poppassword,
      });
      setErr("");

      setPopover(false);
    } catch (error: any) {
      console.log(error);
      setErr(error.response?.data?.detail || "Login failed, please try again.");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}signup/`, {
        username: email,
        password: password,
        department: department, // Add department to the request body
        firstName: firstName, // Add firstName to the request body
        lastName: lastName, // Add lastName to the request body
      });
      setErr("");
      alert("Please Login now with your credentials");
      history("/");
    } catch (error: any) {
      console.log(error);
      setErr(error.response?.data?.detail || "Login failed, please try again."); // handle error properly
    }
  };

  return (
    <div className="flex w-screen relative h-screen">
      {popover && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-black p-8 rounded-lg text-center block shadow-lg w-[500px] border-neutral-700 border">
            <h2 className="mb-4 text-xl font-bold">Enter Access Password</h2>
            <input
              type="password"
              className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] w-full py-[1vh] mb-[2vh]"
              placeholder="Your DYNE access Token"
              onChange={(e) => setPopPassword(e.target.value)}
            />
            <Button
              className="bg-white px-[15%] text-black w-fit mx-auto hover:bg-gray-100 transition-all"
              onClick={handleAccess}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
      {err && <AlertDestructive description={`${err}, Please try again`} />}
      <div className="w-[40%] h-screen my-auto relative">
        <form
          onSubmit={handleLogin}
          className="w-[70%] mx-auto h-fit my-auto pt-[5vh] flex flex-col"
        >
          <div className="flex gap-4">
            <img
              src={logo}
              className=" w-[12vw] -mt-[10vh] mx-auto rounded-xl"
              alt="Logo"
            />
          </div>
          <h1 className="text-center font-bold text-[3.5ch] mb-[5vh]">
            Sign up for an account
          </h1>

          <div className="flex gap-4 w- ">
            <div className="flex-1">
              <Label className="text-lg mb-1">First Name</Label>
              <input
                type="text"
                className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] w-[100%] py-[1vh] mb-[2vh]"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label className="text-lg mb-1">Last Name</Label>
              <input
                type="text"
                className="bg-black border-[0.5px] border-gray-500 rounded-lg w-[100%] px-[1vw] py-[1vh] mb-[2vh]"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <Label className="text-lg  mb-1">Email</Label>
          <input
            type="email"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh]"
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label className="text-lg mt-[3vh] mb-1">Department</Label>
          <Select
            className="my-react-select-container "
            classNamePrefix="my-react-select"
            options={departments}
            value={department}
            onChange={(e: any) => {
              setDepartment(e);
            }}
            required
            placeholder={`Please select a department`}
          />
          <Label className="text-lg mt-[3vh] mb-1">Password</Label>
          <input
            type="password"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] mb-[2vh]"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h2 className="text-center text-gray-400 text-[1.5ch] mb-[6vh]">
            Have an account?{" "}
            <a href="/" className="text-blue-400">
              Login
            </a>
          </h2>
          <Button
            type="submit"
            className="bg-white px-[15%] text-black w-fit mx-auto hover:bg-gray-100 transition-all"
          >
            Signup
          </Button>
        </form>
        <h2 className="absolute bottom-[1vw] left-[1vw] text-gray-200 text-[1.3ch]">
          Copyright © Dyne Research 2024. All rights reserved.
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

export default SignupForm;