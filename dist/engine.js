(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./data.js'));
  else root.Night14 = factory(root.Night14Data);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (D) {
  'use strict';
  const VERSION = 1;
  const freshFlags = () => ({ locker: false, pass: false, relay: false, rescued: false, power: false, public: false, consent: false });
  function create(gender = 'female') { return { version: VERSION, started: true, gender: gender === 'male' ? 'male' : 'female', room: 'cabin', minute: 0, cycle: 1, xp: 0, known: [], deductions: [], rewarded: [], flags: freshFlags(), visits: ['cabin'], timeline: [], diary: [], log: ['你在永夜号醒来。当前时间 00:00。'], ending: null, endingsSeen: [] }; }
  const copy = s => JSON.parse(JSON.stringify(s));
  const has = (s, id) => s.known.includes(id);
  const deduced = (s, id) => s.deductions.includes(id);
  function reward(s, id, points) { if (!s.rewarded.includes(id)) { s.rewarded.push(id); s.xp += points; } }
  function record(s, line) { s.log.unshift(line); s.log = s.log.slice(0, 50); }
  function learn(s, id) { if (!has(s, id)) { s.known.push(id); reward(s, 'clue:' + id, D.evidence[id].xp); } }
  function reset(s) { s.cycle++; s.minute = 0; s.room = 'cabin'; s.flags = freshFlags(); record(s, '00:14，海浪再次拍上窗。实物与设备复位，已知线索、推论和经验保留。'); }
  function advance(s, count) {
    for (let i = 0; i < count; i++) {
      s.minute++;
      if (s.minute === 7) record(s, s.flags.rescued ? '路易避开了自动封锁，正在检查旁路。' : '00:07，下层传来一声金属闸门落下的巨响。');
      if (s.minute === 9) {
        if (s.room === 'deck') { learn(s, 'alibi'); record(s, '00:09，摄像头留下你在甲板的连续影像。'); }
        if (!s.timeline.includes(s.cycle)) s.timeline.push(s.cycle);
        record(s, '00:09，驾驶室监控中的另一个你出现了。');
      }
      if (s.minute === 11) record(s, '00:11，船长广播：请勿进入下层。保存舱供能正在下降。');
      if (s.minute >= 14) { reset(s); break; }
    }
  }
  function gate(s, room) {
    if (!D.rooms[room]) return '这条路线不存在。';
    if (room === 'clinic' && !(s.flags.locker || (s.minute >= 3 && s.minute < 11))) return '医务室在 00:03～00:10 接诊。你也可以在下一轮重开已解开的备用柜。';
    if (room === 'bridge' && !has(s, 'hatch') && !s.flags.pass) return '驾驶室需要通行证。甲板的维修侧门也许有别的入口。';
    if (room === 'engine' && !(s.flags.locker || s.flags.pass)) return '机舱门锁着。需要医务室备用钥匙，或船长的通行证。';
    if (room === 'archive' && !s.flags.power) return '保存舱需要先恢复稳定配电。';
    if (room === 'archive' && !deduced(s, 'projection')) return '防护终端拒绝开门：请先查明驾驶室中“另一个自己”的身份。';
    return null;
  }
  const ready = s => ['missing', 'passengers', 'projection'].every(id => deduced(s, id)) && has(s, 'ticket');
  function rescueMissing(s) {
    const m = [];
    if (!has(s, 'boats')) m.push('实测救生艇容量');
    if (!has(s, 'transfer')) m.push('核实一次性桥接方案');
    if (!s.flags.consent) m.push('本轮取得14份知情授权');
    if (!s.flags.power) m.push('本轮恢复稳定配电');
    if (!(s.flags.relay || s.flags.rescued)) m.push('本轮取用继电器或救下路易');
    return m;
  }
  function goal(s) {
    if (s.ending) return '世界完成 · 返回夜航中转站';
    if (!has(s, 'witness')) return '先去酒吧，询问那个似乎认识你的女人。';
    if (!has(s, 'route')) return '找到路易的运送单，调查他的最后行程。';
    if (!has(s, 'logs')) return '从甲板寻找驾驶室入口，取得门禁记录。';
    if (!deduced(s, 'missing')) return '在证据板连接运送单与门禁日志，验证失踪原因。';
    if (!has(s, 'records')) return '调查医务室：14份病历与237名乘客有什么关系？';
    if (!deduced(s, 'passengers')) return '把载客名册与保存病历放在一起，核实人数与停机代价。';
    if (!has(s, 'alibi')) return '在一轮的 00:09 留在甲板，让摄像头记录你的行程。';
    if (!has(s, 'video')) return '回驾驶室查看 00:09 录像。';
    if (!deduced(s, 'projection')) return '用监控、门禁日志与甲板行程，排除另一个真人的假说。';
    if (!s.flags.power) return '去机舱恢复供电。总量6，控制至少2、保存至少3、照明至少1。';
    if (!has(s, 'ticket')) return '进入隐藏保存舱，查看那张浸湿的登船票。';
    return '已可作出最终决定。额外核实转移方案、艇位与授权，可以尝试全员救援。';
  }
  function act(input, action) {
    const s = copy(input); let message = ''; let clue = null; let ok = true;
    const fail = msg => ({ state: copy(input), ok: false, message: msg, clue: null });
    if (s.ending && action.type !== 'replay') return fail('本轮世界已结算。可以返回中转站，或重玩其他结局。');
    switch (action.type) {
      case 'move': {
        if (!D.rooms[s.room].exits.includes(action.room)) return fail('请沿地图上的相邻路线移动。');
        const why = gate(s, action.room); if (why) return fail(why);
        s.room = action.room; if (!s.visits.includes(s.room)) { s.visits.push(s.room); reward(s, 'room:' + s.room, 20); }
        advance(s, 1); message = '抵达 ' + D.rooms[s.room].name + '。'; break;
      }
      case 'wait': {
        const target = Number(action.minute);
        if (!Number.isInteger(target) || target <= s.minute || target > 14) return fail('请选择本轮尚未到达的时间。');
        advance(s, target - s.minute); message = s.minute === 0 ? '新的一轮开始了。' : '时间来到 00:' + String(s.minute).padStart(2, '0') + '。'; break;
      }
      case 'tick': advance(s, 1); break;
      case 'reset': if (s.room !== 'cabin') return fail('回到客舱，合上怀表即可主动重置。'); reset(s); message = '你保留了已经知道的一切。'; break;
      case 'inspect': {
        const id = action.id;
        if (!D.rooms[s.room].objects.some(o => o[0] === id)) return fail('这件物品不在当前场景。');
        if (!D.evidence[id]) return fail('这里没有可记录的新线索。');
        if (id === 'video' && !s.timeline.length) return fail('监控尚未记录到异常。等待一轮的 00:09 后再查看。');
        if (id === 'logs' && s.minute < 7 && !s.timeline.length) return fail('尚未发生封锁。等到 00:07 后复查门禁日志。');
        if (id === 'records' && !has(s, 'doctor') && !s.flags.locker) return fail('先询问林医生，或解开备用柜取得档案钥匙。');
        if (id === 'transfer' && !has(s, 'records')) return fail('先核实保存病历，再检查这份技术方案。');
        if (id === 'relay') s.flags.relay = true;
        learn(s, id); clue = id; message = D.evidence[id].text; break;
      }
      case 'talk': {
        if (!D.rooms[s.room].objects.some(o => o[0] === action.id && o[4] === 'talk')) return fail('对方不在这里。');
        if (action.id === 'eileen') {
          learn(s, 'witness'); clue = 'witness'; message = D.evidence.witness.text;
          if (action.choice === 'music') {
            if (!has(s, 'score')) return fail('先找出那份钢琴谱，再询问艾琳。');
            reward(s, 'quest:music', 50); message = '艾琳认出女儿的字迹：“她还在下面。请别只替我们决定，先听听她自己的声音。”';
            if (!s.diary.some(d => d.id === 'music')) s.diary.push({ id: 'music', text: '你把女孩的钢琴谱交还艾琳，听她讲完了女儿的故事。' });
          }
        } else if (action.id === 'doctor') { learn(s, 'doctor'); clue = 'doctor'; message = D.evidence.doctor.text; }
        else if (action.id === 'captain') {
          if (has(s, 'witness') && has(s, 'manifest')) { s.flags.pass = true; reward(s, 'talk:captain', 20); message = '你以日期簿和载客名册质询霍尔。他交出通行证：“我只是在执行你留下的命令。先把真相查清，再动核心。”'; }
          else message = '霍尔：“237个人都在我的船上。想让我开门，先证明你知道他们正在经历什么。”';
        }
        break;
      }
      case 'locker': {
        if (s.room !== 'clinic') return fail('备用柜在医务室。');
        if (!has(s, 'manual') || !has(s, 'calendar')) return fail('先找到服务手册，再核实值班板与交接单。');
        if (String(action.code) !== '1104') return fail('密码不符。核对两份盖章记录中的月日；腕表的日期并不可靠。');
        s.flags.locker = true; reward(s, 'puzzle:locker', 30); message = '柜门弹开。你取得医务档案与机舱的备用钥匙，本轮有效。'; break;
      }
      case 'rescueLouis': {
        if (s.room !== 'engine') return fail('路易在机舱维护间。');
        if (!has(s, 'route')) return fail('你还不知道维护间里的人是谁。先调查运送单。');
        if (s.minute < 7) return fail('路易尚未进入被封锁的维护间。等到 00:07 后检查。');
        s.flags.rescued = true; reward(s, 'quest:louis', 50); message = '你转动手动阀，路易跌出门外。他答应在本轮留下协助你操作远端开关。';
        if (!s.diary.some(d => d.id === 'louis')) s.diary.push({ id: 'louis', text: '你查明路易的路线后打开手动阀，把他从维护间带出来。' });
        break;
      }
      case 'deduce': {
        const ids = [...new Set(Array.isArray(action.ids) ? action.ids : [])].sort();
        if (!ids.every(id => has(s, id))) return fail('只能使用已经取得的证据。');
        const entry = Object.entries(D.deductions).find(([, d]) => JSON.stringify(d.ids.slice().sort()) === JSON.stringify(ids));
        if (!entry) return fail('这些材料还不足以支持一个明确结论。试着让时间、地点或人数相互印证。');
        const [id, d] = entry;
        if (!deduced(s, id)) { s.deductions.push(id); reward(s, 'deduction:' + id, d.xp); }
        message = d.text; break;
      }
      case 'power': {
        if (s.room !== 'engine') return fail('配电台位于机舱。');
        const p = action.values;
        if (!Array.isArray(p) || p.length !== 3 || !p.every(v => Number.isInteger(v) && v >= 0 && v <= 6)) return fail('输入三条线路的整数供能值。');
        if (!(s.flags.relay || s.flags.rescued)) return fail('需要先取用工具柜的延时继电器，或救下路易协助操作。');
        if (p.reduce((a, b) => a + b, 0) > 6) return fail('总供能超过6单位。保护系统已复位，没人因此受伤。');
        if (p[0] < 2 || p[1] < 3 || p[2] < 1) return fail('供能不足：循环控制至少2、保存舱至少3、公共照明至少1。保护系统已复位。');
        s.flags.power = true; reward(s, 'puzzle:power', 30); message = '控制2 · 保存3 · 照明1。供电稳定，保存舱的门灯亮起。'; break;
      }
      case 'consent': {
        if (s.room !== 'archive') return fail('需要通过保存舱的联络终端进行。');
        if (!has(s, 'transfer') || !has(s, 'boats')) return fail('在请求同意前，先验证转移方案与救生艇容量，让他们知道真实的出路与风险。');
        s.flags.public = true; s.flags.consent = true; learn(s, 'consent'); message = D.evidence.consent.text; clue = 'consent';
        if (!s.diary.some(d => d.id === 'consent')) s.diary.push({ id: 'consent', text: '你说明了桥接风险与核心报废的代价，让14名保存者自己确认是否离开。' });
        break;
      }
      case 'finish': {
        if (s.room !== 'archive' || !ready(s)) return fail('先核实失踪原因、人数关系与投影身份，再读取登船票。');
        if (!D.endings[action.ending]) return fail('请选择一种有效的方案。');
        if (action.confirm !== true) return fail('请先阅读人数后果，再明确确认决定。');
        if (action.ending === 'rescue' && rescueMissing(s).length) return fail('尚需完成：' + rescueMissing(s).join('、') + '。');
        s.ending = action.ending;
        if (!s.endingsSeen.includes(s.ending)) s.endingsSeen.push(s.ending);
        reward(s, 'world:cruise', 150); reward(s, 'anchor:cruise', 300);
        s.diary.push({ id: 'ending:' + s.ending, text: '你选择了「' + D.endings[s.ending].name + '」：' + D.endings[s.ending].price });
        record(s, '取得记忆锚点 · 浸湿的登船票。记忆与权限归档，原物留在永夜号。');
        message = '世界完成。你的第一块记忆，归位了。'; break;
      }
      case 'replay': {
        if (!s.ending) return fail('尚未完成当前世界。');
        s.ending = null; reset(s); message = '回到决定之前的调查旅程。已知线索与已解锁结局保留。'; break;
      }
      default: return fail('未知操作。');
    }
    return { state: s, ok, message, clue };
  }
  function restore(raw) {
    try {
      const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!o || o.version !== VERSION || !D.rooms[o.room] || !Number.isInteger(o.minute) || o.minute < 0 || o.minute > 13 || !Number.isInteger(o.cycle) || o.cycle < 1) return null;
      const s = create(o.gender); s.room = o.room; s.minute = o.minute; s.cycle = Math.min(o.cycle, 100000);
      s.known = Array.isArray(o.known) ? [...new Set(o.known.filter(x => typeof x === 'string' && Object.hasOwn(D.evidence, x)))] : [];
      s.deductions = Array.isArray(o.deductions) ? [...new Set(o.deductions.filter(x => Object.hasOwn(D.deductions, x) && D.deductions[x].ids.every(id => s.known.includes(id))))] : [];
      s.flags = freshFlags(); for (const k of Object.keys(s.flags)) s.flags[k] = o.flags?.[k] === true;
      s.xp = Number.isSafeInteger(o.xp) && o.xp >= 0 ? Math.min(o.xp, 10000) : 0;
      s.rewarded = Array.isArray(o.rewarded) ? o.rewarded.filter(x => typeof x === 'string').slice(0, 300) : [];
      s.visits = Array.isArray(o.visits) ? [...new Set(o.visits.filter(x => Object.hasOwn(D.rooms, x)))] : ['cabin'];
      s.timeline = Array.isArray(o.timeline) ? o.timeline.filter(x => Number.isInteger(x) && x > 0).slice(-300) : [];
      s.diary = Array.isArray(o.diary) ? o.diary.filter(x => x && typeof x.id === 'string' && typeof x.text === 'string').slice(-50).map(x => ({ id: x.id.slice(0, 50), text: x.text.slice(0, 500) })) : [];
      s.log = Array.isArray(o.log) ? o.log.filter(x => typeof x === 'string').slice(0, 50).map(x => x.slice(0, 500)) : [];
      s.ending = Object.hasOwn(D.endings, o.ending) ? o.ending : null;
      s.endingsSeen = Array.isArray(o.endingsSeen) ? [...new Set(o.endingsSeen.filter(x => Object.hasOwn(D.endings, x)))] : [];
      return s;
    } catch { return null; }
  }
  return { create, act, restore, gate, goal, ready, rescueMissing, has, deduced, data: D };
});
