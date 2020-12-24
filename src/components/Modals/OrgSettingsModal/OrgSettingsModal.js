import React, { Component } from 'react';
import { connect } from "react-redux";
import { actions } from "../../../context";

import CustomButton from '../../UI/CustomButton/CustomButton';
import CustomModal from '../../UI/CustomModal/CustomModal';
import InviteMembersModal from "../InviteMembersModal/InviteMembersModal";
import CanView from "../../CanView/CanView";

import styles from '../../UI/CustomModal/CustomModal.module.css'

const mapStateToProps = (state)=>{
    return { 
        showOrgSettingsModal: state.org.showOrgSettingsModal,
        currentOrg: state.org.org,
        invitations: state.invitation.pendingInvitations,
    }
}
const mapActionsToProps = {
    handleOrgSettingsModalShow: actions.org.showOrgSettingsModal,
    handleDeleteOrg: actions.org.deleteOrg,
    handleInviteMembersModal: actions.invitation.showInviteMembersModal,
}

class OrgSettingsModal extends Component {

    handleDeleteOrg = (orgName) => {
        const { handleDeleteOrg, handleOrgSettingsModalShow } = this.props;
        handleDeleteOrg(orgName);
        handleOrgSettingsModalShow(false);
    }

    handleInviteMembers = (show) => {
        const { handleInviteMembersModal, handleOrgSettingsModalShow } = this.props;
        handleInviteMembersModal(show);
        handleOrgSettingsModalShow(false);
    }

    render() {
        const { showOrgSettingsModal, currentOrg } = this.props;
        const form = (
                <form className={styles.customForm}>
                    <div class={styles.btns}>
                        <CanView
                        resource="org"
                        action="delete"
                        yes={() => <CustomButton type="button" onClick={()=>this.handleDeleteOrg(currentOrg.name)}>Delete current Org</CustomButton>}
                        no={() => null}
                        />
                        <CustomButton 
                            type="button" 
                            onClick={() => this.handleInviteMembers(true)}
                            >Invite new members to your Org
                        </CustomButton>
                        <InviteMembersModal />
                    </div>
                </form> 
            );  
        return (
            <CustomModal
                show={showOrgSettingsModal} 
                onHide={() => this.props.handleOrgSettingsModalShow(false)} 
                title="Org Settings"
                >
                    {form}
            </CustomModal>  
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(OrgSettingsModal);
