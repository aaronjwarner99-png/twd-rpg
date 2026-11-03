// ============================================================================
// THE WALKING DEAD: ULTIMATE SURVIVAL RPG - ELITE ENGINE (CORE STATE)
// ============================================================================

const gameState = {
    version: "3.5.0-elite",
    saveTimestamp: null,
    playtimeSeconds: 0,
    day: 1,
    hour: 8,
    minute: 0,
    timeOfDay: "Morning",
    weather: "Clear Sky",
    temperature: 72, // Fahrenheit
    radiationLevel: 0, // 0-100 (post-explosion zones)
    currentRegion: "virginia_alexandria",
    unlockedRegions: ["virginia_alexandria"],
    
    player: {
        name: "Aaron James",
        origin: "Alexandria Patrol Leader", // Origin archetype modifier
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        radiation: 0,
        hunger: 85,    // 0-100
        thirst: 90,    // 0-100
        sleep: 95,     // 0-100
        infection: 0,  // 0-100 (Wildfire progression)
        trauma: 5,     // 0-100 (Psychological stress)
        traumaState: "Clear Mind",
        statusEffects: [], // e.g., ["Bleeding", "Concussed", "Adrenaline Rush"]
        
        limbs: {
            head: { condition: "Healthy", bitten: false, bleeding: false, armored: true },
            torso: { condition: "Healthy", bitten: false, bleeding: false, armored: true },
            leftArm: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            rightArm: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            leftLeg: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            rightLeg: { condition: "Healthy", bitten: false, bleeding: false, amputated: false }
        },
        
        skills: {
            melee: 15,     // Blade/Blunt effectiveness
            firearms: 20,  // Accuracy & recoil control
            stealth: 25,   // Footstep noise reduction
            scavenging: 20,// Rare loot drop rate modifier
            medicine: 10   // Surgery success rate & healing efficiency
        },
        
        equipped: {
            weapon: 'machete',
            armor: 'riot_vest',
            backpack: 'tactical_pack'
        }
    },

    inventory: [
        { id: 'machete', name: 'Tactical Machete', qty: 1, type: 'weapon', durability: 95, maxDurability: 100, damage: 28, noise: 'Quiet', value: 35 },
        { id: 'suppressed_pistol', name: 'Silenced Glock 19', qty: 1, type: 'weapon', durability: 90, maxDurability: 100, damage: 45, noise: 'Low', value: 120 },
        { id: 'bandage', name: 'Sterile Trauma Bandage', qty: 5, type: 'medical', effect: 'heals_bleed_30', value: 15 },
        { id: 'antibiotics', name: 'Broad-Spectrum Antibiotics', qty: 2, type: 'medical', effect: 'slows_infection_20', value: 50 },
        { id: 'water', name: 'Purified Water Flask', qty: 3, type: 'consumable', effect: 'thirst_40', value: 10 },
        { id: 'canned_beans', name: 'Canned Chili Beans', qty: 5, type: 'consumable', effect: 'hunger_35', value: 12 },
        { id: 'ammunition_9mm', name: '9mm Hollow-Point Rounds', qty: 32, type: 'ammo', value: 2 },
        { id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: 14, type: 'material', value: 5 },
        { id: 'chemicals', name: 'Solvents & Chemicals', qty: 6, type: 'material', value: 8 },
        { id: 'fabric', name: 'Ballistic Fabric Rolls', qty: 4, type: 'material', value: 6 }
    ],

    companions: [
        { 
            id: 'daryl', 
            name: 'Daryl Dixon', 
            role: 'Tracker & Scout', 
            loyalty: 85, 
            hp: 100, 
            status: 'At Base (Patrolling)',
            weapon: 'Compound Crossbow',
            perk: 'Increases ambush survival and rare meat yield.'
        },
        { 
            id: 'carol', 
            name: 'Carol Peletier', 
            role: 'Infiltration Specialist', 
            loyalty: 80, 
            hp: 100, 
            status: 'At Base (Guarding)',
            weapon: 'Silenced Revolver',
            perk: 'Reduces faction diplomatic penalty risks.'
        },
        { 
            id: 'maggie', 
            name: 'Maggie Rhee', 
            role: 'Hilltop Militia Leader', 
            loyalty: 90, 
            hp: 100, 
            status: 'At Base (Diplomacy)',
            weapon: 'Assault Rifle',
            perk: 'Boosts settlement food production yield.'
        }
    ],

    factions: {
        commonwealth: { 
            name: 'The Commonwealth', 
            standing: 55, 
            status: 'Cautious Alliance',
            leader: 'Governor Pamela Milton (Reformed)',
            territory: 'Ohio Commonwealth Zone',
            perks: 'Access to advanced industrial trade and high-tech weaponry.'
        },
        crm: { 
            name: 'CRM Reconstruction', 
            standing: 25, 
            status: 'Truce / Monitored',
            leader: 'Major General Beale Successors',
            territory: 'Philadelphia / New York Redoubts',
            perks: 'Helicopter transport access and chemical decontamination gear.'
        },
        newBabylon: { 
            name: 'New Babylon', 
            standing: 40, 
            status: 'Neutral Trade Partners',
            leader: 'The Magistrate Judiciary',
            territory: 'New York Tri-State Sector',
            perks: 'Legal immunity vouchers and secure courtroom safe-houses.'
        },
        pouvoir: { 
            name: 'Pouvoir des Vivants', 
            standing: -35, 
            status: 'Hostile Militants',
            leader: 'Genet',
            territory: 'Parisian Union & Spanish Coast',
            perks: 'None (Unlocks variant walker research combat intel).'
        },
        burazi: {
            name: 'The Burazi Methane Cartel',
            standing: -10,
            status: 'Suspicious / Opportunistic',
            leader: 'The Croat (Rival Remnants)',
            territory: 'Manhattan Skyscraper Zone (Dead City)',
            perks: 'Access to illicit black-market explosives and zip-line transit.'
        }
    },

    base: {
        name: "Alexandria Safe-Zone",
        location: "Virginia Outskirts",
        population: 18,
        maxPopulation: 35,
        morale: 78, // 0-100
        defense: 82, // 0-100
        foodRations: 65, // Days remaining
        waterSupply: 70, // Days remaining
        powerGrid: 85, // 0-100%
        treasuryScrap: 45,
        
        modules: [
            { id: 'hydroponics', name: 'Hydroponic Greenhouse', level: 2, workerAssigned: 3, status: 'Active', effect: '+12 Food / Day' },
            { id: 'water_purifier', name: 'River Water Distillation Unit', level: 2, workerAssigned: 2, status: 'Active', effect: '+20 Water / Day' },
            { id: 'watchtower', name: 'Reinforced Sniper Watchtower', level: 3, workerAssigned: 4, status: 'Active', effect: 'Horde Ambush Prevention +40%' },
            { id: 'methane_rig', name: 'Methane Recycler Generator', level: 1, workerAssigned: 1, status: 'Active', effect: '+10 Fuel / Day' },
            { id: 'infirmary', name: 'Surgical Quarantine Infirmary', level: 2, workerAssigned: 2, status: 'Active', effect: 'Infection progression slowed by 50%' },
            { id: 'armory', name: 'Underground Munitions Workshop', level: 1, workerAssigned: 1, status: 'Active', effect: 'Unlocks advanced ammunition crafting' }
        ]
    },

    vehicles: [
        { id: 'bike', name: 'Scavenger Mountain Bike', condition: 95, fuel: 100, maxFuel: 100, armor: 10, noise: 'Ultra-Quiet', unlocked: true, location: 'Alexandria Garage' },
        { id: 'suv', name: 'Armored Patrol SUV', condition: 75, fuel: 65, maxFuel: 100, armor: 60, noise: 'Moderate', unlocked: true, location: 'Alexandria Garage' },
        { id: 'truck', name: 'Heavy Steel-Plated Semi-Truck', condition: 45, fuel: 30, maxFuel: 150, armor: 95, noise: 'Loud (Horde Magnet)', unlocked: true, location: 'Alexandria Garage' },
        { id: 'chopper', name: 'CRM Recon Helicopter (Disabled)', condition: 20, fuel: 10, maxFuel: 100, armor: 80, noise: 'Extreme', unlocked: false, location: 'Hidden Redoubt' }
    ],

    techTree: {
        reinforced_plating: { name: 'Ballistic Armor Plating', researched: true, cost: 30 },
        suppressor_crafting: { name: 'Machined Suppressor Blueprints', researched: true, cost: 25 },
        variant_tracking: { name: 'Variant Walker Tracking & Weakness', researched: false, cost: 50 },
        solar_grid: { name: 'Photovoltaic Solar Array Grid', researched: false, cost: 75 },
        synthetic_antibiotics: { name: 'Chemical Antibiotic Synthesis', researched: false, cost: 60 }
    },

    combat: {
        active: false,
        enemyName: '',
        enemyType: 'walker', // walker, variant_burner, crm_trooper, raider
        enemyHp: 100,
        enemyMaxHp: 100,
        noiseMeterValue: 15, // 0-100
        noiseLevel: 'Low (Quiet)',
        turnCount: 0,
        distanceMeters: 15
    },

    settings: {
        soundEnabled: true,
        difficulty: 'Hardcore Survival',
        autoSaveIntervalMinutes: 5,
        textSpeed: 'Fast'
    }
    // Add to gameState:
    currentSectorId: 'alexandria_core',
    mapNodes: {
        'alexandria_core': {
            id: 'alexandria_core',
            name: 'Alexandria Safe-Zone',
            region: 'virginia_alexandria',
            hazardLevel: 'Low',
            threatType: 'None (Safe Zone)',
            lootTier: 'Standard',
            connectedTo: ['virginia_woods', 'ashei_suburbs'],
            coords: { x: 20, y: 50 },
            description: 'The fortified walls of Alexandria. Your home base.'
        },
        'virginia_woods': {
            id: 'virginia_woods',
            name: 'Whisperer Territory Woods',
            region: 'virginia_alexandria',
            hazardLevel: 'Medium',
            threatType: 'Walker Herds & Lurkers',
            lootTier: 'Uncommon',
            connectedTo: ['alexandria_core', 'crm_outpost_alpha'],
            coords: { x: 40, y: 35 },
            description: 'Dense forest canopy once controlled by the Whisperers.'
        },
        'ashei_suburbs': {
            id: 'ashei_suburbs',
            name: 'Ruined Suburbs',
            region: 'virginia_alexandria',
            hazardLevel: 'Medium',
            threatType: 'Scavenger Ambushes',
            lootTier: 'Uncommon',
            connectedTo: ['alexandria_core', 'manhattan_transit_hub'],
            coords: { x: 45, y: 65 },
            description: 'Looted residential neighborhoods filled with scrap and canned goods.'
        },
        'crm_outpost_alpha': {
            id: 'crm_outpost_alpha',
            name: 'CRM Transit Hub Alpha',
            region: 'crm_redoubt_alpha',
            hazardLevel: 'High',
            threatType: 'CRM Heavy Troops & Sentry Drones',
            lootTier: 'Military High-Tech',
            connectedTo: ['virginia_woods'],
            coords: { x: 70, y: 30 },
            description: 'Restricted Civic Republic Military landing pad and research bunker.'
        },
        'manhattan_transit_hub': {
            id: 'manhattan_transit_hub',
            name: 'Lower Manhattan Skyscraper Ruins',
            region: 'manhattan_dead_city',
            hazardLevel: 'Extreme',
            threatType: 'Burazi Cartel & Acidic Walkers',
            lootTier: 'Rare Exotic',
            connectedTo: ['ashei_suburbs', 'paris_catacombs'],
            coords: { x: 80, y: 75 },
            description: 'The vertical wasteland of Dead City. Methane gas leaks and high-rise swarms.'
        },
        'paris_catacombs': {
            id: 'paris_catacombs',
            name: 'Parisian Underground Catacombs',
            region: 'france_paris_union',
            hazardLevel: 'Nightmare',
            threatType: 'Pouvoir Super-Variant Walkers',
            lootTier: 'Prototype Bio-Tech',
            connectedTo: ['manhattan_transit_hub'],
            coords: { x: 95, y: 85 },
            description: 'Subterranean tunnels holding Genet\'s mutated variant test subjects.'
        }
    },
};
// ============================================================================
// INITIALIZATION, EVENT LISTENERS & APP CONTROLLER
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        logEvent("[SYSTEM] Booting TWD: Ultimate Survival RPG Engine v3.5...");
        loadGame();
        
        // Initialize Subsystems
        initTabs();
        initCombatButtons();
        initHeaderButtons();
        initKeyboardShortcuts();
        initAutosaveTimer();
        
        // Initial Render Pipeline
        renderAll();
        logEvent("[SYSTEM] Core telemetry online. Wasteland monitoring active.");
        
        // Start Game Simulation Tick Loop (Every 10 seconds = 1 in-game hour)
        window.gameInterval = setInterval(gameTick, 10000);

        // Prevent accidental tab closure if progress exists
        window.addEventListener('beforeunload', (e) => {
            if (gameState.day > 1 || gameState.player.hp < 100) {
                saveGame();
            }
        });

    } catch (error) {
        console.error("[CRITICAL BOOT ERROR]", error);
        logEvent("[CRITICAL ERROR] Failed to initialize core systems. Check console.");
    }
});

