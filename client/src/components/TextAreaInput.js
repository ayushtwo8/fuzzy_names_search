import React from 'react';

const TextAreaInput = ({ value, onChange }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder="Enter text here..."
            rows="5"
            cols="50"
            style={{
                width: '100%',
                marginBottom: '10px',
                padding: '10px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
            }}
        ></textarea>
    );
};

export default TextAreaInput;
