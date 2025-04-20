import { cn } from "../utils/utils"

const Card = ({
    label,
    value,
    iconPath,
    className,
    ...rest
}) => {
    return <div className={cn(
            className,
            "shadow-md px-4 py-6 rounded-lg flex justify-between border border-gray-100"
            )}
            {...rest}
            >
            <div>
                <h3 className="text-gray-400">{label}</h3>
                <h1 className="text-3xl font-bold">{value}</h1>
            </div>
            <img className="h-12" src={iconPath} alt="" />
        </div>
}

export default Card