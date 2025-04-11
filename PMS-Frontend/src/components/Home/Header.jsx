import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if(section) section.scrollIntoView({
        behavior: 'smooth', 
        block: 'start', 
    })
}

const HomeHeader = () => {
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleShow = () => {
        setIsShow(prev => !prev)
    }

    return <header className="z-1 fixed top-0 left-0 right-0 h-[67px] p-4 sm:p-10 bg-white flex items-center justify-between">
        <img 
            className="h-[48px] cursor-pointer" src="/logo.png" alt="" 
            onClick={() => location.pathname === '/' ? scrollToSection("hero") : navigate('/')} 
        />
        {location.pathname === '/' && 
        <>
            <nav className={`gap-8 ${location.pathname === '/' && 'hidden md:flex'}`}>
                <button className="cursor-pointer text-lg hover:underline" onClick={() => scrollToSection("hero")}>Home</button>
                <button className="cursor-pointer text-lg hover:underline" onClick={() => scrollToSection("features")}>Features</button>
                <button className="cursor-pointer text-lg hover:underline" onClick={() => scrollToSection("HowItWork")}>How It Works</button>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-lg cursor-pointer hover:bg-gray-700">Get Started</button>
            </nav>
            <button className="h-[36px] block md:hidden cursor-pointer" onClick={handleShow}>
                <img className="w-full h-full" src="/hamburger.png" alt="" />
            </button>
            <nav className={`absolute top-[100%] left-0 right-0 bg-gray-100 p-6 ${isShow ? 'block' : 'hidden' } md:hidden`}>
                <button className="cursor-pointer w-full py-4 text-xl" onClick={() => scrollToSection("hero")}>Home</button>
                <button className="cursor-pointer w-full py-4 text-xl" onClick={() => scrollToSection("features")}>Features</button>
                <button className="cursor-pointer w-full py-4 text-xl" onClick={() => scrollToSection("HowItWork")}>How It Works</button>
                <button className="cursor-pointer w-full py-4 text-xl">Get Started</button>
            </nav>
        </>
        }
    </header>
}

export default HomeHeader