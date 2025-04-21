import { useContext } from "react"
import { UserContext } from "../../../context/userContext"

const Home = () => {
    const { user } = useContext(UserContext);

    return <main className="p-6">
        <h1 className="font-bold text-4xl">Welcome {user && user.firstname}!</h1>
        
    </main>

}

export default Home