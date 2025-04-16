import axios from "axios"

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