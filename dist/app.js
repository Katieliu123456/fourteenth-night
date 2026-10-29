(function () {
  'use strict';
  const G = window.Night14, D = G.data, root = document.getElementById('app'), modal = document.getElementById('modal');
  const STORAGE = 'night14-cruise-v1';
  let state = null, gender = 'female', screen = 'landing', selected = new Set(), toastTimer, lastFocus, lastRenderedRoom, lastRenderedScreen;
  let saveAvailable = true;
  try { state = G.restore(localStorage.getItem(STORAGE)); } catch { saveAvailable = false; }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = {
    book: '<path d="M4 4h7c2 0 3 1 3 2v15c0-2-2-3-4-3H4zM20 4h-3c-2 0-3 1-3 2v15c0-2 2-3 4-3h2z"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    clue: '<path d="M4 5h7l2 3h7v12H4Z"/><path d="M8 12h8M8 16h5"/>',
    person: '<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    power: '<path d="m13 2-8 12h6l-1 8 9-13h-6z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5M12 17h.01"/>',
    save: '<path d="M4 3h13l4 4v14H3V3h1ZM7 3v6h9V3M7 21v-8h10v8"/>',
    home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/>',
    reset: '<path d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/>',
    route: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8"/>'
  };
  function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.eye}</svg>`; }
  const brand = () => '<div class="brand"><div class="sigil"><span>XIV</span></div><div><div class="brand-name">第十四夜</div><div class="brand-sub">THE FOURTEENTH NIGHT</div></div></div>';
  function persist() { try { localStorage.setItem(STORAGE, JSON.stringify(state)); saveAvailable = true; } catch { saveAvailable = false; } }
  function toast(message) { if (!message) return; const el = document.getElementById('toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 4500); }
  function close() { modal.close(); selected.clear(); }
  modal.addEventListener('close', () => { modal.className = ''; if (lastFocus?.isConnected) lastFocus.focus(); });
  modal.addEventListener('click', e => { if (e.target === modal && (e.offsetX < 0 || e.offsetX > modal.clientWidth || e.offsetY < 0 || e.offsetY > modal.clientHeight)) close(); });
  function open(title, tag, body, wide = false) {
    if (!modal.open) lastFocus = document.activeElement;
    modal.className = wide ? 'board-modal' : '';
    modal.innerHTML = `<div class="modal-head"><div><div class="eyebrow">${esc(tag)}</div><h2 id="modal-title">${esc(title)}</h2></div><button class="icon-button" data-action="close" aria-label="关闭">${icon('close')}</button></div><div class="modal-body">${body}</div>`;
    if (!modal.open) modal.showModal();
  }
  function dispatch(action, { quiet = false } = {}) {
    const result = G.act(state, action);
    if (result.ok) { state = result.state; persist(); render(); }
    if (!quiet && result.message) toast(result.message);
    return result;
  }
  function landing() {
    return `<div class="landing"><div class="landing-art">${Night14Art('deck')}</div><header class="landing-header">${brand()}<span class="status">夜航系统 · 等待连接</span></header><div class="landing-main"><section class="hero fade-in"><div class="eyebrow">A JOURNEY THROUGH FORGOTTEN LIVES</div><h1 class="hero-title">第十四夜</h1><div class="hero-en">THE FOURTEENTH NIGHT</div><p class="hero-copy">你不记得自己的名字。<br>但这艘船上的人，似乎都在等你回来。<br><br><strong>找到属于你的记忆。<br>然后，决定你想成为谁。</strong></p><div class="hero-chapter"><span class="number">01</span><div class="chapter-label"><p>永不靠岸的游轮</p><small>THE SHIP THAT NEVER DOCKS</small></div></div></section><section class="boarding fade-in" aria-label="登船信息"><div class="ticket-heading"><div><small>YONGYE · BOARDING PASS</small><h2>永夜号登船证</h2></div><span class="ticket-code">014</span></div><label>镜中的你</label><div class="gender-options"><button data-action="gender" data-gender="female" class="${gender === 'female' ? 'active' : ''}" aria-pressed="${gender === 'female'}">女性主角</button><button data-action="gender" data-gender="male" class="${gender === 'male' ? 'active' : ''}" aria-pressed="${gender === 'male'}">男性主角</button></div><button class="button wide" data-action="start">${state ? '重新登船' : '登上永夜号'} <span>↗</span></button>${state ? '<button class="button secondary wide" data-action="continue">继续上次的夜航 →</button>' : ''}<p class="ticket-note">本章：探索 · 时间循环 · 证据推理<br>时间按行动推进，阅读与思考不会催促你。</p><div class="barcode" aria-hidden="true"></div><small style="color:#738273;letter-spacing:2px">PASSENGER NAME: — — — —</small></section></div><footer class="landing-bottom"><span>14 个世界 · 14 件记忆 · 一个尚未找回的自己</span><button class="landing-help" data-action="help">初次夜航须知 ↗</button><span>游轮篇 · 试玩 0.1</span></footer></div>`;
  }
  function waitOptions() { return [3, 5, 7, 9, 11, 13, 14].filter(m => m > state.minute).map(m => `<option value="${m}">${m === 14 ? '00:14 · 下一轮' : '00:' + String(m).padStart(2, '0')}</option>`).join(''); }
  function timeControls(mobile = false) { return `<div class="${mobile ? 'mobile-wait' : 'time-controls'}"><select aria-label="等待到指定时间" id="${mobile ? 'mobile-wait' : 'wait-time'}">${waitOptions()}</select><button data-action="wait" data-target="${mobile ? 'mobile-wait' : 'wait-time'}">等待</button></div>`; }
  function game() {
    const room = D.rooms[state.room];
    const nav = Object.entries(D.rooms).map(([id, r]) => {
      const current = id === state.room, adj = room.exits.includes(id), locked = G.gate(state, id);
      return `<button class="room-button ${current ? 'current' : adj && !locked ? 'adjacent' : ''}" data-action="move" data-room="${id}" ${current ? 'aria-current="location"' : ''} aria-label="${esc(r.name)}${current ? ' 当前场景' : ''}"><span class="dot"></span><span>${esc(r.name)}</span><span class="room-status">${current ? '所在' : adj && !locked ? '↗' : '·'}</span></button>`;
    }).join('');
    const hotPositions = [[29, 60], [72, 55], [53, 44], [83, 32]];
    const hotspots = room.objects.slice(0, 4).map((o, i) => `<button class="scene-hotspot" style="left:${hotPositions[i][0]}%;top:${hotPositions[i][1]}%" data-action="object" data-id="${o[0]}" aria-label="调查${esc(o[1])}" title="${esc(o[1])}">${i + 1}</button>`).join('');
    const objects = room.objects.map(o => {
      const done = G.has(state, o[0]) || o[0] === 'eileen' && G.has(state, 'witness') || o[0] === 'power' && state.flags.power || o[0] === 'locker' && state.flags.locker || o[0] === 'louis' && state.flags.rescued;
      const typeIcon = ['talk', 'rescue', 'consent'].includes(o[4]) ? 'person' : ['power', 'final'].includes(o[4]) ? 'power' : o[4] === 'reset' ? 'clock' : 'eye';
      return `<button class="object-card" data-action="object" data-id="${o[0]}"><span class="object-icon">${icon(typeIcon)}</span><span><span class="object-name">${esc(o[1])}</span><span class="object-sub">${esc(o[2])} · ${done ? '已调查' : '可互动'}</span></span><span class="${done ? 'check' : 'arrow'}">${done ? '✓' : '↗'}</span></button>`;
    }).join('');
    const steps = [['missing', '查明失踪侍应的去向'], ['passengers', '核实 237 人与 14 份病历'], ['projection', '解开“另一个自己”的身份']];
    return `<header class="game-header">${brand()}<div class="header-middle"><p>永不靠岸的游轮</p><small>WORLD 01 / 14 · YONGYE</small></div><nav class="header-actions" aria-label="游戏工具"><button class="icon-button" data-action="notebook" aria-label="打开夜航档案">${icon('book')}<span>夜航档案</span></button><button class="icon-button" data-action="help" aria-label="玩法说明">${icon('help')}</button><button class="icon-button" data-action="home" aria-label="返回标题页">${icon('home')}</button></nav></header><div class="game-layout"><aside class="sidebar"><div class="clock-section"><div class="clock-label">距离重置 · 00:14</div><div class="clock ${state.minute >= 11 ? 'urgent' : ''}">00:${String(state.minute).padStart(2, '0')}</div><div class="clock-progress">${Array.from({length: 14}, (_, i) => `<span class="${i < state.minute ? 'past' : ''}"></span>`).join('')}</div><div class="cycle-label"><span>第 ${String(state.cycle).padStart(2, '0')} 轮循环</span><span>${state.gender === 'male' ? '男性主角' : '女性主角'}</span></div></div><div><div class="map-label"><span>永夜号舱室图</span>${icon('route')}</div><nav class="room-nav" aria-label="场景地图">${nav}</nav></div><p class="sidebar-note">沿相邻路线移动 · 每次耗时 1 分钟<br>已记录的线索不会随循环消失。</p><button class="button secondary wide" data-action="reset-prompt">${icon('reset')} 重新开始本轮</button></aside><section class="stage"><div class="scene-heading"><div><div class="eyebrow">${esc(room.en)}</div><h1>${esc(room.name)}</h1></div><span class="scene-badge">${esc(room.deck)}甲板 · ${state.visits.indexOf(state.room) + 1} / 7</span></div><div class="scene fade-in">${Night14Art(state.room)}${hotspots}<div class="scene-caption">${esc(room.tag)} / YONGYE 014</div></div><p class="scene-description">${esc(room.description)}</p><div class="mobile-tools"><p class="mobile-mission">当前调查：${esc(G.goal(state))}</p><button class="button secondary" data-action="board">${icon('clue')} 证据板 ${state.known.length}</button>${timeControls(true)}</div><div class="section-caption"><p>观察与交互</p><small>LOOK CLOSER · THE TRUTH LEAVES TRACES</small></div><div class="object-grid">${objects}</div><div class="room-movement">${icon('route')} 可前往：${room.exits.map(id => esc(D.rooms[id].name)).join(' / ')}</div></section><aside class="rightbar"><div class="eyebrow">CURRENT INVESTIGATION</div><div class="mission"><h3>最后一次登船</h3><p id="current-goal">${esc(G.goal(state))}</p></div><ul class="task-steps">${steps.map(([id, text]) => `<li class="${G.deduced(state, id) ? 'done' : ''}"><span class="task-step-icon">${G.deduced(state, id) ? '◆' : '◇'}</span>${text}</li>`).join('')}</ul><div class="line"></div><div class="eyebrow">EVIDENCE & MEMORY</div><div class="evidence-summary"><strong>${String(state.known.length).padStart(2, '0')}</strong><span>份已记录线索</span></div><button class="button secondary wide" data-action="board">${icon('clue')} 打开证据板 <span>↗</span></button><div class="xp-row"><span>探索经验</span><span>${state.xp} EXP</span></div><div class="xp-bar"><i style="width:${Math.min(state.xp / 10, 100)}%"></i></div><div class="line"></div><div class="eyebrow">SHIP'S LOG</div><div class="journal-mini">${state.log.slice(0, 3).map(l => `<p>${esc(l)}</p>`).join('')}</div>${timeControls()}<div class="local-save">${icon('save')}${saveAvailable ? '进度已保存在这台设备' : '浏览器未允许保存，请保持此页面打开'}</div><div class="prototype-note">第一夜 · 记忆锚点 0 / 14</div></aside></div>`;
  }
  function ending() {
    const e = D.endings[state.ending];
    return `<section class="ending-screen fade-in">${brand()}<div class="ending-symbol">XIV</div><div class="eyebrow">${e.en}</div><h1>${e.name}</h1><div class="gold" style="font-size:12px;letter-spacing:3px">${e.saved}</div><p class="ending-copy">${e.text}</p><p class="ending-quote">${e.quote}</p><div class="anchor-reward">记忆锚点已归位 · 浸湿的登船票<small>已恢复记忆 1 / 14 · 历史登船 14 次 · 本次为失忆后的首次访问</small></div><div class="modal-actions"><button class="button" data-action="station">返回夜航中转站 →</button><button class="button secondary" data-action="replay">探索其他结局</button></div><p class="endings-count">本机已发现结局 ${state.endingsSeen.length} / 3 · 你的选择已记入夜航档案</p></section>`;
  }
  function render() {
    root.innerHTML = screen === 'landing' || !state ? landing() : state.ending ? ending() : game();
    if (screen !== lastRenderedScreen || state?.room !== lastRenderedRoom) window.scrollTo(0, 0);
    lastRenderedScreen = screen; lastRenderedRoom = state?.room;
  }
  function showClue(id) {
    const e = D.evidence[id];
    open(e.title, 'EVIDENCE / ' + e.type, `<p class="modal-source">来源 · ${esc(e.source)}</p><p>${esc(e.text)}</p><p class="modal-note">已存入夜航档案。即使 00:14 重置，这条记录也会保留。</p><button class="button secondary" data-action="close">继续调查 →</button>`);
  }
  function showObject(id) {
    const o = D.rooms[state.room].objects.find(x => x[0] === id); if (!o) return;
    const kind = o[4];
    if (kind === 'inspect') { const r = dispatch({ type: 'inspect', id }, { quiet: true }); if (r.ok) showClue(id); else toast(r.message); }
    else if (kind === 'talk') showPerson(id);
    else if (kind === 'locker') showLocker();
    else if (kind === 'power') showPower();
    else if (kind === 'reset') resetPrompt();
    else if (kind === 'alibi') {
      if (G.has(state, 'alibi')) showClue('alibi');
      else open('等一束红灯亮起', 'DECK CAMERA', `<p>摄像头会在 <span class="gold">00:09</span> 拍摄连续影像。那一刻，你需要真正站在甲板上。它将成为你不在驾驶室的行程证据。</p>${state.minute < 9 ? '<button class="button" data-action="camera-wait">留在甲板，等待到 00:09 →</button>' : '<p class="modal-note">本轮已错过拍摄。下一轮可以提前来到甲板。</p>'}<button class="button secondary" data-action="close">继续调查</button>`);
    } else if (kind === 'rescue') {
      open('门后的敲击', 'LOUIS / MAINTENANCE', `<p class="dialog-quote">${state.minute < 7 ? '“我得先去维护间看看，00:07之前应该能回来。”' : state.flags.rescued ? '“我就在这里。需要时叫我，我帮你操作另一边的开关。”' : '“是我，路易！门突然锁上了，外面有个手动阀——”'}</p><p class="modal-note">救下路易可以获得本轮的配电协助。也可以取用继电器独自完成操作。</p><button class="button" data-action="rescue-louis">转动手动阀</button>`);
    } else if (kind === 'consent') {
      open('先听见他们的声音', 'INFORMED CHOICE', `<p>你准备向十四名保存者说明转移方法、实测艇位，以及循环核心将在桥接后永久损毁的风险。</p><p class="modal-note">需要先调查救生艇与桥接技术卡。授权在本轮生效，循环重置后须重新确认。</p><button class="button" data-action="consent">说明方案，征求他们的同意 →</button>`);
    } else if (kind === 'final') showFinal();
  }
  function showPerson(id) {
    const people = { eileen: ['艾琳', '乘客 / REMEMBERS THE LOOP', '“我们见过。你不记得我了，对吗？”', '她看向你的目光中没有惊讶，只有一种难以解释的疲惫。'], doctor: ['林医生', '船医 / THE FOURTEEN', '“请先知道他们是谁，再决定该不该关掉开关。”', '医生把病历推到你面前。十四个人的呼吸，正依靠同一个系统。'], captain: ['霍尔船长', '船长 / KEEP EVERYONE ALIVE', '“没有人能离开，我就不会让这艘船靠岸。”', '他承认自己在保护某些人。但他避开了“是谁下达命令”的问题。'] };
    const p = people[id];
    open(p[0], 'CONVERSATION', `<div class="person-name"><div class="portrait">${p[0].slice(0, 1)}</div><div><small>${p[1]}</small><h3>${p[0]}</h3></div></div><p class="dialog-quote">${p[2]}</p><p>${p[3]}</p><div class="line"></div><div class="modal-actions"><button class="button" data-action="talk" data-id="${id}">${id === 'eileen' ? '询问重复发生的夜晚' : id === 'doctor' ? '请解释保存舱病历' : '用已知记录质询船长'}</button>${id === 'eileen' && G.has(state, 'score') ? '<button class="button secondary" data-action="talk-music">把钢琴谱交还给她</button>' : ''}</div>`);
  }
  function showLocker() {
    open('医务室备用柜', 'PUZZLE 01 / THE RELIABLE DATE', `<p>柜门上写着：“请以值班日期的月日为准。”<br>输入四位密码。请让两份有来源的记录互相印证。</p><form id="locker-form"><label for="locker-code" class="eyebrow">MONTH / DAY</label><input id="locker-code" class="locker-input" name="code" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="— — — —" aria-label="四位备用柜密码"><p id="puzzle-error" class="inline-error" role="alert"></p><button class="button wide" type="submit">验证日期，打开备用柜</button></form>`);
    document.getElementById('locker-code').focus();
  }
  function showPower() {
    open('六单位的夜晚', 'PUZZLE 02 / POWER DISTRIBUTION', `<p>可用供能只有 <span class="gold">6 单位</span>。你必须让控制、保存与最低照明同时工作，救生设备使用独立应急电源。</p><form id="power-form">${[['循环控制', 2, 2], ['保存舱', 3, 3], ['公共照明', 1, 2]].map(([name, min, val], i) => `<div class="power-row"><label for="power-${i}">${name}<small>最低需求 ${min} 单位</small></label><input id="power-${i}" name="power-${i}" type="number" min="0" max="6" value="${val}" required></div>`).join('')}<div class="power-total"><span>当前分配</span><span><strong id="power-sum">7</strong> / 6</span></div><p id="puzzle-error" class="inline-error" role="alert"></p><p class="modal-note">${state.flags.rescued ? '路易已在远端待命，可以协助操作。' : state.flags.relay ? '你已取用延时继电器，可以独自操作。' : '先救下路易，或从机舱工具柜取用延时继电器。'}</p><button type="submit" class="button wide">检查并接通线路</button></form>`);
  }
  function showBoard(preserve = false) {
    if (!preserve) selected.clear();
    const cards = state.known.map(id => { const e = D.evidence[id]; return `<button class="clue-card ${selected.has(id) ? 'selected' : ''}" data-action="select-clue" data-id="${id}" aria-pressed="${selected.has(id)}"><span class="clue-category">${e.type}</span><span class="clue-check">${selected.has(id) ? '◆' : '◇'}</span><h3>${e.title}</h3><p>${e.text}</p></button>`; }).join('');
    open('让线索彼此作证', 'EVIDENCE BOARD', `<div class="board-intro"><p>选中两到三份记录，验证一个具体问题。已知事实与人物说法需要交叉检查；错误连接不会扣除经验。</p><span class="selected-count">已选择 ${selected.size} / 3</span></div><div class="clue-grid">${cards || '<p class="muted">先调查客舱，或去酒吧与艾琳交谈。</p>'}</div><div class="board-bottom"><p id="board-result">待验证：失踪原因 / 人数关系 / 另一个自己的身份</p><button class="button" data-action="deduce">验证这组证据 →</button></div>${state.deductions.length ? `<div class="deduction-list">${state.deductions.map(id => `<div class="deduction"><h3>✓ ${D.deductions[id].title}</h3><p>${D.deductions[id].text}</p></div>`).join('')}</div>` : ''}`, true);
  }
  function showNotebook() {
    open('夜航档案', 'WHAT YOU CHOOSE TO REMEMBER', `<p class="modal-source">第 ${state.cycle} 轮 · ${state.xp} 探索经验 · ${state.known.length} 份线索</p><h3>你正在成为谁</h3>${state.diary.length ? state.diary.map(d => `<div class="journal-entry">${esc(d.text)}</div>`).join('') : '<p class="modal-note">这里记录具体的选择与行为。系统不会替你判定善恶。</p>'}<div class="line"></div><h3>调查记录</h3>${state.log.map(l => `<div class="journal-entry">${esc(l)}</div>`).join('')}<button class="button secondary" data-action="board">查看线索与已证实推论 →</button>`, true);
  }
  function resetPrompt() {
    if (state.room !== 'cabin') { toast('先沿地图回到客舱，合上床头怀表，便可主动重置。'); return; }
    open('再一次醒来', 'RESTART THIS LOOP', '<p>回到 00:00，开始新的一轮。已记录线索、推论和经验保留；钥匙、继电器、路易的协助、配电和授权会复位。</p><button class="button" data-action="reset">合上怀表，开始下一轮 →</button>');
  }
  function showFinal() {
    if (!G.ready(state)) { toast(G.goal(state)); return; }
    open('你将如何结束这一夜', 'THE FINAL DECISION', `<p>你已查明这里发生的事。记忆锚点会在执行后读取，无论你选择哪种方案。</p><div class="ending-grid">${Object.entries(D.endings).map(([id, e]) => { const m = id === 'rescue' ? G.rescueMissing(state) : []; return `<button class="ending-option ${m.length ? 'locked' : ''}" data-action="choose-ending" data-ending="${id}"><h3>${e.name}</h3><p class="gold">${e.saved}</p><p>${e.price}</p>${m.length ? `<small>尚需：${m.join('、')}</small>` : '<small style="color:var(--mint)">条件已满足 · 可进入最后确认</small>'}</button>`; }).join('')}</div>`);
  }
  function help() {
    open('初次夜航须知', 'WELCOME ABOARD', `<p><strong class="gold">探索。</strong>点击场景中的数字标记，或下方物品卡。左侧地图只允许沿相邻路线移动，每次消耗1分钟。</p><p><strong class="gold">验证。</strong>证据板中选择2～3份相互印证的记录，验证失踪、人数与身份三项推论。可以试错，不会扣经验。</p><p><strong class="gold">时间。</strong>时间按行动推进，阅读、对话和思考不走时。“等待”可以跳到事件时间。00:14会重置本轮，线索与推论会保留。</p><p><strong class="gold">再试一次。</strong>错过事件，可以回客舱主动重置。甲板摄像头需要你在00:09亲自在场，其他记录可从档案回看。</p><p><strong class="gold">作出决定。</strong>三项推论与登船票核实后，可决定循环去留。全员救援额外需要艇位、桥接方案、稳定供电和保存者授权。</p><p class="modal-note">本试玩完成游轮篇调查闭环，其他13个世界与正式3D场景尚未制作。进度仅保存在当前浏览器，清理网站数据会删除存档。</p><button class="button" data-action="close">我准备好了 →</button>`);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-action]'); if (!b) return;
    const a = b.dataset.action;
    if (a === 'close') close();
    else if (a === 'gender') { gender = b.dataset.gender; render(); }
    else if (a === 'start') {
      if (state) open('开始新的夜航', 'NEW JOURNEY', '<p>重新登船会覆盖这台设备的当前存档。你也可以继续原来的调查。</p><button class="button danger" data-action="new-confirm">确认重新登船</button><button class="button secondary" data-action="close">保留原来的进度</button>');
      else { state = G.create(gender); screen = 'game'; persist(); render(); toast('00:00。先调查桌上的乘船证，再去酒吧找艾琳。'); }
    } else if (a === 'new-confirm') { close(); state = G.create(gender); screen = 'game'; persist(); render(); }
    else if (a === 'continue') { screen = 'game'; render(); }
    else if (a === 'home') { close(); screen = 'landing'; render(); }
    else if (a === 'help') help();
    else if (!state) return;
    else if (a === 'move') {
      if (b.dataset.room === state.room) return;
      if (!D.rooms[state.room].exits.includes(b.dataset.room)) { toast('请沿相邻路线前往。当前可去：' + D.rooms[state.room].exits.map(id => D.rooms[id].name).join('、')); return; }
      dispatch({ type: 'move', room: b.dataset.room });
    } else if (a === 'object') showObject(b.dataset.id);
    else if (a === 'wait') { const minute = Number(document.getElementById(b.dataset.target).value); dispatch({ type: 'wait', minute }); }
    else if (a === 'camera-wait') { close(); const r = dispatch({ type: 'wait', minute: 9 }, { quiet: true }); if (r.ok) showClue('alibi'); else toast(r.message); }
    else if (a === 'talk' || a === 'talk-music') {
      const id = a === 'talk-music' ? 'eileen' : b.dataset.id;
      const r = dispatch({ type: 'talk', id, choice: a === 'talk-music' ? 'music' : undefined }, { quiet: true });
      if (r.ok) open(id === 'eileen' ? '艾琳的回答' : id === 'doctor' ? '林医生的说明' : '霍尔的回答', 'TESTIMONY', `<p class="dialog-quote">${esc(r.message)}</p><p class="modal-note">有效记录已进入档案，可与实物证据交叉验证。</p><button class="button secondary" data-action="close">记住这些话，继续调查 →</button>`); else toast(r.message);
    } else if (a === 'rescue-louis') { const r = dispatch({ type: 'rescueLouis' }); if (r.ok) close(); }
    else if (a === 'consent') { const r = dispatch({ type: 'consent' }, { quiet: true }); if (r.ok) showClue('consent'); else toast(r.message); }
    else if (a === 'board') showBoard();
    else if (a === 'select-clue') { const y = b.dataset.id; if (selected.has(y)) selected.delete(y); else if (selected.size < 3) selected.add(y); else { toast('一次最多连接3份证据。'); return; } const scroll = modal.querySelector('.clue-grid').scrollTop; showBoard(true); modal.querySelector('.clue-grid').scrollTop = scroll; }
    else if (a === 'deduce') { const r = dispatch({ type: 'deduce', ids: [...selected] }, { quiet: true }); if (r.ok) selected.clear(); showBoard(true); const out = document.getElementById('board-result'); out.textContent = r.message; out.style.color = r.ok ? 'var(--mint)' : 'var(--danger)'; }
    else if (a === 'notebook') showNotebook();
    else if (a === 'reset-prompt') resetPrompt();
    else if (a === 'reset') { close(); dispatch({ type: 'reset' }); }
    else if (a === 'choose-ending') {
      const id = b.dataset.ending, end = D.endings[id]; const missing = id === 'rescue' ? G.rescueMissing(state) : [];
      if (missing.length) { toast('尚需：' + missing.join('、')); return; }
      open('最后确认 · ' + end.name, 'A CHOICE WITH CONSEQUENCES', `<p class="dialog-quote">${end.saved}</p><p class="warning">${end.price}</p><p>你已经知道这项选择的代价。确认后，本次世界调查将结算，记忆锚点归位。</p><div class="modal-actions" style="margin-top:22px"><button class="button" data-action="finish" data-ending="${id}">确认执行「${end.name}」</button><button class="button secondary" data-action="final-back">再想一想</button></div>`);
    } else if (a === 'final-back') showFinal();
    else if (a === 'finish') { const r = dispatch({ type: 'finish', ending: b.dataset.ending, confirm: true }, { quiet: true }); if (r.ok) close(); else toast(r.message); }
    else if (a === 'replay') { close(); dispatch({ type: 'replay' }); }
    else if (a === 'station') {
      open('夜航中转站', 'MEMORY ANCHOR 01 / 14', `<p class="dialog-quote">“欢迎回来。”</p><p>空白的记忆墙前，一张浸湿的登船票缓缓浮起。你听见自己的旧声音：</p><p class="dialog-quote">“在找到方法之前，任何人不得关闭保存。我会回来。”</p><p>你终于知道，游轮不是第一次等你。而这一次，你留下的决定是：<span class="gold">${D.endings[state.ending].name}</span>。</p><div class="line"></div><h3>你留下的痕迹</h3>${state.diary.map(d => `<div class="journal-entry">${esc(d.text)}</div>`).join('')}<p class="modal-note">游轮篇试玩到此结束。其他13个世界将以同一套证据、记忆与选择记录继续扩展。</p><div class="modal-actions" style="margin-top:20px"><button class="button" data-action="replay">回到游轮，探索其他可能</button><button class="button secondary" data-action="home">返回标题页</button></div>`);
    }
  });
  document.addEventListener('submit', e => {
    if (e.target.id === 'locker-form') { e.preventDefault(); const r = dispatch({ type: 'locker', code: new FormData(e.target).get('code') }, { quiet: true }); if (r.ok) { close(); toast(r.message); } else document.getElementById('puzzle-error').textContent = r.message; }
    if (e.target.id === 'power-form') { e.preventDefault(); const f = new FormData(e.target); const values = [0,1,2].map(i => Number(f.get('power-' + i))); const r = dispatch({ type: 'power', values }, { quiet: true }); if (r.ok) { close(); toast(r.message); } else document.getElementById('puzzle-error').textContent = r.message; }
  });
  document.addEventListener('input', e => { if (e.target.closest('#power-form')) document.getElementById('power-sum').textContent = [0,1,2].reduce((n, i) => n + Number(document.getElementById('power-' + i).value), 0); });
  render();
})();
