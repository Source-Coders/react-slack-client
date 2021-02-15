import React, {Component} from "react";
import {connect} from "react-redux";
import {actions, services} from "../../context";

import * as Yup from "yup";
import { Formik, Form, FieldArray } from "formik";
import CanView from "../CanView/CanView";
import CustomButton from "../UI/CustomButton/CustomButton";
import CustomFormInput from "../UI/CustomFormInput/FormInput";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes,faPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import formStyles from "../UI/CustomModal/CustomModal.module.css";
import styles from "./ChannelSideBar.module.css";

const mapStateToProps = (state) => {
	const mapping = {
		org: state.org.org,
		channelName: state.chat.channel?.name,
		channel: state.chat.channel,
		addMember: state.channel.addMember,
		channelId: state.chat.channelId,
		user: state.user.username,
  	};
	const { org, channelName } = mapping;
	if (org) {
		mapping.channelMembers = state.channel.channels[org.name]?.[channelName]?.members
	}
  	return mapping;
};

const mapActionsToProps = {
	fetchMemberNames: actions.channel.fetchMemberNames,
	addChannelMember: actions.channel.addChannelMember,
	removeChannelMember: actions.channel.removeChannelMember,
	updateAddMember: actions.channel.updateAddMember,
	
};
class ChannelSideBar extends Component {
	componentDidMount() {
		const { fetchMemberNames, channelName, org } = this.props;
		fetchMemberNames(org.name, channelName);
	}
	validationSchema = () =>
		Yup.object().shape({
			invitedUsers: Yup.array().of(
				Yup.string().email("Invalid Email Address").required("Required")
			),
		});

	handleAddMemberSubmit = (values, {setSubmitting}) => {
		const { addChannelMember, channelName, org, channel } = this.props;
		const { invitedUsers } = values;
		for (let member of invitedUsers) {
			addChannelMember(org.name, channelName, member, channel);
		}
		setSubmitting(false);
	};

	render() {
		const {
			channelSideBar,
			header,
			body,
			sidebarItem,
			sidebarUser,
			customForm,
			remove,
			disable,
			customButton,
			cancel,
		} = styles;
		const { inviteMembersDisplay, newUserDisplay } = formStyles;
		const {
			channelName,
			channelMembers,
			removeChannelMember,
			org,
			user,
		} = this.props;
		const nonUserMembers = channelMembers.filter(
			(member) => member.username !== user
		);

		const channelMembersDisplay = services.utilityService.isEmpty(
			channelMembers
		) ? (
			<h2>Loading users...</h2>
		) : (
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
								onClick={() =>
									removeChannelMember(
										org.name,
										channelName,
										username
									)
								}
							>
								<FontAwesomeIcon icon={faUserMinus} />
							</button>
						)}
						no={() => <p></p>}
					/>
				</div>
			))
		);
		const form = (
			<>
				<Formik
					initialValues={{
						invitedUsers: [],
					}}
					validationSchema={this.validationSchema}
					onSubmit={this.handleAddMemberSubmit}
				>
					{({ values }) => (
						<Form className={customForm}>
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
														onClick={() =>
															remove(index)
														}
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
										>
											{" "}
											Add Member
										</CustomButton>
									</div>
								)}
							</FieldArray>
							<button
								type="submit"
								btnType="enter"
								className={`${
									values.invitedUsers.length === 0
										? disable
										: null
								} ${customButton}`}
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
					{channelMembersDisplay}
					<CanView
						resource="channel-member"
						action="add"
						yes={() => <>{form}</>}
						no={() => null}
					/>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapActionsToProps)(ChannelSideBar);
