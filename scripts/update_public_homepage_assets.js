const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const viewerDir = path.join(root, "viewer");
const mappingName = fs.readdirSync(viewerDir).find(name => name.includes("5083") && name.includes("DB_v1.md"));

if (!mappingName) {
  throw new Error("Image mapping DB not found");
}

const mappingPath = path.join(viewerDir, mappingName);
let html = fs.readFileSync(htmlPath, "utf8");
const mapping = fs.readFileSync(mappingPath, "utf8");

const regionVisualSource = {
  "레오니아": ["ck5083-heraldry-leonia-imagegen-v3-dragon-crest-2048-labeled.webp", "ck5083-city-leonia-radarhal-imagegen-v1-2560-labeled.webp", "라드아르할", "궁정과 기사 봉토가 이어지는 레오니아의 중심 도시입니다."],
  "노르가르드": ["ck5083-heraldry-norghard-imagegen-v1-2048-labeled.webp", "ck5083-city-norghard-marnabmir-imagegen-v1-2560-labeled.webp", "마르나브미르", "군항과 철강 부두, 겨울 보급 장부가 모이는 노르가르드의 큰 항구입니다."],
  "티리스": ["ck5083-heraldry-tiris-imagegen-v1-2048-labeled.webp", "ck5083-city-tiris-radbarhal-imagegen-v1-2560-labeled.webp", "라드바르할", "영지 장터와 서부 접경 소식이 왕국 안쪽으로 모이는 티리스의 중심 도시입니다."],
  "린레네트": ["ck5083-heraldry-linrenet-imagegen-v1-2048-labeled.webp", "ck5083-city-linrenet-renumga-imagegen-v1-2560-labeled.webp", "레눔가", "기록원, 사본 장터, 후원 계약이 길을 여는 린레네트의 학예 도시입니다."],
  "벡도레트": ["ck5083-heraldry-bekdoret-imagegen-v1-2048-labeled.webp", "ck5083-city-bekdoret-dorkar-imagegen-v1-2560-labeled.webp", "도르카르", "성문 보증과 통행 절차가 촘촘한 벡도레트의 교통 거점입니다."],
  "센할레트": ["ck5083-heraldry-senhalet-imagegen-v1-2048-labeled.webp", "ck5083-city-senhalet-senpukum-imagegen-v1-2560-labeled.webp", "센푸쿰", "곡물 창고와 배급 순서가 사람들의 하루를 가르는 센할레트의 중심지입니다."],
  "헤스페레트": ["ck5083-heraldry-hesferet-imagegen-v2-no-runes-2048-labeled.webp", "ck5083-city-hesferet-hespukum-imagegen-v1-2560-labeled.webp", "헤스푸쿰", "추위, 저장품, 통행 허가가 함께 계산되는 헤스페레트의 북방 거점입니다."],
  "켈나베트": ["ck5083-heraldry-kelnabet-imagegen-v1-2048-labeled.webp", "ck5083-city-kelnabet-markelmir-imagegen-v1-2560-labeled.webp", "마르켈미르", "선장 보증과 해도, 항만 장부가 힘을 갖는 켈나베트의 항구입니다."],
  "헤스베케트": ["ck5083-heraldry-hesbeket-imagegen-v1-2048-labeled.webp", "ck5083-city-hesbeket-bekhespukum-imagegen-v1-2560-labeled.webp", "베크헤스푸쿰", "식량과 불씨, 방한구가 곧 생존인 혹한권 도시입니다."],
  "옌메베트": ["ck5083-heraldry-yenmebet-imagegen-v1-2048-labeled.webp", "ck5083-city-yenmebet-yenwokel-imagegen-v1-2560-labeled.webp", "옌워켈", "숲 경계와 표식권, 벌목 허락이 맞물리는 옌메베트의 거점입니다."],
  "님나레트": ["ck5083-heraldry-nimnaret-imagegen-v1-2048-labeled.webp", "ck5083-city-nimnaret-yalbekum-imagegen-v1-2560-labeled.webp", "얄베크움", "강가 문서와 학술 후원이 장터의 신용까지 움직이는 님나레트의 중심지입니다."],
  "실니메트": ["ck5083-heraldry-silnimet-imagegen-v1-2048-labeled.webp", "ck5083-city-silnimet-dorsorsan-imagegen-v1-2560-labeled.webp", "도르소르산", "산악 길과 수도원, 약초 장부가 생활을 지탱하는 실니메트의 산지 도시입니다."],
  "아르도레트": ["ck5083-heraldry-ardolet-imagegen-v1-2048-labeled.webp", "ck5083-city-ardolet-dorsorhal-imagegen-v1-2560-labeled.webp", "도르소르할", "강하 수로와 남방 교역이 만나는 아르도레트의 대표 거점입니다."],
  "가르메베트": ["ck5083-heraldry-garmebet-imagegen-v1-2048-labeled.webp", "ck5083-city-garmebet-tikmebhal-imagegen-v1-2560-labeled.webp", "틱메브할", "초지의 물권, 동행료, 가축 장부가 도시 기능을 대신하는 가르메베트의 거점입니다."],
  "실할레트": ["ck5083-heraldry-silhalet-imagegen-v1-2048-labeled.webp", "ck5083-city-silhalet-silsorsan-imagegen-v1-2560-labeled.webp", "실소르산", "남방 산로와 항로의 물자가 쉬어 가는 실할레트의 산악 거점입니다."],
  "메르할레트": ["ck5083-heraldry-merhalet-imagegen-v1-2048-labeled.webp", "ck5083-city-merhalet-merbelmar-imagegen-v1-2560-labeled.webp", "메르벨마르", "항만세와 장부 신용, 수로 물자가 모이는 메르할레트의 물길 도시입니다."],
  "님소레트": ["ck5083-heraldry-nimsolet-imagegen-v1-2048-labeled.webp", "ck5083-city-nimsolet-nimhal-imagegen-v1-2560-labeled.webp", "님할", "강하 교역과 습지 장터가 이어지는 님소레트의 중심 거점입니다."],
  "실바니아": ["ck5083-heraldry-sylvania-imagegen-v1-2048-labeled.webp", "ck5083-city-sylvania-silensan-imagegen-v1-2560-labeled.webp", "실렌산", "숲의 허락과 산길 표식이 사람의 움직임을 정하는 실바니아의 성림 도시입니다."],
  "드래곤스파이어": ["ck5083-heraldry-dragonspire-imagegen-v1-2048-labeled.webp", "ck5083-city-dragonspire-narmarkel-imagegen-v1-2560-labeled.webp", "나르마르켈", "화산 항로와 섬의 창고가 맞물린 드래곤스파이어의 도시입니다."],
  "펜리르의 눈": ["ck5083-heraldry-fenrir-eye-imagegen-v1-2048-labeled.webp", "ck5083-city-fenrir-eye-dunartore-imagegen-v1-2560-labeled.webp", "둔아르토르", "외해 등대와 난파 기록이 모이는 금기 해역의 거점입니다."]
};

