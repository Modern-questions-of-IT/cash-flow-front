interface ButtonProps {
    text: string,
    classname: string,
    onClick?: (e: any) => void,
}

export const BlueButton = ({text, classname, onClick}: ButtonProps) => {
    return (
        <button className={`bg-blue-500 text-white rounded-lg ${classname} text-sm hover:bg-blue-600 transform duration-500 `} onClick={onClick}>
            {text}
        </button>
    )
}
