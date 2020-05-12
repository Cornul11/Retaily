import React, { Component } from 'react';
import NavBar from '../components/design/NavBar';

class BluePrintPage extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="card border-0 shadow my-5">
            <div className="card-body p-xs-0 p-md-5">
              {this.props.content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BluePrintPage;
