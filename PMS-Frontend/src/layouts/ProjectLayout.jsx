import { createContext, useEffect, useState } from "react"
import { getAuthorization } from "../services/ProjectService"
import { Outlet, useSearchParams } from "react-router-dom"
import ProjectHeader from "../pages/User/Project/ProjectHeader";

export const ProjectContext = createContext();

const ProjectLayout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('c');
    const [project, setProject] = useState();
    const [role, setRole] = useState()
    
    useEffect(() => {
        const getAuthorize = async () => {
            const response = await getAuthorization(code);
            
            if(!response.success) window.location.href = '/'
            else {
                setProject(response.project)
                setRole(response.role)
            }
        }

        getAuthorize()
    }, [])

    return project && role ? <ProjectContext.Provider value={{ project, code, role }}>
    <div className="box-border flex flex-col h-full">
        <ProjectHeader />
        <Outlet />
    </div>
</ProjectContext.Provider> : null
}

export default ProjectLayout