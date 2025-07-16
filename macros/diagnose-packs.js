// Diagnostic macro to check pack status
// Run this in Foundry to see what packs are loaded

console.log("=== MARTYR CLASS DIAGNOSTIC ===");

const expectedPacks = [
    "dnd5e-martyr-class.martyr-classes",
    "dnd5e-martyr-class.martyr-class-features", 
    "dnd5e-martyr-class.martyr-spells",
    "dnd5e-martyr-class.martyr-subclasses"
];

console.log("Expected packs:", expectedPacks);
console.log("Available packs:", Array.from(game.packs.keys()).filter(k => k.startsWith("dnd5e-martyr-class")));

for (const packKey of expectedPacks) {
    const pack = game.packs.get(packKey);
    if (pack) {
        console.log(`✅ ${packKey}: Found (${pack.metadata.label})`);
        pack.getIndex().then(index => {
            console.log(`   Items: ${index.size}`);
        });
    } else {
        console.log(`❌ ${packKey}: Missing`);
    }
}

ui.notifications.info("Check console (F12) for diagnostic results");
