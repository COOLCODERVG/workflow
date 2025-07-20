import { FC } from "react";
import { AlertCircle } from "lucide-react";

interface AlertDestructiveProps {
  description: string;
}

export const AlertInfo: FC<AlertDestructiveProps> = ({ description }) => {
  return (
    <div className="px-[1vw] py-[1vh] border-[1px] min-w-[10vw] max-w-[38vw] fixed top-[1vw] left-[1vw] rounded-xl border-[DodgerBlue] h-fit z-[999] bg-black ">
      <div className="flex gap-4">
        <AlertCircle className="h-4 w-4 my-auto" color="DodgerBlue" />
        <h1 className="text-[DodgerBlue]">Info</h1>
      </div>
      <h1 className="text-[DodgerBlue] ml-8">{description}</h1>
    </div>
  );
};