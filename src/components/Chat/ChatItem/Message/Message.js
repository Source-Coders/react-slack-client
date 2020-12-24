import React from "react";
import { services } from "../../../../context";

import styles from "./Message.module.css"

const RAW_MESSAGE_DT_FORMAT = services.chatService.MESSAGE_DT_FORMAT;
const DISPLAY_MESSAGE_DT_FORMAT = "h:mm A";

function Message({sentDt, sender, content}) {
    const { message, messageLeft, avatar, messageRight, messageSender, messageTimestamp, messageContent } = styles;
    const dateTime = services.dateTimeService.dt(sentDt, RAW_MESSAGE_DT_FORMAT);
    const formattedDt = services.dateTimeService.str(dateTime, DISPLAY_MESSAGE_DT_FORMAT);
    return (
        <div className={message}>
            <div className={messageLeft}>
                <div className={avatar}>{sender[0].toUpperCase()}</div>
            </div>
            <div className={messageRight}>
                <div className={messageSender}>
                    {sender}
                </div>
                <div className={messageTimestamp}>
                    / {formattedDt} /
                </div>
                <br />
                <div className={messageContent}>
                    {content}
                </div>
            </div>
        </div>
    );
}

export default Message;