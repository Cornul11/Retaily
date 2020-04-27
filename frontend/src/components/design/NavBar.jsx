import React, {Component} from "react";

class NavBar extends Component {

    render(){
        return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light static-top mb-5 shadow">
                <div className="container">
                    <a className="navbar-brand" href="/">Shop toolkit</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/products">Products sold</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="https://google.com">Google</a>
                        </li>
                        </ul>
                    </div>
                </div>
            </nav> 
        );
    }
}
export default NavBar;
