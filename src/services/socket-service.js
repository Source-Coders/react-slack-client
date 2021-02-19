import io from "socket.io-client";
import {Subject} from "rxjs";
import {actions, store} from "../context";
import {config} from "../Config";

function SocketService(chatService) {
    let socket;
    let isConnected = false;
    let connected$ = new Subject();

    const getConnected = () => isConnected;

    const getConnected$ = () => connected$;

    const connect = dataObject => {
        const url = config.API_URL;
        let value = dataObject.username
        let query_val = `username=${value}`
        let queryObj = { query: query_val }
        socket = io(url, queryObj)
        setUpEventListeners();
        return socket
    };

    const send = (event_name, obj) => {
        // assuming socket declared when connected
        socket.emit(event_name, obj)
        console.log(event_name, "with", obj, "sent.")
    };

    const disconnect = () => {
        // assuming socket declared when connected
        socket.emit("disconnect")
        socket.disconnect()
        isConnected = false;
    };

    const setUpEventListeners = () => {
        socket.on("connect", () => {
            isConnected = true;
            connected$.next(true);
        });

        socket.on("connect_error", () => {
            isConnected = false;
            connected$.next(false);
        });

        //ORGS
        socket.on("new-org-member", (info) => {
			const { org_name: orgName, org_member: orgMember } = info;
			console.log(`new-org-member: ${orgName}: ${orgMember}`);
			store.dispatch(actions.org.addOrgMember(orgName, orgMember));
        });
        
        socket.on("added-to-org", async (orgName) => {
			console.log("added-to-org", orgName);
			store.dispatch(actions.org.addedToOrg(orgName));
			send("join-org", orgName);
        });
        
        socket.on("org-deleted", (orgName) => {
			console.log("org-deleted", orgName);
			store.dispatch(actions.org.handleOrgDeleted(orgName));
        });

        socket.on("invited-to-org", (orgName) => {
			console.log("invited-to-org", orgName);
			store.dispatch(actions.invitation.fetchInvitations());
		});
        
        //ORG MEMBER ONLINE STATUS
         socket.on("org-member-online", info => {
            const { org_name: orgName, username } = info;
            console.log(`org-member-online: ${orgName}: ${username}`);
            store.dispatch(actions.org.setOrgMemberOnlineStatus(orgName, username, true));
        });

        socket.on("org-member-offline", info => {
            const { org_name: orgName, username } = info;
            console.log(`org-member-online: ${orgName}: ${username}`);
            store.dispatch(actions.org.setOrgMemberOnlineStatus(orgName, username, false));
        });

        //CHANNELS
        socket.on("added-to-channel", async (info) => {
			console.log("added-to-channel", info);
			const orgName = info.org_name;
			const channel = info.channel;
			store.dispatch(actions.channel.addedToChannel(orgName, channel));
			const joinInfo = { org_name: orgName, channel_name: channel.name };
			send("join-channel", joinInfo);
        });
        
        socket.on("channel-deleted", (info) => {
			console.log("channel-deleted", info);
			const { org_name: orgName, channel_name: channelName } = info;
			store.dispatch(actions.channel.channelDeleted(orgName, channelName));
            const leaveInfo = { org_name: orgName, channel_name: channelName };
			send("leave-channel", leaveInfo);
        });
        
        socket.on("new-channel-members", info => {
			const { org_name: orgName, channel_name: channelName, new_members:newMembers } = info;		
            console.log(`${newMembers} have been added to channel ${channelName}`);
            store.dispatch(actions.channel.addMembersToChannel(orgName, channelName, newMembers));			
        });

        socket.on("channel-member-removed", info => {
			const { org_name: orgName, channel_name: channelName, username } = info;		
            console.log(`${username} has been deleted from channel ${channelName}`);
            store.dispatch(actions.channel.removeChannelMember(orgName, channelName, username));			
        });

        //MESSAGES
        socket.on("message-received", (message) => {
			console.log("message-received: ", message);
			console.log(
				`Sender: ${message.sender},
                Time Sent: ${message.time_sent},
                Content: ${message.content}`
			);
			store.dispatch(actions.message.messageReceived(message));
		});

        //PERMISSIONS
        socket.on("permissions-updated", () => {
			console.log("permissions-updated");
			store.dispatch(actions.permission.fetchPermissions());
		});
		
    };

    return Object.freeze({
        getConnected,
        getConnected$,
        connect,
        send,
        disconnect,
    });
}

export default SocketService;
