import { gameState } from './state.js';

export function renderAll() {
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
    renderMap();
}

export function renderHeader() {
    const dayEl = document.getElementById('day-counter');
    if (!dayEl) return;
    const timeFormatted = `${gameState.hour.toString().padStart(2,'0')}:${gameState.minute.toString().padStart(2, '0')}`;
    const regionName = gameState.currentRegion.replace(/_/g, ' ').toUpperCase();
    dayEl.innerText = `Day ${gameState.day} • ${timeFormatted} • ${gameState.timeOfDay} • ${gameState.weather} (${gameState.temperature}°F) • Location: ${regionName}`;
}

export function renderVitals() {
    setGauge('hp-val', 'hp-bar', gameState.player.hp, gameState.player.maxHp, 'bg-red-600');
    setGauge('stamina-val', 'stamina-bar', gameState.player.stamina, gameState.player.maxStamina, 'bg-amber-500');
    setGauge('infection-val', 'infection-bar', gameState.player.infection, 100, 'bg-emerald-600');
    setGauge('trauma-val', 'trauma-bar', gameState.player.trauma, 100, 'bg-purple-600');
    
    if (document.getElementById('hunger-val')) setGauge('hunger-val', 'hunger-bar', Math.round(gameState.player.hunger), 100, 'bg-orange-500');
    if (document.getElementById('thirst-val')) setGauge('thirst-val', 'thirst-bar', Math.round(gameState.player.thirst), 100, 'bg-blue-500');
    if (document.getElementById('sleep-val')) setGauge('sleep-val', 'sleep-bar', Math.round(gameState.player.sleep), 100, 'bg-indigo-500');
}

function setGauge(textId, barId, val, maxVal, colorClass) {
    const textEl = document.getElementById(textId);
    const barEl = document.getElementById(barId);
    if (textEl) textEl.innerText = `${Math.round(val)} / ${maxVal}`;
    if (barEl) {
        const pct = Math.max(0, Math.min(100, (val / maxVal) * 100));
        barEl.style.width = `${pct}%`;
        barEl.className = `${colorClass} h-full transition-all duration-300`;
    }
}

export function renderLimbs() {
    const container = document.getElementById('limb-container');
    if (!container) return;
    container.innerHTML = '';
    
    const traumaStateEl = document.getElementById('trauma-state');
    if (traumaStateEl) {
        traumaStateEl.innerText = gameState.player.traumaState;
    }

    Object.entries(gameState.player.limbs).forEach(([key, limb]) => {
        const div = document.createElement('div');
        div.className = `p-2.5 rounded border bg-zinc-950 flex flex-col justify-between ${limb.amputated ? 'opacity-60 border-zinc-700' : limb.bitten ? 'border-red-600 bg-red-950/20' : 'border-zinc-800'}`;
        div.innerHTML = `
            <div>
                <span class="text-zinc-300 font-medium text-[11px]">${key.toUpperCase()}</span>
                <span class="text-xs block ${limb.bitten ? 'text-red-500 font-bold animate-pulse' : 'text-emerald-400'}">
                    ${limb.amputated ? 'AMPUTATED (-15% Max Stamina)' : limb.bitten ? 'BITTEN! INFECTION SPREADING' : limb.condition}
                </span>
            </div>
            ${limb.bitten && !limb.amputated ? `<button data-action="amputate" data-limb="${key}" class="mt-2 text-[10px] bg-red-900 hover:bg-red-800 text-red-200 px-2 py-1 rounded transition-colors">🔪 Sever Limb</button>` : ''}
        `;
        container.appendChild(div);
    });
}

