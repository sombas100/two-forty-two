import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const LoadingButton = () => {
  return (
    <>
      <Button variant="primary" disabled className="w-100">
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>
    </>
  );
};

export default LoadingButton;
