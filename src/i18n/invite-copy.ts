export const inviteCopy = {
  cs: {
    intro: [
      "Prosíme o potvrzení účasti. Napište nám také, jestli chcete přespat, zda berete děti, případné alergie nebo jiné dietní omezení a cokoli dalšího, co bychom měli vědět.",
      "Ubytování je zajištěné. Pro každého bude místo na spaní přímo v areálu nebo v jeho blízkosti.",
      "Kdykoli nám sem můžete napsat znovu, pokud se něco změní.",
    ],
    labels: {
      message: "Zpráva",
      phone: "Kontaktní telefon",
      submit: "Odeslat",
    },
    status: {
      sending: "Odesíláme...",
      success: "Děkujeme. Máme to zapsané.",
      error: "Něco se nepovedlo. Zkuste to prosím znovu.",
    },
  },
  en: {
    intro: [
      "Please let us know if you will be able to make it. Also tell us whether you plan to stay overnight, whether you are bringing a +1, any allergies or dietary restrictions, and anything else we should know.",
      "Accommodation is arranged. There will be a place to sleep for everyone on site or very close by.",
      "Feel free to message us again anytime if anything changes.",
    ],
    labels: {
      message: "Message",
      phone: "Contact phone",
      submit: "Send",
    },
    status: {
      sending: "Sending...",
      success: "Thank you. We have it noted.",
      error: "Something went wrong. Please try again.",
    },
  },
} as const;

export type InviteLang = keyof typeof inviteCopy;

export const getInviteCopy = (lang?: string) =>
  inviteCopy[lang as InviteLang] ?? inviteCopy.cs;
