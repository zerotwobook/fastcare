import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  ShieldX,
  ArrowRight,
  Check,
  CalendarClock,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, money, nextId } from "./data";
import {
  protectionPlans,
  eligible,
  addDays,
  annualEnd,
  latestPlan,
  planStatus,
} from "./careData";
import type { Plan, SelectedPlan } from "./careData";
import type { Appliance } from "./data";
import {
  PageHead,
  SectionTitle,
  Nav,
  Badge,
  Modal,
  DetailLine,
  Safety,
  ApplianceArt,
} from "./components";

export const protectionDisclosure =
  "Prototype only. No insurance policy is purchased or issued.";

export function PlanTerms({ plan }: { plan: Plan }) {
  return (
    <div className="plan-terms">
      <Badge>Illustrative plan terms</Badge>
      <h2>{plan.name}</h2>
      <p className="muted">{plan.provider}</p>
      <DetailLine label="Plan type">{plan.type}</DetailLine>
      <DetailLine label="Illustrative price">
        {money(plan.price)} / {plan.months} months
      </DetailLine>
      <DetailLine label="Coverage period">{plan.months} months</DetailLine>
      <DetailLine label="Coverage limit">
        {money(plan.limit)} · sample limit
      </DetailLine>
      <DetailLine label="Deductible / excess">
        {money(plan.excess)} per sample event
      </DetailLine>
      <DetailLine label="Waiting period">{plan.waitingDays} days</DetailLine>
      <h3>Eligible brands and appliances</h3>
      <p>
        {plan.brands.join(", ")} · {plan.categories.join(", ")}
      </p>
      <h3>Coverage summary</h3>
      <ul>
        {plan.summary.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="flood-terms">
        {plan.flood ? <ShieldCheck size={20} /> : <ShieldX size={20} />}
        <p>{plan.floodTerms}</p>
      </div>
      <h3>Exclusions</h3>
      <ul>
        {plan.exclusions.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Safety>
        {protectionDisclosure} Selection does not apply retrospectively to an
        existing incident.
      </Safety>
    </div>
  );
}

export function PlanDialog({
  plan,
  appliance,
  selected,
  onClose,
  select = false,
}: {
  plan: Plan;
  appliance: Appliance;
  selected?: SelectedPlan;
  onClose: () => void;
  select?: boolean;
}) {
  const { update, toast } = useStore();
  const [review, setReview] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const canSelect = eligible(plan, appliance);
  const confirm = () => {
    const end = annualEnd(DEMO_DATE);
    const entry: SelectedPlan = {
      id: nextId("SP"),
      applianceId: appliance.id,
      planId: plan.id,
      start: DEMO_DATE,
      end,
      renewal: addDays(end, -15),
      selectedAt: DEMO_DATE,
      periods: [{ start: DEMO_DATE, end, selectedAt: DEMO_DATE }],
    };
    update((d) => ({
      ...d,
      selectedProtectionPlans: [...d.selectedProtectionPlans, entry],
      activities: [
        {
          id: nextId("act"),
          title: "Demo protection plan selected",
          detail: appliance.name + " · " + plan.name,
          date: DEMO_DATE,
        },
        ...d.activities,
      ],
    }));
    setConfirmed(true);
    toast("Demo plan selection saved");
  };
  return (
    <Modal
      title={
        confirmed
          ? "Demo selection recorded"
          : review
            ? "Review demo selection"
            : "Protection plan details"
      }
      onClose={onClose}
      wide
    >
      {confirmed ? (
        <div className="selection-confirmed">
          <ShieldCheck size={38} />
          <h2>{plan.name}</h2>
          <p>
            {appliance.name} · {appliance.brand}
          </p>
          <Safety>{protectionDisclosure}</Safety>
          <Nav
            className="btn primary"
            to="/protection/my-plans"
            onClick={onClose}
          >
            View selected plan
            <ArrowRight size={16} />
          </Nav>
        </div>
      ) : review ? (
        <div className="form">
          <div className="review-appliance">
            <ApplianceArt category={appliance.category} />
            <div>
              <h3>{appliance.name}</h3>
              <p>
                {appliance.brand} · {appliance.room}
              </p>
            </div>
          </div>
          <DetailLine label="Plan">{plan.name}</DetailLine>
          <DetailLine label="Sample provider">{plan.provider}</DetailLine>
          <DetailLine label="Demo term">
            {dateLabel(DEMO_DATE)} – {dateLabel(annualEnd(DEMO_DATE))}
          </DetailLine>
          <DetailLine label="Waiting period ends">
            {dateLabel(addDays(DEMO_DATE, plan.waitingDays))}
          </DetailLine>
          <DetailLine label="Illustrative price">
            {money(plan.price)}
          </DetailLine>
          <Safety>
            Pre-existing damage and incidents before selection are excluded.
            Every event remains subject to provider review.
          </Safety>
          <label className="consent">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            <span>
              I understand these are illustrative terms and a demo selection.
            </span>
          </label>
          <div className="modal-actions">
            <button className="btn" onClick={() => setReview(false)}>
              Back to terms
            </button>
            <button
              className="btn primary"
              disabled={!acknowledged}
              onClick={confirm}
            >
              Confirm demo selection
              <Check size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <PlanTerms plan={plan} />
          {selected && (
            <DetailLine label="Selected period">
              {dateLabel(selected.start)} – {dateLabel(selected.end)}
            </DetailLine>
          )}
          {select && (
            <div className="modal-actions">
              <button className="btn" onClick={onClose}>
                Close
              </button>
              <button
                className="btn primary"
                disabled={!canSelect}
                onClick={() => setReview(true)}
              >
                Select demo plan
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          {!canSelect && select && (
            <p className="form-error">
              This sample plan does not support this appliance’s brand or
              category.
            </p>
          )}
        </>
      )}
    </Modal>
  );
}

export function ProtectionPlans() {
  const { data } = useStore();
  const [params] = useSearchParams();
  const [applianceId, setApplianceId] = useState(
    params.get("appliance") || data.appliances[0]?.id || "",
  );
  const [plan, setPlan] = useState<Plan | null>(null);
  const [compare, setCompare] = useState(params.get("compare") === "1");
  const appliance = data.appliances.find((a) => a.id === applianceId);
  if (!appliance) return <PageHead title="Add an appliance to explore plans" />;
  const selection = latestPlan(data.selectedProtectionPlans, appliance.id);
  return (
    <div className="care-page protection-page">
      <PageHead
        title="Protection plans"
        description="Choose an appliance, compare plans, and review the terms before selecting."
      >
        <Nav className="btn" to="/protection/my-plans">
          My protection
          <ArrowRight size={16} />
        </Nav>
      </PageHead>
      <div className="appliance-selector panel">
        <div className="form">
          <label>
            Select appliance
            <select
              value={applianceId}
              onChange={(e) => setApplianceId(e.target.value)}
            >
              {data.appliances.map((a) => (
                <option value={a.id} key={a.id}>
                  {a.name} · {a.brand}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <p className="small muted">
            {appliance.category} · {appliance.room}
          </p>
          <Badge>{planStatus(selection, DEMO_DATE)}</Badge>
        </div>
        <button className="btn" onClick={() => setCompare(!compare)}>
          {compare ? "Show plan cards" : "Compare all plans"}
        </button>
      </div>
      {!compare && (
        <div className="plan-grid">
          {protectionPlans.map((p) => (
            <section className="panel plan-card" key={p.id}>
              <div className="plan-card-top">
                <ShieldCheck size={24} />
                <Badge>{p.type}</Badge>
              </div>
              <h2>{p.name}</h2>
              <p className="small muted">{p.provider}</p>
              <div className="plan-price">
                {money(p.price)}
                <span>/ {p.months} months</span>
              </div>
              <p className="small muted">Illustrative plan terms</p>
              <div className="plan-flood">
                {p.flood ? <ShieldCheck size={17} /> : <ShieldX size={17} />}
                <strong>
                  {p.flood
                    ? "Conditional flood coverage"
                    : "Flood damage excluded"}
                </strong>
              </div>
              <DetailLine label="Sample limit">{money(p.limit)}</DetailLine>
              <DetailLine label="Excess">{money(p.excess)}</DetailLine>
              <DetailLine label="Waiting period">
                {p.waitingDays} days
              </DetailLine>
              <p className="plan-eligibility">
                Brands · {p.brands.join(", ")}
                <br />
                {eligible(p, appliance)
                  ? "Eligible brand and category in this demo"
                  : "Not eligible for this brand or category"}
              </p>
              <button className="btn full" onClick={() => setPlan(p)}>
                View terms and exclusions
                <ArrowRight size={16} />
              </button>
              <button
                className="btn primary full"
                disabled={!eligible(p, appliance)}
                onClick={() => setPlan(p)}
              >
                Select demo plan
              </button>
            </section>
          ))}
        </div>
      )}
      {compare && (
        <section className="panel comparison-panel">
          <SectionTitle title="Plan comparison" />
          <p className="comparison-hint">
            Swipe sideways to compare all plans.
          </p>
          <div
            className="care-table-scroll"
            role="region"
            aria-label="Plan comparison table"
            tabIndex={0}
          >
            <table className="care-table">
              <thead>
                <tr>
                  <th>Illustrative terms</th>
                  {protectionPlans.map((p) => (
                    <th key={p.id}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Price / year",
                    ...protectionPlans.map((p) => money(p.price)),
                  ],
                  [
                    "Eligible brands",
                    ...protectionPlans.map((p) => p.brands.join(", ")),
                  ],
                  [
                    "Eligible appliances",
                    ...protectionPlans.map((p) => p.categories.join(", ")),
                  ],
                  [
                    "Flood coverage",
                    ...protectionPlans.map((p) =>
                      p.flood ? "Conditional · subject to review" : "Excluded",
                    ),
                  ],
                  [
                    "Sample limit",
                    ...protectionPlans.map((p) => money(p.limit)),
                  ],
                  ["Excess", ...protectionPlans.map((p) => money(p.excess))],
                  [
                    "Waiting period",
                    ...protectionPlans.map((p) => p.waitingDays + " days"),
                  ],
                  [
                    "Exclusions",
                    ...protectionPlans.map((p) => p.exclusions.join("; ")),
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-actions">
            {protectionPlans.map((p) => (
              <button className="btn" key={p.id} onClick={() => setPlan(p)}>
                View {p.name}
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </section>
      )}
      <Safety>
        {protectionDisclosure} All providers, prices, limits, and conditions are
        illustrative.
      </Safety>
      {plan && (
        <PlanDialog
          plan={plan}
          appliance={appliance}
          select
          onClose={() => setPlan(null)}
        />
      )}
    </div>
  );
}

export function RenewalDialog({
  selected,
  onClose,
}: {
  selected: SelectedPlan;
  onClose: () => void;
}) {
  const { data, update, toast } = useStore();
  const plan = protectionPlans.find((p) => p.id === selected.planId)!;
  const appliance = data.appliances.find((a) => a.id === selected.applianceId)!;
  const [ack, setAck] = useState(false);
  const nextStart =
    selected.end < DEMO_DATE ? DEMO_DATE : addDays(selected.end, 1);
  const nextEnd = annualEnd(nextStart);
  return (
    <Modal
      title="Renew demo plan"
      subtitle="Review the next illustrative term"
      onClose={onClose}
    >
      <PlanTerms plan={plan} />
      <DetailLine label="Appliance">{appliance.name}</DetailLine>
      <DetailLine label="New period">
        {dateLabel(nextStart)} – {dateLabel(nextEnd)}
      </DetailLine>
      <DetailLine label="Illustrative renewal price">
        {money(plan.price)}
      </DetailLine>
      <label className="consent">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
        />
        <span>I confirm this demo renewal. No payment is collected.</span>
      </label>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn primary"
          disabled={!ack || !eligible(plan, appliance)}
          onClick={() => {
            update((d) => ({
              ...d,
              selectedProtectionPlans: d.selectedProtectionPlans.map((s) =>
                s.id === selected.id
                  ? {
                      ...s,
                      start: nextStart,
                      end: nextEnd,
                      renewal: addDays(nextEnd, -15),
                      periods: [
                        ...s.periods,
                        {
                          start: nextStart,
                          end: nextEnd,
                          selectedAt: DEMO_DATE,
                        },
                      ],
                    }
                  : s,
              ),
              activities: [
                {
                  id: nextId("act"),
                  title: "Demo plan renewed",
                  detail: appliance.name + " · " + plan.name,
                  date: DEMO_DATE,
                },
                ...d.activities,
              ],
            }));
            toast("Demo renewal recorded");
            onClose();
          }}
        >
          Confirm demo renewal
          <Check size={16} />
        </button>
      </div>
    </Modal>
  );
}

export function MyProtection() {
  const { data } = useStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState<SelectedPlan | null>(null);
  const [renew, setRenew] = useState<SelectedPlan | null>(null);
  const selections = data.appliances.map((a) => ({
    appliance: a,
    selected: latestPlan(data.selectedProtectionPlans, a.id),
  }));
  return (
    <div className="care-page">
      <PageHead
        title="My protection"
        description="Selected demo plans, upcoming renewals, and appliance records."
      >
        <Nav className="btn primary" to="/protection">
          Explore plans
          <ArrowRight size={16} />
        </Nav>
      </PageHead>
      <div className="care-stats">
        {[
          "Active — demo",
          "Renewal due — demo",
          "Scheduled — demo",
          "Expired — demo",
          "No plan selected",
        ].map((status) => (
          <button
            className="panel"
            key={status}
            aria-pressed={statusFilter === status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "" : status)
            }
          >
            <p className="small muted">{status}</p>
            <strong>
              {
                selections.filter(
                  (s) => planStatus(s.selected, DEMO_DATE) === status,
                ).length
              }
            </strong>
          </button>
        ))}
      </div>
      <div className="mobile-protection-filter form">
        <label>
          Show plans
          <select
            aria-label="Filter protection status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All appliances ({selections.length})</option>
            {[
              "Active — demo",
              "Renewal due — demo",
              "Scheduled — demo",
              "Expired — demo",
              "No plan selected",
            ].map((status) => (
              <option key={status} value={status}>
                {status} (
                {
                  selections.filter(
                    (s) => planStatus(s.selected, DEMO_DATE) === status,
                  ).length
                }
                )
              </option>
            ))}
          </select>
        </label>
      </div>
      {statusFilter && (
        <div className="status-filter-summary">
          <p>{statusFilter}</p>
          <button className="text-link" onClick={() => setStatusFilter("")}>
            Show all appliances
          </button>
        </div>
      )}
      <div className="my-plans-grid">
        {selections
          .filter(
            ({ selected }) =>
              !statusFilter || planStatus(selected, DEMO_DATE) === statusFilter,
          )
          .map(({ appliance: a, selected: s }) => {
            const plan = protectionPlans.find((p) => p.id === s?.planId);
            return (
              <section className="panel my-plan-card" key={a.id}>
                <div className="my-plan-header">
                  <div className="mini-art">
                    <ApplianceArt category={a.category} />
                  </div>
                  <div>
                    <h2>{a.name}</h2>
                    <p className="small muted">
                      {a.brand} · {a.room}
                    </p>
                  </div>
                  <Badge>{planStatus(s, DEMO_DATE)}</Badge>
                </div>
                {s && plan ? (
                  <>
                    <h3>{plan.name}</h3>
                    <p className="small muted">{plan.provider}</p>
                    <DetailLine label="Start date">
                      {dateLabel(s.start)}
                    </DetailLine>
                    <DetailLine label="End date">{dateLabel(s.end)}</DetailLine>
                    <DetailLine label="Renewal date">
                      {dateLabel(s.renewal)}
                    </DetailLine>
                    <div className="button-row">
                      <button className="btn" onClick={() => setView(s)}>
                        View plan
                      </button>
                      <button
                        className="btn primary"
                        disabled={s.start > DEMO_DATE}
                        onClick={() => setRenew(s)}
                      >
                        <CalendarClock size={16} />
                        Renew demo plan
                      </button>
                    </div>
                    {s.start > DEMO_DATE && (
                      <p className="small muted">
                        Next term scheduled. Previous periods remain in the
                        record.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="muted">
                      No additional protection plan selected for this appliance.
                    </p>
                    <Nav className="btn" to={"/protection?appliance=" + a.id}>
                      Explore plans
                      <ArrowRight size={16} />
                    </Nav>
                  </>
                )}
              </section>
            );
          })}
      </div>
      {statusFilter &&
        !selections.some(
          ({ selected }) => planStatus(selected, DEMO_DATE) === statusFilter,
        ) && (
          <p className="panel muted">
            No appliances with this status. Choose another status or show all
            appliances.
          </p>
        )}
      <Safety>
        {protectionDisclosure} Manufacturer warranty dates are tracked
        separately.
      </Safety>
      {view && (
        <PlanDialog
          selected={view}
          plan={protectionPlans.find((p) => p.id === view.planId)!}
          appliance={data.appliances.find((a) => a.id === view.applianceId)!}
          onClose={() => setView(null)}
        />
      )}
      {renew && (
        <RenewalDialog selected={renew} onClose={() => setRenew(null)} />
      )}
    </div>
  );
}

export function ApplianceProtection({ appliance }: { appliance: Appliance }) {
  const { data } = useStore();
  const selected = latestPlan(data.selectedProtectionPlans, appliance.id);
  const plan = protectionPlans.find((p) => p.id === selected?.planId);
  const [renew, setRenew] = useState(false);
  const [view, setView] = useState(false);
  return (
    <section id="protection" className="panel">
      <SectionTitle title="Protection Plan">
        <ShieldCheck size={18} />
      </SectionTitle>
      {selected && plan ? (
        <>
          <Badge>{planStatus(selected, DEMO_DATE)}</Badge>
          <h3 className="care-heading">{plan.name}</h3>
          <p className="small muted">{plan.provider}</p>
          <DetailLine label="Plan period">
            {dateLabel(selected.start)} – {dateLabel(selected.end)}
          </DetailLine>
          <p className="small muted">{plan.floodTerms}</p>
          <div className="button-row">
            <button className="btn" onClick={() => setView(true)}>
              View plan
            </button>
            <button
              className="btn"
              disabled={selected.start > DEMO_DATE}
              onClick={() => setRenew(true)}
            >
              Renew demo plan
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted">No plan selected</p>
          <Nav className="btn" to={"/protection?appliance=" + appliance.id}>
            Explore plans
            <ArrowRight size={16} />
          </Nav>
        </>
      )}
      <p className="small muted care-disclosure">{protectionDisclosure}</p>
      {view && selected && plan && (
        <PlanDialog
          plan={plan}
          selected={selected}
          appliance={appliance}
          onClose={() => setView(false)}
        />
      )}
      {renew && selected && (
        <RenewalDialog selected={selected} onClose={() => setRenew(false)} />
      )}
    </section>
  );
}
