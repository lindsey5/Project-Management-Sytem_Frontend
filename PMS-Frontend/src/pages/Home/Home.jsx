import { useNavigate } from "react-router-dom";
import useInViewObserver from "../../hooks/observer";
import FeatureSection from "./Feature"
import HowItWorkSection from "./HowItWork";
import { useEffect } from "react";

const HeroSection = () => {
    const [ref, inView] = useInViewObserver(0.2);
    const navigate = useNavigate();
  
    return (
      <section id="hero" ref={ref} className="w-full flex items-center justify-center px-10 pb-10 pt-[180px] mb-16 text-center">
        <div className="flex flex-col items-center">
          <h1 className={`w-[150px] py-2 text-shadow-[2px_5px_3px_rgb(0_0_0_/_0.25)] 
            md:whitespace-nowrap text-5xl 
            font-bold md:animate-typing md:border-r-4 overflow-hidden`}>
            Manage Your Projects with Ease</h1>
          <p className={`opacity-0 mt-4 text-lg md:text-2xl ${ inView && 'animate-slide-left'}`}>
            Collaborate with your team, track progress, and meet deadlines efficiently.
          </p>
          <div className={`opacity-0 mt-8 mb-8 flex gap-6 ${ inView && 'animate-show-delay' }`}>
            <button 
              className="animate-wiggle rounded-xl bg-[linear-gradient(45deg,_#2A4EC1_,#9532C7)]
            hover:bg-[linear-gradient(45deg,_#9532C7_,#2A4EC1)] px-4 py-2 font-bold 
              text-xl cursor-pointer text-white"
              onClick={() => navigate('/login')}
            >
            Get Started
            </button>
          </div>
          <img className='mt-20 w-[90%]' src="Untitled design.png" alt="" />
        </div>
      </section>
    );
  };

const HomePage = () => {
    useEffect(() => {
        document.title = "ProJek";
    }, []);
    
    return <>
        <HeroSection />
        <FeatureSection />
        <HowItWorkSection />
    </>
}

export default HomePage