import to from "await-to-js";
import types from "./types";
import { actionCreator } from "../utils";
import { actions } from "../../context";

const initActions = function(userService, socketService, storageService, authService, permissionService, invitationService) {

	const settingUsername = actionCreator(types.SET_USERNAME);
	const setUsername = (username) => (dispatch) => {
		dispatch(settingUsername(username))
	};

	const login = (username, password) => async (dispatch, getState) => {
		const [err, data] = await to(authService.loginUser(username, password))
		if (err) {
			throw new Error("Could not log in");
		}
		if (data.isAuthenticated) {
			storageService.set("username", username);
			await dispatch(fetchLoginBundle());
			dispatch(actions.route.changeRoute({path: "/main"}));
		} else if (data.ERROR) {
			return data.ERROR
		}
	};

	const loginBundleFetch = actionCreator(types.FETCH_LOGIN_BUNDLE);
	const fetchLoginBundle = () => async (dispatch) => {
		await Promise.all([
			dispatch(actions.permission.fetchPermissions()),
			dispatch(actions.invitation.fetchInvitations()),
			dispatch(actions.org.fetchOrgs()),
			dispatch(actions.readStatus.fetchStatuses()),
		]);
		dispatch(loginBundleFetch());
	};

	const logoutActionCreator = actionCreator(types.LOGOUT);
	const logout = (withServerCall = true) => async (dispatch, getState) => {
		const username = getState().user.username;
		if (withServerCall) {
			const [err, _] = await to(userService.logout(username));
			if (err) {
				throw new Error("Could not log out");
			}
		}
		socketService.disconnect()
		storageService.removeItem("username");
		storageService.removeItem("csrf-token");
		dispatch(logoutActionCreator({}))
		dispatch(actions.route.changeRoute({path: "/login"}));
	};

	return { 
		setUsername,
		login,
		fetchLoginBundle,
		logout,
	};
}

export default initActions;


