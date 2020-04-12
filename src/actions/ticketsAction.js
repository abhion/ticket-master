import axios from 'axios';
import {setLoginActionFalse} from '../actions/setLoginAction'

export const setTickets = (payload) => {

    return {
        type: 'SET_TICKETS',
        payload
    }
}

export const startGetTickets = () => {
    
    return (dispatch) => {
        axios.get(`http://dct-ticket-master.herokuapp.com/tickets`, {headers: {'x-auth': localStorage.getItem('authToken')}})
            .then(tickets => {
                console.log(tickets, "AU");
                
                dispatch(setTickets(tickets.data))

            } )
            .catch(err => (err.message == 'Request failed with status code 401') ? dispatch(setLoginActionFalse()) : console.log(err));
    }
}

