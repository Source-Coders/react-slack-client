import React, { Component } from 'react';
import { connect } from "react-redux";
import { actions, services } from "../../../context";
import * as Yup from 'yup';
import { Formik, Form, FieldArray } from "formik";

import CustomButton from '../../UI/CustomButton/CustomButton';
import CustomFormInput from '../../UI/CustomFormInput/FormInput';
import Checkbox from '../../UI/CustomFormInput/Checkbox';
import CustomModal from '../../UI/CustomModal/CustomModal';

import modalStyles from '../../UI/CustomModal/CustomModal.module.css'
import styles from './CreateChannelModal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus} from "@fortawesome/free-solid-svg-icons";



const mapStateToProps = (state)=>{
    return { 
        showCreateChannelModal: state.channel.showCreateChannelModal,
        username: state.user.username,
        org: state.org.org,
    }
}
const mapActionsToProps = {
    handleCreateChannelModal: actions.channel.showCreateChannelModal,
}

class CreateChannelModal extends Component {

    validationSchema = () => (
        Yup.object().shape({
            channelName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            privateUsers: Yup.array()
                .of(Yup.string()
                    .email('Invalid Email Address')
                    .required('Required')),
            isPrivate: Yup.boolean()
            })
    );

    handleSubmit= (values, { setSubmitting, setStatus }) => {
        const { channelName, isPrivate, privateUsers } = values;
        const { org, username } = this.props;
        const name = channelName;
        const members =  isPrivate ? [...privateUsers,username] : [];
        const channelInfo ={
            name,
            members,
            isPrivate,
            orgName: org.name, 
        }
        services.channelService.createChannel(channelInfo)
        .then(response => {
            if(response.successful){
                this.props.handleCreateChannelModal(false);
            }else if(response.users_not_found){
                setStatus(`users not found: ${response.users_not_found}`)
            }else if (response.ERROR){
                setStatus('channel name is already in use')
            }
        })
        setSubmitting(false)
    };

    render() {
        const { newUserInput, newUserDisplay, inviteMembersDisplay, subheader, modalSubheader, errorMsg, customForm } = modalStyles;
        const { descriptions, privateSection } = styles
        const { showCreateChannelModal, handleCreateChannelModal } = this.props;
        const form = (
             <>
                <Formik
                    initialValues={{
                    channelName: '',
                    privateUsers: [],
                    isPrivate:false,
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                    >
                    {({ values, status }) => (
                        <Form className={customForm}>
                            {status ? <p className={errorMsg}>{status}</p> : null}
                            <CustomFormInput
                                label="Channel Name"
                                name="channelName"
                                type="text"
                                placeholder="#programming"
                            />
                            <FieldArray
                                name="privateUsers"
                                >
                                {({insert, remove, push}) => {
                                    values.isPrivate = values.privateUsers.length > 0 ? true : false;
                                    return(
                                        <div className={inviteMembersDisplay}>
                                            {values.isPrivate ? (
                                                <div className={newUserInput}>
                                                    <p className={modalSubheader}>Private Channel Members Invite</p>
                                                    {values.privateUsers.map((user, index) =>(
                                                        <div key={index} className={newUserDisplay}>
                                                            <CustomFormInput 
                                                                fieldType="nameDisplay" 
                                                                name={`privateUsers.${index}`} 
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
                                                        onClick={() => insert(values.privateUsers.length, '')}
                                                    >  
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </CustomButton>
                                                </div>
                                            ) : null}
                                            <div className={privateSection}>
                                                <p className={subheader}>Make Private</p>
                                                <p className={descriptions}>When a channel is set to private, it can only be viewed or joined by invitation.</p>
                                                <Checkbox
                                                name="isPrivate" 
                                                label="Make a private Channel"
                                                onClick={() => !values.isPrivate ? push('') : values.privateUsers.forEach((user, index) => remove(index))} 
                                                disabled={values.privateUsers.length > 0 ? true : false}
                                                checked={values.privateUsers.length === 0 ? '': 'checked' }
                                                />
                                            </div>
                                        </div>
                                )}}
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
        )
        return (
                <CustomModal 
                    show={showCreateChannelModal} 
                    onHide={() => handleCreateChannelModal(false)} 
                    title="Create a channel"
                    >
                        {form}
                </CustomModal>    
        );
    }
}

export default connect(mapStateToProps, mapActionsToProps)(CreateChannelModal);
