import { useReducer } from "react"
import dayjs from "dayjs";

const today = dayjs();

const newTaskState = {
    task_name: "",
    description: "",
    priority: '',
    status: '',
    start_date: today,
    due_date: null,
    assigneesMemberId: []
}

const taskReducer = (state, action) => {
    switch(action.type){
        case 'SET_TASK_NAME' : 
            return { ...state, task_name: action.payload}
        case 'SET_DESCRIPTION':
            return {...state, description: action.payload}
        case 'SET_PRIORITY':
            return {...state, priority: action.payload}
        case 'SET_STATUS':
            return {...state, status: action.payload}
        case 'SET_START_DATE':
            return {...state, start_date: action.payload}
        case 'SET_DUE_DATE':
            return {...state, due_date: action.payload}
        case 'SET_ASSIGNEES':
            return {...state, assigneesMemberId: action.payload}
        case 'SET_TASK':
            return action.payload
        case 'CLEAR':
            return newTaskState
    }
}

const useTaskReducer = () => {
    const [state, dispatch] = useReducer(taskReducer, newTaskState);

    return { state, dispatch}
}

export default useTaskReducer