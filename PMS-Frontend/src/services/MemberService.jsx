import axios from "axios"

export const updateMember = async (member_id, data) => {
    try{
        console.log(data)
        const response = await axios.put(`/api/member/${member_id}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const deleteMember = async (member_id) => {
    try{
        const response = await axios.delete(`/api/member/${member_id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const getMembers = async (project_code) => {
    try{
        const response = await axios.get(`/api/member?project_code=${project_code}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const createMember = async (data) =>{
    try{
        console.log(data)
        const response = await axios.post('/api/member', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }

}