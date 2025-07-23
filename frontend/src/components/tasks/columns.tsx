import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { labels, priorities, statuses } from "./data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Task } from "./schema";
import axios from "axios";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const usrData = JSON.parse(
  localStorage.getItem("Data") ||
    '{"User":"Login","Age":0,"Username":"Login","Id":-999,"userType":"Student"}'
);

interface Label {
  value: string;
  label: string;
}

const statusChange = async (
  e: React.MouseEvent,
  status: any,
  row: any,
  setStatus: any
) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found in localStorage");
    }
    await axios.post(
      `${import.meta.env.VITE_URL}changetaskstatus/`,
      {
        task_id: row.original.id,
        task_status: status.label,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStatus(status);
  } catch (error) {
    console.log("Error:", error);
  }
};

const priorityChange = async (
  e: React.MouseEvent,
  status: any,
  row: any,
  setStatus: any
) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found in localStorage");
    }
    await axios.post(
      `${import.meta.env.VITE_URL}changetaskpriority/`,
      {
        task_id: row.original.id,
        task_priority: status.label,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStatus(status);
  } catch (error) {
    console.log("Error:", error);
  }
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }: any) => {
      const label = labels.find(
        (label: Label) => label.value === row.original.value
      );
      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      const [status, setStatus] = useState(
        statuses.find((status) => status.value === row.getValue("status"))
      );

      if (!status) {
        return null;
      }

      return (
        <Popover>
          <div className="flex w-[100px] items-center">
            <PopoverTrigger className="flex">
              {status.icon && (
                <status.icon
                  className={`mr-2 h-4 w-4 my-au text-muted-foreground ${status.class}`}
                />
              )}
              <span className={`${status.class}`}>{status.label}</span>
            </PopoverTrigger>
            {usrData["Username"] === row.getValue("assigned_by") ||
            row.getValue("assigned_to").includes(usrData["Username"]) ? (
              <PopoverContent className="w-fit bg-black px-[0.5vw]">
                {statuses.map((task) => (
                  <div
                    key={task.value}
                    onClick={(e) => statusChange(e, task, row, setStatus)}
                    className={`rounded-lg px-[1vw] py-[0.5vh] cursor-pointer hover:bg-gray-400/25 flex ${task.class}`}
                  >
                    {task.icon && (
                      <task.icon
                        className={`mr-2 h-4 w-4 text-muted-foreground my-auto ${task.class}`}
                      />
                    )}
                    {task.label}
                  </div>
                ))}
              </PopoverContent>
            ) : null}
          </div>
        </Popover>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assigned_to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }: any) => (
      <div>
        {`${row.getValue("assigned_to").split(", ").slice(0, 2).join(", ")}${
          row.getValue("assigned_to").split(", ").length > 2
            ? ` + ${row.getValue("assigned_to").split(", ").length - 2} more`
            : ""
        }`}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "assigned_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned By" />
    ),
    cell: ({ row }) => <div>{row.getValue("assigned_by")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const [priority, setPriority] = useState(
        priorities.find(
          (priority) => priority.value === row.getValue("priority")
        )
      );

      if (!priority) {
        return null;
      }

      return (
        <Popover>
          <PopoverTrigger className={`flex items-center ${priority.class}`}>
            {priority.icon && (
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span className={`${priority.class}`}>{priority.label}</span>
          </PopoverTrigger>
          {(usrData["Groups"][0] === "Management" &&
            usrData["Username"] === row.getValue("assigned_by")) ||
          usrData["Groups"][0] === "Superuser" ||
          usrData["Groups"][0] === "Executive" ||
          (usrData["Groups"][0] === "Management" &&
            usrData["Teamlead"].includes(row.getValue("department"))) ? (
            <PopoverContent className="w-fit bg-black px-[0.5vw]">
              {priorities.map((task) => (
                <div
                  key={task.value}
                  onClick={(e) => priorityChange(e, task, row, setPriority)}
                  className={`rounded-lg px-[1vw] py-[0.5vh] cursor-pointer hover:bg-gray-400/25 flex ${task.class}`}
                >
                  {task.icon && (
                    <task.icon
                      className={`mr-2 h-4 w-4 text-muted-foreground my-auto ${task.class}`}
                    />
                  )}
                  {task.label}
                </div>
              ))}
            </PopoverContent>
          ) : null}
        </Popover>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "department", // New column for department
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];