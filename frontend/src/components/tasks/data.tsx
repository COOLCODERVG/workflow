import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
    class:""
  },
  {
    value: "feature",
    label: "Feature",
    class:""
  },
  {
    value: "documentation",
    label: "Documentation",
    class:""
  },
];

export const statuses = [

  {
    value: "stuck",
    label: "Stuck",
    icon: CrossCircledIcon,
    department: "Development",
    bg:"bg-[red]",
    class:"!text-[red]"
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
    department: "Development",
    class:"",
    bg:"bg-white"
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
    department: "Development",
    class:"text-[orange]",
    bg:"bg-[orange]"
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
    department: "Development",
    class:"text-[limegreen]",
    bg:"bg-[limegreen]"
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
    department: "Development",
    class:"text-[gray]",
    bg:"bg-[gray]"
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
    bg: "bg-[limegreen]",
    class:"text-[limegreen]"
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
    bg: "bg-[orange]",
    class:"text-[orange]"
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
    bg: "bg-[red]",
    class:"text-[red]"
  },
];

export const departments = [
  { value: 'Game Design', label: 'Game Design'},
  { value: 'Programming', label: 'Programming'},
  { value: 'Art and Animation', label: 'Art and Animation' },
  { value: 'Narrative Design', label: 'Narrative Design' },
  { value: 'Marketing and Sales', label: 'Marketing and Sales' },
  { value: 'Business Development and Partnerships', label: 'Business Development and Partnerships' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Finance and Administration', label: 'Finance and Administration' },
  { value: 'Legal and Compliance', label: 'Legal and Compliance' },
  { value: 'IT and Infrastructure', label: 'IT and Infrastructure' },
  { value: 'Website Development and Design', label: 'Website Development and Design' },
  { value: 'Stem Research', label: 'Stem Research' },
  { value: 'Dyne Expansion', label: 'Dyne Expansion' },
  { value: 'Dyne Management', label: 'Dyne Management' },
];