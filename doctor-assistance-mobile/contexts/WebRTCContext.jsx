import React, { createContext, useContext, useState } from "react";
import useWebRTC from "@/hooks/useWebRTC";

const WebRTCContext = createContext(null);

export const WebRTCProvider = ({ children }) => {
    const webRTC = useWebRTC();

    return (
        <WebRTCContext.Provider value={webRTC}>
            {children}
        </WebRTCContext.Provider>
    );
};

export const useWebRTCContext = () => {
    const context = useContext(WebRTCContext);
    if (!context) {
        console.error('YOu are not authorized to use this context');
    }
    return context;
};
