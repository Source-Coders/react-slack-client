import React, { Component } from 'react';
import { connect } from "react-redux";
import { actions } from "../../../context";
import * as Yup from 'yup';
import { Formik, Form, FieldArray } from "formik";
import CustomModal from '../../UI/CustomModal/CustomModal';
import CustomButton from '../../UI/CustomButton/CustomButton';
import CustomFormInput from '../../UI/CustomFormInput/FormInput';
import styles from '../../UI/CustomModal/CustomModal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus} from "@fortawesome/free-solid-svg-icons";

const mapStateToProps = (state) => {
    return {
        showCreateOrgModal: state.org.showCreateOrgModal,
        username: state.user.username,
    }
}
const mapActionsToProps = {
    createOrg: actions.org.createOrg,
    handleShowCreateOrgModal: actions.org.showCreateOrgModal,
}

class CreateOrgModal extends Component {

    validationSchema = () => (
        Yup.object().shape({
            orgName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            invitedUsers: Yup.array()
                .of(Yup.string()
                    .email('Invalid Email Address')
                    .required('Required')
            )})
    );

    handleSubmit = (values, {setSubmitting, setStatus }) => {  
        const { createOrg } = this.props;
        const { orgName, invitedUsers } = values;
        createOrg(orgName, invitedUsers)
            .then(response => {
                if (response.successful) {
                    this.props.handleShowCreateOrgModal(false);
                }else if (response.ERROR) {
                    setStatus('org name is already in use')
                } 
            });
        setSubmitting(false)
    };

    render() {
        const { showCreateOrgModal, handleShowCreateOrgModal } = this.props;
        const { newUserInput, newUserDisplay, inviteMembersDisplay, modalSubheader, customForm, errorMsg } = styles;
        const form = (
            <>
                <Formik
                    initialValues={{
                    orgName: '',
                    invitedUsers: [],
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                    >
                    {({ values, status }) => (
                        <Form className={customForm}>
                            {status ? <p className={errorMsg}>{status}</p> : null}
                            <CustomFormInput
                                label="Org Name"
                                name="orgName"
                                type="text"
                                placeholder="react_slack"
                            />
                            <FieldArray
                                name="invitedUsers"
                                >
                                {({insert, remove, push}) =>(
                                    <div className={inviteMembersDisplay}>
                                        {values.invitedUsers?.length > 0 ? (
                                            <div className={newUserInput}>
                                                <p className={modalSubheader}>New Members Invite</p>
                                                {values.invitedUsers.map((user, index) =>(
                                                    <div key={index} className={newUserDisplay}>
                                                        <CustomFormInput 
                                                            fieldType="nameDisplay" 
                                                            name={`invitedUsers.${index}`} 
                                                            placeholder="react_slack@gmail.com"
                                                            />
                                                        <CustomButton
                                                            btntype="delete"
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
                                        ) :  (
                                            <CustomButton 
                                                type="button" 
                                                onClick={() => push('')}
                                            >Invite new members
                                            </CustomButton>
                                        )}
                                    </div>
                                )}
                            </FieldArray>
                            <CustomButton 
                                type='submit'
                                btntype="enter" 
                            >Submit
                            </CustomButton>
                        </Form>
                    )}
                </Formik>
            </>
        );
        return (
            <CustomModal 
                show={showCreateOrgModal} 
                title="Create a new Org"
                onHide={() => handleShowCreateOrgModal(false)}
                >
                    {form}
                </CustomModal>
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(CreateOrgModal
    );


