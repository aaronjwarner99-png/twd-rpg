import { gameState, logEvent, showToast } from './state.js';
import { renderVitals, renderLimbs, renderInventory } from './render.js';

export function amputateLimb(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || limb.amputated) return;
    
    const bandageItem = gameState.inventory.find(i => i.id === 'bandage' && i.qty > 0);
    if (!bandageItem) {
        showToast("⚠️ Emergency surgery requires at least 1x Sterile Bandage to staunch bleeding!", "warning");
        return;
    }
    
    bandageItem.qty -= 1;
    if (bandageItem.qty <= 0) {
        gameState.inventory = gameState.inventory.filter(i => i !== bandageItem);
    }

    limb.amputated = true;
    limb.bitten = false;
    limb.bleeding = false;
    limb.condition = "Severed";
    
    // Realistic consequences: Severe physical trauma and permanent max stamina reduction
    gameState.player.hp = Math.max(10, gameState.player.hp - 40);
    gameState.player.trauma = Math.min(100, gameState.player.trauma + 40);
    gameState.player.maxStamina = Math.max(50, gameState.player.maxStamina - 15);
    gameState.player.stamina = Math.min(gameState.player.stamina, gameState.player.maxStamina);
    gameState.player.infection = 0; // Halted infection
    
    logEvent(`[SURGERY] Emergency field amputation performed on ${limbKey}. Infection halted, but permanent physical capacity reduced.`);
    showToast(`Amputated ${limbKey}. Infection halted (-15 Max Stamina).`, "success");
    
    renderVitals();
    renderLimbs();
    renderInventory();
}

export function treatBleed(limbKey) {
    const limb = gameState.player.limbs[limbKey];
    if (!limb || !limb.bleeding) return;
    
    const bandage = gameState.inventory.find(i => i.id === 'bandage' && i.qty > 0);
    if (!bandage) {
        showToast("⚠️ Need a Sterile Bandage to treat bleeding!", "warning");
        return;
    }
    
    bandage.qty -= 1;
    if (bandage.qty <= 0) {
        gameState.inventory = gameState.inventory.filter(i => i !== bandage);
    }
    
    limb.bleeding = false;
    showToast(`Successfully treated bleeding on ${limbKey}`, "success");
    
    renderLimbs();
    renderInventory();
}

export function useItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;
    let used = false;
    
    if (item.type === 'consumable') {
        if (item.name.toLowerCase().includes('water') || item.id === 'water') {
            gameState.player.thirst = Math.min(100, gameState.player.thirst + 40);
            showToast("Consumed purified water (+40 Hydration)", "success");
        } else {
            gameState.player.hunger = Math.min(100, gameState.player.hunger + 35);
            showToast(`Consumed ${item.name} (+35 Hunger)`, "success");
        }
        used = true;
    } else if (item.type === 'medical') {
        if (item.id === 'antibiotics') {
            gameState.player.infection = Math.max(0, gameState.player.infection - 30);
            showToast("Broad-spectrum antibiotics suppressed infection (-30%)", "success");
        } else {
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 30);
            showToast("Applied trauma bandage (+30 HP)", "success");
        }
        used = true;
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

export function equipItem(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.type === 'weapon') {
        gameState.player.equipped.weapon = item.id;
        showToast(`Equipped weapon: ${item.name}`, "success");
    } else if (item.type === 'armor') {
        gameState.player.equipped.armor = item.id;
        showToast(`Equipped armor: ${item.name}`, "success");
    }
    
    renderInventory();
}

export function discardItem(index) {
    const item = gameState.inventory[index];
    if (!item) return;
    
    if (confirm(`Are you sure you want to discard ${item.name}?`)) {
        gameState.inventory.splice(index, 1);
        renderInventory();
        showToast("Item discarded into wasteland.", "info");
    }
}
