// ============================================================================
// STATE STORE & PERSISTENCE ENGINE (UPGRADED)
// ============================================================================
export const gameState = {
    version: "3.6.0-elite",
    saveTimestamp: null,
    playtimeSeconds: 0,
    day: 1,
    hour: 8,
    minute: 0,
    timeOfDay: "Morning",
    weather: "Clear Sky",
    temperature: 72,
    radiationLevel: 0,
    currentRegion: "virginia_alexandria",
    unlockedRegions: ["virginia_alexandria"],
    currentSectorId: 'alexandria_core',
    
    player: {
        name: "Aaron James",
        origin: "Alexandria Patrol Leader",
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        radiation: 0,
        hunger: 85,
        thirst: 90,
        sleep: 95,
        infection: 0,
        trauma: 5,
        traumaState: "Clear Mind",
        statusEffects: [],
        limbs: {
            head: { condition: "Healthy", bitten: false, bleeding: false, armored: true },
            torso: { condition: "Healthy", bitten: false, bleeding: false, armored: true },
            leftArm: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            rightArm: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            leftLeg: { condition: "Healthy", bitten: false, bleeding: false, amputated: false },
            rightLeg: { condition: "Healthy", bitten: false, bleeding: false, amputated: false }
        },
        skills: { melee: 15, firearms: 20, stealth: 25, scavenging: 20, medicine: 10 },
        equipped: { weapon: 'machete', armor: 'riot_vest', backpack: 'tactical_pack' }
    },
    inventory: [
        { id: 'machete', name: 'Tactical Machete', qty: 1, type: 'weapon', durability: 95, maxDurability: 100, damage: 28, noise: 'Quiet', value: 35 },
        { id: 'suppressed_pistol', name: 'Silenced Glock 19', qty: 1, type: 'weapon', durability: 90, maxDurability: 100, damage: 45, noise: 'Low', value: 120 },
        { id: 'assault_rifle', name: 'Colt M4A1 Carbine', qty: 1, type: 'weapon', durability: 85, maxDurability: 100, damage: 70, noise: 'Extreme', value: 200 },
        { id: 'bandage', name: 'Sterile Trauma Bandage', qty: 5, type: 'medical', effect: 'heals_bleed_30', value: 15 },
        { id: 'antibiotics', name: 'Broad-Spectrum Antibiotics', qty: 2, type: 'medical', effect: 'slows_infection_20', value: 50 },
        { id: 'water', name: 'Purified Water Flask', qty: 3, type: 'consumable', effect: 'thirst_40', value: 10 },
        { id: 'canned_beans', name: 'Canned Chili Beans', qty: 5, type: 'consumable', effect: 'hunger_35', value: 12 },
        { id: 'ammunition_9mm', name: '9mm Hollow-Point Rounds', qty: 32, type: 'ammo', value: 2 },
        { id: 'ammunition_556', name: '5.56 NATO Rounds', qty: 40, type: 'ammo', value: 3 },
        { id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: 14, type: 'material', value: 5 },
        { id: 'chemicals', name: 'Solvents & Chemicals', qty: 6, type: 'material', value: 8 },
        { id: 'fabric', name: 'Ballistic Fabric Rolls', qty: 4, type: 'material', value: 6 }
    ],
    companions: [
        { id: 'daryl', name: 'Daryl Dixon', role: 'Tracker & Scout', loyalty: 85, hp: 100, status: 'At Base (Patrolling)', weapon: 'Compound Crossbow', perk: 'Increases ambush survival and rare meat yield.' },
        { id: 'carol', name: 'Carol Peletier', role: 'Infiltration Specialist', loyalty: 80, hp: 100, status: 'At Base (Guarding)', weapon: 'Silenced Revolver', perk: 'Reduces faction diplomatic penalty risks.' },
        { id: 'maggie', name: 'Maggie Rhee', role: 'Hilltop Militia Leader', loyalty: 90, hp: 100, status: 'At Base (Diplomacy)', weapon: 'Assault Rifle', perk: 'Boosts settlement food production yield.' }
    ],
    factions: {
        commonwealth: { name: 'The Commonwealth', standing: 55, status: 'Cautious Alliance', leader: 'Governor Pamela Milton', territory: 'Ohio Commonwealth Zone', perks: 'Access to advanced industrial trade.' },
        crm: { name: 'CRM Reconstruction', standing: 25, status: 'Truce / Monitored', leader: 'Major General Beale Successors', territory: 'Philadelphia Redoubts', perks: 'Helicopter transport access.' },
        newBabylon: { name: 'New Babylon', standing: 40, status: 'Neutral Trade Partners', leader: 'The Magistrate Judiciary', territory: 'New York Tri-State', perks: 'Legal immunity vouchers.' },
        pouvoir: { name: 'Pouvoir des Vivants', standing: -35, status: 'Hostile Militants', leader: 'Genet', territory: 'Parisian Union', perks: 'None.' },
        burazi: { name: 'The Burazi Methane Cartel', standing: -10, status: 'Suspicious / Opportunistic', leader: 'The Croat', territory: 'Manhattan Skyscraper Zone', perks: 'Black-market explosives.' }
    },
    base: {
        name: "Alexandria Safe-Zone",
        location: "Virginia Outskirts",
        population: 18,
        maxPopulation: 35,
        morale: 78,
        defense: 82,
        foodRations: 65,
        waterSupply: 70,
        powerGrid: 85,
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
        { id: 'truck', name: 'Heavy Steel-Plated Semi-Truck', condition: 45, fuel: 30, maxFuel: 150, armor: 95, noise: 'Loud', unlocked: true, location: 'Alexandria Garage' },
        { id: 'chopper', name: 'CRM Recon Helicopter', condition: 20, fuel: 10, maxFuel: 100, armor: 80, noise: 'Extreme', unlocked: false, location: 'Hidden Redoubt' }
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
        enemyType: 'walker',
        enemyHp: 100,
        enemyMaxHp: 100,
        noiseMeterValue: 15,
        noiseLevel: 'Low (Quiet)',
        turnCount: 0,
        distanceMeters: 15
    },
    mapNodes: {
        'alexandria_core': { id: 'alexandria_core', name: 'Alexandria Safe-Zone', region: 'virginia_alexandria', hazardLevel: 'Low', threatType: 'None', lootTier: 'Standard', connectedTo: ['virginia_woods', 'ashei_suburbs'], coords: { x: 20, y: 50 }, description: 'The fortified walls of Alexandria.' },
        'virginia_woods': { id: 'virginia_woods', name: 'Whisperer Territory Woods', region: 'virginia_alexandria', hazardLevel: 'Medium', threatType: 'Walker Herds', lootTier: 'Uncommon', connectedTo: ['alexandria_core', 'crm_outpost_alpha'], coords: { x: 40, y: 35 }, description: 'Dense forest canopy.' },
        'ashei_suburbs': { id: 'ashei_suburbs', name: 'Ruined Suburbs', region: 'virginia_alexandria', hazardLevel: 'Medium', threatType: 'Scavengers', lootTier: 'Uncommon', connectedTo: ['alexandria_core', 'manhattan_transit_hub'], coords: { x: 45, y: 65 }, description: 'Looted residential neighborhoods.' },
        'crm_outpost_alpha': { id: 'crm_outpost_alpha', name: 'CRM Transit Hub Alpha', region: 'crm_redoubt_alpha', hazardLevel: 'High', threatType: 'CRM Troops', lootTier: 'Military High-Tech', connectedTo: ['virginia_woods'], coords: { x: 70, y: 30 }, description: 'Restricted Civic Republic landing pad.' },
        'manhattan_transit_hub': { id: 'manhattan_transit_hub', name: 'Lower Manhattan Ruins', region: 'manhattan_dead_city', hazardLevel: 'Extreme', threatType: 'Burazi Cartel', lootTier: 'Rare Exotic', connectedTo: ['ashei_suburbs', 'paris_catacombs'], coords: { x: 80, y: 75 }, description: 'Vertical wasteland of Dead City.' },
        'paris_catacombs': { id: 'paris_catacombs', name: 'Parisian Catacombs', region: 'france_paris_union', hazardLevel: 'Nightmare', threatType: 'Super-Variants', lootTier: 'Prototype Bio-Tech', connectedTo: ['manhattan_transit_hub'], coords: { x: 95, y: 85 }, description: 'Subterranean mutated test labs.' }
    }
};

