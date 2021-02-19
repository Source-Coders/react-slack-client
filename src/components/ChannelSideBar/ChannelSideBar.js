import React, {Component} from "react";
import {connect} from "react-redux";
import { actions } from "../../context";
import { partition } from "lodash-es";

import * as Yup from "yup";
import { Formik, Form, FieldArray} from "formik";
import CanView from "../CanView/CanView";
import CustomButton from "../UI/CustomButton/CustomButton";
import CustomFormInput from "../UI/CustomFormInput/FormInput";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes,faUserMinus } from "@fortawesome/free-solid-svg-icons";
import formStyles from "../UI/CustomModal/CustomModal.module.css";
import styles from "./ChannelSideBar.module.css";

const mapStateToProps = (state) => {
	const mapping = {
		orgName: state.org.org.name,
		channelName: state.chat.channel?.name,
		channel: state.chat.channel,
		addMember: state.channel.addMember,
		channelId: state.chat.channelId,
		currentUser: state.user.username,
		orgMembers: state.org.org.members,
	};
	const { orgName, channelName } = mapping;
	if (orgName) {
		mapping.channelMembers = state.channel.channels[orgName]?.[channelName]?.members
	}
  	return mapping;
};

const mapActionsToProps = {
	updateMembersCall: actions.channel.updateMembersCall,
};

class ChannelSideBar extends Component {
	validationSchema = () =>
		Yup.object().shape({
			invitedUsers: Yup.array().of(
				Yup.string().email("Invalid Email Address").required("Required")
			),
		});

	handleSubmit = ({invitedUsers}, { setSubmitting, resetForm }) => {
		const { updateMembersCall, channelName, orgName, orgMembers } = this.props;
		const orgMembersList = Object.keys(orgMembers)
		const validUsers = this.handleInvitedUsersList(invitedUsers, orgMembersList, resetForm)
		const method = "POST", action = "STORE"
		updateMembersCall(orgName, channelName, validUsers, method, action );
		setSubmitting(false);
	};

	handleInvitedUsersList = (userList, orgMembers, resetForm) => {
		const [validUsers, invalidUsers] = partition(userList, username => orgMembers.includes(username))
		if (invalidUsers.length > 0) {
			const error = this.handleInvalidUsers(invalidUsers);
			resetForm({status: error,});
		} else {
			resetForm();
		}
		return validUsers

	}

	handleInvalidUsers = invalidUsers => {
		if (invalidUsers.length === 1) {
			return `User: ${invalidUsers.join(", ")} is not a part of this org`
		} else {
			return `Users: ${invalidUsers.join(", ")} are not a part of this org`
		}
	}

	handleRemoveMember = username => {
		const { orgName, channelName, updateMembersCall } = this.props
		const method = "DELETE"
		updateMembersCall(orgName, channelName, [username], method)
	}

	render() {
		const { channelSideBar, header, body, sidebarItem, sidebarUser, customForm, remove, disable, customButton, cancel } = styles;
		const { inviteMembersDisplay, newUserDisplay, errorMsg } = formStyles;
		const { channelMembers, currentUser } = this.props;
		let channelMembersDisplay = <div></div>
		if (channelMembers){ 
		const nonUserMembers = channelMembers.filter(({username}) => username !== currentUser)
		channelMembersDisplay = (
			nonUserMembers.map(({ username }) => (
					<div key={username} className={sidebarItem}>
						<p className={sidebarUser}>{username}</p>
						<CanView
							resource="channel-member"
							action="add"
							yes={() => (

								<button
									className={remove}
									type="button"
									value={username}
									onClick={() => this.handleRemoveMember(username)}
								>
									<FontAwesomeIcon icon={faUserMinus} />
								</button>
							)}
							no={() => <p></p>}
						/>
					</div>
				))
		)}
		const form = (
			<>
				<Formik
					initialValues={{
						invitedUsers: [],
					}}
					validationSchema={this.validationSchema}
					onSubmit={this.handleSubmit}
				>
					{({ values, status }) => (
						<Form className={customForm}>
							{status && <p className={errorMsg}>{status}</p>}
								<FieldArray name="invitedUsers">
									{({ insert, remove, push }) => (
										<div className={inviteMembersDisplay}>
											{values.invitedUsers.map(
												(_email, index) => (
													<div
														key={index}
														className={newUserDisplay}
													>
														<CustomFormInput
															fieldType="nameDisplay"
															name={`invitedUsers.${index}`}
															placeholder="react_slack@gmail.com"
														/>
														<button
															className={cancel}
															type="button"
															onClick={() =>remove(index)}
														>
															<FontAwesomeIcon
																icon={faTimes}
															/>
														</button>
													</div>
												)
											)}
											<CustomButton
												type="button"
												onClick={() => push("")}
											>Add Member
											</CustomButton>
										</div>
									)}
								</FieldArray>
								<button
									type="submit"
									btnype="enter"
									className={`${
										values.invitedUsers.length === 0 ? disable: null} ${customButton}`}
								>
									Submit
								</button>
							</Form>
						)}
				</Formik>
			</>
		);
		return (
			<div className={channelSideBar}>
				<div className={header}>
					<h1>Channel Members</h1>
				</div>
				<div className={body}>
					<div key={currentUser} className={sidebarItem}>
						<p className={sidebarUser}>{currentUser}</p>
					</div>
					{channelMembersDisplay}
					{form}
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapActionsToProps)(ChannelSideBar);
