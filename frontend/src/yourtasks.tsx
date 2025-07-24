import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';
import { DataTable } from "./components/tasks/data-table";
import { Task } from "./components/tasks/schema";
import { columns } from "./components/tasks/columns";

const statuses = [
  { value: 0, label: "todo" },
  { value: 1, label: "in progress" },
  { value: 2, label: "done" },
  { value: 3, label: "stuck" },
  { value: 4, label: "canceled" },
];

const priorities = [
  { label: "low", value: 0 },
  { label: "medium", value: 1 },
  { label: "high", value: 2 },
];

const mapStatus = (status:any) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.label : "Unknown";
};

const mapPriority = (priority:any) => {
  const priorityObj = priorities.find(p => p.value === priority);
  return priorityObj ? priorityObj.label : "Unknown";
};

export default function TaskPage() {
  const usrData=JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');
  const [data, setData] = useState<Task[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found");
    }
    const email = usrData.Email;

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}yourtasks/`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const formattedData = response.data.map((task:any) => ({
        id: task.id.toString(),
        title: task.task_title,
        status: mapStatus(task.task_status),
        assigned_to: task.assigned_users.map((user:any) => user.username).join(", "),
        assigned_by: task.created_user.username,
        task_description: task.task_description,
        priority: mapPriority(task.priority),
        department: task.department.name,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data", error);
      
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='flex'>
      <Sidebar name="Tasks"/>
      <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
        <div className="flex items-center justify-between space-y-2">
          <div className="w-full relative">
            <h2 className="text-3xl font-bold tracking-tight">Your Tasks</h2>
            <p className="text-muted-foreground mb-[2vh]">
              Here are the tasks that are assigned to you by your team leads.
            </p>
          </div>
        </div>
        <DataTable data={data} columns={columns}  />
      </div>
    </div>
  );
}