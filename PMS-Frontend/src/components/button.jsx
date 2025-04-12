import { sizeStyles, iconSize } from "./sizeConfig"
import { cn } from "../utils/utils"

const Button = ({
    label,
    size="md",
    iconPath,
    onClick,
    className
}) => {

    return <button className={cn(
            "w-full cursor-pointer rounded-lg font-medium transition-colors duration-200",
            sizeStyles[size],
            className
          )}>
        <span className="flex items-center gap-3">
            {<img className={cn(iconSize[size])} src={iconPath}/>}
            {label}
        </span>
        </button>
}

export default Button