/**
 * Section 7 — Leave a Message. Copy is as supplied; do not reword.
 */
export const MESSAGE_COPY = {
  title: "Leave a Message",
  intro:
    "Share your blessings, wishes, or a special message for Sahla & Abdul Basith as they begin their journey together.",
  cardTitle: "Write Your Wishes",
  nameLabel: "Your Name",
  messageLabel: "Write a message for the couple...",
  cta: "Send Your Blessings",
  sending: "Opening your mail…",
  sent: "Thank you — your message is ready to send in your mail app.",
  nameError: "Please add your name.",
  messageError: "Please write a message.",
} as const;

/**
 * Where messages go. With no back end, the form hands the note to the guest's
 * own mail app; set an address here and it will be addressed for them.
 * Swapping this for a form endpoint is a change in one place.
 */
export const MESSAGE_TO: string | null = null;