const regionVisuals = Object.fromEntries(Object.entries(regionVisualSource).map(([name, data]) => [name, {
  crest: `./viewer/assets/illustrations/generated_outputs/heraldry/${data[0]}`,
  capital: `./viewer/assets/illustrations/generated_outputs/city_vistas/${data[1]}`,
  capitalName: data[2],
  capitalCaption: data[3],
  crestCaption: `${name}의 문장입니다. 깃발, 봉인, 병영 표식에서 가장 먼저 보이는 얼굴입니다.`
}]));

const cityRows = [];
for (const line of mapping.split(/\r?\n/)) {
  if (!line.includes("city_vistas") || !line.trim().startsWith("|")) continue;
  const cells = line.split("|").map(cell => cell.trim());
  if (cells.length < 5 || !/^\d+$/.test(cells[1])) continue;
  cityRows.push({ region: cells[2], path: cells[4] });
}

const cityCounts = new Map();
const citySlides = cityRows.map(row => {
  const index = (cityCounts.get(row.region) || 0) + 1;
  cityCounts.set(row.region, index);
  return {
    title: `${row.region} 도시 전경 ${index}`,
    src: `./viewer/${row.path}`,
    alt: `${row.region} 도시 전경 ${index}`,
    caption: `${row.region} 권역의 도시와 거점입니다. 성벽, 장터, 항구, 창고, 산길 같은 생활 표면을 한 장씩 볼 수 있습니다.`
  };
});

