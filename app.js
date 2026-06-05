/*
 * app.js — behavior layer for "어디에 버리지?"
 * Search matching, result rendering, language switching, modal handling.
 * Depends on the globals defined in data.js (LANGS, COPY, META, FALLBACK_BAG).
 */
let cur = "ko";

function getReason(m){
  const d=(m.d||'');
  const lang=cur || 'ko';
  const R={
    ko:{
      special:'기름류는 배수구에 흘려보내면 하수관 막힘과 악취의 원인이 될 수 있어요. 양에 따라 흡수 후 배출하거나 지정된 수거함을 이용하는 것이 안전합니다.',
      bone:'뼈와 가시는 단단하고 날카로워 음식물 처리시설에서 잘게 분쇄되기 어렵고, 사료화·퇴비화 과정에도 적합하지 않아요.',
      shell:'단단한 껍질류는 음식물처럼 보여도 처리시설에서 잘 분해되지 않아요. 음식물쓰레기가 아니라 종량제봉투 배출 대상입니다.',
      seed:'딱딱한 씨앗과 과일 핵은 쉽게 분해되지 않고 처리설비에 부담을 줄 수 있어요. 종량제봉투에 넣어 배출하는 것이 맞습니다.',
      dry:'물기가 적고 섬유질이나 이물 성분이 남는 항목은 음식물 재활용 처리에 적합하지 않아요. 충분히 말린 뒤 종량제봉투에 배출하세요.',
      general:'음식에서 나온 것이라도 단단하거나 섬유질이 강해 음식물 재활용 처리에 맞지 않으면 일반쓰레기로 배출합니다.',
      salt:'음식물 처리 대상이지만 염분과 물기가 많을 수 있어요. 국물과 수분을 최대한 제거한 뒤 배출하면 악취와 처리 부담을 줄일 수 있습니다.',
      fruit:'과일 껍질처럼 비교적 부드러운 음식 잔재물은 음식물 처리시설에서 재활용할 수 있어요. 큰 조각은 작게 자르고 물기를 빼주세요.',
      meat:'살·내장·지방처럼 부드러운 부분은 음식물 처리 대상이에요. 단, 큰 뼈나 날카로운 가시는 종량제봉투로 분리해야 합니다.',
      food:'부드러운 음식물 잔재물은 사료화·퇴비화 등 재활용 처리에 적합해 음식물쓰레기로 분류합니다. 물기와 이물질은 먼저 제거해주세요.'
    },
    en:{
      special:'Oil should not be poured down the drain because it can clog pipes and cause odors. Depending on the amount, absorb it with paper or use a dedicated collection box.',
      bone:'Bones and fish spines are hard or sharp, so they are difficult to crush in food-waste facilities and are not suitable for recycling into feed or compost.',
      shell:'Hard shells may look like food waste, but they do not break down well in processing facilities. They should go in a standard waste bag.',
      seed:'Hard seeds and fruit pits do not break down easily and can burden processing equipment. Place them in a standard waste bag.',
      dry:'Dry, fibrous, or residue-heavy items are not suitable for food-waste recycling. Dry them thoroughly and place them in a standard waste bag.',
      general:'Even if an item comes from food, it should be disposed of as general waste if it is hard, fibrous, or unsuitable for food-waste recycling.',
      salt:'This is food waste, but it may contain a lot of liquid or salt. Drain liquid and remove excess moisture to reduce odor and processing burden.',
      fruit:'Soft fruit peels and similar food scraps can be processed as food waste. Cut large pieces smaller and remove excess moisture.',
      meat:'Soft meat, innards, and fat can be food waste. Large bones and sharp spines should be separated as general waste.',
      food:'Soft food scraps are classified as food waste because they can be recycled into feed or compost. Remove liquid and non-food materials first.'
    },
    zh:{
      special:'食用油不要倒入下水道，可能造成管道堵塞和异味。少量可用纸吸附后投放，大量请使用专用回收方式。',
      bone:'骨头和鱼刺较硬或尖锐，在食物垃圾处理设施中不易粉碎，也不适合饲料化或堆肥处理。',
      shell:'坚硬外壳虽然来自食物，但在处理设施中不易分解，应作为普通垃圾投放。',
      seed:'坚硬果核和种子不易分解，也可能增加处理设备负担，应投放到普通垃圾袋。',
      dry:'干燥、纤维多或残渣较多的物品不适合食物垃圾处理，请充分晾干后作为普通垃圾投放。',
      general:'即使来自食物，只要过硬、纤维强或不适合食物垃圾再利用，就应作为普通垃圾投放。',
      salt:'属于食物垃圾，但可能含水量或盐分较高。请尽量去除汤汁和水分后投放。',
      fruit:'较软的水果皮等食物残渣可作为食物垃圾处理。大块请切小并去除多余水分。',
      meat:'肉、内脏、脂肪等柔软部分可作为食物垃圾。大骨头和尖锐鱼刺请分开作为普通垃圾。',
      food:'柔软的食物残渣可再利用为饲料或堆肥，因此归类为食物垃圾。请先去除水分和异物。'
    },
    vi:{
      special:'Không đổ dầu ăn xuống cống vì có thể gây tắc nghẽn và mùi hôi. Tùy lượng dầu, hãy thấm bằng giấy hoặc dùng thùng thu gom chuyên dụng.',
      bone:'Xương và xương cá cứng hoặc sắc, khó nghiền trong cơ sở xử lý rác thực phẩm và không phù hợp để tái chế thành thức ăn chăn nuôi hoặc phân compost.',
      shell:'Vỏ cứng tuy có nguồn gốc từ thực phẩm nhưng không phân hủy tốt trong cơ sở xử lý. Hãy bỏ vào túi rác tiêu chuẩn.',
      seed:'Hạt cứng và lõi quả không dễ phân hủy và có thể gây áp lực cho thiết bị xử lý. Hãy bỏ vào túi rác tiêu chuẩn.',
      dry:'Các mục khô, nhiều xơ hoặc có nhiều cặn không phù hợp với xử lý rác thực phẩm. Hãy làm khô kỹ rồi bỏ vào túi rác tiêu chuẩn.',
      general:'Dù có nguồn gốc từ thực phẩm, nếu cứng, nhiều xơ hoặc không phù hợp để tái chế rác thực phẩm thì cần bỏ như rác thường.',
      salt:'Đây là rác thực phẩm, nhưng có thể nhiều nước hoặc muối. Hãy loại bỏ nước thừa để giảm mùi và giảm gánh nặng xử lý.',
      fruit:'Vỏ trái cây mềm và các phần thức ăn tương tự có thể xử lý như rác thực phẩm. Hãy cắt nhỏ miếng lớn và vắt bớt nước.',
      meat:'Thịt mềm, nội tạng và mỡ có thể là rác thực phẩm. Xương lớn và xương sắc cần tách riêng như rác thường.',
      food:'Phần thức ăn mềm được phân loại là rác thực phẩm vì có thể tái chế thành thức ăn chăn nuôi hoặc phân compost. Hãy loại bỏ nước và vật lạ trước.'
    }
  }[lang] || R.ko;

  if(m.c==='special') return R.special;
  if(m.c==='general'){
    if(/뼈|가시|지느러미|骨|xương|bone|spine/i.test(d)) return R.bone;
    if(/껍|껍데기|껍질|壳|vỏ|shell|skin|peel/i.test(d)) return R.shell;
    if(/씨|핵|籽|核|hạt|seed|pit/i.test(d)) return R.seed;
    if(/커피|티백|한약|사료|coffee|tea|herb|cà phê/i.test(d)) return R.dry;
    return R.general;
  }
  if(/김치|배추|무|장류|간장|젓갈|泡菜|kimchi|doenjang|gochujang|cải|muối/i.test(d)) return R.salt;
  if(/과일|수박|바나나|사과|귤|水果|trái cây|dưa hấu|banana|fruit|peel/i.test(d)) return R.fruit;
  if(/생선|고기|지방|fish|meat|cá|thịt/i.test(d)) return R.meat;
  return R.food;
}

