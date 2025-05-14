import axios from "axios";

export const sendInvitation = async (data) => {
    try{
        const response = await axios.post('/api/invitation', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}


export const acceptInvitation = async (id) => {
    try{
        const response = await axios.put(`/api/invitation/accept/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        return response.data
        
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}