function initHeaderButtons() {
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveGame();
            showToast("Game state saved to local storage.", "success");
        });
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("⚠️ WARNING: This will permanently wipe your current survival run and reset Alexandria. Proceed?")) {
                localStorage.removeItem('twd_rpg_save');
                location.reload();
            }
        });
    }

    // Optional Export Save Button check
    const exportBtn = document.getElementById('export-save-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportSaveFile);
    }
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTabId = tab.dataset.tab;
            
            // Update active tab styles with visual feedback
            tabs.forEach(t => {
                t.classList.remove('active', 'border-red-600', 'text-red-500', 'bg-zinc-900/80');
                t.classList.add('border-transparent', 'text-zinc-400');
            });
            
            tab.classList.add('active', 'border-red-600', 'text-red-500', 'bg-zinc-900/80');
            tab.classList.remove('border-transparent', 'text-zinc-400');

            // Hide/Show content panels smoothly
            contents.forEach(c => c.classList.add('hidden'));
            const targetContent = document.getElementById(`tab-${targetTabId}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('animate-fadeIn');
            }
        });
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore hotkeys if user is typing in inputs
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        // Ctrl+S or Cmd+S for Quick Save
        if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveGame();
            showToast("Quick-saved game state.", "success");
            return;
        }

        // Number keys 1-5 for Tab switching
        if (e.key >= '1' && e.key <= '5') {
            const tabIndices = ['story', 'combat', 'inventory', 'base', 'factions'];
            const targetTab = tabIndices[parseInt(e.key) - 1];
            if (targetTab) {
                const btn = document.querySelector(`[data-tab="${targetTab}"]`);
                if (btn) btn.click();
            }
        }
    });
}

function initAutosaveTimer() {
    // Autosave every 3 minutes in the background
    setInterval(() => {
        saveGame();
        logEvent("[AUTOSAVE] Local game state synchronized automatically.");
    }, 180000);
}

function showToast(message, type = "info") {
    logEvent(`[NOTIFICATION] ${message}`);
    
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `px-3 py-2 rounded border text-xs font-mono shadow-xl transition-all transform translate-y-2 opacity-0 pointer-events-auto ${
        type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-200' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
    }`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function exportSaveFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `twd_rpg_save_day_${gameState.day}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logEvent("[SYSTEM] Save file JSON exported successfully.");
}
// ============================================================================
// TIME, WEATHER & SURVIVAL TICK ENGINE (ADVANCED SIMULATION)
// ============================================================================

function gameTick() {
    // Advance time by 1 hour
    gameState.hour += 1;
    gameState.playtimeSeconds += 10;

    if (gameState.hour >= 24) {
        gameState.hour = 0;
        gameState.day += 1;
        processDailySettlementCycle();
    }

    // Time of day classification & atmospheric lighting triggers
    if (gameState.hour >= 5 && gameState.hour < 12) {
        gameState.timeOfDay = "Morning";
    } else if (gameState.hour >= 12 && gameState.hour < 17) {
        gameState.timeOfDay = "Afternoon";
    } else if (gameState.hour >= 17 && gameState.hour < 21) {
        gameState.timeOfDay = "Dusk";
    } else {
        gameState.timeOfDay = "Night (High Danger)";
    }

    // Dynamic Weather Shifts with Environmental Impact
    updateWeatherConditions();

    // Temperature & Radiation Fluctuations based on Time & Region
    updateEnvironmentalHazards();

    // Passive Vitals Drain & Physiological Simulation
    processPassiveSurvivalDrain();

    // Infection Progression & Medical Mitigation Check
    processInfectionProgression();

    // Psychological Trauma & Mental State Updates
    updateTraumaState();

    // Trigger UI Renders
    renderAll();
}

function processDailySettlementCycle() {
    logEvent(`[DAY SHIFT] Dawn breaks on Day ${gameState.day} at ${gameState.base.name}.`);

    // Base Module Production Calculation
    let foodGenerated = 0;
    let waterGenerated = 0;
    let fuelGenerated = 0;

    gameState.base.modules.forEach(mod => {
        if (mod.status === 'Active') {
            if (mod.id === 'hydroponics') foodGenerated += (mod.level * 6);
            if (mod.id === 'water_purifier') waterGenerated += (mod.level * 10);
            if (mod.id === 'methane_rig') fuelGenerated += (mod.level * 5);
        }
    });

    // Consumption by Population
    const pop = gameState.base.population;
    const foodConsumed = pop * 2;
    const waterConsumed = pop * 2;

    gameState.base.foodRations = Math.max(0, (gameState.base.foodRations + foodGenerated) - foodConsumed);
    gameState.base.waterSupply = Math.max(0, (gameState.base.waterSupply + waterGenerated) - waterConsumed);
    
    // Add generated fuel to vehicles or treasury
    if (fuelGenerated > 0 && gameState.vehicles[0]) {
        gameState.vehicles[0].fuel = Math.min(gameState.vehicles[0].maxFuel, gameState.vehicles[0].fuel + fuelGenerated);
    }

    logEvent(`[LOGISTICS] Greenhouse produced +${foodGenerated} rations. Purifier produced +${waterGenerated} water. Population consumed ${foodConsumed} units.`);

    // Check Starvation / Dehydration warning for base
    if (gameState.base.foodRations <= 10) {
        gameState.base.morale = Math.max(0, gameState.base.morale - 10);
        showToast("⚠️ WARNING: Base food rations critically low! Survivor morale is dropping.", "warning");
    }

    // Trigger random daily event
    triggerDailySettlementEvent();
}

