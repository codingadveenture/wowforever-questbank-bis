(() => {
  "use strict";

  const STORAGE_KEY = "friend-warrior-level20-ledger-v1";
  const QUEST_STATES = ["todo", "ready", "turned", "skip"];
  const GEAR_STATES = ["need", "owned", "skip"];
  const LEVELS = ["17", "18", "19", "20", "21"];
  const TABS = ["bank", "prep", "gear", "craft", "turnin", "notes"];
  const WH = "https://www.wowhead.com/forever";
  const item = id => `${WH}/item=${id}`;
  const search = name => `${WH}/search?q=${encodeURIComponent(name)}`;

  const questGroups = [
    {
      id: "deadmines",
      title: "The Deadmines",
      accent: "#d5aa52",
      summary: "7 slots · 30,450 XP",
      quests: [
        q("dm-defias", "The Defias Brotherhood", 9750, 166, "Sentinel Hill", "Bank until the cap rises; then take Chausses of Westfall, the strongest guaranteed warrior reward.", ["protect", "group"]),
        q("dm-underground", "Underground Assault", 5800, 2040, "Stormwind", "Bank until the cap rises. Read the reward pane: Bravo’s Armbands only if they beat your bracers.", ["protect", "group"]),
        q("dm-bandanas", "Red Silk Bandanas", 4700, 214, "Sentinel Hill", "Pick up after the Defias Traitor escort. Level-17 quest: turn in early on release night.", ["group", "decay"]),
        q("dm-destruction", "Destruction in Deadmines", 4050, 92753, "Deadmines exit", "Finish Alba Fairmoon’s chain first; plant explosives at the forge. Level-18 quest.", ["group", "decay"]),
        q("dm-letter", "The Unsent Letter", 3250, 373, "Stormwind", "Keep banked; it starts the Stockade and Seal of Wrynn chain.", ["protect", "group"]),
        q("dm-brother", "Oh Brother…", 1550, 167, "Stormwind", "Foreman Thistlenettle in the undead mine approach.", ["group"]),
        q("dm-memories", "Collecting Memories", 1350, 168, "Stormwind", "Four Miners’ Union Cards in the approach mine. Level-18 quest.", ["group", "decay"]),
      ],
    },
    {
      id: "redridge",
      title: "Redridge core",
      accent: "#e46e78",
      summary: "9 slots · 21,850 XP",
      quests: [
        q("rr-morganth", "Morganth", 2750, 249, "Tower of Azora", "Unlock through A Watchful Eye and Looking Further. Reported to start at level 20 and is elite.", ["group", "needs20"]),
        q("rr-fangore", "WANTED: Lieutenant Fangore", 2650, 180, "Lakeshire", "Eastern Shadowhide camp. You tank, the group kills.", ["group"]),
        q("rr-gath", "WANTED: Gath’Ilzogg", 2650, 169, "Lakeshire", "Stonewatch clear; pull carefully, the keep chains packs.", ["group", "hard"]),
        q("rr-garim", "WANTED: Incinerator Gar’im", 2550, 95999, "Lakeshire", "Northern Blackrock route. Level-25 elite, accepts from 16.", ["group"]),
        q("rr-mia", "Missing In Action", 2550, 219, "Lakeshire", "Escort Keeshan after clearing Render’s Rock; hold threat on the ambushes.", ["group"]),
        q("rr-tharil", "Tharil’zun", 2550, 19, "Lakeshire", "Unlocked by the three Blackrock prerequisite turn-ins.", ["group"]),
        q("rr-shadow", "Shadow Magic", 2300, 115, "Lakeshire", "Three Midnight Orbs from Shadowcasters in Stonewatch; Shield Bash their casts.", ["group"]),
        q("rr-bounty", "Blackrock Bounty", 2000, 128, "Lakeshire", "Kill 15 Blackrock Champions on the group route.", ["group"]),
        q("rr-solomon", "Solomon’s Law", 1850, 91, "Lakeshire", "Ten Shadowhide Pendants alongside Fangore.", ["group"]),
      ],
    },
    {
      id: "duskwood",
      title: "Duskwood",
      accent: "#9b83d7",
      summary: "9 slots · 17,850 XP",
      quests: [
        q("dw-spiders", "Eight-Legged Menaces", 1250, 245, "Darkshire", "Solo with a shield; the spiders are commonly level 18–19.", ["solo"]),
        q("dw-wolves", "Wolves at Our Heels", 1250, 226, "Darkshire", "Solo; overlaps Seasoned Wolf Kabobs.", ["solo"]),
        q("dw-kabobs", "Seasoned Wolf Kabobs", 2000, 90, "Darkshire", "Solo collection; stack with the wolf quest.", ["solo"]),
        q("dw-grant", "Grant’s Shield", 2000, 79362, "Darkshire", "Raven Hill skeleton. No stealth, so path carefully and pull singles. Reported to require level 18.", ["solo"]),
        q("dw-ira", "Ira’s Dagger", 1950, 96137, "Darkshire", "Cautious solo; bring a partner if the ravager pulls are dense.", ["solo"]),
        q("dw-totem", "The Totem of Infliction", 2550, 101, "Darkshire", "Duo; level 24–25 ghouls and the Mor’Ladim patrol.", ["group", "hard"]),
        q("dw-silvia", "Silvia’s Sword", 2100, 79363, "Darkshire", "Duo for the higher-level Defias camp.", ["group", "hard"]),
        q("dw-merrick", "Merrick’s Bow", 2300, 96138, "Darkshire", "Duo or small group for the higher-level ogres.", ["group", "hard"]),
        q("dw-watch", "The Night Watch — final", 2450, 58, "Darkshire", "Turn in the first two stages while leveling; group for the level 26–28 Plague Spreaders.", ["group", "hard"]),
      ],
    },
    {
      id: "ruins",
      title: "Ruins of Lordaeron",
      accent: "#65b8aa",
      summary: "3 bankable slots · 13,200+ XP (Crest live 8,000+)",
      quests: [
        q("rol-abom", "Abominable Creatures", 1650, 95250, "Inside the Ruins instance", "Captain Truman is inside, left of the entrance: turn it in during the run (it cannot be banked) and take Slain Baron’s Signet.", ["group"]),
        q("rol-insignia", "Bloodied Insignia", 2600, 95195, "Stormwind", "General Marcus Jonathan, Valley of Heroes. After the release take Remembrance Armor, the tank choice.", ["protect", "group"]),
        q("rol-love", "Remember That I Love You", 2600, 92415, "Stormwind", "Orphan Matron Nightingale outside the Cathedral. Rewards Tarnished Locket (+5 Stamina).", ["group"]),
        q("rol-crest", "Crest of Lordaeron", 8000, 95189, "Stormwind", "Lady Dena Kennedy wanders near 63,6 and 69,29. A beta player reports over 8,000 XP live (database 2,600).", ["group"]),
      ],
    },
    {
      id: "wc",
      title: "Wailing Caverns",
      accent: "#58c58a",
      summary: "5 slots · 14,050+ XP (Glowing Shard live 7,700)",
      quests: [
        q("wc-hides", "Deviate Hides", 1600, 1486, "WC hidden cave", "Collect 20 hides; return to Nalpak above the entrance. Level-17 quest.", ["group", "decay"]),
        q("wc-drinks", "Smart Drinks", 1350, 1491, "Ratchet", "Complete Raptor Horns first; collect six Wailing Essences. Level-18 quest.", ["group", "decay"]),
        q("wc-docks", "Trouble at the Docks", 1350, 959, "Ratchet", "Kill Mad Magglish in the outer cave before the portal. Level-18 quest.", ["group", "decay"]),
        q("wc-eradication", "Deviate Eradication", 2050, 1487, "WC hidden cave", "Clear all four required deviate types.", ["group"]),
        q("wc-shard", "The Glowing Shard", 7700, 6981, "WC summit", "Full Fanglord clear, Naralex event, and Mutanus. A beta player recorded 7,700 XP live (database 2,650).", ["group"]),
      ],
    },
    {
      id: "wetlands",
      title: "Wetlands fillers",
      accent: "#69a7ff",
      summary: "6 slots · 12,950 XP",
      quests: [
        q("wl-blisters", "Blisters on the Land", 2650, 275, "Menethil Harbor", "Level 26–27 Fen Creepers; group only.", ["group", "hard"]),
        q("wl-ooze", "Digging Through the Ooze", 2400, 470, "Menethil Harbor", "Ooze grind; suitable for a pair or group.", ["group"]),
        q("wl-crocs", "Crocs of the Sky", 2200, 98072, "Wetlands", "Check the live objective and group marker.", ["group"]),
        q("wl-duties", "Apprentice’s Duties", 2100, 471, "Wetlands", "Dangerous swamp objectives.", ["group", "hard"]),
        q("wl-fire", "Fire Taboo", 1850, 277, "Wetlands", "Mosshide gnolls; use route overlap.", ["group"]),
        q("wl-claws", "Claws from the Deep", 1750, 279, "Menethil Harbor", "Flexible sixth slot; swap for any 1,750+ quest that overlaps better.", ["group"]),
      ],
    },
  ];

  const prepGroups = [
    {
      id: "prep-level",
      title: "Capped at 20",
      summary: "Hold completions; turn in only unlocks",
      tasks: [
        task("prep-ding", "Stop turning in quests that are on the 40-quest list.", "At the cap all turn-in XP is wasted. Turn in only prerequisites that unlock a bank quest, and accept losing their XP."),
        task("prep-trainer", "Train at 20 before the next dungeon.", "Set talents toward 0/0/11 Protection (Rules & sources tab)."),
        task("prep-shield", "Carry a one-hander and shield, and level the one-hand weapon skill on ordinary mobs.", "A new weapon type with low skill misses too often to hold threat."),
      ],
    },
    {
      id: "prep-redridge",
      title: "Redridge unlocks",
      summary: "Turn these in; do not bank them",
      tasks: [
        task("prep-brm", "Turn in Blackrock Menace, Alther’s Mill (quest 98386), and Blackrock Blockade.", "These all-class prerequisites unlock Shadow Magic and Tharil’zun. The unrelated quest 2282 is Rogue-only."),
        task("prep-gnolls", "If needed, finish The Price of Shoes → Return to Verner → A Baying of Gnolls.", "This unlocks Howling in the Hills, a useful Redridge fallback outside the core nine."),
        task("prep-morganth", "Complete A Watchful Eye and Looking Further, turn both in, then accept Morganth.", "Looking Further completes in Stonewatch; Morganth starts at the lion statue near the Tower of Ilgalar and is reported to need level 20."),
        task("prep-lakeshire", "Before the group leaves Lakeshire, confirm the core bank quests are in the journal.", "Missing In Action starts inside Render’s Rock; Morganth is accepted during the Stonewatch leg."),
      ],
    },
    {
      id: "prep-duskwood",
      title: "Duskwood unlocks",
      summary: "Mixed solo and duo",
      tasks: [
        task("prep-valor", "Complete and turn in The Valor Family introduction.", "Its 1,750 XP is spent to unlock Grant’s Shield, Ira’s Dagger, Silvia’s Sword, and Merrick’s Bow."),
        task("prep-watch", "Turn in the first two Night Watch stages while leveling.", "Bank the 2,450-XP final stage; use a group for the mausoleum-area Plague Spreaders."),
        task("prep-dw-solo", "Finish western-border spiders, wolves, kabobs, and Grant’s Shield solo.", "Try Ira’s Dagger carefully; save Totem, Silvia, Merrick, and final Night Watch for a partner or for level 20."),
      ],
    },
    {
      id: "prep-dungeons",
      title: "Dungeon travel",
      summary: "Gear first, bank second",
      tasks: [
        task("prep-dm", "Prepare all seven Deadmines quests before the run.", "Finish the Defias chain, Traitor escort, Alba Fairmoon explosives chain, and Stormwind pickups."),
        task("prep-wc", "Complete Raptor Horns, take both Ratchet quests, and collect the hidden-cave WC quests.", "One full Fanglord + Naralex + Mutanus clear, and make sure Kresh dies for the shield. Log out in the Barrens only if keeping the five-quest bank."),
        task("prep-rol", "Run Ruins of Lordaeron as the main tank-gear dungeon.", "Mirror of Rath’mael (shield) and Atrophic Girdle (belt) drop here; turn in Abominable Creatures inside for the tank ring; hold the three Stormwind hand-ins."),
      ],
    },
    {
      id: "prep-slots",
      title: "Journal management",
      summary: "40 is the hard ceiling",
      tasks: [
        task("prep-audit", "Audit the quest log before accepting low-value travel quests.", "Reserve the first 34 slots for Deadmines, Redridge, Duskwood, Ruins, and WC when those packages are practical."),
        task("prep-fillers", "Fill the last six slots with the best completed Wetlands or on-route replacements.", "Do not force dangerous Wetlands objectives when a 1,750+ quest is already nearly complete elsewhere."),
      ],
    },
  ];

  const gear = [
    gearItem("gear-head", "Head", "Veteran’s Silvered Chain Helm", item(250528), "+10 Strength, +9 Stamina · requires level 20, Blacksmithing 95, and a 30-Favor plan. Only if Favor is already on hand.", false, ["craft", "favor"]),
    gearItem("gear-neck", "Neck", "Ephemeral Choker", search("Ephemeral Choker"), "+4 Stamina, +2 Spirit · Faldrim, Hall of Thanes. Only if a group runs it.", false, ["hot", "optional"]),
    gearItem("gear-neck-post", "Neck", "Tarnished Locket", item(279870), "+5 Stamina, +4 Spirit · Remember That I Love You after the bank is cashed.", true, ["post"]),
    gearItem("gear-shoulders", "Shoulders", "Rough Bronze Shoulders", item(3480), "+3 Strength, +4 Stamina, mail · self-craft, requires level 17. See the crafting tab.", true, ["craft"]),
    gearItem("gear-back", "Back", "Cape of the Brotherhood", item(5193), "+5 Agility, +3 Stamina · Edwin VanCleef, Deadmines. Agility adds armor and dodge.", true, ["dm"]),
    gearItem("gear-back-alt", "Back alt", "Catacomb Cloak", item(279899), "+3 Stamina, +6 Attack Power · An Ancient Grudge, Hall of Thanes. Equal if already owned.", false, ["hot", "optional"]),
    gearItem("gear-chest", "Chest", "Blackened Defias Armor", item(10399), "+4 Strength, +3 Agility, +10 Stamina · Edwin VanCleef, Deadmines. The tank chest until the bank is cashed.", true, ["dm"]),
    gearItem("gear-chest-post", "Chest", "Remembrance Armor", search("Remembrance Armor"), "Bloodied Insignia reward, the tankier choice over Duty Bound Leggings. Compare its tooltip with Blackened Defias Armor.", false, ["post"]),
    gearItem("gear-wrists", "Wrists", "Cryptwalker Bracers", item(280095), "+4 Strength, +3 Stamina · The Restless Dead, Hall of Thanes.", true, ["hot"]),
    gearItem("gear-wrists-tank", "Wrists alt", "Bandsaw Wristbands", search("Bandsaw Wristbands"), "Sneed, Deadmines; noted as the shield-tank wrist. Stats not checked here; compare in game.", false, ["dm", "optional"]),
    gearItem("gear-hands", "Hands", "Gloves of the Fang", item(10413), "+4 Strength, +6 Agility · Wailing Caverns trash, also bind-on-equip on the Auction House.", true, ["wc"]),
    gearItem("gear-hands-craft", "Hands alt", "Veteran’s Gloves", item(250508), "+5 Strength, +3 Agility, +5 Stamina, mail · Blacksmithing 80 and a Favor plan. Better than Fang if you can make it.", false, ["craft", "favor"]),
    gearItem("gear-waist-rol", "Waist", "Atrophic Girdle", item(271201), "104 armor, +5 Strength, +5 Stamina, mail, requires level 15 · Witherfang, Ruins of Lordaeron. The tank waist: armor and Stamina beat the Defias belt’s Attack Power.", true, ["rol"]),
    gearItem("gear-waist", "Waist", "Kindlegem Girdle", search("Kindlegem Girdle"), "+4 Strength, +4 Stamina · Magmatus, Hall of Thanes.", false, ["hot", "optional"]),
    gearItem("gear-waist-dm", "Waist", "Blackened Defias Belt", item(10403), "+18 Attack Power · Captain Greenskin, Deadmines. More threat but no Stamina; a stopgap until Atrophic Girdle drops.", false, ["dm", "optional"]),
    gearItem("gear-legs", "Legs", "Chausses of Westfall", search("Chausses of Westfall"), "+11 Strength, +5 Stamina · The Defias Brotherhood after the bank is cashed. Wear any mail or leather legs until then.", true, ["post"]),
    gearItem("gear-feet", "Feet", "Gemmed Copper Boots", item(250620), "109 armor, +4 Strength, +4 Stamina, mail · Blacksmithing 35, requires level 10. Cheap self-craft.", true, ["craft"]),
    gearItem("gear-ring1", "Ring", "First Mate Band", item(284715), "+6 Strength, +2 Stamina · Mr. Smite, Deadmines.", true, ["dm"]),
    gearItem("gear-ring2", "Ring", "Slain Baron’s Signet", item(279867), "+5 Stamina, +2 Defense · Abominable Creatures, turned in inside Ruins of Lordaeron during the run.", true, ["rol"]),
    gearItem("gear-ring-post", "Ring alt", "Seal of Wrynn", item(2933), "Continue from The Unsent Letter after the mass turn-in.", false, ["post", "optional"]),
    gearItem("gear-trinket", "Trinket", "Lookie’s Spyglass", item(273298), "+1 Spirit and a utility use · Cookie, Deadmines. Filler only.", false, ["dm", "optional"]),
    gearItem("gear-mainhand", "Main hand", "Cruel Barb", item(5191), "15.5 DPS, 2.80 speed, +12 Attack Power, requires level 19 · Edwin VanCleef, Deadmines.", true, ["dm"]),
    gearItem("gear-mainhand-alt", "Main hand alt", "Smite’s Reaver", item(5196), "13.9 DPS, +3 Strength, +2 Stamina, requires level 17 · Mr. Smite, Deadmines. Usable at 18.", false, ["dm", "optional"]),
    gearItem("gear-shield-rol", "Shield", "Mirror of Rath’mael", item(271213), "547 armor, 11 block, +4 Strength, +4 Stamina, +3 Intellect, requires level 19 · Rath’mael, Ruins of Lordaeron (same run as Atrophic Girdle). The level-20 tank shield.", true, ["rol"]),
    gearItem("gear-shield", "Shield", "Kresh’s Back", item(13245), "528 armor, 10 block, +5 Defense, requires level 18 · Kresh, Wailing Caverns (13% drop). Equip whichever shield drops first; the Mirror wins on armor, Stamina, and Strength.", false, ["wc", "optional"]),
    gearItem("gear-ranged", "Ranged", "Calibrated Blunderbuss", item(279894), "+9 Stamina · Old Ironforge Incursion, Hall of Thanes. A Night Elf must learn Guns in Ironforge first.", false, ["hot", "optional"]),
  ];

  const gearFarmGroups = [
    {
      id: "farm-wc",
      title: "Wailing Caverns",
      summary: "Shield, gloves, and five bank quests",
      tasks: [
        task("farm-wc-run", "Full clear through Mutanus; make sure Kresh is killed.", "Kresh’s Back is the backup shield. Gloves of the Fang drop from trash. Finish The Glowing Shard before leaving."),
      ],
    },
    {
      id: "farm-dm",
      title: "The Deadmines",
      summary: "Weapon, chest, ring, and seven bank quests",
      tasks: [
        task("farm-dm-run", "Full quest run through VanCleef and Cookie.", "Cruel Barb, Cape of the Brotherhood, and Blackened Defias Armor (VanCleef); First Mate Band and Smite’s Reaver (Smite); Blackened Defias Belt (Greenskin). Shield on for every boss."),
      ],
    },
    {
      id: "farm-rol",
      title: "Ruins of Lordaeron",
      summary: "Only with a group already going",
      tasks: [
        task("farm-rol-run", "Kill Rath’mael and Witherfang for the shield and belt; turn in Abominable Creatures inside for Slain Baron’s Signet.", "Hold Bloodied Insignia, Remember That I Love You, and Crest of Lordaeron for the release."),
      ],
    },
    {
      id: "farm-hot",
      title: "Hall of Thanes",
      summary: "Optional, level 13–18",
      tasks: [
        task("farm-hot-run", "If a group goes: take Cryptwalker Bracers, Catacomb Cloak, and the Blunderbuss.", "Kindlegem Girdle and Ephemeral Choker are boss drops. Do not repeat it for one missing piece."),
      ],
    },
  ];

  const crafts = [
    gearItem("craft-wheel", "Camp", "Sharpening Wheel", "", "Blacksmithing 20 unlocks the Sharpening Wheel camp object. Worth having before group sessions.", true, ["craft"]),
    gearItem("craft-boots", "Feet", "Gemmed Copper Boots", item(250620), "Blacksmithing 35 · 109 armor, +4 Strength, +4 Stamina, mail. Make these first.", true, ["craft"]),
    gearItem("craft-shoulders", "Shoulders", "Rough Bronze Shoulders", item(3480), "Requires level 17 · 5 Bronze Bars, 1 Shadowgem, 1 Coarse Grinding Stone. Client colour range 115–145, so expect a trainer requirement around Blacksmithing 110.", true, ["craft"]),
    gearItem("craft-stone-coarse", "Weapon", "Coarse Sharpening Stone or Coarse Weightstone", "", "Temporary weapon damage for every pull: sharpening stone for a sword, axe, or dagger such as Cruel Barb or Smite’s Reaver; weightstone for a mace. The client lists the sharpening stone at Blacksmithing 75. In Classic it adds +3 damage for 30 minutes; check the live tooltip.", true, ["craft"]),
    gearItem("craft-stone-heavy", "Weapon", "Heavy Sharpening Stone or Heavy Weightstone", "", "The next tier, from about Blacksmithing 125 (client data for the sharpening stone). Classic +4 damage for 30 minutes. Craft only if you are already there.", false, ["craft", "optional"]),
    gearItem("craft-gloves", "Hands", "Veteran’s Gloves", item(250508), "Blacksmithing 80 · +5 Strength, +3 Agility, +5 Stamina. The plan is sold for Merchant’s Favor; only if you already have it.", false, ["craft", "favor"]),
    gearItem("craft-helm", "Head", "Veteran’s Silvered Chain Helm", item(250528), "Blacksmithing 95, requires level 20 · +10 Strength, +9 Stamina. 30-Favor plan; the first Favor buy for a warrior blacksmith.", false, ["craft", "favor"]),
  ];

  const craftSkip = [
    { slot: "Shield", name: "Iron Shield Spike", url: "", note: "Client colour range 155–185 and Iron Bars: out of reach before the cap. Revisit at 25–30." },
    { slot: "Shoulders", name: "Silvered Bronze Shoulders", url: item(3481), note: "Requires level 20 and about Blacksmithing 130; more armor and Spirit but one less Stamina than Rough Bronze." },
    { slot: "Chest", name: "Veteran’s Silvered Chain Shirt", url: item(250518), note: "Requires level 22 and a Favor plan. A post-cap target." },
    { slot: "Legs", name: "Veteran’s Silvered Chain Leggings", url: item(250523), note: "Requires level 25. Chausses of Westfall cover the slot until then." },
    { slot: "Boots", name: "Veteran’s Boots", url: item(250503), note: "A small upgrade over Gemmed Copper Boots that costs a Favor plan. Skip." },
    { slot: "Skill", name: "Power-leveling Blacksmithing", url: "", note: "Not needed for this list. Mine nodes on the route; spend leftover Copper and Bronze on the items above." },
  ];

  const turninGroups = [
    {
      id: "cr-setup",
      title: "0 · Before the cap rises",
      summary: "Hearth in Stormwind; choose where to log out",
      tasks: [
        task("cr-hearth", "Bind the hearthstone in Stormwind.", "Every route ends in Stormwind, and the hearth is your jump back from the Barrens."),
        task("cr-logout", "Log out in Ratchet if you hold the Wailing Caverns quests; otherwise log out in Stormwind.", "Without a class teleport, getting to Ratchet after the release is a long trip (Menethil → Theramore boat, or Booty Bay → Ratchet boat), so be there already."),
      ],
    },
    {
      id: "cr-barrens",
      title: "Barrens · Wailing Caverns",
      summary: "Skip if no WC quests are held",
      tasks: [
        task("cr-ratchet", "Ratchet: Trouble at the Docks (Crane Operator Bigglefuzz), and Smart Drinks (Mebok Mizzyrix) if finished.", "Speak to Sputtervalve if the shard conversation is still pending."),
        task("cr-eyecave", "Hidden eye cave above the WC entrance: Deviate Hides (Nalpak) and Deviate Eradication (Ebru).", ""),
        task("cr-summit", "Summit above WC: The Glowing Shard (Falla Sagewind).", "Then hearth to Stormwind, or take the Theramore boat to Menethil first if Wetlands quests are held."),
      ],
    },
    {
      id: "cr-wetlands",
      title: "Menethil · Wetlands",
      summary: "Skip if no Wetlands quests are held",
      tasks: [
        task("cr-menethil", "Turn in the held Wetlands quests in Menethil Harbor and at their camps.", "Then fly or ride to Ironforge and take the tram to Stormwind."),
      ],
    },
    {
      id: "cr-stormwind-1",
      title: "Stormwind · first half",
      summary: "Deadmines hand-ins",
      tasks: [
        task("cr-wilder", "Dwarven District: Collecting Memories and Oh Brother… (Wilder Thistlenettle), Underground Assault (Shoni).", "Read the Underground Assault reward pane before choosing."),
        task("cr-letter", "The Unsent Letter (Baros Alexston).", "Accept the next step toward Seal of Wrynn."),
      ],
    },
    {
      id: "cr-westfall",
      title: "Westfall · Sentinel Hill and the Deadmines exit",
      summary: "One flight from Stormwind",
      tasks: [
        task("cr-sentinel", "Red Silk Bandanas (Scout Riell, tower top) and The Defias Brotherhood (Gryan Stoutmantle).", "Take Chausses of Westfall."),
        task("cr-alba", "Destruction in Deadmines (Alba Fairmoon, outside the Deadmines).", "Then fly to Darkshire."),
      ],
    },
    {
      id: "cr-duskwood",
      title: "Darkshire · Duskwood",
      summary: "Skip if no Duskwood quests are held",
      tasks: [
        task("cr-darkshire", "Turn in the held Duskwood quests in Darkshire.", "Then fly to Lakeshire."),
      ],
    },
    {
      id: "cr-redridge",
      title: "Lakeshire · Redridge",
      summary: "Core nine",
      tasks: [
        task("cr-lakeshire", "Turn in the held Redridge quests (Magistrate Solomon, Marshal Marris east of town, Guard Howe at the south bridge).", "Incinerator Gar’im offers boots; read the pane."),
        task("cr-berton", "Pick up What Comes Around… from Guard Berton.", "A Stockade quest for later."),
        task("cr-azora", "If Morganth is held: run west to the Tower of Azora (Theocritus).", "Continue on foot to Stormwind."),
      ],
    },
    {
      id: "cr-stormwind-2",
      title: "Stormwind · second half",
      summary: "Ruins hand-ins last",
      tasks: [
        task("cr-ruins", "Bloodied Insignia (General Marcus Jonathan), Crest of Lordaeron (Lady Dena Kennedy, near 63,6 or 69,29), Remember That I Love You (Orphan Matron Nightingale).", "Take Remembrance Armor and Tarnished Locket. Pick up the Stockade quests."),
      ],
    },
  ];

  function q(id, name, xp, questId, turnin, note, tags = []) {
    return { id, name, xp, url: `${WH}/quest=${questId}`, turnin, note, tags };
  }
  function task(id, title, note) { return { id, title, note }; }
  function gearItem(id, slot, name, url, note, required, tags = []) { return { id, slot, name, url, note, required, tags }; }

  const TAG_LABELS = { protect: "bank protected", post: "after bank", needs20: "needs 20", hard: "hard at 20", decay: "decay risk", hot: "hall of thanes", rol: "ruins", dm: "deadmines", wc: "wailing caverns" };
  const tagLabel = tag => TAG_LABELS[tag] || tag;

  const allQuests = questGroups.flatMap(group => group.quests);
  const allTasks = [...prepGroups, ...turninGroups, ...gearFarmGroups].flatMap(group => group.tasks);
  const defaultState = () => ({ level: "20", quests: {}, gear: {}, craft: {}, tasks: {}, activeTab: "bank" });
  let state = loadState();

  function loadState() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch (_) {
      return defaultState();
    }
  }

  function sanitizeState(candidate) {
    const clean = defaultState();
    if (!candidate || typeof candidate !== "object") return clean;
    if (LEVELS.includes(String(candidate.level))) clean.level = String(candidate.level);
    if (TABS.includes(candidate.activeTab)) clean.activeTab = candidate.activeTab;
    for (const quest of allQuests) {
      const value = candidate.quests?.[quest.id];
      if (QUEST_STATES.includes(value)) clean.quests[quest.id] = value;
    }
    for (const entry of gear) {
      const value = candidate.gear?.[entry.id];
      if (GEAR_STATES.includes(value)) clean.gear[entry.id] = value;
    }
    for (const entry of crafts) {
      const value = candidate.craft?.[entry.id];
      if (GEAR_STATES.includes(value)) clean.craft[entry.id] = value;
    }
    for (const entry of allTasks) {
      if (typeof candidate.tasks?.[entry.id] === "boolean") clean.tasks[entry.id] = candidate.tasks[entry.id];
    }
    return clean;
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* storage blocked: keep working in memory */ }
    updateSummary();
  }

  const questState = id => state.quests[id] || "todo";
  const gearState = id => state.gear[id] || "need";
  const craftState = id => state.craft[id] || "need";

  function titleHtml(entry) {
    return entry.url
      ? `<a href="${entry.url}" target="_blank" rel="noreferrer">${entry.name} ↗</a>`
      : `<strong>${entry.name}</strong>`;
  }

  function renderQuests() {
    const root = document.querySelector("#quest-zones");
    root.innerHTML = questGroups.map(group => `
      <article class="zone-card" data-zone="${group.id}">
        <div class="zone-head">
          <div class="zone-title"><span class="zone-dot" style="background:${group.accent};box-shadow:0 0 0 4px ${group.accent}22"></span><h3>${group.title}</h3></div>
          <div class="zone-meta" data-zone-meta="${group.id}">${group.summary}</div>
        </div>
        <div class="rows">${group.quests.map(renderQuest).join("")}</div>
      </article>`).join("");
    root.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", () => {
        state.quests[select.dataset.id] = select.value;
        select.closest(".quest-row").dataset.state = select.value;
        saveState();
        applyQuestFilter();
      });
    });
  }

  function renderQuest(quest) {
    const current = questState(quest.id);
    const tags = quest.tags.map(tag => `<span class="tag ${tag}">${tagLabel(tag)}</span>`).join("");
    return `<div class="quest-row" data-id="${quest.id}" data-state="${current}">
      <div class="item-title">
        <a href="${quest.url}" target="_blank" rel="noreferrer">${quest.name} ↗</a>
        <div class="item-sub">Turn in: ${quest.turnin}</div>
        <div class="tag-line">${tags}</div>
      </div>
      <div class="note">${quest.note}</div>
      <div class="xp">${quest.xp.toLocaleString()} XP</div>
      <select class="status-select" data-id="${quest.id}" aria-label="Status for ${quest.name}">
        ${option("todo", "Not ready", current)}
        ${option("ready", "Ready — hold", current)}
        ${option("turned", "Turned in", current)}
        ${option("skip", "Skip / replace", current)}
      </select>
    </div>`;
  }

  function renderTracked(list, rootSelector, rowClass, stateOf, bucket, applyFilter) {
    const root = document.querySelector(rootSelector);
    root.innerHTML = list.map(entry => {
      const current = stateOf(entry.id);
      const tags = entry.tags.map(tag => `<span class="tag ${tag}">${tagLabel(tag)}</span>`).join("");
      return `<div class="gear-row ${rowClass}" data-id="${entry.id}" data-state="${current}">
        <div class="slot">${entry.slot}</div>
        <div class="item-title">${titleHtml(entry)}<div class="tag-line">${tags}</div></div>
        <div class="note">${entry.note}</div>
        <select class="gear-select" data-id="${entry.id}" aria-label="Status for ${entry.name}">
          ${option("need", "Need", current)}
          ${option("owned", bucket === "craft" ? "Done" : "Owned", current)}
          ${option("skip", "Skip", current)}
        </select>
      </div>`;
    }).join("");
    root.querySelectorAll(".gear-select").forEach(select => {
      select.addEventListener("change", () => {
        state[bucket][select.dataset.id] = select.value;
        select.closest(".gear-row").dataset.state = select.value;
        saveState();
        applyFilter();
      });
    });
  }

  function renderGear() { renderTracked(gear, "#gear-rows", "tank-gear-row", gearState, "gear", applyGearFilter); }
  function renderCrafts() { renderTracked(crafts, "#craft-rows", "craft-row", craftState, "craft", applyCraftFilter); }

  function renderComparisonRows(items, rootSelector) {
    document.querySelector(rootSelector).innerHTML = items.map(entry => `<div class="comparison-row">
        <div class="slot">${entry.slot}</div>
        <div class="item-title">${titleHtml(entry)}</div>
        <div class="note">${entry.note}</div>
      </div>`).join("");
  }

  function renderTasks(groups, rootSelector) {
    const root = document.querySelector(rootSelector);
    root.innerHTML = groups.map(group => `
      <article class="zone-card">
        <div class="zone-head"><div class="zone-title"><span class="zone-dot"></span><h3>${group.title}</h3></div><div class="zone-meta">${group.summary}</div></div>
        <div class="rows">${group.tasks.map(entry => {
          const done = Boolean(state.tasks[entry.id]);
          return `<div class="task-row" data-id="${entry.id}" data-state="${done ? "done" : "todo"}">
            <button class="check" type="button" role="checkbox" aria-checked="${done}" aria-label="Mark ${entry.title} complete">${done ? "✓" : ""}</button>
            <div class="item-title"><strong>${entry.title}</strong>${entry.note ? `<div class="item-sub">${entry.note}</div>` : ""}</div>
          </div>`;
        }).join("")}</div>
      </article>`).join("");
    root.querySelectorAll(".check").forEach(button => {
      button.addEventListener("click", () => {
        const row = button.closest(".task-row");
        const next = !state.tasks[row.dataset.id];
        state.tasks[row.dataset.id] = next;
        button.setAttribute("aria-checked", String(next));
        button.textContent = next ? "✓" : "";
        row.dataset.state = next ? "done" : "todo";
        saveState();
      });
    });
  }

  function option(value, label, current) { return `<option value="${value}"${value === current ? " selected" : ""}>${label}</option>`; }

  function setProgress(selector, done, total) {
    document.querySelector(selector).style.width = `${total ? Math.min(100, done / total * 100) : 0}%`;
  }

  function updateSummary() {
    const ready = allQuests.filter(entry => questState(entry.id) === "ready");
    const turned = allQuests.filter(entry => questState(entry.id) === "turned");
    const xp = ready.reduce((sum, entry) => sum + entry.xp, 0);
    const gearRequired = gear.filter(entry => entry.required);
    const gearOwned = gearRequired.filter(entry => gearState(entry.id) === "owned");
    const craftRequired = crafts.filter(entry => entry.required);
    const craftDone = craftRequired.filter(entry => craftState(entry.id) === "owned");
    setText("#bank-count", ready.length);
    setText("#turned-count", turned.length);
    setText("#bank-xp", xp.toLocaleString());
    setText("#gear-count", gearOwned.length);
    setText("#gear-total", gearRequired.length);
    setText("#craft-count", craftDone.length);
    setText("#craft-total", craftRequired.length);
    setProgress("#bank-progress", ready.length, 40);
    setProgress("#gear-progress", gearOwned.length, gearRequired.length);
    setProgress("#craft-progress", craftDone.length, craftRequired.length);
    const capped = Number(state.level) >= 20;
    setText("#level-gate", capped ? "Hold all" : "Reach 20");
    setText("#level-gate-detail", capped ? "Capped: every turn-in now wastes XP" : "Below 20, turn-ins are not wasted");
    for (const group of questGroups) {
      const groupReady = group.quests.filter(entry => questState(entry.id) === "ready");
      const groupXp = groupReady.reduce((sum, entry) => sum + entry.xp, 0);
      const meta = document.querySelector(`[data-zone-meta="${group.id}"]`);
      if (meta) meta.textContent = `${groupReady.length}/${group.quests.length} ready · ${groupXp.toLocaleString()} XP`;
    }
  }

  function setText(selector, value) { document.querySelector(selector).textContent = String(value); }

  let tabsBound = false;
  function setupTabs() {
    const buttons = [...document.querySelectorAll(".tab-button")];
    function activate(name, persist = true) {
      for (const button of buttons) {
        const selected = button.id === `tab-${name}`;
        button.setAttribute("aria-selected", String(selected));
        const panel = document.querySelector(`#panel-${button.id.replace("tab-", "")}`);
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      }
      if (persist) { state.activeTab = name; saveState(); }
    }
    if (!tabsBound) {
      tabsBound = true;
      buttons.forEach((button, index) => {
        button.addEventListener("click", () => activate(button.id.replace("tab-", "")));
        button.addEventListener("keydown", event => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          const delta = event.key === "ArrowRight" ? 1 : -1;
          const next = buttons[(index + delta + buttons.length) % buttons.length];
          next.focus();
          activate(next.id.replace("tab-", ""));
        });
      });
    }
    activate(state.activeTab, false);
  }

  function applyQuestFilter() {
    const filter = document.querySelector("#quest-filter").value;
    document.querySelectorAll(".quest-row").forEach(row => {
      const value = row.dataset.state;
      row.hidden = filter !== "all" && value !== filter;
    });
    document.querySelectorAll("[data-zone]").forEach(zone => {
      zone.hidden = ![...zone.querySelectorAll(".quest-row")].some(row => !row.hidden);
    });
  }

  function applyRowFilter(filterSelector, rowSelector) {
    const filter = document.querySelector(filterSelector).value;
    document.querySelectorAll(rowSelector).forEach(row => {
      row.hidden = filter !== "all" && row.dataset.state !== filter;
    });
  }
  function applyGearFilter() { applyRowFilter("#gear-filter", ".tank-gear-row"); }
  function applyCraftFilter() { applyRowFilter("#craft-filter", ".craft-row"); }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ version: 1, ledger: STORAGE_KEY, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "warrior-level20-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Progress exported.");
  }

  async function importProgress(file) {
    try {
      const parsed = JSON.parse(await file.text());
      state = sanitizeState(parsed.state || parsed);
      saveState();
      renderAll();
      toast("Progress imported.");
    } catch (_) {
      toast("That file is not a valid ledger export.");
    }
  }

  function resetTracker() {
    if (!window.confirm("Reset every quest, gear item, craft, route task, and level on this device?")) return;
    state = defaultState();
    saveState();
    renderAll();
    toast("Tracker reset.");
  }

  let toastTimer;
  function toast(message) {
    const element = document.querySelector("#toast");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("show"), 2400);
  }

  function bindControls() {
    const level = document.querySelector("#current-level");
    level.addEventListener("change", () => { state.level = level.value; saveState(); });
    document.querySelector("#quest-filter").addEventListener("change", applyQuestFilter);
    document.querySelector("#gear-filter").addEventListener("change", applyGearFilter);
    document.querySelector("#craft-filter").addEventListener("change", applyCraftFilter);
    document.querySelector("#export-button").addEventListener("click", exportProgress);
    document.querySelector("#import-input").addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) importProgress(file);
      event.target.value = "";
    });
    document.querySelector("#reset-button").addEventListener("click", resetTracker);
  }

  function renderAll() {
    renderQuests();
    renderGear();
    renderCrafts();
    renderComparisonRows(craftSkip, "#craft-skip-rows");
    renderTasks(prepGroups, "#prep-groups");
    renderTasks(turninGroups, "#turnin-groups");
    renderTasks(gearFarmGroups, "#gear-farm-groups");
    document.querySelector("#current-level").value = state.level;
    setupTabs();
    updateSummary();
    applyQuestFilter();
    applyGearFilter();
    applyCraftFilter();
  }

  bindControls();
  renderAll();
})();
