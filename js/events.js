// Standard Events
const events = [
    { 
        text: "Hurricane Eta approaches! Emergency supplies needed.", 
        type: 'bad', 
        moneyChange: -800, 
        healthChange: -4,
        happinessChange: -3 
    },
    { 
        text: "Dengue fever outbreak in the community. Medical costs rise.", 
        type: 'bad', 
        moneyChange: -600, 
        healthChange: -5 
    },
    { 
        text: "Gang violence increases. Extra security needed.", 
        type: 'bad', 
        moneyChange: -400, 
        happinessChange: -3 
    },
    { 
        text: "Coffee harvest brings extra work!", 
        type: 'good', 
        moneyChange: 500 
    },
    { 
        text: "NGO provides free health clinic!", 
        type: 'good', 
        healthChange: 3 
    },
    { 
        text: "Scholarship opportunity for one student!", 
        type: 'good', 
        educationChange: 2 
    },
    { 
        text: "Political protests disrupt work and school.", 
        type: 'bad', 
        moneyChange: -300, 
        educationChange: -1 
    },
    { 
        text: "Power outages last for days.", 
        type: 'bad', 
        healthChange: -2, 
        educationChange: -1,
        happinessChange: -2 
    },
    { 
        text: "Community fundraiser for school supplies!", 
        type: 'good', 
        moneyChange: 250 
    },
    { 
        text: "Someone gifts you food supplies!", 
        type: 'good', 
        moneyChange: 200,
        happinessChange: 1 
    },
    { 
        text: "A family member contracts chikungunya.", 
        type: 'bad', 
        healthChange: -6,
        moneyChange: -500 
    },
    { 
        text: "Robbery! Thieves break in during the night.", 
        type: 'bad',
        moneyChange: -400,
        happinessChange: -2
    },
    { 
        text: "Peaceful season - no major problems!", 
        type: 'neutral' 
    }
];

// Positive Encounter Events
const positiveEvents = [
    {
        text: "A tourist asks Carlos for directions and tips him generously!",
        type: 'joy',
        targetMember: 0,
        moneyChange: 150,
        happinessChange: 2
    },
    {
        text: "Miguel's soccer team wins the regional tournament! He's offered a sports scholarship!",
        type: 'joy',
        targetMember: 3,
        condition: (m) => m.skills.soccer >= 3,
        moneyChange: 300,
        happinessChange: 3,
        skillBoost: { soccer: 1 }
    },
    {
        text: "Ana's artwork wins the school competition! She receives a prize!",
        type: 'joy',
        targetMember: 4,
        condition: (m) => m.skills.creativity >= 3,
        moneyChange: 200,
        happinessChange: 3,
        skillBoost: { creativity: 1 }
    },
    {
        text: "María makes a friend at work who tells her about a better-paying position!",
        type: 'joy',
        targetMember: 1,
        condition: (m) => m.action?.type === 'work',
        happinessChange: 2,
        message: "New job opportunity unlocked next season!"
    },
    {
        text: "The family finds 150 Lempiras hidden in an old coat!",
        type: 'joy',
        moneyChange: 150,
        happinessChange: 1
    },
    {
        text: "Sofía tutors a neighbor's child and is paid for her help!",
        type: 'joy',
        targetMember: 2,
        condition: (m) => m.skills.teaching >= 2,
        moneyChange: 100,
        happinessChange: 2,
        skillBoost: { teaching: 1 }
    },
    {
        text: "Don Julio offers to teach Miguel advanced mechanics for free!",
        type: 'joy',
        targetMember: 3,
        condition: (m) => m.skills.mechanic >= 2,
        happinessChange: 3,
        skillBoost: { mechanic: 2 },
        message: "Miguel is learning fast!"
    },
    {
        text: "A kind neighbor gifts the family fresh vegetables from their garden!",
        type: 'joy',
        moneyChange: 80,
        healthChange: 1,
        happinessChange: 2
    },
    {
        text: "Carlos fixes a wealthy person's car and receives a generous tip!",
        type: 'joy',
        targetMember: 0,
        condition: (m) => m.skills.construction >= 3,
        moneyChange: 250,
        happinessChange: 2
    },
    {
        text: "The church organizes a free community meal - everyone's spirits lift!",
        type: 'joy',
        happinessChange: 2,
        message: "The community comes together in solidarity."
    }
];

