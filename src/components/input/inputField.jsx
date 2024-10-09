import React from "react";

const InputField = React.memo(
    ({ label, type, value, onChange, name, placeholder, style }) => {
        return (
            <div className="formControl">
                <label htmlFor={name} style={style}>{label}:</label>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    placeholder={placeholder}
                    style={style}
                />
            </div>
        );
    }
)

export default InputField;