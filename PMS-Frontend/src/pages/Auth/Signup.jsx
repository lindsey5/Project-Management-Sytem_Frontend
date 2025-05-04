import { useState, useEffect } from "react"
import { signupVerificationCode } from "../../services/AuthService";
import { toast } from "react-toastify"
import { IconButton, TextField } from "@mui/material";
import GoogleButton from "./GoogleButton";
import { isStrongPassword } from "../../utils/utils";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PasswordField = ({ onChange, label }) => {
    const [show, setShow] = useState(false);

    return <div className="relative">
        <IconButton 
            size="md"
            onClick={() => setShow(!show)}
            sx={{ 
                zIndex: 2,
                position: 'absolute',
                top: '50%',
                right: 5,
                transform: "translateY(-50%)"
            }}>
            {show ? <VisibilityOffIcon fontSize="inherit"/> : <VisibilityIcon fontSize="inherit"/>}
        </IconButton>
        <TextField 
            type={show ? "text" : "password"}
            label={label}
            required
            fullWidth
            onChange={onChange} 
        />
    </div>
}

const SignupPage = () => {
    const [newUser, setNewUser] = useState({
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState([]);

    const handleChange = (field, value) => {
        setNewUser(prev =>( {...newUser, [field]: value}));
    }

    useEffect(() => {
        document.title = "Signup";
      
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([])
        
        if(newUser.password !== newUser.confirmPassword){
            setErrors(["Password doesn't match"]);
        }else if(isStrongPassword(newUser.password)){
            setErrors([isStrongPassword(newUser.password)])
        }else{
            const response = await signupVerificationCode(newUser.email);
            if(response?.errors){
                setErrors([].concat(...Object.values(response.errors)))
            }else if(!response?.success){
                setErrors([response.message])
            }else{
                toast.success("Login successful")
            }
        }
    }

    return <form className="py-20 w-full h-screen flex justify-around items-center bg-2 bg-cover bg-center" 
                onSubmit={handleSubmit}>
            <div className="w-[95%] max-w-[400px] bg-white flex flex-col shadow-lg gap-5 shadow-gray-300 border border-gray-300 rounded-lg p-6">
                <h1 className="font-bold text-4xl">Signup</h1>
                {errors.map(err => <p key={err} className="text-red-600">{err}</p>)}
                <TextField 
                    label="Email Address" 
                    type="email"
                    required
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                <div className="flex gap-3">
                    <TextField 
                        label="Firstname" 
                        required
                        onChange={(e) => handleChange("firstname", e.target.value)}
                    />
                    <TextField 
                        label="Lastname" 
                        required
                        onChange={(e) => handleChange("lastname", e.target.value)}
                    />
                </div>
                <PasswordField 
                    label="Password"
                    onChange={(e) => handleChange("password", e.target.value)}
                />
                <PasswordField 
                    label="Confirm password"
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
                <button className="cursor-pointer text-white px-6 py-2 rounded-lg
                bg-[linear-gradient(45deg,_#2A4EC1_,#9532C7)]
            hover:bg-[linear-gradient(45deg,_#9532C7_,#2A4EC1)]"
                type="submit"
            >Signup</button>
                <GoogleButton />
                <p className="text-center">Already have an account? <a className="underline font-bold" href="/login">Login</a></p>
            </div>
    </form>
}

export default SignupPage