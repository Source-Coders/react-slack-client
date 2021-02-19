import React, {Component} from "react";
import {connect} from "react-redux";
import Chat from "../Chat/Chat";
import OrgsSidebar from "../OrgsSidebar/OrgsSidebar";
import SideBar from "../SideBar/SideBar";
import { actions, services } from "../../context";
import { take } from "rxjs/operators";
import ChannelSideBar from "../ChannelSideBar/ChannelSideBar";
import styles from "./MainComponent.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";



const mapStateToProps = (state) => ({
	routePath: state.route.routePath,
	routeState: state.route.routeState,
	username: state.user.username,
	isInitialized: state.main.isInitialized,
	showChannelSideBar: state.channel.showChannelSideBar,
	orgs: state.org.orgs,
});

const mapActionsToProps = {
	initMain: actions.main.initMain,
	changeRoute: actions.route.changeRoute,
	logout: actions.user.logout,
};

class MainComponent extends Component {
	componentDidMount() {
		if (!services.socketService.getConnected()) {
			const username = this.props.username
				? this.props.username
				: services.storageService.get("username");
			if (username) {
				this.setupConnectedSubscription();
				services.socketService.connect({username: username});
				this.props.initMain();
			} else {
				const {changeRoute} = this.props;
				changeRoute({path: "/login"});
			}
		}
	}

	setupConnectedSubscription() {
		const {changeRoute} = this.props;
		services.socketService
			.getConnected$()
			.pipe(take(1))
			.subscribe((connected) => {
				if (!connected) {
					changeRoute({
						path: "/alert-user",
						routeState: {alert: "Web socket connection error "},
					});
				}
			});
	}

    render() {
        const { createFirstOrgCta, ctaHeader, ctaIcon, main, mainWrapper, sidebar, tempChat } = styles;
        const { isInitialized, orgs,showChannelSideBar } = this.props;
        const { isEmpty } = services.utilityService;
        const sideBar = !isEmpty(orgs) ? <SideBar /> : (
            <div className={sidebar}>
                <div className={createFirstOrgCta}>
                    <p className={ctaHeader}>Create an org to get started!</p>
                    <p className={ctaIcon}><FontAwesomeIcon icon={faArrowLeft} transform="grow-20" color="#40e0d0" /></p>
                </div>
            </div>
        );
        const chat = !isEmpty(orgs) ? <Chat /> : <div className={tempChat}></div>;
        return (
            <div className={main}>
                {isInitialized ? 
                    <div className={mainWrapper}>
                        <OrgsSidebar />
                        {sideBar}
                        {chat}
						{showChannelSideBar && <ChannelSideBar />}	
                    </div>
                    : null}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(MainComponent);
