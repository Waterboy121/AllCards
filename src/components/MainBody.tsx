import "../assets/css/MainBody.css";

function MainBody() {
  return (
    <>
      <div className="header-bg">
        <h3 className="handjet text-center mt-4 pt-2 royal-header animate-in animate-delay-1 pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>
        <h3 className="handjet text-center mt-2 royal-header animate-in animate-delay-2 glint-on-hover">
          Your Cards Deserve More Than Storage. They Deserve a Throne.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "50%", height: "2px" }}
      ></div>

      <h3 className="text-center mt-4 legacy-subheader animate-in animate-delay-3">
        Curate with Intention. Cement Your Legacy. Embark on the Journey Today.
      </h3>
    </>
  );
}

export default MainBody;
