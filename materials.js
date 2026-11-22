(() => {
  'use strict';
  const items = window.REFERENCE_LIBRARY || [];
  const names = { anomalies: 'SCP Foundation', 'urban-fantasy': 'Wolf Among Us', vampire: 'Vampire: The Masquerade' };
  const types = { art: 'Арт / кадр', trailer: 'Видео', background: 'Фон 15 секунд', pinterest: 'Pinterest: поиск' };
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let selected = new Set();
  try { const stored = JSON.parse(localStorage.getItem('reference-selection-v1')); if (Array.isArray(stored)) selected = new Set(stored.filter(id => items.some(item => item.id === id))); } catch {}
  const requested = new URL(location.href).searchParams.get('world');
  if (names[requested]) $('filter-world').value = requested;
  function status() {
    $('selection-count').textContent = selected.size ? `Выбрано материалов: ${selected.size}` : 'Пока ничего не выбрано';
    $('copy-selection').disabled = !selected.size;
  }
  function render() {
    $('reference-grid').querySelectorAll('video').forEach(video => video.pause());
    const world = $('filter-world').value;
    const type = $('filter-type').value;
    const filtered = items.filter(item => (world === 'all' || item.world === world) && (type === 'all' || (type === 'selected' ? selected.has(item.id) : item.type === type)));
    $('reference-count').textContent = `Показано: ${filtered.length}`;
    $('reference-grid').innerHTML = filtered.map(item => `<article class="reference-card">
      ${item.image || item.src ? `<div class="reference-preview">${item.src ? `<video controls playsinline preload="none" poster="${esc(item.image)}" aria-label="${esc(item.title)}"><source src="${esc(item.src)}" type="video/mp4"></video>` : `<img src="${esc(item.image)}" alt="${esc(item.title)}" width="1200" height="750" loading="lazy">`}</div>` : ''}
      <h2>${esc(item.title)}</h2><p class="ref-meta">${esc(names[item.world])} · ${esc(types[item.type])}</p>
      <p class="ref-description">${esc(item.description)}</p><p class="ref-description">${esc(item.author)}</p>
      <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(item.title)}: открыть источник в новой вкладке">${item.type === 'pinterest' ? 'Открыть поиск Pinterest' : 'Открыть источник'}</a>
      <div><label class="choice-label"><input type="checkbox" data-select="${esc(item.id)}" aria-label="${esc(item.title)}: в подборку" ${selected.has(item.id) ? 'checked' : ''}><span>В подборку</span></label></div>
    </article>`).join('') || '<p>Таких материалов пока нет. Измените фильтр.</p>';
    $('reference-grid').querySelectorAll('[data-select]').forEach(input => input.addEventListener('change', () => {
      if (input.checked) selected.add(input.dataset.select); else selected.delete(input.dataset.select);
      $('selection-status').textContent = '';
      $('selection-fallback').hidden = true;
      try { localStorage.setItem('reference-selection-v1', JSON.stringify([...selected])); $('reference-storage').textContent = ''; } catch { $('reference-storage').textContent = 'Выбор не сохраняется в этом браузере. Скопируйте подборку перед закрытием.'; }
      status();
      if ($('filter-type').value === 'selected') render();
    }));
    $('reference-grid').querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
      $('reference-grid').querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
    }));
    status();
  }
  $('filter-world').addEventListener('change', render);
  $('filter-type').addEventListener('change', render);
  $('copy-selection').addEventListener('click', async () => {
    const chosen = items.filter(item => selected.has(item.id));
    if (!chosen.length) return;
    const text = ['МАТЕРИАЛЫ ДЛЯ САЙТА', ...Object.keys(names).flatMap(world => {
      const list = chosen.filter(item => item.world === world);
      return list.length ? ['', names[world], ...list.map(item => `${item.title} [${item.id}]\n${item.url}`)] : [];
    })].join('\n');
    try { await navigator.clipboard.writeText(text); $('selection-status').textContent = 'Подборка скопирована. Пришлите её в чат.'; }
    catch { $('selection-fallback').hidden = false; $('selection-text').value = text; $('selection-text').focus(); $('selection-text').select(); $('selection-status').textContent = 'Скопируйте выделенный текст вручную.'; }
  });
  render();
})();
