import { useState, useEffect } from "react"
import { signup, signupVerificationCode } from "../../services/AuthService";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { TextField } from "@mui/material";
import GoogleButton from "./GoogleButton";
import { isStrongPassword } from "../../utils/utils";
import PasswordField from '../../components/PasswordField'

const VerifyCode = ({ newUser }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if(newUser) setUser(newUser)
    }, [newUser])

    const resend = async () => {
        setLoading(true);
        const response = await signupVerificationCode(newUser.email);
        setUser(prev => ({ ...prev, verificationCode: response.verification_code}))
        setLoading(false)

    }

    const verify = async (e) => {
        e.preventDefault();
        setError('')
        if(!code) return setError('Please enter a code.');

        if(code == user.verificationCode) {
            const { verificationCode, confirmPassword, ...rest} = user;
            const response = await signup({...rest});
            if(response.success) window.location.href = '/home';
            else setError(response.message);

        }else setError("Incorrect code.")
    }

    return <form 
        className="bg-white flex flex-col text-center items-center shadow-lg gap-5 
        shadow-gray-300 border border-gray-300 rounded-lg py-8 px-10"
        onSubmit={verify}
    >
        <VerifiedUserIcon sx={{ fontSize: '80px', color: '#9532C7'}}/>
        <h1 className="font-bold text-2xl">Verify your email address</h1>
        <p>We have sent a code to your email.</p>
        <p className="text-red-600">{error}</p>
        <TextField 
            fullWidth
            inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: { textAlign: 'center', background: '#f3f4f6' }
              }}
              onChange={(e) => setCode(e.target.value)}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
        />
        {loading ? <p>Loading...</p> : <button 
            className="w-full cursor-pointer text-white px-6 py-2 rounded-lg
                bg-[linear-gradient(45deg,_#2A4EC1_,#9532C7)]
                hover:bg-[linear-gradient(45deg,_#9532C7_,#2A4EC1)]"
            type="submit"
        >Verify</button>}
        <p>Didn't receive code? <span 
                className="underline font-bold cursor-pointer text-[#9532C7]" 
                onClick={resend}
            >Resend</span>
        </p>
    </form>
}

const SignupPage = () => {
    const [newUser, setNewUser] = useState({
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: "",
        verificationCode: null,
    })
    const [errors, setErrors] = useState([]);
    const [showVerify, setShowVerify] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setNewUser(prev =>( {...newUser, [field]: value}));
    }

    useEffect(() => {
        document.title = "Signup";
      
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([])
        setLoading(true)
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
                setNewUser(prev => ({ ...prev, verificationCode: response.verification_code}))
                setShowVerify(true)
            }
        }
        setLoading(false)
    }

    return <div className="py-20 w-full h-screen flex justify-around items-center bg-2 bg-cover bg-center">
            {showVerify ? <VerifyCode newUser={newUser} /> : <form 
                className="w-[95%] max-w-[400px] bg-white flex flex-col shadow-lg gap-5 shadow-gray-300 border 
                border-gray-300 rounded-lg p-6"
                onSubmit={handleSubmit}
                >
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
                {loading ? <p>Loading...</p> : 
                <button className="cursor-pointer text-white px-6 py-2 rounded-lg
                    bg-[linear-gradient(45deg,_#2A4EC1_,#9532C7)]
                    hover:bg-[linear-gradient(45deg,_#9532C7_,#2A4EC1)]"
                    type="submit"
                >Signup</button>}
                <GoogleButton />
                <p className="text-center">Already have an account? <a className="underline font-bold" href="/login">Login</a></p>
            </form>}
    </div>
}

export default SignupPage