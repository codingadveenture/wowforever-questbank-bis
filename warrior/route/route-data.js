/*
 * Baysick Browntwo, level 20–30 leveling route, encoded for route.js.
 * Source: docs/baysick-browntwo-level-20-30-leveling-route.md (1 October 2026), quest levels and XP from
 * Wowhead Forever's zone quest lists read the same day. Dungeon quests use the beta multiples after the
 * 1 October 2026 build halved the dungeon-quest bonus (Blackfathom Deeps 2.375×, the Stockade 2.1×,
 * Gnomeregan 1.8× the listed XP; before that build 3.75×, 3.2× and 2.6×).
 * Adapted from RestedXP Guides, https://github.com/RestedXP/RXPGuides, CC BY-NC-SA 4.0.
 * This file is licensed CC BY-NC-SA 4.0.
 *
 * Quest fields: id (Wowhead quest ID, or a string for rows without one), name, xp (the XP the route counts:
 * Wowhead's value, or the beta payout for dungeon quests), questLevel, reqLevel, zone, tags, after
 * (prerequisite quest IDs: a banked quest marks them done), ledgerKey (the ledger's bank quest), note.
 * Tags: core (in Cybes Dududu's shortlist), optional (dropped from a trimmed pass), group, dungeon,
 * conditional (only when behind the block's leave level), extra (listed by the route but not counted in its
 * XP table; off until added). Rows with kill: true are kill-XP estimates for one dungeon run.
 */
