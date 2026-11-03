// ============================================================================
// THE WALKING DEAD: ULTIMATE SURVIVAL RPG - ELITE ENGINE
// ============================================================================

const gameState = {
    day: 1,
    hour: 8,
    minute: 0,
    timeOfDay: "Morning",
    weather: "Clear Sky",
    region: "Virginia (Alexandria Zone)",
    player: {
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        hunger: 80, // 0-100
        thirst: 85, // 0-100
        sleep: 90,  // 0-100
        infection: 0,
        trauma: 10,
        traumaState: "Clear Mind",
        limbs: {
            head: { condition: "Healthy", bitten: false },
            torso: { condition: "Healthy", bitten: false },
            leftArm: { condition: "Healthy", bitten: false, amputated: false },
            rightArm: { condition: "Healthy", bitten: false, amputated: false },
            leftLeg: { condition: "Healthy", bitten: false, amputated: false },
            rightLeg: { condition: "Healthy", bitten: false, amputated: false }
        }
    },
    inventory: [
        { id: 'machete', name: 'Machete (Durability: 85%)', qty: 1, type: 'weapon', value: 25 },
        { id: 'bandage', name: 'Sterile Bandage', qty: 3, type: 'medical', value: 15 },
        { id: 'water', name: 'Clean Water Flask', qty: 2, type: 'consumable', value: 10 },
        { id: 'canned_beans', name: 'Canned Beans', qty: 4, type: 'consumable', value: 12 },
        { id: 'ammunition', name: '9mm Rounds', qty: 18, type: 'ammo', value: 2 }
    ],
    factions: {
        commonwealth: { name: 'The Commonwealth', standing: 50, desc: 'Advanced industrial civilization in Ohio.' },
        crm: { name: 'CRM Reconstruction', standing: 20, desc: 'Civic Republic military remnant cells.' },
        newBabylon: { name: 'New Babylon', standing: 40, desc: 'Judicial federation enforcing strict laws.' },
        pouvoir: { name: 'Pouvoir des Vivants', standing: -30, desc: 'French militant separatist movement.' }
    },
    base: {
        name: "Alexandria Safe-Zone",
        population: 14,
        defense: 75,
        foodRations: 50,
        waterSupply: 60,
        modules: [
            { id: 'hydroponics', name: 'Hydroponic Greenhouse', level: 2, status: 'Active' },
            { id: 'water_purifier', name: 'River Water Purifier', level: 1, status: 'Active' },
            { id: 'watchtower', name: 'Reinforced Watchtower', level: 2, status: 'Active' },
            { id: 'methane_rig', name: 'Methane Recycler', level: 1, status: 'Idle' }
        ]
    },
    vehicles: [
        { id: 'bike', name: 'Scavenger Mountain Bike', condition: 90, fuel: 100, unlocked: true },
        { id: 'suv', name: 'Armored SUV', condition: 60, fuel: 40, unlocked: true },
        { id: 'truck', name: 'Heavy Cargo Semi-Truck', condition: 30, fuel: 15, unlocked: false }
    ],
    combat: {
        active: false,
        enemyName: '',
        enemyHp: 100,
        enemyMaxHp: 100,
        noiseLevel: 'Low (Quiet)',
        threatValue: 10
    },
    settings: {
        soundEnabled: true
    }
};

// ============================================================================
// INITIALIZATION & EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initTabs();
    initCombatButtons();
    initHeaderButtons();
    renderAll();
    logEvent("[SYSTEM] Core systems online. Post-series wasteland telemetry initialized.");
    
    // Start Game Tick Loop (Every 10 seconds = 1 in-game hour)
    setInterval(gameTick, 10000);
});

function initHeaderButtons() {
    document.getElementById('save-btn').addEventListener('click', () => {
        saveGame();
        logEvent("[SYSTEM] Game state saved successfully to local storage.");
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("Are you sure you want to wipe survival progress and restart?")) {
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'border-red-600', 'text-red-500'));
            tabs.forEach(t => t.classList.add('border-transparent', 'text-zinc-400'));
            
            tab.classList.add('active', 'border-red-600', 'text-red-500');
            tab.classList.remove('border-transparent', 'text-zinc-400');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            const targetTab = document.getElementById(`tab-${tab.dataset.tab}`);
            if (targetTab) targetTab.classList.remove('hidden');
        });
    });
}

