import "../assets/css/font.css";
import logo from "../assets/logo.png";

interface HeadingProp {
  name: string;
  size: number;
}

function Heading({ name, size }: HeadingProp) {
  return (
    <>
      <h1 className="pixelify-sans text-center" style={{ fontSize: size }}>
        <img src={logo} className="me-2" width="80" height="80" />
        {name}
      </h1>
      <div className={"mx-auto bg-white my-3"} style={{ height: "2px" }}></div>
    </>
  );
}

export default Heading;
