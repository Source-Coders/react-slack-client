import { config } from "../Config";

const ChannelService = function(apiService) {
    const fetchChannels = orgName => {
        const url = `${config.API_URL}/channel`;
        const post_data = {
            action: "GET",
            org_name: orgName
        }

        const options = {
            method: "POST",
            body: JSON.stringify(post_data),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return apiService.go(url, options)
            .then(response => response.json())
            .then(data => data.channels);
    }

    const createChannel = channelInfo => {
        const url = `${config.API_URL}/channel`;
        const post_data = {
            action: "STORE",
            channel_info: channelInfo
        }

        const options = {
            method: "POST",
            body: JSON.stringify(post_data),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return apiService.go(url, options)
            .then(response => response.json())
    };

    const deleteChannel = (orgName, channelName) => {
        const url = `${config.API_URL}/channel`;
        const delete_data = {
            "org_name": orgName,
            "channel_name": channelName,
        };
        const options = {
            method: "DELETE",
            body: JSON.stringify(delete_data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return apiService.go(url, options)
            .then(response => response.json())
            .then(data => data.successful)
    };

    return Object.freeze({
        fetchChannels,
        createChannel,
        deleteChannel,
    });
};

export default ChannelService;
