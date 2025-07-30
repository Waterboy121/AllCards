function Body() {
  return (
    <>
      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "3px" }}
      ></div>

      <div className="glass-dark">
        <h3 className="cinzel-body highlight-header animate-delay-1 animate-in pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>

        <h3 className="cinzel-body highlight-header animate-delay-2 animate-in pulse">
          Your Cards Deserve More Than Storage. They Deserve a Throne.
        </h3>

        <h3 className="cinzel-body highlight-subheader animate-delay-3 animate-in pulse">
          Curate with Intention. Cement{" "}
          <span style={{ textDecoration: "underline" }}>Your</span> Legacy.
          Embark on <span style={{ textDecoration: "underline" }}>Your</span>{" "}
          Journey Today.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "1px" }}
      ></div>
    </>
  );
}

export default Body;
