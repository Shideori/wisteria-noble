const appState = {
  outfits: [],
  selectedPrompts: new Map(),
  activeSeriesId: null,
};

const elements = {
  seriesGrid: document.querySelector("#seriesGrid"),
  statusMessage: document.querySelector("#statusMessage"),
  selectedPromptCount: document.querySelector("#selectedPromptCount"),
  openPromptPanelButton: document.querySelector("#openPromptPanelButton"),
  closePromptPanelButton: document.querySelector("#closePromptPanelButton"),
  promptPanel: document.querySelector("#promptPanel"),
  promptPanelBackdrop: document.querySelector("#promptPanelBackdrop"),
  selectedPromptList: document.querySelector("#selectedPromptList"),
  emptyPromptState: document.querySelector("#emptyPromptState"),
  promptOutput: document.querySelector("#promptOutput"),
  copyAllPromptButton: document.querySelector("#copyAllPromptButton"),
  clearPromptButton: document.querySelector("#clearPromptButton"),
  toast: document.querySelector("#toast"),
};

let toastTimer = null;

document.addEventListener("DOMContentLoaded", init);

const embeddedOutfitData = {
  "site": {
    "projectName": "Wisteria Noble",
    "siteName": "Fantasy Outfit Builder",
    "version": "2.0.0"
  },
  "series": [
    {
      "id": "royal-princess",
      "name": "Royal Princess",
      "symbol": "♔",
      "accentColor": "#cdb7ff",
      "description": "王道のお姫様をイメージした、気品あふれるロイヤルシリーズ。",
      "categories": [
        {
          "id": "dress",
          "name": "ドレス",
          "prompt": "elegant royal princess dress, layered ball gown, refined silhouette, luxurious fabric"
        },
        {
          "id": "bodice",
          "name": "ボディス",
          "prompt": "ornate fitted bodice, delicate gold embroidery, pearl accents, lace trim"
        },
        {
          "id": "sleeves",
          "name": "袖",
          "prompt": "soft puff sleeves, translucent lace cuffs, graceful ribbon details"
        },
        {
          "id": "accessories",
          "name": "装飾品",
          "prompt": "small jeweled tiara, pearl choker, elegant earrings, royal brooch"
        },
        {
          "id": "footwear",
          "name": "靴",
          "prompt": "decorative princess heels, satin ribbons, gold filigree ornaments"
        },
        {
          "id": "details",
          "name": "仕上げ",
          "prompt": "regal fantasy fashion, soft sparkle, noble atmosphere, intricate craftsmanship"
        }
      ],
      "motif": "王冠・百合・宮廷装飾",
      "material": "サテン・真珠・金刺繍"
    },
    {
      "id": "rose-duchess",
      "name": "Rose Duchess",
      "symbol": "✿",
      "accentColor": "#d98aa8",
      "description": "薔薇とレースを優雅に纏う、気高き公爵令嬢シリーズ。",
      "categories": [
        {
          "id": "dress",
          "name": "ドレス",
          "prompt": "deep crimson duchess gown, elegant mermaid silhouette, layered rose petal skirt"
        },
        {
          "id": "corset",
          "name": "コルセット",
          "prompt": "luxurious black and burgundy corset, gold vine embroidery, gemstone clasps"
        },
        {
          "id": "sleeves",
          "name": "袖",
          "prompt": "dramatic off-shoulder sleeves, sheer black lace, rose embroidery"
        },
        {
          "id": "accessories",
          "name": "装飾品",
          "prompt": "rose-shaped hair ornament, ruby necklace, black lace gloves, antique earrings"
        },
        {
          "id": "footwear",
          "name": "靴",
          "prompt": "burgundy high heels, rose ornaments, delicate ankle straps"
        },
        {
          "id": "details",
          "name": "仕上げ",
          "prompt": "aristocratic gothic romance, rose motif, sophisticated elegance, rich textures"
        }
      ],
      "motif": "薔薇・蔦・アンティーク装飾",
      "material": "レース・ルビー・ベルベット"
    },
    {
      "id": "moon-empress",
      "name": "Moon Empress",
      "symbol": "☾",
      "accentColor": "#9eb9f4",
      "description": "月光と星空の輝きを纏う、幻想的で神秘的な女帝シリーズ。",
      "categories": [
        {
          "id": "dress",
          "name": "ドレス",
          "prompt": "celestial moon empress gown, flowing midnight blue layers, silver gradient fabric"
        },
        {
          "id": "bodice",
          "name": "ボディス",
          "prompt": "structured celestial bodice, crescent moon patterns, silver thread embroidery"
        },
        {
          "id": "sleeves",
          "name": "袖",
          "prompt": "long translucent sleeves, starry veil fabric, glowing silver cuffs"
        },
        {
          "id": "accessories",
          "name": "装飾品",
          "prompt": "crescent crown, moonstone necklace, star earrings, celestial armlets"
        },
        {
          "id": "footwear",
          "name": "靴",
          "prompt": "silver celestial sandals, moonstone decorations, luminous ribbon straps"
        },
        {
          "id": "details",
          "name": "仕上げ",
          "prompt": "ethereal moonlight, cosmic elegance, subtle glow, mystical imperial presence"
        }
      ],
      "motif": "三日月・星・天体",
      "material": "銀糸・ムーンストーン・シアー生地"
    },
    {
      "id": "forest-fairy",
      "name": "Forest Fairy",
      "symbol": "❧",
      "accentColor": "#8fd0a7",
      "description": "草花と蔦に愛された、自然と調和する森の妖精シリーズ。",
      "categories": [
        {
          "id": "dress",
          "name": "ドレス",
          "prompt": "forest fairy dress, layered leaf-shaped skirt, soft green translucent fabric"
        },
        {
          "id": "bodice",
          "name": "ボディス",
          "prompt": "natural vine-wrapped bodice, tiny flower details, moss-inspired texture"
        },
        {
          "id": "sleeves",
          "name": "袖",
          "prompt": "petal sleeves, sheer leaf-pattern fabric, delicate floral cuffs"
        },
        {
          "id": "accessories",
          "name": "装飾品",
          "prompt": "flower crown, crystal dew necklace, vine bracelets, leaf earrings"
        },
        {
          "id": "wings",
          "name": "羽",
          "prompt": "delicate translucent fairy wings, iridescent veins, soft green glow"
        },
        {
          "id": "details",
          "name": "仕上げ",
          "prompt": "enchanted forest atmosphere, floating pollen lights, organic fantasy details"
        }
      ],
      "motif": "草花・葉・蔦",
      "material": "花弁・葉・透明な妖精羽"
    },
    {
      "id": "ice-queen",
      "name": "Ice Queen",
      "symbol": "❄",
      "accentColor": "#b9e7ff",
      "description": "雪と氷晶を纏う、凛として美しい氷雪の女王シリーズ。",
      "motif": "雪の結晶・氷柱・霜模様",
      "material": "氷晶・クリスタル・銀",
      "categories": [
        {
          "id": "tiara",
          "name": "氷雪の女王ティアラ",
          "prompt": "ice crystal tiara, snowflake hair ornament, crystal crown, silver hair chain"
        },
        {
          "id": "bodice",
          "name": "氷雪の女王ドレス（上半身）",
          "prompt": "crystal corset, high collar, sheer long sleeves, snowflake embroidery"
        },
        {
          "id": "skirt",
          "name": "氷晶レイヤースカート",
          "prompt": "layered translucent skirt, crystal overskirt, flowing long skirt, icicle hem"
        },
        {
          "id": "decorations",
          "name": "雪の結晶と氷晶の装飾",
          "prompt": "snowflake embroidery, crystal decorations, silver embellishments, frost patterns"
        },
        {
          "id": "accessories",
          "name": "氷雪の女王アクセサリー",
          "prompt": "sheer gloves, crystal earrings, snowflake choker, silver brooch"
        },
        {
          "id": "shoes",
          "name": "氷雪の女王シューズ",
          "prompt": "crystal high heels, ice crystal shoes, silver heels, snowflake anklet"
        }
      ]
    },
    {
      "id": "butterfly-noble",
      "name": "Butterfly Noble",
      "symbol": "🦋",
      "accentColor": "#d6b6ff",
      "description": "蝶の羽のように軽やかで優雅な、幻想貴族シリーズ。",
      "motif": "蝶・翅・羽ばたき",
      "material": "レース・シアー生地・クリスタル",
      "categories": [
        {
          "id": "headpiece",
          "name": "蝶の令嬢ヘッドドレス",
          "prompt": "butterfly hair ornament, butterfly headpiece, butterfly hair chain, crystal butterfly tiara"
        },
        {
          "id": "bodice",
          "name": "蝶羽レースドレス（上半身）",
          "prompt": "butterfly lace corset, sheer butterfly sleeves, wing embroidery, lace bodice"
        },
        {
          "id": "skirt",
          "name": "羽衣レイヤースカート",
          "prompt": "layered butterfly skirt, sheer overskirt, flowing skirt, butterfly hem"
        },
        {
          "id": "decorations",
          "name": "蝶とレースの幻想装飾",
          "prompt": "butterfly embroidery, lace decorations, crystal embellishments, wing motifs"
        },
        {
          "id": "accessories",
          "name": "蝶の令嬢アクセサリー",
          "prompt": "lace gloves, butterfly earrings, crystal bracelet, butterfly choker"
        },
        {
          "id": "shoes",
          "name": "蝶羽の令嬢シューズ",
          "prompt": "butterfly heels, lace heels, crystal shoes, wing anklet"
        }
      ]
    },
    {
      "id": "holy-maiden",
      "name": "Holy Maiden",
      "symbol": "🤍",
      "accentColor": "#f2eefc",
      "description": "真珠と白レースが輝く、清らかで神聖な聖女シリーズ。",
      "motif": "聖花・光輪・純白",
      "material": "真珠・白レース・クリスタル",
      "categories": [
        {
          "id": "tiara",
          "name": "聖女のティアラ",
          "prompt": "pearl tiara, holy headpiece, white flower hair ornament, crystal hair chain"
        },
        {
          "id": "bodice",
          "name": "聖女ドレス（上半身）",
          "prompt": "white corset, high neckline, sheer sleeves, pearl embroidery"
        },
        {
          "id": "skirt",
          "name": "純白レイヤースカート",
          "prompt": "layered white skirt, flowing overskirt, long elegant skirt, lace hem"
        },
        {
          "id": "decorations",
          "name": "真珠と白レースの神聖装飾",
          "prompt": "pearl decorations, white lace, delicate embroidery, gold trim"
        },
        {
          "id": "accessories",
          "name": "聖女アクセサリー",
          "prompt": "white opera gloves, pearl earrings, crystal pendant, pearl bracelet"
        },
        {
          "id": "shoes",
          "name": "聖女シューズ",
          "prompt": "white heels, pearl shoes, lace heels, crystal anklet"
        }
      ]
    },
    {
      "id": "dark-aristocrat",
      "name": "Dark Aristocrat",
      "symbol": "🖤",
      "accentColor": "#8f7a9e",
      "description": "黒薔薇と黒宝石を纏う、妖艶で気高い貴族令嬢シリーズ。",
      "motif": "黒薔薇・ゴシック紋章・夜",
      "material": "黒レース・オニキス・ベルベット",
      "categories": [
        {
          "id": "headpiece",
          "name": "漆黒の令嬢ヘッドドレス",
          "prompt": "black rose headpiece, black jeweled tiara, black lace headband, onyx hair ornament"
        },
        {
          "id": "bodice",
          "name": "漆黒のゴシックドレス（上半身）",
          "prompt": "black corset, high collar, lace sleeves, black embroidery"
        },
        {
          "id": "skirt",
          "name": "漆黒のレイヤースカート",
          "prompt": "layered black skirt, flowing overskirt, lace hem, ruffled skirt"
        },
        {
          "id": "decorations",
          "name": "黒レースと宝石の豪華装飾",
          "prompt": "black lace, onyx decorations, black embroidery, gothic embellishments"
        },
        {
          "id": "accessories",
          "name": "漆黒の令嬢アクセサリー",
          "prompt": "black opera gloves, onyx earrings, black choker, black brooch"
        },
        {
          "id": "shoes",
          "name": "漆黒の令嬢シューズ",
          "prompt": "black heels, lace heels, onyx shoes, black ankle ribbon"
        }
      ]
    },
    {
      "id": "celestial-queen",
      "name": "Celestial Queen",
      "symbol": "🌌",
      "accentColor": "#8ea7ff",
      "description": "星座と銀河の輝きを纏う、壮麗で幻想的な天空の女王シリーズ。",
      "motif": "星座・銀河・流星",
      "material": "金糸・星晶石・シアー生地",
      "categories": [
        {
          "id": "tiara",
          "name": "天空の女王ティアラ",
          "prompt": "constellation tiara, star crown, celestial hair ornament, golden star hair chain"
        },
        {
          "id": "bodice",
          "name": "天空の女王ドレス（上半身）",
          "prompt": "celestial corset, starry high collar, sheer long sleeves, constellation embroidery"
        },
        {
          "id": "skirt",
          "name": "銀河のドレープスカート",
          "prompt": "galaxy layered skirt, flowing overskirt, starry long skirt, celestial train"
        },
        {
          "id": "decorations",
          "name": "星座と銀河の幻想装飾",
          "prompt": "constellation patterns, galaxy embroidery, gold star decorations, celestial embellishments"
        },
        {
          "id": "accessories",
          "name": "天空の女王アクセサリー",
          "prompt": "star earrings, celestial choker, gold bracelets, constellation brooch"
        },
        {
          "id": "shoes",
          "name": "星空の女王シューズ",
          "prompt": "starry heels, gold celestial shoes, crystal star anklet, constellation decorations"
        }
      ]
    },
    {
      "id": "victorian-lady",
      "name": "Victorian Lady",
      "symbol": "🎀",
      "accentColor": "#d8a9bd",
      "description": "クラシカルな英国貴族をイメージした、気品あふれるヴィクトリアシリーズ。",
      "motif": "リボン・カメオ・クラシカル装飾",
      "material": "レース・真珠・サテン",
      "categories": [
        {
          "id": "headpiece",
          "name": "ヴィクトリアヘッドドレス",
          "prompt": "lace bonnet, victorian headband, ribbon hair ornament, cameo hairpin"
        },
        {
          "id": "bodice",
          "name": "ヴィクトリアドレス（上半身）",
          "prompt": "victorian corset, high neckline, ruffled sleeves, lace bodice"
        },
        {
          "id": "skirt",
          "name": "クラシカルレイヤースカート",
          "prompt": "layered bustle skirt, ruffled skirt, long overskirt, lace hem"
        },
        {
          "id": "decorations",
          "name": "レースとリボンの優雅な装飾",
          "prompt": "lace embroidery, ruffled lace, elegant ribbons, cameo decorations"
        },
        {
          "id": "accessories",
          "name": "ヴィクトリアアクセサリー",
          "prompt": "lace gloves, cameo brooch, pearl earrings, ribbon choker"
        },
        {
          "id": "shoes",
          "name": "クラシカルシューズ",
          "prompt": "victorian heels, lace shoes, ribbon heels, button boots"
        }
      ]
    },
    {
      "id": "crystal-noble",
      "name": "Crystal Noble",
      "symbol": "💎",
      "accentColor": "#b7ecff",
      "description": "宝石の輝きを纏う、華麗で気品あふれるジュエルノーブルシリーズ。",
      "motif": "宝石・カットクリスタル・光彩",
      "material": "ダイヤモンド・クリスタル・宝石刺繍",
      "categories": [
        {
          "id": "tiara",
          "name": "宝石細工のティアラ",
          "prompt": "jeweled tiara, crystal crown, gem hair ornament, diamond hair chain"
        },
        {
          "id": "bodice",
          "name": "宝石令嬢ドレス（上半身）",
          "prompt": "crystal corset, gem embroidered bodice, high neckline, jewel embellishments"
        },
        {
          "id": "skirt",
          "name": "宝石レイヤースカート",
          "prompt": "layered crystal skirt, flowing overskirt, gem decorated skirt, crystal hem"
        },
        {
          "id": "decorations",
          "name": "宝石細工の豪華装飾",
          "prompt": "crystal embroidery, gem decorations, diamond embellishments, luxurious jewel patterns"
        },
        {
          "id": "accessories",
          "name": "宝石令嬢アクセサリー",
          "prompt": "diamond earrings, gem necklace, crystal bracelet, jewel brooch"
        },
        {
          "id": "shoes",
          "name": "宝石令嬢シューズ",
          "prompt": "crystal heels, diamond shoes, gem decorated heels, jewel anklet"
        }
      ]
    },
    {
      "id": "ocean-princess",
      "name": "Ocean Princess",
      "symbol": "🌊",
      "accentColor": "#74cde8",
      "description": "真珠と波のきらめきを纏う、優雅で幻想的な海のプリンセスシリーズ。",
      "motif": "波・貝殻・珊瑚",
      "material": "真珠・アクアマリン・クリスタル",
      "categories": [
        {
          "id": "tiara",
          "name": "海の姫君ティアラ",
          "prompt": "pearl tiara, seashell hair ornament, coral headpiece, aquamarine hair chain"
        },
        {
          "id": "bodice",
          "name": "海の姫君ドレス（上半身）",
          "prompt": "pearl corset, off shoulder, flowing sleeves, wave embroidery"
        },
        {
          "id": "skirt",
          "name": "波紋レイヤースカート",
          "prompt": "layered wave skirt, flowing overskirt, long elegant skirt, pearl hem"
        },
        {
          "id": "decorations",
          "name": "真珠と波の優雅な装飾",
          "prompt": "wave embroidery, pearl decorations, seashell embellishments, coral motifs"
        },
        {
          "id": "accessories",
          "name": "海の姫君アクセサリー",
          "prompt": "pearl earrings, seashell necklace, coral bracelet, starfish brooch"
        },
        {
          "id": "shoes",
          "name": "海の姫君シューズ",
          "prompt": "pearl heels, aquamarine shoes, crystal sandals, shell anklet"
        }
      ]
    },
    {
      "id": "scarlet-queen",
      "name": "Scarlet Queen",
      "symbol": "🔥",
      "accentColor": "#f06d62",
      "description": "紅蓮の炎とルビーの輝きを纏う、情熱的で気高い女王シリーズ。",
      "motif": "炎・紅蓮・王家の紋章",
      "material": "ルビー・金・サテン",
      "categories": [
        {
          "id": "tiara",
          "name": "紅蓮の女王ティアラ",
          "prompt": "ruby tiara, flame crown, ruby hair ornament, gold hair chain"
        },
        {
          "id": "bodice",
          "name": "紅蓮の女王ドレス（上半身）",
          "prompt": "ruby corset, off shoulder, flame embroidery, gold bodice"
        },
        {
          "id": "skirt",
          "name": "紅蓮レイヤースカート",
          "prompt": "layered flame skirt, flowing overskirt, long royal skirt, flame hem"
        },
        {
          "id": "decorations",
          "name": "炎とルビーの豪華装飾",
          "prompt": "flame embroidery, ruby decorations, gold embellishments, royal patterns"
        },
        {
          "id": "accessories",
          "name": "紅蓮の女王アクセサリー",
          "prompt": "ruby earrings, gold necklace, ruby bracelet, royal brooch"
        },
        {
          "id": "shoes",
          "name": "紅蓮の女王シューズ",
          "prompt": "ruby heels, gold shoes, flame anklet, crystal heels"
        }
      ]
    }
  ]
};

