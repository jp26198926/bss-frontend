const initialState = {
    settings: {
        API_URL: 'https://jp26198926-bss-backend.herokuapp.com',
        appName: 'Basic Support System'
    },
    showLogin: false,
    currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {},
    showMessage: {show: false, variant: "danger", message: ""},
    showToast: { show: false, variant: "primary"},
    showModal: {show:false, message: ""},
    showConfirm: { show: false, data: {}, message: "" },
    isEdit: "",
    forms: {
        setTicketStatus: { ticketId: "", show: false, value: "" },
        setAssignedTech: {ticketId:"", show:false, value: ""}
    },
    datas: [],
    data: {
        users: [],
        roles: [],
        pages: [],
        actions: [],
        permissions: [],
        statuses: [],
        ticketCategories: [],
        ticketStatuses: [],
    },
    selectedData: {},
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case "SET_SETTINGS":
            return {...state, settings: action.payload}

        case "SHOW_LOGIN":
            return {...state, showLogin: action.payload}
            
        case "LOGIN_SUCCESS":
            localStorage.setItem("currentUser", JSON.stringify( action.payload ) )
            return { ...state, showLogin: false, currentUser: action.payload};
            //return { ...state, showLogin: false, currentUser: action.payload }
            
        case "LOGOUT":
            localStorage.removeItem('currentUser');
            return { ...state, currentUser: {} }
        
        case "SHOW_MESSAGE":
            return { ...state, showMessage: action.payload }
        
        case "SHOW_MODAL":
            return { ...state, showModal: action.payload }
        
        case "SHOW_CONFIRM":
            return { ...state, showConfirm: action.payload }
        
        case "SHOW_TOAST_MESSAGE":
            return { ...state, showToast: action.payload }
        
        case "SET_IS_EDIT":
            return { ...state, isEdit: action.payload }
        
        case "SET_DATA":
            return { ...state, datas: action.payload }
        
        case "SET_DATA_SELECTED":
            return { ...state, selectedData: { ...state.selectedData, data: action.payload}}
        
        case "SET_DATA_USER":
            return { ...state, data: {...state.data, users: action.payload}}
        
        case "SET_DATA_ROLE":
            return { ...state, data: {...state.data, roles: action.payload}}
        
        case "SET_DATA_PAGE":
            return { ...state, data: { ...state.data, pages: action.payload } }
        
        case "SET_DATA_ACTION":
            return { ...state, data: { ...state.data, actions: action.payload } }
        
        case "SET_DATA_PERMISSION":
            return { ...state, data: {...state.data, permissions: action.payload}}
        
        case "SET_DATA_STATUS":
            return { ...state, data: { ...state.data, statuses: action.payload } }  
        
        case "SET_TICKET_CATEGORY":
            return { ...state, data: {...state.data, ticketCategories: action.payload}}
        
        case "SET_TICKET_STATUS":
            return { ...state, data: { ...state.data, ticketStatuses: action.payload } }
        
        case "SET_TICKET_REPLIES":
            return { ...state, selectedData: { ...state.selectedData, replies: action.payload } }
        
        //ticket Status
        case "FORM_TICKET_STATUS":
            return { ...state, forms: { ...state.forms, setTicketStatus: action.payload } }
        
        //ticket assign tech
        case "FORM_ASSIGNED_TECH":
            return { ...state, forms: { ...state.forms, setAssignedTech: action.payload } }
        
        default:
            return state;
    }
}

export default reducer;