function updateWeatherConditions() {
    const weathers = [
        { name: "Clear Sky", desc: "Standard visibility. Normal walker movement rates." },
        { name: "Overcast", desc: "Dim lighting. Slightly reduced ranged accuracy." },
        { name: "Acidic Haze", desc: "Corrosive fog. Outdoor exposure drains armor durability slowly." },
        { name: "Torrential Rain", desc: "Heavy downpour. Footstep noise is muffled, lowering walker ambush range." },
        { name: "Dense Fog", desc: "Zero visibility. High risk of sudden walker swarm encounters." }
    ];

    // 20% chance each hour for weather shift
    if (Math.random() < 0.20) {
        const selected = weathers[Math.floor(Math.random() * weathers.length)];
        gameState.weather = selected.name;
        logEvent(`[WEATHER] Atmospheric shift: ${selected.name} — ${selected.desc}`);
    }

    // Apply weather environmental effects
    if (gameState.weather === "Acidic Haze") {
        // Minor armor wear
        gameState.inventory.forEach(item => {
            if (item.type === 'weapon' && item.durability) {
                item.durability = Math.max(10, item.durability - 0.5);
            }
        });
    }
}

function updateEnvironmentalHazards() {
    // Temperature adjustment based on time of day
    if (gameState.timeOfDay.includes("Night")) {
        gameState.temperature = Math.max(35, gameState.temperature - 2);
    } else if (gameState.timeOfDay === "Afternoon") {
        gameState.temperature = Math.min(95, gameState.temperature + 2);
    }

    // Radiation check in redacted zones (like Manhattan or CRM ruins)
    if (gameState.currentRegion.includes("manhattan") || gameState.currentRegion.includes("crm")) {
        gameState.radiationLevel = Math.min(100, gameState.radiationLevel + 1);
        if (gameState.radiationLevel >= 50) {
            gameState.player.hp = Math.max(5, gameState.player.hp - 2);
            logEvent("[RADIATION WARNING] Geiger counter clicking rapidly. Cellular tissue damage detected.");
        }
    }
}

function processPassiveSurvivalDrain() {
    // Passive drain rates
    gameState.player.hunger = Math.max(0, gameState.player.hunger - 2.5);
    gameState.player.thirst = Math.max(0, gameState.player.thirst - 3.5);
    gameState.player.sleep = Math.max(0, gameState.player.sleep - 2);

    // Stamina regeneration or drain based on sleep & rest
    if (gameState.player.sleep > 20) {
        gameState.player.stamina = Math.min(gameState.player.maxStamina, gameState.player.stamina + 8);
    } else {
        // Sleep deprivation stamina penalty
        gameState.player.stamina = Math.max(10, gameState.player.stamina - 5);
        logEvent("[FATIGUE] Severe sleep deprivation is draining your stamina reserves.");
    }

    // Critical Starvation / Dehydration Health Penalties
    if (gameState.player.hunger <= 10) {
        gameState.player.hp = Math.max(5, gameState.player.hp - 6);
        logEvent("[HEALTH] Starvation is causing acute organ failure.");
    }
    if (gameState.player.thirst <= 10) {
        gameState.player.hp = Math.max(5, gameState.player.hp - 10);
        logEvent("[HEALTH] Severe dehydration is causing heat stroke and delirium.");
    }
}

function processInfectionProgression() {
    let bittenLimbs = Object.values(gameState.player.limbs).some(l => l.bitten && !l.amputated);
    
    if (bittenLimbs) {
        // Check if infirmary or antibiotics slow it down
        let infectionRate = 12;
        const hasAntibiotics = gameState.inventory.some(i => i.id === 'antibiotics' && i.qty > 0);
        const hasInfirmary = gameState.base.modules.some(m => m.id === 'infirmary' && m.status === 'Active');

        if (hasInfirmary) infectionRate -= 4;
        if (hasAntibiotics) infectionRate -= 6;

        gameState.player.infection = Math.min(100, gameState.player.infection + Math.max(2, infectionRate));
        logEvent(`[WILDFIRE INFECTION] Pathogen spreading through lymphatic system. Infection: ${gameState.player.infection}%`);

        if (gameState.player.infection >= 100) {
            logEvent("[FATALITY] The Wildfire virus has shut down brain function. You have turned into a walker.");
            alert("💀 Game Over: The infection reached 100%. You turned into a walker.");
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }
    }
}

function updateTraumaState() {
    const t = gameState.player.trauma;
    if (t < 20) {
        gameState.player.traumaState = "Clear Mind";
    } else if (t < 45) {
        gameState.player.traumaState = "Stressed & Jittery (-5% Accuracy)";
    } else if (t < 75) {
        gameState.player.traumaState = "Paranoia & Insomnia (-15% Stamina Regen)";
    } else {
        gameState.player.traumaState = "Severe Psychological Break (Panic Attacks)";
    }
}

