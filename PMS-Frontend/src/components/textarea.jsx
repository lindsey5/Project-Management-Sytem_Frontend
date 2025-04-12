import { cn } from "../utils/utils"

const TextArea = ({
    label,
    className,
    ...rest
}) => {
    return <div>
        <p className="text-gray-400">{label}</p>
        <textarea
            className={cn("outline-none text-lg border-2 border-gray-300 rounded-md py-1 px-2",
            className)}
            {...rest}
        ></textarea>
    </div>
}

export default TextArea