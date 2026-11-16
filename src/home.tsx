import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Plus,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, tasks } from "./data";
import { latestPlan, planStatus } from "./careData";
import {
  ApplianceRow,
  Badge,
  Disclosure,
  Nav,
  PageHead,
  Safety,
  SectionTitle,
} from "./components";
import { CoreServices } from "./dashboardCare";
import { useState } from "react";

export function SimpleOverview({
  flood,
  onAdd,
}: {
  flood: boolean;
  onAdd: () => void;
}) {
  const { data } = useStore();
  const activeBookings = data.bookings.filter(
    (b) => !["Cancelled", "Completed"].includes(b.status),
  );
  const nextBooking = [...activeBookings]
    .filter((b) => b.date >= DEMO_DATE)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    )[0];
  const renewals = data.appliances.filter(
    (a) =>
      planStatus(latestPlan(data.selectedProtectionPlans, a.id), DEMO_DATE) ===
      "Renewal due — demo",
  );
  const maintenance = data.appliances
    .filter((a) => a.next && a.next >= DEMO_DATE)
    .sort((a, b) => a.next.localeCompare(b.next));
  const cases = data.cases.filter((c) => c.status !== "Case closed");
  const remaining = tasks.length - data.checked.length;
  const progress = Math.round((data.checked.length / tasks.length) * 100);
  return (
    <div className="simple-home">
      <PageHead
        title={flood ? "Flood preparation & recovery" : "Home"}
        description={
          flood
            ? "Prepare in advance. Keep damage records and next steps together."
            : "Your appliances, services, and next steps in one place."
        }
      >
        <button className="btn" onClick={onAdd}>
          <Plus size={17} />
          Add appliance
        </button>
      </PageHead>
      <section className="home-start" aria-labelledby="home-start-title">
        <h2 id="home-start-title">What would you like to do?</h2>
        <CoreServices flood={flood} />
      </section>
      <div className="home-summary" aria-label="Home summary">
        <Nav to="/appliances">
          <strong>{data.appliances.length}</strong> appliances
          <ArrowRight size={14} />
        </Nav>
        <Nav to="/bookings">
          <strong>{activeBookings.length}</strong> active{" "}
          {activeBookings.length === 1 ? "visit" : "visits"}
          <ArrowRight size={14} />
        </Nav>
        <Nav to="/documents">
          <strong>{data.documents.filter((d) => d.available).length}</strong>{" "}
          saved documents
          <ArrowRight size={14} />
        </Nav>
      </div>
      <div className="home-columns">
        <section className="panel home-attention">
          <SectionTitle title={flood ? "Your next steps" : "Needs attention"} />
          {flood && (
            <Nav to="/preparation" className="home-task">
              <ClipboardCheck size={21} />
              <div>
                <h3>Finish your preparation checklist</h3>
                <p>
                  {remaining} tasks remaining · {progress}% complete
                </p>
              </div>
              <ArrowRight size={18} />
            </Nav>
          )}
          {renewals.map((a) => (
            <Nav key={a.id} to="/protection/my-plans" className="home-task">
              <ShieldCheck size={21} />
              <div>
                <h3>Review plan renewal</h3>
                <p>{a.name}</p>
              </div>
              <ArrowRight size={18} />
            </Nav>
          ))}
          {maintenance.slice(0, flood ? 1 : 2).map((a) => (
            <Nav
              key={a.id}
              to={"/maintenance?appliance=" + a.id}
              className="home-task"
            >
              <Wrench size={21} />
              <div>
                <h3>Maintenance coming up</h3>
                <p>
                  {a.name} · {dateLabel(a.next)}
                </p>
              </div>
              <ArrowRight size={18} />
            </Nav>
          ))}
          {cases.slice(0, 1).map((c) => (
            <Nav key={c.id} to={"/recovery/" + c.id} className="home-task">
              <FileText size={21} />
              <div>
                <h3>Follow up on recovery</h3>
                <p>
                  {data.appliances.find((a) => a.id === c.applianceId)?.name} ·{" "}
                  {c.status}
                </p>
              </div>
              <ArrowRight size={18} />
            </Nav>
          ))}
          {!renewals.length &&
            !maintenance.length &&
            !cases.length &&
            !flood && (
              <p className="muted">
                You’re all caught up. Choose a service above whenever you need
                help.
              </p>
            )}
          <div className="home-section-links">
            <Nav to="/maintenance">
              All maintenance
              <ArrowRight size={15} />
            </Nav>
            <Nav to="/protection/my-plans">
              My protection
              <ArrowRight size={15} />
            </Nav>
          </div>
        </section>
        <section className="panel home-next-visit">
          <SectionTitle title="Next visit">
            <CalendarDays size={19} />
          </SectionTitle>
          {nextBooking ? (
            <>
              <Badge>{nextBooking.status}</Badge>
              <h3>{nextBooking.service}</h3>
              <p>
                {
                  data.appliances.find((a) => a.id === nextBooking.applianceId)
                    ?.name
                }
              </p>
              <div className="home-visit-date">
                <strong>{dateLabel(nextBooking.date)}</strong>
                <span>{nextBooking.time}</span>
              </div>
              <p className="small muted">{nextBooking.team}</p>
              <Nav to={"/bookings/" + nextBooking.id} className="btn full">
                View appointment
                <ArrowRight size={16} />
              </Nav>
            </>
          ) : (
            <>
              <p className="muted">
                No upcoming visits. Choose a service when you need one.
              </p>
              <Nav to="/bookings/new" className="btn full">
                Book a visit
                <ArrowRight size={16} />
              </Nav>
            </>
          )}
          <Nav to="/bookings" className="text-link">
            All appointments
            <ArrowRight size={15} />
          </Nav>
        </section>
      </div>
      <section className="panel home-appliances">
        <SectionTitle title="Your appliances">
          <Nav to="/appliances" className="text-link">
            View all
            <ArrowRight size={15} />
          </Nav>
        </SectionTitle>
        <div className="home-appliance-list">
          {data.appliances.slice(0, 3).map((a) => (
            <ApplianceRow key={a.id} a={a} />
          ))}
        </div>
        {!data.appliances.length && (
          <button className="btn" onClick={onAdd}>
            <Plus size={16} />
            Add your first appliance
          </button>
        )}
      </section>
      <Disclosure
        title="Recent activity"
        description="See changes to your appliance and service records"
      >
        {data.activities.slice(0, 6).map((a) => (
          <div className="activity-row" key={a.id}>
            <span className="activity-symbol">
              <FileText size={17} />
            </span>
            <div className="grow">
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
            </div>
            <time>{dateLabel(a.date)}</time>
          </div>
        ))}
      </Disclosure>
      {flood ? (
        <Safety>
          Plan ahead while conditions are safe. Record damage only after safe
          access and do not power on flood-exposed appliances before
          professional inspection.
        </Safety>
      ) : (
        <Nav to="/preparation?mode=flood" className="home-flood-link">
          <ClipboardCheck size={20} />
          <div>
            <strong>Preparing for flooding?</strong>
            <span>Open your checklist, moving priorities, and photos.</span>
          </div>
          <ArrowRight size={18} />
        </Nav>
      )}
    </div>
  );
}

