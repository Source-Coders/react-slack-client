import React from 'react';

import styles from './CustomButton.module.css'

const CustomButton = ({children, btntype, ...otherProps }) => {
    return(
        <button className={`${styles[btntype] || styles.customButton}`} {...otherProps}>{children}</button>
    )
}


export default CustomButton