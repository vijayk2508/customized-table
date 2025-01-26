import PropTypes from "prop-types";
import React from "react";
import { useLocation } from "react-router";

const baseURL = window.BASEPATH?.includes("customized-table")
  ? "/customized-table"
  : "https://react-customized-table.netlify.app";

function getURL(url) {
  if (window.location.hostname === "localhost")
    return window.location.href.split("/").slice(0, -1).join("/") + url;
  return baseURL ? baseURL + url : url;
}

const links = [
  { path: getURL("/"), label: "Tabultor Table" },
  { path: getURL("/reactgrid"), label: "Grid Js" },
];
function Layout({ children }) {
  const location = useLocation();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-brand" type="button">
            Tables &gt;
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {links.map((link) => (
                <li className="nav-item" key={link.path}>
                  <a
                    className={`nav-link ${
                      location.pathname === link.path ? "active" : ""
                    }`}
                    href={link?.path ?? "#"}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container mt-4">{children}</div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
