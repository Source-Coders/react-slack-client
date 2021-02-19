import React from "react";
import styles from "./ChannelChatHeader.module.css";

function ChannelChatHeader(props) {
	const { chatHeader, chatMemberDisplay, nameDisplay } = styles;
	const { showChannelSideBar, toggleChannelSideBar, channelName, numberOfUsers } = props;
	const membersLabel = numberOfUsers > 1 ? "members" : "member";
	
	return (
		<div className={chatHeader}>
			<h1 className={nameDisplay}>{`# ${channelName}`}</h1>
			<div
				className={chatMemberDisplay}
				onClick={() => toggleChannelSideBar(!showChannelSideBar)}
			>
				{`${numberOfUsers} ${membersLabel}`}</div>
		</div>
	);
}

export default ChannelChatHeader;
