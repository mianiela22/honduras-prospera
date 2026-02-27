// Game State
let gameState = {
    season: 1,
    year: 1,
    money: 500,
    goal: null,
    livingCondition: 'poor',
    diplomas: 0,
    selectedMember: null,
    currentTab: 'actions',
    achievements: [],
    lastSeasonActions: {},
    items: {
        shoes: false,
        books: false,
        radio: false,
        toys: false,
        uniform: false,
        bed: false,
        plumbing: false,
        livestock: false,
        bike: false,
        computer: false
    },
    community: {
        marketStall: { built: false, progress: 0, cost: 500 },
        communityCenter: { built: false, progress: 0, required: 15 },
        library: { built: false, progress: 0, required: 20 },
        healthCenter: { built: false, progress: 0, required: 25 },
        soccerField: { built: false, progress: 0, required: 18 }
    }
};

// Family Data
const family = [
    { 
        id: 0,
        name: "Carlos (Father)", 
        age: 40, 
        health: 10, 
        education: 3, 
        happiness: 5,
        emoji: "👨",
        action: null,
        diplomas: 0,
        personality: "hardworking",
        dream: "own a small business",
        skills: {
            business: 0,
            construction: 2,
            farming: 3
        },
        relationships: { 1: 8, 2: 7, 3: 6, 4: 8 },
        storyMilestones: []
    },
    { 
        id: 1,
        name: "María (Mother)", 
        age: 38, 
        health: 10, 
        education: 4, 
        happiness: 5,
        emoji: "👩",
        action: null,
        diplomas: 0,
        personality: "nurturing",
        dream: "see her children graduate",
        skills: {
            cooking: 5,
            business: 1,
            leadership: 2
        },
        relationships: { 0: 8, 2: 9, 3: 7, 4: 10 },
        storyMilestones: []
    },
    { 
        id: 2,
        name: "Sofía (16)", 
        age: 16, 
        health: 10, 
        education: 6, 
        happiness: 5,
        emoji: "👧",
        action: null,
        diplomas: 0,
        personality: "ambitious",
        dream: "become a teacher",
        skills: {
            teaching: 0,
            english: 1,
            leadership: 1
        },
        relationships: { 0: 7, 1: 9, 3: 6, 4: 8 },
        storyMilestones: []
    },
    { 
        id: 3,
        name: "Miguel (14)", 
        age: 14, 
        health: 10, 
        education: 5, 
        happiness: 5,
        emoji: "👦",
        action: null,
        diplomas: 0,
        personality: "adventurous",
        dream: "learn to fix motorcycles",
        skills: {
            mechanic: 0,
            soccer: 2,
            streetSmart: 1
        },
        relationships: { 0: 6, 1: 7, 2: 6, 4: 7 },
        storyMilestones: []
    },
    { 
        id: 4,
        name: "Ana (10)", 
        age: 10, 
        health: 10, 
        education: 4, 
        happiness: 5,
        emoji: "👧",
        action: null,
        diplomas: 0,
        personality: "curious",
        dream: "go to university",
        skills: {
            creativity: 2,
            technology: 0,
            reading: 1
        },
        relationships: { 0: 8, 1: 10, 2: 8, 3: 7 },
        storyMilestones: []
    }
];

// Game Constants
const seasons = ['Dry Season', 'Rainy Season', 'Hurricane Season', 'Harvest Season'];

const jobs = [
    { id: 'farm_labor', name: 'Farm Labor', pay: 60, education: 0, healthCost: 3, icon: '🌾', minAge: 14 },
    { id: 'light_work', name: 'Light Farm Work', pay: 40, education: 0, healthCost: 2, icon: '🌱', minAge: 14, maxAge: 15, description: 'Light agricultural work for younger teens' },
    { id: 'construction', name: 'Construction', pay: 110, education: 2, healthCost: 4, icon: '🏗️', adultsOnly: true, requiresBike: true },
    { id: 'market_vendor', name: 'Market Vendor', pay: 100, education: 3, healthCost: 2, icon: '🛒', gender: ['María (Mother)', 'Sofía (16)'], minAge: 14 },
    { id: 'mechanic', name: 'Mechanic', pay: 150, education: 6, healthCost: 3, icon: '🔧', minAge: 16 },
    { id: 'mechanic_assistant', name: 'Mechanic Assistant', pay: 90, education: 4, healthCost: 3, icon: '🔧', minAge: 14, maxAge: 17 },
    { id: 'secretary', name: 'Secretary', pay: 180, education: 8, healthCost: 1, icon: '💼', minAge: 16 },
    { id: 'teacher', name: 'Teacher', pay: 220, education: 12, healthCost: 1, icon: '👨‍🏫', adultsOnly: true },
    { id: 'stall_owner', name: 'Market Stall Owner', pay: 280, education: 0, healthCost: 2, icon: '🏪', requiresStall: true, minAge: 16 }
];

const schools = [
    { id: 'public', name: 'Public School', cost: 50, education: 2, healthCost: 1, icon: '🏫', requiresUniform: true },
    { id: 'private', name: 'Private School', cost: 140, education: 3, healthCost: 0, icon: '🎓' },
    { id: 'vocational', name: 'Vocational Training', cost: 100, education: 3, healthCost: 1, icon: '⚙️', adults: true },
    { id: 'night_school', name: 'Night School', cost: 80, education: 2, healthCost: 2, icon: '🌙', adultsOnly: true, description: 'Study after work' }
];

