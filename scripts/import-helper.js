// Martyr Class Compendium Import Helper
// Run this in Foundry's console (F12) to import the class items

async function importMartyrClassItems() {
    console.log("Starting Martyr Class import...");
    
    // Get the compendium packs
    const classPack = game.packs.get("dnd5e-martyr-class.martyr-class-features");
    const spellsPack = game.packs.get("dnd5e-martyr-class.martyr-spells");
    const subclassPack = game.packs.get("dnd5e-martyr-class.martyr-subclasses");
    
    if (!classPack || !spellsPack || !subclassPack) {
        console.error("Could not find Martyr Class compendium packs!");
        return;
    }
    
    // Class definition
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
                <p><strong>Skills:</strong> Choose two from Athletics, Intimidation, Medicine, Persuasion, Religion, and Survival</p>`
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
    
    // Create the class item
    try {
        const classItem = await Item.create(martyrClassData);
        await classPack.importDocument(classItem);
        console.log("✓ Martyr Class imported successfully!");
    } catch (error) {
        console.error("Failed to import Martyr Class:", error);
    }
    
    console.log("Martyr Class import complete!");
}

// Auto-run if needed
// importMartyrClassItems();
