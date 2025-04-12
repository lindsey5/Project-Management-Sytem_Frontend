
const Input = ({
    label, 
    type="text", 
    className, 
    ...rest}) => {
    return <div className="my-4">
        <p className="text-gray-400">{label}</p>
        <input 
            className={`outline-none text-lg border-2 border-gray-300 rounded-md py-1 px-2 ${className}`}
            type={type} 
            {...rest} 
        />
    </div>
}

export default Input