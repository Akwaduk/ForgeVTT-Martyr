// Martyr Class Creation Macro
// Run this macro in Foundry VTT to create the Martyr class if it's missing

async function createMartyrClass() {
    // Check if user is GM
    if (!game.user.isGM) {
        ui.notifications.warn("Only GMs can create compendium items!");
        return;
    }
    
    // Get the class features compendium
    const classPack = game.packs.get("dnd5e-martyr-class.martyr-class-features");
    if (!classPack) {
        ui.notifications.error("Martyr Class Features compendium not found! Make sure the module is enabled.");
        return;
    }
    
    // Check if class already exists
    await classPack.getIndex();
    const existingClass = classPack.index.find(item => item.name === "Martyr" && item.type === "class");
    if (existingClass) {
        ui.notifications.info("Martyr class already exists in the compendium!");
        return;
    }
    
    // Create the class data
    const martyrClassData = {
        name: "Martyr",
        type: "class",
        img: "icons/magic/death/skull-bones-worn-brown.webp",
        system: {
            description: {
                value: `<p>The Martyr understands that suffering is the ultimate path to self-realization. They obtain their powers through a profound connection to either the Sun or the Moon, aligning with paths of Mercy or Vengeance.</p>
                <h3>Hit Points</h3>
                <p><strong>Hit Dice:</strong> 1d10 per Martyr level</p>
                <p><strong>Hit Points at 1st Level:</strong> 10 + your Constitution modifier</p>
                <p><strong>Hit Points at Higher Levels:</strong> 1d10 (or 6) + your Constitution modifier per Martyr level after 1st</p>
                <h3>Proficiencies</h3>
                <p><strong>Armor:</strong> Light armor, Medium armor, Shields</p>
                <p><strong>Weapons:</strong> Simple weapons, Greatsword, Maul, Heavy Crossbow</p>
                <p><strong>Tools:</strong> None</p>
                <p><strong>Saving Throws:</strong> Constitution, Wisdom</p>
                <p><strong>Skills:</strong> Choose two from Athletics, Intimidation, Medicine, Persuasion, Religion, and Survival</p>`,
                chat: "",
                unidentified: ""
            },
            source: "Martyr Class",
            identifier: "martyr",
            levels: 1,
            hitDice: "d10",
            hitDiceUsed: 0,
            saves: ["con", "wis"],
            skills: {
                number: 2,
                choices: ["ath", "inti", "med", "per", "rel", "sur"],
                value: []
            },
            spellcasting: {
                progression: "none",
                ability: ""
            }
        }
    };
    
    try {
        // Create the class and add it to the compendium
        const classDoc = await Item.create(martyrClassData, {pack: classPack.collection});
        ui.notifications.info("✓ Martyr class created successfully!");
        console.log("Martyr Class created:", classDoc);
    } catch (error) {
        ui.notifications.error("Failed to create Martyr class: " + error.message);
        console.error("Error creating Martyr class:", error);
    }
}

// Run the function
createMartyrClass();
