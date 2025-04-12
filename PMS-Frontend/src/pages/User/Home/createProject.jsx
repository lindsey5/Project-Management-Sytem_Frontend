import Input from "../../../components/input"
import TextArea from "../../../components/textarea"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProjectReducer from "../../../hooks/projectReducer";
import { useEffect } from "react";

const CreateProjectModal = ({close}) => {
    const { state, dispatch } = useProjectReducer();

    useEffect(() => {
        console.log(state)
    }, [state])

    return <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
        <div className="px-6 py-10 w-[90%] max-w-128 bg-white rounded-xl">
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <div className="my-6 text-gray-400 flex items-center gap-4">
                <p>Project Type: </p>
                <div>
                    <input 
                    className="mr-1" 
                    type="radio" 
                    id="work" 
                    name="project-type"
                    value="work"
                    onChange={(e) => dispatch({type: 'SET_TYPE', payload: e.target.value})}
                    />
                    <label htmlFor="work">Work</label>
                </div>
                <div>
                    <input 
                        className="mr-1" 
                        type="radio" 
                        id="school" 
                        name="project-type"
                        value="school"
                        onChange={(e) => dispatch({type: 'SET_TYPE', payload: e.target.value})}
                    />
                    <label htmlFor="school">School</label>
                </div>
                <div>
                    <input 
                        className="mr-1" 
                        type="radio" 
                        id="other" 
                        name="project-type"
                        value="other"
                        onChange={(e) => dispatch({type: 'SET_TYPE', payload: e.target.value})}
                    />
                    <label htmlFor="other">Other</label>
                </div>
            </div>
            <Input onChange={(e) => dispatch({type: 'SET_TITLE', payload: e.target.value})} label='Title'/>
            <TextArea  onChange={(e) => dispatch({type: 'SET_DESCRIPTION', payload: e.target.value})} label="Description" className="w-full resize-none" />
            <p className="my-2 text-gray-400">Start Date</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            value={state.start_date}
                            onChange={(value) => dispatch({type: 'SET_START_DATE', payload: value})}
                        />
                    </LocalizationProvider>
            <div className="flex flex-row-reverse gap-3 mt-8">
            <button className="bg-black text-white p-2 rounded-lg cursor-pointer hover:bg-gray-600">Create</button>
            <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={close}
            >Cancel</button>
            </div>
        </div>
    </div>
}

export default CreateProjectModal