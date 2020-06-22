import React, { Component, Fragment } from "react";
import { services } from "../../context";

class PingPong extends Component {
    connect = () => {
        services.socketService.connect({username: "Konrad"});
    }
    requestPingTest = () => {        
        services.socketService.send("request-ping", {})
    };

    render() {
        return (
            <Fragment>
                <button onClick={this.connect}>Connect</button>
                <button onClick={this.requestPingTest}>Request ping</button>
            </Fragment>
        );
    }
}

export default PingPong;
