import { gameState, logEvent, showToast } from './state.js';
import { renderAll } from './render.js';

export function gameTick() {
    gameState.hour += 1;
    gameState.playtimeSeconds += 10;
    if (gameState.hour >= 24) {
        gameState.hour = 0;
        gameState.day += 1;
        processDailySettlementCycle();
    }
    
    if (gameState.hour >= 5 && gameState.hour < 12) gameState.timeOfDay = "Morning";
    else if (gameState.hour >= 12 && gameState.hour < 17) gameState.timeOfDay = "Afternoon";
    else if (gameState.hour >= 17 && gameState.hour < 21) gameState.timeOfDay = "Dusk";
    else gameState.timeOfDay = "Night (High Danger)";

    updateWeatherConditions();
    updateEnvironmentalHazards();
    processPassiveSurvivalDrain();
    processInfectionProgression();
    updateTraumaState();
    renderAll();
}

function processDailySettlementCycle() {
    logEvent(`[DAY SHIFT] Dawn breaks on Day ${gameState.day} at ${gameState.base.name}.`);
    let foodGenerated = 0, waterGenerated = 0, fuelGenerated = 0;
    
    gameState.base.modules.forEach(mod => {
        if (mod.status === 'Active') {
            if (mod.id === 'hydroponics') foodGenerated += (mod.level * 6);
            if (mod.id === 'water_purifier') waterGenerated += (mod.level * 10);
            if (mod.id === 'methane_rig') fuelGenerated += (mod.level * 5);
        }
    });

    const pop = gameState.base.population;
    const foodConsumed = pop * 2;
    const waterConsumed = pop * 2;
    gameState.base.foodRations = Math.max(0, (gameState.base.foodRations + foodGenerated) - foodConsumed);
    gameState.base.waterSupply = Math.max(0, (gameState.base.waterSupply + waterGenerated) - waterConsumed);

    if (fuelGenerated > 0 && gameState.vehicles[0]) {
        gameState.vehicles[0].fuel = Math.min(gameState.vehicles[0].maxFuel, gameState.vehicles[0].fuel + fuelGenerated);
    }
    logEvent(`[LOGISTICS] Produced +${foodGenerated} food, +${waterGenerated} water. Consumed ${foodConsumed} units.`);
    
    if (gameState.base.foodRations <= 10) {
        gameState.base.morale = Math.max(0, gameState.base.morale - 10);
        showToast("⚠️ WARNING: Base food rations critically low!", "warning");
    }
}

function updateWeatherConditions() {
    const weathers = [
        { name: "Clear Sky", desc: "Standard visibility." },
        { name: "Overcast", desc: "Dim lighting." },
        { name: "Acidic Haze", desc: "Corrosive fog." },
        { name: "Torrential Rain", desc: "Heavy downpour." },
        { name: "Dense Fog", desc: "Zero visibility." }
    ];
    if (Math.random() < 0.20) {
        const selected = weathers[Math.floor(Math.random() * weathers.length)];
        gameState.weather = selected.name;
        logEvent(`[WEATHER] Atmospheric shift: ${selected.name}`);
    }
}

function updateEnvironmentalHazards() {
    if (gameState.timeOfDay.includes("Night")) gameState.temperature = Math.max(35, gameState.temperature - 2);
    else if (gameState.timeOfDay === "Afternoon") gameState.temperature = Math.min(95, gameState.temperature + 2);

    if (gameState.currentRegion.includes("manhattan") || gameState.currentRegion.includes("crm")) {
        gameState.radiationLevel = Math.min(100, gameState.radiationLevel + 1);
        if (gameState.radiationLevel >= 50) {
            gameState.player.hp = Math.max(5, gameState.player.hp - 2);
            logEvent("[RADIATION WARNING] Cellular tissue damage detected.");
        }
    }
}

function processPassiveSurvivalDrain() {
    gameState.player.hunger = Math.max(0, gameState.player.hunger - 2.5);
    gameState.player.thirst = Math.max(0, gameState.player.thirst - 3.5);
    gameState.player.sleep = Math.max(0, gameState.player.sleep - 2);

    if (gameState.player.sleep > 20) {
        gameState.player.stamina = Math.min(gameState.player.maxStamina, gameState.player.stamina + 8);
    } else {
        gameState.player.stamina = Math.max(10, gameState.player.stamina - 5);
    }

    if (gameState.player.hunger <= 10) gameState.player.hp = Math.max(5, gameState.player.hp - 6);
    if (gameState.player.thirst <= 10) gameState.player.hp = Math.max(5, gameState.player.hp - 10);
}

function processInfectionProgression() {
    const bittenLimbs = Object.values(gameState.player.limbs).some(l => l.bitten && !l.amputated);
    if (bittenLimbs) {
        let infectionRate = 12;
        const hasAntibiotics = gameState.inventory.some(i => i.id === 'antibiotics' && i.qty > 0);
        const hasInfirmary = gameState.base.modules.some(m => m.id === 'infirmary' && m.status === 'Active');
        if (hasInfirmary) infectionRate -= 4;
        if (hasAntibiotics) infectionRate -= 6;
        gameState.player.infection = Math.min(100, gameState.player.infection + Math.max(2, infectionRate));
        
        if (gameState.player.infection >= 100) {
            alert("💀 Game Over: The infection reached 100%. You turned into a walker.");
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        }
    }
}

function updateTraumaState() {
    const t = gameState.player.trauma;
    if (t < 20) gameState.player.traumaState = "Clear Mind";
    else if (t < 45) gameState.player.traumaState = "Stressed & Jittery (-5% Accuracy)";
    else if (t < 75) gameState.player.traumaState = "Paranoia & Insomnia";
    else gameState.player.traumaState = "Severe Psychological Break";
}