const villageSlides = [
  ["라드가르가", "./viewer/assets/illustrations/single_slides/village-leonia-radgarga.jpg", "레오니아 라드가르가 봉토 마을", "레오니아 봉토 주변의 마을입니다. 추천장과 문장, 납품 순서가 중요합니다."],
  ["가르푸크가", "./viewer/assets/illustrations/single_slides/village-tiris-garpukga.jpg", "티리스 가르푸크가 영지 장터 마을", "티리스 영지 장터 마을입니다. 곡물, 보증인, 공동 창고가 장면의 중심입니다."],
  ["마르토르가", "./viewer/assets/illustrations/single_slides/village-norghard-martorga.jpg", "노르가르드 마르토르가 해안 마을", "군항 뒤편의 해안 마을입니다. 선박 보급과 겨울 준비가 빠르게 오갑니다."],
  ["해안 어항", "./viewer/assets/illustrations/single_slides/village-coastal-fishing-harbor.jpg", "비레스 해안 어항", "고기와 소금, 작은 선착장이 하루의 값을 정하는 해안 정착지입니다."],
  ["산길 숙소촌", "./viewer/assets/illustrations/single_slides/village-mountain-pass-lodging-outpost.jpg", "비레스 산길 숙소촌", "고개를 넘는 사람에게 하룻밤의 불빛과 방한구가 은화보다 먼저 필요한 곳입니다."],
  ["감시 초소촌", "./viewer/assets/illustrations/single_slides/village-watch-checkpoint.jpg", "비레스 감시 초소촌", "검문과 허가, 지나가는 짐의 기록이 매일 쌓이는 작은 초소 마을입니다."]
].map(([title, src, alt, caption]) => ({ title, src, alt, caption }));

function replaceBetween(source, startNeedle, endNeedle, replacement) {
  const start = source.indexOf(startNeedle);
  const end = source.indexOf(endNeedle, start);
  if (start < 0 || end < 0) {
    throw new Error(`Cannot replace block from ${startNeedle} to ${endNeedle}`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

const regionVisualsBlock = `    const regionVisuals = ${JSON.stringify(regionVisuals, null, 6)};\n\n`;
if (html.includes("    const regionVisuals = ")) {
  html = replaceBetween(html, "    const regionVisuals = ", "    const readerSections = [", regionVisualsBlock);
} else {
  html = html.replace("    const readerSections = [", `${regionVisualsBlock}    const readerSections = [`);
}

const slideBlock = `    const citySlides = ${JSON.stringify(citySlides, null, 6)};\n\n    const villageSlides = ${JSON.stringify(villageSlides, null, 6)};\n\n`;
if (html.includes("    const citySlides = ")) {
  html = replaceBetween(html, "    const citySlides = ", "    const regionGrid", slideBlock);
} else if (html.includes("    const extraSlides = ")) {
  html = replaceBetween(html, "    const extraSlides = ", "    const regionGrid", slideBlock);
} else {
  throw new Error("No slide data block found");
}

function injectedRenderRegionButtons() {
      regionGrid.innerHTML = regions.map((region, index) => {
        const visuals = regionVisuals[region.name];
        const crest = visuals ? `<img class="region-card-crest" loading="lazy" src="${visuals.crest}" alt="${region.name} 문장">` : "";
        return `
          <button class="region-button" type="button" data-index="${index}" aria-pressed="${index === 0 ? "true" : "false"}">
            ${crest}
            <span class="region-card-text"><strong>${region.name}</strong><span>${region.short}</span></span>
          </button>
        `;
      }).join("");

      regionGrid.querySelectorAll(".region-button").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index);
          regionGrid.querySelectorAll(".region-button").forEach(item => item.setAttribute("aria-pressed", "false"));
          button.setAttribute("aria-pressed", "true");
          renderRegionDetail(index);
        });
      });
    }

