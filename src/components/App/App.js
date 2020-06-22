import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "./App.css";
// Depends on storageService, userService, socketService
import { services } from "../../context";
import { take } from "rxjs/operators";
import { actions } from "../../context";

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    routePath: state.route.routePath,
    routeState: state.route.routeState,
  };
};

const mapActionsToProps = {
    setUsername:actions.user.setUsername,
    changeRoute:actions.route.changeRoute,
}

class App extends Component {
    changeRoute = () => {
        this.props.changeRoute();
    }

    componentDidMount() {
        const { changeRoute, setUsername } = this.props;
        changeRoute({path:"/ping-pong"});
        // let username = services.storageService.get("username");
        // let isNewUser =  username === null;
        // if (isNewUser) {
        //     changeRoute({path:'/enter-username'});
        // }
        // else {
        //     this.setupConnectedSubscription();
        //     // user exists
        //     setUsername(username);
        //     //console.log(username)
        //     services.socketService.connect({ username: username });
        // }
    }
    
    setupConnectedSubscription() {
        const { changeRoute } = this.props
        services.socketService.getConnected$()
        .pipe(take(1)) // TODO learn what this does
        .subscribe(connected => {
            if (connected) {                    
                console.log("Successful connection!");
                changeRoute({path:"/main"});
            } else {
                // changeRoute("/alert-user", { alert: "Web socket connection error " });
                changeRoute({path:"/alert-user",routeState:{alert: "Web socket connection error "}});
            }
        });  
    }

    // render() {
    //     const { routePath, routeState } = this.props;
    //     if (!routePath) {
    //         return <h1>Loading....</h1>
    //     } else {
    //       changeRoute({path:"/alert-user",routeState:{alert: "Web socket connection error "}});
    //     }
    //   };


  render() {
    const { routePath, routeState } = this.props;
    if (!routePath) {
      return <h1>Loading....</h1>;
    } else {
      return <Redirect to={{pathname: routePath, state: routeState }} />;
    }
  }
}

export default connect(mapStateToProps, mapActionsToProps)(App);
