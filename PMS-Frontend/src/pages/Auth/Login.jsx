import { useState, useEffect } from "react"
import Input from "../../components/input"
import { googleLogin, Login } from "../../services/AuthService";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { downloadImageAsBase64 } from "../../utils/utils";

const GoogleButton = () => {

    const handleSuccess = async (response) => {
      try {
        const credential = response.credential;
        const decoded = JSON.parse(atob(credential.split('.')[1]));
        const byteImage = await downloadImageAsBase64(decoded.picture);
        
        const r = await googleLogin({
          google_id: decoded.sub, 
          firstname: decoded.given_name, 
          lastname: decoded.family_name,
          email: decoded.email,
          profile_pic: byteImage
        });
  
        if(r?.success) window.location.href = '/home';
        else toast.error("Login Error")
      } catch (error) {
        console.error('Login processing error:', error);
        toast.error("Login Error")
      }
    };
  
    const handleError = (error) => {
      console.error('Google Login Error:', error);
      toast.error("Login Error");
    };
  
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div>
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={handleError} 
            useOneTap={true}
            auto_select={true}
            shape="rectangular"
            size="large"
          />
          <p className="text-center mt-4 text-sm text-gray-600">
            By signing in, you agree to Google's{" "}
            <a 
              className="font-medium text-blue-600 hover:underline" 
              href="https://policies.google.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a 
              className="font-medium text-blue-600 hover:underline" 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>.
          </p>
        </div>
      </GoogleOAuthProvider>
    );
};

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
            toast.success("Login successful")
        }
    }

    return <form className="w-full h-screen flex justify-center items-center" 
                onSubmit={handleSubmit}>
            <div className="w-[360px] shadow-lg shadow-gray-300 border border-gray-300 rounded-lg p-6">
                <h1 className="font-bold text-4xl mb-8">Login</h1>
                {errors.map(err => <p className="text-red-600">{err}</p>)}
                <Input className="w-full" label={"Email Address"} type={"email"} onChange={(e) => handleInput(e, setEmail)}/>
                <Input className="w-full" label={"Password"} type={"password"}  onChange={(e) => handleInput(e, setPassword)}/>
                <div className="flex w-full items-center justify-between">
                    <a className="text-gray-400 hover:underline" href="">Forgot Password?</a>
                    <button className="cursor-pointer mt-2 text-white bg-black px-6 py-2 rounded-lg mb-2">Login</button>
                </div>
                <div className="w-full flex flex-col items-center gap-2 mb-4">
                    <p className="mt-2">Don't have an account? <a className="underline font-bold" href="">Sign Up</a></p>
                </div>
                <GoogleButton />
            </div>
    </form>
}

export default LoginPage