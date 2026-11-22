window.CAMPAIGNS = window.CAMPAIGNS || [];
window.CAMPAIGNS.push({
  id: "urban-fantasy",
  title: "Wolf Among Us",
  shortTitle: "Wolf Among Us",
  genre: "Сказочный нуар",
  cardText: "Сказки живут по соседству. И у каждой есть то, что она скрывает.",
  cover: "settings/urban-fantasy/images/cover.webp",
  coverAlt: "Бигби в ночном городе из The Wolf Among Us",
  credit: "The Wolf Among Us · Telltale Games",
  creditUrl: "https://store.steampowered.com/app/250320/",
  videoCredit: "Bright · Netflix",
  videoCreditUrl: "https://www.youtube.com/watch?v=6EZCBSsBxko",
  backgroundVideo: "settings/urban-fantasy/videos/bright-atmosphere.mp4",
  atmosphereArt: [
    { src: "settings/urban-fantasy/images/references/wolf-characters.webp", alt: "Персонажи сказочного сообщества в напряжённой сцене разговора", credit: "The Wolf Among Us · Telltale Games", url: "https://store.steampowered.com/app/250320/" },
    { src: "settings/urban-fantasy/images/references/wolf-interior.webp", alt: "Нуарный интерьер с тёплым светом и глубокими тенями", credit: "The Wolf Among Us · Telltale Games", url: "https://store.steampowered.com/app/250320/" },
  ],
  hook: "У этого города две стороны. Вы знаете дорогу между ними.",
  premise: ["—"],
  story: "—",
  choices: [
    { id: "focus", label: "На что сделать упор?", options: [
      { value: "detective", label: "Расследование", note: "Разговоры, улики и дела, у которых нет удобных ответов." },
      { value: "diplomacy", label: "Договоры и интриги", note: "Закрытые сообщества, личные долги и цена обещаний." },
      { value: "expedition", label: "Опасные вылазки", note: "Исследование неизвестного и командные операции." },
    ] },
    { id: "magic", label: "Насколько открыта магия?", options: [
      { value: "hidden", label: "Тайна для большинства", note: "Сохранить секрет бывает важнее, чем победить в открытом столкновении." },
      { value: "revealed", label: "Мир уже знает", note: "Обществу приходится договариваться с тем, что недавно считалось сказкой." },
    ] },
  ],
  system: {
    name: "Fate Condensed",
    status: "Предварительное предложение",
    description: "Аспекты описывают персонажа, его природу, связи и неприятности. Конфликты поддерживают не только драки, но и напряжённые переговоры. Система пока предложена для обсуждения; окончательно выберем её после того, как определимся с игрой.",
    url: "https://fate-srd.com/fate-condensed",
    linkLabel: "Открыть правила Fate Condensed",
  },
  references: [
    { title: "The Wolf Among Us", url: "https://www.telltale.com/the-wolf-among-us/", note: "Для нуара: сказочные герои, закрытое сообщество и морально сложный детектив." },
    { title: "Bright", url: "https://www.youtube.com/watch?v=6EZCBSsBxko", note: "Альтернативный визуальный референс: современный город и сказочные существа. Это источник атмосферы, а не обязательный лор игры." },
    { title: "Carnival Row", url: "https://www.youtube.com/watch?v=369LHB9N-Ro", note: "Сказочные переселенцы, городская жизнь и детектив; более исторический вариант городского фэнтези." },
  ],
  images: [],
  videos: [],
  texts: [],
});