function triggerDailySettlementEvent() {
    const events = [
        {
            title: "Rival Scavenger Raid",
            text: "A band of desperate scavengers tested the outer fences last night. Defense held, but fence durability dropped.",
            action: () => { gameState.base.defense = Math.max(10, gameState.base.defense - 15); }
        },
        {
            title: "Wandering Refugees",
            text: "Three displaced civilians arrived at the gates seeking asylum and water.",
            action: () => { 
                gameState.base.population += 3;
                gameState.base.morale = Math.min(100, gameState.base.morale + 5);
            }
        },
        {
            title: "Successful Trader Caravan",
            text: "A Commonwealth trade delegation arrived with surplus medical supplies and canned goods.",
            action: () => {
                gameState.inventory.push({ id: 'bandage', name: 'Sterile Trauma Bandage', qty: 2, type: 'medical', value: 15 });
                gameState.factions.commonwealth.standing += 5;
            }
        }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    logEvent(`[SETTLEMENT EVENT] ${ev.title}: ${ev.text}`);
    ev.action();
}
// ============================================================================
// RENDERING PIPELINE & UI SUBSYSTEM (EXPANDED DISPLAY ENGINE)
// ============================================================================

function renderAll() {
    renderHeader();
    renderVitals();
    renderLimbs();
    renderInventory();
    renderBase();
    renderCompanions();
    renderFactions();
    renderTechTree();
    renderVehicles();
    renderActions();
}

function renderHeader() {
    const dayEl = document.getElementById('day-counter');
    if (!dayEl) return;
    
    const timeFormatted = `${gameState.hour.toString().padStart(2, '0')}:${gameState.minute.toString().padStart(2, '0')}`;
    const regionName = gameState.currentRegion.replace(/_/g, ' ').toUpperCase();
    
    dayEl.innerText = `Day ${gameState.day} • ${timeFormatted} • ${gameState.timeOfDay} • ${gameState.weather} (${gameState.temperature}°F) • Location: ${regionName}`;
}

function renderVitals() {
    // Basic Vitals
    setGauge('hp-val', 'hp-bar', gameState.player.hp, gameState.player.maxHp, 'bg-red-600');
    setGauge('stamina-val', 'stamina-bar', gameState.player.stamina, gameState.player.maxStamina, 'bg-amber-500');
    setGauge('infection-val', 'infection-bar', gameState.player.infection, 100, gameState.player.infection > 50 ? 'bg-red-500 animate-pulse' : 'bg-emerald-600');
    setGauge('trauma-val', 'trauma-bar', gameState.player.trauma, 100, 'bg-purple-600');

    // Secondary Survival Vitals (Rendered if elements exist or dynamically injected)
    if (document.getElementById('hunger-val')) setGauge('hunger-val', 'hunger-bar', Math.round(gameState.player.hunger), 100, 'bg-orange-500');
    if (document.getElementById('thirst-val')) setGauge('thirst-val', 'thirst-bar', Math.round(gameState.player.thirst), 100, 'bg-blue-500');
    if (document.getElementById('sleep-val')) setGauge('sleep-val', 'sleep-bar', Math.round(gameState.player.sleep), 100, 'bg-indigo-500');
    if (document.getElementById('radiation-val')) setGauge('radiation-val', 'radiation-bar', gameState.radiationLevel, 100, 'bg-lime-500 animate-pulse');

    const traumaStateEl = document.getElementById('trauma-state');
    if (traumaStateEl) {
        traumaStateEl.innerText = gameState.player.traumaState;
        traumaStateEl.className = `text-xs px-2 py-0.5 rounded border ${
            gameState.player.trauma > 50 ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
        }`;
    }
}

function setGauge(textId, barId, val, maxVal, colorClass) {
    const textEl = document.getElementById(textId);
    const barEl = document.getElementById(barId);
    if (textEl) textEl.innerText = `${Math.round(val)} / ${maxVal}`;
    if (barEl) {
        const pct = Math.max(0, Math.min(100, (val / maxVal) * 100));
        barEl.style.width = `${pct}%`;
        if (colorClass && !barEl.className.includes(colorClass)) {
            barEl.className = `${colorClass} h-full transition-all duration-300`;
        }
    }
}

function renderLimbs() {
    const container = document.getElementById('limb-container');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(gameState.player.limbs).forEach(([key, limb]) => {
        const div = document.createElement('div');
        const isCritical = limb.bitten || limb.bleeding;
        
        div.className = `p-2.5 rounded border bg-zinc-950 flex flex-col justify-between transition-all ${
            limb.amputated ? 'border-zinc-800 bg-zinc-900/40 opacity-60' :
            limb.bitten ? 'border-red-600 bg-red-950/30' :
            limb.bleeding ? 'border-amber-600 bg-amber-950/20' : 'border-zinc-800 hover:border-zinc-700'
        }`;
        
        let statusText = limb.amputated ? 'AMPUTATED' : limb.bitten ? 'BITTEN!' : limb.bleeding ? 'BLEEDING' : limb.condition;
        let colorClass = limb.amputated ? 'text-zinc-600' : limb.bitten ? 'text-red-500 font-bold animate-pulse' : limb.bleeding ? 'text-amber-400 font-bold' : 'text-emerald-400';

        const nameFormatted = key.replace(/([A-Z])/g, ' $1').toUpperCase();

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-center">
                    <span class="text-zinc-300 font-medium text-[11px]">${nameFormatted}</span>
                    ${limb.armored ? `<span class="text-[9px] bg-blue-950 text-blue-300 px-1 rounded border border-blue-800">ARMORED</span>` : ''}
                </div>
                <span class="${colorClass} text-xs block mt-0.5">${statusText}</span>
            </div>
            ${limb.bitten && !limb.amputated ? `
                <button onclick="amputateLimb('${key}')" class="mt-2 text-[10px] bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded border border-red-700 font-semibold transition-colors flex items-center justify-center gap-1 shadow-md">
                    <span>🔪 Sever Limb</span>
                </button>
            ` : ''}
            ${limb.bleeding && !limb.amputated ? `
                <button onclick="treatBleed('${key}')" class="mt-2 text-[10px] bg-amber-900 hover:bg-amber-800 text-amber-200 px-2 py-1 rounded border border-amber-700 font-semibold transition-colors">
                    🩹 Apply Tourniquet
                </button>
            ` : ''}
        `;
        container.appendChild(div);
    });
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (gameState.inventory.length === 0) {
        grid.innerHTML = '<p class="text-xs text-zinc-500 col-span-full py-4 text-center">Backpack is completely empty.</p>';
        return;
    }

    gameState.inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 text-xs flex flex-col justify-between gap-2 hover:border-zinc-700 transition-all';
        
        let durabilityBar = '';
        if (item.durability !== undefined && item.maxDurability) {
            const pct = (item.durability / item.maxDurability) * 100;
            durabilityBar = `
                <div class="w-full bg-zinc-800 h-1 rounded overflow-hidden mt-1">
                    <div class="${pct < 30 ? 'bg-red-500' : 'bg-emerald-500'} h-full" style="width: ${pct}%"></div>
                </div>
            `;
        }

        const isEquipped = gameState.player.equipped.weapon === item.id || gameState.player.equipped.armor === item.id;

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-start">
                    <span class="font-semibold text-zinc-200 block truncate">${item.name} ${isEquipped ? '<span class="text-emerald-400 text-[9px]">(Equipped)</span>' : ''}</span>
                    <span class="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[10px] text-zinc-300">x${item.qty}</span>
                </div>
                <div class="flex justify-between items-center text-[10px] text-zinc-500 capitalize mt-0.5">
                    <span>${item.type}</span>
                    <span>Value: ${item.value || 1} Scrap</span>
                </div>
                ${durabilityBar}
            </div>
            <div class="flex items-center gap-1.5 mt-1 border-t border-zinc-900 pt-1.5">
                ${(item.type === 'consumable' || item.type === 'medical') ? `
                    <button onclick="useItem(${index})" class="flex-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 py-1 rounded text-[10px] border border-emerald-800 font-medium">Use</button>
                ` : ''}
                ${(item.type === 'weapon' || item.type === 'armor') && !isEquipped ? `
                    <button onclick="equipItem('${item.id}')" class="flex-1 bg-blue-950 hover:bg-blue-900 text-blue-300 py-1 rounded text-[10px] border border-blue-800 font-medium">Equip</button>
                ` : ''}
                <button onclick="discardItem(${index})" class="bg-zinc-900 hover:bg-red-950 hover:text-red-300 text-zinc-500 px-2 py-1 rounded text-[10px] border border-zinc-800 transition-colors">Discard</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

function renderBase() {
    const popEl = document.getElementById('base-pop');
    const defEl = document.getElementById('base-def');
    const foodEl = document.getElementById('base-food');

    if (popEl) popEl.innerText = `${gameState.base.population} / ${gameState.base.maxPopulation}`;
    if (defEl) defEl.innerText = `${gameState.base.defense}%`;
    if (foodEl) foodEl.innerText = `${gameState.base.foodRations} Days`;

    // Render Morale and Power Grid if elements exist
    if (document.getElementById('base-morale')) document.getElementById('base-morale').innerText = `${gameState.base.morale}%`;
    if (document.getElementById('base-power')) document.getElementById('base-power').innerText = `${gameState.base.powerGrid}%`;

    const modulesContainer = document.getElementById('base-modules');
    if (!modulesContainer) return;
    modulesContainer.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Facility Modules & Upgrades</h3>';

    gameState.base.modules.forEach((mod, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center text-xs hover:border-zinc-700 transition-all';
        div.innerHTML = `
            <div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold text-zinc-200">${mod.name}</span>
                    <span class="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">Lvl ${mod.level}</span>
                </div>
                <span class="text-[10px] text-emerald-400 block mt-0.5">Yield: ${mod.effect} | Assigned Workers: ${mod.workerAssigned}</span>
            </div>
            <button onclick="upgradeModule(${idx})" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded border border-zinc-700 text-[10px] font-semibold transition-colors">
                Upgrade (50 Scrap)
            </button>
        `;
        modulesContainer.appendChild(div);
    });
}

function renderCompanions() {
    let container = document.getElementById('companion-list');
    if (!container) {
        const baseTab = document.getElementById('tab-base');
        if (baseTab) {
            container = document.createElement('div');
            container.id = 'companion-list';
            container.className = 'mt-4 space-y-2';
            baseTab.appendChild(container);
        }
    }
    if (!container) return;

    container.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Roster Companions & Squad</h3>';

    gameState.companions.forEach((comp, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-zinc-200">${comp.name}</span>
                    <span class="text-[10px] text-amber-400 font-medium">(${comp.role})</span>
                </div>
                <span class="text-[10px] text-zinc-400 block mt-0.5">Weapon: ${comp.weapon} | Perk: ${comp.perk}</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <span class="text-[10px] text-zinc-500 block">Loyalty</span>
                    <span class="font-mono text-emerald-400 font-bold text-xs">${comp.loyalty}%</span>
                </div>
                <button onclick="assignCompanionTask(${idx})" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 text-[10px]">Assign</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderFactions() {
    const list = document.getElementById('faction-list');
    if (!list) return;
    list.innerHTML = '';

    Object.values(gameState.factions).forEach(fac => {
        const div = document.createElement('div');
        const isHostile = fac.standing < 0;
        
        div.className = `p-3 rounded border bg-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
            isHostile ? 'border-red-950/60' : 'border-zinc-800'
        }`;
        
        div.innerHTML = `
            <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-zinc-200 text-xs">${fac.name}</span>
                    <span class="text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                        isHostile ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }">${fac.status}</span>
                </div>
                <p class="text-[10px] text-zinc-400">${fac.territory} • Leader: ${fac.leader}</p>
                <p class="text-[10px] text-amber-300/80 italic">${fac.perks}</p>
            </div>
            <div class="flex items-center gap-3 self-end sm:self-center">
                <div class="text-right">
                    <span class="text-[9px] text-zinc-500 block uppercase">Reputation</span>
                    <span class="font-bold font-mono text-sm ${isHostile ? 'text-red-400' : 'text-emerald-400'}">
                        ${fac.standing >= 0 ? '+' : ''}${fac.standing}
                    </span>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderTechTree() {
    let techContainer = document.getElementById('tech-tree-container');
    if (!techContainer) {
        const baseTab = document.getElementById('tab-base');
        if (baseTab) {
            techContainer = document.createElement('div');
            techContainer.id = 'tech-tree-container';
            techContainer.className = 'mt-4 space-y-2';
            baseTab.appendChild(techContainer);
        }
    }
    if (!techContainer) return;

    techContainer.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Settlement Research & Tech Tree</h3>';

    Object.entries(gameState.techTree).forEach(([key, tech]) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-semibold text-zinc-200">${tech.name}</span>
                <span class="text-[10px] block ${tech.researched ? 'text-emerald-400' : 'text-zinc-500'}">
                    ${tech.researched ? '✓ Researched & Active' : `Cost: ${tech.cost} Scrap`}
                </span>
            </div>
            ${!tech.researched ? `
                <button onclick="researchTech('${key}')" class="bg-blue-950 hover:bg-blue-900 text-blue-200 px-2.5 py-1 rounded border border-blue-800 text-[10px] font-semibold">
                    Research
                </button>
            ` : ''}
        `;
        techContainer.appendChild(div);
    });
}

function renderVehicles() {
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
    garage.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Vehicle Fleet & Expeditions</h3>';

    gameState.vehicles.forEach((veh, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs';
        div.innerHTML = `
            <div>
                <div class="flex items-center gap-2">
                    <span class="font-semibold text-zinc-200">${veh.name}</span>
                    <span class="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">${veh.noise}</span>
                </div>
                <span class="text-[10px] text-zinc-400 block mt-0.5">Condition: ${veh.condition}% | Fuel: ${veh.fuel}/${veh.maxFuel} L | Armor: ${veh.armor}%</span>
            </div>
            <div class="flex gap-1.5 self-end sm:self-center">
                <button onclick="repairVehicle(${idx})" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 text-[10px]">Repair</button>
                <button onclick="launchExpedition('${veh.id}')" class="bg-red-950 hover:bg-red-900 text-red-200 px-2.5 py-1 rounded border border-red-800 text-[10px] font-semibold">
                    Deploy Expedition
                </button>
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
            <div class="col-span-full bg-red-950/40 border border-red-800 p-3.5 rounded-lg text-center animate-pulse">
                <p class="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">⚠️ COMBAT ENCOUNTER IN PROGRESS: ${gameState.combat.enemyName}</p>
                <p class="text-zinc-300 text-xs font-mono">Enemy Integrity: ${gameState.combat.enemyHp} / ${gameState.combat.enemyMaxHp} HP</p>
                <p class="text-zinc-400 text-[10px] mt-1.5">Open the <strong class="text-red-400">Combat Tab</strong> above to select body targets, manage noise, or flee!</p>
            </div>
        `;
        return;
    }

    actionBox.innerHTML = `
        <button onclick="triggerScavenge()" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-xs text-left border border-zinc-700 flex justify-between items-center transition-all group">
            <div>
                <span class="font-semibold text-zinc-200 block group-hover:text-red-400 transition-colors">🎒 Scavenge Local Sector</span>
                <span class="text-[10px] text-zinc-400 block mt-0.5">Scour abandoned ruins for ammo, medical gear, and scrap metal</span>
            </div>
            <span class="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-700 text-zinc-400">-15 Stamina</span>
        </button>
        <button onclick="patrolPerimeter()" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-xs text-left border border-zinc-700 flex justify-between items-center transition-all group">
            <div>
                <span class="font-semibold text-zinc-200 block group-hover:text-red-400 transition-colors">🏹 Patrol Outer Wire</span>
                <span class="text-[10px] text-zinc-400 block mt-0.5">Suppress lurking threats and reinforce settlement defenses</span>
            </div>
            <span class="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-700 text-zinc-400">+5 Base Def</span>
        </button>
        <button onclick="restAtBase()" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-xs text-left border border-zinc-700 flex justify-between items-center transition-all group">
            <div>
                <span class="font-semibold text-zinc-200 block group-hover:text-red-400 transition-colors">⛺ Rest & Recover</span>
                <span class="text-[10px] text-zinc-400 block mt-0.5">Sleep 8 hours inside secure quarters to restore stamina and trauma</span>
            </div>
            <span class="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-700 text-emerald-400">+Rest & Health</span>
        </button>
        <button onclick="triggerRandomEncounter()" class="bg-red-950/60 hover:bg-red-900/60 p-3 rounded-lg text-xs text-left border border-red-800 flex justify-between items-center transition-all group">
            <div>
                <span class="font-bold text-red-300 block group-hover:text-red-200 transition-colors">🔍 Scout Distant Noises</span>
                <span class="text-[10px] text-red-400/80 block mt-0.5">Investigate gunfire, signal flares, or faction distress calls</span>
            </div>
            <span class="text-[10px] font-mono bg-red-900/80 px-2 py-1 rounded border border-red-700 text-red-200">Trigger Event</span>
        </button>
    `;
}
// ============================================================================
// COMBAT & TACTICAL SYSTEM (ADVANCED ENGAGEMENT ENGINE)
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

function startCombat(enemyName, enemyHp, initialNoise = 15, enemyType = 'walker') {
    gameState.combat.active = true;
    gameState.combat.enemyName = enemyName;
    gameState.combat.enemyType = enemyType;
    gameState.combat.enemyHp = enemyHp;
    gameState.combat.enemyMaxHp = enemyHp;
    gameState.combat.noiseMeterValue = initialNoise;
    gameState.combat.turnCount = 0;
    gameState.combat.distanceMeters = enemyType === 'crm_trooper' ? 25 : 10;
    
    updateNoiseMeterDisplay();

    const statusEl = document.getElementById('enemy-status');
    if (statusEl) {
        statusEl.innerText = `${enemyName} (${enemyHp} HP)`;
    }

    const combatLog = document.getElementById('combat-log');
    if (combatLog) {
        combatLog.innerHTML = `<p class="text-red-400 font-bold">[ENGAGEMENT STARTED] ${enemyName} spotted at ${gameState.combat.distanceMeters}m!</p>`;
    }

    logEvent(`[COMBAT ENGAGED] Threat detected: ${enemyName} (${enemyType.toUpperCase()}). Distance: ${gameState.combat.distanceMeters}m.`);
    
    // Auto switch to combat tab
    const combatTabBtn = document.querySelector('[data-tab="combat"]');
    if (combatTabBtn) combatTabBtn.click();
    renderActions();
}

function resolveCombatAction(actionType) {
    if (!gameState.combat.active) {
        logEvent("[COMBAT] No active enemies to engage.");
        return;
    }

    gameState.combat.turnCount += 1;
    let combatLog = document.getElementById('combat-log');
    if (!combatLog) return;

    // Retrieve equipped weapon details
    const equippedWeapon = gameState.inventory.find(i => i.id === gameState.player.equipped.weapon) || {
        name: 'Unarmed / Fists',
        damage: 10,
        noise: 'Silent',
        type: 'weapon',
        durability: 100
    };

    // Skill & Stat Modifiers
    const firearmsSkill = gameState.player.skills.firearms || 10;
    const meleeSkill = gameState.player.skills.melee || 10;
    const stealthSkill = gameState.player.skills.stealth || 10;

    let baseDamage = equippedWeapon.damage || 20;
    let hitChance = 0.75;
    let actionNoise = 5;
    let ammoCost = 0;

    // Check weapon type and resource requirements
    if (equippedWeapon.id === 'suppressed_pistol') {
        ammoCost = 1;
        const ammoItem = gameState.inventory.find(i => i.id === 'ammunition_9mm');
        if (!ammoItem || ammoItem.qty < ammoCost) {
            combatLog.innerHTML += `<p class="text-amber-400">⚠️ Out of 9mm ammunition! Forced to strike with rifle stock / melee.</p>`;
            baseDamage = 8;
            actionNoise = 10;
        } else {
            ammoItem.qty -= ammoCost;
            baseDamage += Math.floor(firearmsSkill * 0.5);
            actionNoise = 12; // Suppressed gunshot noise rating
        }
    } else {
        baseDamage += Math.floor(meleeSkill * 0.6);
        actionNoise = 3; // Melee swing noise
    }

    // Degrade weapon durability
    if (equippedWeapon.durability !== undefined) {
        equippedWeapon.durability = Math.max(0, equippedWeapon.durability - 1);
        if (equippedWeapon.durability === 0) {
            combatLog.innerHTML += `<p class="text-red-500 font-bold">⚠️ ${equippedWeapon.name} broke during combat!</p>`;
        }
    }

    // Weather Noise Modifier (Rain muffles sound, clear skies amplify)
    if (gameState.weather === "Torrential Rain") actionNoise = Math.floor(actionNoise * 0.5);
    if (gameState.weather === "Clear Sky") actionNoise = Math.floor(actionNoise * 1.2);

    gameState.combat.noiseMeterValue = Math.min(100, gameState.combat.noiseMeterValue + actionNoise);
    updateNoiseMeterDisplay();

    // Action Logic
    if (actionType === 'head') {
        hitChance = 0.45 + (firearmsSkill * 0.01) - (gameState.player.trauma * 0.003);
        if (Math.random() < hitChance) {
            const headshotDmg = Math.floor(baseDamage * 2.5);
            gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - headshotDmg);
            combatLog.innerHTML += `<p class="text-emerald-400">🎯 CRITICAL HEADSHOT! Dealt ${headshotDmg} lethal damage to ${gameState.combat.enemyName}.</p>`;
            logEvent(`[COMBAT] Executed headshot on ${gameState.combat.enemyName} for ${headshotDmg} DMG.`);
        } else {
            combatLog.innerHTML += `<p class="text-amber-400">❌ Headshot missed! Shot struck nearby debris.</p>`;
        }

    } else if (actionType === 'body') {
        hitChance = 0.85 + (meleeSkill * 0.005);
        if (Math.random() < hitChance) {
            gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - baseDamage);
            combatLog.innerHTML += `<p class="text-zinc-300">🛡️ Center mass strike hit ${gameState.combat.enemyName} for ${baseDamage} damage.</p>`;
        } else {
            combatLog.innerHTML += `<p class="text-amber-400">❌ Center mass attack dodged/deflected.</p>`;
        }

    } else if (actionType === 'limb') {
        hitChance = 0.70;
        const severDmg = Math.floor(baseDamage * 0.8);
        if (Math.random() < hitChance) {
            gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - severDmg);
            combatLog.innerHTML += `<p class="text-blue-400">🗡️ Crippling limb Strike dealt ${severDmg} damage! Enemy attack power reduced.</p>`;
        } else {
            combatLog.innerHTML += `<p class="text-amber-400">❌ Limb target strike missed.</p>`;
        }

    } else if (actionType === 'flee') {
        const fleeChance = 0.40 + (stealthSkill * 0.01) - (gameState.combat.noiseMeterValue * 0.003);
        if (Math.random() < fleeChance) {
            combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏃 Successfully broke line of sight and escaped into cover.</p>`;
            endCombat(true);
            return;
        } else {
            combatLog.innerHTML += `<p class="text-red-400">❌ Escape route blocked! Take damage while retreating.</p>`;
            gameState.player.hp = Math.max(0, gameState.player.hp - 15);
        }
    }

    // Check Noise Swarm Threshold
    if (gameState.combat.noiseMeterValue >= 85) {
        combatLog.innerHTML += `<p class="text-red-500 font-bold animate-pulse">🔊 NOISE THRESHOLD EXCEEDED! Gunfire noise attracted a roaming Walker Swarm!</p>`;
        gameState.combat.enemyHp += 35; // Reinforcements join
        gameState.combat.enemyMaxHp += 35;
        gameState.combat.enemyName = "Walker Swarm Horde";
        logEvent("[HORDE ALERT] High noise summoned a walker swarm!");
    }

    // Enemy Counter Attack Phase (If enemy survives)
    if (gameState.combat.enemyHp > 0 && actionType !== 'flee') {
        resolveEnemyCounterAttack(combatLog);
    } else if (gameState.combat.enemyHp <= 0) {
        combatLog.innerHTML += `<p class="text-emerald-400 font-bold text-sm mt-2">🏆 VICTORY! ${gameState.combat.enemyName} neutralized.</p>`;
        endCombat(false);
    }

    combatLog.scrollTop = combatLog.scrollHeight;
    renderVitals();
    renderInventory();
}

function resolveEnemyCounterAttack(combatLog) {
    let enemyDmg = Math.floor(Math.random() * 15) + 8;
    const enemyType = gameState.combat.enemyType;

    // Enemy Type Modifiers
    if (enemyType === 'variant_burner') {
        enemyDmg += 8;
        combatLog.innerHTML += `<p class="text-orange-400">🔥 Burner Walker splashed acidic embers!</p>`;
    } else if (enemyType === 'crm_trooper') {
        enemyDmg += 12;
        combatLog.innerHTML += `<p class="text-red-400">💥 CRM Trooper fired automatic burst!</p>`;
    }

    // Player Armor Mitigation
    const bodyArmor = gameState.inventory.find(i => i.id === gameState.player.equipped.armor);
    if (bodyArmor) {
        enemyDmg = Math.max(2, Math.floor(enemyDmg * 0.5));
    }

    gameState.player.hp = Math.max(0, gameState.player.hp - enemyDmg);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 4);
    combatLog.innerHTML += `<p class="text-red-400">💥 ${gameState.combat.enemyName} attacked dealing ${enemyDmg} damage to your torso.</p>`;

    // Bite Chance on Walker Attacks if Unarmored
    if (enemyType.includes('walker') && !bodyArmor && Math.random() < 0.18) {
        const limbs = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
        const targetLimbKey = limbs[Math.floor(Math.random() * limbs.length)];
        const limb = gameState.player.limbs[targetLimbKey];

        if (limb && !limb.amputated && !limb.bitten) {
            limb.bitten = true;
            combatLog.innerHTML += `<p class="text-red-600 font-bold animate-pulse">🩸 CRITICAL BITE! ${targetLimbKey.toUpperCase()} WAS BITTEN!</p>`;
            logEvent(`[WILDFIRE BITE] Critical injury! Your ${targetLimbKey} was bitten during combat.`);
            renderLimbs();
        }
    }

    // Check Player Defeat
    if (gameState.player.hp <= 0) {
        combatLog.innerHTML += `<p class="text-red-600 font-bold text-sm">💀 FATAL ERROR: You were slain in combat.</p>`;
        alert("Game Over: You succumbed to injuries in combat.");
        localStorage.removeItem('twd_rpg_save');
        location.reload();
    }
}

function updateNoiseMeterDisplay() {
    const val = gameState.combat.noiseMeterValue;
    let label = "Low (Quiet)";
    let color = "text-emerald-400";

    if (val > 30 && val <= 60) {
        label = "Moderate (Echoing)";
        color = "text-amber-400";
    } else if (val > 60 && val <= 85) {
        label = "High (Dangerous)";
        color = "text-orange-500";
    } else if (val > 85) {
        label = "CRITICAL (SWARM ATTRACTING)";
        color = "text-red-600 font-bold animate-pulse";
    }

    gameState.combat.noiseLevel = label;
    const meterEl = document.getElementById('noise-meter');
    if (meterEl) {
        meterEl.innerText = `${label} (${val}%)`;
        meterEl.className = `text-sm font-bold ${color}`;
    }
}

function endCombat(fled) {
    gameState.combat.active = false;
    
    const enemyStatusEl = document.getElementById('enemy-status');
    if (enemyStatusEl) enemyStatusEl.innerText = "None";

    if (!fled) {
        const ammoLoot = Math.floor(Math.random() * 8) + 4;
        const scrapLoot = Math.floor(Math.random() * 3) + 1;

        logEvent(`[VICTORY] Defeated ${gameState.combat.enemyName}. Looted ${scrapLoot}x Industrial Scrap and ${ammoLoot}x 9mm rounds.`);

        // Add loot to inventory
        const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
        if (scrapItem) scrapItem.qty += scrapLoot;
        else gameState.inventory.push({ id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: scrapLoot, type: 'material', value: 5 });

        const ammoItem = gameState.inventory.find(i => i.id === 'ammunition_9mm');
        if (ammoItem) ammoItem.qty += ammoLoot;
        else gameState.inventory.push({ id: 'ammunition_9mm', name: '9mm Hollow-Point Rounds', qty: ammoLoot, type: 'ammo', value: 2 });
    }

    renderInventory();
    renderActions();
}

// ============================================================================
// SURVIVAL & MEDICAL MECHANICS (SURGICAL & INVENTORY SUBSYSTEM)
// ============================================================================

function amputateLimb(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || limb.amputated) return;

    // Check if player has medical tools or bandage
    const hasBandage = gameState.inventory.some(i => i.id === 'bandage' && i.qty > 0);
    if (!hasBandage) {
        showToast("⚠️ Surgery requires at least 1x Sterile Bandage to stem blood loss!", "warning");
        logEvent("[SURGERY FAILED] Attempted amputation without sterile medical bandages. Refused due to hemorrhage risk.");
        return;
    }

    // Consume bandage
    const bandageItem = gameState.inventory.find(i => i.id === 'bandage');
    if (bandageItem) {
        bandageItem.qty -= 1;
        if (bandageItem.qty <= 0) {
            gameState.inventory = gameState.inventory.filter(i => i !== bandageItem);
        }
    }

    limb.amputated = true;
    limb.bitten = false;
    limb.bleeding = false;
    limb.condition = "Severed";
    
    // Physiological shock penalties
    gameState.player.hp = Math.max(10, gameState.player.hp - 35);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 35);
    gameState.player.infection = 0; // Cleared Wildfire infection!

    logEvent(`[SURGERY SUCCESS] Emergency field amputation performed on your ${limbKey}. The infection spread was halted, but severe physiological shock was incurred!`);
    showToast(`Amputated ${limbKey}. Infection halted!`, "success");
    
    renderVitals();
    renderLimbs();
    renderInventory();
}