// ============================================================================
// TIME, WEATHER & SURVIVAL TICK ENGINE
// ============================================================================

function gameTick() {
    gameState.hour += 1;
    if (gameState.hour >= 24) {
        gameState.hour = 0;
        gameState.day += 1;
        gameState.base.foodRations = Math.max(0, gameState.base.foodRations - gameState.base.population);
        gameState.base.waterSupply = Math.max(0, gameState.base.waterSupply - gameState.base.population);
        logEvent(`[DAY SHIFT] Dawn breaks on Day ${gameState.day}. Rations consumed by settlement.`);
    }

    // Time of day calculations
    if (gameState.hour >= 5 && gameState.hour < 12) gameState.timeOfDay = "Morning";
    else if (gameState.hour >= 12 && gameState.hour < 17) gameState.timeOfDay = "Afternoon";
    else if (gameState.hour >= 17 && gameState.hour < 21) gameState.timeOfDay = "Dusk";
    else gameState.timeOfDay = "Night (High Danger)";

    // Weather random shifts
    const weathers = ["Clear Sky", "Overcast", "Acidic Haze", "Torrential Rain", "Dense Fog"];
    if (Math.random() < 0.25) {
        gameState.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }

    // Passive drain
    gameState.player.hunger = Math.max(0, gameState.player.hunger - 3);
    gameState.player.thirst = Math.max(0, gameState.player.thirst - 4);
    gameState.player.stamina = Math.min(gameState.player.maxStamina, gameState.player.stamina + 10);

    // Starvation / Dehydration Penalties
    if (gameState.player.hunger <= 10) gameState.player.hp = Math.max(5, gameState.player.hp - 5);
    if (gameState.player.thirst <= 10) gameState.player.hp = Math.max(5, gameState.player.hp - 8);

    // Infection Progression
    let bittenLimbs = Object.values(gameState.player.limbs).some(l => l.bitten && !l.amputated);
    if (bittenLimbs) {
        gameState.player.infection = Math.min(100, gameState.player.infection + 15);
        logEvent("[INFECTION WARNING] The Wildfire virus is surging through your bloodstream!");
        if (gameState.player.infection >= 100) {
            logEvent("[FATALITY] The infection has consumed you. You turned.");
            alert("You turned into a walker. Game Over.");
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }
    }

    updateTraumaState();
    renderAll();
}

function updateTraumaState() {
    const t = gameState.player.trauma;
    if (t < 25) gameState.player.traumaState = "Clear Mind";
    else if (t < 50) gameState.player.traumaState = "Stressed & Jittery";
    else if (t < 75) gameState.player.traumaState = "Paranoia & Insomnia";
    else gameState.player.traumaState = "Severe Psychological Break";
}

// ============================================================================
// RENDERING SYSTEM
// ============================================================================

function renderAll() {
    renderHeader();
    renderVitals();
    renderLimbs();
    renderInventory();
    renderBase();
    renderFactions();
    renderVehicles();
    renderActions();
}

function renderHeader() {
    const timeFormatted = `${gameState.hour.toString().padStart(2, '0')}:00`;
    document.getElementById('day-counter').innerText = `Day ${gameState.day} • ${timeFormatted} • ${gameState.timeOfDay} • ${gameState.weather}`;
}

function renderVitals() {
    document.getElementById('hp-val').innerText = `${gameState.player.hp} / ${gameState.player.maxHp}`;
    document.getElementById('hp-bar').style.width = `${(gameState.player.hp / gameState.player.maxHp) * 100}%`;

    document.getElementById('stamina-val').innerText = `${gameState.player.stamina} / ${gameState.player.maxStamina}`;
    document.getElementById('stamina-bar').style.width = `${(gameState.player.stamina / gameState.player.maxStamina) * 100}%`;

    document.getElementById('infection-val').innerText = `${gameState.player.infection}%`;
    document.getElementById('infection-bar').style.width = `${gameState.player.infection}%`;

    document.getElementById('trauma-val').innerText = `${gameState.player.trauma}%`;
    document.getElementById('trauma-bar').style.width = `${gameState.player.trauma}%`;

    const traumaStateEl = document.getElementById('trauma-state');
    if (traumaStateEl) {
        traumaStateEl.innerText = gameState.player.traumaState;
    }
}

