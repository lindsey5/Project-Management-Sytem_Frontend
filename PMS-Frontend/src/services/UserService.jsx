import axios from "axios"

export const getUserDetails = async () => {
    try{
        const response = await axios.get("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        return response.data;

    }catch(err){
        console.error("Failed to fetch user details:", err);
        return null
    }

}