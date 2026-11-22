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
  premise: [
    "Среди вампиров живёт древняя легенда о Каине. За убийство своего брата Авеля он был проклят и стал первым вампиром. Три ангела усугубили его проклятие, обрекая на существование во тьме. От Каина пошли новые поколения вампиров, передававшие свою кровь и проклятие дальше.",
    "В современном Мире Тьмы существует 14 вампирских кланов. Их представители различаются традициями, слабостями и наборами сверхъестественных способностей — Дисциплин. Одни подчиняют чужую волю, другие меняют облик или обладают нечеловеческой силой. Клан определяет многое, но не решает за персонажа, кем ему быть.",
    "Вампирское общество скрыто от мира людей. Этот секрет называют Маскарадом: обычные горожане не должны узнать, кто живёт рядом с ними. При этом вампиры сильно влияют на человеческий мир — через деньги, политику, бизнес, личные связи и тех, кто выполняет их волю. За привычной жизнью города идёт другая: борьба за власть, территории и право пережить следующую ночь.",
  ],
  story: "Кем будут ваши персонажи и как закрутится ваша история, нам ещё предстоит обсудить. Пока у меня нет чёткого представления об этом.",
  choices: [
    { id: "city", label: "В каком городе хотите играть?", options: [
      { value: "russian-anonymous", label: "Безымянный российский город", note: "Выдуманный город в России: вместе определим его ночную жизнь и местных вампиров." },
      { value: "american-anonymous", label: "Безымянный американский город", note: "Выдуманный город в США со своей вампирской иерархией." },
      { value: "american-specific", label: "Конкретный город США", note: "Название города можно написать в пожеланиях к игре." },
      { value: "moscow", label: "Москва", note: "Ночная Москва и её скрытое вампирское общество." },
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
  atmosphereArt: [
    { src: "settings/vampire/images/vampire-society.webp", width: 960, height: 540, alt: "Персонажи вампирского общества в ночном интерьере", credit: "Bloodlines 2 · Paradox Interactive / The Chinese Room", url: "https://www.youtube.com/watch?v=pjPWT0M7AOM" },
    { src: "settings/vampire/images/vampire-night-street.webp", width: 960, height: 540, alt: "Тёмный городской переулок с ночным освещением", credit: "Bloodlines 2 · Paradox Interactive / The Chinese Room", url: "https://www.youtube.com/watch?v=pjPWT0M7AOM" },
  ],
  images: [],
  videos: [],
  texts: [],
});
