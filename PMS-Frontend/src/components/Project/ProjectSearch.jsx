import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { cn, formatDateTime } from '../../utils/utils';
import { useEffect, useMemo, useState } from 'react';
import CreateProjectModal from './CreateProject';
import { getProjects, openProject } from '../../services/ProjectService';
import { Box, Chip } from '@mui/material';
import JoinProject from './JoinProject';
import { CustomButton } from '../button';

const NewProjectButton = ({setShowCreate, setShowJoin}) => {
    const [isShow, setIsShow] = useState(false);

    return <div className="relative">
        <button 
            onClick={() => setIsShow(!isShow)}
            className="w-30 px-6 py-2 rounded-xl text-white cursor-pointer font-bold
            bg-[linear-gradient(45deg,_#2328ff_,_#a1ffaa)]
            hover:bg-[linear-gradient(45deg,_#a1ffaa_,_#2328ff)]"
        >
            + Project
        </button>
        <div className={cn(" shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex-col bg-white gap-2 text-gray-900 absolute",
                "-top-30 left-1/2 transform -translate-x-1/2 hidden rounded-lg px-1 py-2 whitespace-nowrap z-10 ",
                "before:content-[''] before:absolute before:-bottom-4 before:left-1/2 before:-translate-x-1/2",
                "before:border-8 before:border-transparent before:border-t-white",
                isShow && "flex"
            )}
            >
                <button 
                    className="w-36 rounded-md cursor-pointer px-4 py-2 hover:bg-gray-200"
                    onClick={setShowCreate}
                >Create Project</button>
                <button 
                    className="rounded-md cursor-pointer px-4 py-2 hover:bg-gray-200"
                    onClick={setShowJoin}
                >Join Project</button>
        </div>
    </div>
}


const ProjectSearch = ({close}) => {
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [projects, setProjects] = useState([]);
    const [alignment, setAlignment] = useState('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const [input, setInput] = useState('');

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            return project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            project.category.toLowerCase().includes(searchTerm.toLowerCase())
        }).filter(p => alignment !== 'All' ? p.status === alignment : true)
    }, [searchTerm, projects, alignment])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
          setSearchTerm(input)
        }, 300); // 300ms delay
      
        return () => clearTimeout(delayDebounce);
      }, [input]);
    

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            const cleanedFetchedProject = fetchedProjects.projects.map(p => ({ ...p.project, last_accessed: p.last_accessed }));
            setProjects(cleanedFetchedProject)
        }
        fetchProjects();
    }, [])

    const handleOpen = async (project) => {
        const response = await openProject(project.id);
        if(response.success) window.location.href = `/project/tasks?c=${project.project_code}`
    }

    return <aside className="flex justity-start fixed left-18 right-0 inset-y-0 bg-black/50 z-10">
        {showCreate && <CreateProjectModal close={() => setShowCreate(false)}/>}
        {showJoin && <JoinProject close={() => setShowJoin(false)}/>}
        <div className="w-[400px] transition-all duration-300 ease-in relative px-4 py-7 bg-white flex flex-col justify-between gap-3">
            <div className='flex gap-3 items-center justify-between'>
            <h1 className='text-3xl font-bold'>All Projects</h1>
                <IconButton size="medium" onClick={close}>
                    <CloseIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </div>
            <TextField
                    id="input-with-icon-textfield"
                    placeholder='Search Project'
                    onChange={(e) => setInput(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        borderRadius: '20px'
                    } }}
                    slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon sx={{ fontSize: 25, color: 'black'}}/>
                        </InputAdornment>
                        ),
                    },
                    }}
                    variant='outlined'
                    size='small'
                />
            <Box sx={{ width: '100%', display: 'flex', marginY: '20px', justifyContent: 'space-between' }}>
                <CustomButton 
                    label="All"
                    size="small"
                    sx={{
                        backgroundColor: alignment === "All" ? 'black' : '#f3f4f6',
                        color: alignment == "All" ? 'white' : 'black',
                        '&:hover': { backgroundColor: alignment === "All" ? '#6b7280' : '#e5e7eb'} 
                    }}
                    onClick={() => setAlignment("All")}
                >All</CustomButton>
                <CustomButton 
                    size="small"
                    sx={{
                        backgroundColor: alignment === "Active" ? 'black' : '#f3f4f6',
                        color: alignment == "Active" ? 'white' : 'black',
                        '&:hover': { backgroundColor: alignment === "Active" ? '#6b7280' : '#e5e7eb'} 
                    }}
                    onClick={() => setAlignment("Active")}
                >{`Active (${projects.filter(p => p.status === 'Active').length})`} </CustomButton>
                <CustomButton 
                    size="small"
                    sx={{
                        backgroundColor: alignment === "On Hold" ? 'black' : '#f3f4f6',
                        color: alignment == "On Hold" ? 'white' : 'black',
                        '&:hover': { backgroundColor: alignment === "On Hold" ? '#6b7280' : '#e5e7eb'} 
                    }}
                    onClick={() => setAlignment("On Hold")}
                >{`On Hold (${projects.filter(p => p.status === 'On Hold').length})`} </CustomButton>
                <CustomButton 
                    size="small"
                    sx={{
                        backgroundColor: alignment === "Closed" ? 'black' : '#f3f4f6',
                        color: alignment == "Closed" ? 'white' : 'black',
                        '&:hover': { backgroundColor: alignment === "Closed" ? '#6b7280' : '#e5e7eb'} 
                    }}
                    onClick={() => setAlignment("Closed")}
                >{`Closed (${projects.filter(p => p.status === 'Closed').length})`} </CustomButton>
            </Box>
            <div className='overflow-y-auto flex-1 '>
                {filteredProjects.map(project => {
                    return <div 
                            key={project.id}
                            className='rounded-lg p-3 justify-between flex items-center cursor-pointer hover:bg-gray-100'
                            onClick={() => handleOpen(project)}
                        >
                            <div className='flex items-center gap-3'>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <h1 className='break-all font-bold text-xl'>{project.title}</h1>
                                    </div>
                                    <p className='text-gray-400 text-[14px]'>Start: {project.start_date}</p>
                                    <p className='text-gray-400 text-[14px]'>Deadline: {project.end_date}</p>
                                    <p className='text-gray-400 text-[14px]'>Creator: {project.user.firstname} {project.user.lastname.charAt(0)}.</p>
                                    <Chip 
                                        label={project.status} 
                                        variant='filled' 
                                        size='small' sx={{ minWidth: '70px', marginTop: '5px' }} 
                                        color={(project.status == 'Active' && 'info') || (project.status == 'Closed' && 'error')}
                                    />
                                </div>
                            </div>
                            <ChevronRightIcon sx={{fontSize: 30}}/>
                    </div>
                })}
            </div>
            <div className='flex flex-row-reverse'>
                <NewProjectButton 
                    setShowCreate={() => setShowCreate(!showCreate)}
                    setShowJoin={() => setShowJoin(!showJoin)}
                />
            </div>
        </div>
    </aside>

}

export default ProjectSearch