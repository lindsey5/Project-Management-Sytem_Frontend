import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { cn } from '../../utils/utils';
import { useEffect, useState } from 'react';
import CreateProjectModal from './CreateProject';
import { getProjects } from '../../services/ProjectService';
import { Box, Button, Chip } from '@mui/material';

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
                <button className="rounded-md cursor-pointer px-4 py-2 hover:bg-gray-200">Join Project</button>
        </div>
    </div>
}


const ProjectSearch = ({close}) => {
    const [showCreate, setShowCreate] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [alignment, setAlignment] = useState('All');

    const StatusButton = ({label, value}) => {
        return <Button
            variant="contained"
            size='small'
            sx={{ 
                borderRadius: '20px',
                backgroundColor: alignment === value ? 'black' : 'white',
                color: alignment === value ? 'white' : 'black',
                '&:hover': {
                backgroundColor: alignment === value ? '#6b7280' : '#e5e7eb'
                },
                paddingY: '4px',
                paddingX: '6px',
                boxShadow: 'none'
            }}
            onClick={() => handleChange(value)}
        >
        {label}
        </Button>
    }

    const handleChange = (newAlignment) => {
        setAlignment(newAlignment)
        setFilteredProjects(newAlignment !== 'All' ? 
            projects.filter(project => project.status === newAlignment) 
        : projects)
    };

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects.projects.sort((a, b) => new Date(a.end_date) - new Date(b.end_date)))
            setFilteredProjects(fetchedProjects.projects.sort((a, b) => new Date(a.end_date) - new Date(b.end_date)))
        }
        fetchProjects();
    }, [])

    return <aside className="flex justity-start fixed left-18 right-0 inset-y-0 bg-black/50 z-10">
        {showCreate && <CreateProjectModal close={() => setShowCreate(false)}/>}
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
                    onChange={(e) => setFilteredProjects(projects.filter(project => {
                        setAlignment('All')
                        return project.title.toLowerCase().includes(e.target.value.toLowerCase()) || 
                        project.category.toLowerCase().includes(e.target.value.toLowerCase())
                    }))}
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
                <StatusButton label='All' value='All' />
                <StatusButton label={`Active (${projects.filter(p => p.status === 'Active').length})`} value='Active'/>
                <StatusButton label={`On Hold (${projects.filter(p => p.status === 'On Hold').length})`} value='On Hold'/>
                <StatusButton label={`Closed (${projects.filter(p => p.status === 'Closed').length})`} value='Closed'/>
            </Box>
            <div className='overflow-y-auto flex-1 '>
                {filteredProjects.map(project => {
                    console.log(project)
                    return <div 
                            className='rounded-lg p-3 justify-between flex items-center cursor-pointer hover:bg-gray-100'
                            onClick={() => window.location.href = `/project/${project.project_code}`}
                        >
                            <div className='flex items-center gap-3'>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>
                                        <h1 className='break-all font-bold text-xl'>{project.title}</h1>
                                        <h2 className='break-all text-gray-400 mt-1'>{project.category}</h2>
                                    </div>
                                    <p className='text-gray-400 text-[14px]'>Deadline: {project.end_date}</p>
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
                <NewProjectButton setShowCreate={() => setShowCreate(!showCreate)}/>
            </div>
        </div>
    </aside>

}

export default ProjectSearch