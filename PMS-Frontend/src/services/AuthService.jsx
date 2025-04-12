import axios from "axios"


export const Login = async (data) => {
    try{
        const response = await axios.post('/api/auth/login', data);

        return response.data

    }catch(error){
        return error.response ? error.response.data : error.message
    }
}

export const googleLogin = async (data) => {
    try{
        const response = await axios.post('/api/auth/google-login', data);

        return response.data
    }catch(error){
        return error.response ? error.response.data : error.message
    }
}