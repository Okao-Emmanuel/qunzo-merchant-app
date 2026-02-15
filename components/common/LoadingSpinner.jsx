import { Spinner } from "../ui/spinner";

const LoadingSpinner = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Spinner />
        loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;
