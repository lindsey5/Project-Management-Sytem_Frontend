import { sizeStyles, iconSize } from "./config"
import { cn } from "../utils/utils"

const Button = ({
    label,
    size="md",
    iconPath,
    className,
    ...rest
}) => {

    return <button className={cn(
            "w-full cursor-pointer rounded-lg",
            sizeStyles[size],
            className,
          )}
          {...rest}
          >
        <span className="flex items-center gap-3">
            {<img className={cn(iconSize[size])} src={iconPath}/>}
            {label}
        </span>
        </button>
}

export default Button