import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { House, CircleCheckBig, Users, ClipboardList, ClipboardPen, ClipboardPenLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../assets/full-logo.png";
import logo2 from "../assets/logo.png";

interface Props {
    name: string;
}

export default function Sidebar(props: Props) {
    const [usrData, setUsrData] = useState(JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Member"]}'));
    const redirect = useNavigate();

    useEffect(() => {
        if (usrData['Id'] === -999) {
            redirect("/");
        }
    }, [usrData]);

    const [popup, setPopup] = useState(false);

    const handleLogout = async () => {
        try {
            localStorage.removeItem("access_token");
            localStorage.clear();
            delete axios.defaults.headers.common["Authorization"];
            localStorage.setItem(
                "Data",
                JSON.stringify({
                    User: "false",
                    Username: "false",
                    Id: -999,
                    userType: "Student",
                })
            );
            await axios.post('http://127.0.0.1:8000/04D2430AAFE10AA4/logout/');
            redirect("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    let menuItems = ["Home", "Tasks", "Department", "Team"];
    let links = ["/home", "/tasks", "/department", "/team"];
    let menuIcons = [
        <House key="House" />,
        <ClipboardList key="ClipboardList" />,
        <ClipboardPenLine key="ClipboardPenLine" />,
        <Users key="Users" />
    ];

    if (usrData["Groups"][0] !== "Member") {
        menuItems = ["Home", "Tasks", "Management", "Department", "Team"];
        links = ["/home", "/tasks", "/management", "/department", "/team"];
        menuIcons = [
            <House key="House" />,
            <ClipboardList key="ClipboardList" />,
            <ClipboardPen key="ClipboardPen" />,
            <ClipboardPenLine key="ClipboardPenLine" />,
            <Users key="Users" />
        ];
    }

    return (
        <div className="w-[15vw] fixed top-0 left-0 bg-dark-3">
            <a href="/" className="flex mx-auto w-fit mb-[2vh] user-select-class">
                <img src={logo} className="mt-[5vh] w-[9vw] h-fit" alt="Logo"></img>
            </a>
            <div className="w-full h-[90vh] relative">
                <div className="absolute top-0 left-0 w-full h-0.25 bg-n-6 pointer-events-none" />
                <ul className="flex flex-col w-fit ml-[2vw] pt-[2vh]">
                    {menuItems.map((item, index) => (
                        <li key={index} className="my-[2vh] flex items-center">
                            {React.cloneElement(menuIcons[index], { color: props.name === item ? '#5369ed' : 'currentColor' })}
                            <a href={links[index]} className={`ml-2 text-[0.9vw] transition-all duration-500 font hover:text-white ${props.name === item ? '!text-[#5369ed] !text-[1vw]' : ''}`}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            {popup && (
                <div className="h-fit border-2 border-n-6 w-[12vw] absolute bottom-[7vh] left-[0.5vw] transition-all flex flex-col rounded-t-lg text-gray-300">
                    <h1 className="w-[11vw] text-center mx-auto py-[1vh] transition border-n-6 text-gray-500">{usrData["Email"]}</h1>
                    <a href="/profile" className="w-[11vw] text-center mx-auto py-[1vh] border-t-2 border-n-6 hover:!text-[#a46bec] transition cursor-pointer">Profile</a>
                    <button onClick={handleLogout} className="w-[11vw] cursor-pointer text-center mx-auto py-[1vh] border-t-2 transition border-n-6 hover:!text-[#a46bec]">Sign Out</button>
                </div>
            )}
            <button onClick={() => setPopup(!popup)} className={`w-full absolute bottom-0 flex left-0 h-[7vh] transition-all text-gray-400 hover:text-white cursor-pointer text-center pt-[2vh] justify-inbetween ${props.name === "Profile" ? '!text-[#a46bec] font-bold' : ''}`}>
                <Avatar className="w-[5vh] h-[5vh] object-cover object-top rounded-[100%] -mt-[1vh] mr-[1vw] ml-[1vw]">
                    <AvatarImage src={logo2} />
                    <AvatarFallback>{usrData["Initials"]}</AvatarFallback>
                </Avatar>
                <h1 className="text-[1vw]">{usrData["Username"]}</h1>
            </button>
        </div>
    );
}