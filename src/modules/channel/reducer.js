// Credit: https://github.com/dprovodnikov/complex-redux-project-architecture
import types from "./types";
import userTypes from "../user/types";
import set from "lodash/fp/set";

const initReducer = () => {
    const INITIAL_STATE = {
        channels: {},
        createChannelName: '',
        showTakenMsg: false,
        showCreateModal: false,
        isPrivate: false,
        privateChannelUsers: [],
    };

    const reducer = (state = INITIAL_STATE, action) => {
        const { type, payload } = action;
        switch (type) {
            case userTypes.LOGOUT: 
                return INITIAL_STATE;
            case types.SET_ORG_CHANNELS: {
                const { orgName, channels } = payload;
                const path = ["channels", orgName]
                return set(path, channels, state);
            }
            case types.ADDED_TO_CHANNEL: {
                const { orgName, channel } = payload;
                const path = ["channels", orgName, channel.name]
                return set(path, channel, state);
            }
            case types.CHANNEL_NAME_TAKEN:
                return {
                    ...state,
                    showTakenMsg: payload,
                }
            case types.CHANNEL_NAME_SET:
                return {
                    ...state,
                    createChannelName: payload,
                }
            case types.SHOW_CREATE_MODAL:
                return {
                    ...state,
                    showCreateModal: payload,
                }
            case types.CREATE_PRIVATE:
                return {
                    ...state,
                    isPrivate: payload,
                }
            case types.PRIVATE_CHANNEL_USERS:
                return {
                    ...state,
                    privateChannelUsers: payload,
                }
            default:
                return state;
        }
    };

    return reducer;
};

export default initReducer;
