import React, { Component } from 'react';
import { connect } from "react-redux";
import { actions } from "../../../context";
import CustomButton from '../../UI/CustomButton/CustomButton';
import CustomFormInput from '../../UI/CustomFormInput/FormInput';
import CustomModal from '../../UI/CustomModal/CustomModal';
import * as Yup from 'yup';
import { Formik, Form, FieldArray} from "formik";

import styles from '../../UI/CustomModal/CustomModal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus} from "@fortawesome/free-solid-svg-icons";

const mapStateToProps = (state)=>{
    return { 
        showInviteMembersModal: state.invitation.showInviteMembersModal,
        username: state.user.username,
        org: state.org.org,
    }
}
const mapActionsToProps = {
    handleInviteMembersModal: actions.invitation.showInviteMembersModal,
    sendInvites: actions.invitation.sendInvites,
}

class InviteMembersModal extends Component {

    validationSchema = () =>(
        Yup.object().shape({
            invitedUsers: Yup.array()
                .of(Yup.string()
                    .email('Invalid Email Address')
                    .required('Required'))
            })
    );

    handleSubmit= (values, { setSubmitting}) => {
        const { org, sendInvites, handleInviteMembersModal } = this.props
        const { invitedUsers } = values
        sendInvites(org.name, invitedUsers)
        setSubmitting(false)
        handleInviteMembersModal(false)
        
    };

    render() {
        const { showInviteMembersModal, handleInviteMembersModal } = this.props;
        const { newUserInput, newUserDisplay, inviteMembersDisplay, customForm } = styles;
        const form = (
            <>
                <Formik
                    initialValues={{
                    invitedUsers: ['']
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                    >
                    {({ values }) => (
                        <Form className={customForm}>
                            <FieldArray
                                name="invitedUsers"
                                >
                                {({insert, remove}) =>(
                                    <div className={inviteMembersDisplay}>
                                        <div className={newUserInput}>
                                            {values.invitedUsers.map((email, index) =>(
                                                <div key={index} className={newUserDisplay}>
                                                    <CustomFormInput 
                                                        fieldType="nameDisplay" 
                                                        name={`invitedUsers.${index}`} 
                                                        placeholder="react_slack@gmail.com"
                                                        />
                                                    <CustomButton
                                                        btnType="delete"
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        > 
                                                    <FontAwesomeIcon icon={faTimes} />
                                                    </CustomButton>
                                                </div>
                                            ))}
                                            <CustomButton
                                                type="button"
                                                onClick={() => insert(values.invitedUsers.length, '')}
                                            >  
                                            <FontAwesomeIcon icon={faPlus} />
                                            </CustomButton>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>
                            <CustomButton 
                                type='submit'
                                btnType="enter" 
                                disabled={values.invitedUsers.length === 0 ? true : false}
                                >Submit
                            </CustomButton>
                        </Form>
                    )}
                </Formik>
            </>
        );
        return (
            <CustomModal 
                show={showInviteMembersModal} 
                onHide={() => handleInviteMembersModal(false)} 
                title="Invite users to your org"
                >
                    {form}
            </CustomModal>      
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(InviteMembersModal);






