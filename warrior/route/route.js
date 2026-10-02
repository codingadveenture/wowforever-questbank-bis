/*
 * Live leveling plan for Baysick Browntwo, levels 20–30.
 * Reads the level-20 ledger's saved ticks (same origin), turns the held quests into a starting XP, and
 * simulates the written route block by block. No network calls, no build step.
 * Adapted from RestedXP Guides, https://github.com/RestedXP/RXPGuides, CC BY-NC-SA 4.0.
 * This file is licensed CC BY-NC-SA 4.0.
 */
(() => {
  "use strict";

  const D = window.ROUTE_DATA;
  if (!D) return;

  const LEDGER_KEY = D.ledgerStorageKey;           // "friend-warrior-level20-ledger-v1"
  const ROUTE_KEY = D.routeStorageKey;             // "friend-warrior-route-v1"
  const LEDGER_STATES = ["todo", "ready", "turned", "skip"];
  const HELD = "ready";    // ledger: objectives complete, quest held in the journal (the bank)
  const TURNED = "turned"; // ledger: already turned in
  const ROUTE_STATES = ["done", "skip", "plan"];
  const SCOPES = ["auto", "full", "trim", "short"];
  const T = D.levels;
  const CAP = T[T.length - 1];
  const WH = "https://www.wowhead.com/forever";

  const TAG_LABELS = { core: "core", optional: "optional", group: "group", dungeon: "dungeon", conditional: "if behind", extra: "extra" };
  const STATUS_LABELS = {
    banked: "banked", prior: "done before the cap", done: "done", skip: "skipped",
    scope: "dropped", condoff: "not needed: ahead", off: "not planned", plan: "",
  };

  // ---------- data indexes ----------
  const blockById = Object.fromEntries(D.blocks.map(block => [block.id, block]));
  const items = [];
  for (const block of D.blocks) {
    block.items = [];
    for (const step of block.steps) {
      for (const item of step.quests) {
        item.block = block.id;
        item.stepN = step.n;
        item.key = String(item.id);
        item.isDungeon = item.tags.includes("dungeon");
        block.items.push(item);
        items.push(item);
      }
    }
    // Open-world kill XP scales with the share of the block's counted quest XP still planned.
    block.kill.base = block.items
      .filter(item => !item.kill && !item.isDungeon && !item.tags.includes("extra"))
      .reduce((sum, item) => sum + item.xp, 0);
  }
  const itemByKey = new Map(items.map(item => [item.key, item]));
  const ledgerByKey = new Map(D.ledger.map(entry => [entry.key, entry]));
  // The ledger's Duskwood and Wetlands bank quests that also appear on this route (15).
  const routeLedger = D.ledger.filter(entry => items.some(item => item.ledgerKey === entry.key));

  // ---------- helpers ----------
  const fmt = value => Math.round(value).toLocaleString("en-US");
  const esc = text => String(text).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const round1 = value => Math.round(value * 10) / 10;
  const quests = n => `${n} ${n === 1 ? "quest" : "quests"}`;

  function levelAt(xp) {
    if (xp >= CAP) return 30;
    if (xp <= 0) return 20;
    let i = 0;
    while (i < T.length - 2 && xp >= T[i + 1]) i++;
    return 20 + i + (xp - T[i]) / (T[i + 1] - T[i]);
  }
  const charLevel = xp => Math.min(30, Math.floor(levelAt(xp)));
  // The level as displayed (one decimal); never shows 30 before 30 is reached.
  function shownLevel(xp) { return xp >= CAP ? 30 : Math.min(29.9, round1(levelAt(xp))); }
  function fmtLevel(xp) { const value = shownLevel(xp); return value >= 30 ? "30" : value.toFixed(1); }
  // Forever's low-level rule: 100% up to five levels above the quest, 80% at six, 60% at seven, 50% from eight.
  function payFactor(playerLevel, questLevel) {
    const diff = playerLevel - questLevel;
    return diff <= 5 ? 1 : diff === 6 ? 0.8 : diff === 7 ? 0.6 : 0.5;
  }
  function xpForLevel(level, pct) {
    if (level >= 30) return CAP;
    const i = level - 20;
    return T[i] + (T[i + 1] - T[i]) * pct / 100;
  }
  const clampPct = value => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(99.9, Math.max(0, n)) : 0;
  };

  // ---------- ledger ----------
  // Same parser for the ledger's localStorage value, its exported JSON file, and pasted JSON.
  function parseLedger(candidate) {
    if (!candidate || typeof candidate !== "object") return null;
    const src = candidate.state && typeof candidate.state === "object" ? candidate.state : candidate;
    if (!src.quests || typeof src.quests !== "object") return null;
    const quests = {};
    for (const entry of D.ledger) {
      const value = src.quests[entry.key];
      if (LEDGER_STATES.includes(value)) quests[entry.key] = value;
    }
    const tasks = {};
    for (const task of Object.keys(D.ledgerTasks)) {
      if (src.tasks && typeof src.tasks[task] === "boolean") tasks[task] = src.tasks[task];
    }
    const exportedAt = typeof candidate.exportedAt === "string" ? candidate.exportedAt.slice(0, 40) : null;
    return { quests, tasks, exportedAt };
  }

  function readBrowserLedger() {
    try {
      const raw = localStorage.getItem(LEDGER_KEY);
      return raw ? parseLedger(JSON.parse(raw)) : null;
    } catch (_) {
      return null;
    }
  }

  // ---------- step checklists ----------
  // A step's text is one paragraph in the data; the page shows it as one line per sentence, each with a
  // checkbox. Sentences are split at a full stop outside tags, chips, code and parentheses.
  function splitStep(html) {
    const lines = [];
    let start = 0, depth = 0, inTag = false, shield = 0;
    for (let i = 0; i < html.length; i++) {
      const ch = html[i];
      if (inTag) { if (ch === ">") inTag = false; continue; }
      if (ch === "<") {
        inTag = true;
        if (/^<(button|code)/.test(html.slice(i, i + 8))) shield++;
        else if (/^<\/(button|code)>/.test(html.slice(i, i + 10))) shield = Math.max(0, shield - 1);
        continue;
      }
      if (shield) continue;
      if (ch === "(") depth++;
      else if (ch === ")") depth = Math.max(0, depth - 1);
      else if (ch === "." && depth === 0) {
        const rest = html.slice(i + 1);
        const gap = rest.match(/^\s+/);
        if (!gap) continue;
        const next = rest[gap[0].length];
        if (next === undefined || /[a-z]/.test(next)) continue;
        lines.push(html.slice(start, i + 1).trim());
        start = i + 1 + gap[0].length;
      }
    }
    const tail = html.slice(start).trim();
    if (tail) lines.push(tail);
    return lines;
  }
  function hashText(text) {
    let hash = 5381;
    for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
    return hash.toString(36);
  }
  const checkKeys = new Set();
  for (const block of D.blocks) {
    for (const step of block.steps) {
      step.lines = splitStep(step.text).map(html => {
        const key = `${block.id}|${step.n}|${hashText(html.replace(/<[^>]+>/g, ""))}`;
        checkKeys.add(key);
        return { key, html };
      });
    }
  }

  // ---------- route state ----------
  const defaultState = () => ({ quests: {}, checks: {}, gnomeregan: true, scope: "auto", bankXp: null, override: null, bankTicks: {}, ledgerImport: null });

  function sanitizeState(candidate) {
    const clean = defaultState();
    if (!candidate || typeof candidate !== "object") return clean;
    if (candidate.quests && typeof candidate.quests === "object") {
      for (const [key, value] of Object.entries(candidate.quests)) {
        if (itemByKey.has(key) && ROUTE_STATES.includes(value)) clean.quests[key] = value;
      }
    }
    if (candidate.checks && typeof candidate.checks === "object") {
      for (const [key, value] of Object.entries(candidate.checks)) {
        if (value === true && checkKeys.has(key)) clean.checks[key] = true;
      }
    }
    if (typeof candidate.gnomeregan === "boolean") clean.gnomeregan = candidate.gnomeregan;
    if (SCOPES.includes(candidate.scope)) clean.scope = candidate.scope;
    if (Number.isFinite(candidate.bankXp) && candidate.bankXp >= 0) clean.bankXp = Math.round(candidate.bankXp);
    const override = candidate.override;
    if (override && Number.isInteger(override.level) && override.level >= 20 && override.level <= 30) {
      clean.override = { level: override.level, pct: override.level >= 30 ? 0 : clampPct(override.pct) };
    }
    if (candidate.bankTicks && typeof candidate.bankTicks === "object") {
      for (const entry of routeLedger) {
        if (typeof candidate.bankTicks[entry.key] === "boolean") clean.bankTicks[entry.key] = candidate.bankTicks[entry.key];
      }
    }
    if (candidate.ledgerImport) clean.ledgerImport = parseLedger(candidate.ledgerImport);
    return clean;
  }

  function loadState() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(ROUTE_KEY)));
    } catch (_) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try { localStorage.setItem(ROUTE_KEY, JSON.stringify(state)); } catch (_) { /* storage blocked: keep working in memory */ }
  }

  // ---------- bank ----------
  function ledgerSource() {
    if (state.ledgerImport) return { from: "import", data: state.ledgerImport };
    const browser = readBrowserLedger();
    return browser ? { from: "browser", data: browser } : { from: "none", data: null };
  }

  function bankContext() {
    const src = ledgerSource();
    const ledger = src.data;
    const held = new Set();
    const turned = new Set();
    if (ledger) {
      for (const [key, value] of Object.entries(ledger.quests)) {
        if (value === HELD) held.add(key);
        else if (value === TURNED) turned.add(key);
      }
    }
    const ledgerHeld = new Set(held);
    for (const [key, value] of Object.entries(state.bankTicks)) {
      if (value) { held.add(key); turned.delete(key); } else held.delete(key);
    }
    const ledgerXp = [...held].reduce((sum, key) => sum + (ledgerByKey.get(key)?.xp || 0), 0);
    const bankedXp = state.bankXp != null ? state.bankXp : ledgerXp;

    const banked = new Set();
    const prior = new Set();
    const markPrior = id => {
      const item = itemByKey.get(String(id));
      if (!item || prior.has(item.key)) return;
      prior.add(item.key);
      item.after.forEach(markPrior);
    };
    for (const item of items) {
      if (!item.ledgerKey) continue;
      if (held.has(item.ledgerKey)) { banked.add(item.key); item.after.forEach(markPrior); }
      else if (turned.has(item.ledgerKey)) markPrior(item.id);
    }
    if (ledger) {
      for (const [task, ids] of Object.entries(D.ledgerTasks)) if (ledger.tasks[task]) ids.forEach(markPrior);
    }
    for (const key of banked) prior.delete(key);
    return { src, held, ledgerHeld, ledgerXp, bankedXp, banked, prior };
  }

  function effectiveScope(bankedXp) {
    if (state.scope !== "auto") return state.scope;
    return bankedXp >= 106000 ? "short" : bankedXp >= 80000 ? "trim" : "full";
  }

  function scopeDrops(item, scope) {
    if (item.kill || item.isDungeon || item.tags.includes("conditional") || item.tags.includes("extra")) return false;
    if (!D.mainBlocks.includes(item.block)) return false;
    if (scope === "trim") return item.tags.includes("optional") && (item.block === "B" || item.block === "C");
    if (scope === "short") return !item.tags.includes("core");
    return false;
  }

  function baseStatus(item, ctx) {
    if (ctx.bank.banked.has(item.key)) return "banked";
    const explicit = state.quests[item.key];
    if (explicit) return explicit;
    if (ctx.bank.prior.has(item.key)) return "prior";
    if (item.tags.includes("extra")) return "off";
    if (scopeDrops(item, ctx.scope)) return "scope";
    if (item.tags.includes("conditional")) return "cond";
    return "plan";
  }

  const hasDone = (blockId, ctx) => blockById[blockId].items.some(item => state.quests[item.key] === "done" && !ctx.bank.banked.has(item.key));

  // ---------- simulation ----------
  function runBlock(block, startXp, statuses, useCond, ctx) {
    let xp = startXp;
    let quest = 0;
    let kill = 0;
    let earned = 0;
    let hit30 = null;
    const rows = [];
    block.items.forEach((item, index) => {
      let status = statuses[index];
      if (status === "cond") status = useCond ? "plan" : "condoff";
      // Without a level override, quests ticked done are XP already earned on the route.
      const counts = status === "plan" || (status === "done" && ctx.mode === "bank");
      const share = !item.kill && !item.isDungeon && block.kill.base ? block.kill.open * item.xp / block.kill.base : 0;
      if (counts) { xp += share; kill += share; }
      const level = charLevel(xp);
      const factor = item.kill ? 1 : payFactor(level, item.questLevel);
      const gain = Math.round(item.xp * factor);
      if (counts) {
        xp += gain;
        if (item.kill) kill += gain; else quest += gain;
        if (status === "done") earned += gain + share;
        if (!hit30 && xp >= CAP) hit30 = item;
      }
      rows.push({ item, status, counts, factor, gain, level, share, auto: !state.quests[item.key] });
    });
    return { id: block.id, start: startXp, end: xp, quest, kill, earned, rows, hit30 };
  }

  function simBlock(block, startXp, ctx) {
    const statuses = block.items.map(item => baseStatus(item, ctx));
    let useCond = false;
    if (statuses.includes("cond")) {
      // "If still below the leave level": add the conditional quests only when the block ends short without them.
      const trial = runBlock(block, startXp, statuses, false, ctx);
      useCond = block.leaveAt != null && levelAt(trial.end) < block.leaveAt;
    }
    const result = runBlock(block, startXp, statuses, useCond, ctx);
    result.condNeeded = useCond;
    return result;
  }

  function extendPath(xp0, useGnomeregan, ctx) {
    let xp = xp0;
    const order = [];
    const results = {};
    const add = id => {
      const result = simBlock(blockById[id], xp, ctx);
      results[id] = result;
      order.push(id);
      xp = result.end;
    };
    const belowCheckpoint = () => xp < CAP && shownLevel(xp) < D.checkpoint;
    if (useGnomeregan) {
      for (const id of ["R1", "R2"]) if (belowCheckpoint() || hasDone(id, ctx)) add(id);
      if (xp < CAP || hasDone(D.gnomeregan, ctx)) add(D.gnomeregan);
    }
    for (const id of D.reserveBlocks) if (!results[id] && (xp < CAP || hasDone(id, ctx))) add(id);
    return { order, results, end: xp };
  }

  function computePlan(forceMode) {
    const bank = bankContext();
    const scope = effectiveScope(bank.bankedXp);
    const mode = forceMode || (state.override ? "override" : "bank");
    const ctx = { bank, scope, mode };
    const start = mode === "override" ? xpForLevel(state.override.level, state.override.pct) : bank.bankedXp;
    const results = {};
    let xp = start;
    for (const id of D.mainBlocks) {
      const result = simBlock(blockById[id], xp, ctx);
      results[id] = result;
      xp = result.end;
    }
    const afterC = xp;
    const withG = extendPath(afterC, true, ctx);
    const withoutG = extendPath(afterC, false, ctx);
    const chosen = state.gnomeregan ? withG : withoutG;
    const other = state.gnomeregan ? withoutG : withG;
    Object.assign(results, chosen.results);
    const path = [...D.mainBlocks, ...chosen.order];
    for (const block of D.blocks) {
      if (results[block.id]) continue;
      const result = other.results[block.id] || simBlock(block, chosen.end, ctx);
      results[block.id] = { ...result, hypothetical: true };
    }
    const earned = path.reduce((sum, id) => sum + results[id].earned, 0);
    const now = mode === "override" ? start : start + earned;
    let reached = null;
    if (start >= CAP) reached = { block: null, item: null };
    else for (const id of path) if (results[id].hit30) { reached = { block: id, item: results[id].hit30 }; break; }
    return { ctx, bank, scope, mode, start, results, path, afterC, withG, withoutG, chosen, end: chosen.end, now, earned, reached };
  }

  function currentBlock(plan) {
    if (plan.mode === "override") {
      // Locate the override XP on the plan as it would run from the bank.
      const ref = computePlan("bank");
      if (plan.now < ref.start) return { id: null, note: "Your level is below the bank total: cash the bank first." };
      for (const id of ref.path) if (plan.now < ref.results[id].end) return { id };
      return { id: ref.path[ref.path.length - 1] };
    }
    const remaining = id => plan.results[id].rows.some(row => row.status === "plan");
    let last = -1;
    plan.path.forEach((id, index) => { if (hasDone(id, plan.ctx)) last = index; });
    if (last >= 0) {
      if (remaining(plan.path[last])) return { id: plan.path[last] };
      for (let i = last + 1; i < plan.path.length; i++) if (remaining(plan.path[i])) return { id: plan.path[i] };
      return { id: plan.path[last] };
    }
    return { id: plan.path.find(remaining) || plan.path[0] };
  }

  function stepLabel(item) { return /^\d+$/.test(item.stepN) ? `step ${item.stepN}` : item.stepN.toLowerCase(); }
  const reachAt = item => item.kill ? `during the ${item.name.replace(/: kill XP$/, "")}` : `at ${item.name}`;

  function verdict(plan) {
    const checkpoint = D.checkpoint;
    const levelC = shownLevel(plan.afterC);
    const lines = [];
    let headline;
    let short;
    const reachText = () => {
      if (!plan.reached) return `the plan ends at ${fmtLevel(plan.end)}, ${fmt(CAP - plan.end)} XP short of 30`;
      if (!plan.reached.block) return "you are already 30";
      return `30 in block ${plan.reached.block} ${reachAt(plan.reached.item)} (${stepLabel(plan.reached.item)}); about ${fmt(plan.end - CAP)} XP of the plan is spare`;
    };
    const noG = () => {
      const w = plan.withoutG;
      if (plan.afterC >= CAP) return "";
      if (w.end >= CAP) {
        const needed = [];
        let xp = plan.afterC;
        for (const id of w.order) { needed.push(id); xp = w.results[id].end; if (xp >= CAP) break; }
        return `Without Gnomeregan: 30 after ${needed.join(" + ")}.`;
      }
      return `Without Gnomeregan: ${fmtLevel(w.end)} after ${w.order.join(" + ")}, ${fmt(CAP - w.end)} XP short of 30.`;
    };
    if (plan.start >= CAP) {
      headline = "You are level 30.";
      short = "Level 30";
    } else if (plan.afterC >= CAP) {
      headline = `Level 30 before the checkpoint: ${reachText()}.`;
      short = `30 in block ${plan.reached.block}`;
      lines.push("Gnomeregan and the reserve blocks are not needed for XP; run them for gear or for the group.");
    } else if (state.gnomeregan) {
      const order = plan.chosen.order;
      const gIndex = order.indexOf(D.gnomeregan);
      const before = order.slice(0, gIndex);
      const after = order.slice(gIndex + 1);
      const edge = levelC === checkpoint ? " (right at the checkpoint)" : "";
      if (!before.length) {
        headline = `Block C ends at ${levelC.toFixed(1)}${edge}: go to Gnomeregan.`;
        short = `C ${levelC.toFixed(1)} → Gnomeregan`;
      } else {
        headline = `Block C ends at ${levelC.toFixed(1)}, below ${checkpoint}: do ${before.join(", then ")} first, then Gnomeregan.`;
        short = `C ${levelC.toFixed(1)} → ${before.join(" + ")}, then Gnomeregan`;
      }
      lines.push(`Projected: ${reachText()}.`);
      if (after.length) lines.push(`Gnomeregan alone does not finish the climb: add ${after.join(" + ")} after it.`);
      const n = noG();
      if (n) lines.push(n);
      short += plan.reached ? " · 30 ✓" : ` · ends ${fmtLevel(plan.end)}`;
    } else {
      const w = plan.withoutG;
      const needed = [];
      for (const id of w.order) { needed.push(id); if (w.results[id].end >= CAP) break; }
      if (w.end >= CAP) {
        headline = `No Gnomeregan: block C ends at ${levelC.toFixed(1)}; do ${needed.join(", then ")} to reach 30.`;
        short = `No Gnomeregan → ${needed.join(" + ")} · 30 ✓`;
      } else {
        headline = `No Gnomeregan: even R1, R2 and R3 end at ${fmtLevel(w.end)}, ${fmt(CAP - w.end)} XP short of 30.`;
        short = `No Gnomeregan → R1 + R2 + R3 · ends ${fmtLevel(w.end)}`;
      }
      lines.push(`Projected: ${reachText()}.`);
      lines.push("Tick “Gnomeregan available” when a group is forming: its quests and kills (about 57,000 XP) finish level 30 from 28.7.");
    }
    return { headline, short, lines };
  }

  // ---------- rendering (structure once, values on every update) ----------
  function rowHtml(item) {
    const title = typeof item.id === "number"
      ? `<a href="${WH}/quest=${item.id}" target="_blank" rel="noreferrer">${esc(item.name)} ↗</a>`
      : `<strong>${esc(item.name)}</strong>`;
    const sub = item.kill ? `Kill XP estimate · ${esc(item.zone)}` : `Quest level ${item.questLevel} · from ${item.reqLevel} · ${esc(item.zone)}`;
    const tags = item.tags.map(tag => `<span class="tag ${tag}">${TAG_LABELS[tag] || tag}</span>`).join("");
    return `<div class="rq" data-key="${esc(item.key)}">
      <button class="check" type="button" role="checkbox" aria-checked="false" aria-label="Done: ${esc(item.name)}"></button>
      <div class="item-title">${title}
        <div class="item-sub">${sub}</div>
        <div class="tag-line">${tags}<span class="tag status-tag" hidden></span><button class="rq-toggle" type="button"></button></div>
        ${item.note ? `<div class="note">${esc(item.note)}</div>` : ""}
      </div>
      <div class="xp"><span class="xp-main"></span><span class="xp-sub"></span></div>
    </div>`;
  }

  function blockHtml(block) {
    const steps = block.steps.map(step => `
      <li class="step">
        <div class="step-head"><span class="step-n">${esc(step.n)}</span><div class="step-text"><strong class="step-title">${esc(step.title)}</strong>
          <ul class="step-items">${step.lines.map(line => `<li class="step-item" data-check="${esc(line.key)}"><span class="step-check" role="checkbox" tabindex="0" aria-checked="false"></span><span class="step-item-text">${line.html}</span></li>`).join("")}</ul>
        </div></div>
        ${step.quests.length ? `<div class="step-rows">${step.quests.map(rowHtml).join("")}</div>` : ""}
      </li>`).join("");
    const meta = block.leaveAt != null ? `${block.range} · ${block.leaveText.toLowerCase()}` : `${block.range} · ${block.leaveText.toLowerCase()}`;
    return `<article class="zone-card block-card" id="block-${block.id}" data-block="${block.id}">
      <div class="zone-head">
        <div class="zone-title"><span class="zone-dot" style="background:${block.accent};box-shadow:0 0 0 4px ${block.accent}22"></span><h3>${block.id} · ${esc(block.title)}</h3></div>
        <div class="zone-meta">${esc(meta)}</div>
      </div>
      <div class="block-stats" data-stats="${block.id}"></div>
      <p class="block-intro">${block.intro}</p>
      <ol class="steps">${steps}</ol>
      <div class="block-foot">
        <button class="button small" type="button" data-block-done="${block.id}">Tick the rest done</button>
        <button class="button small ghost" type="button" data-block-clear="${block.id}">Clear this block’s ticks</button>
      </div>
    </article>`;
  }

  function checkpointHtml() {
    return `<article class="zone-card checkpoint-card" id="checkpoint">
      <div class="zone-head"><div class="zone-title"><span class="zone-dot"></span><h3>Checkpoint after block C</h3></div><div class="zone-meta">${D.checkpoint} → Gnomeregan</div></div>
      <div class="checkpoint-body">
        <p class="checkpoint-verdict" id="checkpoint-verdict"></p>
        <ul class="checkpoint-lines" id="checkpoint-lines"></ul>
        <p class="checkpoint-rule">${D.checkpointText}</p>
      </div>
    </article>`;
  }

  function renderStructure() {
    const root = document.querySelector("#blocks");
    const html = [];
    for (const block of D.blocks) {
      html.push(blockHtml(block));
      if (block.id === "C") html.push(checkpointHtml());
    }
    root.innerHTML = html.join("");
    document.querySelector("#tick-list").innerHTML = routeLedger.map(entry => `
      <label class="tick">
        <input type="checkbox" data-tick="${entry.key}">
        <span><span class="tick-name">${esc(entry.name)}</span> <span class="tick-meta">${entry.group} · ${fmt(entry.xp)} XP</span> <span class="tick-src" data-tick-src="${entry.key}"></span></span>
      </label>`).join("");
    const levelSelect = document.querySelector("#ov-level");
    levelSelect.innerHTML = `<option value="">Not set</option>` + Array.from({ length: 11 }, (_, i) => 20 + i).map(level => `<option value="${level}">${level}</option>`).join("");
  }

  let lastPlan = null;

  function update() {
    const plan = computePlan();
    lastPlan = plan;
    const here = currentBlock(plan);
    const result = verdict(plan);
    updateSetup(plan, here);
    updateSummary(plan, here, result);
    updateBlocks(plan, here);
    document.querySelector("#checkpoint-verdict").textContent = result.headline;
    document.querySelector("#checkpoint-lines").innerHTML = result.lines.map(line => `<li>${esc(line)}</li>`).join("");
    updateChecks();
  }

  function updateChecks() {
    for (const item of document.querySelectorAll(".step-item")) {
      const done = state.checks[item.dataset.check] === true;
      item.classList.toggle("done", done);
      item.querySelector(".step-check").setAttribute("aria-checked", String(done));
    }
    for (const step of document.querySelectorAll("#blocks .step")) {
      const items = step.querySelectorAll(".step-item");
      step.classList.toggle("all-done", items.length > 0 && [...items].every(item => item.classList.contains("done")));
    }
  }

  function updateSetup(plan, here) {
    const bank = plan.bank;
    const src = bank.src;
    const routeHeld = routeLedger.filter(entry => bank.held.has(entry.key)).length;
    const ledgerCount = [...bank.ledgerHeld].length;
    const ledgerXp = [...bank.ledgerHeld].reduce((sum, key) => sum + (ledgerByKey.get(key)?.xp || 0), 0);
    const parts = [];
    if (src.from === "browser") parts.push(`Ledger read: ${quests(ledgerCount)} banked, ${fmt(ledgerXp)} XP.`);
    else if (src.from === "import") parts.push(`Ledger read from an imported file${src.data.exportedAt ? ` (exported ${src.data.exportedAt.slice(0, 10)})` : ""}: ${quests(ledgerCount)} banked, ${fmt(ledgerXp)} XP.`);
    else parts.push("No ledger found in this browser. Import the ledger’s exported JSON, tick the banked Duskwood and Wetlands quests, or type your banked XP.");
    const tickChanges = Object.keys(state.bankTicks).length;
    if (tickChanges) parts.push(`Your ticks change ${tickChanges} of the Duskwood and Wetlands quests: ${quests(bank.held.size)} banked, ${fmt(bank.ledgerXp)} XP.`);
    if (state.bankXp != null) parts.push(`Using your banked XP: ${fmt(state.bankXp)}.`);
    if (bank.held.size) parts.push(routeHeld ? `On this route, ${quests(routeHeld)} ${routeHeld === 1 ? "is" : "are"} banked and struck through below.` : "None of the banked quests is on this route.");
    if (state.override) parts.push(`Current level set to ${state.override.level}${state.override.level < 30 ? ` + ${state.override.pct}%` : ""}: the plan starts at ${fmt(plan.start)} XP and leaves out quests ticked done.`);
    if (here.note) parts.push(here.note);
    document.querySelector("#ledger-status").textContent = parts.join(" ");
    document.querySelector("#ledger-source").textContent = src.from === "browser" ? "Ledger: this browser" : src.from === "import" ? "Ledger: imported file" : "Ledger: not found";
    document.querySelector("#forget-import").hidden = src.from !== "import";

    const bankInput = document.querySelector("#bank-xp");
    if (document.activeElement !== bankInput) bankInput.value = state.bankXp != null ? String(state.bankXp) : "";
    bankInput.placeholder = `${fmt(bank.ledgerXp)} from the ledger`;
    const levelSelect = document.querySelector("#ov-level");
    const pctInput = document.querySelector("#ov-pct");
    levelSelect.value = state.override ? String(state.override.level) : "";
    if (document.activeElement !== pctInput) pctInput.value = state.override ? String(state.override.pct) : "";
    pctInput.disabled = !state.override || state.override.level >= 30;
    document.querySelector("#scope").value = state.scope;
    const scopeNames = { full: "full passes", trim: "optional B and C quests dropped", short: "Dududu’s shortlists" };
    document.querySelector("#scope-note").textContent = state.scope === "auto"
      ? `Auto picks ${scopeNames[plan.scope]} for ${fmt(bank.bankedXp)} banked XP.`
      : `Using ${scopeNames[plan.scope]}.`;
    document.querySelector("#gnomer").checked = state.gnomeregan;

    let ticked = 0;
    document.querySelectorAll("[data-tick]").forEach(box => {
      const key = box.dataset.tick;
      box.checked = bank.held.has(key);
      if (box.checked) ticked++;
      const srcLabel = document.querySelector(`[data-tick-src="${key}"]`);
      const manual = typeof state.bankTicks[key] === "boolean";
      srcLabel.textContent = manual ? "· your tick" : bank.ledgerHeld.has(key) ? "· ledger" : "";
    });
    document.querySelector("#tick-count").textContent = String(ticked);
  }

  function updateSummary(plan, here, result) {
    document.querySelector("#s-bank").textContent = fmt(plan.bank.bankedXp);
    document.querySelector("#s-bank-detail").textContent = state.bankXp != null ? "typed" : quests(plan.bank.held.size);
    document.querySelector("#s-now").textContent = fmtLevel(plan.now);
    document.querySelector("#s-now-detail").textContent = plan.mode === "override" ? "your level" : plan.earned ? `+${fmt(plan.earned)} ticked` : "after the bank";
    document.querySelector("#s-need").textContent = fmt(Math.max(0, CAP - plan.now));
    document.querySelector("#s-need-detail").textContent = plan.reached ? "plan reaches 30" : `plan ends ${fmtLevel(plan.end)}`;
    const chips = [`<span class="chip start">Start ${fmtLevel(plan.start)}</span>`];
    for (const id of plan.path) {
      const res = plan.results[id];
      const isHere = here.id === id;
      chips.push(`<a class="chip${isHere ? " here" : ""}" href="#block-${id}" title="Projected level at the end of block ${id}">${id} ${fmtLevel(res.end)}</a>`);
    }
    document.querySelector("#s-chips").innerHTML = chips.join("");
    document.querySelector("#s-verdict").textContent = result.short;
  }

  function updateBlocks(plan, here) {
    const hereIndex = plan.path.indexOf(here.id);
    for (const block of D.blocks) {
      const res = plan.results[block.id];
      const card = document.querySelector(`#block-${block.id}`);
      const onPath = plan.path.includes(block.id);
      const isHere = here.id === block.id;
      card.classList.toggle("is-here", isHere);
      card.classList.toggle("off-path", !onPath);
      let role;
      if (onPath) role = `<span class="role in">In the plan</span>`;
      else if (block.id === D.gnomeregan && !state.gnomeregan) role = `<span class="role">Off: no Gnomeregan group</span>`;
      else role = `<span class="role">Not needed now</span>`;
      const range = onPath
        ? `<strong>${fmtLevel(res.start)} → ${fmtLevel(res.end)}</strong>`
        : `<span>If run after the plan: ${fmtLevel(res.start)} → ${fmtLevel(res.end)}</span>`;
      const leave = block.leaveAt != null && onPath && shownLevel(res.end) < block.leaveAt && res.end < CAP
        ? `<span class="warn">below the ${block.leaveAt} target</span>` : "";
      const planned = res.rows.filter(row => row.status === "plan").length;
      const done = res.rows.filter(row => row.status === "done").length;
      const banked = res.rows.filter(row => row.status === "banked").length;
      const counts = [`${planned} planned`];
      if (done) counts.push(`${done} done`);
      if (banked) counts.push(`${banked} banked`);
      const hit = res.hit30 && onPath ? `<span class="good">30 ${esc(reachAt(res.hit30))}</span>` : "";
      const behind = plan.mode === "override" && onPath && hereIndex > plan.path.indexOf(block.id) && planned
        ? `<span class="warn">Behind your level: tick what you did and skip the rest, or the plan counts it again</span>` : "";
      document.querySelector(`[data-stats="${block.id}"]`).innerHTML = `${isHere ? `<span class="here-badge">You are here</span>` : ""}${role}${range}${leave}
        <span>Quests +${fmt(res.quest)}</span><span>Kills +${fmt(res.kill)} (est.)</span><span>${counts.join(" · ")}</span>${hit}${behind}`;
      for (const row of res.rows) updateRow(row, !onPath, plan.scope);
    }
  }

  function updateRow(row, hypothetical, scope) {
    const el = document.querySelector(`.rq[data-key="${CSS.escape(row.item.key)}"]`);
    if (!el) return;
    const { item, status, factor, gain, level } = row;
    el.dataset.status = status;
    el.classList.toggle("hypo", hypothetical);
    const check = el.querySelector(".check");
    const checked = status === "done" || status === "banked" || status === "prior";
    check.setAttribute("aria-checked", String(checked));
    check.textContent = checked ? "✓" : "";
    check.disabled = status === "banked" || status === "prior";
    check.title = status === "banked" ? "Banked: its XP is in your bank total" : status === "prior" ? "Done before the cap" : "Tick when done";

    const tag = el.querySelector(".status-tag");
    let label = STATUS_LABELS[status] || "";
    if (status === "scope") label = scope === "short" ? "dropped: shortlist" : "dropped: trimmed pass";
    if (status === "plan" && item.tags.includes("conditional") && row.auto) label = "needed: behind";
    if (status === "plan" && !row.auto && (item.tags.includes("extra"))) label = "added";
    tag.textContent = label;
    tag.className = `tag status-tag st-${status}`;
    tag.hidden = !label;

    const toggle = el.querySelector(".rq-toggle");
    let action = "";
    if (status === "plan") action = "Skip";
    else if (status === "skip") action = "Undo skip";
    else if (["off", "scope", "condoff", "prior"].includes(status)) action = "Add to plan";
    toggle.textContent = action;
    toggle.hidden = !action;
    toggle.dataset.action = status === "plan" ? "skip" : status === "skip" ? "auto" : "plan";

    const main = el.querySelector(".xp-main");
    const sub = el.querySelector(".xp-sub");
    if (status === "banked") {
      main.textContent = fmt(item.xp);
      sub.textContent = "in the bank";
    } else if (factor < 1) {
      main.textContent = `${fmt(item.xp)} → ${fmt(gain)}`;
      sub.textContent = `at ${level}`;
    } else {
      main.textContent = fmt(gain);
      sub.textContent = item.kill ? "estimate" : item.mult ? `${item.mult}× ${fmt(item.listedXp)}` : "";
    }
  }

  // ---------- events ----------
  function setQuest(key, value) {
    if (value) state.quests[key] = value; else delete state.quests[key];
    saveState();
    update();
  }

  function rowStatus(key) {
    for (const res of Object.values(lastPlan.results)) {
      const row = res.rows.find(entry => entry.item.key === key);
      if (row) return row.status;
    }
    return "plan";
  }

  function bindBlocks() {
    document.querySelector("#blocks").addEventListener("keydown", event => {
      if ((event.key === " " || event.key === "Enter") && event.target.classList.contains("step-check")) {
        event.preventDefault();
        event.target.click();
      }
    });
    document.querySelector("#blocks").addEventListener("click", event => {
      const way = event.target.closest(".way");
      if (way) {
        copyText(way.dataset.way).then(ok => {
          if (ok) { toast(`Copied: ${way.dataset.way}`); return; }
          // The clipboard is blocked: show the whole command on the chip so it can be typed.
          way.textContent = way.dataset.way;
          toast("Could not copy. The full command is now shown on the chip.");
        });
        return;
      }
      const stepItem = event.target.closest(".step-item");
      if (stepItem && !event.target.closest("a, button, input, code")) {
        const key = stepItem.dataset.check;
        if (state.checks[key]) delete state.checks[key]; else state.checks[key] = true;
        saveState();
        updateChecks();
        return;
      }
      const check = event.target.closest(".check");
      const toggle = event.target.closest(".rq-toggle");
      const doneAll = event.target.closest("[data-block-done]");
      const clearAll = event.target.closest("[data-block-clear]");
      if (check || toggle) {
        const key = event.target.closest(".rq").dataset.key;
        const status = rowStatus(key);
        if (check) {
          if (status === "banked" || status === "prior") return;
          setQuest(key, status === "done" ? null : "done");
        } else {
          const action = toggle.dataset.action;
          setQuest(key, action === "auto" ? null : action);
        }
      } else if (doneAll) {
        const res = lastPlan.results[doneAll.dataset.blockDone];
        const planned = res.rows.filter(row => row.status === "plan");
        planned.forEach(row => { state.quests[row.item.key] = "done"; });
        saveState();
        update();
        toast(planned.length ? `${quests(planned.length)} ticked done in block ${res.id}.` : `Nothing left to tick in block ${res.id}.`);
      } else if (clearAll) {
        const id = clearAll.dataset.blockClear;
        if (!window.confirm(`Clear every done, skip and add tick in block ${id}?`)) return;
        blockById[id].items.forEach(item => { delete state.quests[item.key]; });
        Object.keys(state.checks).forEach(key => { if (key.startsWith(`${id}|`)) delete state.checks[key]; });
        saveState();
        update();
        toast(`Block ${id} ticks cleared.`);
      }
    });
  }

  function readLedgerText(text, label) {
    let parsed = null;
    try { parsed = parseLedger(JSON.parse(text)); } catch (_) { parsed = null; }
    if (!parsed) { toast("That is not a ledger export."); return false; }
    state.ledgerImport = parsed;
    saveState();
    update();
    const count = Object.values(parsed.quests).filter(value => value === HELD).length;
    toast(`${label}: ${quests(count)} banked.`);
    return true;
  }

  function exportRoute() {
    const blob = new Blob([JSON.stringify({ version: 1, route: ROUTE_KEY, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "warrior-route-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Route progress exported.");
  }

  async function importRoute(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && parsed.ledger === LEDGER_KEY) { readLedgerText(text, "Ledger file"); return; }
      state = sanitizeState(parsed && parsed.state ? parsed.state : parsed);
      saveState();
      update();
      toast("Route progress imported.");
    } catch (_) {
      toast("That file is not a route export.");
    }
  }

  function bindControls() {
    const bankInput = document.querySelector("#bank-xp");
    bankInput.addEventListener("change", () => {
      const raw = bankInput.value.trim().replace(/[ ,]/g, "");
      const value = Number(raw);
      state.bankXp = raw === "" || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));
      saveState();
      update();
    });
    document.querySelector("#ov-level").addEventListener("change", event => {
      const value = event.target.value;
      state.override = value === "" ? null : { level: Number(value), pct: Number(value) >= 30 ? 0 : clampPct(document.querySelector("#ov-pct").value) };
      saveState();
      update();
    });
    document.querySelector("#ov-pct").addEventListener("change", event => {
      if (!state.override) return;
      state.override.pct = state.override.level >= 30 ? 0 : clampPct(event.target.value);
      saveState();
      update();
    });
    document.querySelector("#ov-clear").addEventListener("click", () => {
      state.override = null;
      document.querySelector("#ov-pct").value = "";
      saveState();
      update();
    });
    document.querySelector("#scope").addEventListener("change", event => { state.scope = event.target.value; saveState(); update(); });
    document.querySelector("#gnomer").addEventListener("change", event => { state.gnomeregan = event.target.checked; saveState(); update(); });
    document.querySelector("#tick-list").addEventListener("change", event => {
      const box = event.target.closest("[data-tick]");
      if (!box) return;
      const key = box.dataset.tick;
      const fromLedger = lastPlan.bank.ledgerHeld.has(key);
      if (box.checked === fromLedger) delete state.bankTicks[key]; else state.bankTicks[key] = box.checked;
      saveState();
      update();
    });
    document.querySelector("#tick-reset").addEventListener("click", () => { state.bankTicks = {}; saveState(); update(); toast("Bank ticks follow the ledger again."); });
    document.querySelector("#ledger-file").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (file) readLedgerText(await file.text(), "Ledger file");
      event.target.value = "";
    });
    document.querySelector("#ledger-paste-read").addEventListener("click", () => {
      const box = document.querySelector("#ledger-paste");
      if (readLedgerText(box.value, "Pasted ledger")) box.value = "";
    });
    document.querySelector("#forget-import").addEventListener("click", () => { state.ledgerImport = null; saveState(); update(); toast("Using this browser’s ledger again."); });
    document.querySelector("#export-route").addEventListener("click", exportRoute);
    document.querySelector("#import-route").addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) importRoute(file);
      event.target.value = "";
    });
    document.querySelector("#reset-route").addEventListener("click", () => {
      if (!window.confirm("Reset every route tick and setting on this device? The ledger is not changed.")) return;
      state = defaultState();
      saveState();
      update();
      toast("Route reset.");
    });
    // Pick up ledger changes made in another tab, or after returning to this one.
    window.addEventListener("storage", event => {
      if (event.key === ROUTE_KEY) state = loadState();
      if (event.key === LEDGER_KEY || event.key === ROUTE_KEY) update();
    });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) update(); });
  }

  // Copy a /way command; falls back to a hidden textarea where the clipboard API is unavailable.
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      area.remove();
      return ok;
    }
  }

  let toastTimer;
  function toast(message) {
    const element = document.querySelector("#toast");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("show"), 2400);
  }

  renderStructure();
  bindBlocks();
  bindControls();
  update();
})();
