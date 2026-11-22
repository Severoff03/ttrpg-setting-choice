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
    { src: "settings/urban-fantasy/images/urban-human-and-orc.webp", alt: "Человек и орк работают напарниками в современной полиции", credit: "Bright · Netflix · референс городского фэнтези", url: "https://www.youtube.com/watch?v=6EZCBSsBxko" },
    { src: "settings/urban-fantasy/images/urban-fantasy-street.webp", alt: "Уличное сообщество фантастических существ в современном городе", credit: "Bright · Netflix · референс городского фэнтези", url: "https://www.youtube.com/watch?v=6EZCBSsBxko" },
  ],
  hook: "У этого города две стороны. Вы знаете дорогу между ними.",
  premise: ["—"],
  story: "—",
  choices: [
    { id: "magic", label: "Окружающие знают о магии и фэнтезийных существах?", options: [
      { value: "hidden", label: "Нет, это тайна", note: "Магия и необычные существа скрываются от обычных людей." },
      { value: "revealed", label: "Да, знают", note: "Магия и фэнтезийные существа — известная часть мира." },
    ] },
  ],
  system: {
    name: "Daggerheart",
    status: "Система для нашей игры",
    description: "Играем на Daggerheart, адаптируя персонажей и способности под городское фэнтези. Правила и создание персонажей разберём вместе перед началом.",
    url: "https://www.daggerheart.com/",
    linkLabel: "Открыть Daggerheart",
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
