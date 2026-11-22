window.CAMPAIGNS = window.CAMPAIGNS || [];
window.CAMPAIGNS.push({
  id: "anomalies",
  title: "SCP Foundation",
  shortTitle: "SCP Foundation",
  genre: "Паранормальный триллер",
  cardText: "У реальности есть правила. Ваша работа — разбираться с исключениями.",
  cover: "settings/anomalies/images/scp-field-montage.webp",
  coverAlt: "Оперативники SCP выдвигаются через лес в фильме OVERLORD",
  credit: "SCP: OVERLORD · Evan Royalty / Stephen Hancock · CC BY-SA 3.0",
  creditUrl: "https://www.youtube.com/watch?v=EOxarwd3eTs",
  hook: "Вчера этой двери не было. Сегодня за ней пропала ваша смена.",
  premise: [
    "Мир полон загадочных существ и тварей. Многие из них достаточно опасны, чтобы угрожать жизни людей и привычному порядку вещей.",
    "Для их отлова, контроля и защиты была основана SCP Foundation. Внутри Фонда работают три бюро, каждое из которых отвечает за свой этап работы с аномалиями.",
  ],
  bureaus: [
    { title: "Бюро безопасности · Security", description: "Вооружённые оперативные группы, которые входят на неизведанные или уже известные опасные территории. Они ведут разведку, работают с угрозами на месте и выполняют задачи там, куда нельзя отправить обычных сотрудников." },
    { title: "Бюро контроля · Control", description: "Отвечает за сохранность и содержание SCP, их более подробное изучение и разработку условий, при которых аномалии можно удерживать под контролем." },
    { title: "Бюро защиты", description: "Подключается на последних этапах, когда возникают непредвиденные ситуации. Здесь работают оперативники, которым приходится действовать, если что-то пошло не по плану." },
  ],
  story: "Вы будете командой одного из трёх бюро SCP Foundation. В каком именно отделе начнётся ваша история, выберем вместе.",
  choices: [
    { id: "bureau", label: "В каком бюро хотите играть?", options: [
      { value: "security", label: "Бюро безопасности", note: "Вооружённые вылазки на неизведанные и опасные территории." },
      { value: "control", label: "Бюро контроля", note: "Содержание, сохранность и подробное изучение SCP." },
      { value: "protection", label: "Бюро защиты", note: "Оперативная работа при непредвиденных ситуациях." },
    ] },
  ],
  system: {
    name: "Fate Condensed",
    status: "Предложение ведущему; можно заменить",
    description: "Система о компетентных героях, их сильных сторонах и неприятностях. Аспекты описывают персонажа и ситуацию, а очки судьбы позволяют влиять на историю. Подходит, если важнее решения, цена способностей и расследование, чем подробный расчёт снаряжения. Опасность и пределы аномальных сил согласуем до игры.",
    url: "https://fate-srd.com/fate-condensed",
    linkLabel: "Открыть правила Fate Condensed",
  },
  references: [
    { title: "SCP: OVERLORD", url: "https://www.youtube.com/watch?v=EOxarwd3eTs", note: "Игровой фильм: настоящие актёры, экипировка и работа оперативной группы Фонда." },
    { title: "SCP: Dollhouse", url: "https://www.youtube.com/watch?v=xVx2jyDPinw", note: "Приземлённая съёмка об оперативниках, входящих в обычный дом с аномалией." },
    { title: "Control", url: "https://www.remedygames.com/games/control", note: "Архитектура Бюро, аномальные предметы и ощущение сдвинувшейся реальности." },
    { title: "SCP Foundation", url: "https://scp-wiki.wikidot.com/", note: "Секретные досье, процедуры содержания и непознаваемые явления." },
  ],
  // Медиа не подключаются автоматически. Добавляйте свои файлы в images/, videos/, texts/.
  // Пример картинки: { src: "settings/anomalies/images/hall.jpg", alt: "Описание", caption: "Подпись" }
  backgroundVideo: "settings/anomalies/videos/scp-field-montage.mp4",
  videoSources: [
    { title: "SCP: OVERLORD", url: "https://www.youtube.com/watch?v=EOxarwd3eTs" },
    { title: "SCP: Dollhouse", url: "https://www.youtube.com/watch?v=xVx2jyDPinw" },
  ],
  atmosphereArt: [
    { src: "settings/anomalies/images/references/control-architecture.webp", alt: "Одинокая фигура в огромном тёмном пространстве аномального комплекса", credit: "Control · Remedy Entertainment", url: "https://www.remedygames.com/games/control" },
    { src: "settings/anomalies/images/references/scp-lab.webp", alt: "Коридоры технического комплекса с точки зрения оперативника", credit: "SCP: 5K · Affray Interactive", url: "https://store.steampowered.com/app/872670/" },
  ],
  images: [],
  // Пример видео: { src: "settings/anomalies/videos/trailer.mp4", title: "Настроение игры", poster: "settings/anomalies/images/poster.jpg" }
  videos: [],
  // Публикуемый дополнительный текст: { title: "Что знают персонажи", body: "Текст без спойлеров…" }
  texts: [],
});