async function init() {
  bindStaticEvents();

  try {
    const data = embeddedOutfitData;

    if (!Array.isArray(data.series)) {
      throw new Error("衣装データの形式が正しくありません。");
    }

    appState.outfits = data.series;
    renderSeries();
    updateSelectedPromptUI();
    elements.statusMessage.hidden = true;
  } catch (error) {
    console.error(error);
    elements.statusMessage.hidden = false;
    elements.statusMessage.textContent = "衣装データを表示できませんでした。";
  }
}

function bindStaticEvents() {
  elements.openPromptPanelButton.addEventListener("click", openPromptPanel);
  elements.closePromptPanelButton.addEventListener("click", closePromptPanel);
  elements.promptPanelBackdrop.addEventListener("click", closePromptPanel);

  elements.copyAllPromptButton.addEventListener("click", async () => {
    const promptText = buildCombinedPrompt();

    if (!promptText) {
      showToast("コピーするプロンプトがありません。");
      return;
    }

    await copyText(promptText, "統合プロンプトをコピーしました。");
  });

  elements.clearPromptButton.addEventListener("click", () => {
    if (appState.selectedPrompts.size === 0) {
      showToast("解除するプロンプトがありません。");
      return;
    }

    appState.selectedPrompts.clear();
    updateSelectedPromptUI();
    updateAddButtons();
    showToast("選択中のプロンプトをすべて解除しました。");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.promptPanel.classList.contains("is-open")) {
      closePromptPanel();
    }
  });
}

