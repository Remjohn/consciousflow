import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export const usePunishment = () => {
    const { today, isPunished, setPunished } = useUserStore();
    const videosProduced = today.production.videos;

    useEffect(() => {
        const checkPunishment = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const isLate = hours >= 23 && minutes >= 30;
            const isFailure = videosProduced < 5;

            if (isLate && isFailure && !isPunished) {
                console.log("🔴 PUNISHMENT PROTOCOL ACTIVATED");
                setPunished(true);
            }

            // Reset punishment at start of new day (after midnight, before work starts)
            if (hours >= 0 && hours < 7 && isPunished) {
                setPunished(false);
            }
        };

        // Check immediately on mount
        checkPunishment();

        // Then check every minute
        const interval = setInterval(checkPunishment, 60000);
        return () => clearInterval(interval);
    }, [videosProduced, isPunished, setPunished]);

    return { isPunished };
};
