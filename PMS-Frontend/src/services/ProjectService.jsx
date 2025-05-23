import axios from "axios";

export const CreateProject = async (data) => {
    try{
        const response = await axios.post('/api/project', data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const updateProject = async (data) => {
    try{
        const response = await axios.put('/api/project', data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getProject = async (id) => {
    try{
        const response = await axios.get(`/api/project/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const deleteProject = async (id) => {
    try{
        const response = await axios.delete(`/api/project/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getProjects = async () => {
    try{
        const response = await axios.get('/api/project',{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        console.log(response.data)
        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getAuthorization = async (project_code) => {
    try{
        const response = await axios.get(`/api/project/authorize?project_code=${project_code}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
        }})

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const openProject = async (project_id) => {
    try{
        const response = await axios.post(`/api/recent_opened_project/${project_id}`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
        }})

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}