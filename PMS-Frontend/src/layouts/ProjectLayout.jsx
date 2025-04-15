import { createContext, useEffect, useState } from "react"
import { getAuthorization } from "../services/ProjectService"
import { Outlet, useSearchParams } from "react-router-dom"
import ProjectHeader from "../components/Project/ProjectHeader";

export const ProjectContext = createContext();

const ProjectLayout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('c');
    const [project, setProject] = useState();
    
    useEffect(() => {
        const getAuthorize = async () => {
            const response = await getAuthorization(code);
            
            if(!response.success) window.location.href = '/'
            else {
                setProject(response.project)
            }
        }

        getAuthorize()
    }, [])

    return <ProjectContext.Provider value={{ project, code }}>
        <div className="box-border relative h-full">
            <ProjectHeader />
            <Outlet />
        </div>
    </ProjectContext.Provider>
}

export default ProjectLayout