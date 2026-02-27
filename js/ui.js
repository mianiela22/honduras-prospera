// UI Rendering Functions

function renderFamily() {
    const container = document.getElementById('familyPanel');
    container.innerHTML = '<h3 style="margin-bottom: 15px; color: #0073cf;">The Rodríguez Family</h3>';
    
    family.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'family-member' + (gameState.selectedMember === member.id ? ' selected' : '');
        memberDiv.onclick = () => selectMember(member.id);
        
        memberDiv.innerHTML = `
            <div class="member-avatar">${member.emoji}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-bars">
                <div class="bar-container">
                    <div class="bar-label">
                        <span>Health</span>
                        <span>${member.health}/10</span>
                    </div>
                    <div class="bar">
                        <div class="bar-fill health-fill" style="width: ${(member.health/10)*100}%"></div>
                    </div>
                </div>
                <div class="bar-container">
                    <div class="bar-label">
                        <span>Education</span>
                        <span>${member.education}/15</span>
                    </div>
                    <div class="bar">
                        <div class="bar-fill education-fill" style="width: ${(member.education/15)*100}%"></div>
                    </div>
                </div>
                <div class="bar-container">
                    <div class="bar-label">
                        <span>Happiness</span>
                        <span>${member.happiness}/10</span>
                    </div>
                    <div class="bar">
                        <div class="bar-fill happiness-fill" style="width: ${(member.happiness/10)*100}%"></div>
                    </div>
                </div>
            </div>
            ${gameState.selectedMember === member.id ? `
                <div class="skills-panel">
                    <div style="font-weight: bold; margin-bottom: 8px; font-size: 0.85em; color: #0073cf;">💫 Skills</div>
                    ${Object.entries(member.skills).map(([skill, level]) => `
                        <div class="skill-item">
                            <div class="skill-name">
                                ${skill} ${level.toFixed(1)}/10
                                ${getSkillBonus(member, skill) > 0 ? ` 💰 +${Math.floor(getSkillBonus(member, skill) * 100)}% pay` : ''}
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${(level/10)*100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="member-status">
                ${member.action ? 'Assigned: ' + getActionName(member.action) : 'No action assigned'}
                ${member.diplomas > 0 ? `<br>🎓 ${member.diplomas} diploma(s)` : ''}
            </div>
        `;
        container.appendChild(memberDiv);
    });
}

function getSkillBonus(member, skillName) {
    const level = member.skills[skillName] || 0;
    
    if (skillName === 'construction' || skillName === 'mechanic') {
        return level / 20;
    } else if (skillName === 'business') {
        return level / 15;
    } else if (skillName === 'teaching') {
        return level / 25;
    } else if (skillName === 'farming') {
        return level / 30;
    }
    return 0;
}

function getActionName(action) {
    if (!action) return 'None';
    if (action.type === 'work') {
        const job = jobs.find(j => j.id === action.id);
        return job ? job.name : 'Work';
    } else if (action.type === 'school') {
        const school = schools.find(s => s.id === action.id);
        return school ? school.name : 'School';
    } else if (action.type === 'rest') {
        return 'Rest at Home';
    } else if (action.type === 'volunteer') {
        return 'Volunteer Work';
    }
    return 'Unknown';
}

function selectMember(id) {
    gameState.selectedMember = id;
    renderFamily();
    if (gameState.currentTab === 'actions') {
        showTab('actions');
    }
}

function updateStats() {
    document.getElementById('seasonDisplay').textContent = `${gameState.season} / 16`;
    document.getElementById('moneyDisplay').textContent = `${gameState.money} L`;
    document.getElementById('livingDisplay').textContent = gameState.livingCondition.charAt(0).toUpperCase() + gameState.livingCondition.slice(1);
    document.getElementById('diplomaDisplay').textContent = gameState.diplomas;
    document.getElementById('achievementDisplay').textContent = gameState.achievements.length;
    
    const seasonNames = seasons[(gameState.season - 1) % 4];
    document.getElementById('seasonTitle').textContent = `${seasonNames} - Year ${gameState.year}`;
    
    updateAssignmentStatus();
}

function updateAssignmentStatus() {
    const unassigned = family.filter(m => !m.action).length;
    const status = document.getElementById('assignmentStatus');
    if (unassigned === 0) {
        status.textContent = '✓ All family members assigned';
        status.style.color = '#28a745';
    } else {
        status.textContent = `${unassigned} family member(s) need assignment`;
        status.style.color = '#f5576c';
    }
}

