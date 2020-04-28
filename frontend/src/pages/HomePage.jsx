import React, { Component } from "react";
import NavBar from "./../components/design/NavBar";
import "./../components/design/fancyButton.css";

class HomePage extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className="container">
                <div className="card border-0 shadow my-5">
                    <div className="card-body p-5">
                    {/*----- put page content under this line -----*/}
                    <center>
                        <a href="/simple/productinfo"> <button class="orange" > Simple Product Info</button></a>
                        <a href="/extended/productinfo"> <button class="orange" > Extended Product Info</button></a>
                        <a href="/inventorybarchart"> <button class="orange" >Overview of sales</button></a>

                    </center>
                    {/*----- page content end -----*/}
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default HomePage;