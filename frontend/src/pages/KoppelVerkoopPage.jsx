import React, { Component } from "react";

import KoppelVerkoop from "./../components/input/KoppelVerkoop"

import NavBar from "./../components/design/NavBar";



class KoppelVerkoopPage extends Component{

    render(){

        return (

            <div>

                <NavBar />

                <div className="container">

                <div className="card border-0 shadow my-5">

                    <div className="card-body p-5">

                    {/*----- put page content under this line -----*/}



                    <KoppelVerkoop url="/koppelverkoop/" />



                    {/*----- page content end -----*/}

                    </div>

                </div>

                </div>

            </div>

        );

    }

}

export default KoppelVerkoopPage;