function renderLimbs() {
    const container = document.getElementById('limb-container');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(gameState.player.limbs).forEach(([key, limb]) => {
        const div = document.createElement('div');
        div.className = `p-2.5 rounded border bg-zinc-950 flex flex-col justify-between ${limb.bitten ? 'border-red-600 bg-red-950/20' : 'border-zinc-800'}`;
        
        let statusText = limb.amputated ? 'AMPUTATED' : limb.bitten ? 'BITTEN!' : limb.condition;
        let colorClass = limb.amputated ? 'text-zinc-600' : limb.bitten ? 'text-red-500 font-bold animate-pulse' : 'text-emerald-400';

        div.innerHTML = `
            <div>
                <span class="capitalize text-zinc-400 block text-[11px] font-medium">${key.replace(/([A-Z])/g, ' $1')}</span>
                <span class="${colorClass} text-xs">${statusText}</span>
            </div>
            ${limb.bitten && !limb.amputated ? `<button onclick="amputateLimb('${key}')" class="mt-2 text-[10px] bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded border border-red-700 font-semibold transition-colors">🔪 Sever Limb</button>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    gameState.inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 text-xs flex justify-between items-center';
        div.innerHTML = `
            <div>
                <span class="font-semibold block text-zinc-200">${item.name}</span>
                <span class="text-[10px] text-zinc-500 capitalize">Type: ${item.type}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="bg-zinc-900 px-2 py-1 rounded border border-zinc-700 font-mono text-zinc-300">x${item.qty}</span>
                ${item.type === 'consumable' || item.type === 'medical' ? `<button onclick="useItem(${index})" class="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-2 py-1 rounded text-[10px] border border-emerald-700">Use</button>` : ''}
            </div>
        `;
        grid.appendChild(div);
    });
}

function renderBase() {
    document.getElementById('base-pop').innerText = gameState.base.population;
    document.getElementById('base-def').innerText = `${gameState.base.defense}%`;
    document.getElementById('base-food').innerText = `${gameState.base.foodRations} Days`;

    const modulesContainer = document.getElementById('base-modules');
    if (!modulesContainer) return;
    modulesContainer.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Facility Modules</h3>';

    gameState.base.modules.forEach((mod, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-semibold text-zinc-200">${mod.name} <span class="text-zinc-500">(Lvl ${mod.level})</span></span>
                <span class="text-[10px] text-emerald-400 block">Status: ${mod.status}</span>
            </div>
            <button onclick="upgradeModule(${idx})" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded border border-zinc-700 text-[10px]">Upgrade (50 Scrap)</button>
        `;
        modulesContainer.appendChild(div);
    });
}

function renderFactions() {
    const list = document.getElementById('faction-list');
    if (!list) return;
    list.innerHTML = '';

    Object.values(gameState.factions).forEach(fac => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center';
        div.innerHTML = `
            <div>
                <span class="font-bold text-zinc-200 block text-xs">${fac.name}</span>
                <span class="text-[10px] text-zinc-400 block">${fac.desc}</span>
            </div>
            <span class="font-bold font-mono text-xs ${fac.standing >= 0 ? 'text-emerald-400' : 'text-red-400'}">${fac.standing >= 0 ? '+' : ''}${fac.standing}</span>
        `;
        list.appendChild(div);
    });
}

function renderVehicles() {
    // Add vehicle garage container if missing in tab-base or create tab
    let garage = document.getElementById('vehicle-garage');
    if (!garage) {
        const baseTab = document.getElementById('tab-base');
        if (baseTab) {
            garage = document.createElement('div');
            garage.id = 'vehicle-garage';
            garage.className = 'mt-4 space-y-2';
            baseTab.appendChild(garage);
        }
    }
    if (!garage) return;
    garage.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Vehicle Fleet Garage</h3>';

    gameState.vehicles.forEach((veh, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-semibold text-zinc-200">${veh.name}</span>
                <span class="text-[10px] text-zinc-400 block">Condition: ${veh.condition}% | Fuel: ${veh.fuel}%</span>
            </div>
            <div class="flex gap-1">
                <button onclick="repairVehicle(${idx})" class="bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded border border-zinc-700 text-[10px]">Repair</button>
                <button onclick="launchExpedition('${veh.id}')" class="bg-red-950 hover:bg-red-900 text-red-300 px-2 py-1 rounded border border-red-800 text-[10px]">Expedition</button>
            </div>
        `;
        garage.appendChild(div);
    });
}

