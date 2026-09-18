import { Invitation } from "@/components/Invitation";
import { MusicToggle } from "@/components/MusicToggle";
import { Celebrations } from "@/components/celebrate/Celebrations";
import { Closing } from "@/components/closing/Closing";
import { Assistance } from "@/components/contact/Assistance";
import { DressCode } from "@/components/dress/DressCode";
import { MeetTheCouple } from "@/components/meet/MeetTheCouple";
import { LeaveMessage } from "@/components/message/LeaveMessage";
import { Rsvp } from "@/components/rsvp/Rsvp";
import { Venues } from "@/components/venues/Venues";

export default function Page() {
  return (
    <main>
      <MusicToggle />
      <Invitation />
      <MeetTheCouple />
      <Celebrations />
      <Venues />
      <Rsvp />
      <DressCode />
      <LeaveMessage />
      <Assistance />
      <Closing />
    </main>
  );
}
