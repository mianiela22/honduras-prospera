# Quick Reference Guide - Honduras Game Code Structure

## 📁 Project Files Overview

### Main Entry Point
- **index.html** - Clean HTML that imports all modules

### Styling
- **css/styles.css** - All CSS (600+ lines of styling and animations)

### JavaScript Modules

#### 1. **js/data.js** - Game Data & Constants
Contains:
- `gameState` - Current game progress
- `family` - Family member definitions
- `jobs`, `schools`, `healthCare`, `shopItems`, `livingConditions` - Game options
- `achievements` - Achievement definitions

#### 2. **js/events.js** - Events & Dialogues
Contains:
- `events` - Random events (good/bad)
- `positiveEvents` - Beneficial events with conditions
- `characterDialogues` - Family member conversations with choices

#### 3. **js/ui.js** - UI Rendering Functions
Main functions:
- `renderFamily()` - Display family members
- `renderActions()` - Display action options
- `renderHealthcare()` - Display healthcare options
- `renderShop()` - Display shop items
- `renderLiving()` - Display living conditions
- `renderCommunity()` - Display community projects
- `updateStats()` - Update game stats display

#### 4. **js/game.js** - Core Game Logic
Main functions:
- `selectGoal()` - Choose game goal
- `startGame()` - Initialize game
- `assignAction()` - Assign action to family member
- `showIntensityModal()` - Show work/study intensity options
- `advanceSeason()` - Main game loop
- `repeatLastSeason()` - Repeat previous actions
- `endGame()` - End game and show results

#### 5. **js/helpers.js** - Utility Functions
Main functions:
- `processEvent()` - Handle random events
- `checkPositiveEvent()` - Check for positive events
- `checkAchievements()` - Check achievement conditions
- `growSkills()` - Update family member skills
- `processRelationships()` - Handle family relationships
- `checkForDialogue()` - Check for dialogue events
- `handleDialogueChoice()` - Process dialogue choices

## 🔄 Data Flow Example

**When advancing a season:**

1. User clicks "Advance to Next Season"
2. `advanceSeason()` in **game.js** is called
3. For each family member:
   - Calculate income/education from `jobs`/`schools` in **data.js**
   - Apply skill growth via `growSkills()` in **helpers.js**
4. Process events:
   - `checkForDialogue()` → `showDialogue()` (uses **events.js**)
   - `checkPositiveEvent()` → `processPositiveEvent()` (uses **events.js**)
5. Update display via functions in **ui.js**

## 📝 How to Make Changes

### Add a new job?
```javascript
// In js/data.js, add to jobs array:
{ id: 'new_job', name: 'Job Name', pay: 100, education: 2, ... }
```

### Change a color?
```css
/* In css/styles.css, find the class and change the color */
.season-header {
    background: linear-gradient(135deg, #0073cf 0%, #00a8e8 100%);
    /* Change these hex codes */
}
```

### Add a new event?
```javascript
// In js/events.js, add to events array:
{
    text: "Event description",
    type: 'good',
    moneyChange: 500,
    ...
}
```

### Add a new character dialogue?
```javascript
// In js/events.js, add to characterDialogues array:
{
    character: 0,  // Carlos (id = 0)
    condition: (member) => member.health < 5,
    dialogue: "What the character says",
    emoji: "😢",
    choices: [
        { text: "Your response", effect: { ... } },
        ...
    ]
}
```

### Change game mechanics?
```javascript
// In js/game.js, modify the advanceSeason() function
// or modify helper functions in js/helpers.js
```

## 🎮 Game Flow

```
index.html (loads all files)
    ↓
startGame() [game.js]
    ↓
renderFamily() [ui.js]
    ↓
assignAction() [game.js] → showIntensityModal() [game.js]
    ↓
advanceSeason() [game.js]
    ├─ Process work/school/volunteer actions
    ├─ growSkills() [helpers.js]
    ├─ processRelationships() [helpers.js]
    ├─ checkForDialogue() [helpers.js]
    ├─ checkPositiveEvent() [helpers.js]
    ├─ processEvent() [helpers.js]
    ├─ checkAchievements() [helpers.js]
    └─ Update display [ui.js]
    ↓
endGame() [game.js]
```

## 🔧 Common Tasks

| Task | File | Function |
|------|------|----------|
| Add new job option | js/data.js | `jobs` array |
| Change difficulty | js/game.js | `advanceSeason()` |
| Add new skill | js/data.js | `family[x].skills` |
| Modify UI styling | css/styles.css | CSS classes |
| Add new event | js/events.js | `events` array |
| Add dialogue | js/events.js | `characterDialogues` array |
| Change game balance | js/game.js | Various constants |
| Fix achievements | js/data.js | `achievements` array |

## 💡 Key Design Decisions

1. **Single State Object** - `gameState` holds all game progress
2. **Immutable Constants** - Game data (jobs, schools, etc.) never change
3. **Separate Concerns** - Each file has one responsibility
4. **Functional Rendering** - All `render*()` functions are pure
5. **Event-Driven** - Dialogue and events use condition functions

## 🚀 To Extend

Want to add more features?

1. **New mechanics** → Add to `js/game.js`
2. **New UI** → Add rendering function to `js/ui.js`
3. **New data** → Add to `js/data.js`
4. **New events** → Add to `js/events.js`
5. **New helpers** → Add to `js/helpers.js`

The modular structure makes it easy to:
- Add features without touching unrelated code
- Find and fix bugs quickly
- Test individual components
- Reuse code in other projects
