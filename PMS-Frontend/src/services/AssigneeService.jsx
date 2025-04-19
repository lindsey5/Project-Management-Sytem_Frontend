import axios from "axios";

export const updateAssignees = async (task_id, assigneesToUpdate) => {
    try{
        const response = await axios.put(`/api/assignee/${task_id}`, assigneesToUpdate, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}