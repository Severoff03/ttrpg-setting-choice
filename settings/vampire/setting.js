window.CAMPAIGNS = window.CAMPAIGNS || [];
window.CAMPAIGNS.push({
  id: "vampire",
  title: "Vampire: The Masquerade",
  shortTitle: "Vampire: The Masquerade",
  genre: "Личный и политический хоррор",
  cardText: "Город принадлежит бессмертным. Но за эту ночь ещё придётся заплатить.",
  cover: "settings/vampire/images/cover.webp",
  coverAlt: "Официальная иллюстрация Vampire: The Masquerade — Bloodlines 2",
  credit: "Bloodlines 2 · Paradox Interactive / The Chinese Room",
  creditUrl: "https://store.steampowered.com/app/532790/",
  videoCredit: "Bloodlines 2 · Paradox Interactive",
  videoCreditUrl: "https://www.youtube.com/watch?v=pjPWT0M7AOM",
  hook: "Вы пережили собственную смерть. Теперь попробуйте сохранить себя.",
  premise: ["—"],
  story: "—",
  choices: [
    { id: "focus", label: "О чём будет хроника?", options: [
      { value: "humanity", label: "Человечность", note: "Личные связи, голод и выбор между удобным и человеческим." },
      { value: "politics", label: "Власть и интриги", note: "Сделки, кланы, территории и опасные покровители." },
      { value: "streets", label: "Ночное выживание", note: "История молодой котерии на уровне улиц и собственного убежища." },
    ] },
    { id: "faction", label: "Где начнём?", options: [
      { value: "camarilla", label: "В тени Камарильи", note: "Иерархия, формальные правила и покровительство с условиями." },
      { value: "anarch", label: "Среди анархов", note: "Больше самостоятельности — и меньше тех, кто прикроет спину." },
      { value: "undecided", label: "Без стороны", note: "Начнём с местной истории и познакомимся с фракциями в игре." },
    ] },
    { id: "lore", label: "Сколько лора на старте?", options: [
      { value: "new", label: "Открываем мир вместе", note: "Недавно Обращённые герои; знания приходят через сцены." },
      { value: "known", label: "Уже знаем правила ночи", note: "Котерия знакома с основами; сразу переходим к сложным решениям." },
    ] },
  ],
  system: {
    name: "Vampire: The Masquerade",
    status: "Предлагаемая редакция — V5; окончательно согласуем",
    description: "Профильная система личного и политического вампирского хоррора. Пулы десятигранных кубиков определяют исход действий, а в V5 кубики Голода напоминают, что внутри живёт Зверь. Человечность, убеждения и связи с людьми делают цену поступков частью правил. До старта отдельно выберем редакцию и границы изображения насилия, кормления и принуждения.",
    url: "https://www.paradoxinteractive.com/games/world-of-darkness/about",
    linkLabel: "Открыть официальный World of Darkness",
  },
  references: [
    { title: "World of Darkness", url: "https://www.paradoxinteractive.com/games/world-of-darkness/about", note: "Официальное знакомство с Миром Тьмы и Vampire: The Masquerade." },
    { title: "Vampire: The Masquerade — Bloodlines", note: "Ориентир по настроению города и ночного общества. Знание сюжета и игры не требуется; правила НРИ будем разбирать отдельно." },
    { title: "Vampire: The Masquerade — Bloodlines 2", url: "https://www.youtube.com/watch?v=pjPWT0M7AOM", note: "Релизный трейлер новой игры: ночной город и вампирская атмосфера." },
  ],
  backgroundVideo: "settings/vampire/videos/bloodlines2-atmosphere.mp4",
  images: [],
  videos: [],
  texts: [],
});
