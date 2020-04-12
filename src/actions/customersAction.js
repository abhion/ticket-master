import axios from 'axios';
import {setLoginActionFalse} from '../actions/setLoginAction'
export const setCustomers = (payload) => {

    return {
        type: 'SET_CUSTOMERS',
        payload
    }
}

export const startGetCustomers = () => {

    return (dispatch) => {
        axios.get(`http://dct-ticket-master.herokuapp.com/customers`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                dispatch(setCustomers(response.data));
            })
            .catch(err => (err.message == 'Request failed with status code 401') ? dispatch(setLoginActionFalse()) : console.log(err));
    }

}