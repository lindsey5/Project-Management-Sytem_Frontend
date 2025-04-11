import useInViewObserver from "../../hooks/observer";

const constants = [ 
    {
        imagePath: "/secure.png",
        name: "Sign up for Free",
        description: "Register for an account to get started."
    },
    {
        imagePath: "/blueprint.png",
        name: "Create a Project",
        description: "Start adding tasks, set deadlines, and assign team members."
    },
    {
        imagePath: "/progress.png",
        name: "Track Progress",
        description: "View your project status and make updates."
    },

]

const Card = ({imagePath, name, description}) => {

    return <div className="text-center w-[300px] h-[400px] shadow-lg shadow-gray-500 rounded-xl p-8 flex flex-col items-center justify-center">
        <img className="mb-8 h-[80px] " src={imagePath} alt="" />
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg mt-8">{description}</p>
    </div>
}


const HowItWorkSection = () => {
    const [ref, inView] = useInViewObserver(0.2);

    return <section id="HowItWork" className="flex flex-col items-center w-full gap-10 py-10" ref={ref}>
        <h1 className='text-shadow-[2px_5px_3px_rgb(0_0_0_/_0.25)] text-5xl font-bold'>How It Works</h1>
        <div className={`opacity-0 flex flex-wrap justify-center items-center p-10 gap-10 ${inView && 'animate-slide-right'}`}>
        {constants.map((c, index)=> {
            return <>
            <Card imagePath={c.imagePath} name={c.name} description={c.description}/>
            {index !== constants.length-1 && <img className="hidden lg:block h-[48px]" src="/right-arrow.png" alt=""/>}
            </>
        })}
        </div>

    </section>
}

export default HowItWorkSection