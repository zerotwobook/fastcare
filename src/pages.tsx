import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  ClipboardList,
  Search,
  SlidersHorizontal,
  Wrench,
  House,
  CheckCircle2,
  Files,
  ArrowLeft,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, money, nextId, technicians } from "./data";
import type { Doc, Booking } from "./data";
import {
  Nav,
  Badge,
  PageHead,
  PageSections,
  Disclosure,
  SectionTitle,
  ApplianceArt,
  Modal,
  ApplianceForm,
  DocumentPreview,
  AddDocument,
  Timeline,
  DetailLine,
  Empty,
  Safety,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Plus,
  ShieldCheck,
  MapPin,
  Clock,
  TriangleAlert,
} from "./components";
import { ApplianceProtection } from "./protection";
import {
  PhotoGallery,
  PreparationPage,
  ReportDamagePage,
  RecoveryDetailsPage,
} from "./careExtras";
import { SimpleOverview } from "./home";
import { technicianProfiles } from "./careData";
export function Overview({
  flood,
  onAdd,
}: {
  flood: boolean;
  onAdd: () => void;
}) {
  return <SimpleOverview flood={flood} onAdd={onAdd} />;
}
export function Appliances({ onAdd }: { onAdd: () => void }) {
  const { data } = useStore();
  const [search, setSearch] = useState("");
  const [room, setRoom] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const list = data.appliances.filter(
    (a) =>
      (a.name + " " + a.category + " " + a.brand)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!room || a.room === room) &&
      (!brand || a.brand === brand) &&
      (!status || a.status === status),
  );
  return (
    <>
      <PageHead
        kicker="YOUR HOME INVENTORY"
        title="My appliances"
        description="Find an appliance, check its care, or add a new one."
      >
        <button className="btn primary" onClick={onAdd}>
          <Plus size={17} />
          Add appliance
        </button>
      </PageHead>
      <div className="filter-bar simple-inventory-filters">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search appliances"
            placeholder="Search name, brand, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <details className="filter-options">
          <summary>
            <SlidersHorizontal size={17} />
            Filters
            {(room || brand || status) && (
              <span className="filter-count">
                {[room, brand, status].filter(Boolean).length}
              </span>
            )}
          </summary>
          <div className="filter-fields">
            {" "}
            <select
              aria-label="Filter by room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="">All rooms</option>
              {[...new Set(data.appliances.map((a) => a.room))].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              aria-label="Filter by care status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All care statuses</option>
              {[...new Set(data.appliances.map((a) => a.status))].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              aria-label="Filter by brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">All brands</option>
              {[...new Set(data.appliances.map((a) => a.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </details>
        {(search || room || brand || status) && (
          <button
            className="text-link"
            onClick={() => {
              setSearch("");
              setRoom("");
              setBrand("");
              setStatus("");
            }}
          >
            Clear filters
          </button>
        )}
        <span className="small muted">{list.length} appliances</span>
      </div>
      <div className="appliance-grid">
        {list.map((a) => (
          <article className="appliance-card" key={a.id}>
            <div className="card-visual">
              <Badge>{a.status}</Badge>
              {sessionStorage.getItem("photo-" + a.id) ? (
                <img
                  className="local-photo"
                  src={sessionStorage.getItem("photo-" + a.id)!}
                  alt={a.name}
                />
              ) : (
                <ApplianceArt category={a.category} />
              )}
            </div>
            <div className="card-info">
              <div className="mobile-card-status">
                <Badge>{a.status}</Badge>
              </div>
              <p className="eyebrow">
                {a.brand} · {a.category}
              </p>
              <h2>{a.name}</h2>
              <p>
                <MapPin size={14} />
                {a.room}
              </p>
              <div className="card-service">
                <Clock size={15} />
                {a.next
                  ? "Next service · " + dateLabel(a.next)
                  : "No service scheduled"}
              </div>
              <Nav to={"/appliances/" + a.id} className="btn full">
                View details
                <ArrowRight size={16} />
              </Nav>
            </div>
          </article>
        ))}
      </div>
      {!list.length && <Empty />}
    </>
  );
}
export function ApplianceDetails() {
  const { id } = useParams();
  const { data } = useStore();
  const a = data.appliances.find((a) => a.id === id);
  const [edit, setEdit] = useState(false);
  const [doc, setDoc] = useState<Doc | null>(null);
  if (!a) return <NotFound />;
  const incident = data.cases.find((c) => c.applianceId === id);
  const bookings = data.bookings.filter((b) => b.applianceId === id);
  return (
    <>
      <Nav to="/appliances" className="back-link">
        <ArrowLeft size={15} />
        All appliances
      </Nav>
      <PageHead
        title={a.name}
        description={`${a.brand} · ${a.room} · Your appliance record`}
      >
        <button className="btn" onClick={() => setEdit(true)}>
          Edit appliance
        </button>
        <Nav className="btn primary" to={"/bookings/new?appliance=" + a.id}>
          Book a service
          <ArrowUpRight size={16} />
        </Nav>
      </PageHead>
      <PageSections
        items={[
          ["record", "Overview"],
          ["protection", "Protection"],
          ["care", "Maintenance"],
          ["records", "Documents"],
          ["photos", "Photos"],
        ]}
      />
      <div className="detail-grid">
        <section id="record" className="panel appliance-profile">
          <div className="large-visual">
            {sessionStorage.getItem("photo-" + a.id) ? (
              <img
                className="local-photo"
                src={sessionStorage.getItem("photo-" + a.id)!}
                alt={a.name}
              />
            ) : (
              <ApplianceArt category={a.category} />
            )}
          </div>
          <div className="profile-info">
            <Badge>
              {incident ? "Needs professional inspection" : a.status}
            </Badge>
            <h2>{a.category}</h2>
            <DetailLine label="Model">{a.model || "Not recorded"}</DetailLine>
            <DetailLine label="Room">{a.room}</DetailLine>
            <h3 className="manufacturer-warranty-title">
              Manufacturer Warranty
            </h3>
            <DetailLine label="Purchase date">
              {dateLabel(a.purchase)}
            </DetailLine>
            <DetailLine label="Warranty ends">
              {dateLabel(a.warranty)}
            </DetailLine>
            <DetailLine label="Warranty status">
              {!a.warranty
                ? "Not recorded"
                : a.warranty >= DEMO_DATE
                  ? "Within warranty period"
                  : "Warranty expired"}
            </DetailLine>
            <p className="small muted">
              Warranty coverage is subject to the original terms.
            </p>
            <Nav
              className="text-link"
              to={"/documents?appliance=" + a.id + "&type=Warranty"}
            >
              Warranty document
              <ArrowUpRight size={14} />
            </Nav>
          </div>
        </section>
        <div className="stack">
          <ApplianceProtection appliance={a} />
          <section id="care" className="panel">
            <SectionTitle title="Maintenance timeline">
              <Wrench size={18} />
            </SectionTitle>
            <Timeline
              items={[
                "Appliance registered",
                incident
                  ? "Professional inspection needed"
                  : "Care record up to date",
                a.next
                  ? "Next service · " + dateLabel(a.next)
                  : "Future service",
              ]}
              active={1}
            />
            <DetailLine label="Last preventive service">
              {data.maintenanceSchedules.find((s) => s.applianceId === a.id)
                ?.last
                ? dateLabel(
                    data.maintenanceSchedules.find(
                      (s) => s.applianceId === a.id,
                    )!.last,
                  )
                : "No completed service record"}
            </DetailLine>
            <div className="button-row">
              <Nav
                className="btn"
                to={
                  "/bookings/new?appliance=" +
                  a.id +
                  "&service=Routine+maintenance"
                }
              >
                Book preventive maintenance
              </Nav>
              <Nav
                className="btn"
                to={"/maintenance?tab=repair&appliance=" + a.id}
              >
                Report an issue
              </Nav>
            </div>
            {incident && (
              <Nav to={"/recovery/" + incident.id} className="inline-callout">
                <TriangleAlert size={18} />
                <div>
                  <strong>Linked recovery case</strong>
                  <p>
                    {incident.id} · {incident.status}
                  </p>
                </div>
                <ArrowUpRight size={17} />
              </Nav>
            )}
          </section>
          <section id="records" className="panel">
            <SectionTitle title="Documents">
              <Nav to={"/documents?appliance=" + a.id} className="text-link">
                View all
                <ArrowUpRight size={15} />
              </Nav>
            </SectionTitle>
            {data.documents
              .filter((d) => d.applianceId === id)
              .slice(0, 3)
              .map((d) => (
                <div className="document-row" key={d.id}>
                  <FileText size={18} />
                  <div className="grow">
                    <h3>{d.type}</h3>
                    <p>
                      {d.available
                        ? "Sample record · " + dateLabel(d.date)
                        : "Not added"}
                    </p>
                  </div>
                  {d.available ? (
                    <button className="text-link" onClick={() => setDoc(d)}>
                      Preview
                      <ArrowUpRight size={14} />
                    </button>
                  ) : (
                    <Nav
                      className="text-link"
                      to={"/documents?appliance=" + a.id}
                    >
                      Add
                      <Plus size={14} />
                    </Nav>
                  )}
                </div>
              ))}
            {!data.documents.some((d) => d.applianceId === id) && (
              <p className="muted">
                No records yet. Add sample documents in your library.
              </p>
            )}
          </section>
          <Disclosure
            title="Service history"
            description="Past and upcoming visits for this appliance"
          >
            {bookings.length ? (
              bookings.map((b) => (
                <Nav
                  key={b.id}
                  to={"/bookings/" + b.id}
                  className="history-row"
                >
                  <div>
                    <h3>{b.service}</h3>
                    <p>
                      {dateLabel(b.date)} · {b.team}
                    </p>
                  </div>
                  <Badge>{b.status}</Badge>
                </Nav>
              ))
            ) : (
              <p className="muted">No service visits recorded yet.</p>
            )}
          </Disclosure>
        </div>
      </div>
      <section id="photos" className="panel appliance-photos">
        <SectionTitle title="Pre-flood photos" />
        <PhotoGallery appliance={a} kind="before" />
      </section>
      <section className="panel notes-panel">
        <ShieldCheck size={23} />
        <div className="grow">
          <h3>Flood preparation notes</h3>
          <p>
            {["Washing machine", "Refrigerator", "Water pump"].includes(
              a.category,
            )
              ? "This appliance may require professional moving support. Keep its records accessible and plan ahead."
              : "Keep photos, purchase information, and documents in a dry, accessible location."}
          </p>
        </div>
        <Nav className="btn" to={"/recovery/new?appliance=" + a.id}>
          Report damage
          <ArrowUpRight size={15} />
        </Nav>
      </section>
      {incident && (
        <Safety>
          Do not power on flood-exposed appliances before professional
          inspection.
        </Safety>
      )}
      {edit && <ApplianceForm appliance={a} onClose={() => setEdit(false)} />}{" "}
      {doc && <DocumentPreview doc={doc} onClose={() => setDoc(null)} />}
    </>
  );
}
export function Preparation() {
  return <PreparationPage />;
}
const serviceTypes = [
  "Routine maintenance",
  "Appliance inspection",
  "Repair consultation",
  "Post-flood inspection",
  "Repair service",
];
export function BookingNew() {
  const { data, update } = useStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [aId, setAId] = useState(
    data.appliances.some((a) => a.id === params.get("appliance"))
      ? params.get("appliance")!
      : data.appliances[0]?.id || "",
  );
  const [service, setService] = useState(
    serviceTypes.includes(params.get("service") || "")
      ? params.get("service")!
      : "Routine maintenance",
  );
  const [team, setTeam] = useState(technicians[0]);
  const [date, setDate] = useState("2026-11-18");
  const [time, setTime] = useState("09:00 – 11:00");
  const [location, setLocation] = useState("Demo home · Sample neighborhood");
  const [note, setNote] = useState("");
  const a = data.appliances.find((x) => x.id === aId);
  useEffect(() => {
    if (
      a &&
      !technicianProfiles.find((t) => t.name === team)?.brands.includes(a.brand)
    ) {
      setTeam(
        technicianProfiles.find((t) => t.brands.includes(a.brand))?.name || "",
      );
    }
  }, [aId, team, a?.brand]);
  const confirm = () => {
    const id = nextId("BK");
    const booking: Booking = {
      id,
      applianceId: aId,
      service,
      team,
      date,
      time,
      location,
      note,
      fee: 450,
      status: "Scheduled",
    };
    update((d) => ({
      ...d,
      bookings: [...d.bookings, booking],
      repairIssues: d.repairIssues.map((issue) =>
        issue.id === params.get("issue")
          ? {
              ...issue,
              bookingId: id,
              status:
                service === "Repair service"
                  ? "Repair scheduled"
                  : "Inspection scheduled",
            }
          : issue,
      ),
      cases: params.get("case")
        ? d.cases.map((c) =>
            c.id === params.get("case")
              ? { ...c, bookingId: id, status: "Inspection scheduled" }
              : c,
          )
        : d.cases,
      activities: [
        {
          id: nextId("act"),
          title: "Demo booking confirmed",
          detail: `${a?.name} · ${service}`,
          date: DEMO_DATE,
        },
        ...d.activities,
      ],
    }));
    navigate(
      "/bookings/" +
        id +
        "?" +
        new URLSearchParams({
          ...Object.fromEntries(params),
          confirmed: "1",
        }).toString(),
    );
  };
  return (
    <>
      <PageHead
        kicker="EXPERT CARE, SIMPLY ORGANIZED"
        title="Book a technician"
        description="Choose an appliance, a service, and a time. Review before confirming."
      >
        <Nav className="btn" to="/bookings">
          My appointments
        </Nav>
      </PageHead>
      <div className="booking-stepper">
        {[
          "Select appliance",
          "Select service",
          "Choose appointment",
          "Review booking",
        ].map((s, i) => (
          <button
            key={s}
            onClick={() => {
              if (i < step) setStep(i);
            }}
            disabled={i > step}
            className={i === step ? "active" : i < step ? "complete" : ""}
          >
            <span>{i < step ? <Check size={16} /> : i + 1}</span>
            <strong>{s}</strong>
            {i < 3 && <ChevronRight size={17} />}
          </button>
        ))}
      </div>
      <div className="booking-layout">
        <section className="panel booking-content">
          <p className="eyebrow">STEP 0{step + 1} OF 04</p>
          <h2>
            {
              [
                "Choose an appliance",
                "Choose a service",
                "Choose a date and time",
                "Review your booking",
              ][step]
            }
          </h2>
          <p className="muted">
            {
              [
                "Select an appliance from your home inventory.",
                "Choose the type of service you would like to arrange.",
                "Sample providers and appointments for demonstration only.",
                "Review your sample appointment before confirming.",
              ][step]
            }
          </p>
          {step === 0 && (
            <div className="selection-grid">
              {data.appliances.map((x) => (
                <button
                  key={x.id}
                  className={
                    "appliance-option " + (aId === x.id ? "selected" : "")
                  }
                  onClick={() => setAId(x.id)}
                >
                  <span className="radio-dot" />
                  <ApplianceArt category={x.category} />
                  <strong>{x.name}</strong>
                  <p>
                    {x.brand} · {x.room}
                  </p>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="service-options">
              {serviceTypes.map((s, i) => (
                <button
                  key={s}
                  className={service === s ? "selected" : ""}
                  onClick={() => setService(s)}
                >
                  <div className="service-icon">
                    <Wrench size={20} />
                  </div>
                  <div className="grow">
                    <h3>{s}</h3>
                    <p>
                      {
                        [
                          "Regular cleaning and preventive appliance care.",
                          "A professional check of your appliance’s condition.",
                          "Discuss an appliance issue and possible next steps.",
                          "Professional assessment after flood exposure.",
                          "Sample repair visit following professional assessment.",
                        ][i]
                      }
                    </p>
                  </div>
                  <span className="radio-dot" />
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="form appointment-form">
              <label>
                Service team <span className="muted">· Sample providers</span>
              </label>
              <div className="provider-list">
                {technicians.map((t, i) => (
                  <button
                    type="button"
                    key={t}
                    className={"provider " + (team === t ? "selected" : "")}
                    disabled={
                      !a || !technicianProfiles[i].brands.includes(a.brand)
                    }
                    onClick={() => setTeam(t)}
                  >
                    <div className="team-avatar">0{i + 1}</div>
                    <div className="grow">
                      <h3>{t}</h3>
                      <p>
                        Sample provider · Brands:{" "}
                        {technicianProfiles[i].brands.join(", ")}
                      </p>
                      <p>
                        {
                          [
                            "Routine care & maintenance",
                            "General appliance inspections",
                            "Recovery & post-flood inspections",
                          ][i]
                        }
                      </p>
                    </div>
                    <span className="radio-dot" />
                  </button>
                ))}
              </div>
              <div className="form-grid">
                <label>
                  Appointment date
                  <input
                    type="date"
                    min={DEMO_DATE}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Time slot
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    {["09:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00"].map(
                      (t) => (
                        <option key={t}>{t}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <label>
                Location{" "}
                <span className="muted">· Use sample information only</span>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <label>
                Notes <span className="muted">(optional)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this sample visit"
                />
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="review-booking">
              <div className="review-appliance">
                <ApplianceArt category={a?.category || ""} />
                <div>
                  <h3>{a?.name}</h3>
                  <p>{a?.room}</p>
                </div>
              </div>
              <DetailLine label="Service">{service}</DetailLine>
              <DetailLine label="Service team">{team}</DetailLine>
              <DetailLine label="Appointment">
                {dateLabel(date)} · {time}
              </DetailLine>
              <DetailLine label="Location">{location}</DetailLine>
              <DetailLine label="Estimated service fee">
                {money(450)}
              </DetailLine>
              {note && <p className="muted">Note: {note}</p>}
              <Safety>
                This is a demo booking. No technician will be contacted or
                payment collected.
              </Safety>
            </div>
          )}
          <div className="booking-actions">
            {step > 0 ? (
              <button className="btn" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <Nav className="btn" to="/overview">
                Cancel
              </Nav>
            )}
            <button
              className="btn primary"
              disabled={
                !aId ||
                (step === 2 &&
                  (!date || date < DEMO_DATE || !location.trim() || !team))
              }
              onClick={() => (step === 3 ? confirm() : setStep(step + 1))}
            >
              {step === 3 ? "Confirm demo booking" : "Continue"}
              {step === 3 ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </section>
        <aside className="stack">
          <section className="panel booking-summary">
            <p className="eyebrow">YOUR SERVICE VISIT</p>
            <div className="summary-art">
              <ApplianceArt category={a?.category || "Other"} />
            </div>
            <h3>{a?.name || "Select an appliance"}</h3>
            <p className="muted">{a?.room}</p>
            <hr />
            <DetailLine label="Service">{service}</DetailLine>
            <DetailLine label="Estimated fee">{money(450)}</DetailLine>
            <p className="small muted">
              Illustrative fee. Final pricing requires inspection.
            </p>
          </section>
          <Safety>
            A little professional care helps you plan the next step with
            confidence.
          </Safety>
          <p className="small muted aside-note">
            Interactive prototype. All service teams, availability, and fees are
            illustrative.
          </p>
        </aside>
      </div>
    </>
  );
}
export function BookingDetails() {
  const { id } = useParams();
  const { data, update, toast } = useStore();
  const [params] = useSearchParams();
  const b = data.bookings.find((b) => b.id === id);
  const [modal, setModal] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [newDate, setNewDate] = useState(b?.date || "2026-11-18");
  const [newTime, setNewTime] = useState(b?.time || "09:00 – 11:00");
  if (!b) return <NotFound />;
  const a = data.appliances.find((a) => a.id === b.applianceId)!;
  return (
    <>
      <Nav to="/overview" className="back-link">
        <ArrowLeft size={15} />
        Overview
      </Nav>
      <PageHead
        title="Your service visit"
        description={b.id + " · Sample appointment"}
      >
        <Badge>{b.status}</Badge>
      </PageHead>
      {params.get("confirmed") && (
        <div className="confirmation">
          <CheckCircle2 size={22} />
          <div>
            <h3>Demo booking confirmed</h3>
            <p>
              Your appointment is saved in this prototype. No real booking has
              been made.
            </p>
          </div>
        </div>
      )}
      <div className="detail-grid">
        <div className="stack">
          <section className="panel">
            <SectionTitle title="Service summary" />
            <div className="review-appliance">
              <ApplianceArt category={a.category} />
              <div>
                <h2>{b.service}</h2>
                <Nav to={"/appliances/" + a.id} className="text-link">
                  {a.name}
                  <ArrowUpRight size={14} />
                </Nav>
              </div>
            </div>
            <DetailLine label="Service team">{b.team}</DetailLine>
            <DetailLine label="Appointment">
              {dateLabel(b.date)} · {b.time}
            </DetailLine>
            <DetailLine label="Location">{b.location}</DetailLine>
            <DetailLine label="Estimated service fee">
              {money(b.fee)}
            </DetailLine>
            <p className="small muted">
              Illustrative fee. Final pricing requires inspection. Sample
              provider.
            </p>
            <div className="button-row">
              <button
                className="btn"
                disabled={b.status === "Cancelled"}
                onClick={() => setModal("reschedule")}
              >
                Reschedule
              </button>
              <button
                className="btn"
                disabled={b.status === "Cancelled"}
                onClick={() => setModal("cancel")}
              >
                Cancel demo booking
              </button>
            </div>
          </section>
          <section className="panel">
            <SectionTitle title="Visit notes" />
            <p className="muted">
              {b.note || "No additional notes for this visit."}
            </p>
            <button className="btn" onClick={() => setModal("chat")}>
              Open demo consultation
              <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
        <section className="panel">
          <SectionTitle title="Service progress" />
          <Timeline
            active={b.status === "Cancelled" ? 0 : 1}
            items={
              b.status === "Cancelled"
                ? [
                    "Booking cancelled",
                    "Inspection not arranged",
                    "No service report",
                  ]
                : [
                    "Request created",
                    "Appointment scheduled",
                    b.service === "Repair service"
                      ? "Repair assessment and work"
                      : "Inspection",
                    "Service report",
                    "Completed",
                  ]
            }
          />
          <Safety>
            {b.status === "Cancelled"
              ? "This sample appointment is cancelled."
              : "Inspection and service reports are pending. No actual assessment has taken place."}
          </Safety>
        </section>
      </div>
      {modal === "reschedule" && (
        <Modal title="Reschedule demo booking" onClose={() => setModal("")}>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              update((d) => ({
                ...d,
                bookings: d.bookings.map((x) =>
                  x.id === id ? { ...x, date: newDate, time: newTime } : x,
                ),
              }));
              toast("Demo appointment rescheduled");
              setModal("");
            }}
          >
            <label>
              New appointment date
              <input
                type="date"
                min={DEMO_DATE}
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </label>
            <label>
              Time slot
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                {["09:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
            </label>
            <button className="btn primary">Save new appointment</button>
          </form>
        </Modal>
      )}
      {modal === "cancel" && (
        <Modal title="Cancel this demo booking?" onClose={() => setModal("")}>
          <p className="muted">
            The sample appointment will be marked as cancelled.
          </p>
          <div className="modal-actions">
            <button className="btn" onClick={() => setModal("")}>
              Keep appointment
            </button>
            <button
              className="btn primary"
              onClick={() => {
                update((d) => ({
                  ...d,
                  bookings: d.bookings.map((x) =>
                    x.id === id ? { ...x, status: "Cancelled" } : x,
                  ),
                  repairIssues: d.repairIssues.map((issue) =>
                    issue.bookingId === id
                      ? {
                          ...issue,
                          bookingId: undefined,
                          status: "Awaiting inspection",
                        }
                      : issue,
                  ),
                  cases: d.cases.map((c) =>
                    c.bookingId === id
                      ? {
                          ...c,
                          bookingId: undefined,
                          status: "Awaiting inspection",
                        }
                      : c,
                  ),
                }));
                toast("Demo booking cancelled");
                setModal("");
              }}
            >
              Cancel demo booking
            </button>
          </div>
        </Modal>
      )}
      {modal === "chat" && (
        <Modal
          title="Demo consultation"
          subtitle="Simulated conversation · Prewritten replies"
          onClose={() => setModal("")}
        >
          <div className="chat-messages">
            <div className="chat-reply">
              Hello! This is a sample conversation. You can ask about preparing
              records for your service visit.
            </div>
            {chat.map((m, i) => (
              <div key={i} className={i % 2 === 0 ? "chat-user" : "chat-reply"}>
                {m}
              </div>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) {
                setChat([
                  ...chat,
                  draft,
                  "Please keep your appliance model, purchase record, and any photos ready for the visit. Do not power on flood-exposed appliances before professional inspection. This is a prewritten demo reply.",
                ]);
                setDraft("");
              }
            }}
          >
            <input
              aria-label="Message"
              placeholder="Write a demo message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="btn primary">
              Send
              <ArrowRight size={16} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Recovery() {
  const { data } = useStore();
  return (
    <>
      <PageHead
        kicker="A CLEARER PATH BACK TO EVERYDAY"
        title="Appliance recovery"
        description="Track damage records, inspections, and supporting documents."
      >
        <Nav className="btn primary" to="/recovery/new">
          <Plus size={16} />
          Report damage
        </Nav>
      </PageHead>
      <div className="recovery-intro">
        <div className="service-icon">
          <House size={27} />
        </div>
        <div>
          <h2>Every step, together in one place.</h2>
          <p>
            From the first record to the next appointment, keep your recovery
            organized.
          </p>
        </div>
        <span className="recovery-count">
          {data.cases.filter((c) => c.status !== "Case closed").length}
          <small>active cases</small>
        </span>
      </div>
      <section className="panel">
        <SectionTitle title="Active recovery cases">
          <span className="small muted">{data.cases.length} total records</span>
        </SectionTitle>
        <div className="case-list">
          {data.cases.map((c) => {
            const a = data.appliances.find((a) => a.id === c.applianceId)!;
            return (
              <Nav to={"/recovery/" + c.id} className="case-row" key={c.id}>
                <div className="case-art">
                  <ApplianceArt category={a.category} />
                </div>
                <div className="grow">
                  <p className="eyebrow">{c.id}</p>
                  <h2>{a.name}</h2>
                  <p>
                    {a.room} · Recorded {dateLabel(c.date)}
                  </p>
                </div>
                <div className="case-next">
                  <Badge>{c.status}</Badge>
                  <p>
                    {c.bookingId
                      ? "View inspection appointment"
                      : "Schedule professional inspection"}
                  </p>
                </div>
                <ArrowUpRight size={20} />
              </Nav>
            );
          })}
          {!data.cases.length && (
            <Empty
              title="No recovery cases"
              detail="Damage records you create will appear here."
            />
          )}
        </div>
      </section>
      <div className="recovery-explainer">
        {[
          [
            ClipboardList,
            "01",
            "Record the details",
            "Keep a clear record once the area is safe.",
          ],
          [
            Wrench,
            "02",
            "Arrange an inspection",
            "A qualified professional assesses the appliance.",
          ],
          [
            Files,
            "03",
            "Bring documents together",
            "Prepare supporting records for your next steps.",
          ],
        ].map(([Icon, n, title, detail]) => {
          const I = Icon as typeof Box;
          return (
            <div key={String(n)}>
              <div className="explainer-head">
                <I size={22} />
                <span>{String(n)}</span>
              </div>
              <h3>{String(title)}</h3>
              <p>{String(detail)}</p>
            </div>
          );
        })}
      </div>
      <Safety>
        Do not power on flood-exposed appliances before professional inspection.
        Follow official local guidance.
      </Safety>
    </>
  );
}
export function ReportDamage() {
  return <ReportDamagePage />;
}
export function RecoveryDetails() {
  return <RecoveryDetailsPage />;
}
export function Documents() {
  const { data } = useStore();
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [appliance, setAppliance] = useState(params.get("appliance") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [preview, setPreview] = useState<Doc | null>(null);
  const [add, setAdd] = useState(false);
  const docs = data.documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (!appliance || d.applianceId === appliance) &&
      (!type || d.type === type),
  );
  return (
    <>
      <PageHead
        kicker="LESS SEARCHING. MORE PEACE OF MIND."
        title="Documents"
        description="Find receipts, warranties, photos, and claim documents."
      >
        <button className="btn primary" onClick={() => setAdd(true)}>
          <Plus size={16} />
          Add document
        </button>
      </PageHead>
      <div className="filter-bar">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search documents"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by appliance"
          value={appliance}
          onChange={(e) => setAppliance(e.target.value)}
        >
          <option value="">All appliances</option>
          {data.appliances.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by document type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All document types</option>
          {[
            "Receipt",
            "Warranty",
            "Appliance photo",
            "Inspection report",
            "Policy document",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {(search || appliance || type) && (
          <button
            className="text-link"
            onClick={() => {
              setSearch("");
              setAppliance("");
              setType("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      <section className="panel documents-panel">
        <div className="document-table-head">
          <span>DOCUMENT</span>
          <span>APPLIANCE</span>
          <span>RECORD DATE</span>
          <span>STATUS</span>
          <span />
        </div>
        {docs.map((d) => (
          <div className="document-table-row" key={d.id}>
            <div className="document-name">
              <div className="document-file-icon">
                <FileText size={21} />
              </div>
              <div>
                <h3>{d.name}</h3>
                <p>{d.type}</p>
              </div>
            </div>
            <span>
              {data.appliances.find((a) => a.id === d.applianceId)?.name}
            </span>
            <span>{d.date ? dateLabel(d.date) : "—"}</span>
            <Badge>{d.available ? d.status || "Draft" : "Not added"}</Badge>
            {d.available ? (
              <button className="text-link" onClick={() => setPreview(d)}>
                Preview
                <ArrowUpRight size={15} />
              </button>
            ) : (
              <button className="text-link" onClick={() => setAdd(true)}>
                Add
                <Plus size={15} />
              </button>
            )}
          </div>
        ))}
        {!docs.length && <Empty />}
      </section>
      <Safety>
        All records are sample documents for demonstration. No personal or
        policy information is included.
      </Safety>
      {preview && (
        <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      )}{" "}
      {add && (
        <AddDocument
          applianceId={appliance || undefined}
          onClose={() => setAdd(false)}
        />
      )}
    </>
  );
}
export function NotFound() {
  return (
    <>
      <PageHead
        title="This record isn’t here."
        description="It may have been removed when the demo was reset."
      />
      <Nav className="btn primary" to="/overview">
        Back to overview
        <ArrowRight size={16} />
      </Nav>
    </>
  );
}
