import logo from "../assets/images/icons/logo.png";

interface HeaderProp {
  name: string;
  size: number;
}

function Heading({ name, size }: HeaderProp) {
  return (
    <>
      <h1
        className="tilt-prism-logo d-flex align-items-center justify-content-center"
        style={{ fontSize: size }}
      >
        <img src={logo} className="me-3" width="164" height="100" alt="logo" />
        {name}
      </h1>
      <div className={"mx-auto bg-white"} style={{ height: "10px" }}></div>
    </>
  );
}

export default Heading;
