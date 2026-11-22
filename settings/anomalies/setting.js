window.CAMPAIGNS = window.CAMPAIGNS || [];
window.CAMPAIGNS.push({
  id: "anomalies",
  title: "SCP Foundation",
  shortTitle: "SCP Foundation",
  genre: "Паранормальный триллер",
  cardText: "У реальности есть правила. Ваша работа — разбираться с исключениями.",
  cover: "settings/anomalies/images/user-scp-cover.png",
  coverWidth: 714,
  coverHeight: 1014,
  coverAlt: "Огромное существо над заброшенным посёлком в жёлтой дымке; человек прячется у стены",
  credit: "Иллюстрация, выбранная ведущим · подписи автора сохранены на изображении",
  creditUrl: "",
  hook: "Вчера этой двери не было. Сегодня за ней пропала ваша смена.",
  premise: [
    "Мир полон загадочных существ и тварей. Многие из них достаточно опасны, чтобы угрожать жизни людей и привычному порядку вещей.",
    "Для обнаружения и изоляции аномалий, их содержания и защиты людей была основана SCP Foundation. Внутри Фонда работают три бюро, каждое из которых отвечает за свою сторону работы с аномалиями.",
  ],
  bureaus: [
    { title: "Бюро безопасности · Security", description: "Вооружённые оперативные группы, которые входят на неизведанные или уже известные опасные территории. Они ведут разведку, работают с угрозами на месте и выполняют задачи там, куда нельзя отправить обычных сотрудников." },
    { title: "Бюро содержания · Contain", description: "Отвечает за содержание и сохранность SCP, их более подробное изучение и разработку специальных условий содержания. Его сотрудники делают так, чтобы аномалии оставались изолированными, а их свойства были понятны Фонду." },
    { title: "Бюро защиты · Protect", description: "Агенты, работающие с обычными людьми, в духе «Людей в чёрном». Они защищают гражданских от аномалий и от ужаса знания о том, что такое SCP: помогают пострадавшим, работают со свидетелями, скрывают следы происшествий и при необходимости корректируют воспоминания. Их задача — вернуть людям привычную жизнь, сохранив существование Фонда в тайне." },
  ],
  story: "Вы будете командой одного из трёх бюро SCP Foundation. В каком именно отделе начнётся ваша история, выберем вместе.",
  choices: [
    { id: "tone", type: "scale", label: "Классический SCP или Inside Job?", minLabel: "Классический SCP", maxLabel: "Inside Job", placement: "story" },
    { id: "bureau", label: "В каком бюро хотите играть?", options: [
      { value: "security", label: "Бюро безопасности", note: "Вооружённые вылазки на неизведанные и опасные территории." },
      { value: "contain", label: "Бюро содержания", note: "Изоляция, сохранность и подробное изучение SCP." },
      { value: "protection", label: "Бюро защиты", note: "Работа с гражданскими и свидетелями, защита людей и сохранение тайны Фонда — в духе «Людей в чёрном»." },
    ] },
  ],
  system: {
    name: "SCP RPG V2 / Daggerheart",
    status: "Окончательный вариант выберем перед игрой",
    description: "Рассматриваем SCP RPG V2 или Daggerheart с адаптацией под нашу версию Фонда. После выбора системы вместе разберём правила и создадим команду выбранного бюро.",
    url: "https://www.daggerheart.com/",
    linkLabel: "Открыть Daggerheart",
  },
  references: [
    { title: "Inside Job · Корпорация «Заговор»", url: "https://www.youtube.com/watch?v=ZOzraPZTOjM", note: "Мультсериал о тайной организации, заговорах и абсурдных рабочих буднях." },
    { title: "SCP: OVERLORD", url: "https://www.youtube.com/watch?v=EOxarwd3eTs", note: "Игровой фильм: настоящие актёры, экипировка и работа оперативной группы Фонда." },
    { title: "SCP: Dollhouse", url: "https://www.youtube.com/watch?v=xVx2jyDPinw", note: "Приземлённая съёмка об оперативниках, входящих в обычный дом с аномалией." },
    { title: "Control", url: "https://www.remedygames.com/games/control", note: "Архитектура Бюро, аномальные предметы и ощущение сдвинувшейся реальности." },
    { title: "SCP Foundation", url: "https://scp-wiki.wikidot.com/", note: "Секретные досье, процедуры содержания и непознаваемые явления." },
  ],
  // Медиа не подключаются автоматически. Добавляйте свои файлы в images/, videos/, texts/.
  // Пример картинки: { src: "settings/anomalies/images/hall.jpg", alt: "Описание", caption: "Подпись" }
  backgroundVideo: "settings/anomalies/videos/scp-field-montage.mp4",
  backgroundPoster: {
    src: "settings/anomalies/images/scp-selected-space.png",
    alt: "Искажённое пространство и парящие фрагменты здания в Control",
    credit: "Control · Remedy Entertainment",
    url: "https://store.steampowered.com/app/870780/",
  },
  videoSources: [
    { title: "SCP: OVERLORD", url: "https://www.youtube.com/watch?v=EOxarwd3eTs" },
    { title: "SCP: Dollhouse", url: "https://www.youtube.com/watch?v=xVx2jyDPinw" },
  ],
  atmosphereArt: [
    { src: "settings/anomalies/images/scp-selected-floating.png", width: 600, height: 337, alt: "Парящие фигуры в аномальном пространстве Control, изображение выбранное ведущим", credit: "Control · Remedy Entertainment", url: "https://store.steampowered.com/app/870780/" },
    { src: "settings/anomalies/images/scp-selected-space.png", width: 600, height: 337, alt: "Искажённое пространство Control, изображение выбранное ведущим", credit: "Control · Remedy Entertainment", url: "https://store.steampowered.com/app/870780/" },
    { src: "settings/anomalies/images/scp-selected-creature.png", width: 1546, height: 987, alt: "Высокое существо с прямоугольной головой в туманном лесу, изображение предоставлено ведущим", credit: "Изображение ведущего · автор не установлен", url: "" },
    { src: "settings/anomalies/images/control-creature.jpg", width: 1920, height: 1080, alt: "Нечеловеческое существо в тёмном помещении из Control", credit: "Control · Remedy Entertainment", url: "https://store.steampowered.com/app/870780/" },
    { src: "settings/anomalies/images/control-hiss-entity.jpg", width: 1920, height: 1080, alt: "Красная парящая сущность среди обломков из Control", credit: "Control · Remedy Entertainment", url: "https://store.steampowered.com/app/870780/" },
  ],
  images: [],
  // Пример видео: { src: "settings/anomalies/videos/trailer.mp4", title: "Настроение игры", poster: "settings/anomalies/images/poster.jpg" }
  videos: [],
  // Публикуемый дополнительный текст: { title: "Что знают персонажи", body: "Текст без спойлеров…" }
  texts: [],
});
