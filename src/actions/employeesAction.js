import axios from 'axios';
export const setEmployees = (payload) => {

    return {
        type: 'SET_EMPLOYEES',
        payload
    }
}

export const startGetEmployees = () => {

    return (dispatch) => {
        axios.get(`http://dct-ticket-master.herokuapp.com/employees`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                
                dispatch(setEmployees(response.data))
            })
            .catch(err => console.log(err));
    }
   
}