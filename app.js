(() => {
  "use strict";

  const campaigns = window.CAMPAIGNS || [];
  // Old cover links left the chosen chapter in the address. Opening that same
  // address again must show the covers, rather than reopen the last chapter.
  const chapterHashes = new Set(campaigns.map(world => `#dossier-${world.id}`));
  function clearChapterLink() {
    const openingUrl = new URL(location.href);
    const staleChapter = chapterHashes.has(openingUrl.hash) || (openingUrl.hash === "#dossier" && openingUrl.searchParams.has("world"));
    if (!openingUrl.searchParams.has("world") && !staleChapter) return false;
    openingUrl.searchParams.delete("world");
    if (staleChapter) openingUrl.hash = "";
    try { history.replaceState(null, "", openingUrl.href); } catch { /* Some file viewers restrict history. */ }
    return true;
  }
  clearChapterLink();
  // Mobile browsers may restore their scroll after pageshow or media loading.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  let interacted = false;
  for (const type of ["pointerdown", "touchstart", "wheel", "keydown"]) window.addEventListener(type, () => { interacted = true; }, { passive:true });
  const restoreOpening = () => { if (!interacted && (!location.hash || location.hash === "#main" || location.hash === "#worlds")) window.scrollTo({top:0,left:0,behavior:"instant"}); };
  const settleOpening = () => { restoreOpening(); requestAnimationFrame(() => requestAnimationFrame(restoreOpening)); };
  window.addEventListener("pageshow", event => { if (event.persisted) interacted = false; settleOpening(); });
  window.addEventListener("load", settleOpening, {once:true});
  window.addEventListener("hashchange", () => { if (clearChapterLink()) { interacted = false; settleOpening(); } });
  restoreOpening();
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
  const entranceObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add(entry.target.classList.contains("chapter-art") || entry.target.classList.contains("dossier-visual") ? "reveal-image" : "reveal");
      entranceObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 }) : null;

  function observeEntrances(root) {
    if (!entranceObserver || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.querySelectorAll(".dossier-title-row h2, .dossier-title-row > span, .dossier-visual, .world-description > h3, .world-description > p, .bureau-list > div, .bureau-inline, .story-chapter, .chapter-art, .preferences, .dossier-end > section, .vote-intro > *, .feedback-form > .field, .rating-row, .redacted-text, .site-footer > p:first-child").forEach(element => entranceObserver.observe(element));
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") {
      if (saved.choices && typeof saved.choices === "object" && !Array.isArray(saved.choices)) state.choices = saved.choices;
      if (saved.form && typeof saved.form === "object" && !Array.isArray(saved.form)) state.form = saved.form;
    }
  } catch { storageAvailable = false; }

  // Keep earlier single selections when upgrading questions to multiple choices.
  for (const world of campaigns) {
    if (!state.choices[world.id] || typeof state.choices[world.id] !== "object") continue;
    for (const choice of world.choices) {
      const saved = state.choices[world.id][choice.id];
      if (choice.type === "text") {
        state.choices[world.id][choice.id] = typeof saved === "string" ? saved.slice(0,1000) : "";
        continue;
      }
      if (choice.type === "scale") {
        if (!/^(10|[1-9])$/.test(String(saved))) delete state.choices[world.id][choice.id];
        continue;
      }
      const values = Array.isArray(saved) ? saved : typeof saved === "string" ? [saved] : [];
      state.choices[world.id][choice.id] = [...new Set(values.map(value => world.id === "anomalies" && choice.id === "bureau" && value === "control" ? "contain" : value))].filter(value => choice.options.some(option => option.value === value));
    }
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    byId("draft-status").classList.toggle("sr-only", storageAvailable);
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
      <article class="world" data-setting="${escape(world.id)}">
        <a href="#dossier-${escape(world.id)}" class="world-open" data-world="${escape(world.id)}" aria-current="${world.id === state.active}">
          <div class="world-image"><img src="${escape(world.cover)}" alt="${escape(world.coverAlt)}" width="${Number(world.coverWidth) || 1200}" height="${Number(world.coverHeight) || 800}" fetchpriority="${world.id === campaigns[0].id ? "high" : "auto"}"></div>
          <div class="world-caption">
            <h2 class="world-title"><span>${escape(world.title)}</span></h2>
          </div>
        </a>
      </article>`).join("");
  }

  function selectedOptions(world, choice) {
    const values = state.choices[world.id]?.[choice.id] || [];
    return (choice.options || []).filter(option => values.includes(option.value));
  }

  function answered(world, choice) {
    if (choice.type === "text") return Boolean(String(state.choices[world.id]?.[choice.id] || "").trim());
    return choice.type === "scale" ? /^(10|[1-9])$/.test(String(state.choices[world.id]?.[choice.id])) : selectedOptions(world, choice).length > 0;
  }

  function answerLabel(world, choice) {
    if (choice.type === "text") return String(state.choices[world.id]?.[choice.id] || "").trim() || "Обсудим вместе";
    if (choice.type === "scale") {
      const value = state.choices[world.id]?.[choice.id];
      return answered(world, choice) ? `${value} / 10 (${choice.minLabel} → ${choice.maxLabel})` : "Обсудим вместе";
    }
    return selectedOptions(world, choice).map(option => option.label).join("; ") || "Обсудим вместе";
  }

  function choiceNote(selected) {
    if (!selected.length) return "Можно оставить без выбора — решим вместе.";
    if (selected.length === 1) return selected[0].note;
    return `Подходят: ${selected.map(option => option.label).join("; ")}.`;
  }

  function renderChoice(world, choice, location = "dossier") {
    if (choice.type === "text") {
      const id = `pref-${world.id}-${choice.id}-${location}`;
      return `<fieldset class="choice-group text-choice" data-ui><legend><label for="${id}">${escape(choice.label)}</label></legend><textarea id="${id}" name="${id}" rows="3" maxlength="1000" placeholder="${escape(choice.placeholder || "Ваш вариант…")}" data-preference="${escape(choice.id)}" data-campaign-id="${escape(world.id)}">${escape(state.choices[world.id]?.[choice.id] || "")}</textarea></fieldset>`;
    }
    if (choice.type === "scale") {
      const value = state.choices[world.id]?.[choice.id];
      const id = `pref-${world.id}-${choice.id}-${location}`;
      return `<fieldset class="choice-group tone-choice" data-ui><legend><label for="${id}">${escape(choice.label)}</label></legend><div class="tone-endpoints"><span>${escape(choice.minLabel)}</span><output for="${id}" id="output-${id}">${answered(world, choice) ? value + " / 10" : "—"}</output><span>${escape(choice.maxLabel)}</span></div><input type="range" id="${id}" name="${id}" min="1" max="10" step="1" value="${answered(world, choice) ? value : 5}" data-rated="${answered(world, choice)}" data-preference="${escape(choice.id)}" data-campaign-id="${escape(world.id)}" aria-valuetext="${answered(world, choice) ? escape(answerLabel(world, choice)) : "Оценка не выбрана"}"><div class="scale-ticks" aria-hidden="true">${Array.from({length:10},(_,i)=>`<span>${i+1}</span>`).join("")}</div></fieldset>`;
    }
    const selected = selectedOptions(world, choice);
    const noteId = `note-${world.id}-${choice.id}-${location}`;
    return `<fieldset class="choice-group" data-ui><legend>${escape(choice.label)}</legend>
      <p class="sr-only" id="help-${noteId}">Можно отметить несколько вариантов.</p>
      <div class="choice-options">${choice.options.map((option) => `
        <label class="choice-label"><input type="checkbox" name="pref-${escape(world.id)}-${escape(choice.id)}-${escape(location)}" value="${escape(option.value)}" data-preference="${escape(choice.id)}" data-campaign-id="${escape(world.id)}" data-note-id="${noteId}" aria-describedby="help-${noteId} ${noteId}" ${selected.some(item => item.value === option.value) ? "checked" : ""}><span>${escape(option.label)}</span></label>`).join("")}</div>
      <p class="sr-only" id="${noteId}" aria-live="polite">${escape(choiceNote(selected))}</p>
    </fieldset>`;
  }

  function bindPreferences(root) {
    root.querySelectorAll("[data-preference]").forEach(input => {
      const onAnswer = () => {
        const world = campaigns.find(item => item.id === input.dataset.campaignId);
        const choice = world?.choices.find(item => item.id === input.dataset.preference);
        if (!choice) return;
        const editingReminder = input.closest("[data-reminder-world]");
        if (!state.choices[world.id] || typeof state.choices[world.id] !== "object") state.choices[world.id] = {};
        if (choice.type === "text") {
          state.choices[world.id][choice.id] = input.value.slice(0,1000);
        } else if (choice.type === "scale") {
          if (!/^(10|[1-9])$/.test(input.value)) return;
          state.choices[world.id][choice.id] = input.value;
        } else {
          if (!choice.options.some(option => option.value === input.value)) return;
          const values = new Set(selectedOptions(world, choice).map(option => option.value));
          if (input.checked) values.add(input.value); else values.delete(input.value);
          state.choices[world.id][choice.id] = [...values];
        }
        document.querySelectorAll("[data-preference]").forEach(control => {
          const campaign = campaigns.find(item => item.id === control.dataset.campaignId);
          const question = campaign?.choices.find(item => item.id === control.dataset.preference);
          if (!question) return;
          if (question.type === "text") {
            if (control !== input) control.value = state.choices[campaign.id]?.[question.id] || "";
          } else if (question.type === "scale") {
            control.dataset.rated = String(answered(campaign, question));
            control.value = state.choices[campaign.id]?.[question.id] || 5;
            control.setAttribute("aria-valuetext", answerLabel(campaign, question));
            byId(`output-${control.id}`).textContent = answered(campaign, question) ? control.value + " / 10" : "—";
          } else {
            const selected = selectedOptions(campaign, question);
            control.checked = selected.some(option => control.value === option.value);
            const note = byId(control.dataset.noteId);
            if (note) note.textContent = choiceNote(selected);
          }
        });
        if (!editingReminder) renderUnansweredQuestions();
        else editingReminder.querySelector(".confirm-reminder").disabled = !world.choices.some(question => answered(world, question) && editingReminder.querySelector(`[data-preference="${question.id}"]`));
        invalidateExport();
        save();
      };
      input.addEventListener(input.type === "range" || input.tagName === "TEXTAREA" ? "input" : "change", onAnswer);
      if (input.type === "range") input.addEventListener("pointerdown", onAnswer);
    });
  }

  function renderUnansweredQuestions() {
    const container = byId("question-reminders");
    const confirmation = byId("questions-confirmation");
    const pending = campaigns.map(world => ({ world, choices: world.choices.filter(choice => !answered(world, choice)) })).filter(group => group.choices.length);
    container.hidden = pending.length === 0;
    confirmation.hidden = pending.length > 0;
    confirmation.textContent = pending.length ? "" : "Все вопросы о сеттингах заполнены.";
    container.innerHTML = pending.map(({ world, choices }) => `<section class="question-reminder" data-reminder-world="${escape(world.id)}" aria-labelledby="reminder-title-${escape(world.id)}" data-ui><h3 id="reminder-title-${escape(world.id)}">${escape(world.title)}</h3>${choices.map(choice => renderChoice(world, choice, "reminder")).join("")}<button type="button" class="button secondary-button confirm-reminder" disabled>Готово</button></section>`).join("");
    bindPreferences(container);
    container.querySelectorAll(".confirm-reminder").forEach(button => button.addEventListener("click", () => {
      renderUnansweredQuestions();
      const nextQuestion = container.querySelector("[data-preference]");
      (nextQuestion || byId("wishes")).focus();
    }));
  }

  function renderAtmosphereArt(art, className = "") {
    if (!art) return "";
    return `<figure class="chapter-art ${escape(className)}"><a class="art-open" href="${escape(art.src)}" target="_blank" rel="noopener noreferrer" aria-label="Рассмотреть иллюстрацию: ${escape(art.alt)} (в новой вкладке)"><img src="${escape(art.src)}" alt="${escape(art.alt)}" width="${Number(art.width) || 960}" height="${Number(art.height) || 540}" loading="lazy"></a><figcaption>${externalLink(art.url, art.credit)}</figcaption></figure>`;
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

  function renderDossier() {
    const root = byId("dossier-content");
    root.querySelectorAll(".setting-page").forEach(page => { page._atmosphereCleanup?.(); page._sceneCleanup?.(); });
    root.querySelectorAll("*").forEach(element => entranceObserver?.unobserve(element));
    root.replaceChildren();
    for (const world of campaigns) renderWorldDossier(world, root);
    renderUnansweredQuestions();
  }

  function renderPremise(text) {
    if (typeof text === "string") return `<p>${escape(text)}</p>`;
    const parts = (text.parts || []).map(part => typeof part === "string" ? escape(part) : `<span class="redacted-text" role="img" aria-label="Засекречено"><span aria-hidden="true">${escape(part.redacted)}</span></span>`).join("");
    return `<p>${parts}</p>`;
  }

  function renderWorldDossier(world, root) {
    const bureauChoice = world.choices.find(choice => choice.id === "bureau");
    const worldChoices = world.choices.filter(choice => choice.placement === "world");
    const cityChoices = world.choices.filter(choice => choice.placement === "city");
    const storyChoices = world.choices.filter(choice => choice.placement === "story");
    const otherChoices = world.choices.filter(choice => choice.id !== "bureau" && !["world", "city", "story"].includes(choice.placement));
    const allArt = world.atmosphereArt || [];
    const primaryArt = allArt.length ? [allArt[Math.min(2, allArt.length - 1)]] : [];
    const additionalArt = allArt;
    const scrollScenes = world.scrollBackgrounds || [];
    const sceneInterlude = index => {
      const art = scrollScenes[index];
      if (!art) return "";
      return `<figure class="scene-interlude"><img src="${escape(art.src)}" alt="${escape(art.alt)}" width="${Number(art.width)||1200}" height="${Number(art.height)||800}" loading="lazy" decoding="async"><figcaption>${externalLink(art.url, art.credit)}</figcaption></figure>`;
    };
    const poster = world.backgroundPoster || { src: world.cover, alt: world.coverAlt, credit: world.credit, url: world.creditUrl };
    const content = document.createElement("article");
    content.className = "setting-page";
    content.id = `dossier-${world.id}`;
    content.dataset.setting = world.id;
    content.setAttribute("aria-labelledby", `title-${world.id}`);
    root.append(content);
    content.innerHTML = `
      <div class="dossier-visual">
        <img class="dossier-art" src="${escape(poster.src)}" alt="${escape(poster.alt)}" width="1200" height="480" loading="lazy">
        ${world.backgroundVideo ? `<video class="atmosphere-video" autoplay loop muted playsinline preload="metadata" poster="${escape(poster.src)}" aria-hidden="true" tabindex="-1"><source src="${escape(world.backgroundVideo)}" type="video/mp4"></video><button type="button" class="video-toggle" aria-pressed="false">Включить атмосферу</button>` : ""}
        <div class="hero-shade" aria-hidden="true"></div>
        <div class="dossier-title-row wrap"><h2 id="title-${world.id}">${escape(world.title)}</h2>${world.id === "anomalies" ? `<div class="redaction-marks" aria-hidden="true"><span>СЛУЖЕБНАЯ ИНФОРМАЦИЯ</span><span>ДОСТУП ОГРАНИЧЕН</span></div>` : ""}${world.id === "vampire" ? `<div class="blood-drips" aria-hidden="true"><i></i><i></i><i></i><i></i></div>` : ""}</div>
      </div>
      <div class="setting-body wrap">
      <p class="art-caption">${externalLink(poster.url, poster.credit || "Материалы для обсуждения")}${world.videoSources?.length ? ` · Видео: ${world.videoSources.map(source => externalLink(source.url, source.title)).join(" / ")}` : world.videoCredit ? ` · Видео: ${externalLink(world.videoCreditUrl, world.videoCredit)}` : ""}</p>
      <div class="dossier-chapters">
        <div class="dossier-reading${scrollScenes.length ? " has-scroll-scenes" : ""}">
          ${scrollScenes.length ? `<div class="scroll-scenes" aria-hidden="true"><div class="scroll-scene-sticky">${scrollScenes.map((art,index) => `<img class="scroll-scene${index === 0 ? " is-active" : ""}" src="${escape(art.src)}" alt="" width="${Number(art.width)||1200}" height="${Number(art.height)||800}" loading="lazy">`).join("")}</div></div>` : ""}
          ${primaryArt.map(art => `<img class="reading-backdrop" src="${escape(art.src)}" alt="" width="${Number(art.width)||1200}" height="${Number(art.height)||800}" loading="lazy" aria-hidden="true">`).join("")}
          <div class="reading-shade" aria-hidden="true"></div>
          <div class="world-copy">
            <section class="dossier-block world-description"><h3>О мире</h3>${world.premise.map((text,index) => renderPremise(text) + (index === Math.min(1,world.premise.length - 1) ? sceneInterlude(0) : "")).join("")}${sceneInterlude(1)}${worldChoices.map(choice => renderChoice(world, choice)).join("")}${world.bureaus ? `<dl class="bureau-list">${world.bureaus.map(bureau => `<div><dt>${escape(bureau.title)}</dt><dd>${escape(bureau.description)}</dd></div>`).join("")}</dl>` : ""}${bureauChoice ? `<div class="bureau-inline">${renderChoice(world, bureauChoice)}</div>` : ""}${sceneInterlude(2)}</section>
            ${cityChoices.length ? `<section class="dossier-block city-chapter" aria-label="Выбор города">${cityChoices.map(choice => renderChoice(world, choice)).join("")}</section>` : ""}
            <section class="dossier-block story-chapter"><h3>Ваша история</h3>${world.story || !storyChoices.length ? `<p>${escape(world.story || "—")}</p>` : ""}${storyChoices.map(choice => renderChoice(world, choice)).join("")}</section>
            ${otherChoices.length ? `<section class="preferences" aria-label="Пожелания к миру">${otherChoices.map((choice) => renderChoice(world, choice)).join("")}</section>` : ""}
          </div>
          ${scrollScenes.length || primaryArt.length ? `<p class="scene-credit">${externalLink((scrollScenes[0] || primaryArt[0]).url, (scrollScenes[0] || primaryArt[0]).credit)}</p>` : ""}
        </div>
        ${additionalArt.length ? `<div class="additional-art" aria-label="Иллюстрации мира">${additionalArt.map((art,index) => renderAtmosphereArt(art, index === 0 ? "art-feature" : "")).join("")}</div>` : ""}
        ${renderMaterials(world)}
      </div>
      <div class="dossier-end">
        <section class="system-block"><h3>На какой системе</h3><strong>${escape(world.system.name)}</strong><p>${escape(world.system.description)}</p><p>${externalLink(world.system.url, world.system.linkLabel)}</p></section>
        <section class="references-block"><h3>Поймать настроение</h3><ul class="ref-list">${world.references.map((item) => `<li>${externalLink(item.url, item.title)}</li>`).join("")}</ul></section>
      </div></div>`;
    setupAtmosphere(content);
    setupScrollScenes(content, scrollScenes);
    observeEntrances(content);
    bindPreferences(content);
    content.querySelectorAll(".material-image img").forEach((image) => image.addEventListener("error", () => {
      const notice = document.createElement("p");
      notice.className = "field-help";
      notice.textContent = "Иллюстрация пока недоступна.";
      image.replaceWith(notice);
    }, { once: true }));
  }

  function setupScrollScenes(content, artworks) {
    if (!artworks.length) return;
    const stage = content.querySelector(".has-scroll-scenes");
    const scenes = [...stage.querySelectorAll(".scroll-scene")];
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let active = -1;
    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const distance = Math.max(1, rect.height - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const index = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
      if (index === active) return;
      active = index;
      stage.dataset.activeScene = String(index);
      scenes.forEach((scene,i) => scene.classList.toggle("is-active",i === index));
      const art = artworks[index];
      stage.querySelector(".scene-credit").innerHTML = externalLink(art.url,art.credit);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule,{passive:true});
    preference.addEventListener("change",schedule);
    update();
    content._sceneCleanup = () => { window.removeEventListener("scroll",schedule); window.removeEventListener("resize",schedule); preference.removeEventListener("change",schedule); cancelAnimationFrame(frame); };
  }

  function setupAtmosphere(content) {
    const video = content.querySelector(".atmosphere-video");
    const button = content.querySelector(".video-toggle");
    if (!video || !button) return;
    let requested = false;
    let visible = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
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
    const canAutoplay = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    requested = canAutoplay;
    video.autoplay = canAutoplay;
    if (!canAutoplay) video.pause();
    const observer = new IntersectionObserver(entries => {
      if (!video.isConnected) { observer.disconnect(); return; }
      visible = entries[0].isIntersecting;
      if (visible && requested && !document.hidden) play(); else video.pause();
    }, { threshold: 0.05 });
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
        <img class="rating-image" src="${escape(world.cover)}" alt="" width="80" height="100" loading="lazy">
        <div class="rating-controls">
        <div class="rating-heading"><label for="interest-${escape(world.id)}">${escape(world.title)}</label><span><output id="score-${escape(world.id)}" for="interest-${escape(world.id)}">—</output> / 10</span></div>
        <input type="range" id="interest-${escape(world.id)}" name="interest-${escape(world.id)}" min="1" max="10" step="1" value="5" data-rated="false" aria-valuetext="Оценка не выбрана" aria-describedby="scale-help">
        <div class="scale-ticks" aria-hidden="true">${Array.from({ length: 10 }, (_, index) => `<span>${index + 1}</span>`).join("")}</div>
        </div>
      </div>`).join("");
    byId("interest-list").querySelectorAll('input[type="range"]').forEach(input => {
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
    for (const name of Object.keys(values)) if (name.startsWith("pref-")) delete values[name];
    byId("interest-list").querySelectorAll('input[type="range"]').forEach(input => {
      if (input.dataset.rated !== "true") delete values[input.name];
    });
    return values;
  }

  const form = byId("feedback-form");

  function restoreForm() {
    for (const [name, value] of Object.entries(state.form)) {
      if (name.startsWith("pref-")) continue;
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
      for (const choice of world.choices) lines.push(`${choice.label} ${answerLabel(world, choice)}`);
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
  let sendingAnswer = false;
  let playerToken = "";
  try { playerToken = localStorage.getItem("setting-choice-player-token-v1") || ""; } catch {}
  async function sendAnswer() {
    const api = safeUrl(window.SITE_CONFIG?.feedbackApiUrl);
    if (!api) throw new Error("Приём ответов ещё не настроен. Скачайте ответ и пришлите ведущему.");
    const values = formValues();
    const payload = {
      name: values.playerName.trim(),
      ratings: Object.fromEntries(campaigns.map(world => [world.id, values[`interest-${world.id}`] ? Number(values[`interest-${world.id}`]) : null])),
      questions: campaigns.flatMap(world => world.choices.map(choice => ({world: world.title, id: choice.id, label: choice.label, answer: answerLabel(world, choice), answered: Boolean(answered(world, choice))}))),
      wishes: values.wishes.trim(), boundaries: values.boundaries.trim(),
    };
    const post = async (path, body) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(new URL(path, api), {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal,credentials:"omit"});
        const data = await response.json();
        if (!response.ok) { const error = new Error(data.error || "Не удалось отправить ответ."); error.status = response.status; throw error; }
        return data;
      } finally { clearTimeout(timeout); }
    };
    const session = async () => { playerToken = (await post("/api/session", {})).token; try { localStorage.setItem("setting-choice-player-token-v1", playerToken); } catch {} };
    if (!playerToken) await session();
    try { await post("/api/answers", {token:playerToken,payload}); }
    catch(error) { if(error.status !== 401) throw error; await session(); await post("/api/answers", {token:playerToken,payload}); }
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sendingAnswer || !validForm()) return;
    captureForm();
    const revision = exportRevision;
    const button = form.querySelector('button[type="submit"]');
    sendingAnswer = true;
    button.disabled = true;
    button.textContent = "Отправка…";
    byId("form-status").textContent = "Сохраняем ответ…";
    try {
      await sendAnswer();
      byId("form-status").textContent = revision === exportRevision ? "Ответ отправлен ведущему. Повторная отправка обновит его." : "Предыдущая версия отправлена. Отправьте ещё раз, чтобы сохранить изменения.";
    } catch(error) {
      byId("form-status").textContent = error.name === "AbortError" ? "Сервис не ответил. Попробуйте ещё раз; черновик сохранён." : (error instanceof TypeError ? "Нет связи с сервисом. Попробуйте ещё раз или скачайте .txt; черновик сохранён." : error.message);
    } finally { sendingAnswer = false; button.disabled = false; button.textContent = "Отправить ответ"; }
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

  document.querySelectorAll("[data-world]").forEach((control) => {
    control.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (control.tagName === "A") event.preventDefault();
      state.active = control.dataset.world;
      document.querySelectorAll(".world-open").forEach(link => link.setAttribute("aria-current",String(link.dataset.world === state.active)));
      save();
      if (control.tagName === "A") byId(`dossier-${state.active}`).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  });

  observeEntrances(document);
  requestAnimationFrame(restoreOpening);
  document.fonts.ready.then(restoreOpening);
})();
