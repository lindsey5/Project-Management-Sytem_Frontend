import { useContext } from "react"
import { UserContext } from "../../../context/userContext"
import Card from "../../../components/card";


const Home = () => {
    const { user } = useContext(UserContext);

    return <main className="p-6">
        <h1 className="font-bold text-4xl">Welcome {user && user.firstname}!</h1>
        <div className="mt-10 w-full grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card 
                className="" 
                label="Active Projects" 
                value="3"
                iconPath="/briefcase.png"
            />
            <Card 
                className="" 
                label="Tasks" 
                value="2"
                iconPath="/folder.png"
            />
             <Card 
                className="" 
                label="Overdue Tasks" 
                value="5"
                iconPath="/time.png"
            />
            <Card 
                className="" 
                label="Completed Tasks" 
                value="5"
                iconPath="/checked.png"
            />
        </div>
    </main>

}

export default Home