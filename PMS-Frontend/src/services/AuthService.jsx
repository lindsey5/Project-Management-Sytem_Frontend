import axios from "axios"


export const Login = async (data) => {
    try{
        const response = await axios.post('/api/auth/login', data);
        localStorage.setItem("token", response.data.token);
        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const googleLogin = async (data) => {
    try{
        const response = await axios.post('/api/auth/google-login', data);
        localStorage.setItem("token", response.data.token);
        return response.data
    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}