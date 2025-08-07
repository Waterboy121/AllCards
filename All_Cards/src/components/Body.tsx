import "../assets/css/Body.css";

function MainBody() {
  return (
    <>
      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "3px" }}
      ></div>

      <div className="header-bg">
        <h3 className="cinzel-body text-center mt-4 pt-2 royal-header animate-in animate-delay-1 pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>

        <h3 className="cinzel-body text-center mt-2 royal-header animate-in animate-delay-2 pulse">
          Your Cards Deserve More Than Storage. They Deserve a Throne.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "1px" }}
      ></div>

      <h3 className="cinzel-body text-center mt-4 legacy-subheader animate-in animate-delay-3">
        Curate with Intention. Cement{" "}
        <span style={{ textDecoration: "underline" }}>Your</span> Legacy. Embark
        on <span style={{ textDecoration: "underline" }}>Your</span> Journey
        Today.
      </h3>
    </>
  );
}

export default MainBody;
