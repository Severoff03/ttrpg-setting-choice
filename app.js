(() => {
  "use strict";

  const campaigns = window.CAMPAIGNS || [];
  const storageKey = "za-granyu-draft-v1";
  const byId = (id) => document.getElementById(id);
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  };
  const freshState = () => ({ active: campaigns[0]?.id, choices: {}, form: {} });
  let state = freshState();
  let storageAvailable = true;
  let clearPending = false;
  let clearTimer;
  let exportRevision = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") {
      if (campaigns.some((world) => world.id === saved.active)) state.active = saved.active;
      if (saved.choices && typeof saved.choices === "object" && !Array.isArray(saved.choices)) state.choices = saved.choices;
      if (saved.form && typeof saved.form === "object" && !Array.isArray(saved.form)) state.form = saved.form;
    }
  } catch { storageAvailable = false; }

  // Preserve existing bureau selections after correcting Control to Contain.
  if (state.choices.anomalies?.bureau === "control") state.choices.anomalies.bureau = "contain";

  const requestedWorld = new URL(location.href).searchParams.get("world");
  if (campaigns.some((world) => world.id === requestedWorld)) state.active = requestedWorld;

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    byId("draft-status").textContent = storageAvailable
      ? "Черновик сохранён на устройстве"
      : "Автосохранение недоступно. Скопируйте или скачайте ответ.";
  }

  function externalLink(url, text, className = "") {
    const href = safeUrl(url);
    if (!href) return `<span>${escape(text)}</span>`;
    return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer" class="${escape(className)}" aria-label="${escape(text)} (в новой вкладке)">${escape(text)}</a>`;
  }

  function renderWorlds() {
    byId("world-list").innerHTML = campaigns.map((world) => `
      <article class="world">
        <a href="?world=${escape(world.id)}#dossier" class="world-open" data-world="${escape(world.id)}" aria-current="${world.id === state.active}">
          <div class="world-image"><img src="${escape(world.cover)}" alt="${escape(world.coverAlt)}" width="1200" height="800" fetchpriority="${world.id === campaigns[0].id ? "high" : "auto"}"><span class="world-open-label">Открыть досье</span></div>
          <div class="world-caption">
            <h2 class="world-title">${escape(world.title)}</h2>
            <p>${escape(world.cardText)}</p>
            <span class="world-genre">${escape(world.genre)}</span>
          </div>
        </a>
      </article>`).join("");
    byId("world-switcher").innerHTML = campaigns.map((world) => `
      <button type="button" class="switch-button" data-world="${escape(world.id)}" aria-pressed="${world.id === state.active}" aria-controls="dossier-content">${escape(world.shortTitle)}</button>`).join("");
  }

  function selectedOption(world, choice) {
    const value = state.choices[world.id]?.[choice.id];
    return choice.options.find((option) => option.value === value);
  }

  function renderChoice(world, choice, location = "dossier") {
    const selected = selectedOption(world, choice);
    const noteId = `note-${world.id}-${choice.id}-${location}`;
    return `<fieldset class="choice-group"><legend>${escape(choice.label)}</legend>
      <div class="choice-options">${choice.options.map((option) => `
        <label class="choice-label"><input type="radio" name="pref-${escape(world.id)}-${escape(choice.id)}-${escape(location)}" value="${escape(option.value)}" data-preference="${escape(choice.id)}" data-campaign-id="${escape(world.id)}" data-note-id="${noteId}" aria-describedby="${noteId}" ${selected?.value === option.value ? "checked" : ""}><span>${escape(option.label)}</span></label>`).join("")}</div>
      <p class="choice-note" id="${noteId}" aria-live="polite">${escape(selected?.note || "Можно оставить без выбора — решим вместе.")}</p>
    </fieldset>`;
  }

  function bindPreferences(root) {
    root.querySelectorAll("input[data-preference]").forEach(input => {
      input.addEventListener("change", () => {
        const world = campaigns.find(item => item.id === input.dataset.campaignId);
        const choice = world?.choices.find(item => item.id === input.dataset.preference);
        if (!choice || !choice.options.some(option => option.value === input.value)) return;
        const reminderHadFocus = byId("bureau-reminder").contains(document.activeElement);
        if (!state.choices[world.id] || typeof state.choices[world.id] !== "object") state.choices[world.id] = {};
        state.choices[world.id][choice.id] = input.value;
        document.querySelectorAll("input[data-preference]").forEach(control => {
          const campaign = campaigns.find(item => item.id === control.dataset.campaignId);
          const question = campaign?.choices.find(item => item.id === control.dataset.preference);
          if (!question) return;
          const selected = selectedOption(campaign, question);
          control.checked = control.value === selected?.value;
          const note = byId(control.dataset.noteId);
          if (note) note.textContent = selected?.note || "Можно оставить без выбора — решим вместе.";
        });
        if (choice.id === "bureau") {
          renderBureauReminder();
          if (reminderHadFocus) byId("wishes").focus();
        }
        invalidateExport();
        save();
      });
    });
  }

  function renderBureauReminder() {
    const world = campaigns.find(item => item.id === "anomalies");
    const choice = world?.choices.find(item => item.id === "bureau");
    const container = byId("bureau-reminder");
    const confirmation = byId("bureau-confirmation");
    const selected = choice && selectedOption(world, choice);
    container.hidden = !choice || Boolean(selected);
    confirmation.hidden = !selected;
    confirmation.textContent = selected ? `SCP Foundation: ${selected.label}` : "";
    container.replaceChildren();
    if (!choice || selected) return;
    container.innerHTML = `<h3>SCP Foundation</h3>${renderChoice(world, choice, "reminder")}`;
    bindPreferences(container);
  }

  function renderAtmosphereArt(art, className = "") {
    if (!art) return "";
    return `<figure class="chapter-art ${escape(className)}"><img src="${escape(art.src)}" alt="${escape(art.alt)}" width="1200" height="800" loading="lazy"><figcaption>${externalLink(art.url, art.credit)}</figcaption></figure>`;
  }

  function renderMaterials(world) {
    const images = world.images || [];
    const videos = world.videos || [];
    const texts = world.texts || [];
    if (!images.length && !videos.length && !texts.length) return "";
    return `<section class="materials dossier-block" aria-label="Материалы мира"><h4>Ещё немного атмосферы</h4>
      ${images.map((item) => `<figure class="material-image"><img src="${escape(item.src)}" alt="${escape(item.alt || "Иллюстрация мира")}" width="${Number(item.width) || 1200}" height="${Number(item.height) || 800}" loading="lazy">${item.caption ? `<figcaption>${escape(item.caption)}</figcaption>` : ""}</figure>`).join("")}
      ${videos.map((item) => `<div><p>${escape(item.title || "Видео")}</p><video controls preload="none" playsinline ${item.poster ? `poster="${escape(item.poster)}"` : ""} aria-label="${escape(item.title || "Видео о мире")}"><source src="${escape(item.src)}">Ваш браузер не поддерживает видео.</video>${item.caption ? `<p class="field-help">${escape(item.caption)}</p>` : ""}</div>`).join("")}
      ${texts.map((item) => `<div class="material-text"><h4>${escape(item.title)}</h4><p>${escape(item.body)}</p></div>`).join("")}
    </section>`;
  }

  function renderDossier(animate = false) {
    const world = campaigns.find((item) => item.id === state.active);
    if (!world) return;
    const bureauChoice = world.choices.find(choice => choice.id === "bureau");
    const otherChoices = world.choices.filter(choice => choice.id !== "bureau");
    const content = byId("dossier-content");
    content._atmosphereCleanup?.();
    content._atmosphereCleanup = null;
    content.querySelectorAll("video").forEach(video => video.pause());
    content.classList.remove("dossier-refresh");
    content.innerHTML = `
      <div class="dossier-title-row"><h3>${escape(world.title)}</h3><span>${escape(world.genre)}</span></div>
      <div class="dossier-visual">
        <img class="dossier-art" src="${escape(world.cover)}" alt="${escape(world.coverAlt)}" width="1200" height="480" loading="lazy">
        ${world.backgroundVideo ? `<video class="atmosphere-video" loop muted playsinline preload="none" poster="${escape(world.cover)}" aria-hidden="true" tabindex="-1"><source src="${escape(world.backgroundVideo)}" type="video/mp4"></video><button type="button" class="video-toggle" aria-pressed="false">Включить атмосферу</button>` : ""}
      </div>
      <p class="art-caption">${externalLink(world.creditUrl, world.credit || "Материалы для обсуждения")}${world.videoSources?.length ? ` · Видео: ${world.videoSources.map(source => externalLink(source.url, source.title)).join(" / ")}` : world.videoCredit ? ` · Видео: ${externalLink(world.videoCreditUrl, world.videoCredit)}` : ""}</p>
      <div class="dossier-chapters">
        <div class="world-chapter">
          <section class="dossier-block world-description"><h4>О мире</h4>${world.premise.map((text) => `<p>${escape(text)}</p>`).join("")}${world.bureaus ? `<dl class="bureau-list">${world.bureaus.map(bureau => `<div><dt>${escape(bureau.title)}</dt><dd>${escape(bureau.description)}</dd></div>`).join("")}</dl>` : ""}${bureauChoice ? `<div class="bureau-inline">${renderChoice(world, bureauChoice)}</div>` : ""}</section>
          ${renderAtmosphereArt(world.atmosphereArt?.[0])}
        </div>
        <div class="world-chapter story-chapter">
          <section class="dossier-block"><h4>Ваша история</h4><p>${escape(world.story || "—")}</p></section>
          ${renderAtmosphereArt(world.atmosphereArt?.[1])}
        </div>
        ${otherChoices.length ? `<section class="preferences" aria-label="Пожелания к миру"><h4>Настроим под нас</h4><p>Это пожелания, а не готовый договор. Можно не выбирать.</p>${otherChoices.map((choice) => renderChoice(world, choice)).join("")}</section>` : ""}
        ${renderMaterials(world)}
      </div>
      <div class="dossier-end">
        <div><h4>На какой системе</h4><strong>${escape(world.system.name)}</strong><p class="field-help">${escape(world.system.status)}</p><p>${escape(world.system.description)}</p><p>${externalLink(world.system.url, world.system.linkLabel)}</p></div>
        <div><h4>Поймать настроение</h4><ul class="ref-list">${world.references.map((item) => `<li>${externalLink(item.url, item.title)}<span>${escape(item.note)}</span></li>`).join("")}</ul><p class="field-help">Референсы — по желанию. Смотреть и читать заранее не обязательно.</p></div>
      </div>`;
    if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => content.classList.add("dossier-refresh"));
    }
    document.querySelectorAll("[data-world]").forEach((element) => {
      const selected = element.dataset.world === world.id;
      element.setAttribute(element.tagName === "BUTTON" ? "aria-pressed" : "aria-current", String(selected));
    });
    byId("world-select").value = world.id;
    setupAtmosphere(content);
    bindPreferences(content);
    renderBureauReminder();
    content.querySelectorAll(".material-image img").forEach((image) => image.addEventListener("error", () => {
      const notice = document.createElement("p");
      notice.className = "field-help";
      notice.textContent = "Иллюстрация пока недоступна.";
      image.replaceWith(notice);
    }, { once: true }));
  }

  function setupAtmosphere(content) {
    const video = content.querySelector(".atmosphere-video");
    const button = content.querySelector(".video-toggle");
    if (!video || !button) return;
    let requested = false;
    let visible = false;
    video.muted = true;
    const label = () => {
      button.textContent = video.paused ? "Включить атмосферу" : "Пауза видео";
      button.setAttribute("aria-pressed", String(!video.paused));
    };
    const play = () => video.play().then(label).catch(error => {
      // Scrolling can pause a still-loading video; preserve intent for its next appearance.
      if (error.name !== "AbortError") requested = false;
      label();
    });
    button.addEventListener("click", () => {
      requested = video.paused;
      if (requested) play(); else { video.pause(); label(); }
    });
    video.addEventListener("error", () => {
      video.hidden = true;
      button.textContent = "Видео недоступно";
      button.disabled = true;
    });
    video.addEventListener("playing", () => { video.classList.add("is-playing"); label(); });
    video.addEventListener("pause", label);
    const canAutoplay = !matchMedia("(prefers-reduced-motion: reduce)").matches && !navigator.connection?.saveData && matchMedia("(min-width: 900px)").matches;
    requested = canAutoplay;
    const observer = new IntersectionObserver(entries => {
      if (!video.isConnected) { observer.disconnect(); return; }
      visible = entries[0].isIntersecting;
      if (visible && requested && !document.hidden) play(); else video.pause();
    }, { threshold: 0.35 });
    observer.observe(video);
    // The listener is scoped to this rendered dossier and removed on the next switch.
    content._atmosphereCleanup?.();
    const onVisibility = () => { if (document.hidden) video.pause(); else if (visible && requested) play(); };
    const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const onReduced = event => { if (event.matches) { requested = false; video.pause(); } };
    document.addEventListener("visibilitychange", onVisibility);
    mediaQuery.addEventListener("change", onReduced);
    content._atmosphereCleanup = () => { requested = false; video.pause(); observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); mediaQuery.removeEventListener("change", onReduced); };
  }

  function renderInterest() {
    byId("interest-list").innerHTML = campaigns.map((world) => `
      <div class="rating-row" data-ui>
        <div class="rating-heading"><label for="interest-${escape(world.id)}">${escape(world.title)}</label><span><output id="score-${escape(world.id)}" for="interest-${escape(world.id)}">—</output> / 10</span></div>
        <input type="range" id="interest-${escape(world.id)}" name="interest-${escape(world.id)}" min="1" max="10" step="1" value="5" data-rated="false" aria-valuetext="Оценка не выбрана" aria-describedby="scale-help">
        <div class="scale-ticks" aria-hidden="true">${Array.from({ length: 10 }, (_, index) => `<span>${index + 1}</span>`).join("")}</div>
      </div>`).join("");
    form.querySelectorAll('input[type="range"]').forEach(input => {
      input.addEventListener("input", () => updateRating(input));
      input.addEventListener("pointerdown", () => { updateRating(input); captureForm(); });
    });
  }

  function updateRating(input) {
    input.dataset.rated = "true";
    const id = input.name.replace("interest-", "");
    byId(`score-${id}`).textContent = input.value;
    input.setAttribute("aria-valuetext", `${input.value} из 10`);
  }

  function formValues() {
    const values = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('input[type="range"]').forEach(input => {
      if (input.dataset.rated !== "true") delete values[input.name];
    });
    return values;
  }

  const form = byId("feedback-form");

  function restoreForm() {
    for (const [name, value] of Object.entries(state.form)) {
      if (typeof value !== "string") continue;
      const control = form.elements.namedItem(name);
      if (control && "value" in control) {
        if (control.type === "range" && !/^(10|[1-9])$/.test(value)) continue;
        control.value = value;
        if (control.type === "range") updateRating(control);
      }
    }
  }

  function captureForm() {
    state.form = formValues();
    invalidateExport();
    save();
  }

  function invalidateExport() {
    exportRevision += 1;
    byId("form-status").textContent = "";
    byId("answer-fallback").hidden = true;
    byId("answer-text").value = "";
  }

  function generateAnswer() {
    const values = formValues();
    const lines = ["НАША СЛЕДУЮЩАЯ ИСТОРИЯ", "", `Игрок: ${values.playerName.trim()}`, "", "ИНТЕРЕС К МИРАМ"];
    for (const world of campaigns) lines.push(`${world.title}: ${values[`interest-${world.id}`] ? `${values[`interest-${world.id}`]} / 10` : "Не указан"}`);
    lines.push("", "ПОЖЕЛАНИЯ К МИРАМ");
    for (const world of campaigns) {
      lines.push("", world.title);
      for (const choice of world.choices) lines.push(`${choice.label} ${selectedOption(world, choice)?.label || "Обсудим вместе"}`);
    }
    lines.push("", "ЧЕГО ХОЧЕТСЯ", values.wishes.trim() || "Обсудим вместе", "", "ОСТАВИТЬ ЗА КАДРОМ", values.boundaries.trim() || "Обсудим отдельно");
    return lines.join("\n");
  }

  function validForm() {
    const name = byId("player-name");
    name.setCustomValidity(name.value.trim() ? "" : "Укажите имя или ник.");
    return form.reportValidity();
  }

  form.addEventListener("input", () => {
    byId("player-name").setCustomValidity("");
    captureForm();
  });
  form.addEventListener("change", captureForm);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validForm()) return;
    captureForm();
    const answer = generateAnswer();
    const revision = exportRevision;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(answer);
      if (revision !== exportRevision) return;
      byId("form-status").textContent = "Ответ скопирован. Теперь пришлите его ведущему в личные сообщения.";
    } catch {
      if (revision !== exportRevision) return;
      byId("answer-fallback").hidden = false;
      byId("answer-fallback").open = true;
      byId("answer-text").value = answer;
      byId("answer-text").focus();
      byId("answer-text").select();
      byId("form-status").textContent = "Автокопирование недоступно. Скопируйте выделенный текст или скачайте .txt.";
    }
  });
  byId("download-answer").addEventListener("click", () => {
    if (!validForm()) return;
    captureForm();
    const blob = new Blob(["\uFEFF", generateAnswer()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const name = byId("player-name").value.trim().replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").slice(0, 40);
    link.download = `Выбор-сеттинга-${name || "игрок"}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    byId("form-status").textContent = "Файл с ответом подготовлен. Пришлите его ведущему в личные сообщения.";
  });

  byId("clear-draft").addEventListener("click", () => {
    const button = byId("clear-draft");
    if (!clearPending) {
      clearPending = true;
      button.textContent = "Нажмите ещё раз, чтобы очистить";
      clearTimer = setTimeout(() => {
        clearPending = false;
        button.textContent = "Очистить черновик";
      }, 5000);
      return;
    }
    clearTimeout(clearTimer);
    clearPending = false;
    state = freshState();
    form.reset();
    renderInterest();
    byId("player-name").setCustomValidity("");
    button.textContent = "Очистить черновик";
    renderDossier();
    invalidateExport();
    save();
    byId("form-status").textContent = "Черновик очищен.";
  });

  function setupExternalForm() {
    const url = safeUrl(window.SITE_CONFIG?.feedbackFormUrl);
    if (!url) return;
    const container = byId("external-form");
    container.hidden = false;
    container.innerHTML = `<p>Можно ответить через форму ведущего. Она откроется отдельно; выборы с этой страницы туда автоматически не переносятся.</p>${externalLink(url, "Открыть форму ведущего", "button primary")}`;
  }

  if (!campaigns.length) {
    byId("dossier-content").textContent = "Не удалось загрузить описания миров. Проверьте наличие файлов settings/*/setting.js.";
    return;
  }
  renderWorlds();
  renderDossier();
  renderInterest();
  restoreForm();
  setupExternalForm();
  save();

  byId("world-select").addEventListener("change", () => {
    state.active = byId("world-select").value;
    renderDossier(false);
    const url = new URL(location.href);
    url.searchParams.set("world", state.active);
    try { history.replaceState(null, "", url.href); } catch {}
    save();
  });

  document.querySelectorAll("[data-world]").forEach((control) => {
    control.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (control.tagName === "A") event.preventDefault();
      if (state.active !== control.dataset.world) {
        state.active = control.dataset.world;
        renderDossier(event.detail !== 0);
        save();
      }
      const url = new URL(location.href);
      url.searchParams.set("world", state.active);
      if (control.tagName === "A") url.hash = "dossier";
      try { history.replaceState(null, "", url.href); } catch { /* Some file viewers restrict history. */ }
      if (control.tagName === "A") byId("dossier").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  });

  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll(".dossier-top, .vote-intro, .feedback-form, .site-footer > p:first-child").forEach((element) => observer.observe(element));
  }
})();
