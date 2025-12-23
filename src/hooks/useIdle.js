import { useEffect, useRef } from 'react';

export const useIdle = (timeoutMs, onIdle) => {
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(onIdle, timeoutMs);
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

        const handleActivity = () => resetTimeout();

        events.forEach(event => window.addEventListener(event, handleActivity));

        resetTimeout(); // Start timer

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [timeoutMs, onIdle]);
};
