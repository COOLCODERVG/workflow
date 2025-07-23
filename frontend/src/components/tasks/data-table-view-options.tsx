import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { departments } from "./data"; // Assuming departments are imported from a data file

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  /*const toggleColumnVisibility = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleVisibility(!column.getIsVisible());
    }
  };*/

  const resetColumnVisibility = () => {
    table.getAllColumns().forEach((column) => {
      if (typeof column.accessorFn !== "undefined" && column.getCanHide()) {
        column.toggleVisibility(true);
      }
    });
  };

  const toggleDepartmentFilter = (department: string | undefined) => {
    const column = table.getColumn("department");
    if (column) {
      column.setFilterValue(column.getFilterValue() === department ? undefined : department);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex items-center"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-black">
        <DropdownMenuLabel className="text-white">Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuSeparator />
        {table.getColumn("department") && (
          <>
            <DropdownMenuLabel className="text-white">Filter by Department</DropdownMenuLabel>
            {(departments || [{ label: "adsfasdf", value: "adsasdf" }]).map(dept => (
              <DropdownMenuCheckboxItem
                key={dept.value}
                checked={(table.getColumn("department")?.getFilterValue() || "") === dept.value}
                onCheckedChange={(value) => toggleDepartmentFilter(value ? dept.value : undefined)}
              >
                {dept.label}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          onClick={resetColumnVisibility}
          className="h-8 w-full text-left text-white px-4"
        >
          Reset Columns
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}