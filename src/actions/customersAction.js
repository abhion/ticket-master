import axios from 'axios';

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
            .catch(err => console.log(err));
    }

}