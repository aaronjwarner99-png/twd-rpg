import { loadGame, saveGame } from './state.js';
import { gameTick } from './engine.js';
import { resolveCombatAction } from './combat.js';
import { amputateLimb, treatBleed, useItem, discardItem } from './survival.js';
import { triggerScavenge, patrolPerimeter, restAtBase, upgradeModule, researchTech, repairVehicle, travelToSector } from './actions.js';
import { renderAll } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initTabs();
    initCombatButtons();
    initHeaderButtons();
    initGlobalEventListeners();
    
    renderAll();
    
    // 10 seconds = 1 in-game hour
    setInterval(gameTick, 10000);
    setInterval(saveGame, 180000); // Autosave every 3 minutes
});

function initHeaderButtons() {
    document.getElementById('save-btn')?.addEventListener('click', () => saveGame());
    document.getElementById('reset-btn')?.addEventListener('click', () => {
        if (confirm("Reset current run?")) {
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'border-red-600', 'text-red-500'));
            tab.classList.add('active', 'border-red-600', 'text-red-500');
            contents.forEach(c => c.classList.add('hidden'));
            document.getElementById(`tab-${tab.dataset.tab}`)?.classList.remove('hidden');
        });
    });
}

function initCombatButtons() {
    document.querySelectorAll('.combat-act-btn').forEach(btn => {
        btn.addEventListener('click', (e) => resolveCombatAction(e.currentTarget.dataset.target));
    });
}

function initGlobalEventListeners() {
    // Delegated Event Listener for Dynamic Buttons rendered via JS
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        if (action === 'amputate') amputateLimb(target.dataset.limb);
        if (action === 'treat-bleed') treatBleed(target.dataset.limb);
        if (action === 'use-item') useItem(parseInt(target.dataset.index));
        if (action === 'discard-item') discardItem(parseInt(target.dataset.index));
        if (action === 'upgrade-mod') upgradeModule(parseInt(target.dataset.index));
        if (action === 'research') researchTech(target.dataset.key);
        if (action === 'repair-veh') repairVehicle(parseInt(target.dataset.index));
        if (action === 'travel') travelToSector(target.dataset.id);
    });

    // Action button handlers
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'btn-scavenge') triggerScavenge();
        if (e.target.id === 'btn-patrol') patrolPerimeter();
        if (e.target.id === 'btn-rest') restAtBase();
    });
}