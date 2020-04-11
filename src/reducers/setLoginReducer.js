const setLoginStatusReducer = (state = false, action) => {

    switch (action.type) {
        case 'SET_TRUE': {
            return true
        }

        case 'SET_FALSE': {
            localStorage.removeItem('authToken');
            return false
        }
        default:
            return state;
    }
}

export default setLoginStatusReducer;