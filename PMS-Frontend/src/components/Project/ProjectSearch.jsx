import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { cn } from '../../utils/utils';
import { useEffect, useState } from 'react';
import CreateProjectModal from '../../pages/User/Home/createProject';
import { getProjects } from '../../services/ProjectService';

const NewProjectButton = ({setShowCreate, setShowJoin}) => {
    const [isShow, setIsShow] = useState(false);

    return <div className="relative">
        <button 
            onClick={() => setIsShow(!isShow)}
            className="w-30 px-6 py-2 rounded-xl text-white cursor-pointer font-bold
            bg-[linear-gradient(45deg,_rgba(71,207,255,1)_0%,_rgba(120,140,255,1)_25%,_rgba(183,90,213,1)_51%,_rgba(255,90,150,1)_100%)]
            hover:bg-[linear-gradient(145deg,_rgba(255,90,150,1)_0%,_rgba(183,90,213,1)_51%,_rgba(120,140,255,1)_75%,_rgba(71,207,255,1)_100%)]"
        >
            + Project
        </button>
        <div className={cn("shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex-col white gap-2 text-gray-900 absolute",
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

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects.projects)
            setFilteredProjects(fetchedProjects.projects)
        }

        fetchProjects();
    }, [])

    return <aside className="flex justity-start fixed left-18 right-0 inset-y-0 bg-black/50 z-10">
        {showCreate && <CreateProjectModal close={() => setShowCreate(false)}/>}
        <div className="w-[370px] transition-all duration-300 ease-in relative p-4 bg-white flex flex-col justify-between gap-3">
            <div className='flex gap-3 items-center justify-between'>
                <TextField
                    id="input-with-icon-textfield"
                    placeholder='Search Project'
                    onChange={(e) => setFilteredProjects(projects.filter(project => {
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
                <IconButton size="medium" onClick={close}>
                    <CloseIcon sx={{ fontSize: 28 }}/>
                </IconButton>
            </div>
            <div className='overflow-y-auto flex-1 '>
                {filteredProjects.map(project => {
                    return <div className='rounded-lg p-3 justify-between flex items-center cursor-pointer hover:bg-gray-100'>
                        <div className='flex items-center gap-3'>
                            <div>
                                <img className="rounded-full w-12 h-12" src={`data:image/jpeg;base64,${project.user.profile_pic}`} alt="" />
                            </div>
                            <div className='flex flex-col gap-3 min-w-0'>

                                <div className='min-w-0'>
                                    <h1 className='break-words font-bold text-xl'>{project.title}</h1>
                                    <h2 className='break-words text-gray-400 mt-1'>{project.category}</h2>
                                </div>
                                <p className='text-gray-400 text-[14px]'>{project.start_date} - {project.end_date}</p>
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