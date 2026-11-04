import { gameState, logEvent, showToast } from './state.js';
import { renderAll } from './render.js';

export function gameTick() {
    gameState.hour += 1;
    gameState.playtimeSeconds += 10;
    
    if (gameState.hour >= 24) {
        gameState.hour = 0;
        gameState.day += 1;
        processDailySettlementCycle();
        processFactionShifts();
    }
    
    // Time of Day determination
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
    
    let foodGenerated = 0;
    let waterGenerated = 0;
    let fuelGenerated = 0;
    let scrapGenerated = 0;
    
    // Process base modules
    gameState.base.modules.forEach(mod => {
        if (mod.status === 'Active') {
            if (mod.id === 'hydroponics') foodGenerated += (mod.level * 6);
            if (mod.id === 'water_purifier') waterGenerated += (mod.level * 10);
            if (mod.id === 'methane_rig') fuelGenerated += (mod.level * 5);
            if (mod.id === 'armory') scrapGenerated += (mod.level * 2);
        }
    });

    const pop = gameState.base.population;
    const foodConsumed = pop * 2;
    const waterConsumed = pop * 2;
    
    gameState.base.foodRations = Math.max(0, (gameState.base.foodRations + foodGenerated) - foodConsumed);
    gameState.base.waterSupply = Math.max(0, (gameState.base.waterSupply + waterGenerated) - waterConsumed);
    gameState.base.treasuryScrap += scrapGenerated;

    // Fuel vehicle top-off if generator running
    if (fuelGenerated > 0 && gameState.vehicles[0]) {
        gameState.vehicles[0].fuel = Math.min(gameState.vehicles[0].maxFuel, gameState.vehicles[0].fuel + fuelGenerated);
    }

    logEvent(`[LOGISTICS] Produced +${foodGenerated} food, +${waterGenerated} water, +${scrapGenerated} scrap. Consumed ${foodConsumed} food units.`);
    
    // Check morale impacts from food/water scarcity
    if (gameState.base.foodRations <= 10 || gameState.base.waterSupply <= 10) {
        gameState.base.morale = Math.max(0, gameState.base.morale - 12);
        showToast("⚠️ WARNING: Base rations critically low! Survivor morale is dropping.", "warning");
        
        // Companion loyalty drop due to hardship
        gameState.companions.forEach(c => {
            c.loyalty = Math.max(10, c.loyalty - 3);
        });
    } else {
        gameState.base.morale = Math.min(100, gameState.base.morale + 2);
    }
}

function processFactionShifts() {
    // Dynamic background political shifts between factions
    Object.values(gameState.factions).forEach(fac => {
        if (fac.standing < 0 && Math.random() < 0.25) {
            fac.standing = Math.max(-100, fac.standing - 2);
            logEvent(`[INTELLIGENCE] Hostile activity detected from ${fac.name}. Standing worsened.`);
        }
    });
}

function updateWeatherConditions() {
    const weathers = [
        { name: "Clear Sky", desc: "Standard visibility and moderate climate." },
        { name: "Overcast", desc: "Dim lighting, subdued ambient temperature." },
        { name: "Acidic Haze", desc: "Corrosive fog increases equipment wear and lung irritation." },
        { name: "Torrential Rain", desc: "Heavy downpour reduces movement speed and dampens noise." },
        { name: "Dense Fog", desc: "Zero visibility increases ambush risks significantly." }
    ];
    
    if (Math.random() < 0.18) {
        const selected = weathers[Math.floor(Math.random() * weathers.length)];
        gameState.weather = selected.name;
        logEvent(`[WEATHER] Atmospheric shift: ${selected.name} — ${selected.desc}`);
    }
}

function updateEnvironmentalHazards() {
    // Temperature fluctuation based on time of day and weather
    if (gameState.timeOfDay.includes("Night")) {
        gameState.temperature = Math.max(30, gameState.temperature - 2);
    } else if (gameState.timeOfDay === "Afternoon") {
        gameState.temperature = Math.min(98, gameState.temperature + 2);
    }

    // Weather modifiers
    if (gameState.weather === "Acidic Haze") {
        gameState.player.hp = Math.max(5, gameState.player.hp - 1);
        logEvent("[ENVIRONMENT] Acidic haze is causing skin irritation and minor tissue damage.");
    }

    // Regional radiation hazards
    if (gameState.currentRegion.includes("manhattan") || gameState.currentRegion.includes("crm")) {
        gameState.radiationLevel = Math.min(100, gameState.radiationLevel + 2);
        if (gameState.radiationLevel >= 40) {
            gameState.player.hp = Math.max(5, gameState.player.hp - 3);
            logEvent("[RADIATION WARNING] High background radiation detected. Cellular damage occurring.");
        }
    }
}

function processPassiveSurvivalDrain() {
    let hungerDrain = 2.0;
    let thirstDrain = 3.0;

    // Weather impact on thirst
    if (gameState.temperature > 85 || gameState.weather === "Acidic Haze") {
        thirstDrain = 4.5;
    }

    gameState.player.hunger = Math.max(0, gameState.player.hunger - hungerDrain);
    gameState.player.thirst = Math.max(0, gameState.player.thirst - thirstDrain);
    gameState.player.sleep = Math.max(0, gameState.player.sleep - 1.5);

    // Stamina recovery or exhaustion drain
    if (gameState.player.sleep > 25) {
        gameState.player.stamina = Math.min(gameState.player.maxStamina, gameState.player.stamina + 6);
    } else {
        gameState.player.stamina = Math.max(10, gameState.player.stamina - 8);
        showToast("⚠️ Exhaustion setting in due to lack of rest.", "warning");
    }

    // Severe starvation / dehydration penalties to HP
    if (gameState.player.hunger <= 10) {
        gameState.player.hp = Math.max(5, gameState.player.hp - 5);
        showToast("⚠️ Starvation damage! Eat food immediately.", "warning");
    }
    if (gameState.player.thirst <= 10) {
        gameState.player.hp = Math.max(5, gameState.player.hp - 8);
        showToast("⚠️ Severe dehydration! Drink water immediately.", "warning");
    }
}

function processInfectionProgression() {
    const bittenLimbs = Object.values(gameState.player.limbs).some(l => l.bitten && !l.amputated);
    if (bittenLimbs) {
        let infectionRate = 10;
        const hasAntibiotics = gameState.inventory.some(i => i.id === 'antibiotics' && i.qty > 0);
        const hasInfirmary = gameState.base.modules.some(m => m.id === 'infirmary' && m.status === 'Active');
        
        if (hasInfirmary) infectionRate -= 3;
        if (hasAntibiotics) infectionRate -= 5;
        
        gameState.player.infection = Math.min(100, gameState.player.infection + Math.max(2, infectionRate));
        
        if (gameState.player.infection >= 100) {
            logEvent("[FATALITY] Wildfire virus reached 100% saturation. Survivor turned.");
            alert("💀 Game Over: The infection reached 100%. You turned into a walker.");
            localStorage.removeItem('twd_rpg_save');
            location.reload();
        } else if (gameState.player.infection >= 75) {
            showToast("🚨 CRITICAL INFECTION: Fever and black veins spreading fast!", "warning");
        }
    }
}

function updateTraumaState() {
    const t = gameState.player.trauma;
    if (t < 20) {
        gameState.player.traumaState = "Clear Mind";
    } else if (t < 45) {
        gameState.player.traumaState = "Stressed & Jittery (-15% Accuracy)";
    } else if (t < 75) {
        gameState.player.traumaState = "Paranoia & Insomnia";
    } else {
        gameState.player.traumaState = "Severe Psychological Break";
    }
}
