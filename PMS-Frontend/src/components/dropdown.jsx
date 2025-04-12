import { useState } from "react";
import { cn } from "../utils/utils"
import { sizeStyles, iconSize } from "./sizeConfig";

const Dropdown = ({
  label,
  iconPath,
  items,
  size="md",
  className,
  onClick,
}) => {

  const [isOpen, setIsOpen] = useState(false);
  
  return <div className={`${className} box-border`}>
    <button 
      className={cn(
        "w-full cursor-pointer rounded-lg font-medium transition-colors duration-200",
        {/*variantStyles[variant]*/},
        sizeStyles[size],
      )}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    >
    <span className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3"
          onClick={onClick}
        >
        {<img className={cn(iconSize[size])} src={iconPath}/>}
        {label}
        </div>
        <img className="h-3" src={isOpen && items.length > 0  ?  '/up-arrow.png' : "/down.png"} alt="" />
    </span>
    </button>
    {items.length > 0 && isOpen && <div className="rounded-b-lg bg-gray-50 overflow-x-hidden overflow-y-auto max-h-64 flex flex-col p-2">
      {items.map((item, i) => {
        return <button
        className="whitespace-nowrap text-start px-4 py-2 cursor-pointer hover:bg-gray-100" 
          key={i}
          onClick={item.click}
        >
        {item.title}
        </button>
      })}
    </div>}

  </div>

}

export default Dropdown