import React from 'react';

const CorrectedText = ({ response }) => {
    return (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>Corrected Text:</h3>
            <p>{response.result ? response.result.text : 'No corrections needed.'}</p>
        </div>
    );
};

export default CorrectedText;
