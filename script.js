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

async function init() {
  bindStaticEvents();

  try {
    const response = await fetch("./outfits.json");

    if (!response.ok) {
      throw new Error(`衣装データの読み込みに失敗しました: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.series)) {
      throw new Error("outfits.json のデータ形式が正しくありません。");
    }

    appState.outfits = data.series;
    renderSeries();
    updateSelectedPromptUI();

    elements.statusMessage.hidden = true;
  } catch (error) {
    console.error(error);
    elements.statusMessage.hidden = false;
    elements.statusMessage.textContent =
      "衣装データを読み込めませんでした。ローカル確認時はWebサーバー経由で開いてください。";
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