function escapeHtml(v){
  return String(v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function cleanForLang(text){
  let v=String(text||'');
  if(cur==='en'){
    v=v.replace(/\s*\((종량제봉투|음식물쓰레기봉투)\)/g,'');
    v=v.replace(/종량제봉투/g,'standard waste bag').replace(/음식물쓰레기봉투/g,'food waste bag');
  }
  return v;
}

function setLang(k){
  cur=k;
  const l=LANGS[k];
  const copy=COPY[k]||COPY.ko;
  document.documentElement.lang=k;
  document.querySelectorAll('.lb').forEach(b=>b.classList.toggle('on', b.dataset.l===k));
  document.getElementById('kicker').textContent=copy.kicker;
  document.querySelector('h1').innerHTML=copy.title;
  document.querySelector('.sub').textContent=copy.sub;
  document.getElementById('q').placeholder=copy.ph;
  document.getElementById('sb').textContent=copy.btn;
  document.getElementById('critFoodTitle').textContent=copy.criteria.food[0];
  document.getElementById('critFoodDesc').textContent=copy.criteria.food[1];
  document.getElementById('critGeneralTitle').textContent=copy.criteria.general[0];
  document.getElementById('critGeneralDesc').textContent=copy.criteria.general[1];
  document.getElementById('critSpecialTitle').textContent=copy.criteria.special[0];
  document.getElementById('critSpecialDesc').textContent=copy.criteria.special[1];
  document.getElementById('helperEnter').textContent=copy.helper[0];
  document.getElementById('helperReason').textContent=copy.helper[1];
  document.getElementById('helperSteps').textContent=copy.helper[2];
  document.getElementById('contactTitle').textContent=copy.contact.title;
  document.getElementById('contactSubtitle').textContent=copy.contact.subtitle;
  document.getElementById('contactAreaA').textContent=copy.contact.a;
  document.getElementById('contactAreaB').textContent=copy.contact.b;
  document.getElementById('contactSection').setAttribute('aria-label', copy.contact.title);
  document.querySelector('.langs').setAttribute('aria-label', k==='ko' ? '언어 선택' : 'Language selection');
  buildChips(l);
  document.getElementById('q').focus();
}

function buildChips(l){
  const c=document.getElementById('ch');
  c.innerHTML='';
  l.sg.slice(0,8).forEach(s=>{
    const el=document.createElement('button');
    el.type='button';
    el.className='chip';
    el.textContent=s;
    el.onclick=()=>{document.getElementById('q').value=s; go();};
    c.appendChild(el);
  });
}

function findMatches(raw){
  const l=LANGS[cur];
  const q=l.norm(raw);
  if(!q) return [];
  return l.db
    .map(item=>{
      let score=0;
      for(const t of item.t){
        const nt=l.norm(t);
        if(nt===q) score=Math.max(score,100);
        else if(nt.startsWith(q)||q.startsWith(nt)) score=Math.max(score,75);
        else if(nt.includes(q)||q.includes(nt)) score=Math.max(score,55);
        else if(nt.split(' ').some(w=>w.length>1&&q.includes(w))) score=Math.max(score,30);
      }
      return {...item, score};
    })
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,3);
}

function go(){
  const raw=document.getElementById('q').value.trim();
  const copy=(COPY[cur]||COPY.ko).modal;
  if(!raw){
    openModal(escapeHtml(copy.inputTitle), `<div class="no-result">${escapeHtml(copy.inputMsg)}</div>`);
    return;
  }
  const matches=findMatches(raw);
  if(!matches.length){
    const noResultBody = cur==='en'
      ? `<div class="no-result"><strong>${escapeHtml(raw)}</strong>${copy.noResultMsg}</div>`
      : `<div class="no-result"><strong>${escapeHtml(raw)}</strong>${copy.noResultMsg}</div>`;
    openModal(escapeHtml(copy.noResultTitle), `${noResultBody}<div class="modal-actions"><button class="secondary" onclick="closeModal();document.getElementById('q').focus();">${escapeHtml(copy.retry)}</button></div>`);
    return;
  }
  const title=matches.length===1 ? escapeHtml(copy.result) : copy.many(matches.length);
  const body=matches.map(renderResult).join('') + `<div class="modal-actions"><button class="secondary" onclick="closeModal();document.getElementById('q').select();">${escapeHtml(copy.another)}</button></div>`;
  openModal(title, body);
}

function getActionText(c, bag){
  const action={
    ko:{food:`${bag}에 버려주세요`, general:`${bag}에 버려주세요`, special:'별도 처리 방법을 확인하세요'},
    en:{food:`Place it in a ${bag}`, general:`Place it in a ${bag}`, special:'Check the separate handling steps'},
    zh:{food:`请投入${bag}`, general:`请投入${bag}`, special:'请确认单独处理方法'},
    vi:{food:`Bỏ vào ${bag}`, general:`Bỏ vào ${bag}`, special:'Kiểm tra cách xử lý riêng'}
  };
  const lang=action[cur] ? cur : 'ko';
  return action[lang][c] || action[lang].general;
}

function getDisplaySteps(m){
  const d=m.d||'';
  if(/달걀|계란|메추리알|Egg|egg|蛋|trứng/i.test(d) && m.c==='general'){
    const eggSteps={
      ko:['내용물을 비워주세요','껍데기는 종량제봉투에 넣어 배출하세요','알 속 내용물만 음식물쓰레기로 배출할 수 있어요'],
      en:['Empty out any remaining contents','Place the shells in a standard waste bag','Only the egg contents can be disposed of as food waste'],
      zh:['请先倒空蛋内残留物','蛋壳请投入普通垃圾袋','只有蛋液可以作为食物垃圾投放'],
      vi:['Làm sạch phần bên trong nếu còn sót lại','Bỏ vỏ trứng vào túi rác tiêu chuẩn','Chỉ phần bên trong trứng có thể bỏ như rác thực phẩm']
    };
    return eggSteps[cur] || eggSteps.ko;
  }
  return m.s.map(cleanForLang);
}

function renderResult(m){
  const l=LANGS[cur];
  const meta=META[m.c];
  const copy=(COPY[cur]||COPY.ko).modal;
  const label=(l.ui && l.ui.tl && l.ui.tl[m.c]) ? l.ui.tl[m.c] : meta.ko;
  const bag=(FALLBACK_BAG[cur] && FALLBACK_BAG[cur][m.c]) ? FALLBACK_BAG[cur][m.c] : ((l.ui && l.ui.bl && l.ui.bl[m.c]) ? l.ui.bl[m.c] : meta.bag);
  const action=getActionText(m.c, bag || meta.bag);
  const steps=getDisplaySteps(m);
  return `<article class="result-card">
    <section class="result-hero ${m.c}">
      <div class="result-icon" aria-hidden="true">${meta.icon}</div>
      <div class="result-copy">
        <div class="result-kicker">✓ ${escapeHtml(copy.result)}</div>
        <div class="result-label">${escapeHtml(label)}</div>
        <div class="result-action">${escapeHtml(action)}</div>
      </div>
    </section>

    <div class="item-block">
      <span>${escapeHtml(copy.item)}</span>
      <strong>${escapeHtml(cleanForLang(m.d))}</strong>
    </div>

    <div class="section">
      <h3>${escapeHtml(copy.criteria)}</h3>
      <p class="reason">${escapeHtml((meta.rule && meta.rule[cur]) ? meta.rule[cur] : meta.rule.ko)}</p>
    </div>
    <div class="section">
      <h3>${escapeHtml(copy.why)}</h3>
      <p class="reason">${escapeHtml(getReason(m))}</p>
    </div>
    <div class="section">
      <h3>${escapeHtml(copy.how)}</h3>
      <div class="steps">${steps.map((s,i)=>`<div class="step"><span class="num">${i+1}</span><span>${escapeHtml(s)}</span></div>`).join('')}</div>
    </div>
  </article>`;
}

function openModal(title, body){
  document.getElementById('modalTitle').innerHTML=title;
  document.getElementById('modalBody').innerHTML=body;
  document.getElementById('modalBackdrop').classList.add('show');
}
function closeModal(){document.getElementById('modalBackdrop').classList.remove('show');}

const lr=document.getElementById('lr');
Object.entries(LANGS).forEach(([k,v])=>{
  const b=document.createElement('button');
  b.className='lb'; b.dataset.l=k; b.type='button'; b.textContent=v.name;
  b.onclick=()=>setLang(k);
  lr.appendChild(b);
});
document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
document.getElementById('modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
setLang('ko');
