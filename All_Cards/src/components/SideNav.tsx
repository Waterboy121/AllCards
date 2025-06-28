import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import PokemonIcon from "../assets/images/icons/pokemon.ico";
import YuGuHoIcon from "../assets/images/icons/yu-gi-oh.ico";

function SideNav() {
  return (
    <>
      <div className="justify-content-between align-items-center text-white">
        {/* 
         <a href="#" className="nav-link">
          <h1 className="pixelify-sans">
            <img src={logo} className="me-2" width="64" height="64" />
            All Cards
          </h1>
        </a>
        */}

        <nav className="nav nav-tabs nav-justified">
          <Link
            to="/Home"
            className="nav-link anta-regular fs-4 text-white"
            key="home"
          >
            Home
          </Link>
          <Link
            to="/"
            className="nav-link anta-regular fs-4 text-white align-items-center"
            key="aboutus"
          >
            <img
              src={PokemonIcon}
              className="me-2 mb-1"
              width="25"
              height="25"
            />
            Pokemon
          </Link>
          <Link
            to="/"
            className="nav-link anta-regular fs-4 text-white align-items-center"
            key="login"
          >
            <img
              src={YuGuHoIcon}
              className="me-2 mb-1"
              width="30"
              height="30"
            />
            Yu-Gu-Oh!
          </Link>

          {/*
          <Link to="/" className="nav-link anta-regular fs-4 text-white align-items-center" key="signup" >
            About Us
          </Link>
          <Link to="/" className="nav-link anta-regular fs-4 text-white align-items-center" key="faqs" >
            FAQs
          </Link>
          */}
        </nav>
      </div>

      {/*
         <nav className="sidenav col-md-2 d-md-block  sidebar">
        <span className="sidebar-brand d-flex align-items-center justify-content-center">
          <h1 className="pixelify-sans text-center" style={{ fontSize: "50px" }}>
            All Cards
          </h1>
        </span>
        <div className="sidebar-sticky">
            <Link to="/signup" className="nav-link anta-regular fs-4  d-flex align-items-center justify-content-center">
            Home
            </Link>
            <Link to="/" className="nav-link anta-regular fs-4  d-flex align-items-center justify-content-center">
            Pokemon 
            </Link>

        </div>

    </nav>*/}
    </>
  );
}

export default SideNav;
