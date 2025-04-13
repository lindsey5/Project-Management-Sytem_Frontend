import Input from "../../../components/input"
import TextArea from "../../../components/textarea"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProjectReducer from "../../../hooks/projectReducer";
import { useEffect, useState } from "react";
import { CreateProject } from "../../../services/ProjectService";
import { formatDate } from "../../../utils/utils";
import { toast } from "react-toastify";
import projectCategories from '../../../../project_categories.json'
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const CreateProjectModal = ({close}) => {
    const { state, dispatch } = useProjectReducer();
    const [error, setError] = useState('');
    const [value, setValue] = useState(null);

    const handleSubmit = async () => {
        setError('')
        if(!state.title) setError('Title is required')
        else if(!state.description) setError('Description is required')
        else if(!state.start_date) setError('Start date is required')
        else if(!state.end_date) setError('Deadline is required')
        else if(!value) setError('Category is required')
        else if(state.start_date.$d > state.end_date.$d) setError("Invalid Deadline")
        else {
            const response = await CreateProject({
                ...state, 
                category: value.name,
                start_date: formatDate(state.start_date?.$d),
                end_date: formatDate(state.end_date.$d)
            })
            if(response.success) {
                window.location.href = "/projects"
            }else{
                toast.error("Failed, please try again.")
            }
        }
    }

    const options = Array.from(new Set(projectCategories)).sort().map((option) => {
        const firstLetter = option[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            name: option,
        };
    });

    return <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
        <div className="px-6 py-10 w-[90%] max-w-128 bg-white rounded-xl">
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <Input onChange={(e) => dispatch({type: 'SET_TITLE', payload: e.target.value})} label='Title'/>
            <TextArea  onChange={(e) => dispatch({type: 'SET_DESCRIPTION', payload: e.target.value})} label="Description" className="w-full resize-none" />
            <div className="flex gap-3">
            <div className="w-full">
                <p className="my-2 text-gray-400">Start Date</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        value={state.start_date}
                        onChange={(value) => dispatch({type: 'SET_START_DATE', payload: value})}
                    />
                </LocalizationProvider>
            </div>
            <div className="w-full">
                <p className="my-2 text-gray-400">Deadline</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        className="w-full"
                        value={state.end_date}
                        onChange={(value) => dispatch({type: 'SET_END_DATE', payload: value})}
                    />
                </LocalizationProvider>
            </div>
            </div>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                    setValue({
                        name: newValue,
                    });
                    } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                        name: newValue.inputValue,
                    });
                    } else {
                    setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.title);
                    if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        name: `Add "${inputValue}"`,
                    });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={options}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                    return option;
                    }
                    // Regular option
                    return option.name;
                }}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                    <li key={key} {...optionProps}>
                        {option.name}
                    </li>
                    );
                }}
                size='medium'
                sx={{ width: '100%', marginTop: '30px' }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Select Category" />
                )}
            />
            <p className="text-red-600">{error}</p>
            <div className="flex flex-row-reverse gap-3 mt-8">
            <button 
                className="bg-black text-white p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                onClick={handleSubmit}
            >Create</button>
            <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={close}
            >Cancel</button>
            </div>
        </div>
    </div>
}

export default CreateProjectModal