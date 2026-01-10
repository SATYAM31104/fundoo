import React, { createContext, useState, useContext, useEffect } from 'react';
import { getLabels as fetchAllLabels } from '../services/api';

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
    const [labels, setLabels] = useState([]);
    const [isLabelModalOpen, setLabelModalOpen] = useState(false);

    const refreshLabels = async () => {
        try {
            const response = await fetchAllLabels();
            if (response.data.success) {
                setLabels(response.data.labels);
            }
        } catch (err) {
            console.error("Failed to refresh labels", err);
        }
    };

    useEffect(() => {
        refreshLabels();
    }, []);

    return (
        <LabelContext.Provider value={{ labels, refreshLabels, isLabelModalOpen, setLabelModalOpen }}>
            {children}
        </LabelContext.Provider>
    );
};

export const useLabels = () => useContext(LabelContext);
