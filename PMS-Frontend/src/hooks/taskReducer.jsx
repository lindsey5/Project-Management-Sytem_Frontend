import { useReducer } from "react"
import dayjs from "dayjs";

const today = dayjs();

const newTaskState = {
    task_name: "",
    description: "",
    priority: '',
    status: '',
    due_date: today,
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
        case 'SET_DUE_DATE':
            return {...state, due_date: action.payload}
        case 'SET_ASSIGNEES':
            return {...state, assigneesMemberId: action.payload}
        case 'CLEAR':
            return newTaskState
    }
}

const useTaskReducer = () => {
    const [state, dispatch] = useReducer(taskReducer, newTaskState);

    return { state, dispatch}
}

export default useTaskReducer