function treatBleed(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || !limb.bleeding) return;

    const bandage = gameState.inventory.find(i => i.id === 'bandage' && i.qty > 0);
    if (!bandage) {
        showToast("⚠️ Need Sterile Bandage to apply tourniquet!", "warning");
        return;
    }

    bandage.qty -= 1;
    if (bandage.qty <= 0) {
        gameState.inventory = gameState.inventory.filter(i => i !== bandage);
    }

    limb.bleeding = false;
    logEvent(`[MEDICAL] Applied tourniquet and sterile bandage to ${limbKey}. Hemorrhage stopped.`);
    showToast(`Treated bleeding on ${limbKey}`, "success");

    renderLimbs();
    renderInventory();
}

function useItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;

    let used = false;

    if (item.type === 'consumable') {
        if (item.id === 'water' || item.name.toLowerCase().includes('water')) {
            gameState.player.thirst = Math.min(100, gameState.player.thirst + 40);
            logEvent(`[CONSUMED] Drank ${item.name}. Thirst replenished.`);
            used = true;
        } else {
            gameState.player.hunger = Math.min(100, gameState.player.hunger + 35);
            logEvent(`[CONSUMED] Ate ${item.name}. Hunger replenished.`);
            used = true;
        }
    } else if (item.type === 'medical') {
        if (item.id === 'antibiotics') {
            gameState.player.infection = Math.max(0, gameState.player.infection - 25);
            logEvent(`[MEDICAL] Ingested ${item.name}. Pathogen viral load suppressed.`);
            showToast("Antibiotics suppressed infection!", "success");
            used = true;
        } else {
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 30);
            // Also heal bleeding if any limb is bleeding
            Object.values(gameState.player.limbs).forEach(l => { if (l.bleeding) l.bleeding = false; });
            logEvent(`[MEDICAL] Applied ${item.name}. Restored 30 HP and staunched bleeding.`);
            showToast("Applied trauma bandage (+30 HP)", "success");
            used = true;
        }
    }

    if (used) {
        item.qty -= 1;
        if (item.qty <= 0) {
            gameState.inventory.splice(index, 1);
        }
    }

    renderInventory();
    renderVitals();
    renderLimbs();
}

