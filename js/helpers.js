// Helper Functions

function processEvent(event) {
    let message = event.text;
    
    if (event.moneyChange) {
        gameState.money += event.moneyChange;
    }
    
    if (event.healthChange) {
        family.forEach(m => {
            m.health = Math.max(0, Math.min(10, m.health + event.healthChange));
        });
    }
    
    if (event.happinessChange) {
        family.forEach(m => {
            m.happiness = Math.max(0, Math.min(10, m.happiness + event.happinessChange));
        });
    }
    
    if (event.educationChange) {
        const students = family.filter(m => m.age < 25);
        if (students.length > 0) {
            const lucky = students[Math.floor(Math.random() * students.length)];
            lucky.education = Math.min(15, lucky.education + event.educationChange);
            if (event.educationChange > 0) {
                message += ` ${lucky.name.split('(')[0].trim()} benefited!`;
            }
        }
    }

    if (event.text.includes('Hurricane')) {
        if (!gameState.achievements.includes('survived_hurricane')) {
            gameState.achievements.push('survived_hurricane');
            setTimeout(() => {
                showAchievement({ 
                    id: 'survived_hurricane', 
                    name: 'Storm Survivor', 
                    description: 'Survived a hurricane',
                    icon: '🌪️'
                });
            }, 1000);
        }
    }
    
    const title = event.type === 'good' ? '🎉 Good News!' : event.type === 'bad' ? '⚠️ Challenge!' : 'Season Update';
    showModal(title, message);
}

function checkPositiveEvent() {
    if (Math.random() > 0.3) return false;

    const eligible = positiveEvents.filter(event => {
        if (event.targetMember !== undefined) {
            const member = family[event.targetMember];
            return !event.condition || event.condition(member);
        }
        return true;
    });

    if (eligible.length === 0) return false;

    const event = eligible[Math.floor(Math.random() * eligible.length)];
    processPositiveEvent(event);
    return true;
}

function processPositiveEvent(event) {
    let message = event.text;

    if (event.moneyChange) {
        gameState.money += event.moneyChange;
    }

    if (event.healthChange) {
        family.forEach(m => {
            m.health = Math.max(0, Math.min(10, m.health + event.healthChange));
        });
    }

    if (event.happinessChange) {
        if (event.targetMember !== undefined) {
            const member = family[event.targetMember];
            member.happiness = Math.min(10, member.happiness + event.happinessChange);
        } else {
            family.forEach(m => {
                m.happiness = Math.min(10, m.happiness + event.happinessChange);
            });
        }
    }

    if (event.skillBoost && event.targetMember !== undefined) {
        const member = family[event.targetMember];
        Object.entries(event.skillBoost).forEach(([skill, amount]) => {
            if (member.skills[skill] !== undefined) {
                member.skills[skill] = Math.min(10, member.skills[skill] + amount);
            }
        });
    }

    if (event.message) {
        message += ' ' + event.message;
    }

    showModal('✨ Good Fortune!', message);
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.check()) {
            gameState.achievements.push(achievement.id);
            showAchievement(achievement);
        }
    });
}