export function Appointments() {
  const { data } = useStore();
  const [view, setView] = useState("upcoming");
  const visits = [...data.bookings]
    .filter(
      (b) => view === "all" || !["Cancelled", "Completed"].includes(b.status),
    )
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    );
  return (
    <div className="appointments-page">
      <PageHead
        title="Appointments"
        description="View your visits, change a date, or cancel a demo booking."
      >
        <Nav to="/bookings/new" className="btn primary">
          <Plus size={17} />
          Book a visit
        </Nav>
      </PageHead>
      <div className="care-tabs" aria-label="Appointment filters">
        {["upcoming", "all"].map((v) => (
          <button
            key={v}
            className={view === v ? "active" : ""}
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            {v === "all" ? "All appointments" : "Active appointments"}
          </button>
        ))}
      </div>
      <section className="panel">
        {visits.length ? (
          visits.map((b) => (
            <Nav
              className="appointment-list-row"
              to={"/bookings/" + b.id}
              key={b.id}
            >
              <CalendarDays size={22} />
              <div>
                <h2>{b.service}</h2>
                <p>
                  {data.appliances.find((a) => a.id === b.applianceId)?.name}
                </p>
                <span>
                  {dateLabel(b.date)} · {b.time}
                </span>
              </div>
              <Badge>{b.status}</Badge>
              <ArrowRight size={18} />
            </Nav>
          ))
        ) : (
          <div className="empty">
            <CalendarDays size={30} />
            <h3>No active appointments</h3>
            <p>Book a visit or choose All appointments to see past records.</p>
            <Nav to="/bookings/new" className="btn">
              Book a visit
            </Nav>
          </div>
        )}
      </section>
    </div>
  );
}
