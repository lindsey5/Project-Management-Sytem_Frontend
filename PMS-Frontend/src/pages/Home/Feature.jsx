import useInViewObserver from "../../hooks/observer";

const FeatureCard = ({imagePath, name, description}) => {
    return <div className="w-[350px] flex flex-col items-center text-center">
        <div className="w-[109px] h-[109px] rounded-full bg-gray-200 p-3 flex justify-center items-center">
            <img className="w-8/10 h-8/10 object-cover" src={imagePath} alt="" />
        </div>
        <h1 className="text-2xl mt-6 font-bold">{name}</h1>
        <p className="text-md mt-4">{description}</p>
    </div>
}

const FeatureSection = () => {
    const [ref, inView] = useInViewObserver(0.2);

    return <section id="features" className="w-full flex flex-col items-center px-10 py-24 text-center" ref={ref}>
        <h1 className={`opacity-0 text-shadow-[2px_5px_3px_rgb(0_0_0_/_0.25)] text-5xl font-bold ${inView && 'animate-show'}`}>Feature Highlights</h1>
        <div className={`py-16 opacity-0 max-w-[1296px] mt-12 flex flex-wrap gap-x-12 gap-y-16 justify-center ${inView && 'animate-scaleX'}`}>
            <FeatureCard imagePath={"/project.png"} name={"Project Management"} description={"Plan, assign, and track tasks with ease."}/>
            <FeatureCard imagePath={"/tools.png"} name={"Colaboration Tools"} description={"Work together with your team and stay in sync."}/>
            <FeatureCard imagePath={"/clock.png"} name={"Time Management"} description={"Set deadlines, track time, and meet your goals."}/>
            <FeatureCard imagePath={"/progress.png"} name={"Progress Tracking"} description={"Monitor your team's progress with visual reports."}/>
            <FeatureCard imagePath={"/lock.png"} name={"Security & Privacy"} description={"Your data is safe with us, with top-notch encryption and privacy settings."}/>
        </div>
    </section>
}


export default FeatureSection