function equipItem(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === 'weapon') {
        gameState.player.equipped.weapon = item.id;
        logEvent(`[EQUIP] Equipped weapon: ${item.name}.`);
        showToast(`Equipped ${item.name}`, "success");
    } else if (item.type === 'armor') {
        gameState.player.equipped.armor = item.id;
        logEvent(`[EQUIP] Equipped armor plating: ${item.name}.`);
        showToast(`Equipped ${item.name}`, "success");
    }

    renderInventory();
}

function discardItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;

    if (confirm(`Are you sure you want to discard ${item.name} (x${item.qty})?`)) {
        logEvent(`[INVENTORY] Discarded ${item.qty}x ${item.name} into the wasteland.`);
        gameState.inventory.splice(index, 1);
        renderInventory();
        showToast("Item discarded", "info");
    }
}

// ============================================================================
// NARRATIVE, BASE, TECH & FLEET OPERATIONS SUBSYSTEM
// ============================================================================

function triggerScavenge() {
    if (gameState.player.stamina < 15) {
        showToast("⚠️ Too physically exhausted to scavenge!", "warning");
        logEvent("[WARNING] You are too physically exhausted to scavenge.");
        return;
    }

    gameState.player.stamina -= 15;
    const scavengingSkill = gameState.player.skills.scavenging || 10;
    const roll = Math.random();

    // Weather impact on scavenging risks
    let combatThreshold = 0.35;
    if (gameState.weather === "Dense Fog") combatThreshold = 0.55;
    if (gameState.weather === "Torrential Rain") combatThreshold = 0.25;

    logEvent(`[SCAVENGE] Searching sectors in ${gameState.currentRegion.replace(/_/g, ' ').toUpperCase()}...`);

    if (roll < combatThreshold) {
        // Dynamic enemy encounter selection
        const enemies = [
            { name: "Roaming Walker Horde", hp: 60, noise: 20, type: "walker" },
            { name: "Burner Variant Walker", hp: 75, noise: 25, type: "variant_burner" },
            { name: "Desperate Burazi Raider", hp: 85, noise: 40, type: "raider" },
            { name: "Rogue CRM Patrol Sentry", hp: 110, noise: 50, type: "crm_trooper" }
        ];
        const selected = enemies[Math.floor(Math.random() * enemies.length)];
        startCombat(selected.name, selected.hp, selected.noise, selected.type);

    } else if (roll < 0.75) {
        // Region-based loot table
        const quantity = Math.floor(Math.random() * 3) + 1 + Math.floor(scavengingSkill / 10);
        let lootItem = { id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: quantity, type: 'material', value: 5 };

        if (gameState.currentRegion.includes("manhattan")) {
            lootItem = { id: 'chemicals', name: 'Solvents & Chemicals', qty: quantity, type: 'material', value: 8 };
        } else if (gameState.currentRegion.includes("crm")) {
            lootItem = { id: 'ammunition_9mm', name: '9mm Hollow-Point Rounds', qty: quantity * 6, type: 'ammo', value: 2 };
        } else {
            const pool = [
                { id: 'canned_beans', name: 'Canned Rations', qty: quantity, type: 'consumable', value: 10 },
                { id: 'bandage', name: 'Sterile Trauma Bandage', qty: Math.max(1, Math.floor(quantity / 2)), type: 'medical', value: 15 },
                { id: 'water', name: 'Purified Water Flask', qty: quantity, type: 'consumable', value: 10 }
            ];
            lootItem = pool[Math.floor(Math.random() * pool.length)];
        }

        // Add or stack loot
        const existing = gameState.inventory.find(i => i.id === lootItem.id);
        if (existing) {
            existing.qty += lootItem.qty;
        } else {
            gameState.inventory.push(lootItem);
        }

        logEvent(`[SCAVENGE SUCCESS] Scoured abandoned sector. Found ${lootItem.qty}x ${lootItem.name}.`);
        showToast(`Found ${lootItem.qty}x ${lootItem.name}!`, "success");

    } else {
        logEvent("[SCAVENGE] Searched the ruins thoroughly, but the area had been picked clean years ago.");
    }

    renderInventory();
    renderVitals();
}

