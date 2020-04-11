export const departmentsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_DEPARTMENTS':
            
            return [...action.payload];
        
        default:
            return state;
    }
}