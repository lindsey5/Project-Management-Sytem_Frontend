import { useEffect, useState } from "react"
import { getUserDetails } from "../../services/UserService"
import { cn } from "../../utils/utils";

const NewProjectButton = () => {
    const [isShow, setIsShow] = useState(false);

    return <button 
                onClick={() => setIsShow(!isShow)}
                className="w-30 relative px-6 py-2 bg-black rounded-xl 
                    text-white cursor-pointer font-bold ${!isShow && }"
            >
            + Project
            <div className={cn("shadow-md flex-col bg-gray-50 gap-2 text-gray-900 absolute -bottom-28 left-1/2",
                "transform -translate-x-1/2 hidden rounded-lg px-1 py-2 whitespace-nowrap z-10 ",
                "before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2",
                "before:border-8 before:border-transparent before:border-b-gray-100",
                isShow && "flex"
            )}
            >
                <button className="rounded-md cursor-pointer px-4 py-2 hover:bg-gray-200">Create Project</button>
                <button className="rounded-md cursor-pointer px-4 py-2 hover:bg-gray-200">Join Project</button>
            </div>
        </button>
}

const UserHeader = () => {
    const [userDetails, setUserDetails] = useState();

    useEffect(() => {
        const getUser = async () => {
            setUserDetails(await getUserDetails());
        }
        getUser();
    }, [])

    useEffect(() => {
        console.log(userDetails)
    }, [userDetails])

    return <header className="w-full px-4 py-6 flex bg-white">
        <div className="flex gap-3 flex-1">
            <input 
            className="w-full max-w-128 h-10 px-4 py-1 outline-none border-2 border-gray-300 rounded-md" 
            placeholder="Search"
            type="search" />
            <NewProjectButton />
        </div>
        <div className="flex gap-3">
            <button className="w-10 cursor-pointer">
                <img src="/notification.png" alt="" />
            </button>
            <button className="w-10 cursor-pointer">
                <img className="rounded-full" src={userDetails && userDetails.profile_pic} alt="" />
            </button>
        </div>


    </header>

}

export default UserHeader