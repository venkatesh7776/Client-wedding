/**
 * Section 8 — If in Need of Assistance.
 *
 * `tel` is what the button dials; leave it null and the card shows the number
 * as still to come rather than offering a dead link.
 */
export type Contact = {
  name: string;
  role: string;
  /** As written on the card. */
  display: string | null;
  /** As dialled — digits and a leading +, nothing else. */
  tel: string | null;
};

export const CONTACTS: Contact[] = [
  {
    name: "Neerotum Chalil Abdulla",
    role: "Bride’s Father",
    display: "+91 70259 39167",
    tel: "+917025939167",
  },
  {
    name: "Anees Ahmed Abdulla",
    role: "Bride’s Brother",
    display: null,
    tel: null,
  },
];

export const ASSIST_COPY = {
  title: "If in Need of Assistance",
  subtitle:
    "If you have any questions or require assistance, please feel free to reach out to:",
  call: "Call",
  pending: "Number to be added",
} as const;
