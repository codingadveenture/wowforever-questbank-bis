/*
 * Baysick Browntwo, level 20–30 leveling route, encoded for route.js.
 * Source: docs/baysick-browntwo-level-20-30-leveling-route.md (1 October 2026), quest levels and XP from
 * Wowhead Forever's zone quest lists read the same day. Dungeon quests use the beta multiples the route
 * states (Blackfathom Deeps 3.75×, the Stockade 3.2×, Gnomeregan 2.6× the listed XP).
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
          text: `Pick up <em>Bazil Thredd</em> from Baros Alexston (after <em>The Unsent Letter</em>) → Warden Thelwater at the Stockade → <em>The Stockade Riots</em>; <em>Quell the Uprising</em> (Thelwater) and <em>The Color of Blood</em> (Nikova Raskol, Old Town) once you are 22, otherwise on the Stockade visit; <em>The Corruption Abroad</em> (Argos Nightwhisper, the park, 21,55); <em>Gyrodrillmatic Excavationators</em> (Shoni, Dwarven District). Then the tram to Ironforge: Gerrig Bonegrip, Forlorn Cavern, <em>Knowledge in the Deeps</em> (10,313 XP, the Lorgalis Manuscript inside BFD).`,
          quests: [],
        },
        {
          n: "2", title: "To Darkshore.",
          text: `A fan site lists a new <strong>Stormwind Harbor ↔ Auberdine ship</strong> in Forever (not yet confirmed in game); if it exists, tram back and sail. Otherwise stay on the Ironforge side: walk north-east through Loch Modan into the Wetlands to Menethil Harbor (learn the flight path), and take the Menethil ship, which in Forever sails Menethil → Southshore → Auberdine.`,
          quests: [],
        },
        {
          n: "3", title: "Auberdine → Darnassus and back.",
          text: `Gershala Nightwhisper: turn in <em>The Corruption Abroad</em>, take <em>Researching the Corruption</em> (8 Corrupted Brain Stems from the naga and satyrs around the Zoram Strand and the temple entrance). Sentinel Selarin (39.2,43.4): <em>Trek to Ashenvale</em> (365). Ship or flight to Rut'theran, then Darnassus: Dawnwatcher Shaedlass, <em>In Search of Thaelrid</em>; Argent Guard Manados, <em>Twilight Falls</em>. Fly back to Auberdine.`,
          quests: [],
        },
        {
          n: "4", title: "South on the road into Ashenvale.",
          text: `Maestra's Post, Orendil Broadleaf (26.4,38.6): <em>Bathran's Hair</em> (780): 5 half-buried brown sacks at Bathran's Haven (29.5–33.0, 21.4–24.3), then <em>Orendil's Cure</em> (1,950, a delivery). If the Darkshore <em>Tower of Althalaxx</em> chain is at the "go to Delgren" step, Delgren (26.2,38.7) continues it: a Glowing Soul Gem from the Dark Strand at Ordil'Aran (31.3,30.7; a very low drop, do not farm it), then Ilkrud's tome at Fire Scar Shrine (25.3,60.7).`,
          quests: [
            q(1010, "Bathran's Hair", 780, 20, 20, AV, ["core"], { note: "Five brown sacks at Bathran's Haven; check this first reward against the listed 780." }),
            q(970, "The Tower of Althalaxx (Soul Gem)", 1650, 21, 13, AV, ["extra"], { after: [967], note: "Only if the Darkshore chain is at the Delgren step; the gem is a very low drop." }),
            q(973, "The Tower of Althalaxx (Ilkrud)", 1950, 24, 13, AV, ["extra"], { after: [970], note: "Ilkrud's tome at Fire Scar Shrine (25.3,60.7)." }),
          ],
        },
        {
          n: "5", title: "Astranaar.",
          text: `Flight path from Daelyshia (34.4,48.0). Shindrell Swiftfire (34.7,48.8): <em>The Zoram Strand</em> (20 Wrathtail Heads, 1,450). Raene Wolfrunner (36.6,49.6): <em>Trek to Ashenvale</em>, <em>Raene's Cleansing</em> (1,450), <em>Culling the Threat</em> (2,000; Dal Bloodclaw patrols Thistlefur Village, 36–40, 32–37). Pelturas Whitemoon (37.4,51.8): <em>Orendil's Cure</em>, then <em>Elune's Tear</em> (1,750).`,
          quests: [
            q(990, "Trek to Ashenvale", 365, 19, 15, AV, ["core"], { note: "Hand in at Raene Wolfrunner." }),
            q(1020, "Orendil's Cure", 1950, 20, 20, AV, ["core"], { after: [1010], note: "Delivery to Pelturas Whitemoon." }),
          ],
        },
        {
          n: "6", title: "Lake Falathim.",
          text: `Teronis' Corpse (20.3,42.3): turn in <em>Raene's Cleansing</em>, take the gem step (1,250): a Glowing Gem from the Saltspittle murlocs (19.4–21.0, 41.6–43.8).`,
          quests: [
            q(991, "Raene's Cleansing", 1450, 19, 18, AV, ["core"], { note: "First step, handed in at Teronis' Corpse." }),
          ],
        },
        {
          n: "7", title: "The Zoram Strand.",
          text: `Talen (14.8,31.3): <em>The Ancient Statuette</em> (1,150; it lies at 14.2,20.6), then <em>Ruuzel</em> (2,550; the island at 6.5,13.4, two escorts). Naga along the strand for the heads and brain stems. The dungeon entrance is the sunken temple at the north end (14.2,14.6).`,
          quests: [
            q(1007, "The Ancient Statuette", 1150, 20, 19, AV, ["core"], { note: "The statuette lies at 14.2,20.6." }),
          ],
        },
        {
          n: "Late group", title: "If the group is an hour late: the Stonetalon mini-loop.",
          text: `Through the Talondeep Path (mouth at 42.5,71.7): up to about 4,100 XP and the Stonetalon Peak flight path. Faldreas in Astranaar, <em>Journey to Stonetalon Peak</em> (680); <em>Pridewings of Stonetalon</em> (1,650; Shindrell offers it only once <em>The Zoram Strand</em> is handed in); the new <em>Stonetalon Supply Run</em> (1,950; a dead courier's bundles from the Mirkfallon wyverns, start point unknown).`,
          quests: [
            q(1056, "Journey to Stonetalon Peak", 680, 18, 18, "Stonetalon", ["extra"], { note: "Faldreas in Astranaar." }),
            q(1134, "Pridewings of Stonetalon", 1650, 21, 18, "Stonetalon", ["extra"], { after: [1008], note: "Offered once The Zoram Strand is handed in." }),
            q(86574, "Stonetalon Supply Run", 1950, 24, 20, "Stonetalon", ["extra"], { note: "Forever-new; start point unknown." }),
          ],
        },
        {
          n: "8", title: "Blackfathom Deeps.",
          text: `Thaelrid inside gives <em>Blackfathom Villainy</em> (12,375; Head of Kelris). Loot the Lorgalis Manuscript. Kelris, Lady Sarevess, Old Serra'kis; Aku'mai optional. Twilight Pendants for <em>Twilight Falls</em> (9,563).`,
          quests: [
            dq(1198, "In Search of Thaelrid", 2400, 3.75, 24, 18, BFD, ["core"], { note: "Handed in to Thaelrid inside the dungeon." }),
            run("run-bfd", "Blackfathom Deeps run: kill XP", 7500, BFD, "Estimate for one five-player run."),
          ],
        },
        {
          n: "9", title: "After the run.",
          text: `Talen: <em>Ruuzel</em>. Astranaar: <em>The Zoram Strand</em>, <em>Culling the Threat</em>, the gem step, then the moonwell talk (830). East: Elune's Tear on the Iris Lake island (46.4,46.4); Shael'dryn at the moonwell east of the lake (about 53,46): turn in the talk, take the next <em>Raene's Cleansing</em> (2,200; carry it to R3). Pelturas: <em>Elune's Tear</em> → <em>The Ruins of Stardust</em> (1,850; bushes at 33.3,67.8) → <em>Fallen Sky Lake</em> (3,050; carry it to R3). If still below 23: Silverwind Refuge (49.8,67.2), <em>Elemental Bracers</em> (1,950; Befouled Water Elementals in Mystral Lake) and Raene's <em>An Aggressive Defense</em> (1,950; the Foulweald camps at 50–56, 60–64).`,
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
          text: `Fly Astranaar → Auberdine: <em>Researching the Corruption</em> (Staghide Armguards or Prelacy Cape). Fly Rut'theran, Darnassus: <em>Blackfathom Villainy</em>, <em>Twilight Falls</em> (read the pane). Back to Auberdine: Hollee, <em>Unrequited Love</em> (165, hands in at Menethil); board the ship to Menethil.`,
          quests: [
            dq(1275, "Researching the Corruption", 2400, 3.75, 24, 18, BFD, ["core"], { note: "Gershala Nightwhisper, Auberdine." }),
            dq(1200, "Blackfathom Villainy", 3300, 3.75, 27, 18, BFD, ["core"], { after: [1198], note: "Darnassus; Head of Kelris." }),
            dq(1199, "Twilight Falls", 2550, 3.75, 25, 20, BFD, ["core"], { note: "Argent Guard Manados, Darnassus; read the reward pane." }),
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
          text: `Flight path from Shellei Brondir (9.5,59.7). First Mate Fitzsimmons (10.8,59.6): <em>The Third Fleet</em> (buy a Flagon of Mead at 10.7,60.9, 220) → <em>The Cursed Crew</em> (1,750), and <em>The Greenwarden</em> (830). Sylessa Duskwhisper: <em>Bloom of the Heavens</em> (2,350). Karl Boran (8.3,58.5): <em>Claws from the Deep</em> (1,750). James Halloran (8.6,55.8): <em>Young Crocolisk Skins</em> (1,750; six skins) and <em>Crocs of the Sky</em> (2,200) if offered. Caitlin Grassman: <em>Alchemical Hazards</em> (1,750). Sida (11.7,58.0): <em>Digging Through the Ooze</em> (2,400). Captain Stoutfist, Menethil Keep upstairs (9.9,57.4): <em>War Banners</em> (2,300). Valstag Ironjaw: <em>Spoils of War</em> (1,750; 6 timber and 30 iron salvaged underwater in the harbour, so only if you can manage the breath). Tarrel Rockweaver (11.5,52.1): <em>Unrequited Love</em>, then <em>In Search of the Excavation Team</em> (970 + 485).`,
          quests: [
            q(288, "The Third Fleet", 220, 27, 22, WL, ["core"], { note: "Buy a Flagon of Mead and hand it straight back." }),
            q(98461, "Unrequited Love", 165, 21, 18, WL, ["core"], { note: "From Hollee in Auberdine; hand in at Tarrel Rockweaver." }),
          ],
        },
        {
          n: "2", title: "South shore.",
          text: `The wreck of the <em>Flying Osprey</em> just south of town: Nord'el for <em>Bloom of the Heavens</em>.`,
          quests: [
            q(98208, "Bloom of the Heavens", 2350, 29, 22, WL, ["core"], { note: "Forever-new; Nord'el at the Flying Osprey wreck." }),
          ],
        },
        {
          n: "3", title: "North-west shore.",
          text: `(14.1,41.5 → 16.7,39.7 → 18.8,40.0): 12 Bluegill Murlocs and Gobbler; young crocolisk skins. The cursed wrecks (13.9,30.4): 13 Cursed Sailors, 5 Cursed Marines and First Mate Snellig inside the hull. The hovels and the giant crocolisks here come later (step 8), because their quests only open once <em>Claws</em> and <em>Young Crocolisk Skins</em> are handed in.`,
          quests: [],
        },
        {
          n: "4", title: "Whelgar's Excavation Site (38.2,50.9).",
          text: `Merrin Rockweaver (38.8,52.3): the excavation report. Ormer Ironbraid: <em>Ormer's Revenge</em> (1,950 → 2,200 → 2,950): Mottled Raptors and Screechers west of the dig (24.7,48.6), Scytheclaws and Razormaws around 34.6,48.0, then Sarltooth on the hilltop at 33.3,51.5 (Thrash; climb from 31.5,48.9). Prospector Whelgar (38.8,52.4): <em>Uncovering the Past</em> (2,200; four tablet fragments around 34.3,49.5; Forever lowered its required level from 25 to 22). Howin Kindfeather stands east of the dig; his quests come with the <em>Crocs of the Sky</em> crate in R1.`,
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
          text: `<strong>Dragonmaw camp</strong> (44.8,43.9): 8 War Banners. <strong>Crossroads</strong> (49.9,39.4): Einar Stonegrip, <em>Daily Delivery</em> (830). <strong>Rethiel</strong> (56.4,40.4): <em>The Greenwarden</em> → <em>Tramping Paws</em> (1,250; 25 gnolls, 63.9,62.7 south to 55.7,75.1) → <em>Fire Taboo</em> (1,850; Crude Flint from the gnolls at 44.2,33.9) → <em>Blisters on the Land</em> (2,650; 8 stealthed level 26–27 Fen Creepers along the streams; at 25 or with the group). Red Whelps along the Green Belt east of Rethiel for the 10 Pristine Crimson Scales (<em>Crocs of the Sky</em>). Thelgen Rock spiders in the south-east for the <em>Alchemical Hazards</em> gland; the Excavation Site: Wetlands portal is nearby (about 47.8,56.3) if a group wants it.`,
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
          text: `Turn in at Karl (→ <em>Reclaiming Goods</em>), Halloran (→ <em>Apprentice's Duties</em>, 2,100; <em>Crocs of the Sky</em> → <em>Crimson Crate Delivery</em>, 1,200, which with Howin's two Razormaw quests, 4,700, belongs to R1), Stoutfist (→ <em>Nek'rosh's Gambit</em>, 1,900, finished in R1 at the catapult, 47.3,46.9), Caitlin, Sida, Valstag, Fitzsimmons (→ <em>Lifting the Curse</em>).`,
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
          text: `The three hovels at 13.5,41.5 → 13.5,38.4 → 13.9,34.8 (510 + 510 + 1,000 → <em>Return the Statuette</em>, 1,500). Giant crocolisks at 17.8,26.3 for <em>Apprentice's Duties</em>. Captain Halyndor's ship (15.5,23.5), entered by the broken mast; the key opens the strongbox through the north hull hole (14.4,24.0), a short dive → <em>The Eye of Paleth</em> (1,200). Back in town: Karl → Stoutfist (200) → <em>A Friend of the Family</em> for Stormwind; Halloran; Glorin Steelbrow (10.6,60.5) → <em>Cleansing the Eye</em> (2,450 in the Stormwind Cathedral).`,
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
          text: `Fly Menethil → Ironforge: Gerrig, <em>Knowledge in the Deeps</em>. Tram to Stormwind, where block C starts with <em>Cleansing the Eye</em> at the Cathedral.`,
          quests: [
            dq(971, "Knowledge in the Deeps", 2750, 3.75, 23, 10, BFD, ["core"], { note: "The Lorgalis Manuscript from Blackfathom Deeps; Gerrig Bonegrip, Ironforge." }),
            q(293, "Cleansing the Eye", 2450, 30, 22, WL, ["optional"], { after: [292], note: "Archbishop Benedictus, Stormwind Cathedral (block C, step 1); the route counts it here." }),
          ],
        },
      ],
    },
    {
      id: "C",
      title: "Redridge leftovers, Duskwood, and the Stockade",
      range: "25–28",
      leaveAt: 28.5,
      leaveText: "Leave at 28.5 for Gnomeregan",
      accent: "#9b83d7",
      kill: { open: 19600 },
      intro: `Turn in banked Duskwood quests at Darkshire on arrival and skip them below. Bind the hearthstone in Darkshire for this block (Tavernkeep Smitts, 73.8,44.5); a western trip can then end with a hearth whenever the stone is ready (the cooldown is an hour, so about every other trip). Run the Stockade whenever the group forms after the Darkshire pickup round; Bazil Thredd is 29. The Duskwood figure assumes <em>The Valor Family</em> and <em>Night Watch</em> 1–2 are still open; if you turned them in before the cap, they show as done.`,
      steps: [
        {
          n: "1", title: "Stormwind.",
          text: `Archbishop Benedictus, Cathedral of Light: <em>Cleansing the Eye</em>; Highlord Bolvar Fordragon in the Keep, then Lord Grayson Shadowbreaker in the Cathedral: <em>A Friend of the Family</em>. Billibub Cogspinner, Dwarven District (55.3,7.1): a Bronze Tube for <em>Look to the Stars</em> (4,500 XP over three steps; Herble in Darkshire also sells them, with limited stock). Fly to Lakeshire.`,
          quests: [],
        },
        {
          n: "2", title: "Lakeshire.",
          text: `Martie Jainrose (21.9,46.3): <em>An Unwelcome Guest</em> (1,950; Bellygrub, 15.7,49.4). Verner Osgood (31.0,47.3): <em>Howling in the Hills</em> (2,000; Yowler, 27.6,21.4; needs <em>A Baying of Gnolls</em> done). Guard Berton (26.3,46.6): <em>What Comes Around…</em> if not held. At 25 or below, Foreman Oslow's <em>The Everstill Bridge</em> (1,550) and Dockmaster Baren's <em>Murloc Poachers</em> and <em>Selling Fish</em> (2,800) still pay full. Fly Lakeshire → Darkshire.`,
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
          text: `Sirra Von'Indi (72.6,47.6): <em>The Valor Family</em> (1,750; the Raven Hill Tome) if not done. Councilman Millstipe (71.9,47.8): <strong>Crime and Punishment</strong> (6,720 observed). Commander Althea Ebonlocke (73.6,46.8): <em>The Night Watch</em> 1 (1,450) and 2 (2,100) if not done. Madame Eva (75.7,45.3): <em>The Totem of Infliction</em> (2,550) if not held; <em>The Legend of Stalvan</em> (see the extras). Chef Grual (73.9,43.5): <em>Seasoned Wolf Kabobs</em> (2,000) if not held. Elaine Carevin (75.3,48.6): <em>Deliveries to Sven</em> (920), <em>The Hermit</em> (1,000). Viktori Prism'Antras (79.8,47.9): <em>Look to the Stars</em> (2,000).`,
          quests: [
            q(174, "Look to the Stars (Bronze Tube)", 2000, 25, 20, DW, ["core"], { note: "Viktori Prism'Antras, with the Bronze Tube." }),
          ],
        },
        {
          n: "4", title: "Tranquil Gardens Cemetery.",
          text: `Blind Mary (82.0,59.0): <em>Look to the Stars</em> 2 → 3 (1,000; the Insane Ghoul at the chapel, 80.9,71.8, 1,500). <em>The Night Watch</em> 1: 8 Skeletal Warriors and 6 Skeletal Mages (79.3,70.3). Skeleton Fingers for the Totem.`,
          quests: [
            q(175, "Look to the Stars (Blind Mary)", 1000, 25, 20, DW, ["core"], { after: [174], note: "Blind Mary (82.0,59.0)." }),
            q(177, "Look to the Stars (Insane Ghoul)", 1500, 25, 20, DW, ["core"], { after: [175], note: "The Insane Ghoul at the chapel (80.9,71.8)." }),
            q(56, "The Night Watch (1)", 1450, 24, 18, DW, ["core"], { note: "Skeletal Warriors and Mages (79.3,70.3)." }),
          ],
        },
        {
          n: "5", title: "Western trips (three of them).",
          text: `Hearth back when the stone is ready, otherwise the road east. Sven Yorgen (7.8,34.1), <em>Deliveries to Sven</em> → <em>Sven's Revenge</em> (1,000; the stump at his old farm, 49.9,77.8) → <em>Sven's Camp</em> (1,000) → <em>The Shadowy Figure</em> (510) → Eva, Daltry, Smitts in Darkshire (200 + 200 → <em>Finding the Shadowy Figure</em>, 1,000) → Jitters (18.4,56.5) → <em>Return to Sven</em> (510) → <em>Proving Your Worth</em> (2,300; 15 Skeletal Raiders, 3 Healers, 3 Warders at the crypt, 16.2,38.8) → <em>Seeking Wisdom</em> (590, Bishop Farthing in Stormwind). Abercrombie (28.0,31.5): <em>The Hermit</em> → <em>Supplies from Darkshire</em> (485) → Eva → <em>Ghost Hair Thread</em> (485, Blind Mary) → <em>Return the Comb</em> (195) → <em>Deliver the Thread</em> (1,450) → <em>Zombie Juice</em> (485, Smitts) → <em>Gather Rot Blossoms</em> (970; Raven Hill Cemetery, 21.6,45.1) → <em>Juice Delivery</em> (970, handed in in R2). Raven Hill Cemetery also covers <em>The Night Watch</em> 2 (15 Fiends, 15 Horrors) and the Totem's ghoul fangs; the Valor ghosts drop the items that start <em>Grant's Shield</em>, <em>Ira's Dagger</em>, <em>Merrick's Bow</em> and <em>Silvia's Sword</em> if you have not banked them: the Lost Knight at Raven Hill (24.2,41 and 24.6,32.2) and Tranquil Gardens (79.8,68.4; 81,67.8; 80.6,57.8), the Lost Stalker at 33.2,43.2, 41,21.4, 51,63.2 and 56.4,60.8, the Lost Watcher at 15.4,61, 30.6,60.6, 43,70, 43.2,66.2 and 75.8,23.2, the Lost Defender at 63,70. <em>Grant's Shield</em> then needs Grant's Mace from the Raven Hill Cemetery skeletons.`,
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
          text: `Fly Darkshire → Stormwind. Bishop Farthing (39.3,28.0): <em>Seeking Wisdom</em> → <em>The Doomed Fleet</em> (carry to R1). Run the Stockade; turn in at Warden Thelwater and Nikova Raskol. Hearth to Darkshire: <em>Crime and Punishment</em>. Fly to Lakeshire: <em>What Comes Around…</em>.`,
          quests: [
            q(269, "Seeking Wisdom", 590, 29, 20, DW, ["core"], { after: [323], note: "Bishop Farthing, Stormwind Cathedral." }),
            dq(387, "Quell the Uprising", 2650, 3.2, 26, 22, STOCKS, ["core"], { note: "Warden Thelwater." }),
            dq(388, "The Color of Blood", 2650, 3.2, 26, 22, STOCKS, ["core"], { note: "Nikova Raskol, Old Town." }),
            dq(391, "The Stockade Riots", 2350, 3.2, 29, 16, STOCKS, ["core"], { note: "Bazil Thredd (level 29); Thelwater." }),
            dq(377, "Crime and Punishment", 2100, 3.2, 26, 22, STOCKS, ["core"], { note: "Councilman Millstipe, Darkshire (6,720 observed)." }),
            dq(386, "What Comes Around…", 2000, 3.2, 25, 22, STOCKS, ["core"], { note: "Guard Berton, Lakeshire." }),
            run("run-stocks", "The Stockade run: kill XP", 5400, STOCKS, "Estimate for one five-player run."),
          ],
        },
        {
          n: "Extras", title: "Extras for this block, in order of value.",
          text: `<em>The Legend of Stalvan</em> (9,140 XP over twelve talk-and-fetch steps from Madame Eva through Moonbrook, Goldshire, Stormwind and the Eastvale Logging Camp; it fits the Stockade trip; the final kill, 4,100, is a level-35 quest for level 30) · <em>Worgen in the Woods</em> 1 from Calor (75.4,48.0; 1,150, Shadow Weavers at 60.8,29.7; listed under R2) · the Jitters food chain (2,340 at 26 or below). The route's block C total counts the twelve Stalvan steps.`,
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
      range: "28.5+ → 30",
      leaveAt: null,
      leaveText: "The finish",
      accent: "#d5aa52",
      kill: { open: 0 },
      intro: `About 50,500 quest XP plus a long dungeon's kills. No beta group has recorded a clear; the bosses run from 26 to 34.`,
      steps: [
        {
          n: "1", title: "Ironforge.",
          text: `Fly to Ironforge, bind the hearthstone there, and collect the Tinker Town quests: <em>Save Techbot's Brain!</em> (Tinkmaster Overspark), <em>The Day After</em> (Gnoarn) → <em>Gnogaine</em> and <em>The Only Cure is More Green Glow</em> (Ozzie Togglevolt, Kharanos), <em>Essential Artificials</em> (Klockmort Spannerspan, from 24), <em>Data Rescue</em> (Master Mechanic Castpipe, from 25), <em>The Grand Betrayal</em> (High Tinker Mekkatorque, from 25), with <em>Gyrodrillmatic Excavationators</em> already held. Skip <em>A Fine Mess</em> (Booty Bay turn-in).`,
          quests: [
            dq(2927, "The Day After", 220, 2.6, 27, 20, GNOMER, ["core"], { note: "Gnoarn → Ozzie Togglevolt, Kharanos." }),
          ],
        },
        {
          n: "2", title: "Gnomeregan.",
          text: `The run and the hand-ins in Tinker Town and Kharanos.`,
          quests: [
            dq(2922, "Save Techbot's Brain!", 2650, 2.6, 26, 20, GNOMER, ["core"], { note: "Tinkmaster Overspark." }),
            dq(2926, "Gnogaine", 2200, 2.6, 27, 20, GNOMER, ["core"], { after: [2927], note: "Ozzie Togglevolt, Kharanos." }),
            dq(2962, "The Only Cure is More Green Glow", 2450, 2.6, 30, 20, GNOMER, ["core"], { after: [2926], note: "Ozzie; the fallout decays on a timer." }),
            dq(2924, "Essential Artificials", 3050, 2.6, 30, 24, GNOMER, ["core"], { note: "Klockmort Spannerspan, from 24." }),
            dq(2930, "Data Rescue", 3650, 2.6, 30, 25, GNOMER, ["core"], { note: "Master Mechanic Castpipe, from 25." }),
            dq(2929, "The Grand Betrayal", 2750, 2.6, 35, 25, GNOMER, ["core"], { note: "High Tinker Mekkatorque, from 25." }),
            dq(2928, "Gyrodrillmatic Excavationators", 2450, 2.6, 30, 20, GNOMER, ["core"], { note: "Shoni, Stormwind (taken in block A, step 1)." }),
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
          text: `Glorin Steelbrow: <em>The Doomed Fleet</em> (1,200) → <em>Lightforge Iron</em> (590) → <em>The Lost Ingots</em> (1,750; murlocs at 10.1,69.5, poor drop) → <em>Blessed Arm</em> (1,200, paid in Stormwind on the next visit). Harlo Barnaby (10.9,55.9): <em>Fall of Dun Modr</em> (1,000; Longbraid at Dun Modr).`,
          quests: [
            q(270, "The Doomed Fleet", 1200, 29, 20, WL, [], { after: [269], note: "From Bishop Farthing (block C); Glorin Steelbrow." }),
            q(321, "Lightforge Iron", 590, 29, 20, WL, [], { after: [270] }),
            q(324, "The Lost Ingots", 1750, 29, 20, WL, [], { after: [321], note: "Murlocs at 10.1,69.5; poor drop." }),
            q(322, "Blessed Arm", 1200, 29, 20, WL, [], { after: [324], note: "Paid in Stormwind on the next visit." }),
          ],
        },
        {
          n: "2", title: "On the road east.",
          text: `<em>Crimson Crate Delivery</em> to Howin Kindfeather east of Whelgar's, then his <em>Razormaw Needling</em> and <em>Trying Times</em> (2,350 each; Razormaw raptors at Raptor Ridge in the north-east and Saltspray Glen in the north-west); the catapult at 47.3,46.9 for <em>Nek'rosh's Gambit</em>; anything block B left (<em>Apprentice's Duties</em>, the <em>Cursed Crew</em> chain, <em>Blisters on the Land</em>).`,
          quests: [
            q(98240, "Crimson Crate Delivery", 1200, 29, 19, WL, [], { after: [98072], note: "After Crocs of the Sky; Howin Kindfeather east of Whelgar's." }),
            q(98245, "Razormaw Needling", 2350, 29, 21, WL, [], { after: [98240], note: "Razormaw raptors at Raptor Ridge and Saltspray Glen." }),
            q(98246, "Trying Times", 2350, 29, 21, WL, [], { after: [98240] }),
            q(465, "Nek'rosh's Gambit", 1900, 31, 23, WL, [], { after: [464], note: "The catapult at 47.3,46.9." }),
          ],
        },
        {
          n: "3", title: "Dun Modr (49.9,18.3) at level 28.",
          text: `Longbraid: <em>Fall of Dun Modr</em>. Rhag Garmason, <em>The Thandol Span</em> (2,500 × 3; the first step is group-flagged: Ol' Rustlocke's body is down in the span at 51.2,8.0 among the Dark Irons, so bring the group or fight through; then the report, and the explosives on the Arathi side at Arathi 48.7,87.9 up the ramp at 52.5,90.4) → <em>Plea To The Alliance</em> (1,250). <strong>Group extras</strong> here: Motley Garmason's <em>The Dark Iron War</em> (2,450; in Classic it gates <em>The Fury Runs Deep</em>, the Stockade's Kam Deepfury quest, probably about 8,500 in the beta, which would need a second Stockade run), Longbraid's <em>A Grim Task</em> (3,350; Balgaras at 46.8,16.0 or 61.8,31.0), <em>Defeat Nek'rosh</em> (2,550), Stoutfist's <em>Forced Disarmament</em> (3,050).`,
          quests: [
            q(472, "Fall of Dun Modr", 1000, 25, 25, WL, [], { note: "Harlo Barnaby → Longbraid." }),
            q(631, "The Thandol Span (Ol' Rustlocke)", 2500, 31, 28, WL, ["group"], { note: "Group-flagged: down in the span among the Dark Irons." }),
            q(632, "The Thandol Span (report)", 2500, 31, 28, WL, [], { after: [631] }),
            q(633, "The Thandol Span (explosives)", 2500, 31, 28, "Arathi Highlands", [], { after: [632], note: "Arathi side, 48.7,87.9 up the ramp at 52.5,90.4." }),
            q(303, "The Dark Iron War", 2450, 30, 25, WL, ["extra", "group"], { note: "Motley Garmason; Classic gate for The Fury Runs Deep." }),
            q(304, "A Grim Task", 3350, 34, 26, WL, ["extra", "group"], { note: "Balgaras at 46.8,16.0 or 61.8,31.0." }),
            q(474, "Defeat Nek'rosh", 2550, 32, 23, WL, ["extra", "group"], { after: [465] }),
            q(98293, "Forced Disarmament", 3050, 30, 22, WL, ["extra", "group"], { note: "Forever-new; Captain Stoutfist." }),
            dq(378, "The Fury Runs Deep", 2750, 3.2, 27, 22, STOCKS, ["extra", "group"], { after: [303], note: "Kam Deepfury: a second Stockade run. The route guesses about 8,500." }),
          ],
        },
        {
          n: "4", title: "Tail.",
          text: `Foggy MacKreel (Arathi 43.3,92.6), <em>MacKreel's Moonshine</em> (3,050, 15-minute timer, take it last) → Refuge Pointe (Captain Nials, 45.9,47.5; flight path 45.8,46.1) → Southshore inn (Brewmeister Bilger, 52.2,58.6; flight path 49.3,52.3) → hearth to Menethil for the last turn-ins (Sida, Halloran, Stoutfist) and fly Menethil → Ironforge. Still short? Lieutenant Farren Orinelle's Southshore chain (10,060 over six quests; murlocs at 44.0,67.6 and 42.3,68.3, naga at 57.1,67.4; the last 3,200 pays in Stormwind Keep).`,
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
          text: `<em>Worgen in the Woods</em> 1–4 (1,150 + 1,750 + 1,900 + 3,150; Shadow Weavers 60.8,29.7, Dark Runners 64.7,49.7, Vile Fangs and Tainted Ones in the Rotting Orchard 73,75, then Jonathan Carevin).`,
          quests: [
            q(173, "Worgen in the Woods (1)", 1150, 28, 23, DW, [], { note: "Shadow Weavers (60.8,29.7)." }),
            q(221, "Worgen in the Woods (2)", 1750, 29, 23, DW, [], { after: [173], note: "Dark Runners (64.7,49.7)." }),
            q(222, "Worgen in the Woods (3)", 1900, 31, 23, DW, [], { after: [221], note: "Rotting Orchard (73,75)." }),
            q(223, "Worgen in the Woods (4)", 3150, 31, 23, DW, [], { after: [222], note: "Jonathan Carevin." }),
          ],
        },
        {
          n: "2", title: "Abercrombie.",
          text: `<em>Juice Delivery</em> → <em>Ghoulish Effigy</em> (1,650; 7 Ghoul Ribs) → <em>Ogre Thieves</em> (1,200; the crate by the Vul'Gol cave, 33.5,76.3) → <em>Note to the Mayor</em> (610) → Ello → Sirra → Ello (245 + 1,850 + 245).`,
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
          text: `<em>The Night Watch</em> 3 (2,450; 20 Plague Spreaders in the eastern Raven Hill mausoleum, 23.6,35.0) if not banked.`,
          quests: [
            q(58, "The Night Watch (3)", 2450, 30, 18, DW, [], { after: [56, 57], ledger: "dw-watch", note: "20 Plague Spreaders (23.6,35.0)." }),
          ],
        },
        {
          n: "4", title: "Extras.",
          text: `<em>Look to the Stars</em> 4 (2,450; Zzarc' Vul, level 33, deep in the southern ogre mound, 36.8,83.8). Group extras: <em>Bride of the Embalmer</em> (3,650; Eliza at 28.8,30.9, a level-31 elite with three guards) and, at 30 with the Wetlands ingots done, <em>Morbent Fel</em> (3,850).`,
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
          text: `<em>Vile Satyr! Dryads in Danger!</em> → <em>The Branch of Cenarius</em> (5,100; Anilia in Xavian at 78.3,44.8, Geltharis at 78.0,42.4); <em>The Howling Vale</em> (2,450; the Tome of Mel'Thandris, about 50.4,39).`,
          quests: [
            q(1021, "Vile Satyr! Dryads in Danger!", 2550, 32, 26, AV, [], { note: "Anilia in Xavian (78.3,44.8)." }),
            q(1031, "The Branch of Cenarius", 2550, 32, 26, AV, [], { after: [1021], note: "Geltharis (78.0,42.4)." }),
            q(1022, "The Howling Vale", 2450, 30, 25, AV, [], { note: "The Tome of Mel'Thandris (about 50.4,39)." }),
          ],
        },
        {
          n: "2", title: "The rod chain of Raene's Cleansing.",
          text: `13,860 over eight steps: Wooden Key and Iron Shaft near the Felwood road, Iron Pommel from the slimes near the Dor'danil Barrow Den at about 76,76, the hidden shrine, Krolg south-east of Mystral Lake, 4 Bloodtooth Guards and Ran Bloodtooth's Skull.`,
          quests: [
            q(1026, "Raene's Cleansing (rod 1)", 2200, 27, 18, AV, [], { after: [1024], note: "Taken at the moonwell in block A." }),
            q(1027, "Raene's Cleansing (rod 2)", 2300, 28, 18, AV, [], { after: [1026] }),
            q(1028, "Raene's Cleansing (rod 3)", 1700, 28, 18, AV, [], { after: [1027] }),
            q(1029, "Raene's Cleansing (rod 4)", 230, 28, 18, AV, [], { after: [1028] }),
            q(1030, "Raene's Cleansing (rod 5)", 1700, 28, 18, AV, [], { after: [1029] }),
            q(1055, "Raene's Cleansing (rod 6)", 230, 28, 18, AV, [], { after: [1030] }),
            q(1045, "Raene's Cleansing (rod 7)", 2450, 30, 18, AV, [], { after: [1055], note: "Bloodtooth Guards and Ran Bloodtooth's Skull." }),
            q(1046, "Raene's Cleansing (rod 8)", 3050, 30, 18, AV, [], { after: [1045], note: "Glacial Stone or Gutterblade plus a ring." }),
          ],
        },
        {
          n: "3", title: "Forest Song and the Barrow Den.",
          text: `Kayneth at Forest Song (85.2,44.7), <em>Forsaken Diseases</em> (2,350; the Forsaken camp at 75.3,72.0) and <em>Insane Druids</em> (3,200; the Barrow Den at about 75.7,75.3).`,
          quests: [
            q(4581, "Kayneth Stillwind", 590, 29, 24, AV, [], { note: "From Shindrell in Astranaar." }),
            q(1011, "Forsaken Diseases", 2350, 29, 24, AV, [], { after: [4581], note: "The Forsaken camp (75.3,72.0)." }),
            q(1012, "Insane Druids", 3200, 32, 24, AV, [], { after: [4581], note: "The Barrow Den (about 75.7,75.3)." }),
          ],
        },
        {
          n: "4", title: "Fallen Sky Lake.",
          text: `<em>Fallen Sky Lake</em> (3,050; the Shadethicket Oracle at 66.7,82.2).`,
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
    checkpoint: 28.5,
    mainBlocks: ["A", "B", "C"],
    reserveBlocks: ["R1", "R2", "R3"],
    gnomeregan: "G",
    // Ledger prep tasks that mean a route quest was turned in before the cap.
    ledgerTasks: { "prep-valor": [96139], "prep-watch": [56, 57] },
    checkpointText: `Fly to Ironforge after block C. <strong>At 28.5 or higher with a Gnomeregan group forming, go to Gnomeregan</strong> (its quests are worth more than level 29→30); below 28.5, do R1 (it ends with a flight to Ironforge), then R2 if still short. If no group clears Gnomeregan, do R1, R2 and R3 in that order.`,
    blocks,
    ledger,
  };
})();