function patrolPerimeter() {
    if (gameState.player.stamina < 10) {
        showToast("⚠️ Too exhausted for perimeter patrol!", "warning");
        return;
    }

    gameState.player.stamina = Math.max(0, gameState.player.stamina - 10);
    const boost = Math.floor(Math.random() * 4) + 4;
    gameState.base.defense = Math.min(100, gameState.base.defense + boost);

    logEvent(`[PATROL] Inspected outer fences at ${gameState.base.name}. Settlement defense increased by +${boost}%.`);
    showToast(`Base Defense +${boost}%`, "success");

    // Random chance of spotting lurking threat during patrol
    if (Math.random() < 0.20) {
        logEvent("[PATROL ALERT] Ambushed a lurking walker near the east watchtower!");
        startCombat("Perimeter Lurker Walker", 45, 10, "walker");
    }

    renderBase();
    renderVitals();
}

function restAtBase() {
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.stamina = gameState.player.maxStamina;
    gameState.player.sleep = 100;
    gameState.player.trauma = Math.max(0, gameState.player.trauma - 20);

    // Fast-forward time by 8 hours
    gameState.hour = (gameState.hour + 8) % 24;
    if (gameState.hour < 8) gameState.day += 1;

    logEvent("[REST] Slept soundly inside the reinforced quarters. Physical fatigue and psychological trauma restored.");
    showToast("Restored Health, Stamina, and Sleep!", "success");

    renderVitals();
    renderHeader();
}

