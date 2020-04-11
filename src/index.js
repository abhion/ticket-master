import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { BrowserRouter, Route } from 'react-router-dom';
import * as customersAction from './actions/customersAction';
import * as ticketsAction from './actions/ticketsAction';
import * as employeesAction from './actions/employeesAction';
import * as departmentsAction from './actions/departmentsAction';

const store = configureStore();

store.dispatch(ticketsAction.startGetTickets());
store.dispatch(employeesAction.startGetEmployees());
store.dispatch(customersAction.startGetCustomers());
store.dispatch(departmentsAction.startGetDepartments());
// store.subscribe(()=> {console.log(store.getState(), "SUB");})

const el = (
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/"  component={App} />
        </BrowserRouter>
    </Provider>
);


ReactDOM.render(el, document.getElementById('root'))