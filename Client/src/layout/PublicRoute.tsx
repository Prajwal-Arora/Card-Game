import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getLocalStore } from '../common/localStorage';

const PublicRoute = ({ component:Component, ...rest}:any) => {
    const token= getLocalStore('userName')
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            token.length===0 ?
                <Component {...props} />
            : <Redirect to="/create-room" />
        )} />
    );
};

export default PublicRoute;