function triggerRandomEncounter() {
    const events = [
        {
            title: "CRM Reconnaissance Interception",
            text: "A heavily armored Civic Republic Military transport grounds nearby. Sentry officers offer surplus ammunition in exchange for intelligence on regional raider positions.",
            optionA: "Share Intelligence (+15 CRM Standing, +20 Ammo)",
            actionA: () => {
                gameState.factions.crm.standing += 15;
                const ammo = gameState.inventory.find(i => i.id === 'ammunition_9mm');
                if (ammo) ammo.qty += 20;
                else gameState.inventory.push({ id: 'ammunition_9mm', name: '9mm Hollow-Point Rounds', qty: 20, type: 'ammo', value: 2 });
                logEvent("[CRM DIPLOMACY] Exchanged tactical intelligence with CRM patrol for 20x 9mm rounds.");
                showToast("Gained 20x 9mm ammo (+15 CRM Standing)", "success");
            }
        },
        {
            title: "Displaced Survivor Outpost",
            text: "You stumble across a small family barricaded inside a service station, surrounded by three fast variant walkers.",
            optionA: "Intervene & Rescue (+1 Population, +10 Base Morale)",
            actionA: () => {
                startCombat("Fast Runner Variant Walkers", 80, 20, "walker");
                gameState.base.population += 1;
                gameState.base.morale = Math.min(100, gameState.base.morale + 10);
                logEvent("[RESCUE] Rescued survivors and welcomed them to Alexandria.");
            }
        },
        {
            title: "Burazi Methane Cartel Ambush",
            text: "New York raiders loyal to the Croat attempt to seize your scavenged scrap at gunpoint.",
            optionA: "Fight Raiders",
            actionA: () => {
                startCombat("Burazi Cartel Enforcer", 95, 30, "raider");
                gameState.factions.burazi.standing -= 15;
            }
        },
        {
            title: "New Babylon Magistrate Patrol",
            text: "Judicial officers from New Babylon audit your travel papers and request a resource tax.",
            optionA: "Pay Tax (-10 Scrap, +10 Babylon Standing)",
            actionA: () => {
                const scrap = gameState.inventory.find(i => i.id === 'scrap_metal');
                if (scrap && scrap.qty >= 10) {
                    scrap.qty -= 10;
                    gameState.factions.newBabylon.standing += 10;
                    logEvent("[NEW BABYLON] Paid legal transit tax to Magistrate officers.");
                    showToast("Paid 10 Scrap (+10 Babylon Standing)", "info");
                } else {
                    logEvent("[NEW BABYLON] Insufficient scrap to pay transit tax! Reputation penalized.");
                    gameState.factions.newBabylon.standing -= 10;
                }
            }
        }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    logEvent(`[EVENT TRIGGERED] ${ev.title}: ${ev.text}`);
    ev.actionA();

    renderBase();
    renderFactions();
    renderInventory();
}

function upgradeModule(idx) {
    const mod = gameState.base.modules[idx];
    if (!mod) return;

    const scrapCost = mod.level * 35;
    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');

    if (!scrapItem || scrapItem.qty < scrapCost) {
        showToast(`⚠️ Requires ${scrapCost} Scrap Metal to upgrade ${mod.name}!`, "warning");
        logEvent(`[UPGRADE FAILED] Insufficient scrap to upgrade ${mod.name} (Needs ${scrapCost} Scrap).`);
        return;
    }

    scrapItem.qty -= scrapCost;
    mod.level += 1;

    logEvent(`[FACILITY UPGRADE] Upgraded ${mod.name} to Level ${mod.level} using ${scrapCost} Scrap Metal.`);
    showToast(`Upgraded ${mod.name} to Lvl ${mod.level}!`, "success");

    renderBase();
    renderInventory();
}

function assignCompanionTask(idx) {
    const comp = gameState.companions[idx];
    if (!comp) return;

    const roles = ["At Base (Patrolling)", "Scavenging Squad", "Infirmary Duty", "Diplomacy Guard"];
    const currentIdx = roles.indexOf(comp.status);
    const nextRole = roles[(currentIdx + 1) % roles.length];

    comp.status = nextRole;
    logEvent(`[COMPANION] Reassigned ${comp.name} to: ${nextRole}.`);
    showToast(`${comp.name} assigned to ${nextRole}`, "info");

    renderCompanions();
}

function researchTech(techKey) {
    const tech = gameState.techTree[techKey];
    if (!tech || tech.researched) return;

    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (!scrapItem || scrapItem.qty < tech.cost) {
        showToast(`⚠️ Researching ${tech.name} requires ${tech.cost} Scrap!`, "warning");
        logEvent(`[RESEARCH FAILED] Insufficient scrap to research ${tech.name}.`);
        return;
    }

    scrapItem.qty -= tech.cost;
    tech.researched = true;

    logEvent(`[RESEARCH COMPLETED] Unlocked technology: ${tech.name}!`);
    showToast(`Researched: ${tech.name}`, "success");

    renderTechTree();
    renderInventory();
}

function repairVehicle(idx) {
    const veh = gameState.vehicles[idx];
    if (!veh) return;

    if (veh.condition >= 100) {
        showToast(`${veh.name} is already at 100% operational condition.`, "info");
        return;
    }

    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (!scrapItem || scrapItem.qty < 15) {
        showToast("⚠️ Repairing vehicles requires at least 15 Scrap Metal!", "warning");
        return;
    }

    scrapItem.qty -= 15;
    veh.condition = Math.min(100, veh.condition + 30);

    logEvent(`[GARAGE] Repaired ${veh.name}. Operational condition increased to ${veh.condition}%.`);
    showToast(`Repaired ${veh.name} (+30% Condition)`, "success");

    renderVehicles();
    renderInventory();
}

function launchExpedition(vehicleId) {
    const veh = gameState.vehicles.find(v => v.id === vehicleId);
    if (!veh) return;

    if (!veh.unlocked) {
        showToast("⚠️ Vehicle is locked or disabled!", "warning");
        return;
    }

    if (veh.condition < 40) {
        showToast("⚠️ Vehicle condition too low! Repair before launching expedition.", "warning");
        logEvent("[EXPEDITION CANCELLED] Vehicle engine condition dangerously low.");
        return;
    }

    if (veh.fuel < 25) {
        showToast("⚠️ Vehicle requires at least 25 L of fuel to launch expedition!", "warning");
        logEvent("[EXPEDITION CANCELLED] Insufficient fuel reserves in vehicle tank.");
        return;
    }

    veh.fuel -= 25;
    veh.condition = Math.max(10, veh.condition - 10);

    const regions = [
        "virginia_alexandria",
        "manhattan_dead_city",
        "crm_redoubt_alpha",
        "france_paris_union"
    ];

    // Pick next region or prompt user
    const currentIdx = regions.indexOf(gameState.currentRegion);
    const nextRegion = regions[(currentIdx + 1) % regions.length];
    gameState.currentRegion = nextRegion;

    const formattedName = nextRegion.replace(/_/g, ' ').toUpperCase();

    logEvent(`[OVERLAND EXPEDITION] Deployed ${veh.name} to ${formattedName}! Scavenging rare sector tech.`);
    showToast(`Arrived at ${formattedName}!`, "success");

    // Trigger region arrival reward
    const techLoot = Math.floor(Math.random() * 5) + 3;
    const scrap = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (scrap) scrap.qty += techLoot;

    renderHeader();
    renderVehicles();
    renderInventory();
}
// ============================================================================
// STORAGE, PERSISTENCE & UTILITY ENGINE
// ============================================================================

/**
 * Logs a event message into the main narrative feed with timestamps and max capacity pruning.
 */
function logEvent(text) {
    const feed = document.getElementById('log-feed');
    if (!feed) return;

    const timeStamp = `${gameState.hour.toString().padStart(2, '0')}:${gameState.minute.toString().padStart(2, '0')}`;
    const p = document.createElement('p');
    p.className = 'text-zinc-300 font-mono text-xs leading-relaxed border-b border-zinc-900/50 pb-1 py-0.5';
    p.innerHTML = `<span class="text-zinc-500 font-bold">[${timeStamp}]</span> ${text}`;
    
    feed.appendChild(p);

    // Keep log feed from bloating memory (max 150 entries)
    while (feed.children.length > 150) {
        feed.removeChild(feed.firstChild);
    }

    feed.scrollTop = feed.scrollHeight;
}

/**
 * Serializes the complete game state and saves it to local browser storage with integrity checks.
 */
function saveGame() {
    try {
        gameState.saveTimestamp = new Date().toISOString();
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem('twd_rpg_save', serializedState);
        logEvent("[STORAGE] Telemetry and survivor state persisted to local storage.");
        return true;
    } catch (e) {
        console.error("[SAVE ERROR] Failed to write game state to localStorage:", e);
        showToast("⚠️ Save failed! Local storage space may be full.", "warning");
        return false;
    }
}

/**
 * Restores the game state from local storage using deep recursive object merging.
 */
function loadGame() {
    const saved = localStorage.getItem('twd_rpg_save');
    if (!saved) return false;

    try {
        const parsed = JSON.parse(saved);
        
        // Deep merge parsed data into default gameState shell to prevent missing key errors
        deepMergeObjects(gameState, parsed);

        // Sanity checks for player state
        if (gameState.player.hp <= 0) gameState.player.hp = 100;
        if (isNaN(gameState.day) || gameState.day < 1) gameState.day = 1;

        logEvent(`[STORAGE] Successfully restored save state from ${new Date(gameState.saveTimestamp).toLocaleString()}.`);
        return true;
    } catch (e) {
        console.error("[LOAD ERROR] Save data corrupt or incompatible:", e);
        logEvent("[CRITICAL WARNING] Save file corrupted. Initializing fresh survival state.");
        return false;
    }
}

/**
 * Helper utility for deep merging nested object structures safely.
 */
function deepMergeObjects(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target && target[key] instanceof Object && !Array.isArray(source[key])) {
            Object.assign(source[key], deepMergeObjects(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

/**
 * Import save file JSON uploaded by player.
 */
function importSaveData(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.player || !parsed.base || !parsed.inventory) {
            throw new Error("Invalid TWD save structure.");
        }
        deepMergeObjects(gameState, parsed);
        saveGame();
        logEvent("[STORAGE] External save file imported successfully.");
        location.reload();
    } catch (e) {
        alert("Failed to import save file: Invalid data format.");
        console.error(e);
    }
    // ============================================================================
// PHASE 1: DYNAMIC MAP & SECTOR EXPLORATION ENGINE
// ============================================================================

function renderMap() {
    let mapContainer = document.getElementById('map-node-grid');
    if (!mapContainer) return;

    mapContainer.innerHTML = '';
    const currentSector = gameState.mapNodes[gameState.currentSectorId];

    // Sector Info Card Header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'col-span-full bg-zinc-950 p-3 rounded border border-zinc-800 mb-3';
    headerDiv.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-bold text-red-500 text-sm uppercase tracking-wider">${currentSector.name}</h3>
                <p class="text-xs text-zinc-400 mt-0.5">${currentSector.description}</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-1 rounded border ${
                currentSector.hazardLevel === 'Low' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                currentSector.hazardLevel === 'Medium' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                'bg-red-950 text-red-400 border-red-800 animate-pulse'
            }">Hazard: ${currentSector.hazardLevel}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2 text-[11px] text-zinc-400 border-t border-zinc-900 pt-2">
            <span>Primary Threat: <strong class="text-zinc-200">${currentSector.threatType}</strong></span>
            <span>Loot Quality: <strong class="text-emerald-400">${currentSector.lootTier}</strong></span>
        </div>
    `;
    mapContainer.appendChild(headerDiv);

    // Connected Sector Nodes
    const label = document.createElement('h4');
    label.className = 'col-span-full text-xs font-bold uppercase text-zinc-400 mb-1';
    label.innerText = 'Navigational Sector Connections:';
    mapContainer.appendChild(label);

    Object.values(gameState.mapNodes).forEach(node => {
        const isCurrent = node.id === gameState.currentSectorId;
        const isConnected = currentSector.connectedTo.includes(node.id);

        const nodeBtn = document.createElement('div');
        nodeBtn.className = `p-3 rounded border transition-all flex flex-col justify-between text-xs ${
            isCurrent ? 'bg-red-950/40 border-red-600 shadow-lg ring-1 ring-red-600' :
            isConnected ? 'bg-zinc-950 border-zinc-700 hover:border-zinc-500 cursor-pointer' :
            'bg-zinc-950/40 border-zinc-900 opacity-40 cursor-not-allowed'
        }`;

        nodeBtn.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold ${isCurrent ? 'text-red-400' : 'text-zinc-200'}">${node.name}</span>
                    ${isCurrent ? '<span class="text-[9px] bg-red-900 text-red-200 px-1.5 py-0.5 rounded font-mono">LOCATION</span>' : ''}
                </div>
                <span class="text-[10px] text-zinc-500 block truncate">${node.threatType}</span>
            </div>
            ${isConnected ? `
                <button onclick="travelToSector('${node.id}')" class="mt-2.5 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-1.5 rounded text-[10px] font-semibold border border-zinc-700 transition-colors flex items-center justify-center gap-1">
                    🗺️ Travel (-15 Stamina, +1 Hr)
                </button>
            ` : ''}
        `;
        mapContainer.appendChild(nodeBtn);
    });
}

function travelToSector(targetSectorId) {
    if (gameState.player.stamina < 15) {
        showToast("⚠️ Too physically exhausted to travel between sectors!", "warning");
        return;
    }

    const targetNode = gameState.mapNodes[targetSectorId];
    if (!targetNode) return;

    gameState.player.stamina -= 15;
    gameState.currentSectorId = targetSectorId;
    gameState.currentRegion = targetNode.region;
    gameState.hour = (gameState.hour + 1) % 24;

    logEvent(`[SECTOR TRAVEL] Traveled to ${targetNode.name}. Region updated to ${targetNode.region.replace(/_/g, ' ').toUpperCase()}.`);
    showToast(`Arrived at ${targetNode.name}`, "success");

    // Hazard Ambush Check based on sector hazard level
    const ambushRoll = Math.random();
    if (targetNode.hazardLevel === 'High' && ambushRoll < 0.45) {
        logEvent(`[AMBUSH!] Ambushed upon arrival at ${targetNode.name}!`);
        startCombat("Sector Sentry Ambush", 85, 30, "crm_trooper");
    } else if (targetNode.hazardLevel === 'Nightmare' && ambushRoll < 0.70) {
        logEvent(`[NIGHTMARE AMBUSH!] Mutated French variant walkers lunged from the shadows!`);
        startCombat("Pouvoir Mutated Super-Variant", 120, 45, "variant_burner");
    }

    renderAll();
    renderMap();
}
