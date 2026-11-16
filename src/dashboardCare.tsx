import {
  ShieldCheck,
  MessageSquare,
  Wrench,
  ArrowUpRight,
  CalendarClock,
  Phone,
  Camera,
  ClipboardList,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel } from "./data";
import { latestPlan, planStatus, protectionPlans } from "./careData";
import { Nav, Badge, SectionTitle } from "./components";

export function CoreServices({ flood }: { flood: boolean }) {
  return (
    <>
      <div className="care-core-services">
        <Nav to="/protection">
          <ShieldCheck size={24} />
          <div>
            <h2>Protection plans</h2>
            <p>Compare plans and manage renewals</p>
          </div>
          <ArrowUpRight size={17} />
        </Nav>
        <Nav to="/consultation">
          <MessageSquare size={24} />
          <div>
            <h2>Talk to a technician</h2>
            <p>Chat, voice, or video · demo</p>
          </div>
          <ArrowUpRight size={17} />
        </Nav>
        <Nav to="/bookings/new">
          <Wrench size={24} />
          <div>
            <h2>Book a visit</h2>
            <p>Inspection, maintenance, or repair</p>
          </div>
          <ArrowUpRight size={17} />
        </Nav>
      </div>
      {flood && (
        <div className="flood-action-strip">
          <Nav to="/consultation/urgent?mode=flood">
            <Phone size={17} />
            Urgent technician support
            <ArrowUpRight size={15} />
          </Nav>
          <Nav to="/preparation?view=moving">
            <ClipboardList size={17} />
            Moving priorities
          </Nav>
          <Nav to="/preparation?view=photos">
            <Camera size={17} />
            Pre-flood photos
          </Nav>
          <Nav to="/recovery/new">
            Report damage
            <ArrowUpRight size={15} />
          </Nav>
        </div>
      )}
    </>
  );
}

export function CareReminders() {
  const { data } = useStore();
  const due = data.appliances
    .map((a) => ({
      appliance: a,
      selection: latestPlan(data.selectedProtectionPlans, a.id),
    }))
    .filter(
      ({ selection }) =>
        planStatus(selection, DEMO_DATE) === "Renewal due — demo",
    );
  const maintenance = data.appliances
    .filter((a) => a.next && a.next >= DEMO_DATE)
    .sort((a, b) => a.next.localeCompare(b.next))
    .slice(0, 2);
  return (
    <section className="panel care-reminders">
      <SectionTitle title="Upcoming maintenance and plan renewal">
        <CalendarClock size={19} />
      </SectionTitle>
      <div className="care-reminder-grid">
        <div>
          <h3>Upcoming maintenance</h3>
          {maintenance.map((a) => (
            <Nav key={a.id} to={"/maintenance?appliance=" + a.id}>
              <span>{a.name}</span>
              <span>
                {dateLabel(a.next)}
                <ArrowUpRight size={14} />
              </span>
            </Nav>
          ))}
          <Nav className="text-link" to="/maintenance?tab=packages">
            Explore maintenance packages
            <ArrowUpRight size={14} />
          </Nav>
        </div>
        <div>
          <h3>Plan renewal</h3>
          {due.length ? (
            due.map(({ appliance, selection }) => (
              <Nav key={appliance.id} to="/protection/my-plans">
                <div>
                  <strong>{appliance.name}</strong>
                  <p>
                    {
                      protectionPlans.find((p) => p.id === selection?.planId)
                        ?.name
                    }
                  </p>
                </div>
                <Badge>Renewal due — demo</Badge>
              </Nav>
            ))
          ) : (
            <p className="muted small">No demo plan renewals due.</p>
          )}
          <Nav className="text-link" to="/protection/my-plans">
            View my protection
            <ArrowUpRight size={14} />
          </Nav>
        </div>
      </div>
    </section>
  );
}
