import axios from 'axios';
import {setLoginActionFalse} from '../actions/setLoginAction';
export const setDepartments = (payload) => {
    return {
        type: 'SET_DEPARTMENTS',
        payload
    }
}

export const startGetDepartments = () => {

    return (dispatch) => {
        axios.get(`http://dct-ticket-master.herokuapp.com/departments`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                dispatch(setDepartments(response.data));
            })
            .catch(err => (err.message == 'Request failed with status code 401') ? dispatch(setLoginActionFalse()) : console.log(err));
    }
}