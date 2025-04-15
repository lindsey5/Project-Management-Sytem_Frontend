import { useEffect } from "react"
import { getAuthorization } from "../services/ProjectService"
import { useParams, Outlet } from "react-router-dom"

const ProjectLayout = () => {
    const { code } = useParams();
    
    useEffect(() => {
        const getAuthorize = async () => {
            const response = await getAuthorization(code);
            
            if(!response.success) window.location.href = '/'
        }

        getAuthorize()

    }, [])

    return <div className="bg-red-100">
                <Outlet />
            </div>
}

export default ProjectLayout