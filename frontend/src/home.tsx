import  Sidebar  from "./components/sidebar";

import { Label } from "./components/ui/label"

const Home = () => {
    const usrData=JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');
    return (
    <div className='flex'>
        <Sidebar name="Home"></Sidebar>
        <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
            <div className="flex items-center justify-between space-y-2">
                <div className="w-full relative">
                    <h2 className="text-3xl font-bold tracking-tight mb-[1vh]">Welcome to WorkFlow</h2>
                    <p className="text-muted-foreground mb-[2vh]">Since this is an employee platform, users are NOT allowed to create their own accounts and thus there is no signup.</p>
                    <p className="text-muted-foreground mb-[2vh]">The test account is registered with all departments in order to allow the user full control over the application.</p>
                    
                    <h2 className="text-3xl font-bold tracking-tight mb-[1vh] mt-[15vh]">Your Info</h2>
                    <div className="grid grid-cols-2 mt-[2vh]">
                        <div>
                            <Label >Username:</Label>
                            <p className="text-muted-foreground mb-[2vh]">{usrData["Username"]}</p>
                        </div>
                        <div>
                            <Label >Full Name:</Label>
                            <p className="text-muted-foreground mb-[2vh]">{usrData["First Name"]} {usrData["Last Name"]} </p>
                        </div>
                        <div>
                            <Label >Email:</Label>
                            <p className="text-muted-foreground mb-[2vh]">{usrData["Email"]}</p>
                        </div>
                        <div>
                            <Label >Initials:</Label>
                            <p className="text-muted-foreground mb-[2vh]">{usrData["Initials"]}</p>
                        </div>
                        <div>
    <Label>Departments:</Label>
    <p className="text-muted-foreground mb-[2vh]">
        {usrData["Departments"].map((task:any, index:number) => (
            <span key={index}>{task}{index < usrData["Departments"].length - 1 ? ', ' : ''}</span>
        ))}
    </p>
</div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    );
}

export default Home;