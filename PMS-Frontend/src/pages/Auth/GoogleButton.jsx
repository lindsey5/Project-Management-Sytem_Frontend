import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { downloadImageAsBase64 } from "../../utils/utils";
import { googleLogin } from "../../services/AuthService";

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
        </div>
      </GoogleOAuthProvider>
    );
};

export default GoogleButton