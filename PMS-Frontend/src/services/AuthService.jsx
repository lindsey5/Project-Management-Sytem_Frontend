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

export const signup = async (data) => {
    console.log(data)
    try{
        const response = await axios.post('/api/auth/signup', data);
        localStorage.setItem("token", response.data.token);
        return response.data
    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}
export const signupVerificationCode = async (email) => {
    try{
        const response = await axios.post(`/api/email/signup/verification-code?email=${email}`);
        return response.data
    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}

export const changePassword = async (data) => {
    try{
        const response = await axios.post('/api/auth/password', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });
        console.log(response)
        return response.data
    }catch(error){
        console.log(error)
        return error.response ? error.response.data : error.message
    }
}