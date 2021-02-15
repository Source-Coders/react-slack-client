import React, { Component } from 'react';
import { connect } from "react-redux";
import { actions } from "../../../context";

import CustomButton from '../../UI/CustomButton/CustomButton';
import CustomModal from '../../UI/CustomModal/CustomModal';

import modalStyles from '../../UI/CustomModal/CustomModal.module.css'
import styles from './PendingInvitationsModal.module.css'

const mapStateToProps = (state)=>{
    return { 
        showPendingInvitationsModal: state.invitation.showPendingInvitationsModal,
        invitations: state.invitation.pendingInvitations,
    }
}
const mapActionsToProps = {
    handlePendingInvitationsModal: actions.invitation.showPendingInvitationsModal,
    respondToInvitation: actions.invitation.respondToInvitation,
}

class PendingInvitationsModal extends Component {

    handleResponse = (event, invitation, isAccepted) => {
        event.preventDefault();
        const { respondToInvitation,handlePendingInvitationsModal } = this.props;
        respondToInvitation(invitation, isAccepted);
        handlePendingInvitationsModal(false);
    }

    render() {
        const { showPendingInvitationsModal, invitations, handlePendingInvitationsModal} = this.props;
        const { customForm } = modalStyles
        const { invitationDisplay, inviteInfo } = styles
        let invitationsDisplay = !invitations.length ?
            <h2>Loading invitations...</h2>
            : invitations.map(invitation=>{
                    const {org_name, inviter} = invitation
                    return(
                        <div
                            className={invitationDisplay}
                            key={org_name + inviter}>
                            <div className={inviteInfo}>
                                <p>Organization Name : {org_name}</p>
                                <p>User : {inviter}</p>
                            </div>
                            <CustomButton 
                                type='submit' 
                                onClick={event => this.handleResponse(event, invitation, true)}
                                >Accept
                            </CustomButton>
                            <CustomButton 
                                type='submit' 
                                onClick={event => this.handleResponse(event, invitation, false)}
                                >Decline
                            </CustomButton>
                        </div>
                    )});
        const form = (
                <form className={customForm}>
                    {invitationsDisplay}
                </form>
            );
        return (
            <CustomModal
                show={showPendingInvitationsModal && invitations.length > 0}
                onHide={() => handlePendingInvitationsModal(false)} 
                title="Invitations Pending"
                >
                    {form}
            </CustomModal> 
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(PendingInvitationsModal);

