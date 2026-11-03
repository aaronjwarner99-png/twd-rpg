// Game State Core
const gameState = {
    day: 1,
    time: "08:00 AM",
    weather: "Clear Sky",
    player: {
        hp: 100,
        maxHp: 100,
        stamina: 100,
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
        { id: 'machete', name: 'Machete', qty: 1, type: 'weapon' },
        { id: 'bandage', name: 'Sterile Bandage', qty: 3, type: 'medical' },
        { id: 'water', name: 'Clean Water', qty: 2, type: 'consumable' }
    ],
    factions: {
        commonwealth: { name: 'The Commonwealth', standing: 50 },
        crm: { name: 'CRM Reconstruction', standing: 20 },
        newBabylon: { name: 'New Babylon', standing: 40 },
        pouvoir: { name: 'Pouvoir des Vivants', standing: -30 }
    },
    base: {
        population: 12,
        defense: 75,
        foodRations: 45
    }
};

// Core UI Handlers
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    renderVitals();
    renderLimbs();
    renderInventory();
    renderFactions();
    renderBase();
    setupActions();
});

// Tab Switcher
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'border-red-600', 'text-red-500'));
            tabs.forEach(t => t.classList.add('border-transparent', 'text-zinc-400'));
            
            tab.classList.add('active', 'border-red-600', 'text-red-500');
            tab.classList.remove('border-transparent', 'text-zinc-400');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
    });
}

// Render Player Stats
function renderVitals() {
    document.getElementById('hp-val').innerText = `${gameState.player.hp} / ${gameState.player.maxHp}`;
    document.getElementById('hp-bar').style.width = `${gameState.player.hp}%`;

    document.getElementById('stamina-val').innerText = `${gameState.player.stamina} / 100`;
    document.getElementById('stamina-bar').style.width = `${gameState.player.stamina}%`;

    document.getElementById('infection-val').innerText = `${gameState.player.infection}%`;
    document.getElementById('infection-bar').style.width = `${gameState.player.infection}%`;

    document.getElementById('trauma-val').innerText = `${gameState.player.trauma}%`;
    document.getElementById('trauma-bar').style.width = `${gameState.player.trauma}%`;
}

// Render Limb Diagnostics & Amputation Options
function renderLimbs() {
    const container = document.getElementById('limb-container');
    container.innerHTML = '';

    Object.entries(gameState.player.limbs).forEach(([key, limb]) => {
        const div = document.createElement('div');
        div.className = `p-2 rounded border bg-zinc-950 flex flex-col justify-between ${limb.bitten ? 'border-red-700' : 'border-zinc-800'}`;
        
        let statusText = limb.amputated ? 'AMPUTATED' : limb.bitten ? 'BITTEN!' : limb.condition;
        let colorClass = limb.amputated ? 'text-zinc-600' : limb.bitten ? 'text-red-500 font-bold animate-pulse' : 'text-emerald-400';

        div.innerHTML = `
            <div>
                <span class="capitalize text-zinc-400 block">${key.replace(/([A-Z])/g, ' $1')}</span>
                <span class="${colorClass}">${statusText}</span>
            </div>
            ${limb.bitten && !limb.amputated ? `<button onclick="amputateLimb('${key}')" class="mt-2 text-[10px] bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded border border-red-700">Sever Limb</button>` : ''}
        `;
        container.appendChild(div);
    });
}

// Perform Emergency Surgical Amputation
function amputateLimb(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || limb.amputated) return;

    limb.amputated = true;
    limb.bitten = false;
    limb.condition = "Severed";
    
    gameState.player.hp = Math.max(10, gameState.player.hp - 35);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 30);
    gameState.player.infection = Math.max(0, gameState.player.infection - 40);

    logEvent(`[SURGERY] You seared and severed your ${limbKey}. The infection spread was halted, but severe shock sets in!`);
    renderVitals();
    renderLimbs();
}

// Render Scavenged Inventory
function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';

    gameState.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 text-xs flex justify-between items-center';
        div.innerHTML = `
            <div>
                <span class="font-semibold block text-zinc-200">${item.name}</span>
                <span class="text-[10px] text-zinc-500 capitalize">${item.type}</span>
            </div>
            <span class="bg-zinc-900 px-2 py-1 rounded border border-zinc-700 font-mono text-zinc-300">x${item.qty}</span>
        `;
        grid.appendChild(div);
    });
}

// Render Factions
function renderFactions() {
    const list = document.getElementById('faction-list');
    list.innerHTML = '';

    Object.values(gameState.factions).forEach(fac => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 flex justify-between items-center';
        div.innerHTML = `
            <span>${fac.name}</span>
            <span class="font-bold ${fac.standing >= 0 ? 'text-emerald-400' : 'text-red-400'}">${fac.standing >= 0 ? '+' : ''}${fac.standing}</span>
        `;
        list.appendChild(div);
    });
}

// Render Base Stats
function renderBase() {
    document.getElementById('base-pop').innerText = gameState.base.population;
    document.getElementById('base-def').innerText = `${gameState.base.defense}%`;
    document.getElementById('base-food').innerText = `${gameState.base.foodRations} Days`;
}

// Narrative Action Injector
function setupActions() {
    const actionBox = document.getElementById('action-options');
    actionBox.innerHTML = `
        <button onclick="scavengeArea()" class="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded text-xs text-left border border-zinc-700 flex justify-between items-center">
            <span>🎒 Scavenge Nearby Ruins</span>
            <span class="text-[10px] text-zinc-400">-10 Stamina</span>
        </button>
        <button onclick="patrolPerimeter()" class="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded text-xs text-left border border-zinc-700 flex justify-between items-center">
            <span>🏹 Patrol Perimeter</span>
            <span class="text-[10px] text-zinc-400">+5 Base Def</span>
        </button>
    `;
}

function scavengeArea() {
    if (gameState.player.stamina < 10) {
        logEvent("[WARNING] You are too exhausted to scavenge.");
        return;
    }
    gameState.player.stamina -= 10;
    const foundAmmo = Math.floor(Math.random() * 5) + 1;
    logEvent(`[SCAVENGE] Found ${foundAmmo}x 9mm rounds in an abandoned vehicle.`);
    renderVitals();
}

function patrolPerimeter() {
    gameState.base.defense = Math.min(100, gameState.base.defense + 5);
    logEvent("[PATROL] Secured the outer wire fence. Alexandria defense rating increased.");
    renderBase();
}

// Utility Event Log
function logEvent(text) {
    const feed = document.getElementById('log-feed');
    const p = document.createElement('p');
    p.className = 'text-zinc-300';
    p.innerText = text;
    feed.appendChild(p);
    feed.scrollTop = feed.scrollHeight;
}