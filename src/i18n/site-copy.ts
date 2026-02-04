export const siteCopy = {
  cs: {
    nav: {
      place: "Místo",
      program: "Program",
    },
    homeLabel: "Domů",
    place: {
      title: "Místo",
      mapLink: "Otevřít v Google Maps",
      mapPlaceholder: "Mapa se zobrazí, jakmile doplníme detaily.",
    },
    home: {
      seo: "Místo, program a praktické informace pro hosty.",
    },
    schedule: {
      title: "Program",
      items: [
        {
          time: "12:00",
          text: "Setkání na",
          linkText: "místě",
          href: "/misto",
        },
        { time: "13:00", title: "Obřad" },
        { time: "14:00", title: "Společný oběd a gratulace" },
        { time: "16:00", title: "Focení a volná zábava" },
        { time: "18:00", title: "Večerní program" },
      ],
    },
  },
  en: {
    nav: {
      place: "Venue",
      program: "Schedule",
    },
    homeLabel: "Home",
    place: {
      title: "Place",
      mapLink: "Open in Google Maps",
      mapPlaceholder: "We will show the map as soon as we add the details.",
    },
    home: {
      seo: "Venue, schedule, and practical details for guests.",
    },
    schedule: {
      title: "Schedule",
      items: [
        {
          time: "12:00",
          text: "Meet at the",
          linkText: "venue",
          href: "/en/venue",
        },
        { time: "13:00", title: "Ceremony" },
        { time: "14:00", title: "Lunch and congratulations" },
        { time: "16:00", title: "Photos and free time" },
        { time: "18:00", title: "Evening program" },
      ],
    },
  },
} as const;

export type SiteLang = keyof typeof siteCopy;

export const getSiteCopy = (lang?: string) =>
  siteCopy[lang as SiteLang] ?? siteCopy.cs;