function renderSeries() {
  elements.seriesGrid.innerHTML = "";

  appState.outfits.forEach((series, index) => {
    const card = document.createElement("article");
    card.className = "series-card";
    card.dataset.seriesId = series.id;
    card.style.setProperty("--series-accent", series.accentColor || "#b9a3f4");

    const toggleButton = document.createElement("button");
    toggleButton.className = "series-card__toggle";
    toggleButton.type = "button";
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-controls", `series-content-${series.id}`);

    toggleButton.innerHTML = `
      <span class="series-card__emblem" aria-hidden="true">${escapeHTML(series.symbol || "✦")}</span>
      <span>
        <span class="series-card__label">Series ${String(index + 1).padStart(2, "0")}</span>
        <h3 class="series-card__title">${escapeHTML(series.name)}</h3>
        <p class="series-card__description">${escapeHTML(series.description)}</p>
        <span class="series-card__meta">
          <span><strong>主役モチーフ</strong>${escapeHTML(series.motif || "—")}</span>
          <span><strong>主役素材</strong>${escapeHTML(series.material || "—")}</span>
        </span>
      </span>
      <span class="series-card__arrow" aria-hidden="true">⌄</span>
    `;

    const content = document.createElement("div");
    content.className = "series-card__content";
    content.id = `series-content-${series.id}`;

    const contentInner = document.createElement("div");
    contentInner.className = "series-card__content-inner";

    const categoryGrid = document.createElement("div");
    categoryGrid.className = "category-grid";

    series.categories.forEach((category) => {
      categoryGrid.appendChild(createCategoryCard(series, category));
    });

    contentInner.appendChild(categoryGrid);
    content.appendChild(contentInner);
    card.append(toggleButton, content);
    elements.seriesGrid.appendChild(card);

    toggleButton.addEventListener("click", () => {
      toggleSeries(series.id);
    });
  });
}

