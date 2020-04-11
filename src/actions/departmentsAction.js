import axios from 'axios';

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
            .catch(err => console.log(err));
    }
}