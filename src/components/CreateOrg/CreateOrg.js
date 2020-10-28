import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
// Depends on userService, storageService, socketService
import { services } from "../../context";
import { actions } from "../../context";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

const mapStateToProps = (state) => {
    return {
        createOrgName: state.org.createOrgName,
        showTakenNameMsg: state.org.showTakenNameMsg,
        showCreateOrgModal: state.org.showCreateOrgModal,
        username: state.user.username,
        newOrgUser: state.org.newOrgUsers
    }
}
const mapActionsToProps = {
    setCreateOrgName: actions.org.setCreateOrgName,
    takenOrgName: actions.org.takenOrgName,
    createOrgModalShow: actions.org.showCreateOrgModal,
    setNewOrgUsers: actions.org.setNewOrgUsers,

}

class CreateChannel extends Component {
    handleSubmit = (event) => {
        const { createOrgName, takenOrgName, username, newOrgUsers } = this.props
        event.preventDefault();
        const name = createOrgName;
        const members = [...newOrgUsers, username] 
        const orgInfo = {
            name,
            members,
            orgName: "Source Coders", // this is hardcoded for now but will have to come from redux soon (currently selected org)
        }
        services.orgService.createOrg(orgInfo)
            .then(response => {
                if (response.successful) {
                    this.handleHide()
                } else {
                    takenOrgName(true)
                }
            })
    }

    resetModal = () => {
        const { setNewOrgUsers, takenOrgName, setCreateOrgName } = this.props
        setCreateOrgName('')
        setNewOrgUsers([]);
        takenOrgName(false);
    }

    handleOrgName = (event) => {
        let newOrgName = event.target.value;
        return this.props.setInvitedUserEmail(newOrgName)
    }

    handleHide = () => {
        const { handleCreateOrgShow } = this.props
        createOrgModalShow(false);
        this.resetModal();
    }
    handleUserChange = (event) => {
        let users = event.target.value;
        return this.props.setNewOrgUsers(users.trim().split(/[\s,]+/))
    }

    render() {
        const userButton = newOrgUsers.map(user => <button type="button" value={user} key={user}>{user}</button>)
        return (
            <div>
                <Modal show={showCreateOrgModal} onHide={this.handleHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Org</Modal.Title>
                    </Modal.Header>
                    <form
                    onSubmit={this.handleSubmit}>
                        <label for='newOrgName'>Enter Org Name</label>
                        <input name="newOrgName" type="text" placeholder="react_slack" onChange={this.handleOrgName} />
                        <label for="users">Users</label>
                        <input name="users" type="text" placeholder="#enter users seperated by a space" onChange={this.handleUserChange} />
                        <button type='submit' onClick={this.handleSubmit}>Submit</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(CreateChannel);


