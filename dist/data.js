(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.Night14Data = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const rooms = {
    cabin: { name: '二等舱客房', en: 'CABIN 014', deck: '上层', tag: '你醒来的地方', description: '窗外只有黑色的海。墙上的钟刚刚走过午夜，而桌上那张乘船证，没有写你的名字。', exits: ['lounge', 'clinic', 'engine'], objects: [
      ['pass', '无名乘船证', '桌面', '一张被潮水浸过的证件。姓名栏仿佛被人刻意擦去。', 'inspect'],
      ['manual', '船员服务手册', '床头', '封面写着：请相信有来源的记录。', 'inspect'],
      ['reset', '床头的怀表', '床头', '指针始终指着 00:14。合上它，可以重新开始这一轮。', 'reset']
    ] },
    lounge: { name: '酒吧与娱乐厅', en: 'THE BLUE HOUR', deck: '上层', tag: '有人记得你', description: '一架无人弹奏的钢琴，反复响起同一小节。吧台旁的女人抬头看你，像是等了很久。', exits: ['cabin', 'deck'], objects: [
      ['eileen', '艾琳', '靠窗的座位', '她用手指反复摩挲一本薄薄的日期簿。', 'talk'],
      ['manifest', '载客名册', '服务台', '共 237 位乘客。可你总觉得，这份数字少了一段解释。', 'inspect'],
      ['route', '药品运送单', '吧台', '路易 · 00:05 · 服务梯。终点被红笔划掉。', 'inspect'],
      ['score', '未弹完的钢琴谱', '琴凳', '右上角是一笔稚嫩的签名：给妈妈。', 'inspect']
    ] },
    deck: { name: '外甲板', en: 'OPEN WATER', deck: '上层', tag: '海上没有岸', description: '海风带着盐和铁锈的味道。远处的航标每隔十四秒闪烁一次。救生艇安静地悬在船侧。', exits: ['lounge', 'bridge'], objects: [
      ['boats', '救生艇登记牌', '船侧', '艇位与人数，需要亲自核实。', 'inspect'],
      ['camera', '救生演练摄像头', '甲板入口', '00:09，红灯会亮起。那时，镜头会留下你的行程。', 'alibi'],
      ['hatch', '维修侧门', '驾驶楼梯旁', '门闩松动，里面的通道通向驾驶室。', 'inspect']
    ] },
    clinic: { name: '医务室', en: 'INFIRMARY', deck: '中层', tag: '十四张病历', description: '空气里是消毒水的气味。林医生把一叠文件压在手掌下，文件角上印着你不认识的符号。', exits: ['cabin', 'engine'], objects: [
      ['doctor', '林医生', '诊疗台', '“在你碰那些开关之前，先看看他们的病历。”', 'talk'],
      ['calendar', '值班板与交接单', '墙边', '两份记录都盖着同一天的日期。', 'inspect'],
      ['locker', '备用钥匙柜', '档案柜旁', '四位密码。手册里应该写着开柜的方法。', 'locker'],
      ['records', '保存舱病历汇总', '诊疗台', '这不是普通病房的记录。', 'inspect']
    ] },
    bridge: { name: '驾驶室', en: 'THE BRIDGE', deck: '上层', tag: '录像中的自己', description: '霍尔船长站在熄灭的航海图前。监控屏幕上一闪而过的人影，让你的心跳漏了一拍。', exits: ['deck', 'cabin'], objects: [
      ['captain', '霍尔船长', '舵轮旁', '他最在意的，似乎不是这艘船能否靠岸。', 'talk'],
      ['video', '00:09 监控录像', '监控屏', '画面上的人，有着和你一模一样的脸。', 'inspect'],
      ['logs', '分区门禁日志', '侧终端', '00:07 的封锁记录仍在。', 'inspect'],
      ['order', '船长原始授权', '航海桌', '熟悉的声音从老式录音器里传来。', 'inspect']
    ] },
    engine: { name: '机舱', en: 'THE ENGINE ROOM', deck: '下层', tag: '不要关闭保存', description: '齿轮的低鸣像一颗过分沉重的心脏。三条供电线路在墙上分开，其中一条延伸向标作“冷藏”的舱室。', exits: ['cabin', 'clinic', 'archive'], objects: [
      ['louis', '维护间的路易', '隔离门后', '门内传来三次敲击。', 'rescue'],
      ['relay', '延时继电器', '工具柜', '即使独自行动，也能控制远端开关。', 'inspect'],
      ['power', '配电控制台', '主控制台', '可用供能只有 6 单位。请先读每条线路的最低需求。', 'power'],
      ['transfer', '桥接转移技术卡', '维护终端', '一份还没有执行过的一次性转移方案。', 'inspect']
    ] },
    archive: { name: '隐藏保存舱', en: 'THE FOURTEEN', deck: '下层', tag: '他们都在等一个答案', description: '十四道微弱的光在玻璃后呼吸。门后夹着一封湿透的信，你认得信封上的笔迹。', exits: ['engine'], objects: [
      ['consent', '保存者的授权记录', '联络终端', '他们有权知道将要发生什么。', 'consent'],
      ['ticket', '浸湿的登船票', '门后信封', '第十四次登船。姓名栏依然空白。', 'inspect'],
      ['final', '循环控制核心', '舱室尽头', '维持、停止，或者尝试把每一个人带出去。', 'final']
    ] }
  };
  const evidence = {
    pass: { title: '无名乘船证', type: '事实', source: '二等舱客房 · 桌面', text: '证件照片与你相同，姓名却被抹去。编号 014，登记状态为“回访者”。', xp: 5 },
    manual: { title: '服务手册', type: '事实', source: '二等舱客房 · 床头', text: '医务室备用柜按值班日期的月日设码。船上的腕表可能故障，应以值班板和药品交接单互证。', xp: 5 },
    witness: { title: '艾琳的日期簿', type: '证词', source: '酒吧 · 艾琳', text: '“我已经死过三次。每次到了 00:14，就又回到这里。你也不是第一次登船。”日期簿记录着重复发生的细节。', xp: 20 },
    manifest: { title: '237 人的载客名册', type: '事实', source: '酒吧 · 服务台', text: '登记乘客总数 237。附注中的 14 名乘客由医务室直接管理，不参加甲板演练。', xp: 5 },
    route: { title: '路易的运送单', type: '事实', source: '酒吧 · 吧台', text: '药品运送路线：00:03 医务室，00:05 服务梯，00:07 维护间。所谓食品冷藏区实际接收的是生命维持药剂。', xp: 10 },
    score: { title: '给妈妈的钢琴谱', type: '事实', source: '酒吧 · 琴凳', text: '谱子停在第十四小节。背面写着：“妈妈，等我醒来，我们再一起弹完。”签名与保存舱病历中的女孩一致。', xp: 10 },
    boats: { title: '救生艇实测容量', type: '事实', source: '外甲板 · 救生艇', text: '核实可用艇位 240，足以容纳 237 名乘客。所有艇的应急供电独立于循环核心。', xp: 10 },
    hatch: { title: '驾驶室维修路线', type: '事实', source: '外甲板 · 维修侧门', text: '舷梯后的机械门可手动开启，通向驾驶室，不依赖船长的电子通行证。', xp: 10 },
    alibi: { title: '00:09 甲板行程', type: '事实', source: '外甲板 · 演练摄像头', text: '连续影像清楚记录你在 00:09 站在甲板。录像同轮保存，可与驾驶室的同刻画面交叉检查。', xp: 10 },
    calendar: { title: '一致的值班日期', type: '事实', source: '医务室 · 值班板与交接单', text: '值班板和盖章药品交接单均为 11 月 4 日。桌上的腕表停在 7 月 12 日，不能作为日期依据。', xp: 10 },
    records: { title: '14 人的保存病历', type: '事实', source: '医务室 · 病历柜', text: '14 名乘客的意识依附于保存系统。其余 223 人可独立离开循环。直接断供会使 14 名保存者消散；记录显示他们可以被转移。', xp: 10 },
    doctor: { title: '林医生的说明', type: '证词', source: '医务室 · 林医生', text: '“他们不是死去的影子。他们还能听见我们。转移需要可用艇位、一次性桥接电源，以及他们自己的同意。”', xp: 20 },
    video: { title: '00:09 驾驶室影像', type: '事实', source: '驾驶室 · 监控屏', text: '每轮 00:09，一张与你相同的脸出现在驾驶室监控。脚步声与影像不同步，且没有对应的实体开门记录。', xp: 10 },
    logs: { title: '来自终端的封锁', type: '事实', source: '驾驶室 · 门禁日志', text: '00:07 维护间封锁由“旧领航者防护终端”执行。00:09 的门控指令也来自同一终端，没有真人刷卡记录。', xp: 10 },
    order: { title: '旧主角的保存命令', type: '事实', source: '驾驶室 · 原始授权', text: '录音是你的声音：“在找到转移方法之前，任何人不得关闭保存。我会回来。”授权者：第零号领航者。', xp: 10 },
    relay: { title: '延时继电器用法', type: '事实', source: '机舱 · 工具柜', text: '将继电器设定后，可独自先后操作两处开关。它能替代路易的协助，但每轮需要重新取用。', xp: 5 },
    transfer: { title: '一次性桥接方案', type: '事实', source: '机舱 · 技术终端', text: '把循环核心改作一次性桥接电源，可以将 14 名保存者转移到独立载体。完成后核心报废，循环无法再次启动。先保证稳定配电。', xp: 10 },
    consent: { title: '14 份知情授权', type: '事实', source: '保存舱 · 联络终端', text: '在听完方法与风险后，14 名保存者均表达或确认了预先登记的同意。艾琳的女儿说：“请让我自己选择。”', xp: 20 },
    ticket: { title: '第十四次登船', type: '记忆', source: '保存舱 · 门后信封', text: '票面记着失忆前的 14 次历史访问。本轮是失忆后的首次访问。它所携带的记忆与权限，仍需要你完成最后的决定。', xp: 5 }
  };
  const deductions = {
    missing: { title: '路易被设备封锁', ids: ['route', 'logs'], text: '运送路线与 00:07 的门禁记录吻合。路易进入维护间后，被旧防护系统锁住；没有绑架者。', xp: 30 },
    passengers: { title: '237 人与 14 名保存者', ids: ['manifest', 'records'], text: '14 人属于 237 名乘客的一部分。直接停机能救 223 人，却会失去依附保存系统的 14 人。', xp: 30 },
    projection: { title: '另一个自己是授权投影', ids: ['video', 'logs', 'alibi'], text: '同轮 00:09 的两处画面、终端来源与门禁记录相互印证。驾驶室里的“你”是旧主角的防护投影，不是另一个自由行动的真人。', xp: 30 }
  };
  const endings = {
    maintain: { name: '永远的今夜', en: 'THE NIGHT REMAINS', saved: '237 人暂时存续', price: '循环继续，14 名保存者仍未获自由。你承担继续寻找出路的承诺。', quote: '“这一次，别再忘记我们。”', text: '你重新接通循环。玻璃后的呼吸仍在，甲板的灯也重新亮起。你带回记忆，却把一个尚未兑现的承诺留在了船上。' },
    stop: { name: '终于靠岸', en: 'AT LAST, THE SHORE', saved: '223 人离开循环', price: '14 名依附系统的保存者消散。这个决定不可撤销。', quote: '“原来，告别也可以由我来决定。”', text: '核心的光缓缓熄灭。海平线第一次出现晨色，救生艇向光驶去。你记住了十四个名字，也记住了由自己确认的代价。' },
    rescue: { name: '无人被遗忘', en: 'NO ONE LEFT BEHIND', saved: '237 人离开保存海域', price: '循环核心永久损毁。这套装置不能再救第二次，历史上的损失不会因此消失。', quote: '“妈妈，我们把最后一小节弹完吧。”', text: '桥接完成，十四道光依次离开玻璃。最后一艘艇驶出海域时，永夜号的时钟停住了。这次停住的不是他们的人生。' }
  };
  return { rooms, evidence, deductions, endings };
});
