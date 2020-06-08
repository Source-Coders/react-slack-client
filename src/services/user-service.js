const UserService = function (storageService) {

    const checkUsername = username => {
        let remoteUrl = `https://react-slack-server.herokuapp.com/check-username/?username=${username}`;
        let localUrl = `http://localhost:5000/check-username/?username=${username}`;
        return fetch(localUrl)
            .then(response => response.json())
            .then(data => data.isAvailable);
    };

    const fetchUsernames = () => {
        let remoteUrl = "https://react-slack-server.herokuapp.com/usernames";
        let localUrl = "http://localhost:5000/usernames";
        return fetch(localUrl)
            .then(response => response.json())
            .then(data => JSON.parse(data.usernames));
    };

    return Object.freeze({
       checkUsername,
       fetchUsernames,
    });
};

export default UserService;