const healthCare = [
    { id: 'home_remedy', name: 'Home Remedy', cost: 30, healthGain: 2, icon: '🌿', description: 'Cheap herbs and rest' },
    { id: 'clinic', name: 'Community Clinic', cost: 80, healthGain: 4, icon: '🏥', description: 'Basic medical care' },
    { id: 'hospital', name: 'Hospital', cost: 200, healthGain: 8, icon: '🏨', description: 'Full treatment' }
];

const shopItems = [
    { id: 'shoes', name: 'Shoes', price: 100, icon: '👟', benefit: '-1 work health cost' },
    { id: 'books', name: 'Books (per season)', price: 50, icon: '📚', benefit: '+1 education/season', recurring: true },
    { id: 'uniform', name: 'School Uniform', price: 35, icon: '👕', benefit: 'Required for public school' },
    { id: 'radio', name: 'Radio', price: 150, icon: '📻', benefit: '+1 happiness' },
    { id: 'toys', name: 'Toys', price: 120, icon: '🧸', benefit: '+1 happiness (children)' },
    { id: 'bike', name: 'Bicycle', price: 350, icon: '🚲', benefit: 'Unlock construction job' },
    { id: 'bed', name: 'Good Bed', price: 700, icon: '🛏️', benefit: '+2 health/season' },
    { id: 'plumbing', name: 'Indoor Plumbing', price: 800, icon: '🚰', benefit: '+3 health/season' },
    { id: 'livestock', name: 'Livestock', price: 500, icon: '🐄', benefit: '+80 L/season' },
    { id: 'computer', name: 'Computer', price: 2500, icon: '💻', benefit: '+2 education/season' }
];

const livingConditions = [
    { id: 'poor', name: 'Poor', cost: 75, healthChange: -2, happinessChange: -1 },
    { id: 'decent', name: 'Decent', cost: 125, healthChange: 0, happinessChange: 0 },
    { id: 'good', name: 'Good', cost: 175, healthChange: 1, happinessChange: 1 }
];

// Achievement System
const achievements = [
    { id: 'first_diploma', name: 'First Diploma!', description: 'A family member earned their first diploma', icon: '🎓', check: () => gameState.diplomas >= 1 },
    { id: 'all_school', name: 'Education First', description: 'All children attending school in one season', icon: '📚', check: () => family.filter(m => m.age < 18 && m.action?.type === 'school').length >= 3 },
    { id: 'survived_hurricane', name: 'Storm Survivor', description: 'Survived a hurricane', icon: '🌪️', check: () => false },
    { id: 'decent_living', name: 'Moving Up', description: 'Reached Decent living conditions', icon: '🏠', check: () => gameState.livingCondition !== 'poor' },
    { id: 'good_living', name: 'Comfortable Life', description: 'Reached Good living conditions', icon: '✨', check: () => gameState.livingCondition === 'good' },
    { id: 'first_purchase', name: 'First Investment', description: 'Bought your first item', icon: '🛒', check: () => Object.values(gameState.items).some(v => v === true) },
    { id: 'bought_bike', name: 'Got Wheels!', description: 'Purchased a bicycle', icon: '🚲', check: () => gameState.items.bike },
    { id: 'market_stall', name: 'Business Owner', description: 'Bought the market stall', icon: '🏪', check: () => gameState.community.marketStall.built },
    { id: 'library_built', name: 'Knowledge Hub', description: 'Helped build the community library', icon: '📖', check: () => gameState.community.library.built },
    { id: 'health_center', name: 'Healthcare Access', description: 'Helped build the health center', icon: '🏥', check: () => gameState.community.healthCenter.built },
    { id: 'year_1', name: 'First Year Complete', description: 'Survived the first year', icon: '⭐', check: () => gameState.year >= 2 },
    { id: 'year_2', name: 'Two Years Strong', description: 'Made it through two years', icon: '⭐⭐', check: () => gameState.year >= 3 },
    { id: 'positive_money', name: 'In The Black', description: 'Ended a season with money saved', icon: '💰', check: () => gameState.money > 800 },
    { id: 'all_healthy', name: 'Healthy Family', description: 'All family members above 7 health', icon: '❤️', check: () => family.every(m => m.health > 7) },
    { id: 'all_happy', name: 'Joyful Home', description: 'All family members above 7 happiness', icon: '😊', check: () => family.every(m => m.happiness > 7) },
    { id: 'miguel_mechanic', name: 'Master Mechanic', description: 'Miguel reached mechanic skill level 5', icon: '🔧', check: () => family[3].skills.mechanic >= 5 },
    { id: 'sofia_teacher', name: 'Born Teacher', description: 'Sofía reached teaching skill level 5', icon: '👩‍🏫', check: () => family[2].skills.teaching >= 5 },
    { id: 'ana_genius', name: 'Child Prodigy', description: 'Ana reached 12+ education before age 12', icon: '✨', check: () => family[4].education >= 12 && family[4].age < 12 }
];
