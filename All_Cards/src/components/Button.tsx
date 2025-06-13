import "../assets/css/font.css";

interface ButtonProps {
  name: string;
  onClicked: () => void;
}

const Button = ({ name, onClicked }: ButtonProps) => {
  return (
    <>
      <div className="btn btn-light p-4 w-25 d-flex justify-content-center align-items-center mx-auto rounded m-5">
        <button
          type="button"
          className="pixelify-sans btn text-black "
          onClick={onClicked}
        >
          <div>{name}</div>
        </button>
      </div>
    </>
  );
};

export default Button;
