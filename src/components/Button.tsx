import "../assets/css/font.css";

interface ButtonProps {
  name: string;
  onClicked: () => void;
}

const Button = ({ name, onClicked }: ButtonProps) => {
  return (
    <>
      <div>
        <button
          type="button"
          className="pixelify-sans btn text-black btn btn-light p-4 w-25 d-flex mx-auto m-5 justify-content-center fs-1"
          style={{}}
          onClick={onClicked}
        >
          <div>{name}</div>
        </button>
      </div>
    </>
  );
};

export default Button;
