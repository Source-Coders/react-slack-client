import React, {Component} from "react";
import {connect} from "react-redux";
import InputMessage from "./InputMessage/InputMessage";
import ChatItem from "./ChatItem/ChatItem";
import ChannelChatHeader from "./ChatHeader/ChannelChatHeader.js";
import PrivateChatHeader from "./ChatHeader/PrivateChatHeader.js";
import styles from "./Chat.module.css"
// Depends on chatService, socketService, dateTimeService
import {actions, services} from "../../context";

class Chat extends Component {
	onEnterPressed = () => {
        let { currentInput, chatType, channel, partnerUsername, username, org } = this.props;
        const messageType = chatType;			
        const messageContent = currentInput;	
        const destination = chatType === "channel" ? channel.name : partnerUsername;	
        const message = services.chatService.prepareMessage(messageType, messageContent, username, destination, org.name);
        this.props.sendMessage(message);
    }

    fetchPreviousMessages = () => {
        const { chatType, channel, partnerUsername, messages, fetchPrevChannelMessages, fetchPrevPrivateMessages } = this.props;
        const beforeDateTime = messages[0].sent_dt;
        switch (chatType) {
            case "channel":                
                fetchPrevChannelMessages(channel.name, beforeDateTime);
                break;
            case "private":
                fetchPrevPrivateMessages(partnerUsername, beforeDateTime);
                break;
            default:
        }
    }

    createChatItems(messages) {
        const chatItems = []
        const { dateTimeService }  = services;
        const messageMap = this.createMessageChatItemMap(messages);
        Object.entries(messageMap).forEach(entry => {
            const [dateKey, messageChatItems] = entry;
            const dateStr = dateTimeService.str(dateTimeService.dt(dateKey, "YYYY/MM/DD"), "dddd, MMMM Do");            
            const dateSeparatorChatItem = {
                itemType: "date-separator",
                dateStr,
                key: dateStr
            };
            chatItems.push(dateSeparatorChatItem);
            chatItems.push(...messageChatItems);
        });
        return chatItems;
    }

    createMessageChatItemMap(messages) {
        const { dateTimeService, chatService } = services;
        const messageMap = messages
        .map(message => ({ itemType: "message", ...message, key: message.sender + message.sent_dt}))
        .reduce((acc, messageChatItem) => {
            const sentDt = dateTimeService.dt(messageChatItem.sent_dt, chatService.MESSAGE_DT_FORMAT);
            const key = dateTimeService.str(sentDt, "YYYY/MM/DD");
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(messageChatItem);
            return acc;
        }, {});
        return messageMap;
    }

    render() {
        let { chatType, channel, partnerUsername, toggleChannelSideBar, showChannelSideBar, channelMembers} = this.props;
        const { messagesWrapper, ctaCreateChannel, chat, boxFirst, boxFill, boxEnd } = styles;
        const canDisplay = (chatType === "channel" && channel !== null) || (chatType === "private" && partnerUsername !== null);
        if (canDisplay) {
            let messages = this.props.messages ? this.props.messages : [];
            let chatHeader = this.props.chatType === "channel"
                ? <ChannelChatHeader
					numberOfUsers={channelMembers.length}
					channelName={channel.name}
					showChannelSideBar={showChannelSideBar}
					toggleChannelSideBar={toggleChannelSideBar} />
                : <PrivateChatHeader partnerUsername={partnerUsername}/>
            const chatItems = this.createChatItems(messages);
            return (
                <div className={chat}>
                        <div className={boxFirst}>
                            {chatHeader}
                        </div>
                        <div className={`${messagesWrapper} ${boxFill}`}>
                            {chatItems.map(item => <ChatItem item={item} key={item.key} />)}
                        </div>
                        <div className={boxEnd}>
                            <InputMessage
                                onEnter={this.onEnterPressed}
                            />
                            <button onClick={this.fetchPreviousMessages}>Fetch previous messages</button>
                        </div>
                    </div>
            );
        } else {
            return(
                <h1 className={ctaCreateChannel}>Create a Channel to get started!</h1>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const mapping = {
        username: state.user.username,
        chatType: state.chat.type,
        partnerUsername: state.chat.partnerUsername,
        channel: state.chat.channel,
        currentInput: state.chat.currentInput,
		org: state.org.org,
		showChannelSideBar: state.channel.showChannelSideBar,
    }
    const { chatType, channel, partnerUsername } = mapping;
    const orgName = mapping.org?.name;
    
    switch (chatType) {
        case "channel":
            if (channel) {
                const channelName = channel.name;
                mapping.messages = state.message.messages[orgName]?.channel?.[channelName];
                mapping.channelMembers = state.channel.channels[orgName]?.[channelName]?.members
	        }          
            break;
        case "private":
            mapping.messages = state.message.messages[orgName]?.private?.[partnerUsername];
            break;
        default:
            break;
    }
    return mapping;
}

const mapActionsToProps = {
    sendMessage: actions.message.sendMessage,
    messageReceived: actions.message.messageReceived,
    fetchPrevChannelMessages: actions.message.fetchPrevChannelMessages,
	fetchPrevPrivateMessages: actions.message.fetchPrevPrivateMessages,
	toggleChannelSideBar: actions.channel.toggleChannelSideBar,
}

export default connect(mapStateToProps, mapActionsToProps)(Chat);
