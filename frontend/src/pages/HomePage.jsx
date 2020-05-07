import React, { Component } from 'react';
import NavBar from '../components/design/NavBar';

class HomePage extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="card border-0 shadow my-5">
            <div className="card-body p-5">
              {/* ----- put page content under this line -----*/}
              <a className="btn btn-primary btn-block mb-4" href="/simple/productinfo">Simple Product Info</a>
              <a className="btn btn-primary btn-block mb-4" href="/extended/productinfo">Extended Product Info</a>
              <a className="btn btn-primary btn-block mb-4" href="/inventorybarchart">Overview of sales</a>
              <a className="btn btn-primary btn-block mb-1" href="/koppelverkoop">KoppelVerkoop</a>
              {/* ----- page content end -----*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HomePage;