// Character Dialogues
const characterDialogues = [
    // Carlos (Father) dialogues
    {
        character: 0,
        condition: (member) => member.health < 5,
        dialogue: "Papá, I'm so tired... My back hurts from all the work, but we need the money. Should I keep pushing through?",
        emoji: "😰",
        choices: [
            { 
                text: "Rest this season, your health matters", 
                effect: { forceRest: true, happinessChange: 2, message: "Carlos appreciates your concern for his wellbeing" }
            },
            { 
                text: "The family needs you to keep working", 
                effect: { happinessChange: -2, message: "Carlos looks defeated but nods" }
            }
        ]
    },
    {
        character: 0,
        condition: (member) => member.happiness < 3 && gameState.money < 500,
        dialogue: "I feel like I'm failing you all. No matter how hard I work, we're barely getting by. What kind of father can't provide?",
        emoji: "😔",
        choices: [
            { 
                text: "You're doing your best, we'll get through this together", 
                effect: { happinessChange: 2, message: "Carlos feels encouraged and motivated" }
            },
            { 
                text: "We need you to work harder", 
                effect: { happinessChange: -3, healthChange: -1, message: "Carlos looks crushed by the pressure" }
            }
        ]
    },
    {
        character: 0,
        condition: (member) => gameState.money > 1000 && !gameState.community.marketStall.built,
        dialogue: "I've been thinking... If we could buy that market stall, I could run a steady business. It's my dream to be my own boss. What do you think?",
        emoji: "💭",
        choices: [
            { 
                text: "Let's save up and buy it! (Save for stall)", 
                effect: { happinessChange: 3, message: "Carlos is excited about the future!" }
            },
            { 
                text: "It's too risky right now", 
                effect: { happinessChange: -1, message: "Carlos understands but looks disappointed" }
            }
        ]
    },

    // María (Mother) dialogues
    {
        character: 1,
        condition: (member) => family.filter(m => m.education < 5 && m.age < 18).length > 1,
        dialogue: "I worry about our children's education every day. I never got to finish school... I don't want that for them. Can we prioritize their schooling?",
        emoji: "😢",
        choices: [
            { 
                text: "You're right, education is their future", 
                effect: { happinessChange: 3, message: "María smiles with hope in her eyes" }
            },
            { 
                text: "We need them working to survive", 
                effect: { happinessChange: -3, message: "María's heart breaks a little" }
            }
        ]
    },
    {
        character: 1,
        condition: (member) => member.education >= 8 && !member.action,
        dialogue: "You know... I've been studying so much. I think I could work as a secretary now! It would mean better pay for our family.",
        emoji: "😊",
        choices: [
            { 
                text: "I'm so proud of you! Go for it!", 
                effect: { happinessChange: 3, message: "María beams with pride and confidence" }
            },
            { 
                text: "Let's think about it more", 
                effect: { happinessChange: -1, message: "María nods but looks uncertain" }
            }
        ]
    },
    {
        character: 1,
        condition: (member) => family.filter(m => m.health < 5).length >= 2,
        dialogue: "Everyone is getting sick... Maybe our living conditions are too poor? I'm scared someone will get really ill. Should we improve how we live?",
        emoji: "😰",
        choices: [
            { 
                text: "You're right, let's improve our living conditions", 
                effect: { happinessChange: 2, message: "María feels relieved you're listening" }
            },
            { 
                text: "We can't afford it right now", 
                effect: { happinessChange: -1, message: "María worries quietly" }
            }
        ]
    },

    // Sofía (16) dialogues
    {
        character: 2,
        condition: (member) => member.education >= 10 && member.happiness > 6,
        dialogue: "Mamá, Papá... I got the highest grades in my class! My teacher says I could become a teacher myself one day. That's my dream!",
        emoji: "🤩",
        choices: [
            { 
                text: "We're so proud! Keep studying!", 
                effect: { happinessChange: 3, educationChange: 1, message: "Sofía is glowing with motivation!" }
            },
            { 
                text: "That's nice, but focus on practical work", 
                effect: { happinessChange: -3, message: "Sofía's smile fades" }
            }
        ]
    },
    {
        character: 2,
        condition: (member) => member.action?.type === 'work' && member.age === 16,
        dialogue: "I see my friends going to school while I work... I know we need money, but I'm scared I'll never achieve my dreams if I don't get educated.",
        emoji: "😢",
        choices: [
            { 
                text: "Next season, we'll prioritize your education", 
                effect: { happinessChange: 2, message: "Sofía hugs you tightly, hope in her eyes" }
            },
            { 
                text: "Your work helps feed the family", 
                effect: { happinessChange: -2, message: "Sofía quietly accepts her fate" }
            }
        ]
    },
    {
        character: 2,
        condition: (member) => member.health < 4 && member.action?.type === 'work',
        dialogue: "I'm exhausted... The work at the market is so hard, and I'm not feeling well. Can I please rest?",
        emoji: "😰",
        choices: [
            { 
                text: "Of course, your health comes first", 
                effect: { forceRest: true, happinessChange: 2, message: "Sofía looks relieved and grateful" }
            },
            { 
                text: "Push through, we need the income", 
                effect: { happinessChange: -2, healthChange: -1, message: "Sofía fights back tears" }
            }
        ]
    },

    // Miguel (14) dialogues
    {
        character: 3,
        condition: (member) => member.age === 14 && member.action?.type === 'work',
        dialogue: "I'm working now! I feel like a grown-up helping the family. But... sometimes I miss just being a kid. Is it okay if I feel this way?",
        emoji: "😕",
        choices: [
            { 
                text: "You're still a kid, it's okay to miss playtime", 
                effect: { happinessChange: 2, message: "Miguel smiles, relieved you understand" }
            },
            { 
                text: "You need to grow up fast in this world", 
                effect: { happinessChange: -2, message: "Miguel's childhood fades a bit more" }
            }
        ]
    },
    {
        character: 3,
        condition: (member) => member.education >= 6 && gameState.items.bike,
        dialogue: "I've been watching Don Julio fix motorcycles! If I could learn mechanics, I could earn good money and do something I love. Can I train?",
        emoji: "😃",
        choices: [
            { 
                text: "Yes! Follow your passion for mechanics!", 
                effect: { happinessChange: 3, message: "Miguel is thrilled and motivated!" }
            },
            { 
                text: "Focus on general education instead", 
                effect: { happinessChange: -1, message: "Miguel is disappointed but obeys" }
            }
        ]
    },
    {
        character: 3,
        condition: (member) => member.happiness < 4,
        dialogue: "All I do is work or study... I never get to play fútbol with my friends anymore. I miss being happy.",
        emoji: "😞",
        choices: [
            { 
                text: "Let's make sure you have more free time", 
                effect: { happinessChange: 3, message: "Miguel's face lights up!" }
            },
            { 
                text: "Life is hard, you'll understand when you're older", 
                effect: { happinessChange: -1, message: "Miguel looks down at the ground" }
            }
        ]
    },

    // Ana (10) dialogues
    {
        character: 4,
        condition: (member) => member.education >= 6 && member.happiness > 5,
        dialogue: "Teacher said I'm the smartest in my class! She says if I keep studying, I could go to university! Can I really go to university one day?",
        emoji: "✨",
        choices: [
            { 
                text: "Yes mija, we'll do everything to make it happen!", 
                effect: { happinessChange: 3, educationChange: 1, message: "Ana bounces with joy and determination!" }
            },
            { 
                text: "University is very expensive, don't get your hopes up", 
                effect: { happinessChange: -3, message: "Ana's dreams are crushed" }
            }
        ]
    },
    {
        character: 4,
        condition: (member) => !gameState.items.toys && member.happiness < 5,
        dialogue: "All my friends have toys to play with... I know we don't have money, but can we get something? Even something small?",
        emoji: "🥺",
        choices: [
            { 
                text: "We'll save up for toys, I promise", 
                effect: { happinessChange: 2, message: "Ana hugs you and says 'Thank you!'" }
            },
            { 
                text: "Toys are a luxury we can't afford", 
                effect: { happinessChange: -2, message: "Ana tries not to cry" }
            }
        ]
    },
    {
        character: 4,
        condition: (member) => family.filter(m => m.action?.type === 'school').length === 0 && member.age === 10,
        dialogue: "Why is nobody going to school anymore? My teacher says education is important... Are we going to be okay?",
        emoji: "😰",
        choices: [
            { 
                text: "You're right, education matters. We'll send people to school", 
                effect: { happinessChange: 2, message: "Ana feels reassured" }
            },
            { 
                text: "We have to focus on surviving right now", 
                effect: { happinessChange: -1, message: "Ana looks confused and scared" }
            }
        ]
    },

    // Multiple family member scenarios
    {
        character: null,
        condition: () => gameState.diplomas >= 1 && gameState.money > 800,
        dialogue: "The whole family is celebrating! Someone earned a diploma! Should we have a small celebration?",
        emoji: "🎉",
        choices: [
            { 
                text: "Yes! Let's celebrate this achievement! (-150 L)", 
                effect: { moneyChange: -150, happinessChangeAll: 2, message: "The whole family feels joy and pride!" }
            },
            { 
                text: "We should save the money", 
                effect: { happinessChangeAll: -1, message: "The celebration is bittersweet" }
            }
        ]
    },
    {
        character: null,
        condition: () => gameState.livingCondition === 'poor' && family.every(m => m.health < 6),
        dialogue: "Everyone is sick and weak. The family looks at you, waiting for guidance. What should we do?",
        emoji: "😷",
        choices: [
            { 
                text: "Everyone rest this season, no work", 
                effect: { forceRestAll: true, happinessChangeAll: 1, message: "The family recovers together" }
            },
            { 
                text: "Push through, we need to survive", 
                effect: { healthChangeAll: -1, happinessChangeAll: -1, message: "The family struggles on" }
            }
        ]
    }
];
