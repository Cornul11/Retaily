import React from 'react';

const NavBar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light static-top mb-5 shadow">
    <div className="container">
      <a className="navbar-brand" href="/">
        <img src="/logo-transparent.png" alt="logo" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          {/* <li className="nav-item active"> */}
          {/*  <a className="nav-link" href="/inventorybarchart"> */}
          {/*    Products sold */}
          {/*  </a> */}
          {/* </li> */}
          <li className="nav-item active">
            <a className="nav-link" href="/extended/productinfo">
              Extended Product info
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/simple/productinfo">
              Simple Product Info
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/koppelverkoop">
              KoppelVerkoop
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/salesinfo">
              Sales Info
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default NavBar;
