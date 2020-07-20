const AuthService = function (apiService) {

    const getCSRFToken = () => {
        let remoteUrl = `https://react-slack-server.herokuapp.com/login`
        let localUrl = `http://localhost:5000/login`

        return apiService.go(localUrl);
    }

    const loginUser = (username, password) => {
        let remoteUrl = `https://react-slack-server.herokuapp.com/login`
        let localUrl = `http://localhost:5000/login`

        const post_data = {
            "username": username,
            "password": password
        }
        const options = {
            method: "POST",
            body: JSON.stringify(post_data),
            headers: {
                'Content-Type': 'application/json'
        }}
        return apiService.go(localUrl, options)
            .then(response => response.json())     
    }
    
    return Object.freeze({
        getCSRFToken,
        loginUser,
    });
};

export default AuthService; 




