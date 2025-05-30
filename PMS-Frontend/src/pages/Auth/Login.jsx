import { useState, useEffect } from "react"
import Input from "../../components/input"
import { Login } from "../../services/AuthService";
import { toast } from "react-toastify";
import GoogleButton from "./GoogleButton";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        document.title = "Login";
      }, []);

    const handleInput = (e, callBack) => {
        callBack(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([])
        const response = await Login({email, password})
        if(response?.errors){
            setErrors([].concat(...Object.values(response.errors)))
        }else if(!response?.success){
            setErrors([response.message])
        }else{
           window.location.href = "/home"
        }
    }

    return <form className="p-20 w-full h-screen flex justify-around items-center bg-[url('/bg.png')] bg-cover bg-center" 
                onSubmit={handleSubmit}>
            <div className="w-[360px] flex flex-col shadow-lg shadow-gray-300 border border-gray-300 rounded-lg p-6">
                <h1 className="font-bold text-4xl mb-4">Login</h1>
                {errors.map(err => <p className="text-red-600">{err}</p>)}
                <Input className="w-full" label={"Email Address"} type={"email"} onChange={(e) => handleInput(e, setEmail)}/>
                <Input className="w-full" label={"Password"} type={"password"}  onChange={(e) => handleInput(e, setPassword)}/>
                <button className="cursor-pointer mt-4 text-white px-6 py-2 rounded-lg mb-2
                bg-[linear-gradient(45deg,_#2A4EC1_,#9532C7)]
            hover:bg-[linear-gradient(45deg,_#9532C7_,#2A4EC1)]"
              type="submit"
              >Login</button>
                <a className="text-md mt-2 text-center text-gray-400 hover:underline" href="">Forgot Password?</a>
                <div className="mt-4 mb-2 grid grid-cols-[2fr_0.5fr_2fr] items-center text-center">
                  <hr className=""/>
                  <p className="text-gray-400">Or</p>
                  <hr />
                </div>
                <GoogleButton />
                <p className="text-center mt-8">Don't have an account? <a className="underline font-bold" href="/signup">Sign Up</a></p>
            </div>
    </form>
}

export default LoginPage