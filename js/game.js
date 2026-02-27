// Game Logic Functions

let selectedGoal = null;
let tempActionForIntensity = null;

// Start Screen Functions
function selectGoal(goal) {
    selectedGoal = goal;
    document.querySelectorAll('.goal-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    document.getElementById('startGameBtn').disabled = false;
}

function startGame() {
    gameState.goal = selectedGoal;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    const goalNames = {
        education: '📚 EDUCATION',
        money: '💰 MAKE MONEY',
        health: '❤️ STAY HEALTHY',
        happiness: '😊 HAPPINESS'
    };
    document.getElementById('goalDisplay').textContent = 'Goal: ' + goalNames[selectedGoal];
    
    renderFamily();
    updateStats();
    showTab('actions');
}

// Action Assignment Functions
function assignAction(memberId, action) {
    const member = family[memberId];
    
    if (member.health <= 0) {
        showModal('Cannot Assign', `${member.name.split('(')[0].trim()} has passed away and cannot be assigned actions.`);
        return;
    }
    
    if (member.health <= 2 && action.type === 'work') {
        showModal('❌ Too Sick to Work', `${member.name.split('(')[0].trim()} is critically ill (health ${member.health}/10).\n\nIn Honduras, workers this sick cannot physically work - they need rest or medical treatment.\n\nChoose: Rest, School, Volunteer, or treat them in the Healthcare tab.`);
        return;
    }
    
    if (action.type === 'work' || action.type === 'school') {
        showIntensityModal(memberId, action);
    } else {
        member.action = action;
        renderFamily();
        updateAssignmentStatus();
        if (gameState.currentTab === 'actions') {
            renderActions(document.getElementById('actionContent'));
        }
    }
}

function showIntensityModal(memberId, baseAction) {
    const member = family[memberId];
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    tempActionForIntensity = { memberId, baseAction };
    
    let intensityOptions = '';
    
    if (baseAction.type === 'work') {
        const job = jobs.find(j => j.id === baseAction.id);
        
        intensityOptions = `
            <div style="margin-bottom: 20px; padding: 15px; background: #e3f2fd; border-radius: 10px; text-align: left;">
                <strong>🇭🇳 Honduras Work Culture:</strong> Standard work week is 44 hours. Many Hondurans work overtime (50-60+ hours) for 125-175% pay, but this causes exhaustion, injuries, and health problems - especially in maquilas (factories).
            </div>
            <div style="display: grid; gap: 15px;">
                <button class="choice-btn" onclick="selectIntensity('easy')" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🟢 Take it Easy</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Standard 44-hour week, normal pace</div>
                    <div style="margin-top: 8px;">
                        <strong>Pay:</strong> ${Math.floor(job.pay * 0.75)} L (75%)<br>
                        <strong>Health cost:</strong> -${Math.max(1, job.healthCost - 1)}<br>
                        <strong>Best for:</strong> Sick or exhausted workers
                    </div>
                </button>
                
                <button class="choice-btn" onclick="selectIntensity('normal')" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🟡 Work Normally</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Full expectations, full pay</div>
                    <div style="margin-top: 8px;">
                        <strong>Pay:</strong> ${job.pay} L (100%)<br>
                        <strong>Health cost:</strong> -${job.healthCost}<br>
                        <strong>Best for:</strong> Healthy workers
                    </div>
                </button>
                
                <button class="choice-btn" onclick="selectIntensity('hard')" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🔴 Work Hard (Overtime)</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">50-60 hour weeks, fast pace (maquila reality)</div>
                    <div style="margin-top: 8px;">
                        <strong>Pay:</strong> ${Math.floor(job.pay * 1.3)} L (+30% overtime pay)<br>
                        <strong>Health cost:</strong> -${job.healthCost + 2}<br>
                        <strong>⚠️ Warning:</strong> High risk of injury and burnout
                    </div>
                </button>
            </div>
        `;
        modalTitle.textContent = `${job.icon} ${job.name} - Choose Work Intensity`;
    } else if (baseAction.type === 'school') {
        const school = schools.find(s => s.id === baseAction.id);
        
        intensityOptions = `
            <div style="margin-bottom: 20px; padding: 15px; background: #fff3e0; border-radius: 10px; text-align: left;">
                <strong>📚 Study Intensity:</strong> In Honduras, students who study harder advance faster, but intense studying without rest causes stress and exhaustion.
            </div>
            <div style="display: grid; gap: 15px;">
                <button class="choice-btn" onclick="selectIntensity('easy')" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🟢 Study Lightly</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Relaxed pace, less pressure</div>
                    <div style="margin-top: 8px;">
                        <strong>Education:</strong> +${Math.max(1, school.education - 1)}<br>
                        <strong>Health cost:</strong> -${Math.max(0, school.healthCost - 1)}<br>
                        <strong>Best for:</strong> Tired or sick students
                    </div>
                </button>
                
                <button class="choice-btn" onclick="selectIntensity('normal')" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🟡 Study Normally</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Balanced study habits</div>
                    <div style="margin-top: 8px;">
                        <strong>Education:</strong> +${school.education}<br>
                        <strong>Health cost:</strong> -${school.healthCost}<br>
                        <strong>Best for:</strong> Healthy students
                    </div>
                </button>
                
                <button class="choice-btn" onclick="selectIntensity('hard')" style="background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">🔵 Study Hard</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Extra hours, late nights, intense focus</div>
                    <div style="margin-top: 8px;">
                        <strong>Education:</strong> +${school.education + 1}<br>
                        <strong>Health cost:</strong> -${school.healthCost + 1}<br>
                        <strong>Best for:</strong> Dedicated students racing to graduate
                    </div>
                </button>
            </div>
        `;
        modalTitle.textContent = `${school.icon} ${school.name} - Choose Study Intensity`;
    }
    
    modalBody.innerHTML = intensityOptions;
    modal.style.display = 'flex';
}

function selectIntensity(intensity) {
    if (!tempActionForIntensity) {
        console.error('No tempActionForIntensity!');
        return;
    }
    
    const { memberId, baseAction } = tempActionForIntensity;
    const member = family[memberId];
    const action = { ...baseAction, intensity: intensity };
    
    member.action = action;
    tempActionForIntensity = null;
    
    closeModal();
    renderFamily();
    updateAssignmentStatus();
    if (gameState.currentTab === 'actions') {
        renderActions(document.getElementById('actionContent'));
    }
}

// Repeat Last Season
function repeatLastSeason() {
    if (Object.keys(gameState.lastSeasonActions).length === 0) {
        showModal('No Previous Season', 'There are no actions from last season to repeat.');
        return;
    }

    let successCount = 0;
    let failedMembers = [];

    family.forEach(member => {
        if (member.health <= 0) return;

        const lastAction = gameState.lastSeasonActions[member.id];
        if (!lastAction) return;

        if (lastAction.type === 'work') {
            const job = jobs.find(j => j.id === lastAction.id);
            if (job) {
                const meetsAge = (!job.minAge || member.age >= job.minAge) && 
                                (!job.maxAge || member.age <= job.maxAge) &&
                                (!job.adultsOnly || member.age >= 18);
                const meetsEducation = member.education >= job.education;
                const meetsGender = !job.gender || job.gender.includes(member.name);
                const meetsRequirements = (!job.requiresStall || gameState.community.marketStall.built) &&
                                         (!job.requiresBike || gameState.items.bike);
                const healthyEnough = member.health > 2;

                if (meetsAge && meetsEducation && meetsGender && meetsRequirements && healthyEnough) {
                    member.action = { ...lastAction };
                    successCount++;
                } else {
                    failedMembers.push(member.name.split('(')[0].trim());
                }
            }
        } else if (lastAction.type === 'school') {
            const school = schools.find(s => s.id === lastAction.id);
            if (school) {
                const meetsAge = (!school.adults || member.age >= 16) &&
                                (!school.adultsOnly || member.age >= 18) &&
                                member.age <= 25;
                const notFullyEducated = member.education < 15;
                const canAfford = gameState.money >= school.cost;
                const hasUniform = !school.requiresUniform || gameState.items.uniform;

                if (meetsAge && notFullyEducated && canAfford && hasUniform) {
                    member.action = { ...lastAction };
                    successCount++;
                } else {
                    failedMembers.push(member.name.split('(')[0].trim());
                }
            }
        } else {
            member.action = { ...lastAction };
            successCount++;
        }
    });

    renderFamily();
    updateAssignmentStatus();

    if (failedMembers.length > 0) {
        showModal('⚠️ Partially Repeated', `Repeated actions for ${successCount} family members.\n\nCouldn't repeat for: ${failedMembers.join(', ')}\n(Requirements changed or no longer eligible)`);
    } else if (successCount > 0) {
        showModal('✓ Actions Repeated', `Successfully repeated all ${successCount} actions from last season!`);
    }
}

// Advance Season
function advanceSeason() {
    const livingMembers = family.filter(m => m.health > 0);
    if (livingMembers.some(m => !m.action)) {
        showModal('Incomplete Planning', 'Please assign actions to all living family members before advancing.');
        return;
    }

    const criticallyIll = family.filter(m => m.health <= 2 && m.health > 0);
    if (criticallyIll.length > 0) {
        const names = criticallyIll.map(m => m.name.split('(')[0].trim()).join(', ');
        const proceed = confirm(`⚠️ WARNING: ${names} ${criticallyIll.length === 1 ? 'is' : 'are'} critically ill (health ≤ 2)!\n\nWithout treatment, they may DIE this season.\n\nVisit Healthcare tab to treat them, or click OK to continue anyway (RISKY!).`);
        if (!proceed) {
            return;
        }
    }
    
    // Process actions
    let income = 0;
    let expenses = 0;
    let volunteerCount = 0;
    
    family.forEach(member => {
        if (!member.action) return;
        
        let happinessMultiplier = 1.0;
        if (member.happiness <= 2) {
            happinessMultiplier = 0.8;
        } else if (member.happiness <= 4) {
            happinessMultiplier = 0.9;
        } else if (member.happiness >= 8) {
            happinessMultiplier = 1.1;
        }
        
        if (member.action.type === 'work') {
            const job = jobs.find(j => j.id === member.action.id);
            const intensity = member.action.intensity || 'normal';
            
            let payMultiplier = 1.0;
            let healthMultiplier = 1.0;
            
            if (intensity === 'easy') {
                payMultiplier = 0.75;
                healthMultiplier = 0.7;
            } else if (intensity === 'hard') {
                payMultiplier = 1.3;
                healthMultiplier = 1.5;
            }
            
            let skillBonus = 1.0;
            if (job.id === 'construction' && member.skills.construction !== undefined) {
                skillBonus = 1.0 + (member.skills.construction / 20);
                healthMultiplier *= (1 - member.skills.construction / 30);
            } else if ((job.id === 'mechanic' || job.id === 'mechanic_assistant') && member.skills.mechanic !== undefined) {
                skillBonus = 1.0 + (member.skills.mechanic / 20);
                healthMultiplier *= (1 - member.skills.mechanic / 30);
            } else if ((job.id === 'market_vendor' || job.id === 'stall_owner') && member.skills.business !== undefined) {
                skillBonus = 1.0 + (member.skills.business / 15);
            } else if (job.id === 'teacher' && member.skills.teaching !== undefined) {
                skillBonus = 1.0 + (member.skills.teaching / 25);
            } else if (job.id === 'farm_work' && member.skills.farming !== undefined) {
                skillBonus = 1.0 + (member.skills.farming / 30);
                healthMultiplier *= (1 - member.skills.farming / 40);
            }
            
            const finalPay = Math.floor(job.pay * payMultiplier * happinessMultiplier * skillBonus);
            const finalHealthCost = Math.ceil(job.healthCost * healthMultiplier);
            
            income += finalPay;
            member.health -= finalHealthCost;
            if (gameState.items.shoes) member.health += 1;
            
        } else if (member.action.type === 'school') {
            const school = schools.find(s => s.id === member.action.id);
            const intensity = member.action.intensity || 'normal';
            
            let educationMultiplier = 1.0;
            let healthMultiplier = 1.0;
            
            if (intensity === 'easy') {
                educationMultiplier = 0.75;
                healthMultiplier = 0.7;
            } else if (intensity === 'hard') {
                educationMultiplier = 1.3;
                healthMultiplier = 1.3;
            }
            
            const finalEducation = Math.floor(school.education * educationMultiplier * happinessMultiplier);
            const finalHealthCost = Math.ceil(school.healthCost * healthMultiplier);
            
            expenses += school.cost;
            member.education = Math.min(15, member.education + finalEducation);
            member.health -= finalHealthCost;
            
            if (member.education >= 12 && member.diplomas === 0) {
                member.diplomas = 1;
                gameState.diplomas += 1;
                showModal('🎓 Diploma Earned!', `${member.name} earned a diploma!`);
            }
        } else if (member.action.type === 'volunteer') {
            member.education = Math.min(15, member.education + 1);
            member.happiness = Math.min(10, member.happiness + 1);
            volunteerCount++;
        } else if (member.action.type === 'rest') {
            member.health = Math.min(10, member.health + 3);
            member.happiness = Math.min(10, member.happiness + 1);
        }
        
        gameState.lastSeasonActions[member.id] = { ...member.action };
        member.action = null;
    });
    
    // Process volunteer work toward community buildings
    if (volunteerCount > 0) {
        if (!gameState.community.communityCenter.built) {
            gameState.community.communityCenter.progress += volunteerCount;
            if (gameState.community.communityCenter.progress >= gameState.community.communityCenter.required) {
                gameState.community.communityCenter.built = true;
                showModal('🏘️ Community Center Built!', 'The community center is complete! New opportunities available.');
            }
        } else if (!gameState.community.library.built) {
            gameState.community.library.progress += volunteerCount;
            if (gameState.community.library.progress >= gameState.community.library.required) {
                gameState.community.library.built = true;
                showModal('📚 Library Built!', 'The library is complete! +1 education per season for all!');
            }
        } else if (!gameState.community.healthCenter.built) {
            gameState.community.healthCenter.progress += volunteerCount;
            if (gameState.community.healthCenter.progress >= gameState.community.healthCenter.required) {
                gameState.community.healthCenter.built = true;
                showModal('🏥 Health Center Built!', 'The health center is complete! +2 health per season for all!');
            }
        } else if (!gameState.community.soccerField.built) {
            gameState.community.soccerField.progress += volunteerCount;
            if (gameState.community.soccerField.progress >= gameState.community.soccerField.required) {
                gameState.community.soccerField.built = true;
                showModal('⚽ Soccer Field Built!', 'The soccer field is complete! +1 happiness per season for all!');
            }
        }
    }
    
    // Living condition expenses
    const living = livingConditions.find(l => l.id === gameState.livingCondition);
    expenses += living.cost;
    
    // Apply living condition effects
    family.forEach(member => {
        member.health = Math.max(0, Math.min(10, member.health + living.healthChange));
        member.happiness = Math.max(0, Math.min(10, member.happiness + living.happinessChange));
    });
    
    // Item benefits
    if (gameState.items.books) {
        family.forEach(m => m.education = Math.min(15, m.education + 1));
    }
    if (gameState.items.radio) {
        family.forEach(m => m.happiness = Math.min(10, m.happiness + 1));
    }
    if (gameState.items.toys) {
        family.filter(m => m.age < 18).forEach(m => m.happiness = Math.min(10, m.happiness + 1));
    }
    if (gameState.items.bed) {
        family.forEach(m => m.health = Math.min(10, m.health + 2));
    }
    if (gameState.items.plumbing) {
        family.forEach(m => m.health = Math.min(10, m.health + 3));
    }
    if (gameState.items.livestock) {
        income += 80;
    }
    if (gameState.items.computer) {
        family.forEach(m => m.education = Math.min(15, m.education + 2));
    }
    
    // Community building benefits
    if (gameState.community.library.built) {
        family.forEach(m => m.education = Math.min(15, m.education + 1));
    }
    if (gameState.community.healthCenter.built) {
        family.forEach(m => m.health = Math.min(10, m.health + 2));
    }
    if (gameState.community.soccerField.built) {
        family.forEach(m => m.happiness = Math.min(10, m.happiness + 1));
    }
    
    // Update money
    gameState.money += income - expenses;

    // Grow skills based on actions
    growSkills();

    // Process relationship events
    processRelationships();
    
    // Check for character dialogue (40% chance)
    const hadDialogue = checkForDialogue();
    
    // Check for positive event (30% chance)
    const hadPositiveEvent = checkPositiveEvent();
    
    // Random event (60% chance, only if no dialogue or positive event)
    if (!hadDialogue && !hadPositiveEvent && Math.random() < 0.6) {
        const event = events[Math.floor(Math.random() * events.length)];
        processEvent(event);
    }

    // Check achievements
    checkAchievements();
    
    // Check game over conditions
    const allDead = family.every(m => m.health <= 0);
    const veryBroke = gameState.money < -3000;
    
    // Check for individual deaths
    const deaths = family.filter(m => m.health <= 0);
    if (deaths.length > 0 && deaths.length < family.length) {
        const names = deaths.map(m => m.name.split('(')[0].trim()).join(', ');
        showModal('💔 Tragedy', `${names} ${deaths.length === 1 ? 'has' : 'have'} passed away from illness and exhaustion. The family must continue without them.`);
        deaths.forEach(m => {
            m.name = `${m.name.split('(')[0].trim()} ✝️`;
            m.health = 0;
            m.action = null;
        });
    }
    
    if (allDead) {
        endGame('Every family member succumbed to illness and poverty. This devastating reality affects many Honduran families who lack access to healthcare.');
        return;
    } else if (veryBroke) {
        endGame('Crushing debt forced the family to migrate north in search of opportunities.');
        return;
    }
    
    // Advance season
    gameState.season++;
    if (gameState.season % 4 === 1) {
        gameState.year++;
    }
    
    // Check win condition
    if (gameState.season > 16) {
        calculateFinalScore();
        return;
    }
    
    // Update display
    renderFamily();
    updateStats();
    showTab('actions');
}

function calculateFinalScore() {
    const avgHealth = family.reduce((sum, m) => sum + m.health, 0) / family.length;
    const avgEducation = family.reduce((sum, m) => sum + m.education, 0) / family.length;
    const avgHappiness = family.reduce((sum, m) => sum + m.happiness, 0) / family.length;
    
    let message = 'The Rodríguez family survived 4 years in Honduras! ';
    
    if (gameState.money > 8000 && avgHealth > 7 && avgEducation > 10 && avgHappiness > 7) {
        message += 'They achieved prosperity and stability! A remarkable achievement.';
    } else if (gameState.money > 5000 && avgHealth > 5 && avgEducation > 7) {
        message += 'They built a decent life with some security for the future.';
    } else if (avgHealth > 3) {
        message += 'They survived, but continue to struggle daily. The cycle of poverty persists.';
    } else {
        message += 'They barely survived. Many challenges remain ahead.';
    }
    
    endGame(message);
}

function endGame(message) {
    const container = document.querySelector('.game-container');
    
    const avgHealth = family.reduce((sum, m) => sum + m.health, 0) / family.length;
    const avgEducation = family.reduce((sum, m) => sum + m.education, 0) / family.length;
    const avgHappiness = family.reduce((sum, m) => sum + m.happiness, 0) / family.length;
    
    const achievementsEarned = achievements.filter(a => gameState.achievements.includes(a.id));
    
    let endingType = '';
    let endingMessage = '';
    if (gameState.diplomas >= 3 && gameState.money > 1000) {
        endingType = '🌟 TRIUMPH ENDING';
        endingMessage = 'Through hard work and smart choices, your family found a path to stability!';
    } else if (gameState.money > 500 && avgHealth > 5) {
        endingType = '💪 SURVIVOR ENDING';
        endingMessage = 'Your family survived against all odds. The struggle continues, but hope remains.';
    } else if (avgHealth < 3 || gameState.money < -1000) {
        endingType = '💔 TRAGEDY ENDING';
        endingMessage = 'The weight of poverty proved too heavy. Many Honduran families face this reality.';
    } else {
        endingType = '🤝 PERSEVERANCE ENDING';
        endingMessage = 'Your family endured tremendous hardship. This is the daily reality for millions.';
    }
    
    container.innerHTML = `
        <div class="end-screen">
            <h2>Game Over</h2>
            <div style="font-size: 1.8em; margin: 20px 0; color: #0073cf;">${endingType}</div>
            <p style="font-size: 1.2em; max-width: 600px; margin: 0 auto 20px; line-height: 1.6;">${message}</p>
            <p style="font-size: 1.1em; max-width: 600px; margin: 0 auto 30px; line-height: 1.6; color: #667eea;">${endingMessage}</p>
            
            <div class="final-stats">
                <div class="final-stat">
                    <div class="final-stat-label">Final Money</div>
                    <div class="final-stat-value">${gameState.money} L</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-label">Diplomas Earned</div>
                    <div class="final-stat-value">${gameState.diplomas}</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-label">Avg Health</div>
                    <div class="final-stat-value">${avgHealth.toFixed(1)}/10</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-label">Avg Education</div>
                    <div class="final-stat-value">${avgEducation.toFixed(1)}/15</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-label">Avg Happiness</div>
                    <div class="final-stat-value">${avgHappiness.toFixed(1)}/10</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-label">Achievements</div>
                    <div class="final-stat-value">${gameState.achievements.length}/${achievements.length}</div>
                </div>
            </div>

            ${achievementsEarned.length > 0 ? `
                <div style="margin: 30px auto; max-width: 700px; background: #f8f9fa; padding: 20px; border-radius: 15px;">
                    <h3 style="color: #0073cf; margin-bottom: 15px;">🏆 Achievements Unlocked (${achievementsEarned.length})</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                        ${achievementsEarned.map(a => `
                            <div style="background: white; padding: 10px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 2em;">${a.icon}</div>
                                <div style="font-size: 0.9em; font-weight: bold; margin-top: 5px;">${a.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div style="margin: 30px auto; max-width: 600px; background: #f8f9fa; padding: 20px; border-radius: 15px; text-align: left;">
                <h3 style="color: #0073cf; margin-bottom: 15px;">📊 Reality Check</h3>
                <p style="margin-bottom: 10px; color: #495057; line-height: 1.6;">
                    <strong>In Honduras:</strong><br>
                    • 65% of the population lives in poverty<br>
                    • Average household income: ~12,000 L/year<br>
                    • Your family earned: ${Math.max(0, gameState.money - 500 + (gameState.season * 200))} L over ${Math.floor((gameState.season-1)/4)} years<br>
                    • Gang extortion affects 1 in 5 families<br>
                    • Remittances from migrants make up 20% of GDP<br>
                    • Education access remains limited for rural families
                </p>
            </div>
            
            <button class="restart-btn" onclick="location.reload()">Play Again</button>
            
            <p style="margin-top: 40px; color: #6c757d; max-width: 600px; margin-left: auto; margin-right: auto;">
                This game illustrates the challenges faced by families in Honduras. Every choice reflects the difficult decisions families make daily to survive and pursue a better future.
            </p>
        </div>
    `;
}