function growSkills() {
    family.forEach(member => {
        if (!member.action) return;

        if (member.action.type === 'work') {
            const job = jobs.find(j => j.id === member.action.id);
            const intensity = member.action.intensity || 'normal';
            let growthRate = intensity === 'easy' ? 0.3 : intensity === 'hard' ? 0.7 : 0.5;
            
            if (job) {
                if ((job.id === 'construction' || job.id === 'farm_work') && member.skills.construction !== undefined) {
                    member.skills.construction = Math.min(10, member.skills.construction + growthRate);
                }
                if ((job.id === 'mechanic' || job.id === 'mechanic_assistant') && member.skills.mechanic !== undefined) {
                    member.skills.mechanic = Math.min(10, member.skills.mechanic + (job.id === 'mechanic' ? growthRate * 1.5 : growthRate));
                }
                if ((job.id === 'market_vendor' || job.id === 'stall_owner') && member.skills.business !== undefined) {
                    member.skills.business = Math.min(10, member.skills.business + growthRate);
                }
                if (job.id === 'teacher' && member.skills.teaching !== undefined) {
                    member.skills.teaching = Math.min(10, member.skills.teaching + growthRate * 1.5);
                }
                if (job.id === 'secretary' && member.skills.leadership !== undefined) {
                    member.skills.leadership = Math.min(10, member.skills.leadership + growthRate * 0.5);
                }
                if (member.skills.streetSmart !== undefined) {
                    member.skills.streetSmart = Math.min(10, member.skills.streetSmart + growthRate * 0.2);
                }
            }
        } else if (member.action.type === 'school') {
            const intensity = member.action.intensity || 'normal';
            let growthRate = intensity === 'easy' ? 0.2 : intensity === 'hard' ? 0.5 : 0.3;
            
            if (member.skills.reading !== undefined) {
                member.skills.reading = Math.min(10, member.skills.reading + growthRate);
            }
            if (member.skills.english !== undefined) {
                member.skills.english = Math.min(10, member.skills.english + growthRate);
            }
            if (member.skills.technology !== undefined) {
                member.skills.technology = Math.min(10, member.skills.technology + growthRate * 0.5);
            }
            if (member.skills.teaching !== undefined && member.age >= 14) {
                member.skills.teaching = Math.min(10, member.skills.teaching + growthRate * 0.3);
            }
        } else if (member.action.type === 'rest') {
            if (member.skills.soccer !== undefined && Math.random() < 0.4) {
                member.skills.soccer = Math.min(10, member.skills.soccer + 0.3);
            }
            if (member.skills.creativity !== undefined && Math.random() < 0.4) {
                member.skills.creativity = Math.min(10, member.skills.creativity + 0.3);
            }
            if (member.skills.cooking !== undefined && Math.random() < 0.3) {
                member.skills.cooking = Math.min(10, member.skills.cooking + 0.2);
            }
        } else if (member.action.type === 'volunteer') {
            if (member.skills.leadership !== undefined) {
                member.skills.leadership = Math.min(10, member.skills.leadership + 0.4);
            }
        }
        
        checkSkillMilestones(member);
    });
}

function checkSkillMilestones(member) {
    if (member.id === 3 && member.skills.mechanic >= 5 && !member.storyMilestones.includes('mechanic_skilled')) {
        member.storyMilestones.push('mechanic_skilled');
        showModal('🔧 Skilled Mechanic!', `Miguel has become a skilled mechanic! His mechanic skill reached level 5. He can now earn more as a full mechanic instead of just an assistant!`);
    }
    
    if (member.id === 2 && member.skills.teaching >= 5 && !member.storyMilestones.includes('teacher_ready')) {
        member.storyMilestones.push('teacher_ready');
        showModal('👩‍🏫 Born Teacher!', `Sofía's teaching skill reached level 5! She's ready to become a professional teacher and inspire others.`);
    }
    
    if (member.id === 4 && member.skills.reading >= 7 && member.skills.technology >= 5 && !member.storyMilestones.includes('child_prodigy')) {
        member.storyMilestones.push('child_prodigy');
        showModal('✨ Child Prodigy!', `Ana has shown exceptional talent! Her reading (${member.skills.reading}) and technology (${member.skills.technology}) skills are remarkably high for her age.`);
    }
    
    if (member.id === 0 && member.skills.business >= 5 && !member.storyMilestones.includes('business_ready')) {
        member.storyMilestones.push('business_ready');
        showModal('💼 Business Minded!', `Carlos has developed strong business skills (level 5)! He's ready to run his own market stall or small business.`);
    }
    
    if (member.id === 1 && member.skills.leadership >= 5 && !member.storyMilestones.includes('community_leader')) {
        member.storyMilestones.push('community_leader');
        showModal('🌟 Community Leader!', `María's leadership skill reached level 5! She's becoming a voice for the community.`);
    }
}

