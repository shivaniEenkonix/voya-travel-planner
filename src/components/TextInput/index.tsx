import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

interface TextInputProps {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    success?: boolean;
    disabled?: boolean;
    state?: "disabled" | "error" | "success" | "default"
}

const inputThemeConfig = {
    default: {
        input: "border-gray-400 focus:border-[#0F1876]",
        status: "default",
        floatingLabel: "text-[#0F1876]",
    },

    success: {
        input: "border-green-500",
        status: "success",
        floatingLabel: "text-green-500",
    },

    error: {
        input: "border-red-500",
        status: "error",
        floatingLabel: "text-red-500",
    },
    disabled: {
        input: "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed",
        floatingLabel: "text-gray-400",
    },
};

const TextInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onBlur,
    error,
    state = "default",
    disabled = false,

}: TextInputProps) => {
    const [isFloating, setIsFloating] = useState(value !== "");
    const [isShaking, setIsShaking] = useState(false);
    const previousError = useRef<string | undefined>(undefined);

    useEffect(() => {
        // Trigger only when a NEW error appears
        if (error && error !== previousError.current) {

            // Shake input
            setIsShaking(true);

            // Vibrate device
            if ("vibrate" in navigator) {
                navigator.vibrate(200);
            }

            // Remove shake class after animation finishes
            const timer = setTimeout(() => {
                setIsShaking(false);
            }, 400);

            previousError.current = error;

            return () => clearTimeout(timer);
        }

        // Reset when error is removed
        if (!error) {
            previousError.current = undefined;
        }

    }, [error]);
    //select theme
    // Disabled always takes priority
    const currentState = disabled ? "disabled" : state;
    const inputTheme = inputThemeConfig[currentState];

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e);
        },
        [onChange]
    );

    const handleFocus = useCallback(() => {
        if (!disabled) {
            setIsFloating(true);
        }
    }, [disabled]);

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            // Keep label floating if input has a value
            setIsFloating(value !== "");

            // Call parent onBlur
            if (onBlur) {
                onBlur(e);
            }
        },
        [value, onBlur]
    );

    return (
        <div
            className={`w-full max-w-md ${isShaking ? "vibrate" : ""
                }`}
        >            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder=" "
                    className={`peer w-full rounded-md border-2 ${inputTheme.input} px-4 py-2 text-sm outline-none`}
                />
                <label
                    className={`
                    floating-label
                    ${isFloating
                            ? inputTheme.floatingLabel
                            : "text-[#A3A3A3] font-semibold"
                        }
                `}
                >
                    {label}
                </label>
            </div>
            {/* Error Message */}
            {error && !disabled && <p className="text-xs text-red-500">{error}</p>}        </div>
    );
};

export default React.memo(TextInput);
