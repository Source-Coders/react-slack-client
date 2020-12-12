import React, { Component } from "react";
import { actions, services } from "../../context";
import { connect } from "react-redux";
import Org from "../Org/Org";
import "./Orgs.css";

const mapStateToProps = (state) => {
    return {
        orgs: state.org.orgs
    };    
}

class Orgs extends Component {
    render() {
        const { orgs } = this.props;
        const isOrgsEmpty = services.utilityService.isEmpty(orgs);
        const orgsDisplay = isOrgsEmpty ?
            <p className="loading">Loading orgs...</p>
            : (Object.entries(orgs).map(([org_id, org]) => 
                <Org org={org} />
            ));
        return (
            <div className="orgs">
                <div className="orgs-header1">
                    <h1>Orgs Title</h1>
                </div>
                <div className="org-btns">
                    {orgsDisplay}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(Orgs);