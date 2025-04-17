import { useReducer } from "react"

const projectState = {
    title: null,
    description: null,
    start_date: null,
    end_date: null,
    category: null
}

const projectReducer = (state, action) => {
    switch(action.type){
        case 'SET_TITLE':
            return { ...state, title: action.payload}
        case 'SET_DESCRIPTION':
            return { ...state, description: action.payload }
        case 'SET_START_DATE':
            return { ...state, start_date: action.payload }
        case 'SET_END_DATE':
            return { ...state, end_date: action.payload }
        case 'SET_CATEGORY':
            return { ... state, type: action.payload }
        case 'CLEAR':
            return projectState
        default: 
            return state
    }
}

const useProjectReducer = () => {
    const [state, dispatch] = useReducer(projectReducer, projectState);

    return { state, dispatch}
}

export default useProjectReducer