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
    if (statusEl) statusEl.innerText = `${enemyName} (${enemyHp} HP)`;
    
    const combatLog = document.getElementById('combat-log');
    if (combatLog) combatLog.innerHTML = `<p class="text-red-400 font-bold">[ENGAGEMENT] ${enemyName} spotted at ${gameState.combat.distanceMeters}m!</p>`;
    
    logEvent(`[COMBAT ENGAGED] Threat detected: ${enemyName}.`);
    
    const combatTabBtn = document.querySelector('[data-tab="combat"]');
    if (combatTabBtn) combatTabBtn.click();
    renderActions();
}

export function resolveCombatAction(actionType) {
    if (!gameState.combat.active) return;
    gameState.combat.turnCount += 1;
    const combatLog = document.getElementById('combat-log');
    if (!combatLog) return;

    const equippedWeapon = gameState.inventory.find(i => i.id === gameState.player.equipped.weapon) || {
        name: 'Unarmed', damage: 10, noise: 'Silent', type: 'weapon', durability: 100
    };

    let baseDamage = equippedWeapon.damage || 20;
    let actionNoise = 5;

    if (equippedWeapon.id === 'suppressed_pistol') {
        const ammoItem = gameState.inventory.find(i => i.id === 'ammunition_9mm');
        if (!ammoItem || ammoItem.qty < 1) {
            combatLog.innerHTML += `<p class="text-amber-400">⚠️ Out of 9mm ammo! Striking with melee.</p>`;
            baseDamage = 8;
            actionNoise = 10;
        } else {
            ammoItem.qty -= 1;
            baseDamage += 10;
            actionNoise = 12;
        }
    }

    gameState.combat.noiseMeterValue = Math.min(100, gameState.combat.noiseMeterValue + actionNoise);
    updateNoiseMeterDisplay();

    if (actionType === 'head') {
        gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - Math.floor(baseDamage * 2.5));
        combatLog.innerHTML += `<p class="text-emerald-400">🎯 Critical headshot on ${gameState.combat.enemyName}!</p>`;
    } else if (actionType === 'body') {
        gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - baseDamage);
        combatLog.innerHTML += `<p class="text-zinc-300">🛡️ Center mass strike hit for ${baseDamage} DMG.</p>`;
    } else if (actionType === 'flee') {
        combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏃 Successfully escaped into cover.</p>`;
        endCombat(true);
        return;
    }

    if (gameState.combat.enemyHp <= 0) {
        combatLog.innerHTML += `<p class="text-emerald-400 font-bold">🏆 VICTORY! ${gameState.combat.enemyName} neutralized.</p>`;
        endCombat(false);
    } else {
        const enemyDmg = Math.floor(Math.random() * 12) + 8;
        gameState.player.hp = Math.max(0, gameState.player.hp - enemyDmg);
        combatLog.innerHTML += `<p class="text-red-400">💥 ${gameState.combat.enemyName} retaliated for ${enemyDmg} DMG.</p>`;
    }

    combatLog.scrollTop = combatLog.scrollHeight;
    renderVitals();
    renderInventory();
}

function updateNoiseMeterDisplay() {
    const val = gameState.combat.noiseMeterValue;
    let label = "Low (Quiet)", color = "text-emerald-400";
    if (val > 60) { label = "CRITICAL (SWARM ATTRACTING)"; color = "text-red-600 animate-pulse"; }
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
        const scrapItem = gameState.inventory.find(i => i.id === 'scrap_metal');
        if (scrapItem) scrapItem.qty += 2;
        logEvent(`[VICTORY] Looted scrap metal from combat zone.`);
    }
    renderInventory();
    renderActions();
}