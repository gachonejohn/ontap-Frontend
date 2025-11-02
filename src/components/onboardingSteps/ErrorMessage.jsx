import React from 'react';
// import { AlertCircle } from 'lucide-react';
import { AiOutlineExclamationCircle } from "react-icons/ai";


const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
        <AiOutlineExclamationCircle size={20} />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;