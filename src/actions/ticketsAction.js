import axios from 'axios';

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
                
                dispatch(setTickets(tickets.data))

            } )
            .catch(err => console.log(err));
    }
}