function renderActions() {
    const actionBox = document.getElementById('action-options');
    if (!actionBox) return;

    if (gameState.combat.active) {
        actionBox.innerHTML = `
            <div class="col-span-full bg-red-950/40 border border-red-800 p-3 rounded text-center">
                <p class="text-red-400 font-bold text-xs uppercase mb-1">⚠️ Combat Encounter Active: ${gameState.combat.enemyName}</p>
                <p class="text-zinc-300 text-xs">Enemy HP: ${gameState.combat.enemyHp} / ${gameState.combat.enemyMaxHp}</p>
                <p class="text-zinc-400 text-[10px] mt-1">Switch to the **Combat** tab above to execute tactical strikes and manage noise levels!</p>
            </div>
        `;
        return;
    }

    actionBox.innerHTML = `
        <button onclick="triggerScavenge()" class="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded text-xs text-left border border-zinc-700 flex justify-between items-center transition-all">
            <span>🎒 Scavenge Ruined Outskirts</span>
            <span class="text-[10px] text-zinc-400">-15 Stamina</span>
        </button>
        <button onclick="patrolPerimeter()" class="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded text-xs text-left border border-zinc-700 flex justify-between items-center transition-all">
            <span>🏹 Patrol Settlement Wire</span>
            <span class="text-[10px] text-zinc-400">+5 Base Defense</span>
        </button>
        <button onclick="restAtBase()" class="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded text-xs text-left border border-zinc-700 flex justify-between items-center transition-all">
            <span>⛺ Rest & Recover Quarters</span>
            <span class="text-[10px] text-zinc-400">+Sleep, Restore Stamina</span>
        </button>
        <button onclick="triggerRandomEncounter()" class="bg-red-950/60 hover:bg-red-900/60 p-2.5 rounded text-xs text-left border border-red-800 flex justify-between items-center transition-all">
            <span>🔍 Hunt & Investigate Noise</span>
            <span class="text-[10px] text-red-300">Trigger Event</span>
        </button>
    `;
}

// ============================================================================
// COMBAT & TACTICAL SYSTEM
// ============================================================================

function initCombatButtons() {
    const buttons = document.querySelectorAll('.combat-act-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetType = e.currentTarget.dataset.target;
            resolveCombatAction(targetType);
        });
    });
}

function startCombat(enemyName, enemyHp, initialNoise) {
    gameState.combat.active = true;
    gameState.combat.enemyName = enemyName;
    gameState.combat.enemyHp = enemyHp;
    gameState.combat.enemyMaxHp = enemyHp;
    gameState.combat.noiseLevel = initialNoise;

    document.getElementById('enemy-status').innerText = `${enemyName} (${enemyHp} HP)`;
    document.getElementById('noise-meter').innerText = initialNoise;
    
    logEvent(`[COMBAT ENGAGED] Ambushed by ${enemyName}! Threat level: ${initialNoise}`);
    
    // Auto switch to combat tab
    document.querySelector('[data-tab="combat"]').click();
    renderActions();
}

