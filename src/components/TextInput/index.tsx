import "./index.css";

interface TextInputProps {
    label: string;
    type?: string;
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    success?: boolean;
}

const TextInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onBlur,
    error,
    success,
}: TextInputProps) => {

    const borderColor = error
        ? "border-red-500"
        : success
            ? "border-green-500"
            : "border-gray-400 focus:border-[#0F1876]";

    const labelColor = error
        ? "text-red-500"
        : success
            ? "text-green-500"
            : "";

    return (
        <div className="relative w-full max-w-[366px]">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder=" "
                className={`peer h-[37px] w-full rounded-md  border-2 ${borderColor} px-4 text-sm outline-none`}
            />

            <label className={`floating-label ${labelColor}`}>
                {label}
            </label>
        </div>
    );
};

export default TextInput;