import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
// Depends on userService, storageService, socketService
import { services } from "../../context";
import { actions } from "../../context";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

const mapStateToProps = (state)=>{
    return { 
        create_channel_name: state.channel.create_channel_name,
        show_taken_msg: state.channel.show_taken_msg,
        routePath: state.route.routePath,
        routeState: state.route.routeState,
        showCreateModal: state.channel.showCreateModal,
        username: state.user.username,
        isPrivate: state.channel.isPrivate,
        privateChannelUsers: state.channel.privateChannelUsers
    }
}
const mapActionsToProps = {
    setCreateChannelName: actions.channel.setCreateChannelName,
    takenChannelName: actions.channel.takenChannelName,
    changeRoute: actions.route.changeRoute,
    handleCreateShow: actions.channel.showCreateModal,
    createPrivate: actions.channel.createPrivate,
    setPrivateUsers: actions.channel.privateChannelUsers
}

class CreateChannel extends Component {
    handleSubmit = (event) => {
        const { create_channel_name, takenChannelName, username, isPrivate, privateChannelUsers } = this.props
        event.preventDefault();
        const name = create_channel_name;
        const members =  isPrivate ? [...privateChannelUsers,username] : [];
        const channelInfo ={
            name,
            members,
            isPrivate,
            orgName: "Source Coders", // this is hardcoded for now but will have to come from redux soon (currently selected org)
        }
        services.channelService.createChannel(channelInfo)
        .then(response => {
            if(response.successful){
                this.handleHide()
            }else if(response.users_not_found){
                alert(`users_not_found: ${response.users_not_found}`)
            }
            takenChannelName(true)
    })}

    resetModal = () => {
        const { setPrivateUsers, createPrivate, takenChannelName, setCreateChannelName } = this.props
        setPrivateUsers([]);
        createPrivate(false);
        takenChannelName(false);
        setCreateChannelName('');
    }
    handleUserChange = (event) => {
        let users = event.target.value;
        return this.props.setPrivateUsers(users.trim().split(/[\s,]+/))
    }

    handleChannelName = (event) => {
        let channel_name = event.target.value
        return this.props.setCreateChannelName(channel_name)
    }
    handleHide = () => {
        const { handleCreateShow } = this.props
        handleCreateShow(false);
        this.resetModal();
    }

    render() {
        const { show_taken_msg, handleCreateShow, showCreateModal, isPrivate, createPrivate, privateChannelUsers, setPrivateUsers} = this.props;
        const takenMessage = show_taken_msg ? <h3>Channel Name taken</h3> : null;
        const userButton = privateChannelUsers.map(user => <button type="button" class="btn btn-light m-1"value={user} key={user}>{user}</button>)
        const formDisplay = !isPrivate ?
                <Form
                onSubmit={this.handleSubmit}
                className="p-3">
                      <Form.Group controlId="channelName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="#new channel name" 
                        onChange={this.handleChannelName}/>
                      </Form.Group>
                </Form>
            :
                <Form
                onSubmit={this.handleSubmit}
                className="p-3">
                      <Form.Group controlId="channelName">
                        <Form.Label>Private Channel Name</Form.Label>
                        <Form.Control 
                        name="channelName"
                        type="text" 
                        placeholder="#new channel name"
                        onChange={this.handleChannelName}/>
                      </Form.Group>
                      <br />
                      {userButton}
                      <br />
                      <Form.Group controlId="channelName">
                        <Form.Label>Users</Form.Label>
                        <Form.Control 
                        name="users"
                        type="text" 
                        placeholder="#enter users seperated by a space" 
                        onChange={this.handleUserChange}/>
                      </Form.Group>
                </Form>
        return (
            <div>
                <Modal show={showCreateModal} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Channel Creation</Modal.Title>
                    {takenMessage}
                </Modal.Header>
                {formDisplay}
                <Modal.Footer>
                    <Button 
                    style={{marginRight:'auto'}}
                    className="mt-2"
                    type='submit' 
                    variant="primary" 
                    onClick={this.handleSubmit}
                    >create
                    </Button>
                    <Form.Check 
                        type="switch"
                        id="switchEnabled"
                        label="Make private"
                        onChange={()=>createPrivate(!isPrivate)}
                        />
                </Modal.Footer>
                </Modal>
            </div>         
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(CreateChannel);