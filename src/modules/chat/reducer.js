import types from "./types";
import sidebarTypes from "../sidebar/types";

const initReducer = () => {
    /* type can be "private" or "channel" depending on what kind of chat we have open. 
    partnerUsername will be set to the username of the person we're chatting with.
    channelId will be set to the id of the channel we're chatting in.  */
    const INITIAL_STATE = {
        type: "", 
        partnerUsername: "", 
        channelId: "",
        messages: [],
        currentInput: "",
    };

    const reducer = (state = INITIAL_STATE, action) => {
        const { type, payload } = action;

        switch (type) {
            case sidebarTypes.CHANNEL_SELECT:
                return {
                    ...state,                    
                    type: "channel",
                    channelId: payload,
                    partnerUsername: "", // Clear out partnerUsername in case we were just private messaging
                };
            case sidebarTypes.USER_SELECT:
                return {
                    ...state,                    
                    type: "private",
                    partnerUsername: payload,
                    channelId: "", // Clear out channelId in case we were just chatting in a channel
                };
            case types.MESSAGE_RECEIVED:
                return {
                    ...state,
                    messages: [...state.messages, payload]
                };
            case types.FETCH_CHANNEL_MESSAGES:
                console.log("FETCH_CHANNEL_MESSAGES");
                return {
                    ...state,
                    messages: payload, 
                };
            case types.FETCH_PRIVATE_MESSAGES:
                    console.log("FETCH_CHANNEL_MESSAGES");
                return {
                    ...state,
                    messages: payload,
                };
            case types.INPUT_UPDATED:
                return {
                    ...state,
                    currentInput: payload,
                };
            case types.CLEAR_INPUT:
                return {
                    ...state,
                    currentInput: "",
                };
            default:
                return state;
        }
    };

    return reducer;
};

export default initReducer;