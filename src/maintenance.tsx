import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Wrench,
  ArrowRight,
  Check,
  Plus,
  Bell,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, money, nextId } from "./data";
import { maintenancePackages, eligible } from "./careData";
import {
  PageHead,
  SectionTitle,
  Nav,
  Badge,
  DetailLine,
  Modal,
  Safety,
  ApplianceArt,
  Empty,
} from "./components";

export function Maintenance() {
  const { data, update, toast } = useStore();
  const [params] = useSearchParams();
  const tab = params.get("tab") || "schedule";
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [applianceId, setApplianceId] = useState(
    params.get("appliance") ||
      data.appliances.find((a) => a.id === "ac")?.id ||
      data.appliances[0]?.id ||
      "",
  );
  const [confirm, setConfirm] = useState(false);
  const [issueModal, setIssueModal] = useState(false);
  const [scheduleAppliance, setScheduleAppliance] = useState(
    params.get("appliance") || "",
  );
  const pack = maintenancePackages.find((p) => p.id === selectedPackage);
  const appliance = data.appliances.find((a) => a.id === applianceId);
  const selected = data.selectedMaintenancePackages.filter((p) =>
    data.appliances.some((a) => a.id === p.applianceId),
  );
  return (
    <div className="care-page maintenance-page">
      <PageHead
        title={
          tab === "repair"
            ? "Repair support"
            : tab === "packages"
              ? "Maintenance packages"
              : "Maintenance"
        }
        description="View scheduled care, explore packages, or report a problem."
      >
        <Nav
          className={tab === "schedule" ? "btn primary" : "btn"}
          to={
            tab === "repair"
              ? "/bookings/new?service=Repair+service"
              : "/bookings/new?service=Routine+maintenance"
          }
        >
          {tab === "repair" ? "Book a repair" : "Book maintenance"}
          <ArrowRight size={16} />
        </Nav>
      </PageHead>
      <div className="care-tabs">
        <Nav
          to="/maintenance?tab=schedule"
          className={tab === "schedule" ? "active" : ""}
        >
          Schedule
        </Nav>
        <Nav
          to="/maintenance?tab=packages"
          className={tab === "packages" ? "active" : ""}
        >
          Packages
        </Nav>
        <Nav
          to="/maintenance?tab=repair"
          className={tab === "repair" ? "active" : ""}
        >
          Repair
        </Nav>
      </div>
      {tab === "packages" ? (
        <>
          <div className="plan-grid">
            {maintenancePackages.map((p) => (
              <section className="panel package-card" key={p.id}>
                <div className="service-icon">
                  <Wrench size={23} />
                </div>
                <h2>{p.name}</h2>
                <div className="plan-price">
                  {money(p.price)}
                  <span>/ {p.months} months</span>
                </div>
                <Badge>{p.visits} preventive visits · sample package</Badge>
                <ul>
                  {p.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="small muted">
                  Eligible brands · {p.brands.join(", ")}
                </p>
                <p className="small muted">
                  Appliances · {p.categories.join(", ")}
                </p>
                <button
                  className="btn full"
                  onClick={() => {
                    setSelectedPackage(p.id);
                    setConfirm(false);
                    const first = data.appliances.find((a) => eligible(p, a));
                    if (first) setApplianceId(first.id);
                  }}
                >
                  View package details
                  <ArrowRight size={16} />
                </button>
                <button
                  className="btn primary full"
                  onClick={() => {
                    setSelectedPackage(p.id);
                    setConfirm(true);
                    const first = data.appliances.find((a) => eligible(p, a));
                    if (first) setApplianceId(first.id);
                  }}
                >
                  Select demo package
                </button>
              </section>
            ))}
          </div>
          <Safety>
            Maintenance packages are sample service bundles. Package selection
            does not add insurance coverage or create a membership. No payment
            is collected.
          </Safety>
          {selected.length > 0 && (
            <section className="panel selected-packages">
              <SectionTitle title="Selected demo packages" />
              {selected.map((p) => (
                <div className="document-row" key={p.id}>
                  <Wrench size={18} />
                  <div className="grow">
                    <h3>
                      {
                        maintenancePackages.find((x) => x.id === p.packageId)
                          ?.name
                      }
                    </h3>
                    <p>
                      {
                        data.appliances.find((a) => a.id === p.applianceId)
                          ?.name
                      }{" "}
                      · Selected {dateLabel(p.date)}
                    </p>
                  </div>
                  <Nav
                    className="text-link"
                    to={
                      "/bookings/new?appliance=" +
                      p.applianceId +
                      "&service=Routine+maintenance"
                    }
                  >
                    Book maintenance
                    <ArrowRight size={15} />
                  </Nav>
                </div>
              ))}
            </section>
          )}
        </>
      ) : tab === "repair" ? (
        <>
          <section className="panel">
            <SectionTitle title="Repair requests">
              <button
                className="btn primary"
                onClick={() => setIssueModal(true)}
              >
                <Plus size={16} />
                Report an issue
              </button>
            </SectionTitle>
            <p className="muted">
              Record a problem and arrange an inspection or repair consultation.
            </p>
            {data.repairIssues.length ? (
              data.repairIssues.map((issue) => {
                const a = data.appliances.find(
                  (a) => a.id === issue.applianceId,
                );
                return (
                  <article className="repair-record" key={issue.id}>
                    <div>
                      <h3>
                        {a?.name} · {a?.brand}
                      </h3>
                      <p>{issue.description}</p>
                      <p className="small muted">
                        {issue.id} · {dateLabel(issue.date)}
                      </p>
                    </div>
                    <Badge>{issue.status}</Badge>
                    <div className="button-row">
                      {issue.bookingId ? (
                        <Nav
                          className="btn"
                          to={"/bookings/" + issue.bookingId}
                        >
                          View repair progress
                        </Nav>
                      ) : (
                        <>
                          <Nav
                            className="btn"
                            to={
                              "/bookings/new?appliance=" +
                              issue.applianceId +
                              "&service=Appliance+inspection&issue=" +
                              issue.id
                            }
                          >
                            Request inspection
                          </Nav>
                          <Nav
                            className="btn primary"
                            to={
                              "/bookings/new?appliance=" +
                              issue.applianceId +
                              "&service=Repair+service&issue=" +
                              issue.id
                            }
                          >
                            Book repair service
                          </Nav>
                        </>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <Empty
                title="No repair issues recorded"
                detail="Use Report an issue to start a sample repair record."
              />
            )}
          </section>
          <Safety>
            Repair requests and progress are simulated. A qualified professional
            must assess the appliance before any actual repair decision.
          </Safety>
        </>
      ) : (
        <>
          <section className="panel">
            <SectionTitle title="Upcoming maintenance">
              <CalendarDays size={19} />
            </SectionTitle>
            <div className="form maintenance-filter">
              <label>
                Appliance
                <select
                  aria-label="Filter maintenance appliance"
                  value={scheduleAppliance}
                  onChange={(event) => setScheduleAppliance(event.target.value)}
                >
                  <option value="">All appliances</option>
                  {data.appliances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.brand}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="maintenance-grid">
              {data.appliances
                .filter((a) => !scheduleAppliance || a.id === scheduleAppliance)
                .map((a) => {
                  const schedule = data.maintenanceSchedules.find(
                    (s) => s.applianceId === a.id,
                  );
                  return (
                    <article className="maintenance-record" key={a.id}>
                      <div className="maintenance-record-head">
                        <div className="mini-art">
                          <ApplianceArt category={a.category} />
                        </div>
                        <div>
                          <h3>{a.name}</h3>
                          <p>
                            {a.brand} · {a.room}
                          </p>
                        </div>
                      </div>
                      <DetailLine label="Last service">
                        {schedule?.last
                          ? dateLabel(schedule.last)
                          : "No completed service record"}
                      </DetailLine>
                      <DetailLine label="Next service">
                        {a.next ? dateLabel(a.next) : "Not scheduled"}
                      </DetailLine>
                      <label className="consent reminder-toggle">
                        <input
                          type="checkbox"
                          checked={schedule?.reminder ?? true}
                          onChange={(e) => {
                            update((d) => ({
                              ...d,
                              maintenanceSchedules: schedule
                                ? d.maintenanceSchedules.map((s) =>
                                    s.applianceId === a.id
                                      ? { ...s, reminder: e.target.checked }
                                      : s,
                                  )
                                : [
                                    ...d.maintenanceSchedules,
                                    {
                                      applianceId: a.id,
                                      last: "",
                                      next: a.next,
                                      reminder: e.target.checked,
                                    },
                                  ],
                            }));
                          }}
                        />
                        <Bell size={15} />
                        <span>
                          Maintenance reminders
                          <span className="sr-only"> for {a.name}</span>
                        </span>
                      </label>
                      <Nav
                        className="btn full"
                        to={
                          "/bookings/new?appliance=" +
                          a.id +
                          "&service=Routine+maintenance"
                        }
                      >
                        Book preventive maintenance
                        <ArrowRight size={15} />
                      </Nav>
                    </article>
                  );
                })}
            </div>
          </section>
          <section className="panel maintenance-history">
            <SectionTitle title="Maintenance history" />
            {data.maintenanceHistory.map((h) => (
              <div className="document-row" key={h.id}>
                <Check size={18} />
                <div className="grow">
                  <h3>
                    {data.appliances.find((a) => a.id === h.applianceId)?.name}
                  </h3>
                  <p>{h.service}</p>
                </div>
                <span className="small muted">
                  {dateLabel(h.date)} · Sample completed record
                </span>
              </div>
            ))}
            {!data.maintenanceHistory.length && (
              <p className="muted">No completed maintenance records.</p>
            )}
          </section>
          <p className="small muted">
            Reminders are local demo preferences. No messages or notifications
            are sent outside this app.
          </p>
        </>
      )}
      {pack && (
        <Modal
          title={confirm ? "Review demo package" : pack.name}
          subtitle="Illustrative service package"
          onClose={() => setSelectedPackage(null)}
        >
          <div className="form">
            <p className="muted">
              {pack.visits} preventive service visits over {pack.months} months.
            </p>
            <DetailLine label="Sample price">{money(pack.price)}</DetailLine>
            <h3>Included services</h3>
            <ul>
              {pack.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="small muted">
              Brands · {pack.brands.join(", ")}
              <br />
              Categories · {pack.categories.join(", ")}
            </p>
            <label>
              Appliance
              <select
                value={applianceId}
                onChange={(e) => setApplianceId(e.target.value)}
              >
                {data.appliances.map((a) => (
                  <option key={a.id} value={a.id} disabled={!eligible(pack, a)}>
                    {a.name} · {a.brand}
                    {eligible(pack, a) ? "" : " · not eligible"}
                  </option>
                ))}
              </select>
            </label>
            <Safety>
              Prototype service bundle only. No purchase, automatic booking,
              membership, or insurance benefit is created.
            </Safety>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelectedPackage(null)}>
                Cancel
              </button>
              {!confirm ? (
                <button
                  className="btn primary"
                  onClick={() => setConfirm(true)}
                >
                  Select demo package
                </button>
              ) : (
                <button
                  className="btn primary"
                  disabled={!appliance || !eligible(pack, appliance)}
                  onClick={() => {
                    update((d) => ({
                      ...d,
                      selectedMaintenancePackages: [
                        ...d.selectedMaintenancePackages.filter(
                          (s) => s.applianceId !== applianceId,
                        ),
                        {
                          id: nextId("MP"),
                          applianceId,
                          packageId: pack.id,
                          date: DEMO_DATE,
                        },
                      ],
                      activities: [
                        {
                          id: nextId("act"),
                          title: "Demo maintenance package selected",
                          detail: appliance?.name + " · " + pack.name,
                          date: DEMO_DATE,
                        },
                        ...d.activities,
                      ],
                    }));
                    toast("Demo maintenance package selected");
                    setSelectedPackage(null);
                  }}
                >
                  Confirm demo package
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
      {issueModal && (
        <Modal
          title="Report an appliance issue"
          onClose={() => setIssueModal(false)}
        >
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              const fields = new FormData(e.currentTarget);
              const id = nextId("RI");
              update((d) => ({
                ...d,
                repairIssues: [
                  ...d.repairIssues,
                  {
                    id,
                    applianceId: String(fields.get("appliance")),
                    date: DEMO_DATE,
                    description: String(fields.get("description")),
                    status: "Awaiting inspection",
                  },
                ],
                activities: [
                  {
                    id: nextId("act"),
                    title: "Repair issue recorded",
                    detail:
                      data.appliances.find(
                        (a) => a.id === fields.get("appliance"),
                      )?.name || "Appliance issue",
                    date: DEMO_DATE,
                  },
                  ...d.activities,
                ],
              }));
              toast("Demo repair issue recorded");
              setIssueModal(false);
            }}
          >
            <label>
              Appliance
              <select name="appliance" defaultValue={applianceId}>
                {data.appliances.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.brand}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Issue description
              <textarea
                name="description"
                required
                placeholder="Describe the observed issue for this demo"
              />
            </label>
            <button className="btn primary">
              Save demo issue
              <Check size={16} />
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
