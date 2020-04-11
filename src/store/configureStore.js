import { createStore, combineReducers, applyMiddleware } from 'redux';
import ticketsReducer from '../reducers/ticketsReducer';
import setLoginStatusReducer from '../reducers/setLoginReducer';
import  thunk from 'redux-thunk';
import { customersReducer } from '../reducers/customersReducer';
import { employeesReducer } from '../reducers/employeesReducer';
import { departmentsReducer } from '../reducers/departmentsReducer';

const configureStore = () => {
    const store = createStore(combineReducers({
        apiUrl: () => "http://dct-ticket-master.herokuapp.com", 
        isLoggedIn: setLoginStatusReducer,
        tickets: ticketsReducer,
        customers: customersReducer,
        employees: employeesReducer,
        departments: departmentsReducer
    }), applyMiddleware(thunk));

    return store;
}

export default configureStore;