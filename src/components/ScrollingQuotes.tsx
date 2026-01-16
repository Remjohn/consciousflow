import { useState, useEffect } from 'react';

const QUOTES = [
    '💜 Kimya a dit "Mon Papa est FORT"',
    '💪 Kimya a dit "Moi je veux que tu sois comme HULK et personne ne peut être comme toi"',
    '⚡ I work faster than my enemies - Nothing left in the tank',
    '🇮🇹 Sono un Lavoratore',
    '🔥 Ho le palle per Lavorare piu duro dei miei nemici',
    '🦁 I Do what Alpha Males do to become an Alpha Male',
    '📈 Your Performance Create Your Reality',
    '🐆 You Must Become a King Predator or you\'ll become a Pussy Gazelle',
    '💎 I DOMINATE Through Superior Strength And Capability',
    '⚠️ KIMYA is in Danger who the fuck is going to protect her TODAY??',
    '🔥 I work hard because I\'m not a fucking pussy',
    '🎯 I work like a maniac and completely ignore others',
    '⏱️ I BUY my success with FOCUSED TIME',
    '😤 I work with (why not me) RAGE and ANGER',
    '🏆 I\'m Tenacious and Dedicated to be a Winner',
    '⚡ I work harder and faster than anyone I know',
    '👊 I have the Balls to fight anyone',
    '🔥 I work way harder than my enemies with rage and anger',
    '💰 I have a burning desire of making money everyday',
    '🏋️ I train hard to beat my enemies',
    '💪 I fuck hardcore with a BIG and Strong Penis',
    '👑 I\'m the Richest man in my family',
    '😈 I make my enemies envious of my success',
    '🐺 I ATTACK THE DAY LIKE A SAVAGE BEAST',
    '🎯 I ATTACK MY GOALS LIKE A SAVAGE BEAST',
    '⏰ EVERY SECOND WASTED IS MONEY LOST',
    '🩸 I BUY MY SUCCESS WITH MY BLOOD',
    '💢 I CHANNEL MY RAGE AND BUILD WITH ANGER',
    '🥊 I PROVE DAILY THAT I HAVE THE BALLS TO FIGHT',
    '🚀 I IGNORE WEAK PEOPLE. I OUTWORK THEM',
    '⚔️ I TURN MY ANGER INTO A WEAPON',
    '☠️ DONT BE A FAILURE...',
    '🎯 NO PLEASURE ONLY RESULTS',
    '🔥 PAIN IS MY FUEL',
    '👑 CLIENTS PAY ME BECAUSE I DOMINATE AND DELIVER LIKE A KING',
    '🤖 I\'M A MACHINE AND MACHINES DO NOT MAKE EXCUSES',
    '💀 I\'M THE MOST DANGEROUS PERSON IN MY FAMILY'
];

export const ScrollingQuotes = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Change quote every 5 seconds with fade effect
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % QUOTES.length);
                setIsVisible(true);
            }, 500); // Fade out duration

        }, 5000); // 5 seconds per quote

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-gradient-to-r from-void via-steel/10 to-void py-3 border-y border-steel/20">
            <div className="flex justify-center items-center min-h-[24px] px-4">
                <span
                    className={`text-sm font-mono text-gold text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                        }`}
                >
                    {QUOTES[currentIndex]}
                </span>
            </div>
        </div>
    );
};
