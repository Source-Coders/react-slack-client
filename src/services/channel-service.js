import {config} from "../Config";

const ChannelService = function (apiService) {
	const fetchChannels = (orgName) => {
		const url = `${config.API_URL}/channel`;
		const post_data = {
			action: "GET",
			org_name: orgName,
		};

		const options = {
			method: "POST",
			body: JSON.stringify(post_data),
			headers: {
				"Content-Type": "application/json",
			},
		};

		return apiService
			.go(url, options)
			.then((response) => response.json())
			.then((data) => data.channels);
	};

	const createChannel = (channelInfo) => {
		const url = `${config.API_URL}/channel`;
		const post_data = {
			action: "STORE",
			channel_info: channelInfo,
		};

		const options = {
			method: "POST",
			body: JSON.stringify(post_data),
			headers: {
				"Content-Type": "application/json",
			},
		};

		return apiService.go(url, options).then((response) => response.json());
	};

	const deleteChannel = (orgName, channelName) => {
		const url = `${config.API_URL}/channel`;
		const delete_data = {
			org_name: orgName,
			channel_name: channelName,
		};
		const options = {
			method: "DELETE",
			body: JSON.stringify(delete_data),
			headers: {
				"Content-Type": "application/json",
			},
		};
		return apiService
			.go(url, options)
			.then((response) => response.json())
			.then((data) => data.successful);
	};

	const addChannelMember = (orgName, channelName, addMember) => {
		const url = `${config.API_URL}/channel/members/`;
		const post_data = {
			action: "STORE",
			channel_name: channelName,
			new_member_username: addMember,
			org_name: orgName,
		};
		const options = {
			method: "POST",
			body: JSON.stringify(post_data),
			headers: {
				"Content-Type": "application/json",
			},
		};
		return apiService
			.go(url, options)
			.then((response) => response.json())
			.then((data) => data.successful);
	};




	const fetchMemberNames = (orgName, channelName) => {
		const url = `${config.API_URL}/channel/members/`;
		const post_data = {
			action: "GET",
			channel_name: channelName,
			org_name: orgName,
		};
		const options = {
			method: "POST",
			body: JSON.stringify(post_data),
			headers: {
				"Content-Type": "application/json",
			},
		};
		return apiService
			.go(url, options)
			.then((response) => response.json())
			.then((data) => JSON.parse(data.channel_members));
	};

	const removeChannelMember = (orgName, channelName, removeMember) => {
		const url = `${config.API_URL}/channel/members/`;
		const post_data = {
			channel_name: channelName,
			removed_username: removeMember,
			org_name: orgName,
		};
		const options = {
			method: "DELETE",
			body: JSON.stringify(post_data),
			headers: {
				"Content-Type": "application/json",
			},
		};
		return apiService
			.go(url, options)
			.then((response) => response.json())
			.then((data) => data.successful);
	};

	return Object.freeze({
		fetchChannels,
		createChannel,
		deleteChannel,
		
		addChannelMember,

		fetchMemberNames,
		removeChannelMember,
	});
};

export default ChannelService;