function processRelationships() {
    if (Math.random() < 0.2) {
        if (family[2].action?.type === 'school' && family[4].action?.type === 'school') {
            family[2].skills.teaching = Math.min(10, (family[2].skills.teaching || 0) + 0.5);
            family[4].education = Math.min(15, family[4].education + 0.5);
            family[2].happiness = Math.min(10, family[2].happiness + 1);
            family[4].happiness = Math.min(10, family[4].happiness + 1);
            family[2].relationships[4] = Math.min(10, family[2].relationships[4] + 0.5);
            family[4].relationships[2] = Math.min(10, family[4].relationships[2] + 0.5);
            
            showModal('💕 Sisterly Bond', 'Sofía helped Ana with her homework. Both girls are closer now and Ana learned more!');
        }
    }

    if (Math.random() < 0.15 && (gameState.money < 200 || family.some(m => m.health < 4))) {
        family[0].happiness = Math.max(0, family[0].happiness - 1);
        family[1].happiness = Math.max(0, family[1].happiness - 1);
        family[0].relationships[1] = Math.max(0, family[0].relationships[1] - 0.5);
        family[1].relationships[0] = Math.max(0, family[1].relationships[0] - 0.5);
        
        showModal('😔 Family Tension', 'Carlos and María argued about money and the family\'s future. The stress is taking its toll.');
    }

    if (gameState.livingCondition === 'good' && Math.random() < 0.2) {
        family.forEach(m => {
            m.happiness = Math.min(10, m.happiness + 1);
            Object.keys(m.relationships).forEach(key => {
                m.relationships[key] = Math.min(10, m.relationships[key] + 0.3);
            });
        });
        showModal('💝 Family Dinner', 'The family shared a wonderful meal together. Everyone\'s spirits are lifted!');
    }
}

// Character Dialogue System
function checkForDialogue() {
    if (Math.random() > 0.4) return false;

    const eligibleDialogues = characterDialogues.filter(dialogue => {
        if (dialogue.character === null) {
            return dialogue.condition();
        } else {
            const member = family[dialogue.character];
            return dialogue.condition(member);
        }
    });

    if (eligibleDialogues.length === 0) return false;

    const dialogue = eligibleDialogues[Math.floor(Math.random() * eligibleDialogues.length)];
    showDialogue(dialogue);
    return true;
}

function showDialogue(dialogue) {
    const modal = document.getElementById('modal');
    modal.classList.add('dialogue-modal');
    
    let characterName = 'The Family';
    let characterEmoji = '👨‍👩‍👧‍👦';
    
    if (dialogue.character !== null) {
        const member = family[dialogue.character];
        characterName = member.name;
        characterEmoji = member.emoji;
    }

    const modalContent = `
        <div class="dialogue-header">
            <div class="dialogue-avatar">${characterEmoji}</div>
            <div class="dialogue-info">
                <div class="dialogue-name">${characterName}</div>
                <div class="dialogue-emotion">${dialogue.emoji} wants to talk...</div>
            </div>
        </div>
        <div class="speech-bubble">
            ${dialogue.dialogue}
        </div>
        <div class="choice-buttons">
            ${dialogue.choices.map((choice, index) => `
                <button class="choice-btn" onclick="handleDialogueChoice(${JSON.stringify(choice.effect).replace(/"/g, '&quot;')}, '${choice.effect.message}', ${dialogue.character})">
                    ${choice.text}
                </button>
            `).join('')}
        </div>
    `;

    document.getElementById('modalTitle').textContent = '💬 Family Conversation';
    document.getElementById('modalBody').innerHTML = modalContent;
    modal.style.display = 'flex';
}

function handleDialogueChoice(effect, message, characterIndex) {
    closeModal();

    if (effect.moneyChange) {
        gameState.money += effect.moneyChange;
    }

    if (characterIndex !== null && characterIndex !== undefined) {
        const member = family[characterIndex];
        
        if (effect.happinessChange) {
            member.happiness = Math.max(0, Math.min(10, member.happiness + effect.happinessChange));
        }
        if (effect.healthChange) {
            member.health = Math.max(0, Math.min(10, member.health + effect.healthChange));
        }
        if (effect.educationChange) {
            member.education = Math.min(15, member.education + effect.educationChange);
        }
        if (effect.forceRest) {
            member.action = { type: 'rest' };
        }
    }

    if (effect.happinessChangeAll) {
        family.forEach(m => {
            m.happiness = Math.max(0, Math.min(10, m.happiness + effect.happinessChangeAll));
        });
    }
    if (effect.healthChangeAll) {
        family.forEach(m => {
            m.health = Math.max(0, Math.min(10, m.health + effect.healthChangeAll));
        });
    }
    if (effect.forceRestAll) {
        family.forEach(m => {
            m.action = { type: 'rest' };
        });
    }

    setTimeout(() => {
        showModal('Result', message);
        renderFamily();
        updateStats();
    }, 300);
}
