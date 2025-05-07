import Input from "../input"
import TextArea from "../textarea"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProjectReducer from "../../hooks/projectReducer";
import { useState } from "react";
import { CreateProject, openProject } from "../../services/ProjectService";
import { formatDate } from "../../utils/utils";
import { toast } from "react-toastify";
import project_types from '../../../project_types.json'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { green } from '@mui/material/colors';
import { CustomButton } from "../button";
import dayjs from "dayjs";

const filter = createFilterOptions();

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: "gray",
    backgroundColor: "white"
  }));
  
  const GroupItems = styled('ul')({
    padding: 0,
  });

const CreateProjectModal = ({close}) => {
    const { state, dispatch } = useProjectReducer();
    const [error, setError] = useState('');
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('')
        setLoading(true);
        if(!state.title) setError('Title is required')
        else if(!state.description) setError('Description is required')
        else if(!state.start_date) setError('Start date is required')
        else if(!state.end_date) setError('Deadline is required')
        else if(!value) setError('Project type is required')
        else if(state.start_date > state.end_date) setError("Invalid Deadline")
        else {
            const response = await CreateProject({
                ...state, 
                type: value.name,
                start_date: formatDate(state.start_date),
                end_date: formatDate(state.end_date),
                status: 'Active'
            })
            if(response.success) {
                const openProjectResponse = await openProject(response.data.id);
                
                if(openProjectResponse.success) {
                    window.location.href = `/project/tasks?c=${response.data.project_code}`
                    dispatch({type: 'CLEAR'})
                }
                
            }else{
                toast.error("Failed, please try again.")
            }
        }
        setLoading(false)
    }

    const deduplicatedOptions = project_types.filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.name === option.name)
      ).sort((a, b) => a.category.localeCompare(b.category));

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
                        value={dayjs(state.start_date)}
                        minDate={dayjs()}
                        onChange={(value) => dispatch({type: 'SET_START_DATE', payload: value.$d})}
                    />
                </LocalizationProvider>
            </div>
            <div className="w-full">
                <p className="my-2 text-gray-400">Deadline</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        className="w-full"
                        minDate={dayjs(state.start_date)}
                        value={dayjs(state.end_date)}
                        onChange={(value) => dispatch({type: 'SET_END_DATE', payload: value.$d})}
                    />
                </LocalizationProvider>
            </div>
            </div>
            <Autocomplete
                value={value}
                groupBy={(option) => option.category}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                    setValue({ name: newValue });
                    } else if (newValue && newValue.inputValue) {
                    // Creating a new value
                    setValue({ name: newValue.inputValue });
                    } else {
                    setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;

                    const isExisting = options.some(
                    (option) => inputValue === option.name
                    );
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
                options={deduplicatedOptions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                    return option;
                    }
                    return option.name;
                }}
                renderGroup={(params) => (
                    <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                    </li>
                )}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const uniqueKey = `${option.name}-${option.category || 'uncategorized'}`;
                    return (
                    <li key={uniqueKey} {...optionProps}>
                        {option.name}
                    </li>
                    );
                }}
                size="medium"
                sx={{ width: '100%', marginTop: '30px' }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Project Type" />
                )}
                />
            <p className="text-red-600">{error}</p>
            <div className="flex flex-row-reverse gap-3 mt-8">
            <CustomButton 
                sx={{borderRadius: '10px'}}
                onClick={handleSubmit}
                disabled={loading}
            >CREATE</CustomButton>
            <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={close}
            >Cancel</button>
            </div>
        </div>

    </div>
}
export default CreateProjectModal