function showTab(tab) {
    gameState.currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('actionContent');
    content.innerHTML = '';
    
    if (tab === 'actions') {
        renderActions(content);
    } else if (tab === 'healthcare') {
        renderHealthcare(content);
    } else if (tab === 'shop') {
        renderShop(content);
    } else if (tab === 'living') {
        renderLiving(content);
    } else if (tab === 'community') {
        renderCommunity(content);
    }
}

function renderHealthcare(container) {
    container.innerHTML = '<h3 style="margin-bottom: 20px;">🏥 Healthcare - Treat Sick Family Members</h3>';
    
    const sickMembers = family.filter(m => m.health < 8);
    
    if (sickMembers.length === 0) {
        container.innerHTML += '<p style="text-align: center; padding: 40px; color: #28a745; font-size: 1.2em;">✓ Everyone is healthy! No treatment needed.</p>';
        return;
    }
    
    container.innerHTML += '<p style="margin-bottom: 20px; color: #6c757d;">Select a family member and choose treatment:</p>';
    
    sickMembers.forEach(member => {
        const memberSection = document.createElement('div');
        memberSection.style.marginBottom = '30px';
        memberSection.style.padding = '20px';
        memberSection.style.background = '#fff';
        memberSection.style.borderRadius = '15px';
        memberSection.style.border = '2px solid #dee2e6';
        
        const statusColor = member.health <= 2 ? '#dc3545' : member.health <= 5 ? '#ffc107' : '#6c757d';
        const statusText = member.health <= 2 ? '⚠️ CRITICAL' : member.health <= 5 ? '🤒 SICK' : '😷 UNWELL';
        
        memberSection.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <span style="font-size: 2em; margin-right: 10px;">${member.emoji}</span>
                    <strong style="font-size: 1.2em;">${member.name}</strong>
                </div>
                <div style="color: ${statusColor}; font-weight: bold; font-size: 1.1em;">${statusText} (${member.health}/10)</div>
            </div>
        `;
        
        const treatmentGrid = document.createElement('div');
        treatmentGrid.className = 'action-grid';
        treatmentGrid.style.marginTop = '15px';
        
        healthCare.forEach(treatment => {
            const canAfford = gameState.money >= treatment.cost;
            const card = document.createElement('div');
            card.className = 'action-card' + (!canAfford ? ' disabled' : '');
            
            if (canAfford) {
                card.onclick = () => applyHealthcare(member.id, treatment);
            }
            
            card.innerHTML = `
                <div class="action-icon">${treatment.icon}</div>
                <div class="action-name">${treatment.name}</div>
                <div class="action-details">${treatment.description}</div>
                <div class="action-benefit">+${treatment.healthGain} health</div>
                <div class="action-cost">-${treatment.cost} L</div>
                ${!canAfford ? '<div style="color: #dc3545; margin-top: 5px; font-size: 0.8em;">Cannot afford</div>' : ''}
            `;
            treatmentGrid.appendChild(card);
        });
        
        memberSection.appendChild(treatmentGrid);
        container.appendChild(memberSection);
    });
}

function applyHealthcare(memberId, treatment) {
    if (gameState.money < treatment.cost) return;
    
    const member = family[memberId];
    gameState.money -= treatment.cost;
    member.health = Math.min(10, member.health + treatment.healthGain);
    
    showModal('💊 Treatment Applied', `${member.name.split('(')[0].trim()} received ${treatment.name} and feels better! Health: ${member.health}/10`);
    renderHealthcare(document.getElementById('actionContent'));
    updateStats();
    renderFamily();
}

function renderActions(container) {
    if (gameState.selectedMember === null) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #6c757d;">← Select a family member to assign actions</p>';
        return;
    }
    
    const member = family[gameState.selectedMember];
    container.innerHTML = `<h3 style="margin-bottom: 20px;">Actions for ${member.name}</h3>`;
    
    const grid = document.createElement('div');
    grid.className = 'action-grid';
    
    // Work options
    jobs.forEach(job => {
        const meetsAgeMin = !job.minAge || member.age >= job.minAge;
        const meetsAgeMax = !job.maxAge || member.age <= job.maxAge;
        const meetsAdultRequirement = !job.adultsOnly || member.age >= 18;
        const underFourteenCannotWork = member.age < 14;
        
        const canWork = !underFourteenCannotWork &&
                       meetsAgeMin &&
                       meetsAgeMax &&
                       meetsAdultRequirement &&
                       member.education >= job.education && 
                       (!job.gender || job.gender.includes(member.name)) &&
                       (!job.requiresStall || gameState.community.marketStall.built) &&
                       (gameState.items.bike || !job.requiresBike) &&
                       member.health > 2;
        
        let disabledReason = '';
        if (underFourteenCannotWork) {
            disabledReason = 'Too young to work (under 14)';
        } else if (!meetsAgeMin) {
            disabledReason = 'Too young for this job';
        } else if (!meetsAgeMax) {
            disabledReason = 'Too old for this job';
        } else if (!meetsAdultRequirement) {
            disabledReason = 'Adults only (hazardous work)';
        } else if (member.education < job.education) {
            disabledReason = 'Need education: ' + job.education;
        } else if (job.requiresStall && !gameState.community.marketStall.built) {
            disabledReason = 'Need Market Stall';
        } else if (job.requiresBike && !gameState.items.bike) {
            disabledReason = 'Need Bicycle';
        } else if (member.health <= 2) {
            disabledReason = 'Too sick to work';
        } else if (job.gender && !job.gender.includes(member.name)) {
            disabledReason = 'Not available';
        }
        
        const card = document.createElement('div');
        card.className = 'action-card' + (!canWork ? ' disabled' : '') + 
                        (member.action && member.action.type === 'work' && member.action.id === job.id ? ' selected' : '');
        
        if (canWork) {
            card.onclick = () => assignAction(member.id, { type: 'work', id: job.id });
        }
        
        card.innerHTML = `
            <div class="action-icon">${job.icon}</div>
            <div class="action-name">${job.name}</div>
            <div class="action-details">
                ${!canWork ? disabledReason : (job.description || '')}
            </div>
            <div class="action-benefit">+${job.pay} L</div>
            <div class="action-cost">-${job.healthCost} health</div>
        `;
        grid.appendChild(card);
    });
    
    // School options
    schools.forEach(school => {
        const needsUniform = school.requiresUniform && !gameState.items.uniform;
        const isAdult = member.age >= 18;
        const meetsAdultRequirement = !school.adultsOnly || isAdult;
        
        const canStudy = (!school.adults || member.age >= 16) && 
                       meetsAdultRequirement &&
                       member.age <= 25 &&
                       member.education < 15 &&
                       gameState.money >= school.cost &&
                       !needsUniform;
        
        const card = document.createElement('div');
        card.className = 'action-card' + (!canStudy ? ' disabled' : '') +
                        (member.action && member.action.type === 'school' && member.action.id === school.id ? ' selected' : '');
        
        if (canStudy) {
            card.onclick = () => assignAction(member.id, { type: 'school', id: school.id });
        }
        
        card.innerHTML = `
            <div class="action-icon">${school.icon}</div>
            <div class="action-name">${school.name}</div>
            <div class="action-details">
                ${school.description || ''}
                ${!canStudy ? (needsUniform ? '<br>Need school uniform' :
                              gameState.money < school.cost ? '<br>Not enough money' : 
                              school.adultsOnly && !isAdult ? '<br>Adults only (18+)' :
                              school.adults && member.age < 16 ? '<br>Ages 16+ only' :
                              member.education >= 15 ? '<br>Fully educated' :
                              '<br>Not available') : ''}
            </div>
            <div class="action-benefit">+${school.education} education</div>
            <div class="action-cost">-${school.cost} L, -${school.healthCost} health</div>
        `;
        grid.appendChild(card);
    });
    
    // Volunteer
    const card = document.createElement('div');
    card.className = 'action-card' + (member.action && member.action.type === 'volunteer' ? ' selected' : '');
    card.onclick = () => assignAction(member.id, { type: 'volunteer' });
    card.innerHTML = `
        <div class="action-icon">🤝</div>
        <div class="action-name">Volunteer Work</div>
        <div class="action-details">Help build community</div>
        <div class="action-benefit">+1 education, +1 happiness</div>
        <div class="action-cost">Free</div>
    `;
    grid.appendChild(card);
    
    // Rest
    const restCard = document.createElement('div');
    restCard.className = 'action-card' + (member.action && member.action.type === 'rest' ? ' selected' : '');
    restCard.onclick = () => assignAction(member.id, { type: 'rest' });
    restCard.innerHTML = `
        <div class="action-icon">🏠</div>
        <div class="action-name">Rest at Home</div>
        <div class="action-details">Recover health</div>
        <div class="action-benefit">+3 health, +1 happiness</div>
        <div class="action-cost">Free</div>
    `;
    grid.appendChild(restCard);
    
    container.appendChild(grid);
}

function renderShop(container) {
    container.innerHTML = '<h3 style="margin-bottom: 20px;">Shop - Buy Items to Help Your Family</h3>';
    
    const grid = document.createElement('div');
    grid.className = 'shop-items';
    
    shopItems.forEach(item => {
        const owned = gameState.items[item.id];
        const tooExpensive = gameState.money < item.price;
        
        const card = document.createElement('div');
        card.className = 'shop-item' + (owned ? ' owned' : '') + (tooExpensive && !owned ? ' too-expensive' : '');
        
        if (!owned && !tooExpensive) {
            card.onclick = () => buyItem(item.id);
        }
        
        card.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">${owned ? '✓ Owned' : item.price + ' L'}</div>
            <div class="item-benefit">${item.benefit}</div>
        `;
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (gameState.money >= item.price && !gameState.items[itemId]) {
        gameState.money -= item.price;
        gameState.items[itemId] = true;
        updateStats();
        renderShop(document.getElementById('actionContent'));
        showModal('Purchase Complete!', `You bought ${item.name}! ${item.benefit}`);
    }
}

function renderLiving(container) {
    container.innerHTML = '<h3 style="margin-bottom: 20px;">Living Conditions</h3><p style="margin-bottom: 20px; color: #6c757d;">Better living conditions improve health and happiness but cost more per season.</p>';
    
    const selector = document.createElement('div');
    selector.className = 'living-selector';
    
    livingConditions.forEach(condition => {
        const option = document.createElement('div');
        option.className = 'living-option' + (gameState.livingCondition === condition.id ? ' selected' : '');
        option.onclick = () => setLiving(condition.id);
        
        option.innerHTML = `
            <h3>${condition.name}</h3>
            <div class="living-cost">${condition.cost} L/season</div>
            <div class="living-effects">
                ${condition.healthChange > 0 ? '+' : ''}${condition.healthChange} health/season<br>
                ${condition.happinessChange > 0 ? '+' : ''}${condition.happinessChange} happiness/season
            </div>
        `;
        selector.appendChild(option);
    });
    
    container.appendChild(selector);
}

function setLiving(conditionId) {
    gameState.livingCondition = conditionId;
    updateStats();
    renderLiving(document.getElementById('actionContent'));
}

function renderCommunity(container) {
    container.innerHTML = '<h3 style="margin-bottom: 20px;">Community Projects</h3><p style="margin-bottom: 20px; color: #6c757d;">Volunteer work helps build these projects. Completed projects benefit the whole family!</p>';
    
    const progress = document.createElement('div');
    progress.className = 'community-progress';
    
    const stallDiv = document.createElement('div');
    stallDiv.className = 'building-item';
    stallDiv.innerHTML = `
        <div class="building-header">
            <div class="building-name">🏪 Market Stall</div>
            <div class="building-status">${gameState.community.marketStall.built ? '✓ Built' : 'Can purchase for 500 L'}</div>
        </div>
        ${!gameState.community.marketStall.built ? `<button style="width: 100%; padding: 10px; background: #0073cf; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px;" onclick="buyStall()">Buy Market Stall - 500 L</button>` : '<p style="margin-top: 10px; color: #28a745;">Unlocks high-paying stall owner job!</p>'}
    `;
    progress.appendChild(stallDiv);
    
    Object.entries(gameState.community).forEach(([key, building]) => {
        if (key === 'marketStall') return;
        
        const buildingDiv = document.createElement('div');
        buildingDiv.className = 'building-item';
        
        const names = {
            communityCenter: '🏘️ Community Center',
            library: '📚 Library',
            healthCenter: '🏥 Health Center',
            soccerField: '⚽ Soccer Field'
        };
        
        const benefits = {
            communityCenter: 'Unlocks more volunteer opportunities',
            library: '+1 education for all per season',
            healthCenter: '+2 health for all per season',
            soccerField: '+1 happiness for all per season'
        };
        
        buildingDiv.innerHTML = `
            <div class="building-header">
                <div class="building-name">${names[key]}</div>
                <div class="building-status">${building.built ? '✓ Complete' : `${building.progress}/${building.required} volunteer sessions`}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(building.progress / building.required) * 100}%"></div>
            </div>
            ${building.built ? `<p style="margin-top: 10px; color: #28a745;">✓ ${benefits[key]}</p>` : ''}
        `;
        progress.appendChild(buildingDiv);
    });
    
    container.appendChild(progress);
}

function buyStall() {
    if (gameState.money >= 500 && !gameState.community.marketStall.built) {
        gameState.money -= 500;
        gameState.community.marketStall.built = true;
        updateStats();
        renderCommunity(document.getElementById('actionContent'));
        showModal('Market Stall Purchased!', 'You can now work as a Market Stall Owner for 420 L per season!');
    }
}

function showModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = message;
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal').classList.remove('dialogue-modal');
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showAchievement(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <h3>${achievement.icon} Achievement Unlocked!</h3>
        <p><strong>${achievement.name}</strong></p>
        <p>${achievement.description}</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