function createCategoryCard(series, category) {
  const categoryCard = document.createElement("section");
  categoryCard.className = "category-card";

  const promptKey = createPromptKey(series.id, category.id);

  categoryCard.innerHTML = `
    <div class="category-card__top">
      <h4 class="category-card__name">${escapeHTML(category.name)}</h4>
    </div>
    <p class="category-card__prompt">${escapeHTML(category.prompt)}</p>
    <div class="category-card__actions">
      <button
        class="small-button"
        type="button"
        data-action="copy-category"
        data-prompt-key="${promptKey}"
      >
        コピー
      </button>
      <button
        class="small-button small-button--add"
        type="button"
        data-action="toggle-category"
        data-prompt-key="${promptKey}"
      >
        追加
      </button>
    </div>
  `;

  const copyButton = categoryCard.querySelector('[data-action="copy-category"]');
  const addButton = categoryCard.querySelector('[data-action="toggle-category"]');

  copyButton.addEventListener("click", async () => {
    await copyText(category.prompt, `${series.name} / ${category.name} をコピーしました。`);
  });

  addButton.addEventListener("click", () => {
    togglePromptSelection(series, category);
  });

  return categoryCard;
}

function toggleSeries(seriesId) {
  const cards = elements.seriesGrid.querySelectorAll(".series-card");

  cards.forEach((card) => {
    const isTarget = card.dataset.seriesId === seriesId;
    const shouldOpen = isTarget && !card.classList.contains("is-open");
    const toggleButton = card.querySelector(".series-card__toggle");

    card.classList.toggle("is-open", shouldOpen);
    toggleButton.setAttribute("aria-expanded", String(shouldOpen));
  });

  appState.activeSeriesId =
    appState.activeSeriesId === seriesId ? null : seriesId;
}

