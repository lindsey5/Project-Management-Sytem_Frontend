
const Input = ({label, type="text", handleInput, className, ...rest}) => {
    return <div className="my-4">
        <p className="text-gray-400">{label}</p>
        <input type={type} onChange={handleInput} {...rest} className={`outline-none w-[300px] text-lg border-2 border-gray-300 rounded-md py-1 px-2 ${className}`}/>
    </div>
}

export default Input