export function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    gameState.inventory.forEach((item, index) => {
        const isEquipped = gameState.player.equipped.weapon === item.id || gameState.player.equipped.armor === item.id;
        const div = document.createElement('div');
        div.className = `bg-zinc-950 p-2.5 rounded border ${isEquipped ? 'border-emerald-600 bg-emerald-950/10' : 'border-zinc-800'} text-xs flex flex-col justify-between gap-2`;
        
        let durabilityInfo = '';
        if (item.durability !== undefined) {
            const durPct = Math.round((item.durability / (item.maxDurability || 100)) * 100);
            durabilityInfo = `<span class="text-[10px] text-amber-400 block">Durability: ${durPct}%</span>`;
        }

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-start">
                    <span class="font-semibold text-zinc-200">${item.name}</span>
                    ${isEquipped ? '<span class="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">Equipped</span>' : ''}
                </div>
                <span class="text-[10px] text-zinc-500">x${item.qty} | ${item.type}</span>
                ${durabilityInfo}
            </div>
            <div class="flex gap-1">
                ${['weapon', 'armor'].includes(item.type) && !isEquipped ? `<button data-action="equip-item" data-id="${item.id}" class="flex-1 bg-blue-950 hover:bg-blue-900 text-blue-300 py-1 rounded transition-colors">Equip</button>` : ''}
                ${['consumable', 'medical'].includes(item.type) ? `<button data-action="use-item" data-index="${index}" class="flex-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 py-1 rounded transition-colors">Use</button>` : ''}
                <button data-action="discard-item" data-index="${index}" class="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-2 py-1 rounded transition-colors">Drop</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

export function renderBase() {
    if (document.getElementById('base-pop')) document.getElementById('base-pop').innerText = `${gameState.base.population} / ${gameState.base.maxPopulation}`;
    if (document.getElementById('base-def')) document.getElementById('base-def').innerText = `${gameState.base.defense}%`;
    if (document.getElementById('base-food')) document.getElementById('base-food').innerText = `${gameState.base.foodRations} Days`;
    
    const modulesContainer = document.getElementById('base-modules');
    if (!modulesContainer) return;
    
    modulesContainer.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Facility Modules</h3>';
    gameState.base.modules.forEach((mod, idx) => {
        const upgradeCost = mod.level * 35;
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-semibold text-zinc-200 block">${mod.name} (Lvl ${mod.level})</span>
                <span class="text-[10px] text-zinc-500">${mod.effect}</span>
            </div> 
            <button data-action="upgrade-mod" data-index="${idx}" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded transition-colors">Upgrade (${upgradeCost} Scrap)</button>
        `;
        modulesContainer.appendChild(div);
    });
}

export function renderCompanions() {
    const container = document.getElementById('companion-list');
    if (!container) return;
    
    container.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Companions & Specialists</h3>';
    gameState.companions.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 text-xs space-y-1';
        div.innerHTML = `
            <div class="flex justify-between font-semibold text-zinc-200">
                <span>${comp.name} (${comp.role})</span>
                <span class="text-emerald-400">Loyalty: ${comp.loyalty}%</span>
            </div>
            <p class="text-[11px] text-zinc-400">Status: ${comp.status}</p>
            <p class="text-[10px] text-zinc-500 italic">Perk: ${comp.perk}</p>
        `;
        container.appendChild(div);
    });
}

export function renderFactions() {
    const list = document.getElementById('faction-list');
    if (!list) return;
    list.innerHTML = '';
    
    Object.values(gameState.factions).forEach(fac => {
        const standingColor = fac.standing > 40 ? 'text-emerald-400' : fac.standing < 0 ? 'text-red-500' : 'text-amber-400';
        const div = document.createElement('div');
        div.className = 'p-3 rounded border bg-zinc-950 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-bold text-zinc-200 block">${fac.name}</span>
                <span class="text-[10px] text-zinc-500">Leader: ${fac.leader} | Status: ${fac.status}</span>
            </div>
            <span class="font-mono font-bold ${standingColor}">${fac.standing > 0 ? `+${fac.standing}` : fac.standing}</span>
        `;
        list.appendChild(div);
    });
}

export function renderTechTree() {
    const c = document.getElementById('tech-tree-container');
    if (!c) return;
    c.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Research & Blueprints</h3>';
    
    Object.entries(gameState.techTree).forEach(([key, tech]) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-2.5 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <span>${tech.name}</span> 
            ${!tech.researched ? `<button data-action="research" data-key="${key}" class="bg-blue-950 hover:bg-blue-900 text-blue-200 px-3 py-1 rounded transition-colors">Research (${tech.cost} Scrap)</button>` : '<span class="text-emerald-400 font-semibold">Researched</span>'}
        `;
        c.appendChild(div);
    });
}

export function renderVehicles() {
    const g = document.getElementById('vehicle-garage');
    if (!g) return;
    g.innerHTML = '<h3 class="text-xs font-bold uppercase text-zinc-400 mb-2">Vehicle Garage</h3>';
    
    gameState.vehicles.forEach((veh, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-950 p-3 rounded border border-zinc-800 flex justify-between items-center text-xs';
        div.innerHTML = `
            <div>
                <span class="font-semibold text-zinc-200 block">${veh.name}</span>
                <span class="text-[10px] text-zinc-500">Condition: ${veh.condition}% | Fuel: ${veh.fuel}/${veh.maxFuel}</span>
            </div> 
            <button data-action="repair-veh" data-index="${idx}" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded transition-colors">Repair (15 Scrap)</button>
        `;
        g.appendChild(div);
    });
}

export function renderActions() {
    const actionBox = document.getElementById('action-options');
    if (!actionBox) return;
    
    if (gameState.combat.active) {
        actionBox.innerHTML = `<div class="col-span-full bg-red-950/40 p-3 rounded text-center text-red-400 font-bold text-xs">COMBAT IN PROGRESS</div>`;
        return;
    }
    
    actionBox.innerHTML = `
        <button id="btn-scavenge" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded text-xs text-left border border-zinc-700 transition-colors flex flex-col gap-1">
            <span class="font-bold text-zinc-200">🎒 Scavenge Sector</span>
            <span class="text-[10px] text-zinc-400">Search ruins for supplies (Cost: 15 Stamina)</span>
        </button>
        <button id="btn-patrol" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded text-xs text-left border border-zinc-700 transition-colors flex flex-col gap-1">
            <span class="font-bold text-zinc-200">🏹 Patrol Wire</span>
            <span class="text-[10px] text-zinc-400">Reinforce base perimeter (Cost: 10 Stamina)</span>
        </button>
        <button id="btn-rest" class="bg-zinc-800 hover:bg-zinc-700 p-3 rounded text-xs text-left border border-zinc-700 transition-colors flex flex-col gap-1">
            <span class="font-bold text-zinc-200">⛺ Rest & Recover</span>
            <span class="text-[10px] text-zinc-400">Sleep at base quarters (Restores Vitals)</span>
        </button>
    `;
}

export function renderMap() {
    const grid = document.getElementById('map-node-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const current = gameState.mapNodes[gameState.currentSectorId];
    Object.values(gameState.mapNodes).forEach(node => {
        const isCurrent = node.id === gameState.currentSectorId;
        const isConnected = current.connectedTo.includes(node.id);
        const div = document.createElement('div');
        div.className = `p-3 rounded border text-xs flex flex-col justify-between gap-2 ${isCurrent ? 'border-red-600 bg-red-950/30' : 'border-zinc-800 bg-zinc-950'}`;
        
        div.innerHTML = `
            <div>
                <div class="font-bold text-zinc-200">${node.name} ${isCurrent ? '<span class="text-red-500">(Current)</span>' : ''}</div>
                <p class="text-[10px] text-zinc-400 mt-1">${node.description}</p>
                <span class="text-[9px] text-zinc-500 block mt-1">Hazard: ${node.hazardLevel} | Loot: ${node.lootTier}</span>
            </div>
            ${isConnected && !isCurrent ? `<button data-action="travel" data-id="${node.id}" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2 py-1 rounded transition-colors text-center">Travel (20 Stamina)</button>` : ''}
        `;
        grid.appendChild(div);
    });
}
