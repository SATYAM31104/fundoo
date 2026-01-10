import React from 'react';
import { motion } from 'framer-motion';

const withAnimation = (WrappedComponent) => {
    const AnimatedComponent = (props) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <WrappedComponent {...props} />
        </motion.div>
    );
    AnimatedComponent.WrappedComponent = WrappedComponent;
    return AnimatedComponent;
};

export default withAnimation;
