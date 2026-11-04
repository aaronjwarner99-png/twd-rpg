import { loadGame, saveGame, gameState, showToast } from './state.js';
import { gameTick } from './engine.js';
import { resolveCombatAction } from './combat.js';
import { amputateLimb, treatBleed, useItem, discardItem, equipItem } from './survival.js';
import { triggerScavenge, patrolPerimeter, restAtBase, upgradeModule, researchTech, repairVehicle, travelToSector } from './actions.js';
import { renderAll } from './render.js';

let gameInterval = null;
let autoSaveInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    try {
        const loaded = loadGame();
        if (loaded) {
            showToast("Game save successfully restored.", "success");
        } else {
            showToast("New wasteland survival simulation initialized.", "info");
        }

        initTabs();
        initCombatButtons();
        initHeaderButtons();
        initGlobalEventListeners();
        initKeyboardShortcuts();
        initVisibilityHandlers();
        
        renderAll();
        
        // Start core game loops (10 seconds = 1 in-game hour)
        startGameLoops();
    } catch (error) {
        console.error("[CRITICAL APP ERROR]", error);
        showToast("⚠️ Critical error during initialization. Check console.", "warning");
    }
});

function startGameLoops() {
    if (gameInterval) clearInterval(gameInterval);
    if (autoSaveInterval) clearInterval(autoSaveInterval);

    gameInterval = setInterval(() => {
        try {
            gameTick();
        } catch (err) {
            console.error("[TICK ERROR]", err);
        }
    }, 10000);

    autoSaveInterval = setInterval(() => {
        saveGame();
        showToast("Game automatically saved.", "info");
    }, 180000); // 3 minutes
}

function initHeaderButtons() {
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-save-btn');
    const resetBtn = document.getElementById('reset-btn');

    saveBtn?.addEventListener('click', () => {
        if (saveGame()) {
            showToast("Game saved manually.", "success");
        }
    });

    exportBtn?.addEventListener('click', () => {
        try {
            const saveJson = JSON.stringify(gameState, null, 2);
            const blob = new Blob([saveJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `twd_rpg_save_day_${gameState.day}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Save file exported successfully.", "success");
        } catch (e) {
            console.error("[EXPORT ERROR]", e);
            showToast("⚠️ Failed to export save file.", "warning");
        }
    });

    resetBtn?.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your current survival run? All progress will be permanently lost.")) {
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
            const targetTabId = tab.dataset.tab;
            
            // Update tab buttons styling
            tabs.forEach(t => {
                t.classList.remove('active', 'border-red-600', 'text-red-500');
                t.classList.add('border-transparent', 'text-zinc-400');
            });
            tab.classList.add('active', 'border-red-600', 'text-red-500');
            tab.classList.remove('border-transparent', 'text-zinc-400');
            
            // Toggle tab contents with smooth fade-in animation class
            contents.forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('animate-fadeIn');
            });
            
            const activeContent = document.getElementById(`tab-${targetTabId}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
                activeContent.classList.add('animate-fadeIn');
            }
        });
    });
}

function initCombatButtons() {
    document.querySelectorAll('.combat-act-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetAction = e.currentTarget.dataset.target;
            resolveCombatAction(targetAction);
        });
    });
}

function initGlobalEventListeners() {
    // Delegated Event Listener for Dynamic Buttons rendered via JS
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        const index = parseInt(target.dataset.index);

        try {
            if (action === 'amputate') amputateLimb(target.dataset.limb);
            if (action === 'treat-bleed') treatBleed(target.dataset.limb);
            if (action === 'use-item') useItem(index);
            if (action === 'discard-item') discardItem(index);
            if (action === 'equip-item') equipItem(target.dataset.id);
            if (action === 'upgrade-mod') upgradeModule(index);
            if (action === 'research') researchTech(target.dataset.key);
            if (action === 'repair-veh') repairVehicle(index);
            if (action === 'travel') travelToSector(target.dataset.id);
        } catch (err) {
            console.error(`[ACTION ERROR: ${action}]`, err);
            showToast("⚠️ Action failed to execute.", "warning");
        }
    });

    // Quick action button handlers
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'btn-scavenge') triggerScavenge();
        if (e.target.id === 'btn-patrol') patrolPerimeter();
        if (e.target.id === 'btn-rest') restAtBase();
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        const tabs = ['story', 'combat', 'inventory', 'map', 'base', 'factions'];
        
        // Number keys 1-6 to switch tabs quickly
        if (e.key >= '1' && e.key <= '6') {
            const index = parseInt(e.key) - 1;
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabs[index]}"]`);
            if (tabBtn) tabBtn.click();
        }
        
        // Quick save with Ctrl+S or Cmd+S
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            saveGame();
            showToast("Game saved via keyboard shortcut.", "success");
        }
    });
}

function initVisibilityHandlers() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (gameInterval) clearInterval(gameInterval);
        } else {
            startGameLoops();
            renderAll();
        }
    });
}