(() => {
  "use strict";
  // Action labels for step text: every quest mention says whether it is accepted or turned in at that stop.
  const ACC = `<b class="act accept">Accept</b>`;
  const TURN = `<b class="act turnin">Turn in</b>`;
  // TomTom waypoint chip: shows the zone and coordinates and copies the full /way command (zone, coordinates,
  // name) when clicked. Every chip names its zone, so the command works from anywhere.
  // City positions are the Classic and TBC ones in the RestedXP guides (CC BY-NC-SA 4.0).
  const WAY = (zone, x, y, label) => {
    const command = `/way ${zone} ${x.toFixed(1)} ${y.toFixed(1)} ${label}`;
    return `<button type="button" class="way" data-way="${command}" title="Copy: ${command}">/way ${zone} ${x.toFixed(1)} ${y.toFixed(1)}</button>`;
  };

  function q(id, name, xp, questLevel, reqLevel, zone, tags, o = {}) {
    return {
      id, name, xp, questLevel, reqLevel, zone, tags,
      after: o.after || [], ledgerKey: o.ledger || null, note: o.note || "",
      listedXp: o.listed || null, mult: o.mult || null,
    };
  }
  // Dungeon quest: the route counts the listed XP times the beta multiple.
  function dq(id, name, listed, mult, questLevel, reqLevel, zone, tags, o = {}) {
    return q(id, name, Math.round(listed * mult), questLevel, reqLevel, zone, ["dungeon", ...tags], { ...o, listed, mult });
  }
  // Kill XP of one dungeon run (estimate). Not a quest: the low-level rule does not apply.
  function run(id, name, xp, zone, note) {
    return { id, name, xp, questLevel: null, reqLevel: null, zone, tags: ["dungeon"], after: [], ledgerKey: null, note, kill: true };
  }

  const AV = "Ashenvale", BFD = "Blackfathom Deeps", WL = "Wetlands", DW = "Duskwood", RR = "Redridge";
  const STOCKS = "The Stockade", GNOMER = "Gnomeregan";

  const blocks = [
    {
      id: "A",
      title: "Ashenvale and Blackfathom Deeps",
      range: "20–23",
      leaveAt: 23,
      leaveText: "Leave at 23 or higher",
      accent: "#58c58a",
      kill: { open: 8500 },
      intro: `Blackfathom Deeps accepts a level-20 group, but its bosses run from 25 to 28, so enter at 22 or higher; the Ashenvale quests before the dungeon get you there. Ashenvale coordinates are zone map positions.`,
      steps: [
        {
          n: "1", title: "Stormwind, before leaving.",
          text: `Baros Alexston ${WAY("Stormwind City", 49.2, 30.3, "Baros Alexston")}: ${ACC} <em>Bazil Thredd</em> (offered once <em>The Unsent Letter</em> is turned in). Warden Thelwater ${WAY("Stormwind City", 41.1, 58.1, "Warden Thelwater")} at the Stockade: ${TURN} <em>Bazil Thredd</em>, then ${ACC} <em>The Stockade Riots</em>. Once you are 22, also ${ACC} <em>Quell the Uprising</em> from Thelwater and ${ACC} <em>The Color of Blood</em> from Nikova Raskol ${WAY("Stormwind City", 72.4, 47.7, "Nikova Raskol")}, Old Town; otherwise take both on the Stockade visit. Argos Nightwhisper (the park, ${WAY("Stormwind City", 21, 55, "Argos Nightwhisper")}): ${ACC} <em>The Corruption Abroad</em>. Shoni ${WAY("Stormwind City", 55.5, 12.5, "Shoni the Shilent")}, Dwarven District: ${ACC} <em>Gyrodrillmatic Excavationators</em>. Then the tram to Ironforge. Gerrig Bonegrip ${WAY("Ironforge", 50.8, 5.6, "Gerrig Bonegrip")}, Forlorn Cavern: ${ACC} <em>Knowledge in the Deeps</em> (6,531 XP; the Lorgalis Manuscript drops inside BFD, and the quest is turned in at the end of block B).`,
          quests: [],
        },
        {
          n: "2", title: "To Darkshore.",
          text: `A fan site lists a new <strong>Stormwind Harbor ↔ Auberdine ship</strong> in Forever (not yet confirmed in game); if it exists, tram back and sail. Otherwise stay on the Ironforge side: walk north-east through Loch Modan into the Wetlands to Menethil Harbor (learn the flight path), and take the Menethil ship, which in Forever sails Menethil → Southshore → Auberdine.`,
          quests: [],
        },
        {
          n: "3", title: "Auberdine → Darnassus and back.",
          text: `Gershala Nightwhisper ${WAY("Darkshore", 38.3, 43.0, "Gershala Nightwhisper")}: ${TURN} <em>The Corruption Abroad</em>, then ${ACC} <em>Researching the Corruption</em> (8 Corrupted Brain Stems from the naga and satyrs around the Zoram Strand and the temple entrance). Sentinel Selarin ${WAY("Darkshore", 39.2, 43.4, "Sentinel Selarin")}: ${ACC} <em>Trek to Ashenvale</em> (365). Ship or flight to Rut'theran, then Darnassus. Dawnwatcher Shaedlass ${WAY("Darnassus", 55.2, 24.0, "Shaedlass and Manados, Argent Dawn")}: ${ACC} <em>In Search of Thaelrid</em>. Argent Guard Manados: ${ACC} <em>Twilight Falls</em>. Fly back to Auberdine.`,
          quests: [],
        },
        {
          n: "4", title: "South on the road into Ashenvale.",
          text: `Maestra's Post, Orendil Broadleaf ${WAY("Ashenvale", 26.4, 38.6, "Orendil Broadleaf")}: ${ACC} <em>Bathran's Hair</em> (780): 5 half-buried brown sacks at Bathran's Haven (29.5–33.0, 21.4–24.3). Back at Orendil: ${TURN} <em>Bathran's Hair</em>, then ${ACC} <em>Orendil's Cure</em> (1,950, a delivery to Pelturas in Astranaar). If the Darkshore <em>Tower of Althalaxx</em> chain is at the "go to Delgren" step, Delgren ${WAY("Ashenvale", 26.2, 38.7, "Delgren")} continues it: ${TURN} that step, then ${ACC} the next, a Glowing Soul Gem from the Dark Strand at Ordil'Aran (${WAY("Ashenvale", 31.3, 30.7, "Dark Strand, Ordil'Aran")}; a very low drop, do not farm it). If the gem drops: ${TURN} it to Delgren, then ${ACC} the next, Ilkrud's tome at Fire Scar Shrine ${WAY("Ashenvale", 25.3, 60.7, "Ilkrud, Fire Scar Shrine")}, and ${TURN} it to Delgren as well.`,
          quests: [
            q(1010, "Bathran's Hair", 780, 20, 20, AV, ["core"], { note: "Five brown sacks at Bathran's Haven; check this first reward against the listed 780." }),
            q(970, "The Tower of Althalaxx (Soul Gem)", 1650, 21, 13, AV, ["extra"], { after: [967], note: "Only if the Darkshore chain is at the Delgren step; the gem is a very low drop." }),
            q(973, "The Tower of Althalaxx (Ilkrud)", 1950, 24, 13, AV, ["extra"], { after: [970], note: "Ilkrud's tome at Fire Scar Shrine (25.3,60.7)." }),
          ],
        },
        {
          n: "5", title: "Astranaar.",
          text: `Flight path from Daelyshia ${WAY("Ashenvale", 34.4, 48.0, "Daelyshia")}. Shindrell Swiftfire ${WAY("Ashenvale", 34.7, 48.8, "Shindrell Swiftfire")}: ${ACC} <em>The Zoram Strand</em> (20 Wrathtail Heads, 1,450). Raene Wolfrunner ${WAY("Ashenvale", 36.6, 49.6, "Raene Wolfrunner")}: ${TURN} <em>Trek to Ashenvale</em>, then ${ACC} <em>Raene's Cleansing</em> (1,450) and ${ACC} <em>Culling the Threat</em> (2,000; Dal Bloodclaw patrols Thistlefur Village, 36–40, 32–37). Pelturas Whitemoon ${WAY("Ashenvale", 37.4, 51.8, "Pelturas Whitemoon")}: ${TURN} <em>Orendil's Cure</em>, then ${ACC} <em>Elune's Tear</em> (1,750).`,
          quests: [
            q(990, "Trek to Ashenvale", 365, 19, 15, AV, ["core"], { note: "Hand in at Raene Wolfrunner." }),
            q(1020, "Orendil's Cure", 1950, 20, 20, AV, ["core"], { after: [1010], note: "Delivery to Pelturas Whitemoon." }),
          ],
        },
        {
          n: "6", title: "Lake Falathim.",
          text: `Teronis' Corpse ${WAY("Ashenvale", 20.3, 42.3, "Teronis' Corpse")}: ${TURN} <em>Raene's Cleansing</em>, then ${ACC} its gem step (1,250): a Glowing Gem from the Saltspittle murlocs (19.4–21.0, 41.6–43.8).`,
          quests: [
            q(991, "Raene's Cleansing", 1450, 19, 18, AV, ["core"], { note: "First step, handed in at Teronis' Corpse." }),
          ],
        },
        {
          n: "7", title: "The Zoram Strand.",
          text: `Talen ${WAY("Ashenvale", 14.8, 31.3, "Talen")}: ${ACC} <em>The Ancient Statuette</em> (1,150; it lies at ${WAY("Ashenvale", 14.2, 20.6, "Ancient Statuette")}). Back at Talen: ${TURN} <em>The Ancient Statuette</em>, then ${ACC} <em>Ruuzel</em> (2,550; the island at ${WAY("Ashenvale", 6.5, 13.4, "Ruuzel")}, two escorts). Naga along the strand for the heads and brain stems. The dungeon entrance is the sunken temple at the north end ${WAY("Ashenvale", 14.2, 14.6, "Blackfathom Deeps entrance")}.`,
          quests: [
            q(1007, "The Ancient Statuette", 1150, 20, 19, AV, ["core"], { note: "The statuette lies at 14.2,20.6." }),
          ],
        },
        {
          n: "Late group", title: "If the group is an hour late: the Stonetalon mini-loop.",
          text: `Through the Talondeep Path (mouth at ${WAY("Ashenvale", 42.5, 71.7, "Talondeep Path mouth")}): up to about 4,100 XP and the Stonetalon Peak flight path. Faldreas in Astranaar: ${ACC} <em>Journey to Stonetalon Peak</em> (680). Shindrell: ${ACC} <em>Pridewings of Stonetalon</em> (1,650; she offers it only once <em>The Zoram Strand</em> is handed in). ${ACC} the new <em>Stonetalon Supply Run</em> where it starts (1,950; a dead courier's bundles from the Mirkfallon wyverns, start point unknown). Stonetalon Peak: ${TURN} <em>Journey to Stonetalon Peak</em> to Keeper Albagorm and ${TURN} <em>Stonetalon Supply Run</em> to Innkeeper Faralia. Back in Astranaar, Shindrell: ${TURN} <em>Pridewings of Stonetalon</em>.`,
          quests: [
            q(1056, "Journey to Stonetalon Peak", 680, 18, 18, "Stonetalon", ["extra"], { note: "Faldreas in Astranaar." }),
            q(1134, "Pridewings of Stonetalon", 1650, 21, 18, "Stonetalon", ["extra"], { after: [1008], note: "Offered once The Zoram Strand is handed in." }),
            q(86574, "Stonetalon Supply Run", 1950, 24, 20, "Stonetalon", ["extra"], { note: "Forever-new; start point unknown." }),
          ],
        },
        {
          n: "8", title: "Blackfathom Deeps.",
          text: `Inside, at Argent Guard Thaelrid: ${TURN} <em>In Search of Thaelrid</em>, then ${ACC} <em>Blackfathom Villainy</em> (7,838; Head of Kelris). Loot the Lorgalis Manuscript. Kelris, Lady Sarevess, Old Serra'kis; Aku'mai optional. Twilight Pendants for <em>Twilight Falls</em> (6,056).`,
          quests: [
            dq(1198, "In Search of Thaelrid", 2400, 2.375, 24, 18, BFD, ["core"], { note: "Handed in to Thaelrid inside the dungeon." }),
            run("run-bfd", "Blackfathom Deeps run: kill XP", 7500, BFD, "Estimate for one five-player run."),
          ],
        },
        {
          n: "9", title: "After the run.",
          text: `Talen: ${TURN} <em>Ruuzel</em>. Astranaar, Shindrell: ${TURN} <em>The Zoram Strand</em>. Raene: ${TURN} <em>Culling the Threat</em> and ${TURN} the gem step of <em>Raene's Cleansing</em>, then ${ACC} the moonwell talk (830). East: loot Elune's Tear on the Iris Lake island ${WAY("Ashenvale", 46.4, 46.4, "Elune's Tear, Iris Lake island")}. Shael'dryn at the moonwell east of the lake (about ${WAY("Ashenvale", 53, 46, "Shael'dryn, moonwell")}): ${TURN} the talk step, then ${ACC} the next <em>Raene's Cleansing</em> (2,200; carry it to R3). Pelturas: ${TURN} <em>Elune's Tear</em>, then ${ACC} <em>The Ruins of Stardust</em> (1,850; bushes at ${WAY("Ashenvale", 33.3, 67.8, "Stardust bushes")}). Back at Pelturas: ${TURN} <em>The Ruins of Stardust</em>, then ${ACC} <em>Fallen Sky Lake</em> (3,050; carry it to R3). If still below 23: Sentinel Velene Starstrike at Silverwind Refuge ${WAY("Ashenvale", 49.8, 67.2, "Sentinel Velene Starstrike")}: ${ACC} <em>Elemental Bracers</em> (1,950; Befouled Water Elementals in Mystral Lake) and ${TURN} it to her. Raene: ${ACC} <em>An Aggressive Defense</em> (1,950; the Foulweald camps at 50–56, 60–64) and ${TURN} it to her.`,
          quests: [
            q(1009, "Ruuzel", 2550, 25, 20, AV, ["core"], { after: [1007], note: "The island at 6.5,13.4; pull one escort away first." }),
            q(1008, "The Zoram Strand", 1450, 19, 14, AV, ["core"], { note: "20 Wrathtail Heads. Pays 80% from level 25." }),
            q(1054, "Culling the Threat", 2000, 25, 18, AV, [], { note: "Dal Bloodclaw in Thistlefur Village." }),
            q(1023, "Raene's Cleansing (the gem)", 1250, 21, 18, AV, ["core"], { after: [991], note: "Glowing Gem from the Saltspittle murlocs." }),
            q(1024, "Raene's Cleansing (moonwell talk)", 830, 21, 18, AV, ["core"], { after: [1023], note: "Shael'dryn at the moonwell; take the next step for R3." }),
            q(1033, "Elune's Tear", 1750, 22, 20, AV, ["core"], { after: [1020], note: "Iris Lake island (46.4,46.4)." }),
            q(1034, "The Ruins of Stardust", 1850, 23, 20, AV, ["core"], { after: [1033], note: "Bushes at 33.3,67.8; take Fallen Sky Lake for R3." }),
            q(1016, "Elemental Bracers", 1950, 24, 20, AV, ["conditional"], { note: "Only if still below 23: Silverwind Refuge (49.8,67.2)." }),
            q(1025, "An Aggressive Defense", 1950, 24, 18, AV, ["conditional"], { note: "Only if still below 23: Foulweald camps (50–56, 60–64)." }),
          ],
        },
        {
          n: "10", title: "Leave.",
          text: `Fly Astranaar → Auberdine. Gershala ${WAY("Darkshore", 38.3, 43.0, "Gershala Nightwhisper")}: ${TURN} <em>Researching the Corruption</em> (Staghide Armguards or Prelacy Cape). Fly Rut'theran, then Darnassus: ${TURN} <em>Blackfathom Villainy</em> to Dawnwatcher Selgorm ${WAY("Darnassus", 55.2, 24.0, "Selgorm and Manados, Argent Dawn")} and ${TURN} <em>Twilight Falls</em> to Argent Guard Manados (read the pane). Back to Auberdine. Hollee: ${ACC} <em>Unrequited Love</em> (165, hands in at Menethil); board the ship to Menethil.`,
          quests: [
            dq(1275, "Researching the Corruption", 2400, 2.375, 24, 18, BFD, ["core"], { note: "Gershala Nightwhisper, Auberdine." }),
            dq(1200, "Blackfathom Villainy", 3300, 2.375, 27, 18, BFD, ["core"], { after: [1198], note: "Darnassus; Head of Kelris." }),
            dq(1199, "Twilight Falls", 2550, 2.375, 25, 20, BFD, ["core"], { note: "Argent Guard Manados, Darnassus; read the reward pane." }),
          ],
        },
      ],
    },
    {
      id: "B",
      title: "Wetlands by ship, full pass",
      range: "23–25",
      leaveAt: 25,
      leaveText: "Leave at 25 or higher",
      accent: "#69a7ff",
      kill: { open: 19000 },
      intro: `Turn in any banked Wetlands quests on arrival and skip them below. Coordinates are Classic map positions; the Forever-new quest givers (Sylessa, Caitlin, Valstag, Howin) are found by name. The Thandol Span quests need level 28 and <em>Fall of Dun Modr</em> level 25, so Dun Modr waits for R1.`,
      steps: [
        {
          n: "1", title: "Menethil Harbor.",
          text: `Flight path from Shellei Brondir ${WAY("Wetlands", 9.5, 59.7, "Shellei Brondir")}. First Mate Fitzsimmons ${WAY("Wetlands", 10.8, 59.6, "First Mate Fitzsimmons")}: ${ACC} <em>The Third Fleet</em> and ${ACC} <em>The Greenwarden</em> (830). Buy a Flagon of Mead at ${WAY("Wetlands", 10.7, 60.9, "Innkeeper, Flagon of Mead")}; back at Fitzsimmons, ${TURN} <em>The Third Fleet</em> (220), then ${ACC} <em>The Cursed Crew</em> (1,750). Sylessa Duskwhisper: ${ACC} <em>Bloom of the Heavens</em> (2,350). Karl Boran ${WAY("Wetlands", 8.3, 58.5, "Karl Boran")}: ${ACC} <em>Claws from the Deep</em> (1,750). James Halloran ${WAY("Wetlands", 8.6, 55.8, "James Halloran")}: ${ACC} <em>Young Crocolisk Skins</em> (1,750; six skins), and ${ACC} <em>Crocs of the Sky</em> (2,200) if offered. Caitlin Grassman: ${ACC} <em>Alchemical Hazards</em> (1,750). Sida ${WAY("Wetlands", 11.7, 58.0, "Sida")}: ${ACC} <em>Digging Through the Ooze</em> (2,400). Captain Stoutfist, Menethil Keep upstairs ${WAY("Wetlands", 9.9, 57.4, "Captain Stoutfist")}: ${ACC} <em>War Banners</em> (2,300). Valstag Ironjaw: ${ACC} <em>Spoils of War</em> (1,750; 6 timber and 30 iron salvaged underwater in the harbour, so only if you can manage the breath). Tarrel Rockweaver ${WAY("Wetlands", 11.5, 52.1, "Tarrel Rockweaver")}: ${TURN} <em>Unrequited Love</em>, then ${ACC} <em>In Search of the Excavation Team</em> (970 + 485).`,
          quests: [
            q(288, "The Third Fleet", 220, 27, 22, WL, ["core"], { note: "Buy a Flagon of Mead and hand it straight back." }),
            q(98461, "Unrequited Love", 165, 21, 18, WL, ["core"], { note: "From Hollee in Auberdine; hand in at Tarrel Rockweaver." }),
          ],
        },
        {
          n: "2", title: "South shore.",
          text: `The wreck of the <em>Flying Osprey</em> just south of town: recover Nord'el for <em>Bloom of the Heavens</em>, then Sylessa: ${TURN} <em>Bloom of the Heavens</em>.`,
          quests: [
            q(98208, "Bloom of the Heavens", 2350, 29, 22, WL, ["core"], { note: "Forever-new; Nord'el at the Flying Osprey wreck." }),
          ],
        },
        {
          n: "3", title: "North-west shore.",
          text: `(${WAY("Wetlands", 14.1, 41.5, "North-west shore 1")} → ${WAY("Wetlands", 16.7, 39.7, "North-west shore 2")} → ${WAY("Wetlands", 18.8, 40.0, "North-west shore 3")}): 12 Bluegill Murlocs and Gobbler; young crocolisk skins. The cursed wrecks ${WAY("Wetlands", 13.9, 30.4, "Cursed wrecks")}: 13 Cursed Sailors, 5 Cursed Marines and First Mate Snellig inside the hull. The hovels and the giant crocolisks here come later (step 8), because their quests only open once <em>Claws</em> and <em>Young Crocolisk Skins</em> are handed in.`,
          quests: [],
        },
        {
          n: "4", title: "Whelgar's Excavation Site (38.2,50.9).",
          text: `Merrin Rockweaver ${WAY("Wetlands", 38.8, 52.3, "Merrin Rockweaver")}: ${TURN} <em>In Search of the Excavation Team</em>, then ${ACC} the excavation report back to Tarrel (<em>In Search of The Excavation Team</em>). Ormer Ironbraid: ${ACC} <em>Ormer's Revenge</em> (1,950 → 2,200 → 2,950); Ormer takes each step and gives the next. Prospector Whelgar ${WAY("Wetlands", 38.8, 52.4, "Prospector Whelgar")}: ${ACC} <em>Uncovering the Past</em> (2,200; four tablet fragments around ${WAY("Wetlands", 34.3, 49.5, "Tablet fragments")}; Forever lowered its required level from 25 to 22). Step 1: Mottled Raptors and Screechers west of the dig ${WAY("Wetlands", 24.7, 48.6, "Mottled Raptors and Screechers")}; Ormer: ${TURN} step 1, then ${ACC} step 2. Step 2: Scytheclaws and Razormaws around ${WAY("Wetlands", 34.6, 48.0, "Scytheclaws and Razormaws")}; Ormer: ${TURN} step 2, then ${ACC} step 3. Step 3: Sarltooth on the hilltop at ${WAY("Wetlands", 33.3, 51.5, "Sarltooth")} (Thrash; climb from ${WAY("Wetlands", 31.5, 48.9, "Climb to Sarltooth")}); Ormer: ${TURN} step 3. Whelgar: ${TURN} <em>Uncovering the Past</em>. Howin Kindfeather stands east of the dig; his quests come with the <em>Crocs of the Sky</em> crate in R1.`,
          quests: [
            q(305, "In Search of the Excavation Team", 970, 24, 21, WL, ["core"], { after: [98461], note: "Merrin Rockweaver at the dig." }),
            q(294, "Ormer's Revenge (raptors)", 1950, 24, 22, WL, ["core"], { note: "Mottled Raptors and Screechers west of the dig." }),
            q(295, "Ormer's Revenge (Scytheclaws)", 2200, 27, 22, WL, ["core"], { after: [294], note: "Scytheclaws and Razormaws around 34.6,48.0." }),
            q(296, "Ormer's Revenge (Sarltooth)", 2950, 29, 22, WL, ["core"], { after: [295], note: "Sarltooth on the hilltop; Raptorbane Armor." }),
            q(299, "Uncovering the Past", 2200, 27, 22, WL, ["core"], { note: "Four tablet fragments around 34.3,49.5." }),
          ],
        },
        {
          n: "5", title: "Dragonmaw camp, the Crossroads and Rethiel.",
          text: `<strong>Dragonmaw camp</strong> ${WAY("Wetlands", 44.8, 43.9, "Dragonmaw camp")}: 8 War Banners. <strong>Crossroads</strong> ${WAY("Wetlands", 49.9, 39.4, "Einar Stonegrip, the Crossroads")}, Einar Stonegrip: ${ACC} <em>Daily Delivery</em> (830). <strong>Rethiel</strong> ${WAY("Wetlands", 56.4, 40.4, "Rethiel")}: ${TURN} <em>The Greenwarden</em>, then ${ACC} <em>Tramping Paws</em> (1,250; 25 gnolls, ${WAY("Wetlands", 63.9, 62.7, "Tramping Paws gnolls, north end")} south to ${WAY("Wetlands", 55.7, 75.1, "Tramping Paws gnolls, south end")}). Rethiel: ${TURN} <em>Tramping Paws</em>, then ${ACC} <em>Fire Taboo</em> (1,850; Crude Flint from the gnolls at ${WAY("Wetlands", 44.2, 33.9, "Crude Flint gnolls")}). Rethiel: ${TURN} <em>Fire Taboo</em>, then ${ACC} <em>Blisters on the Land</em> (2,650; 8 stealthed level 26–27 Fen Creepers along the streams; at 25 or with the group), and ${TURN} it back at Rethiel. Red Whelps along the Green Belt east of Rethiel for the 10 Pristine Crimson Scales (<em>Crocs of the Sky</em>). Thelgen Rock spiders in the south-east for the <em>Alchemical Hazards</em> gland; the Excavation Site: Wetlands portal is nearby (about ${WAY("Wetlands", 47.8, 56.3, "Excavation Site entrance")}) if a group wants it.`,
          quests: [
            q(463, "The Greenwarden", 830, 21, 20, WL, ["core"], { note: "Rethiel the Greenwarden (56.4,40.4)." }),
            q(276, "Tramping Paws", 1250, 21, 20, WL, [], { after: [463], note: "25 gnolls in the south-east." }),
            q(277, "Fire Taboo", 1850, 23, 20, WL, [], { after: [463, 276], ledger: "wl-fire", note: "Crude Flint from the gnolls at 44.2,33.9." }),
            q(275, "Blisters on the Land", 2650, 26, 20, WL, ["group"], { after: [463, 276], ledger: "wl-blisters", note: "Stealthed level 26–27 Fen Creepers: at 25 or with the group." }),
          ],
        },
        {
          n: "6", title: "Ironbeard's Tomb (44.2,25.8).",
          text: `Oozes for Sida's Bag.`,
          quests: [],
        },
        {
          n: "7", title: "Back to Menethil.",
          text: `Karl: ${TURN} <em>Claws from the Deep</em>, then ${ACC} <em>Reclaiming Goods</em>. Halloran: ${TURN} <em>Daily Delivery</em> and ${TURN} <em>Young Crocolisk Skins</em>, then ${ACC} <em>Apprentice's Duties</em> (2,100); if you took <em>Crocs of the Sky</em>, ${TURN} it, then ${ACC} <em>Crimson Crate Delivery</em> (1,200, which with Howin's two Razormaw quests, 4,700, belongs to R1). Stoutfist: ${TURN} <em>War Banners</em>, then ${ACC} <em>Nek'rosh's Gambit</em> (1,900, finished in R1 at the catapult, ${WAY("Wetlands", 47.3, 46.9, "Catapult")}). Caitlin: ${TURN} <em>Alchemical Hazards</em>. Sida: ${TURN} <em>Digging Through the Ooze</em>. Valstag: ${TURN} <em>Spoils of War</em>. Fitzsimmons: ${TURN} <em>The Cursed Crew</em>, then ${ACC} <em>Lifting the Curse</em>. Tarrel: ${TURN} the excavation report (<em>In Search of The Excavation Team</em>).`,
          quests: [
            q(279, "Claws from the Deep", 1750, 22, 20, WL, ["core"], { ledger: "wl-claws", note: "Karl Boran; 12 Bluegill Murlocs and Gobbler." }),
            q(484, "Young Crocolisk Skins", 1750, 22, 18, WL, ["core"], { note: "Six skins in Forever." }),
            q(469, "Daily Delivery", 830, 21, 18, WL, ["core"], { note: "From Einar Stonegrip at the Crossroads to Halloran." }),
            q(98072, "Crocs of the Sky", 2200, 27, 19, WL, ["optional"], { ledger: "wl-crocs", note: "When Halloran offers it; 10 Pristine Crimson Scales." }),
            q(464, "War Banners", 2300, 28, 23, WL, ["core"], { note: "Captain Stoutfist; Dragonmaw camp." }),
            q(98282, "Alchemical Hazards", 1750, 22, 20, WL, [], { note: "Forever-new; a spider gland at Thelgen Rock." }),
            q(470, "Digging Through the Ooze", 2400, 24, 19, WL, [], { ledger: "wl-ooze", note: "Sida's Bag from the oozes at Ironbeard's Tomb." }),
            q(98197, "Spoils of War", 1750, 22, 18, WL, ["core"], { note: "Underwater salvage in the harbour: only if you can manage the breath." }),
            q(289, "The Cursed Crew", 1750, 29, 22, WL, ["optional"], { after: [288], note: "Cursed wrecks (13.9,30.4)." }),
            q(306, "In Search of The Excavation Team", 485, 24, 21, WL, ["core"], { after: [305], note: "The report back to Tarrel." }),
          ],
        },
        {
          n: "8", title: "Second short north-west trip (about ten minutes).",
          text: `The three hovels at ${WAY("Wetlands", 13.5, 41.5, "Hovel 1")} → ${WAY("Wetlands", 13.5, 38.4, "Hovel 2")} → ${WAY("Wetlands", 13.9, 34.8, "Hovel 3")}. First hovel: ${TURN} <em>Reclaiming Goods</em> (510), then ${ACC} <em>The Search Continues</em>. Second hovel: ${TURN} <em>The Search Continues</em> (510), then ${ACC} <em>Search More Hovels</em>. Third hovel: ${TURN} <em>Search More Hovels</em> (1,000), then ${ACC} <em>Return the Statuette</em> (1,500). Giant crocolisks at ${WAY("Wetlands", 17.8, 26.3, "Giant crocolisks")} for <em>Apprentice's Duties</em>. Captain Halyndor's ship ${WAY("Wetlands", 15.5, 23.5, "Captain Halyndor's ship")}, entered by the broken mast; the key opens the strongbox through the north hull hole ${WAY("Wetlands", 14.4, 24.0, "Strongbox, north hull hole")}, a short dive. At the strongbox: ${TURN} <em>Lifting the Curse</em>, then ${ACC} <em>The Eye of Paleth</em> (1,200). Back in town, Karl: ${TURN} <em>Return the Statuette</em>, then ${ACC} the 200-XP delivery of the statuette to Stoutfist (also named <em>Return the Statuette</em>). Stoutfist: ${TURN} the delivery, then ${ACC} <em>A Friend of the Family</em> for Stormwind. Halloran: ${TURN} <em>Apprentice's Duties</em>. Glorin Steelbrow ${WAY("Wetlands", 10.6, 60.5, "Glorin Steelbrow")}: ${TURN} <em>The Eye of Paleth</em>, then ${ACC} <em>Cleansing the Eye</em> (2,450 in the Stormwind Cathedral).`,
          quests: [
            q(281, "Reclaiming Goods", 510, 25, 20, WL, [], { after: [279], note: "First hovel (13.5,41.5)." }),
            q(284, "The Search Continues", 510, 25, 20, WL, [], { after: [281], note: "Second hovel (13.5,38.4)." }),
            q(285, "Search More Hovels", 1000, 25, 20, WL, [], { after: [284], note: "Third hovel (13.9,34.8)." }),
            q(286, "Return the Statuette", 1500, 25, 20, WL, [], { after: [285], note: "Karl Boran." }),
            q(98189, "Return the Statuette (to Stoutfist)", 200, 25, 20, WL, [], { after: [286], note: "Forever-new; leads to A Friend of the Family for Stormwind." }),
            q(471, "Apprentice's Duties", 2100, 26, 18, WL, ["optional"], { after: [484], ledger: "wl-duties", note: "Giant crocolisks at 17.8,26.3." }),
            q(290, "Lifting the Curse", 1200, 30, 22, WL, ["optional"], { after: [289], note: "Captain Halyndor's ship (15.5,23.5)." }),
            q(292, "The Eye of Paleth", 1200, 30, 22, WL, ["optional"], { after: [290], note: "The strongbox through the north hull hole; a short dive." }),
          ],
        },
        {
          n: "9", title: "Leave.",
          text: `Fly Menethil → Ironforge. Gerrig ${WAY("Ironforge", 50.8, 5.6, "Gerrig Bonegrip")}: ${TURN} <em>Knowledge in the Deeps</em>. Tram to Stormwind, where block C starts by turning in <em>Cleansing the Eye</em> at the Cathedral.`,
          quests: [
            dq(971, "Knowledge in the Deeps", 2750, 2.375, 23, 10, BFD, ["core"], { note: "The Lorgalis Manuscript from Blackfathom Deeps; Gerrig Bonegrip, Ironforge." }),
            q(293, "Cleansing the Eye", 2450, 30, 22, WL, ["optional"], { after: [292], note: "Archbishop Benedictus, Stormwind Cathedral (block C, step 1); the route counts it here." }),
          ],
        },
      ],
    },
    {
      id: "C",
      title: "Redridge leftovers, Duskwood, and the Stockade",
      range: "25–28",
      leaveAt: 28.7,
      leaveText: "Leave at 28.7 for Gnomeregan",
      accent: "#9b83d7",
      kill: { open: 19600 },
      intro: `Turn in banked Duskwood quests at Darkshire on arrival and skip them below. Bind the hearthstone in Darkshire for this block (Tavernkeep Smitts, 73.8,44.5); a western trip can then end with a hearth whenever the stone is ready (the cooldown is an hour, so about every other trip). Run the Stockade whenever the group forms after the Darkshire pickup round; Bazil Thredd is 29. The Duskwood figure assumes <em>The Valor Family</em> and <em>Night Watch</em> 1–2 are still open; if you turned them in before the cap, they show as done.`,
      steps: [
        {
          n: "1", title: "Stormwind.",
          text: `Archbishop Benedictus ${WAY("Stormwind City", 39.6, 27.2, "Archbishop Benedictus")}, Cathedral of Light: ${TURN} <em>Cleansing the Eye</em>. Highlord Bolvar Fordragon in the Keep: ${TURN} <em>A Friend of the Family</em>, then ${ACC} its next step (same name); Lord Grayson Shadowbreaker in the Cathedral: ${TURN} it. Billibub Cogspinner, Dwarven District ${WAY("Stormwind City", 55.3, 7.1, "Billibub Cogspinner")}: buy a Bronze Tube for <em>Look to the Stars</em>, which Viktori gives in Darkshire in step 3 (4,500 XP over three steps; Herble in Darkshire also sells them, with limited stock). Fly to Lakeshire.`,
          quests: [],
        },
        {
          n: "2", title: "Lakeshire.",
          text: `Martie Jainrose ${WAY("Redridge Mountains", 21.9, 46.3, "Martie Jainrose")}: ${ACC} <em>An Unwelcome Guest</em> (1,950; Bellygrub, ${WAY("Redridge Mountains", 15.7, 49.4, "Bellygrub")}). Verner Osgood ${WAY("Redridge Mountains", 31.0, 47.3, "Verner Osgood")}: ${ACC} <em>Howling in the Hills</em> (2,000; Yowler, ${WAY("Redridge Mountains", 27.6, 21.4, "Yowler")}; needs <em>A Baying of Gnolls</em> done). Guard Berton ${WAY("Redridge Mountains", 26.3, 46.6, "Guard Berton")}: ${ACC} <em>What Comes Around…</em> if not held. At 25 or below, three more still pay full: Foreman Oslow: ${ACC} <em>The Everstill Bridge</em> (1,550); Dockmaster Baren: ${ACC} <em>Murloc Poachers</em> and ${ACC} <em>Selling Fish</em> (2,800). Back in town: ${TURN} <em>An Unwelcome Guest</em> to Martie, ${TURN} <em>Howling in the Hills</em> to Verner, and ${TURN} any of the three extras to its giver. Fly Lakeshire → Darkshire.`,
          quests: [
            q(34, "An Unwelcome Guest", 1950, 24, 18, RR, ["core"], { note: "Bellygrub on the western farms (15.7,49.4)." }),
            q(126, "Howling in the Hills", 2000, 25, 15, RR, ["core"], { note: "Yowler (27.6,21.4); needs A Baying of Gnolls done." }),
            q(89, "The Everstill Bridge", 1550, 20, 15, RR, ["optional"], { note: "Full XP only at 25 or below." }),
            q(150, "Murloc Poachers", 1550, 20, 20, RR, ["optional"], { note: "Full XP only at 25 or below." }),
            q(127, "Selling Fish", 1250, 21, 16, RR, ["optional"], { note: "Full XP only at 26 or below." }),
          ],
        },
        {
          n: "3", title: "Darkshire pickup round.",
          text: `Sirra Von'Indi ${WAY("Duskwood", 72.6, 47.6, "Sirra Von'Indi")}: ${ACC} <em>The Valor Family</em> (1,750; the Raven Hill Tome) if not done. Councilman Millstipe ${WAY("Duskwood", 71.9, 47.8, "Councilman Millstipe")}: ${ACC} <strong>Crime and Punishment</strong> (4,410). Commander Althea Ebonlocke ${WAY("Duskwood", 73.6, 46.8, "Commander Althea Ebonlocke")}: ${ACC} <em>The Night Watch</em> 1 (1,450) if not done; she gives step 2 (2,100) once step 1 is turned in. Madame Eva ${WAY("Duskwood", 75.7, 45.3, "Madame Eva")}: ${ACC} <em>The Totem of Infliction</em> (2,550) if not held; she also starts <em>The Legend of Stalvan</em> (see the extras). Chef Grual ${WAY("Duskwood", 73.9, 43.5, "Chef Grual")}: ${ACC} <em>Seasoned Wolf Kabobs</em> (2,000) if not held. Elaine Carevin ${WAY("Duskwood", 75.3, 48.6, "Elaine Carevin")}: ${ACC} <em>Deliveries to Sven</em> (920) and ${ACC} <em>The Hermit</em> (1,000). Viktori Prism'Antras ${WAY("Duskwood", 79.8, 47.9, "Viktori Prism'Antras")}: ${ACC} <em>Look to the Stars</em> and ${TURN} it at once with the Bronze Tube (2,000), then ${ACC} step 2.`,
          quests: [
            q(174, "Look to the Stars (Bronze Tube)", 2000, 25, 20, DW, ["core"], { note: "Viktori Prism'Antras, with the Bronze Tube." }),
          ],
        },
        {
          n: "4", title: "Tranquil Gardens Cemetery.",
          text: `Blind Mary ${WAY("Duskwood", 82.0, 59.0, "Blind Mary")}: ${TURN} <em>Look to the Stars</em> step 2 (1,000), then ${ACC} step 3 (the Insane Ghoul at the chapel, ${WAY("Duskwood", 80.9, 71.8, "Insane Ghoul, chapel")}, 1,500). For <em>The Night Watch</em> 1: 8 Skeletal Warriors and 6 Skeletal Mages ${WAY("Duskwood", 79.3, 70.3, "Skeletal Warriors and Mages")}. Skeleton Fingers for the Totem. Back in town, Althea: ${TURN} <em>The Night Watch</em> 1, then ${ACC} step 2. Viktori: ${TURN} <em>Look to the Stars</em> step 3.`,
          quests: [
            q(175, "Look to the Stars (Blind Mary)", 1000, 25, 20, DW, ["core"], { after: [174], note: "Blind Mary (82.0,59.0)." }),
            q(177, "Look to the Stars (Insane Ghoul)", 1500, 25, 20, DW, ["core"], { after: [175], note: "The Insane Ghoul at the chapel (80.9,71.8)." }),
            q(56, "The Night Watch (1)", 1450, 24, 18, DW, ["core"], { note: "Skeletal Warriors and Mages (79.3,70.3)." }),
          ],
        },
        {
          n: "5", title: "Western trips (three of them).",
          text: `Hearth back when the stone is ready, otherwise the road east. Sven Yorgen ${WAY("Duskwood", 7.8, 34.1, "Sven Yorgen")}: ${TURN} <em>Deliveries to Sven</em>, then ${ACC} <em>Sven's Revenge</em> (1,000; the stump at his old farm, ${WAY("Duskwood", 49.9, 77.8, "Stump at Sven's old farm")}). At the stump: ${TURN} <em>Sven's Revenge</em>, then ${ACC} <em>Sven's Camp</em> (1,000). Sven: ${TURN} <em>Sven's Camp</em>, then ${ACC} <em>The Shadowy Figure</em> (510). In Darkshire, Eva: ${TURN} <em>The Shadowy Figure</em>, then ${ACC} <em>The Shadowy Search Continues</em> (200). Daltry: ${TURN} <em>The Shadowy Search Continues</em>, then ${ACC} <em>Inquire at the Inn</em> (200). Smitts: ${TURN} <em>Inquire at the Inn</em>, then ${ACC} <em>Finding the Shadowy Figure</em> (1,000). Jitters ${WAY("Duskwood", 18.4, 56.5, "Jitters")}: ${TURN} <em>Finding the Shadowy Figure</em>, then ${ACC} <em>Return to Sven</em> (510). Sven: ${TURN} <em>Return to Sven</em>, then ${ACC} <em>Proving Your Worth</em> (2,300; 15 Skeletal Raiders, 3 Healers, 3 Warders at the crypt, ${WAY("Duskwood", 16.2, 38.8, "Crypt, Proving Your Worth")}). Sven: ${TURN} <em>Proving Your Worth</em>, then ${ACC} <em>Seeking Wisdom</em> (590; turned in to Bishop Farthing in Stormwind). Abercrombie ${WAY("Duskwood", 28.0, 31.5, "Abercrombie")}: ${TURN} <em>The Hermit</em>, then ${ACC} <em>Supplies from Darkshire</em> (485). Eva: ${TURN} <em>Supplies from Darkshire</em>, then ${ACC} <em>Ghost Hair Thread</em> (485). Blind Mary: ${TURN} <em>Ghost Hair Thread</em>, then ${ACC} <em>Return the Comb</em> (195). Eva: ${TURN} <em>Return the Comb</em>, then ${ACC} <em>Deliver the Thread</em> (1,450). Abercrombie: ${TURN} <em>Deliver the Thread</em>, then ${ACC} <em>Zombie Juice</em> (485). Smitts: ${TURN} <em>Zombie Juice</em>, then ${ACC} <em>Gather Rot Blossoms</em> (970; Raven Hill Cemetery, ${WAY("Duskwood", 21.6, 45.1, "Raven Hill Cemetery")}). Smitts: ${TURN} <em>Gather Rot Blossoms</em>, then ${ACC} <em>Juice Delivery</em> (970, handed in in R2). Raven Hill Cemetery also covers <em>The Night Watch</em> 2 (15 Fiends, 15 Horrors) and the Totem's ghoul fangs. In Darkshire, hand in what the trips finish: Sirra: ${TURN} <em>The Valor Family</em>; Grual: ${TURN} <em>Seasoned Wolf Kabobs</em>; Eva: ${TURN} <em>The Totem of Infliction</em>; Althea: ${TURN} <em>The Night Watch</em> 2. The Valor ghosts drop the items that start <em>Grant's Shield</em>, <em>Ira's Dagger</em>, <em>Merrick's Bow</em> and <em>Silvia's Sword</em> if you have not banked them: the Lost Knight at Raven Hill (${WAY("Duskwood", 24.2, 41, "Lost Knight, Raven Hill 1")} and ${WAY("Duskwood", 24.6, 32.2, "Lost Knight, Raven Hill 2")}) and Tranquil Gardens (${WAY("Duskwood", 79.8, 68.4, "Lost Knight, Tranquil Gardens 1")}; ${WAY("Duskwood", 81, 67.8, "Lost Knight, Tranquil Gardens 2")}; ${WAY("Duskwood", 80.6, 57.8, "Lost Knight, Tranquil Gardens 3")}), the Lost Stalker at ${WAY("Duskwood", 33.2, 43.2, "Lost Stalker 1")}, ${WAY("Duskwood", 41, 21.4, "Lost Stalker 2")}, ${WAY("Duskwood", 51, 63.2, "Lost Stalker 3")} and ${WAY("Duskwood", 56.4, 60.8, "Lost Stalker 4")}, the Lost Watcher at ${WAY("Duskwood", 15.4, 61, "Lost Watcher 1")}, ${WAY("Duskwood", 30.6, 60.6, "Lost Watcher 2")}, ${WAY("Duskwood", 43, 70, "Lost Watcher 3")}, ${WAY("Duskwood", 43.2, 66.2, "Lost Watcher 4")} and ${WAY("Duskwood", 75.8, 23.2, "Lost Watcher 5")}, the Lost Defender at ${WAY("Duskwood", 63, 70, "Lost Defender")}. When an item drops, ${ACC} its quest from the item; ${TURN} each finished weapon quest to Sirra in Darkshire. <em>Grant's Shield</em> then needs Grant's Mace from the Raven Hill Cemetery skeletons.`,
          quests: [
            q(96139, "The Valor Family", 1750, 22, 18, DW, ["core"], { note: "Sirra Von'Indi; the Raven Hill Tome. Unlocks the four weapon quests." }),
            q(164, "Deliveries to Sven", 920, 23, 17, DW, ["core"], { note: "Elaine Carevin → Sven Yorgen (7.8,34.1)." }),
            q(95, "Sven's Revenge", 1000, 25, 20, DW, ["core"], { after: [164], note: "The stump at his old farm (49.9,77.8)." }),
            q(230, "Sven's Camp", 1000, 25, 20, DW, ["core"], { after: [95] }),
            q(262, "The Shadowy Figure", 510, 25, 20, DW, ["core"], { after: [230] }),
            q(265, "The Shadowy Search Continues", 200, 25, 20, DW, ["core"], { after: [262], note: "Madame Eva → Clerk Daltry." }),
            q(266, "Inquire at the Inn", 200, 25, 20, DW, ["core"], { after: [265], note: "Clerk Daltry → Tavernkeep Smitts." }),
            q(453, "Finding the Shadowy Figure", 1000, 25, 20, DW, ["core"], { after: [266], note: "Smitts → Jitters (18.4,56.5)." }),
            q(268, "Return to Sven", 510, 25, 20, DW, ["core"], { after: [453] }),
            q(323, "Proving Your Worth", 2300, 28, 20, DW, ["core"], { after: [268], note: "Skeletal Raiders, Healers and Warders at the crypt (16.2,38.8)." }),
            q(165, "The Hermit", 1000, 25, 17, DW, ["core"], { note: "Elaine Carevin → Abercrombie (28.0,31.5)." }),
            q(148, "Supplies from Darkshire", 485, 24, 20, DW, ["core"], { after: [165] }),
            q(149, "Ghost Hair Thread", 485, 24, 20, DW, ["core"], { after: [148], note: "Blind Mary." }),
            q(154, "Return the Comb", 195, 24, 20, DW, ["core"], { after: [149] }),
            q(157, "Deliver the Thread", 1450, 24, 20, DW, ["core"], { after: [154] }),
            q(158, "Zombie Juice", 485, 24, 20, DW, ["core"], { after: [157], note: "Tavernkeep Smitts." }),
            q(156, "Gather Rot Blossoms", 970, 24, 20, DW, ["core"], { after: [158], note: "Raven Hill Cemetery (21.6,45.1); take Juice Delivery for R2." }),
            q(57, "The Night Watch (2)", 2100, 26, 18, DW, ["core"], { after: [56], note: "15 Skeletal Fiends and 15 Horrors at Raven Hill Cemetery." }),
            q(101, "The Totem of Infliction", 2550, 25, 18, DW, ["core"], { ledger: "dw-totem", note: "Madame Eva; skeleton fingers, spider venom and ghoul fangs." }),
            q(90, "Seasoned Wolf Kabobs", 2000, 25, 18, DW, ["core"], { ledger: "dw-kabobs", note: "Chef Grual; Lean Wolf Flanks." }),
            q(79362, "Grant's Shield", 2000, 25, 18, DW, [], { after: [96139], ledger: "dw-grant", note: "Starts from a Lost Knight's item; Grant's Mace from the Raven Hill skeletons." }),
            q(96137, "Ira's Dagger", 1950, 24, 18, DW, [], { after: [96139], ledger: "dw-ira", note: "Starts from a Valor ghost's item." }),
            q(79363, "Silvia's Sword", 2100, 26, 18, DW, ["extra", "group"], { after: [96139], ledger: "dw-silvia", note: "Not counted by the route: Defias Enchanters, a duo job." }),
            q(96138, "Merrick's Bow", 2300, 28, 18, DW, ["extra", "group"], { after: [96139], ledger: "dw-merrick", note: "Not counted by the route: Vul'Gol ogres, a duo job." }),
            q(245, "Eight-Legged Menaces", 1250, 21, 17, DW, ["extra"], { ledger: "dw-spiders", note: "A bank quest the route does not plan: level 21, grey mobs by now. Watcher Dodds (45.1,67.0)." }),
            q(226, "Wolves at Our Heels", 1250, 21, 19, DW, ["extra"], { ledger: "dw-wolves", note: "A bank quest the route does not plan: level 21. Lars at Sven's camp (7.7,33.2)." }),
          ],
        },
        {
          n: "6", title: "The Stockade.",
          text: `Fly Darkshire → Stormwind. Bishop Farthing ${WAY("Stormwind City", 39.3, 28.0, "Bishop Farthing")}: ${TURN} <em>Seeking Wisdom</em>, then ${ACC} <em>The Doomed Fleet</em> (carry to R1). Run the Stockade. Warden Thelwater ${WAY("Stormwind City", 41.1, 58.1, "Warden Thelwater")}: ${TURN} <em>Quell the Uprising</em> and ${TURN} <em>The Stockade Riots</em>. Nikova Raskol ${WAY("Stormwind City", 72.4, 47.7, "Nikova Raskol")}: ${TURN} <em>The Color of Blood</em>. Hearth to Darkshire. Councilman Millstipe ${WAY("Duskwood", 71.9, 47.8, "Councilman Millstipe")}: ${TURN} <em>Crime and Punishment</em>. Fly to Lakeshire. Guard Berton ${WAY("Redridge Mountains", 26.3, 46.6, "Guard Berton")}: ${TURN} <em>What Comes Around…</em>.`,
          quests: [
            q(269, "Seeking Wisdom", 590, 29, 20, DW, ["core"], { after: [323], note: "Bishop Farthing, Stormwind Cathedral." }),
            dq(387, "Quell the Uprising", 2650, 2.1, 26, 22, STOCKS, ["core"], { note: "Warden Thelwater." }),
            dq(388, "The Color of Blood", 2650, 2.1, 26, 22, STOCKS, ["core"], { note: "Nikova Raskol, Old Town." }),
            dq(391, "The Stockade Riots", 2350, 2.1, 29, 16, STOCKS, ["core"], { note: "Bazil Thredd (level 29); Thelwater." }),
            dq(377, "Crime and Punishment", 2100, 2.1, 26, 22, STOCKS, ["core"], { note: "Councilman Millstipe, Darkshire." }),
            dq(386, "What Comes Around…", 2000, 2.1, 25, 22, STOCKS, ["core"], { note: "Guard Berton, Lakeshire." }),
            run("run-stocks", "The Stockade run: kill XP", 5400, STOCKS, "Estimate for one five-player run."),
          ],
        },
        {
          n: "Extras", title: "Extras for this block, in order of value.",
          text: `<em>The Legend of Stalvan</em> (9,140 XP over twelve talk-and-fetch steps from Madame Eva through Moonbrook, Goldshire, Stormwind and the Eastvale Logging Camp; it fits the Stockade trip): ${ACC} step 1 from Madame Eva; each step is turned in to the NPC or object that gives the next. The final kill, 4,100, is a level-35 quest for level 30. Calor ${WAY("Duskwood", 75.4, 48.0, "Calor")}: ${ACC} <em>Worgen in the Woods</em> 1 (1,150, Shadow Weavers at ${WAY("Duskwood", 60.8, 29.7, "Shadow Weavers")}; listed under R2), then ${TURN} it to him. The Jitters food chain (2,340 at 26 or below): ${ACC} <em>Raven Hill</em> from Elaine Carevin; each step is turned in to the NPC who gives the next, ending at Jitters. The route's block C total counts the twelve Stalvan steps.`,
          quests: [
            q(66, "The Legend of Stalvan (1)", 230, 28, 22, DW, ["optional"], { note: "Madame Eva." }),
            q(67, "The Legend of Stalvan (2)", 1150, 28, 22, DW, ["optional"], { after: [66] }),
            q(68, "The Legend of Stalvan (3)", 1700, 28, 22, DW, ["optional"], { after: [67] }),
            q(69, "The Legend of Stalvan (4)", 570, 28, 22, DW, ["optional"], { after: [68] }),
            q(70, "The Legend of Stalvan (5)", 1700, 28, 22, DW, ["optional"], { after: [69] }),
            q(72, "The Legend of Stalvan (6)", 230, 28, 22, DW, ["optional"], { after: [70] }),
            q(74, "The Legend of Stalvan (7)", 1150, 28, 22, DW, ["optional"], { after: [72] }),
            q(75, "The Legend of Stalvan (8)", 1150, 28, 22, DW, ["optional"], { after: [74] }),
            q(78, "The Legend of Stalvan (9)", 570, 28, 22, DW, ["optional"], { after: [75] }),
            q(79, "The Legend of Stalvan (10)", 230, 28, 22, DW, ["optional"], { after: [78] }),
            q(80, "The Legend of Stalvan (11)", 230, 28, 22, DW, ["optional"], { after: [79] }),
            q(97, "The Legend of Stalvan (12)", 230, 28, 22, DW, ["optional"], { after: [80] }),
            q(98, "The Legend of Stalvan (final kill)", 4100, 35, 22, DW, ["extra", "group"], { after: [97], note: "A level-35 quest; for level 30." }),
            q("jitters-chain", "Jitters food chain (4 quests)", 2340, 20, 17, DW, ["extra"], { note: "Jitters' Growling Gut, Dusky Crab Cakes, Return to Jitters, Raven Hill (Wowhead 5, 93, 240, 163). Full XP only at 25 or below." }),
          ],
        },
      ],
    },
    {
      id: "G",
      title: "Gnomeregan",
      range: "28.7+ → 30",
      leaveAt: null,
      leaveText: "The finish",
      accent: "#d5aa52",
      kill: { open: 0 },
      intro: `About 35,000 quest XP plus a long dungeon's kills, about 57,000 XP in all. No beta group has recorded a clear; the bosses run from 26 to 34.`,
      steps: [
        {
          n: "1", title: "Ironforge.",
          text: `Fly to Ironforge, bind the hearthstone there, and collect the Tinker Town quests. Tinkmaster Overspark ${WAY("Ironforge", 69.2, 50.6, "Tinkmaster Overspark and Gnoarn")}: ${ACC} <em>Save Techbot's Brain!</em>. Gnoarn: ${ACC} <em>The Day After</em>. Ozzie Togglevolt, Kharanos ${WAY("Dun Morogh", 45.9, 49.4, "Ozzie Togglevolt")}: ${TURN} <em>The Day After</em>, then ${ACC} <em>Gnogaine</em>; he gives <em>The Only Cure is More Green Glow</em> once <em>Gnogaine</em> is turned in. Klockmort Spannerspan ${WAY("Ironforge", 69.8, 48.1, "Klockmort Spannerspan")}: ${ACC} <em>Essential Artificials</em> (from 24). Master Mechanic Castpipe ${WAY("Ironforge", 68.7, 49.0, "Master Mechanic Castpipe")}: ${ACC} <em>Data Rescue</em> (from 25). High Tinker Mekkatorque ${WAY("Ironforge", 69.5, 50.3, "High Tinker Mekkatorque")}: ${ACC} <em>The Grand Betrayal</em> (from 25). <em>Gyrodrillmatic Excavationators</em> is already in the log. Skip <em>A Fine Mess</em> (Booty Bay turn-in).`,
          quests: [
            dq(2927, "The Day After", 220, 1.8, 27, 20, GNOMER, ["core"], { note: "Gnoarn → Ozzie Togglevolt, Kharanos." }),
          ],
        },
        {
          n: "2", title: "Gnomeregan.",
          text: `The run, then the hand-ins in Tinker Town, Kharanos and Stormwind. Tinker Town: ${TURN} <em>Save Techbot's Brain!</em> to Tinkmaster Overspark, ${TURN} <em>Essential Artificials</em> to Klockmort Spannerspan, ${TURN} <em>Data Rescue</em> to Master Mechanic Castpipe and ${TURN} <em>The Grand Betrayal</em> to High Tinker Mekkatorque. Kharanos, Ozzie Togglevolt ${WAY("Dun Morogh", 45.9, 49.4, "Ozzie Togglevolt")}: ${TURN} <em>Gnogaine</em>, then ${ACC} <em>The Only Cure is More Green Glow</em> (the fallout decays on a timer) and ${TURN} it to him. Stormwind, by tram: ${TURN} <em>Gyrodrillmatic Excavationators</em> to Shoni, Dwarven District ${WAY("Stormwind City", 55.5, 12.5, "Shoni the Shilent")}.`,
          quests: [
            dq(2922, "Save Techbot's Brain!", 2650, 1.8, 26, 20, GNOMER, ["core"], { note: "Tinkmaster Overspark." }),
            dq(2926, "Gnogaine", 2200, 1.8, 27, 20, GNOMER, ["core"], { after: [2927], note: "Ozzie Togglevolt, Kharanos." }),
            dq(2962, "The Only Cure is More Green Glow", 2450, 1.8, 30, 20, GNOMER, ["core"], { after: [2926], note: "Ozzie; the fallout decays on a timer." }),
            dq(2924, "Essential Artificials", 3050, 1.8, 30, 24, GNOMER, ["core"], { note: "Klockmort Spannerspan, from 24." }),
            dq(2930, "Data Rescue", 3650, 1.8, 30, 25, GNOMER, ["core"], { note: "Master Mechanic Castpipe, from 25." }),
            dq(2929, "The Grand Betrayal", 2750, 1.8, 35, 25, GNOMER, ["core"], { note: "High Tinker Mekkatorque, from 25." }),
            dq(2928, "Gyrodrillmatic Excavationators", 2450, 1.8, 30, 20, GNOMER, ["core"], { note: "Shoni, Stormwind (taken in block A, step 1)." }),
            run("run-gnomer", "Gnomeregan run: kill XP", 22000, GNOMER, "Estimate for one long five-player run."),
          ],
        },
      ],
    },
    {
      id: "R1",
      title: "Wetlands second pass and the Hillsbrad tail",
      range: "27–29",
      leaveAt: null,
      leaveText: "Reserve",
      accent: "#65b8aa",
      kill: { open: 10000 },
      intro: `About 25,300 quest XP solo, 36,700 with the group extras. Fly to Menethil (through Ironforge), bind the hearthstone there.`,
      steps: [
        {
          n: "1", title: "Menethil.",
          text: `Glorin Steelbrow ${WAY("Wetlands", 10.6, 60.5, "Glorin Steelbrow")}: ${TURN} <em>The Doomed Fleet</em> (1,200), then ${ACC} <em>Lightforge Iron</em> (590). The wreck of the <em>Flying Osprey</em> south of town: ${TURN} <em>Lightforge Iron</em>, then ${ACC} <em>The Lost Ingots</em> (1,750; murlocs at ${WAY("Wetlands", 10.1, 69.5, "Lost Ingots murlocs")}, poor drop). Glorin: ${TURN} <em>The Lost Ingots</em>, then ${ACC} <em>Blessed Arm</em> (1,200, paid in Stormwind on the next visit). Harlo Barnaby ${WAY("Wetlands", 10.9, 55.9, "Harlo Barnaby")}: ${ACC} <em>Fall of Dun Modr</em> (1,000; Longbraid at Dun Modr).`,
          quests: [
            q(270, "The Doomed Fleet", 1200, 29, 20, WL, [], { after: [269], note: "From Bishop Farthing (block C); Glorin Steelbrow." }),
            q(321, "Lightforge Iron", 590, 29, 20, WL, [], { after: [270] }),
            q(324, "The Lost Ingots", 1750, 29, 20, WL, [], { after: [321], note: "Murlocs at 10.1,69.5; poor drop." }),
            q(322, "Blessed Arm", 1200, 29, 20, WL, [], { after: [324], note: "Paid in Stormwind on the next visit." }),
          ],
        },
        {
          n: "2", title: "On the road east.",
          text: `Howin Kindfeather east of Whelgar's: ${TURN} <em>Crimson Crate Delivery</em>, then ${ACC} <em>Razormaw Needling</em> and ${ACC} <em>Trying Times</em> (2,350 each; Razormaw raptors at Raptor Ridge in the north-east and Saltspray Glen in the north-west); back at Howin, ${TURN} both. The catapult at ${WAY("Wetlands", 47.3, 46.9, "Catapult")}: ${TURN} <em>Nek'rosh's Gambit</em>; with the group for the step-3 extras, also ${ACC} <em>Defeat Nek'rosh</em> there. Finish anything block B left (<em>Apprentice's Duties</em>, the <em>Cursed Crew</em> chain, <em>Blisters on the Land</em>).`,
          quests: [
            q(98240, "Crimson Crate Delivery", 1200, 29, 19, WL, [], { after: [98072], note: "After Crocs of the Sky; Howin Kindfeather east of Whelgar's." }),
            q(98245, "Razormaw Needling", 2350, 29, 21, WL, [], { after: [98240], note: "Razormaw raptors at Raptor Ridge and Saltspray Glen." }),
            q(98246, "Trying Times", 2350, 29, 21, WL, [], { after: [98240] }),
            q(465, "Nek'rosh's Gambit", 1900, 31, 23, WL, [], { after: [464], note: "The catapult at 47.3,46.9." }),
          ],
        },
        {
          n: "3", title: "Dun Modr (49.9,18.3) at level 28.",
          text: `Longbraid: ${TURN} <em>Fall of Dun Modr</em>. Rhag Garmason: ${ACC} <em>The Thandol Span</em> (2,500 × 3). The first step is group-flagged: Ol' Rustlocke's body is down in the span at ${WAY("Wetlands", 51.2, 8.0, "Ol' Rustlocke's body")} among the Dark Irons, so bring the group or fight through; at the body ${TURN} step 1, then ${ACC} step 2, the report. Rhag: ${TURN} the report, then ${ACC} step 3, the explosives on the Arathi side at ${WAY("Arathi Highlands", 48.7, 87.9, "Thandol Span explosives")} up the ramp at ${WAY("Arathi Highlands", 52.5, 90.4, "Ramp to the explosives")}. Rhag: ${TURN} step 3, then ${ACC} <em>Plea To The Alliance</em> (1,250). <strong>Group extras</strong> here: Motley Garmason: ${ACC} <em>The Dark Iron War</em> (2,450) and ${TURN} it to him; in Classic it gates <em>The Fury Runs Deep</em>, the Stockade's Kam Deepfury quest (5,775), which would need a second Stockade run: ${ACC} it from Motley only if that run will happen, and it is turned in to him afterwards. Longbraid: ${ACC} <em>A Grim Task</em> (3,350; Balgaras at ${WAY("Wetlands", 46.8, 16.0, "Balgaras 1")} or ${WAY("Wetlands", 61.8, 31.0, "Balgaras 2")}) and ${TURN} it to him. <em>Defeat Nek'rosh</em> (2,550) comes from the catapult in step 2 and is turned in to Stoutfist in Menethil, as is Stoutfist's own <em>Forced Disarmament</em> (3,050).`,
          quests: [
            q(472, "Fall of Dun Modr", 1000, 25, 25, WL, [], { note: "Harlo Barnaby → Longbraid." }),
            q(631, "The Thandol Span (Ol' Rustlocke)", 2500, 31, 28, WL, ["group"], { note: "Group-flagged: down in the span among the Dark Irons." }),
            q(632, "The Thandol Span (report)", 2500, 31, 28, WL, [], { after: [631] }),
            q(633, "The Thandol Span (explosives)", 2500, 31, 28, "Arathi Highlands", [], { after: [632], note: "Arathi side, 48.7,87.9 up the ramp at 52.5,90.4." }),
            q(303, "The Dark Iron War", 2450, 30, 25, WL, ["extra", "group"], { note: "Motley Garmason; Classic gate for The Fury Runs Deep." }),
            q(304, "A Grim Task", 3350, 34, 26, WL, ["extra", "group"], { note: "Balgaras at 46.8,16.0 or 61.8,31.0." }),
            q(474, "Defeat Nek'rosh", 2550, 32, 23, WL, ["extra", "group"], { after: [465] }),
            q(98293, "Forced Disarmament", 3050, 30, 22, WL, ["extra", "group"], { note: "Forever-new; Captain Stoutfist." }),
            dq(378, "The Fury Runs Deep", 2750, 2.1, 27, 22, STOCKS, ["extra", "group"], { after: [303], note: "Kam Deepfury: a second Stockade run. About 5,800." }),
          ],
        },
        {
          n: "4", title: "Tail.",
          text: `Foggy MacKreel ${WAY("Arathi Highlands", 43.3, 92.6, "Foggy MacKreel")}: ${ACC} <em>MacKreel's Moonshine</em> (3,050, 15-minute timer, take it last). North to Refuge Pointe, Captain Nials ${WAY("Arathi Highlands", 45.9, 47.5, "Captain Nials")}: ${TURN} <em>Plea To The Alliance</em>; flight path ${WAY("Arathi Highlands", 45.8, 46.1, "Refuge Pointe flight path")}. Southshore inn, Brewmeister Bilger ${WAY("Hillsbrad Foothills", 52.2, 58.6, "Brewmeister Bilger, Southshore inn")}: ${TURN} <em>MacKreel's Moonshine</em>; flight path ${WAY("Hillsbrad Foothills", 49.3, 52.3, "Southshore flight path")}. Hearth to Menethil for the last turn-ins (Sida, Halloran, Stoutfist) and fly Menethil → Ironforge. Still short? Lieutenant Farren Orinelle's Southshore chain (10,060 over six quests; murlocs at ${WAY("Hillsbrad Foothills", 44.0, 67.6, "Farren's murlocs 1")} and ${WAY("Hillsbrad Foothills", 42.3, 68.3, "Farren's murlocs 2")}, naga at ${WAY("Hillsbrad Foothills", 57.1, 67.4, "Farren's naga")}; the last 3,200 pays in Stormwind Keep).`,
          quests: [
            q(634, "Plea To The Alliance", 1250, 31, 28, "Arathi Highlands", [], { after: [633], note: "Captain Nials, Refuge Pointe." }),
            q(647, "MacKreel's Moonshine", 3050, 30, 28, "Hillsbrad", [], { note: "15-minute timer: take it last." }),
            q("farren-chain", "Farren Orinelle's Southshore chain (6 quests)", 10060, 30, 25, "Hillsbrad", ["extra"], { note: "Down the Coast → Farren's Proof ×3 → Stormwind Ho! → Reassignment (Wowhead 536, 559–563); only if still short." }),
          ],
        },
      ],
    },
    {
      id: "R2",
      title: "Duskwood second pass",
      range: "28–30",
      leaveAt: null,
      leaveText: "Reserve",
      accent: "#e46e78",
      kill: { open: 7000 },
      intro: `About 17,200 quest XP, 19,600 with <em>Look to the Stars</em> 4.`,
      steps: [
        {
          n: "1", title: "Calor.",
          text: `${ACC} <em>Worgen in the Woods</em> (steps 1–4: 1,150 + 1,750 + 1,900 + 3,150). Calor takes each of the first three steps and gives the next: Shadow Weavers ${WAY("Duskwood", 60.8, 29.7, "Shadow Weavers")}, Dark Runners ${WAY("Duskwood", 64.7, 49.7, "Dark Runners")}, then the Vile Fangs and Tainted Ones in the Rotting Orchard ${WAY("Duskwood", 73, 75, "Rotting Orchard")}. The fourth step is a talk with Jonathan Carevin: ${TURN} it to him.`,
          quests: [
            q(173, "Worgen in the Woods (1)", 1150, 28, 23, DW, [], { note: "Shadow Weavers (60.8,29.7)." }),
            q(221, "Worgen in the Woods (2)", 1750, 29, 23, DW, [], { after: [173], note: "Dark Runners (64.7,49.7)." }),
            q(222, "Worgen in the Woods (3)", 1900, 31, 23, DW, [], { after: [221], note: "Rotting Orchard (73,75)." }),
            q(223, "Worgen in the Woods (4)", 3150, 31, 23, DW, [], { after: [222], note: "Jonathan Carevin." }),
          ],
        },
        {
          n: "2", title: "Abercrombie.",
          text: `${TURN} <em>Juice Delivery</em>, then ${ACC} <em>Ghoulish Effigy</em> (1,650; 7 Ghoul Ribs). Abercrombie: ${TURN} <em>Ghoulish Effigy</em>, then ${ACC} <em>Ogre Thieves</em> (1,200; the crate by the Vul'Gol cave, ${WAY("Duskwood", 33.5, 76.3, "Ogre Thieves crate, Vul'Gol cave")}). Abercrombie: ${TURN} <em>Ogre Thieves</em>, then ${ACC} <em>Note to the Mayor</em> (610). Darkshire, Ello Ebonlocke: ${TURN} <em>Note to the Mayor</em>, then ${ACC} <em>Translate Abercrombie's Note</em>. Sirra: ${TURN} <em>Translate Abercrombie's Note</em>, then ${ACC} <em>Wait for Sirra to Finish</em>, wait a moment and ${TURN} it, then ${ACC} <em>Translation to Ello</em>. Ello: ${TURN} <em>Translation to Ello</em> (245 + 1,850 + 245).`,
          quests: [
            q(159, "Juice Delivery", 970, 24, 20, DW, [], { after: [156], note: "Taken in block C." }),
            q(133, "Ghoulish Effigy", 1650, 27, 20, DW, [], { after: [159], note: "7 Ghoul Ribs." }),
            q(134, "Ogre Thieves", 1200, 30, 20, DW, [], { after: [133], note: "The crate by the Vul'Gol cave (33.5,76.3)." }),
            q(160, "Note to the Mayor", 610, 30, 20, DW, [], { after: [134] }),
            q(251, "Translate Abercrombie's Note", 245, 30, 20, DW, [], { after: [160] }),
            q(401, "Wait for Sirra to Finish", 1850, 30, 20, DW, [], { after: [251] }),
            q(252, "Translation to Ello", 245, 30, 20, DW, [], { after: [401] }),
          ],
        },
        {
          n: "3", title: "The Night Watch, final step.",
          text: `If <em>The Night Watch</em> 3 is not banked, Althea: ${ACC} it (2,450; 20 Plague Spreaders in the eastern Raven Hill mausoleum, ${WAY("Duskwood", 23.6, 35.0, "Eastern Raven Hill mausoleum")}); back at Althea, ${TURN} it.`,
          quests: [
            q(58, "The Night Watch (3)", 2450, 30, 18, DW, [], { after: [56, 57], ledger: "dw-watch", note: "20 Plague Spreaders (23.6,35.0)." }),
          ],
        },
        {
          n: "4", title: "Extras.",
          text: `Viktori: ${ACC} <em>Look to the Stars</em> 4 (2,450; Zzarc' Vul, level 33, deep in the southern ogre mound, ${WAY("Duskwood", 36.8, 83.8, "Southern ogre mound")}); back at Viktori, ${TURN} it. Group extras: Ello: ${ACC} <em>Bride of the Embalmer</em> (3,650; Eliza at ${WAY("Duskwood", 28.8, 30.9, "Eliza")}, a level-31 elite with three guards), offered after the translation, and ${TURN} it to him. At 30 with the Wetlands ingots done, Sven Yorgen: ${ACC} <em>Morbent Fel</em> (3,850) and ${TURN} it to him.`,
          quests: [
            q(181, "Look to the Stars (Zzarc' Vul)", 2450, 30, 20, DW, ["extra"], { after: [177], note: "Zzarc' Vul, level 33 (36.8,83.8)." }),
            q(253, "Bride of the Embalmer", 3650, 30, 20, DW, ["extra", "group"], { note: "Eliza, a level-31 elite with three guards." }),
            q(55, "Morbent Fel", 3850, 32, 20, DW, ["extra", "group"], { note: "At 30, with the Wetlands ingots done." }),
          ],
        },
      ],
    },
    {
      id: "R3",
      title: "Ashenvale second pass",
      range: "29–30",
      leaveAt: null,
      leaveText: "Reserve",
      accent: "#e59d53",
      kill: { open: 11000 },
      intro: `About 30,600 quest XP. Ship to Auberdine, fly to Astranaar, with <em>Fallen Sky Lake</em> and the moonwell <em>Raene's Cleansing</em> step in the log; take <em>Kayneth Stillwind</em> from Shindrell. Forest Song has no flight master in Classic, and Illiyana and Sentinel Melyria stand at the Shrine of Aessina in the far west (about 22,52) in Classic (check both in game), so the pass is a west–east loop on foot.`,
      steps: [
        {
          n: "1", title: "Shrine of Aessina and Xavian.",
          text: `Illiyana: ${ACC} <em>Vile Satyr! Dryads in Danger!</em>. Sentinel Melyria: ${ACC} <em>The Howling Vale</em> (2,450; the Tome of Mel'Thandris, about ${WAY("Ashenvale", 50.4, 39, "Tome of Mel'Thandris")}). In Xavian, Anilia at ${WAY("Ashenvale", 78.3, 44.8, "Anilia")}: ${TURN} <em>Vile Satyr! Dryads in Danger!</em>, then ${ACC} <em>The Branch of Cenarius</em> (5,100 for the pair; Geltharis at ${WAY("Ashenvale", 78.0, 42.4, "Geltharis")}). Back at the shrine at the end of the loop: ${TURN} <em>The Branch of Cenarius</em> to Illiyana and ${TURN} <em>The Howling Vale</em> to Melyria.`,
          quests: [
            q(1021, "Vile Satyr! Dryads in Danger!", 2550, 32, 26, AV, [], { note: "Anilia in Xavian (78.3,44.8)." }),
            q(1031, "The Branch of Cenarius", 2550, 32, 26, AV, [], { after: [1021], note: "Geltharis (78.0,42.4)." }),
            q(1022, "The Howling Vale", 2450, 30, 25, AV, [], { note: "The Tome of Mel'Thandris (about 50.4,39)." }),
          ],
        },
        {
          n: "2", title: "The rod chain of Raene's Cleansing.",
          text: `13,860 over eight steps of <em>Raene's Cleansing</em>; the first is in the log from block A. The Wooden Key and Iron Shaft near the Felwood road; Shael'dryn at the moonwell: ${TURN} that step, then ${ACC} the next. The Iron Pommel from the slimes near the Dor'danil Barrow Den at about ${WAY("Ashenvale", 76, 76, "Slimes, Dor'danil Barrow Den")}; Shael'dryn: ${TURN} it, then ${ACC} the shrine step. The hidden shrine: ${TURN} the shrine step, then ${ACC} the next; Shael'dryn: ${TURN} it, then ${ACC} the step that takes the rod to Raene. Raene: ${TURN} it, then ${ACC} the Krolg step. Krolg south-east of Mystral Lake: ${TURN} it, then ${ACC} the next: 4 Bloodtooth Guards and Ran Bloodtooth's Skull. Krolg: ${TURN} it, then ${ACC} the last step. Raene: ${TURN} it.`,
          quests: [
            q(1026, "Raene's Cleansing (rod 1)", 2200, 27, 18, AV, [], { after: [1024], note: "Taken at the moonwell in block A." }),
            q(1027, "Raene's Cleansing (rod 2)", 2300, 28, 18, AV, [], { after: [1026] }),
            q(1028, "Raene's Cleansing (rod 3)", 1700, 28, 18, AV, [], { after: [1027] }),
            q(1055, "Raene's Cleansing (rod 4)", 230, 28, 18, AV, [], { after: [1028] }),
            q(1029, "Raene's Cleansing (rod 5)", 230, 28, 18, AV, [], { after: [1055] }),
            q(1030, "Raene's Cleansing (rod 6)", 1700, 28, 18, AV, [], { after: [1029] }),
            q(1045, "Raene's Cleansing (rod 7)", 2450, 30, 18, AV, [], { after: [1030], note: "Bloodtooth Guards and Ran Bloodtooth's Skull." }),
            q(1046, "Raene's Cleansing (rod 8)", 3050, 30, 18, AV, [], { after: [1045], note: "Glacial Stone or Gutterblade plus a ring." }),
          ],
        },
        {
          n: "3", title: "Forest Song and the Barrow Den.",
          text: `Kayneth Stillwind at Forest Song ${WAY("Ashenvale", 85.2, 44.7, "Kayneth Stillwind, Forest Song")}: ${TURN} <em>Kayneth Stillwind</em> (Shindrell's note from Astranaar), then ${ACC} <em>Forsaken Diseases</em> (2,350; the Forsaken camp at ${WAY("Ashenvale", 75.3, 72.0, "Forsaken camp, the bottle")}) and ${ACC} <em>Insane Druids</em> (3,200; the Barrow Den at about ${WAY("Ashenvale", 75.7, 75.3, "Dor'danil Barrow Den")}). Back at Kayneth: ${TURN} <em>Forsaken Diseases</em> and ${TURN} <em>Insane Druids</em>.`,
          quests: [
            q(4581, "Kayneth Stillwind", 590, 29, 24, AV, [], { note: "From Shindrell in Astranaar." }),
            q(1011, "Forsaken Diseases", 2350, 29, 24, AV, [], { after: [4581], note: "The Forsaken camp (75.3,72.0)." }),
            q(1012, "Insane Druids", 3200, 32, 24, AV, [], { after: [4581], note: "The Barrow Den (about 75.7,75.3)." }),
          ],
        },
        {
          n: "4", title: "Fallen Sky Lake.",
          text: `<em>Fallen Sky Lake</em> (3,050, in the log from block A): the Shadethicket Oracle at ${WAY("Ashenvale", 66.7, 82.2, "Shadethicket Oracle")}; then Pelturas in Astranaar: ${TURN} <em>Fallen Sky Lake</em>.`,
          quests: [
            q(1035, "Fallen Sky Lake", 3050, 30, 20, AV, [], { after: [1034], note: "Taken from Pelturas in block A." }),
          ],
        },
      ],
    },
  ];

  // The ledger's 40 bank quests (key, Wowhead ID and XP as in ../app.js).
  const ledger = [
    { key: "dm-defias", name: "The Defias Brotherhood", xp: 9750, id: 166, group: "Deadmines" },
    { key: "dm-underground", name: "Underground Assault", xp: 5800, id: 2040, group: "Deadmines" },
    { key: "dm-bandanas", name: "Red Silk Bandanas", xp: 4700, id: 214, group: "Deadmines" },
    { key: "dm-destruction", name: "Destruction in Deadmines", xp: 4050, id: 92753, group: "Deadmines" },
    { key: "dm-letter", name: "The Unsent Letter", xp: 3250, id: 373, group: "Deadmines" },
    { key: "dm-brother", name: "Oh Brother…", xp: 1550, id: 167, group: "Deadmines" },
    { key: "dm-memories", name: "Collecting Memories", xp: 1350, id: 168, group: "Deadmines" },
    { key: "rr-morganth", name: "Morganth", xp: 2750, id: 249, group: "Redridge" },
    { key: "rr-fangore", name: "WANTED: Lieutenant Fangore", xp: 2650, id: 180, group: "Redridge" },
    { key: "rr-gath", name: "WANTED: Gath’Ilzogg", xp: 2650, id: 169, group: "Redridge" },
    { key: "rr-garim", name: "WANTED: Incinerator Gar’im", xp: 2550, id: 95999, group: "Redridge" },
    { key: "rr-mia", name: "Missing In Action", xp: 2550, id: 219, group: "Redridge" },
    { key: "rr-tharil", name: "Tharil’zun", xp: 2550, id: 19, group: "Redridge" },
    { key: "rr-shadow", name: "Shadow Magic", xp: 2300, id: 115, group: "Redridge" },
    { key: "rr-bounty", name: "Blackrock Bounty", xp: 2000, id: 128, group: "Redridge" },
    { key: "rr-solomon", name: "Solomon’s Law", xp: 1850, id: 91, group: "Redridge" },
    { key: "dw-spiders", name: "Eight-Legged Menaces", xp: 1250, id: 245, group: "Duskwood" },
    { key: "dw-wolves", name: "Wolves at Our Heels", xp: 1250, id: 226, group: "Duskwood" },
    { key: "dw-kabobs", name: "Seasoned Wolf Kabobs", xp: 2000, id: 90, group: "Duskwood" },
    { key: "dw-grant", name: "Grant’s Shield", xp: 2000, id: 79362, group: "Duskwood" },
    { key: "dw-ira", name: "Ira’s Dagger", xp: 1950, id: 96137, group: "Duskwood" },
    { key: "dw-totem", name: "The Totem of Infliction", xp: 2550, id: 101, group: "Duskwood" },
    { key: "dw-silvia", name: "Silvia’s Sword", xp: 2100, id: 79363, group: "Duskwood" },
    { key: "dw-merrick", name: "Merrick’s Bow", xp: 2300, id: 96138, group: "Duskwood" },
    { key: "dw-watch", name: "The Night Watch — final", xp: 2450, id: 58, group: "Duskwood" },
    { key: "rol-abom", name: "Abominable Creatures", xp: 6200, id: 95250, group: "Ruins of Lordaeron" },
    { key: "rol-insignia", name: "Bloodied Insignia", xp: 9750, id: 95195, group: "Ruins of Lordaeron" },
    { key: "rol-love", name: "Remember That I Love You", xp: 9750, id: 92415, group: "Ruins of Lordaeron" },
    { key: "rol-crest", name: "Crest of Lordaeron", xp: 9750, id: 95189, group: "Ruins of Lordaeron" },
    { key: "wc-hides", name: "Deviate Hides", xp: 4650, id: 1486, group: "Wailing Caverns" },
    { key: "wc-drinks", name: "Smart Drinks", xp: 3900, id: 1491, group: "Wailing Caverns" },
    { key: "wc-docks", name: "Trouble at the Docks", xp: 3900, id: 959, group: "Wailing Caverns" },
    { key: "wc-eradication", name: "Deviate Eradication", xp: 5950, id: 1487, group: "Wailing Caverns" },
    { key: "wc-shard", name: "The Glowing Shard", xp: 7700, id: 6981, group: "Wailing Caverns" },
    { key: "wl-blisters", name: "Blisters on the Land", xp: 2650, id: 275, group: "Wetlands" },
    { key: "wl-ooze", name: "Digging Through the Ooze", xp: 2400, id: 470, group: "Wetlands" },
    { key: "wl-crocs", name: "Crocs of the Sky", xp: 2200, id: 98072, group: "Wetlands" },
    { key: "wl-duties", name: "Apprentice’s Duties", xp: 2100, id: 471, group: "Wetlands" },
    { key: "wl-fire", name: "Fire Taboo", xp: 1850, id: 277, group: "Wetlands" },
    { key: "wl-claws", name: "Claws from the Deep", xp: 1750, id: 279, group: "Wetlands" },
  ];

  window.ROUTE_DATA = {
    version: 1,
    ledgerStorageKey: "friend-warrior-level20-ledger-v1",
    routeStorageKey: "friend-warrior-route-v1",
    // Classic XP needed from the start of level 20 to reach levels 20, 21, …, 30.
    levels: [0, 23200, 48400, 75700, 105100, 136800, 170800, 207200, 246100, 287500, 331800],
    checkpoint: 28.7,
    mainBlocks: ["A", "B", "C"],
    reserveBlocks: ["R1", "R2", "R3"],
    gnomeregan: "G",
    // Ledger prep tasks that mean a route quest was turned in before the cap.
    ledgerTasks: { "prep-valor": [96139], "prep-watch": [56, 57] },
    checkpointText: `Fly to Ironforge after block C. <strong>At 28.7 or higher with a Gnomeregan group forming, go to Gnomeregan</strong> (its quests and kills, about 57,000 XP, finish level 30 from there); below 28.7, do R1 (it ends with a flight to Ironforge), then R2 if still short. If no group clears Gnomeregan, do R1, R2 and R3 in that order.`,
    blocks,
    ledger,
  };
})();
