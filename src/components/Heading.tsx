import logo from "../assets/images/icons/logo.png";

interface HeadingProp {
  name: string;
  size: number;
}

function Heading({ name, size }: HeadingProp) {
  return (
    <>
      <h1 className="handjet-logo text-center" style={{ fontSize: size }}>
        <img src={logo} className="me-2" width="80" height="80" alt="logo" />
        {name}
      </h1>
      <div className={"mx-auto bg-white"} style={{ height: "10px" }}></div>
    </>
  );
}

export default Heading;
