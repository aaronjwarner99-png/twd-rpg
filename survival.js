import { gameState, logEvent, showToast } from './state.js';
import { renderVitals, renderLimbs, renderInventory } from './render.js';

export function amputateLimb(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || limb.amputated) return;
    
    const bandageItem = gameState.inventory.find(i => i.id === 'bandage' && i.qty > 0);
    if (!bandageItem) {
        showToast("⚠️ Surgery requires at least 1x Sterile Bandage!", "warning");
        return;
    }
    bandageItem.qty -= 1;
    if (bandageItem.qty <= 0) gameState.inventory = gameState.inventory.filter(i => i !== bandageItem);

    limb.amputated = true;
    limb.bitten = false;
    limb.bleeding = false;
    limb.condition = "Severed";
    
    gameState.player.hp = Math.max(10, gameState.player.hp - 35);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 35);
    gameState.player.infection = 0;
    
    logEvent(`[SURGERY] Amputated ${limbKey}. Infection halted.`);
    showToast(`Amputated ${limbKey}. Infection halted!`, "success");
    renderVitals();
    renderLimbs();
    renderInventory();
}

export function treatBleed(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || !limb.bleeding) return;
    const bandage = gameState.inventory.find(i => i.id === 'bandage' && i.qty > 0);
    if (!bandage) {
        showToast("⚠️ Need Sterile Bandage!", "warning");
        return;
    }
    bandage.qty -= 1;
    if (bandage.qty <= 0) gameState.inventory = gameState.inventory.filter(i => i !== bandage);
    limb.bleeding = false;
    showToast(`Treated bleeding on ${limbKey}`, "success");
    renderLimbs();
    renderInventory();
}

export function useItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;
    let used = false;
    if (item.type === 'consumable') {
        if (item.name.toLowerCase().includes('water')) {
            gameState.player.thirst = Math.min(100, gameState.player.thirst + 40);
        } else {
            gameState.player.hunger = Math.min(100, gameState.player.hunger + 35);
        }
        used = true;
    } else if (item.type === 'medical') {
        if (item.id === 'antibiotics') {
            gameState.player.infection = Math.max(0, gameState.player.infection - 25);
            showToast("Antibiotics suppressed infection!", "success");
        } else {
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 30);
            showToast("Applied trauma bandage (+30 HP)", "success");
        }
        used = true;
    }
    if (used) {
        item.qty -= 1;
        if (item.qty <= 0) gameState.inventory.splice(index, 1);
    }
    renderInventory();
    renderVitals();
    renderLimbs();
}

export function equipItem(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;
    if (item.type === 'weapon') gameState.player.equipped.weapon = item.id;
    else if (item.type === 'armor') gameState.player.equipped.armor = item.id;
    showToast(`Equipped ${item.name}`, "success");
    renderInventory();
}

export function discardItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;
    if (confirm(`Discard ${item.name}?`)) {
        gameState.inventory.splice(index, 1);
        renderInventory();
        showToast("Item discarded", "info");
    }
}