export function logEvent(text) {
    const feed = document.getElementById('log-feed');
    if (!feed) return;
    const timeStamp = `${gameState.hour.toString().padStart(2,'0')}:${gameState.minute.toString().padStart(2, '0')}`;
    const p = document.createElement('p');
    p.className = 'text-zinc-300 font-mono text-xs leading-relaxed border-b border-zinc-900/50 pb-1 py-0.5';
    p.innerHTML = `<span class="text-zinc-500 font-bold">[${timeStamp}]</span> ${text}`;
    feed.appendChild(p);
    while (feed.children.length > 150) {
        feed.removeChild(feed.firstChild);
    }
    feed.scrollTop = feed.scrollHeight;
}

export function showToast(message, type = "info") {
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
        type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-200' : type === 'warning' ? 'bg-amber-950 border-amber-700 text-amber-200' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
    }`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

export function saveGame() {
    try {
        gameState.saveTimestamp = new Date().toISOString();
        localStorage.setItem('twd_rpg_save', JSON.stringify(gameState));
        logEvent("[STORAGE] Game state persisted successfully.");
        return true;
    } catch (e) {
        console.error("[SAVE ERROR]", e);
        showToast("⚠️ Save failed!", "warning");
        return false;
    }
}

export function loadGame() {
    const saved = localStorage.getItem('twd_rpg_save');
    if (!saved) return false;
    try {
        const parsed = JSON.parse(saved);
        deepMergeObjects(gameState, parsed);
        if (gameState.player.hp <= 0) gameState.player.hp = 100;
        logEvent("[STORAGE] Save state restored successfully.");
        return true;
    } catch (e) {
        console.error("[LOAD ERROR]", e);
        showToast("⚠️ Save state corrupted or incompatible.", "warning");
        return false;
    }
}

function deepMergeObjects(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target && target[key] instanceof Object && !Array.isArray(source[key])) {
            deepMergeObjects(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}
