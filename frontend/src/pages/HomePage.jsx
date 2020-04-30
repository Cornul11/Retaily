import React, { Component } from "react";
import NavBar from "./../components/design/NavBar";
import "./../components/design/fancyButton.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

class HomePage extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className="container">
                <div className="card border-0 shadow my-5">
                    <div className="card-body p-5">
                    {/*----- put page content under this line -----*/}
                    <a href="/simple/productinfo"> <button className="btn btn-primary btn-block mb-2" > Simple Product Info</button></a>
                    <a href="/extended/productinfo"> <button className="btn btn-primary btn-block mb-2" > Extended Product Info</button></a>
                    <a href="/inventorybarchart"> <button className="btn btn-primary btn-block mb-2" >Overview of sales</button></a>
                    {/*----- page content end -----*/}
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default HomePage;