function togglePromptSelection(series, category) {
  const promptKey = createPromptKey(series.id, category.id);

  if (appState.selectedPrompts.has(promptKey)) {
    appState.selectedPrompts.delete(promptKey);
    showToast(`${series.name} / ${category.name} を解除しました。`);
  } else {
    appState.selectedPrompts.set(promptKey, {
      key: promptKey,
      seriesId: series.id,
      seriesName: series.name,
      categoryId: category.id,
      categoryName: category.name,
      prompt: category.prompt,
    });
    showToast(`${series.name} / ${category.name} を追加しました。`);
  }

  updateSelectedPromptUI();
  updateAddButtons();
}

function updateSelectedPromptUI() {
  const selectedItems = Array.from(appState.selectedPrompts.values());

  elements.selectedPromptCount.textContent = String(selectedItems.length);
  elements.emptyPromptState.hidden = selectedItems.length > 0;
  elements.copyAllPromptButton.disabled = selectedItems.length === 0;
  elements.clearPromptButton.disabled = selectedItems.length === 0;
  elements.promptOutput.value = buildCombinedPrompt();

  elements.selectedPromptList.innerHTML = "";

  selectedItems.forEach((item) => {
    const selectedItem = document.createElement("div");
    selectedItem.className = "selected-item";

    selectedItem.innerHTML = `
      <div class="selected-item__meta">
        <p class="selected-item__series">${escapeHTML(item.seriesName)}</p>
        <p class="selected-item__category">${escapeHTML(item.categoryName)}</p>
      </div>
      <button
        class="selected-item__remove"
        type="button"
        aria-label="${escapeHTML(item.categoryName)}を解除"
      >
        解除
      </button>
    `;

    selectedItem
      .querySelector(".selected-item__remove")
      .addEventListener("click", () => {
        appState.selectedPrompts.delete(item.key);
        updateSelectedPromptUI();
        updateAddButtons();
        showToast(`${item.seriesName} / ${item.categoryName} を解除しました。`);
      });

    elements.selectedPromptList.appendChild(selectedItem);
  });
}