function resolveCombatAction(actionType) {
    if (!gameState.combat.active) {
        logEvent("[COMBAT] No active enemies to engage.");
        return;
    }

    let combatLog = document.getElementById('combat-log');
    let playerDmg = Math.floor(Math.random() * 25) + 15;
    let enemyDmg = Math.floor(Math.random() * 20) + 10;

    if (actionType === 'head') {
        if (Math.random() > 0.4) {
            gameState.combat.enemyHp = 0;
            combatLog.innerHTML += `<p class="text-emerald-400">🎯 Critical Headshot! Instantly neutralized ${gameState.combat.enemyName}.</p>`;
            logEvent(`[COMBAT] Executed a lethal headshot on ${gameState.combat.enemyName}.`);
        } else {
            combatLog.innerHTML += `<p class="text-amber-400">❌ Headshot missed! Loud gunshot echoes through the ruins.</p>`;
            gameState.combat.noiseLevel = "Critical (Horde Attracting)";
            document.getElementById('noise-meter').innerText = gameState.combat.noiseLevel;
        }
    } else if (actionType === 'body') {
        gameState.combat.enemyHp -= playerDmg;
        combatLog.innerHTML += `<p class="text-zinc-300">🛡️ Center mass strike dealt ${playerDmg} damage to ${gameState.combat.enemyName}.</p>`;
    } else if (actionType === 'limb') {
        gameState.combat.enemyHp -= Math.floor(playerDmg * 0.7);
        combatLog.innerHTML += `<p class="text-blue-400">🗡️ Severed enemy limb with melee edge. Noise kept minimal.</p>`;
    } else if (actionType === 'flee') {
        if (Math.random() > 0.3) {
            combatLog.innerHTML += `<p class="text-emerald-400">🏃 Successfully slipped away into the shadows and escaped.</p>`;
            endCombat(true);
            return;
        } else {
            combatLog.innerHTML += `<p class="text-red-400">❌ Escape blocked! You took damage while retreating.</p>`;
            gameState.player.hp -= 15;
        }
    }

    // Enemy counter attack if still alive
    if (gameState.combat.enemyHp > 0 && actionType !== 'flee') {
        gameState.player.hp -= enemyDmg;
        combatLog.innerHTML += `<p class="text-red-400">💥 ${gameState.combat.enemyName} retaliated for ${enemyDmg} damage!</p>`;
        gameState.player.trauma = Math.min(100, gameState.player.trauma + 5);
    } else if (gameState.combat.enemyHp <= 0) {
        combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏆 Victory! ${gameState.combat.enemyName} has been defeated.</p>`;
        endCombat(false);
    }

    combatLog.scrollTop = combatLog.scrollHeight;
    renderVitals();
}

function endCombat(fled) {
    gameState.combat.active = false;
    document.getElementById('enemy-status').innerText = "None";
    document.getElementById('noise-meter').innerText = "Low (Quiet)";
    if (!fled) {
        logEvent("[VICTORY] Area cleared. Looted 1x Scavenged Scrap and 5x 9mm rounds.");
        gameState.inventory.push({ id: 'scrap', name: 'Scavenged Scrap', qty: 1, type: 'material', value: 5 });
    }
    renderActions();
}

// ============================================================================
// SURVIVAL & MEDICAL MECHANICS
// ============================================================================

function amputateLimb(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || limb.amputated) return;

    limb.amputated = true;
    limb.bitten = false;
    limb.condition = "Severed";
    
    gameState.player.hp = Math.max(10, gameState.player.hp - 35);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 35);
    gameState.player.infection = 0; // Cleared infection!

    logEvent(`[SURGERY] Emergency amputation performed on your ${limbKey}. Wildfire spread halted, but severe physiological shock incurred.`);
    renderVitals();
    renderLimbs();
}

function useItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;

    if (item.type === 'consumable') {
        if (item.id === 'water') {
            gameState.player.thirst = Math.min(100, gameState.player.thirst + 40);
        } else {
            gameState.player.hunger = Math.min(100, gameState.player.hunger + 35);
        }
        item.qty -= 1;
        logEvent(`[CONSUMED] Used ${item.name}. Vitals replenished.`);
    } else if (item.type === 'medical') {
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 30);
        item.qty -= 1;
        logEvent(`[MEDICAL] Applied ${item.name}. Restored 30 HP.`);
    }

    if (item.qty <= 0) {
        gameState.inventory.splice(index, 1);
    }

    renderInventory();
    renderVitals();
}

// ============================================================================
// NARRATIVE & PROCEDURAL EVENTS
// ============================================================================

function triggerScavenge() {
    if (gameState.player.stamina < 15) {
        logEvent("[WARNING] You are too physically exhausted to scavenge.");
        return;
    }
    gameState.player.stamina -= 15;
    
    const roll = Math.random();
    if (roll < 0.4) {
        startCombat("Roaming Walker Pack", 60, "Medium");
    } else if (roll < 0.7) {
        const found = Math.floor(Math.random() * 3) + 1;
        gameState.inventory.push({ id: 'canned_beans', name: 'Canned Rations', qty: found, type: 'consumable', value: 10 });
        logEvent(`[SCAVENGE SUCCESS] Scoured abandoned apartment rooms. Found ${found}x Canned Rations.`);
    } else {
        logEvent("[SCAVENGE] Found nothing of use. The area had been picked clean years ago.");
    }
    renderInventory();
    renderVitals();
}

function patrolPerimeter() {
    gameState.base.defense = Math.min(100, gameState.base.defense + 5);
    gameState.player.stamina = Math.max(0, gameState.player.stamina - 10);
    logEvent("[PATROL] Inspected and reinforced the perimeter fence line at Alexandria.");
    renderBase();
    renderVitals();
}

function restAtBase() {
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.stamina = gameState.player.maxStamina;
    gameState.player.sleep = 100;
    gameState.player.trauma = Math.max(0, gameState.player.trauma - 15);
    gameState.hour = (gameState.hour + 8) % 24;
    logEvent("[REST] Slept soundly inside the safe-zone quarters. Mind and body restored.");
    renderVitals();
}

function triggerRandomEncounter() {
    const events = [
        {
            title: "CRM Patrol Interception",
            text: "A Civic Republic Military transport vehicle stops nearby. Soldiers offer medical supplies in exchange for intelligence.",
            action: () => { gameState.factions.crm.standing += 10; logEvent("[CRM] Traded information for medical supplies (+10 CRM Standing)."); }
        },
        {
            title: "Wounded Survivor",
            text: "You encounter a bleeding traveler fleeing from variant walkers.",
            action: () => { gameState.base.population += 1; logEvent("[RECRUIT] Welcomed new survivor into Alexandria (+1 Population)."); }
        }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    logEvent(`[EVENT] ${ev.title}: ${ev.text}`);
    ev.action();
    renderBase();
    renderFactions();
}

function upgradeModule(idx) {
    const mod = gameState.base.modules[idx];
    mod.level += 1;
    logEvent(`[UPGRADE] Upgraded ${mod.name} to Level ${mod.level}.`);
    renderBase();
}

function repairVehicle(idx) {
    const veh = gameState.vehicles[idx];
    veh.condition = Math.min(100, veh.condition + 25);
    logEvent(`[GARAGE] Repaired ${veh.name}. Condition now ${veh.condition}%.`);
    renderVehicles();
}

function launchExpedition(vehicleId) {
    const veh = gameState.vehicles.find(v => v.id === vehicleId);
    if (!veh || veh.fuel < 20) {
        logEvent("[EXPEDITION FAILED] Vehicle requires at least 20% fuel to launch.");
        return;
    }
    veh.fuel -= 20;
    gameState.region = "Manhattan (Dead City Skyscraper Zone)";
    logEvent(`[EXPEDITION] Deployed fleet vehicle to ${gameState.region}. Scavenging high-tier tech.`);
    alert(`Successfully traveled to ${gameState.region}. High-grade loot acquired!`);
    renderVehicles();
}

// ============================================================================
// STORAGE & UTILITY
// ============================================================================

function logEvent(text) {
    const feed = document.getElementById('log-feed');
    if (!feed) return;
    const p = document.createElement('p');
    p.className = 'text-zinc-300 font-mono text-xs';
    p.innerText = text;
    feed.appendChild(p);
    feed.scrollTop = feed.scrollHeight;
}

function saveGame() {
    localStorage.setItem('twd_rpg_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('twd_rpg_save');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(gameState, parsed);
            logEvent("[SYSTEM] Loaded saved game state from localStorage.");
        } catch (e) {
            console.error("Failed to load save", e);
        }
    }
}
