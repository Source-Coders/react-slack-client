import io from "socket.io-client";
import { Subject } from "rxjs";

function SocketService(chatService, challengeService) {
    let socket;
    let connected$ = new Subject();

    const getConnected$ = () => connected$;

    const connect = dataObject => {
        let localUrl = "http://localhost:5000";
        let remoteUrl = "https://react-slack-server.herokuapp.com";
        let value = dataObject.username
        let query_val = `username=${value}`
        let queryObj = { query: query_val }
        socket = io(localUrl, queryObj)
        setUpEventListeners();
        return socket
    };

    const send = (event_name, obj) => {
        // assuming socket declared when connected
        socket.emit(event_name, obj)
        console.log(event_name, " with ", obj, " sent.")
    };

    const disconnect = () => {
        // assuming socket declared when connected
        socket.emit("disconnect")
        socket.disconnect()
        return "Socket disconnect sent"
    };

    const setUpEventListeners = () => {
        socket.on("connect", () => {
            connected$.next(true);
        });

        socket.on("connect_error", () => {
            connected$.next(false);
        });

        socket.on('user-joined-chat', (user_join) => {
            console.log("user_join", user_join);
            console.log(`User joined the chat: ${user_join.username}`);
            chatService.onUserJoinedChat(user_join.username);
        });

        socket.on('message-received', (message_received) => {
            console.log("message-received: ", message_received);
            console.log(
                `Sender: ${message_received.sender},
             Time Sent: ${message_received.time_sent},
             Content: ${message_received.content}`
            );
            chatService.onMessageReceived(message_received);
        });

        // socket.on("ping", (message)=>{
        //     console.log('received ping:', message)
        //     const newmessage = 'pong'
        //     const event_name = "pong"
        //     socket.emit(event_name, newmessage)
        // });

        // socket.on("ping-pong-success", (message)=>{
        //     console.log(message)
        // });
    }

    return Object.freeze({
        getConnected$,
        connect,
        send,
    });
}

export default SocketService;




