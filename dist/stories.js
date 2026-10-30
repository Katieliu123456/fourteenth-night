(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.Night14Story=factory(root.Night14Data);})(typeof globalThis!=='undefined'?globalThis:this,function(D){
'use strict';if(D.story)return D.story;
const people={
 eileen:{name:'艾琳',role:'记得每一个夜晚的乘客',quote:'你可以不记得我。但这一次，请把话听完。',gender:'female'},
 doctor:{name:'林医生',role:'守着十四份病历的船医',quote:'你想要一个数字，还是十四个人的名字？',gender:'male'},
 captain:{name:'霍尔船长',role:'还没有宣布靠岸的船长',quote:'同一句命令，从你嘴里说出来，会变成不同的东西。',gender:'male'},
 louis:{name:'路易',role:'困在维护间的侍应',quote:'门能打开，之后我要站在哪一边？',gender:'male'},
 qin:{name:'秦雾',role:'替每位客人记住习惯的领班',quote:'你的杯子我还留着。你还记得里面从不放什么吗？',gender:'female'},
 suhe:{name:'苏禾',role:'给保存者写下姓名的护理员',quote:'他们不是编号。请先学会这样称呼他们。',gender:'female'},
 jichuan:{name:'纪川',role:'等待一次完整广播的信号员',quote:'海上最危险的，不是没有信号，是有人只肯说一半。',gender:'male'}
};
for(const[room,id,where]of[['lounge','qin','服务柜旁'],['clinic','suhe','病历架旁'],['deck','jichuan','备用信号台']])if(!D.rooms[room].objects.some(x=>x[0]===id))D.rooms[room].objects.push([id,people[id].name,where,people[id].quote,'talk']);
D.evidence.maintenance={title:'维护终端的纸带',type:'事实',source:'路易 · 手动维护记录',text:'离线纸带标注00:09：防护终端以旧领航者的授权身份执行投影，没有实体控制者。这份独立记录可以与监控和门禁日志相互印证。',xp:15};
D.deductions.projection.alternatives=[['video','logs','maintenance']];
const has=(s,id)=>s.known.includes(id),requireClue=(id,text)=>s=>has(s,id)?null:text;
const list={
 eileen:[
 {id:'listen',slot:'stance',label:'我不记得你，但我愿意听。',hint:'认真听完她的经历。',learn:['witness'],relation:1,reply:'“先别急着找出口。我的女儿还在下面。有人愿意听，苏禾也会愿意把名字给你看。”',impact:'艾琳开始信任你；这份信任会影响苏禾是否愿意帮忙。'},
 {id:'press',slot:'stance',label:'先告诉我谁在撒谎。',hint:'把调查放在她的经历之前。',learn:['witness'],relation:-1,reply:'“我记下了日期。你可以拿走，但别把我的话也当成一份可以用完就丢的证物。”',impact:'取得日期簿；艾琳与你保持了距离。'},
 {id:'music',slot:'music',label:'把未弹完的钢琴谱还给她。',need:requireClue('score','先找到给妈妈的钢琴谱。'),learn:['witness'],relation:2,story:{eileenMusic:true},reply:'“她写了最后一小节。请让她自己决定，还要不要弹完。”',impact:'她记住了你的善意；护理员会听说这件事。'}
 ],
 doctor:[
 {id:'listen',slot:'stance',label:'先解释风险，再让他们决定。',learn:['doctor'],relation:1,story:{careful:true},reply:'“那么先看病历。苏禾会帮愿意解释的人接通联络。”',impact:'苏禾会更愿意提供病历联络权限。'},
 {id:'hurry',slot:'stance',label:'我需要资料，其他的稍后再说。',learn:['doctor'],relation:-1,story:{careful:false},reply:'“资料可以给你。至于信任，请用别的事情来证明。”',impact:'仍可调查病历，但护理员会要求你先取得她的信任。'},
 {id:'records',slot:null,label:'请解释十四人与总人数的关系。',learn:['doctor','records'],reply:'“十四人包括在237人之内。直接断供，只会让223人离开。记录已经交给你。”',impact:'取得病历汇总，可以与名册交叉核对。'}
 ],
 captain:[
 {id:'cooperate',slot:'stance',label:'我想和你一起把237人带出去。',need:s=>has(s,'witness')&&has(s,'manifest')?null:'先了解日期簿与载客名册。',relation:1,flags:{pass:true,captainSupport:true},reply:'“通行证拿好。我会安排一个人守住远端开关。最后的决定，请不要再瞒着船员。”',impact:'本轮获得机舱通行与配电协助，可替代继电器或路易。'},
 {id:'authority',slot:'stance',label:'播放旧授权，以领航者身份要求开门。',need:requireClue('order','先调查船长原始授权。'),relation:-2,flags:{pass:true,captainSupport:false},reply:'“命令依旧有效。通行证给你。至于协助，我不会再把同一个夜晚押在一句命令上。”',impact:'本轮获得通行证，但船长不会提供配电协助。'}
 ],
 qin:[
 {id:'truth',slot:'stance',label:'我失去了记忆，连杯子也认不出来。',relation:1,flags:{staffKey:true},story:{qin:'truth'},reply:'“至少，这句话是真的。医务室的诊疗通行条在这里。不要拿它当作你已经回来的证明。”',impact:'本轮可在非接诊时间进入医务室。'},
 {id:'bluff',slot:'stance',label:'我当然记得。请照以前的安排。',relation:-1,flags:{guestPass:true},story:{qin:'bluff'},reply:'“那么驾驶楼的临时通行也照旧。纪川若问起你，请想好自己记得的到底是什么。”',impact:'本轮可进入驾驶室；纪川会要求额外记录来核实你的说法。'}
 ],
 suhe:[
 {id:'names',slot:'stance',label:'先告诉我他们的名字，我会听完。',need:s=>s.story?.careful||s.story?.eileenMusic||(s.relations?.eileen||0)>0||s.flags.locker?null:'先认真听艾琳或林医生的经历，也可解开备用柜证明调查来意。',relation:1,flags:{patientLink:true},learn:['records'],reply:'“我听说了你做的事。病历给你，联络线也会保留。找到真实的出路之后，再来说明。”',impact:'取得病历与本轮联络权限，之后可以在这里远程征求保存者同意。'},
 {id:'protocol',slot:'stance',label:'我尊重登记程序，先从公开记录查起。',learn:['doctor'],relation:0,reply:'“那就先看林医生说明的规则。备用柜与交接单都在房间里；我们还需要多认识彼此一点。”',impact:'取得医生说明，仍可通过原有调查路线获取病历。'},
 {id:'remote',slot:'remote',label:'接通保存者，说明转移风险并征求同意。',need:s=>!s.flags.patientLink?'本轮先取得护理员的联络权限。':!has(s,'boats')||!has(s,'transfer')?'先核实艇位与桥接方案。':null,flags:{consent:true,public:true},learn:['consent'],relation:1,reply:'“他们已经听清核心会报废的风险。十四份回应都在这里。请把他们的选择一并带出去。”',impact:'本轮在医务室取得14份知情授权，前往核心后无需再重复联络。'}
 ],
 jichuan:[
 {id:'full',slot:'broadcast',label:'公开完整风险，请船员一起协助撤离。',need:s=>!has(s,'boats')||!has(s,'transfer')?'先核实艇位与桥接方案。':s.story?.qin==='bluff'&&!has(s,'logs')?'纪川听说了你的说法，需要门禁日志来核实身份。':null,relation:1,flags:{radioSupport:true},story:{broadcast:'full'},reply:'“现在是一份可以执行的方案了。我接通远端开关，供电时就能帮你。”',impact:'本轮获得配电协助；公开广播也会在结局中留下回应。'},
 {id:'order',slot:'broadcast',label:'只广播离船命令，暂时隐去十四人的风险。',need:requireClue('boats','先核实可用艇位。'),relation:-1,flags:{radioSupport:false},story:{broadcast:'order'},reply:'“信号发出去了。但没有听清风险的船员，不会替你操作保存系统。请自己想办法。”',impact:'广播内容被记下，但无法获得远端配电协助。'},
 {id:'silent',slot:'broadcast',label:'先保持无线电静默，我独自调查。',relation:0,flags:{radioSupport:false},story:{broadcast:'silent'},reply:'“我会等。只是沉默同样会被他们听见。”',impact:'保留独自调查路线；纪川不会参与本轮配电。'}
 ],
 louis:[
 {id:'paper',slot:'paper',label:'把维护终端留下的纸带交给我。',learn:['maintenance'],relation:1,reply:'“自动终端会留下离线纸带。把它和录像、门禁记录放在一起，能看清是谁在扮演你。”',impact:'取得替代证据：即使错过甲板摄像头，也可以验证投影身份。'},
 {id:'stay',slot:'duty',label:'请留下来，帮我操作远端开关。',flags:{rescued:true},relation:1,reply:'“这次我会守在开关旁。你说开始，我就开始。”',impact:'路易继续提供本轮配电协助。'},
 {id:'leave',slot:'duty',label:'先去救生艇旁，协助乘客撤离。',flags:{rescued:false,louisEvac:true},relation:1,reply:'“我会去清点人数。这里的开关，请用继电器或找其他船员帮忙。”',impact:'路易离开维护间，不再提供本轮配电协助；结局会记录他的去向。'}
 ]
};
function getChoice(npc,id){return list[npc]?.find(c=>c.id===id);}
function previous(s,npc,slot){return slot&&(s.choices||[]).find(c=>c.cycle===s.cycle&&c.npc===npc&&getChoice(npc,c.choice)?.slot===slot);}
function available(s,npc){return(list[npc]||[]).map(c=>({...c,reason:previous(s,npc,c.slot)?'本轮已作出这一项选择。':c.need?.(s)||null}));}
function epilogue(s){const lines=[];if(s.story?.broadcast==='full')lines.push('纪川把完整的广播抄进航海日志。有人终于听见，这次离开需要每一个人的选择。');if(s.story?.broadcast==='order')lines.push('纪川保留了那份删去风险的广播。靠岸以后，仍有人会向你追问没有说出的部分。');if(s.story?.qin==='truth')lines.push('秦雾把没有姓名的杯子收回柜中。她记住的，是你承认自己遗忘的那一刻。');if(s.story?.qin==='bluff')lines.push('秦雾没有再问那只杯子的事。但在新的客人登记上，她留下了一个问号。');if(s.flags?.louisEvac)lines.push('路易站在救生艇旁清点人数。他记得是你让他先去等待那些人。');if(s.story?.eileenMusic)lines.push(s.ending==='rescue'?'艾琳终于能与女儿继续那一小节旋律。':'艾琳把你还给她的钢琴谱收好，那是一个被认真听完的故事。');return lines;}
D.people=people;const result={people,list,getChoice,previous,available,epilogue};D.story=result;return result;
});
