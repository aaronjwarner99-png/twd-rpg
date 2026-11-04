import { gameState, logEvent, showToast } from './state.js';
import { renderVitals, renderInventory, renderLimbs, renderActions } from './render.js';

export function startCombat(enemyName, enemyHp, initialNoise = 15, enemyType = 'walker') {
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
    if (statusEl) statusEl.innerText = `${enemyName} (${enemyHp} / ${enemyHp} HP)`;
    
    const combatLog = document.getElementById('combat-log');
    if (combatLog) {
        combatLog.innerHTML = `<p class="text-red-400 font-bold">[ENGAGEMENT] Threat detected: ${enemyName} at ${gameState.combat.distanceMeters} meters!</p>`;
    }
    
    logEvent(`[COMBAT ENGAGED] Encountered hostile target: ${enemyName}.`);
    
    // Switch to combat tab automatically
    const combatTabBtn = document.querySelector('[data-tab="combat"]');
    if (combatTabBtn) combatTabBtn.click();
    
    renderActions();
}

export function resolveCombatAction(actionType) {
    if (!gameState.combat.active) return;
    gameState.combat.turnCount += 1;
    const combatLog = document.getElementById('combat-log');
    if (!combatLog) return;

    // Retrieve currently equipped weapon from inventory
    const equippedWeaponId = gameState.player.equipped.weapon;
    let weapon = gameState.inventory.find(i => i.id === equippedWeaponId);

    // Fallback if weapon is missing or destroyed
    if (!weapon || (weapon.durability !== undefined && weapon.durability <= 0)) {
        weapon = {
            id: 'unarmed',
            name: 'Unarmed / Fists',
            damage: 10,
            noise: 'Silent',
            type: 'weapon',
            durability: 100,
            maxDurability: 100
        };
    }

    let baseDamage = weapon.damage || 20;
    let actionNoise = 5;
    let accuracyMultiplier = 1.0;

    // Trauma stress penalty check
    if (gameState.player.trauma >= 45) {
        accuracyMultiplier -= 0.15; // Jittery hands reduce effectiveness
        combatLog.innerHTML += `<p class="text-amber-500 text-[11px]">[STRESS] High trauma causes your hands to shake...</p>`;
    }

    // Handle ranged / firearm ammo consumption & noise profiles
    if (weapon.id === 'suppressed_pistol' || weapon.id === 'assault_rifle') {
        const ammoType = weapon.id === 'assault_rifle' ? 'ammunition_556' : 'ammunition_9mm';
        let ammoItem = gameState.inventory.find(i => i.id === ammoType);
        
        // Fallback to any available ammo if specific type missing
        if (!ammoItem || ammoItem.qty < 1) {
            ammoItem = gameState.inventory.find(i => i.type === 'ammo' && i.qty > 0);
        }

        if (!ammoItem || ammoItem.qty < 1) {
            combatLog.innerHTML += `<p class="text-amber-400">⚠️ Out of ammunition for ${weapon.name}! Striking with pistol-whip / melee.</p>`;
            baseDamage = 12;
            actionNoise = 8;
        } else {
            ammoItem.qty -= 1;
            if (ammoItem.qty <= 0) {
                gameState.inventory = gameState.inventory.filter(i => i !== ammoItem);
            }
            baseDamage += (weapon.id === 'assault_rifle' ? 35 : 15);
            actionNoise = weapon.id === 'suppressed_pistol' ? 12 : 30; // Unsuppressed / Rifle is loud!
        }
    }

    // Apply weapon durability degradation per use
    if (weapon.durability !== undefined && weapon.id !== 'unarmed') {
        weapon.durability = Math.max(0, weapon.durability - (Math.random() * 3 + 1));
        if (weapon.durability <= 0) {
            combatLog.innerHTML += `<p class="text-red-500 font-bold">💥 Your ${weapon.name} broke from wear and tear!</p>`;
            showToast(`⚠️ Your ${weapon.name} broke!`, "warning");
            gameState.player.equipped.weapon = 'unarmed';
        }
    }

    // Update noise meter
    gameState.combat.noiseMeterValue = Math.min(100, gameState.combat.noiseMeterValue + actionNoise);
    updateNoiseMeterDisplay();

    // Calculate action results
    let calculatedDmg = Math.floor(baseDamage * accuracyMultiplier);

    if (actionType === 'head') {
        // High risk, high reward
        const hitChance = Math.random();
        if (hitChance > 0.4) {
            calculatedDmg = Math.floor(calculatedDmg * 2.2);
            gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - calculatedDmg);
            combatLog.innerHTML += `<p class="text-emerald-400">🎯 Precise headshot with ${weapon.name}! Dealt ${calculatedDmg} DMG.</p>`;
        } else {
            combatLog.innerHTML += `<p class="text-amber-400">❌ Headshot missed! Target evaded the strike.</p>`;
            calculatedDmg = 0;
        }
    } else if (actionType === 'body') {
        // Safe, reliable center mass
        gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - calculatedDmg);
        combatLog.innerHTML += `<p class="text-zinc-300">🛡️ Center mass strike with ${weapon.name} hit for ${calculatedDmg} DMG.</p>`;
    } else if (actionType === 'limb') {
        // Target limbs/legs to slow down
        calculatedDmg = Math.floor(calculatedDmg * 0.7);
        gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - calculatedDmg);
        combatLog.innerHTML += `<p class="text-blue-400">🗡️ Crippling strike landed! Dealt ${calculatedDmg} DMG and slowed target.</p>`;
    } else if (actionType === 'flee') {
        const escapeRoll = Math.random();
        if (escapeRoll > 0.35 || gameState.combat.noiseMeterValue > 80) {
            combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏃 Successfully broke line of sight and escaped into cover.</p>`;
            endCombat(true);
            return;
        } else {
            combatLog.innerHTML += `<p class="text-red-400">⚠️ Escape blocked! The enemy cut off your path.</p>`;
        }
    }

    // Check for victory condition
    if (gameState.combat.enemyHp <= 0) {
        combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏆 VICTORY! ${gameState.combat.enemyName} has been neutralized.</p>`;
        endCombat(false);
        return;
    }

    // Enemy Retaliation Turn
    let enemyDmg = Math.floor(Math.random() * 12) + 8;
    
    // Check armor mitigation
    if (gameState.player.equipped.armor === 'riot_vest') {
        enemyDmg = Math.max(3, enemyDmg - 5);
    }

    gameState.player.hp = Math.max(0, gameState.player.hp - enemyDmg);
    combatLog.innerHTML += `<p class="text-red-400">💥 ${gameState.combat.enemyName} counter-attacked, dealing ${enemyDmg} DMG!</p>`;

    // Companion Support Fire Chance (e.g., Carol or Daryl assisting if at base/nearby)
    if (Math.random() < 0.25) {
        const assistingCompanion = gameState.companions[Math.floor(Math.random() * gameState.companions.length)];
        if (assistingCompanion && assistingCompanion.loyalty > 60) {
            const assistDmg = 25;
            gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - assistDmg);
            combatLog.innerHTML += `<p class="text-purple-400">🎯 Over-watch support! ${assistingCompanion.name} fired a suppressing shot for ${assistDmg} DMG!</p>`;
        }
    }

    // Check player defeat condition
    if (gameState.player.hp <= 0) {
        combatLog.innerHTML += `<p class="text-red-600 font-bold animate-pulse">💀 FATAL INJURY: You have succumbed to your wounds...</p>';
        showToast("💀 You have been defeated in combat!", "warning");
        setTimeout(() => {
            alert("💀 Game Over: Your survivor perished in the wasteland.");
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }, 1500);
        return;
    }

    combatLog.scrollTop = combatLog.scrollHeight;
    renderVitals();
    renderInventory();
}

function updateNoiseMeterDisplay() {
    const val = gameState.combat.noiseMeterValue;
    let label = "Low (Quiet)", color = "text-emerald-400";
    if (val > 40 && val <= 75) {
        label = "Moderate (Caution)"; color = "text-amber-400";
    } else if (val > 75) {
        label = "CRITICAL (SWARM ATTRACTING)"; color = "text-red-600 animate-pulse";
    }
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
        // Reward loot drop
        const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
        if (scrapItem) {
            scrapItem.qty += Math.floor(Math.random() * 3) + 2;
        } else {
            gameState.inventory.push({ id: 'scrap_metal', name: 'Industrial Scrap Metal', qty: 3, type: 'material', value: 5 });
        }
        logEvent(`[VICTORY] Secured combat zone and salvaged scrap materials.`);
        showToast("Combat won! Looted wreckage.", "success");
    }

    renderInventory();
    renderActions();
    
    // Switch back to story narrative tab
    const storyTabBtn = document.querySelector('[data-tab="story"]');
    if (storyTabBtn) storyTabBtn.click();
}
