import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
// Depends on userService, storageService, socketService
import { services } from "../../context";
import { actions } from "../../context";
import Modal from 'react-bootstrap/Modal';

const mapStateToProps = (state)=>{
    return { 
        showInviteModal: state.invitation.showInviteModal,
        username: state.user.username,
        invitedUserEmail :state.invitation.invitedUserEmail,
    }
}
const mapActionsToProps = {
    handleInviteShow: actions.invitation.showInviteModal,
    setInvitedUserEmail: actions.invitation.setInvitedUserEmail,
}

class InviteModal extends Component {
    handleSubmit = (event) => {
        const { username, invitedUserEmail, } = this.props
        event.preventDefault();
        const orgName = 'react_slack';
        const invitationInfo = {
            username,
            orgName,
            invitedUserEmail,
        }
        services.invitationService.createInvite(invitationInfo)
        .then(response => {
            if(response.successful){
                this.handleHide()
            }
    })
    }

    resetModal = () => {
        this.props.setInvitedUserEmail('')
    }

    handleInputChange = (event) => {
        let invitedUserEmail = event.target.value;
        return this.props.setInvitedUserEmail(invitedUserEmail)
    }

    handleHide = () => {
    	const { handleInviteShow } = this.props
        handleInviteShow(false);
        this.resetModal();
    }

    render() {
        const { handleInviteShow, showInviteModal } = this.props;
        return (
            <div>
                <Modal show={showInviteModal} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite users to your org</Modal.Title>
                </Modal.Header>
                <form>
                    <label for='email'>Enter Email adress</label>
                    <input name="email" type="email" placeholder="joeschmoe@gmail.com" 
                        onChange={this.handleInputChange}/>
                    <button type='submit' onClick={this.handleSubmit}>Submit</button>
                </form>
                </Modal>
            </div>         
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(InviteModal);





