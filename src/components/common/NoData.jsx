import { AiOutlineInbox } from "react-icons/ai";

const NoDataFound = ({ message = "No data found" }) => {
     return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <AiOutlineInbox className="text-gray-400 w-14 h-14 mb-3" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
export default NoDataFound;


