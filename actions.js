import { gameState, logEvent, showToast } from './state.js';
import { startCombat } from './combat.js';
import { renderVitals, renderInventory, renderBase, renderFactions, renderTechTree, renderVehicles, renderHeader } from './render.js';

export function triggerScavenge() {
    if (gameState.player.stamina < 15) {
        showToast("⚠️ Too physically exhausted to scavenge!", "warning");
        return;
    }
    gameState.player.stamina -= 15;
    const roll = Math.random();

    if (roll < 0.35) {
        startCombat("Roaming Walker Horde", 60, 20, "walker");
    } else if (roll < 0.75) {
        const lootItem = { id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: 3, type: 'material', value: 5 };
        const existing = gameState.inventory.find(i => i.id === lootItem.id);
        if (existing) existing.qty += lootItem.qty;
        else gameState.inventory.push(lootItem);
        showToast(`Found 3x Industrial Scrap Metal!`, "success");
    } else {
        logEvent("[SCAVENGE] Searched ruins, but area was picked clean.");
    }
    renderInventory();
    renderVitals();
}

export function patrolPerimeter() {
    if (gameState.player.stamina < 10) {
        showToast("⚠️ Too exhausted for patrol!", "warning");
        return;
    }
    gameState.player.stamina -= 10;
    gameState.base.defense = Math.min(100, gameState.base.defense + 5);
    showToast("Base Defense +5%", "success");
    renderBase();
    renderVitals();
}

export function restAtBase() {
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.stamina = gameState.player.maxStamina;
    gameState.player.sleep = 100;
    gameState.player.trauma = Math.max(0, gameState.player.trauma - 20);
    gameState.hour = (gameState.hour + 8) % 24;
    showToast("Restored Health, Stamina, and Sleep!", "success");
    renderVitals();
    renderHeader();
}

export function upgradeModule(idx) {
    const mod = gameState.base.modules[idx];
    if (!mod) return;
    const scrapCost = mod.level * 35;
    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (!scrapItem || scrapItem.qty < scrapCost) {
        showToast(`⚠️ Requires ${scrapCost} Scrap Metal!`, "warning");
        return;
    }
    scrapItem.qty -= scrapCost;
    mod.level += 1;
    showToast(`Upgraded ${mod.name} to Lvl ${mod.level}!`, "success");
    renderBase();
    renderInventory();
}

export function researchTech(techKey) {
    const tech = gameState.techTree[techKey];
    if (!tech || tech.researched) return;
    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (!scrapItem || scrapItem.qty < tech.cost) {
        showToast(`⚠️ Requires ${tech.cost} Scrap!`, "warning");
        return;
    }
    scrapItem.qty -= tech.cost;
    tech.researched = true;
    showToast(`Researched: ${tech.name}`, "success");
    renderTechTree();
    renderInventory();
}

export function repairVehicle(idx) {
    const veh = gameState.vehicles[idx];
    if (!veh || veh.condition >= 100) return;
    const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
    if (!scrapItem || scrapItem.qty < 15) {
        showToast("⚠️ Requires 15 Scrap Metal to repair!", "warning");
        return;
    }
    scrapItem.qty -= 15;
    veh.condition = Math.min(100, veh.condition + 30);
    showToast(`Repaired ${veh.name}`, "success");
    renderVehicles();
    renderInventory();
}

export function travelToSector(targetSectorId) {
    const targetNode = gameState.mapNodes[targetSectorId];
    if (!targetNode) return;
    gameState.currentSectorId = targetSectorId;
    gameState.currentRegion = targetNode.region;
    showToast(`Arrived at ${targetNode.name}`, "success");
    renderAll();
}