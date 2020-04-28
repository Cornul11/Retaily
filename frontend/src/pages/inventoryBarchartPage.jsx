import React, { Component } from "react";
import Barchart from "./../components/charts/barchart"
import NavBar from "./../components/design/NavBar";

class InventoryBarchartPage extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className="container">
                <div className="card border-0 shadow my-5">
                    <div className="card-body p-5">
                    {/*----- put page content under this line -----*/}

                    <Barchart url="/inventory/" />

                    {/*----- page content end -----*/}
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
export default InventoryBarchartPage;