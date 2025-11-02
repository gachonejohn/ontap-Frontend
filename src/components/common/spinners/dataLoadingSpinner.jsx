import { ImSpinner2 } from 'react-icons/im';
const ContentSpinner = () => {
  return (
    <>
      <div className="flex justify-center items-center h-64">
        <ImSpinner2 className="animate-spin text-primary text-4xl" />
      </div>
    </>
  );
};
export default ContentSpinner;
