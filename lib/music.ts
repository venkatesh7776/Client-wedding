/**
 * The signal that the guest has opened the invitation.
 *
 * Chrome will not let a page make a sound until the visitor has pressed
 * something, and the permission is granted to the handler of that press — not
 * to the page in general, and not to anything that runs a tick later. So the
 * button dispatches this the instant it is clicked, the music control hears it
 * synchronously, and `play()` is called while the browser still regards the
 * click as the reason. Anything asynchronous in between forfeits the leave.
 */
export const ENTER_EVENT = "invitation:enter";

/** Called from the Enter button's own click handler, and nowhere else. */
export function announceEntry(): void {
  window.dispatchEvent(new Event(ENTER_EVENT));
}