function injectedRenderRegionDetail(index) {
      const region = regions[index];
      const visuals = regionVisuals[region.name];
      const visualSlides = visuals ? [
        { title: `${region.name} 문장`, src: visuals.crest, alt: `${region.name} 문장`, caption: visuals.crestCaption },
        { title: visuals.capitalName, src: visuals.capital, alt: `${region.name} 대표 도시 ${visuals.capitalName}`, caption: visuals.capitalCaption }
      ] : [];
      const visualHtml = visuals ? `
        <aside class="region-hero-visual" style="--region-bg: url('${visuals.capital}')" aria-label="${region.name} 대표 도시와 문장">
          <button class="region-bg-button" type="button" data-visual-index="1" aria-label="${visuals.capitalName} 크게 보기"></button>
          <div class="region-hero-overlay">
            <button class="region-crest-badge" type="button" data-visual-index="0" aria-label="${region.name} 문장 크게 보기">
              <img loading="lazy" src="${visuals.crest}" alt="${region.name} 문장">
            </button>
            <span><b>${visuals.capitalName}</b>${visuals.capitalCaption}</span>
          </div>
        </aside>
      ` : "";

      regionDetail.innerHTML = `
        <div class="detail-layout">
          <div class="region-copy">
            <div class="type">${region.type}</div>
            <h3>${region.name}</h3>
            <p>${region.short}</p>
          </div>
          ${visualHtml}
          <div class="detail-grid">
            <div class="detail-item"><b>첫 장면</b><span>${region.first}</span></div>
            <div class="detail-item"><b>주요 장소</b><span>${region.places}</span></div>
            <div class="detail-item"><b>사는 모습</b><span>${region.life}</span></div>
            <div class="detail-item"><b>지금 문제</b><span>${region.pressure}</span></div>
            <div class="detail-item"><b>남은 기억</b><span>${region.memory}</span></div>
            <div class="detail-item"><b>어울리는 시작</b><span>${region.persona}</span></div>
          </div>
        </div>
      `;

      regionDetail.querySelectorAll("[data-visual-index]").forEach(button => {
        button.addEventListener("click", () => openLightbox(visualSlides, Number(button.dataset.visualIndex)));
      });
    }

function emitFunction(fn, fromName, toName) {
  return fn.toString()
    .replace(`function ${fromName}`, `function ${toName}`)
    .split("\n")
    .map(line => `    ${line}`)
    .join("\n");
}

const renderFunctions = `${emitFunction(injectedRenderRegionButtons, "injectedRenderRegionButtons", "renderRegionButtons")}\n\n${emitFunction(injectedRenderRegionDetail, "injectedRenderRegionDetail", "renderRegionDetail")}\n\n`;
html = replaceBetween(html, "    function renderRegionButtons()", "    function renderReader()", renderFunctions);
html = html.replace("    renderImageSlider(\"extraSlider\", extraSlides);", "    renderImageSlider(\"citySlider\", citySlides);\n    renderImageSlider(\"villageSlider\", villageSlides);");

const missingAssets = [];
for (const visual of Object.values(regionVisuals)) {
  for (const asset of [visual.crest, visual.capital]) {
    const localPath = path.join(root, asset.replace("./", ""));
    if (!fs.existsSync(localPath)) missingAssets.push(asset);
  }
}
for (const slide of citySlides) {
  const localPath = path.join(root, slide.src.replace("./", ""));
  if (!fs.existsSync(localPath)) missingAssets.push(slide.src);
}
if (missingAssets.length) {
  throw new Error(`Missing assets:\n${missingAssets.join("\n")}`);
}

fs.writeFileSync(htmlPath, html, "utf8");
console.log(JSON.stringify({
  mappingName,
  regionVisuals: Object.keys(regionVisuals).length,
  citySlides: citySlides.length,
  villageSlides: villageSlides.length
}, null, 2));