function updateAddButtons() {
  const addButtons = document.querySelectorAll('[data-action="toggle-category"]');

  addButtons.forEach((button) => {
    const isSelected = appState.selectedPrompts.has(button.dataset.promptKey);
    button.classList.toggle("is-selected", isSelected);
    button.textContent = isSelected ? "選択中" : "追加";
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function buildCombinedPrompt() {
  return Array.from(appState.selectedPrompts.values())
    .map((item) => item.prompt.trim())
    .filter(Boolean)
    .join(", ");
}

function openPromptPanel() {
  elements.promptPanel.classList.add("is-open");
  elements.promptPanel.setAttribute("aria-hidden", "false");
  elements.openPromptPanelButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("is-panel-open");

  window.setTimeout(() => {
    elements.closePromptPanelButton.focus();
  }, 0);
}

function closePromptPanel() {
  elements.promptPanel.classList.remove("is-open");
  elements.promptPanel.setAttribute("aria-hidden", "true");
  elements.openPromptPanelButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("is-panel-open");
  elements.openPromptPanelButton.focus();
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (error) {
    console.warn("Clipboard API が利用できないためフォールバックします。", error);

    const temporaryTextarea = document.createElement("textarea");
    temporaryTextarea.value = text;
    temporaryTextarea.setAttribute("readonly", "");
    temporaryTextarea.style.position = "fixed";
    temporaryTextarea.style.opacity = "0";
    document.body.appendChild(temporaryTextarea);
    temporaryTextarea.select();

    const copied = document.execCommand("copy");
    temporaryTextarea.remove();

    showToast(copied ? successMessage : "コピーに失敗しました。");
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2200);
}

function createPromptKey(seriesId, categoryId) {
  return `${seriesId}:${categoryId}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
