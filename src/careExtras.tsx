import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowUp,
  ArrowDown,
  Camera,
  ShieldCheck,
  ArrowRight,
  Plus,
  Check,
  FileText,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, nextId, tasks } from "./data";
import type { Appliance, Case, Doc } from "./data";
import { addDays, incidentPlan, protectionPlans } from "./careData";
import type { MovingPriority, PhotoRecord } from "./careData";
import {
  Nav,
  Modal,
  PageHead,
  PageSections,
  SectionTitle,
  Badge,
  Safety,
  ApplianceArt,
  DetailLine,
  AddDocument,
  DocumentPreview,
  Timeline,
} from "./components";
import { PlanDialog } from "./protection";

export function LocalPhotoDialog({
  appliance,
  kind,
  caseId,
  onClose,
}: {
  appliance: Appliance;
  kind: "before" | "after";
  caseId?: string;
  onClose: () => void;
}) {
  const { data, addLocalPhoto, toast } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const incident = data.cases.find((c) => c.applianceId === appliance.id);
  const maxDate =
    kind === "before" && incident ? addDays(incident.date, -1) : DEMO_DATE;
  useEffect(() => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [file]);
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const fields = new FormData(e.currentTarget);
    addLocalPhoto(file, {
      applianceId: appliance.id,
      kind,
      caseId,
      date: String(fields.get("date")),
      description: String(fields.get("description")),
    });
    toast("Local photo preview added");
    onClose();
  };
  return (
    <Modal
      title="Add local photo"
      subtitle={
        appliance.name +
        " · " +
        (kind === "before" ? "Before incident" : "After incident")
      }
      onClose={onClose}
    >
      <form className="form" onSubmit={save}>
        <label>
          Choose photo
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        {url && (
          <img
            className="local-photo modal-photo"
            src={url}
            alt="Local photo preview"
          />
        )}
        <label>
          Record date
          <input
            name="date"
            type="date"
            max={maxDate}
            defaultValue={maxDate}
            required
          />
        </label>
        <label>
          Description
          <input
            name="description"
            required
            placeholder="Describe this appliance photo"
          />
        </label>
        <p className="small muted">
          Preview stays in this page session. Photos are never uploaded and must
          be selected again after a refresh. Reset demo clears local previews.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={!file}>
            Add local photo
            <Plus size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function PhotoGallery({
  appliance,
  kind,
  caseId,
  cutoff,
  compact = false,
}: {
  appliance: Appliance;
  kind: "before" | "after";
  caseId?: string;
  cutoff?: string;
  compact?: boolean;
}) {
  const { data, localPhotos } = useStore();
  const [add, setAdd] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<
    (PhotoRecord & { url?: string }) | null
  >(null);
  const records = [...data.photoRecords, ...localPhotos]
    .filter(
      (p) =>
        p.applianceId === appliance.id &&
        p.kind === kind &&
        (!caseId || kind === "before" || p.caseId === caseId) &&
        (!cutoff || kind !== "before" || p.date < cutoff),
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || Number(a.sample) - Number(b.sample),
    );
  return (
    <section
      className={
        "photo-gallery " +
        (compact ? "compact-photo-gallery" : "") +
        (expanded ? " expanded" : "")
      }
    >
      <div className="section-title">
        <h3>{kind === "before" ? "Before incident" : "After incident"}</h3>
        <button className="text-link" onClick={() => setAdd(true)}>
          <Plus size={14} />
          Add local photo
        </button>
      </div>
      <div className="photo-record-grid">
        {records.map((p) => (
          <button
            className="photo-record"
            key={p.id}
            onClick={() => setPreview(p)}
          >
            {"url" in p ? (
              <img src={String(p.url)} alt={p.description} />
            ) : (
              <div className="sample-appliance-image">
                <ApplianceArt category={appliance.category} />
                <span>Sample image</span>
              </div>
            )}
            <span className="photo-record-caption">
              <strong>{dateLabel(p.date)}</strong>
              <span>{p.description}</span>
            </span>
          </button>
        ))}
      </div>
      {!records.length && (
        <p className="small muted">
          No photo preview available. Local files must be selected again after
          refresh.
        </p>
      )}
      {compact && records.length > 1 && (
        <button
          className="text-link photo-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show fewer photos" : `Show all ${records.length} photos`}
        </button>
      )}
      {add && (
        <LocalPhotoDialog
          appliance={appliance}
          kind={kind}
          caseId={caseId}
          onClose={() => setAdd(false)}
        />
      )}
      {preview && (
        <Modal
          title={
            kind === "before" ? "Before incident photo" : "After incident photo"
          }
          subtitle={appliance.name + " · " + dateLabel(preview.date)}
          onClose={() => setPreview(null)}
        >
          {preview.url ? (
            <img
              className="local-photo"
              src={preview.url}
              alt={preview.description}
            />
          ) : (
            <div className="sample-photo-large">
              <ApplianceArt category={appliance.category} />
              <span>Sample image</span>
            </div>
          )}
          <p className="muted">{preview.description}</p>
        </Modal>
      )}
    </section>
  );
}

export function MovingPriorities() {
  const { data, update, toast } = useStore();
  const items: MovingPriority[] = [
    ...data.movingPriorities,
    ...data.appliances
      .filter((a) => !data.movingPriorities.some((m) => m.applianceId === a.id))
      .map((a) => ({
        applianceId: a.id,
        priority: "Medium" as const,
        assistance: false,
        note: "Plan ahead while conditions are safe.",
      })),
  ];
  const change = (next: MovingPriority[]) =>
    update((d) => ({
      ...d,
      movingPriorities: next,
      movingPlanSaved: false,
      checked: d.checked.filter((id) => id !== "moving"),
    }));
  const reorder = (index: number, offset: number) => {
    const next = [...items];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    change(next);
  };
  return (
    <section className="panel moving-panel">
      <SectionTitle title="Appliance moving priorities">
        <Badge>
          {data.movingPlanSaved ? "Plan saved — demo" : "User-set priorities"}
        </Badge>
      </SectionTitle>
      <p className="muted small">
        Choose your own order and assistance needs. Sorting alone does not
        complete the preparation checklist.
      </p>
      <div className="moving-list">
        {items.map((item, i) => {
          const a = data.appliances.find((a) => a.id === item.applianceId);
          if (!a) return null;
          return (
            <div className="moving-row" key={a.id}>
              <div className="moving-appliance">
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
              <div className="form">
                <label>
                  Priority
                  <select
                    aria-label={"Priority for " + a.name}
                    value={item.priority}
                    onChange={(e) =>
                      change(
                        items.map((m) =>
                          m.applianceId === a.id
                            ? {
                                ...m,
                                priority: e.target
                                  .value as MovingPriority["priority"],
                              }
                            : m,
                        ),
                      )
                    }
                  >
                    {["High", "Medium", "Low"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="moving-note form">
                <label>
                  Preparation note
                  <input
                    aria-label={"Preparation note for " + a.name}
                    value={item.note}
                    onChange={(e) =>
                      change(
                        items.map((m) =>
                          m.applianceId === a.id
                            ? { ...m, note: e.target.value }
                            : m,
                        ),
                      )
                    }
                  />
                </label>
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={item.assistance}
                    onChange={(e) =>
                      change(
                        items.map((m) =>
                          m.applianceId === a.id
                            ? { ...m, assistance: e.target.checked }
                            : m,
                        ),
                      )
                    }
                  />
                  <span>
                    Professional moving assistance needed
                    <span className="sr-only"> for {a.name}</span>
                  </span>
                </label>
              </div>
              <div className="reorder-controls">
                <button
                  className="icon-button"
                  aria-label={"Move " + a.name + " up"}
                  disabled={i === 0}
                  onClick={() => reorder(i, -1)}
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label={"Move " + a.name + " down"}
                  disabled={i === items.length - 1}
                  onClick={() => reorder(i, 1)}
                >
                  <ArrowDown size={17} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="moving-save">
        <p className="small muted">
          Saving completes only the moving-support planning task.
        </p>
        <button
          className="btn primary"
          onClick={() => {
            update((d) => ({
              ...d,
              movingPriorities: items,
              movingPlanSaved: true,
              checked: [...new Set([...d.checked, "moving"])],
              activities: [
                {
                  id: nextId("act"),
                  title: "Moving preparation plan saved",
                  detail: items.length + " appliance priorities recorded",
                  date: DEMO_DATE,
                },
                ...d.activities,
              ],
            }));
            toast("Moving priorities saved to this demo");
          }}
        >
          Save moving plan
          <Check size={16} />
        </button>
      </div>
      <Safety>
        Plan ahead while conditions are safe. Do not move electrical equipment
        through floodwater.
      </Safety>
    </section>
  );
}

export function PreparationPage() {
  const { data, update, toast } = useStore();
  const [params] = useSearchParams();
  const view = params.get("view") || "checklist";
  const [applianceId, setApplianceId] = useState(
    params.get("appliance") || data.appliances[0]?.id || "",
  );
  const appliance = data.appliances.find((a) => a.id === applianceId);
  const progress = Math.round((data.checked.length / tasks.length) * 100);
  return (
    <div className="care-page preparation-v2">
      <PageHead
        title="Flood preparation"
        description="Plan appliance care and moving support while conditions are safe."
      >
        {view === "checklist" && (
          <button
            className="btn primary"
            onClick={() => toast("Checklist saved to this demo")}
          >
            Save checklist
            <Check size={16} />
          </button>
        )}
      </PageHead>
      <div className="care-tabs">
        <Nav
          className={view === "checklist" ? "active" : ""}
          to="/preparation?view=checklist"
        >
          Checklist
        </Nav>
        <Nav
          className={view === "moving" ? "active" : ""}
          to="/preparation?view=moving"
        >
          Moving priorities
        </Nav>
        <Nav
          className={view === "photos" ? "active" : ""}
          to="/preparation?view=photos"
        >
          Photos
        </Nav>
      </div>
      <div className="panel preparation-progress">
        <div>
          <h2>
            {data.checked.length} of {tasks.length} tasks complete
          </h2>
          <p className="small muted">Preparation checklist progress</p>
        </div>
        <div className="progress-track">
          <i style={{ width: progress + "%" }} />
        </div>
        <strong>{progress}%</strong>
      </div>
      {view === "moving" ? (
        <MovingPriorities />
      ) : view === "photos" ? (
        <section className="panel">
          <div className="form photo-appliance-select">
            <label>
              Appliance
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
          {appliance && <PhotoGallery appliance={appliance} kind="before" />}
          <p className="small muted">
            Sample illustrations and local previews are labeled. Keep important
            records accessible.
          </p>
        </section>
      ) : (
        <div className="preparation-layout">
          <section className="panel checklist-panel">
            {[
              "Appliance records",
              "Household planning",
              "Professional support",
            ].map((group) => (
              <div className="checklist-group" key={group}>
                <h2>{group}</h2>
                {tasks
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <label
                      className={
                        "checklist-row " +
                        (data.checked.includes(t.id) ? "is-checked" : "")
                      }
                      key={t.id}
                    >
                      <input
                        type="checkbox"
                        checked={data.checked.includes(t.id)}
                        onChange={() =>
                          update((d) => ({
                            ...d,
                            checked: d.checked.includes(t.id)
                              ? d.checked.filter((id) => id !== t.id)
                              : [...d.checked, t.id],
                          }))
                        }
                      />
                      <div>
                        <strong>{t.title}</strong>
                        <p>{t.detail}</p>
                      </div>
                    </label>
                  ))}
              </div>
            ))}
          </section>
          <aside className="stack">
            <section className="panel">
              <h2>Prepare every appliance record</h2>
              <p className="muted">
                Organize photos, moving priorities, documents, and qualified
                assistance before an incident.
              </p>
              <div className="care-link-list">
                <Nav to="/preparation?view=moving">
                  Set moving priorities
                  <ArrowRight size={16} />
                </Nav>
                <Nav to="/preparation?view=photos">
                  Review pre-flood photos
                  <Camera size={17} />
                </Nav>
                <Nav to="/consultation/urgent?mode=flood">
                  Urgent technician support
                  <ArrowRight size={16} />
                </Nav>
                <Nav to="/appliances">
                  View appliance records
                  <ArrowRight size={16} />
                </Nav>
              </div>
            </section>
            <Safety>
              Do not handle electrical equipment in floodwater. Arrange
              qualified assistance when needed.
            </Safety>
            <Badge>Flood scenario preview</Badge>
          </aside>
        </div>
      )}
    </div>
  );
}

export function RecoveryProtection({
  incident,
  appliance,
}: {
  incident: Case;
  appliance: Appliance;
}) {
  const { data } = useStore();
  const selected =
    data.selectedProtectionPlans.find((s) => s.id === incident.protectionId) ||
    incidentPlan(data.selectedProtectionPlans, appliance.id, incident.date);
  const plan = protectionPlans.find((p) => p.id === selected?.planId);
  const period = selected?.periods.find(
    (p) =>
      p.start <= incident.date &&
      p.end >= incident.date &&
      p.selectedAt <= incident.date,
  );
  const [view, setView] = useState(false);
  return (
    <section id="case-protection" className="panel recovery-protection">
      <SectionTitle title="Protection and financial recovery support">
        <ShieldCheck size={19} />
      </SectionTitle>
      {selected && plan && period ? (
        <>
          <Badge>Subject to provider review</Badge>
          <h3 className="care-heading">{plan.name}</h3>
          <p className="small muted">{plan.provider}</p>
          <DetailLine label="Relevant sample period">
            {dateLabel(period.start)} – {dateLabel(period.end)}
          </DetailLine>
          <DetailLine label="Incident date">
            {dateLabel(incident.date)}
          </DetailLine>
          <DetailLine label="Waiting period ends">
            {dateLabel(addDays(period.start, plan.waitingDays))}
          </DetailLine>
          <p className="small muted">
            {plan.floodTerms} This link is a record association and does not
            determine eligibility.
          </p>
          <button className="btn" onClick={() => setView(true)}>
            View plan
          </button>
        </>
      ) : (
        <>
          <Badge>No protection plan linked</Badge>
          <p className="muted">
            Inspection and repair coordination remain available. A plan selected
            after this incident does not apply to the earlier damage.
          </p>
          <Nav className="btn" to={"/protection?appliance=" + appliance.id}>
            Explore illustrative plans
            <ArrowRight size={16} />
          </Nav>
        </>
      )}
      <p className="small muted care-disclosure">
        Document preparation support only. Coverage and claim decisions depend
        on the provider and policy.
      </p>
      {view && plan && selected && (
        <PlanDialog
          plan={plan}
          selected={selected}
          appliance={appliance}
          onClose={() => setView(false)}
        />
      )}
    </section>
  );
}

export function ClaimPreparation({
  incident,
  appliance,
}: {
  incident: Case;
  appliance: Appliance;
}) {
  const { data, update, toast } = useStore();
  const [add, setAdd] = useState(false);
  const [pack, setPack] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);
  const required = [
    "Receipt",
    "Appliance photo",
    "Inspection report",
    "Policy document",
  ];
  const documents = required.map((type) => ({
    type,
    doc: data.documents.find(
      (d) => d.applianceId === appliance.id && d.type === type && d.available,
    ),
  }));
  const missing = documents.filter((d) => !d.doc).map((d) => d.type);
  const ready =
    incident.packStatus === "Ready for review" && missing.length === 0;
  const list = (
    <div className="claim-documents">
      {documents.map(({ type, doc }) => (
        <div className="claim-doc" key={type}>
          <FileText size={17} />
          <div className="grow">
            <strong>{type}</strong>
            <p className="small muted">
              {!doc ? "Not added" : ready ? "Ready for review" : "Draft"}
            </p>
          </div>
          {doc ? (
            <button className="text-link" onClick={() => setPreview(doc)}>
              Preview
            </button>
          ) : (
            <button className="text-link" onClick={() => setAdd(true)}>
              Add
              <Plus size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
  return (
    <section id="claim-documents" className="panel claim-panel-v2">
      <SectionTitle title="Claim preparation">
        <Badge>{ready ? "Ready for review" : "Draft"}</Badge>
      </SectionTitle>
      {list}
      <div className="button-row">
        <Nav className="btn" to="/preparation">
          View preparation checklist
        </Nav>
        <button className="btn" onClick={() => setAdd(true)}>
          Add supporting document
        </button>
        <button className="btn" onClick={() => setPack(true)}>
          Preview document pack
        </button>
        <button
          className="btn primary"
          disabled={missing.length > 0 || ready}
          onClick={() => {
            update((d) => ({
              ...d,
              cases: d.cases.map((c) =>
                c.id === incident.id
                  ? { ...c, packStatus: "Ready for review" }
                  : c,
              ),
              documents: d.documents.map((doc) =>
                doc.applianceId === appliance.id &&
                doc.available &&
                required.includes(doc.type)
                  ? { ...doc, status: "Ready for review" }
                  : doc,
              ),
              activities: [
                {
                  id: nextId("act"),
                  title: "Demo document pack marked ready",
                  detail: incident.id + " · provider review pending",
                  date: DEMO_DATE,
                },
                ...d.activities,
              ],
            }));
            toast("Demo pack ready for review");
          }}
        >
          Mark demo pack as ready
          <Check size={16} />
        </button>
      </div>
      {missing.length > 0 && (
        <p className="small muted care-disclosure">
          Add these records before marking the pack ready: {missing.join(", ")}.
        </p>
      )}
      <p className="small muted care-disclosure">
        Document preparation support only. Coverage and claim decisions depend
        on the provider and policy.
      </p>
      {add && (
        <AddDocument applianceId={appliance.id} onClose={() => setAdd(false)} />
      )}
      {pack && (
        <Modal
          title="Sample document pack"
          subtitle={incident.id + " · Preparation support only"}
          onClose={() => setPack(false)}
        >
          {list}
          <Safety>
            Subject to provider review. Marking a demo pack ready does not
            submit a claim or determine a payment.
          </Safety>
        </Modal>
      )}
      {preview && (
        <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      )}
    </section>
  );
}

export function ReportDamagePage() {
  const { data, update, toast, addLocalPhoto } = useStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  return (
    <div className="care-page">
      <PageHead
        title="Report appliance damage"
        description="Record what you observed, after the area is safe to access."
      />
      <div className="report-layout">
        <section className="panel">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const id = nextId("RC");
              const applianceId = String(f.get("appliance"));
              const date = String(f.get("date"));
              const entry: Case = {
                id,
                applianceId,
                date,
                description: String(f.get("description")),
                location: String(f.get("location")),
                photos: files.length,
                status: "Awaiting inspection",
                packStatus: "Draft",
                protectionId: incidentPlan(
                  data.selectedProtectionPlans,
                  applianceId,
                  date,
                )?.id,
              };
              files.forEach((file) =>
                addLocalPhoto(file, {
                  applianceId,
                  caseId: id,
                  kind: "after",
                  date,
                  description: "Local incident photo preview",
                }),
              );
              update((d) => ({
                ...d,
                cases: [...d.cases, entry],
                appliances: d.appliances.map((a) =>
                  a.id === applianceId
                    ? { ...a, status: "Needs inspection" }
                    : a,
                ),
                documents: files.length
                  ? [
                      ...d.documents,
                      {
                        id: nextId("doc"),
                        applianceId,
                        type: "Appliance photo",
                        name: "Local incident photo record",
                        date,
                        available: true,
                        status: "Draft",
                      },
                    ]
                  : d.documents,
                activities: [
                  {
                    id: nextId("act"),
                    title: "Damage record created",
                    detail:
                      data.appliances.find((a) => a.id === applianceId)?.name ||
                      "",
                    date: DEMO_DATE,
                  },
                  ...d.activities,
                ],
              }));
              toast("Damage recorded in this demo");
              navigate("/recovery/" + id + "?" + params.toString());
            }}
          >
            <label>
              Appliance
              <select
                name="appliance"
                required
                defaultValue={params.get("appliance") || data.appliances[0]?.id}
              >
                {data.appliances.map((a) => (
                  <option value={a.id} key={a.id}>
                    {a.name} · {a.brand}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                Incident date
                <input
                  name="date"
                  type="date"
                  required
                  max={DEMO_DATE}
                  defaultValue="2026-11-12"
                />
              </label>
              <label>
                Location in home
                <input
                  name="location"
                  required
                  placeholder="e.g. Laundry Room"
                />
              </label>
            </div>
            <label>
              What did you observe?
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Describe visible damage or water exposure for this demo"
              />
            </label>
            <label className="upload">
              <Camera size={24} />
              <span>After incident photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
              <span className="small muted">
                Optional local previews. Photos are never uploaded.
              </span>
            </label>
            {previews.length > 0 && (
              <div className="photo-strip">
                {previews.map((url, i) => (
                  <img key={url} src={url} alt={"Damage photo " + (i + 1)} />
                ))}
              </div>
            )}
            <label className="consent">
              <input type="checkbox" required />
              <span>
                I am recording information after the area is safe to access.
              </span>
            </label>
            <div className="modal-actions">
              <Nav className="btn" to="/recovery">
                Cancel
              </Nav>
              <button className="btn primary">
                Create demo case
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </section>
        <aside className="stack">
          <Safety>
            Do not power on flood-exposed appliances before professional
            inspection.
          </Safety>
          <section className="panel">
            <h2>Records connected to the right incident.</h2>
            <p className="muted">
              The case links the appliance, earlier photos, relevant sample plan
              periods, and inspection booking.
            </p>
            <p className="small muted">
              Selecting a new protection plan does not cover earlier damage. No
              image analysis or repair estimate is performed.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function RecoveryDetailsPage() {
  const { id } = useParams();
  const { data } = useStore();
  const incident = data.cases.find((c) => c.id === id);
  const appliance = data.appliances.find((a) => a.id === incident?.applianceId);
  if (!incident || !appliance)
    return (
      <>
        <PageHead title="This recovery record isn’t here." />
        <Nav className="btn" to="/recovery">
          Recovery center
        </Nav>
      </>
    );
  const booking = data.bookings.find(
    (b) => b.id === incident.bookingId && b.status !== "Cancelled",
  );
  return (
    <div className="care-page recovery-v2">
      <PageHead
        kicker={incident.id}
        title="Recovery case"
        description="Protection records, photos, inspections, and supporting documents."
      >
        <Badge>{incident.status}</Badge>
      </PageHead>
      <PageSections
        items={[
          ["incident", "Incident"],
          ["case-photos", "Photos"],
          ["claim-documents", "Documents"],
          ["case-protection", "Protection"],
          ["inspection", "Inspection"],
        ]}
      />
      <section id="inspection" className="panel case-next-step">
        <SectionTitle title="Inspection appointment" />
        {booking ? (
          <>
            <DetailLine label="Team">{booking.team}</DetailLine>
            <DetailLine label="Appointment">
              {dateLabel(booking.date)} · {booking.time}
            </DetailLine>
            <Nav className="btn full" to={"/bookings/" + booking.id}>
              View booking
              <ArrowRight size={16} />
            </Nav>
          </>
        ) : (
          <>
            <p className="muted">Schedule professional inspection</p>
            <Nav
              className="btn primary full"
              to={
                "/bookings/new?appliance=" +
                appliance.id +
                "&service=Post-flood+inspection&case=" +
                incident.id
              }
            >
              Book inspection
              <ArrowRight size={16} />
            </Nav>
          </>
        )}
      </section>
      <div className="recovery-v2-grid">
        <div className="stack">
          <section id="incident" className="panel">
            <div className="case-summary-head">
              <div className="case-art">
                <ApplianceArt category={appliance.category} />
              </div>
              <div>
                <h2>{appliance.name}</h2>
                <p>
                  {appliance.brand} · {appliance.room}
                </p>
                <Nav className="text-link" to={"/appliances/" + appliance.id}>
                  View appliance record
                  <ArrowRight size={15} />
                </Nav>
              </div>
            </div>
            <SectionTitle title="Incident record">
              <span className="small muted">{dateLabel(incident.date)}</span>
            </SectionTitle>
            <p className="muted">{incident.description}</p>
          </section>
          <section id="case-photos" className="panel before-after-records">
            <SectionTitle title="Before and after records" />
            <div className="before-after-photos">
              <PhotoGallery
                appliance={appliance}
                kind="before"
                cutoff={incident.date}
                compact
              />
              <PhotoGallery
                appliance={appliance}
                kind="after"
                caseId={incident.id}
                compact
              />
            </div>
            <p className="small muted care-disclosure">
              Sample images are illustrative. Local photo previews are cleared
              on refresh or Reset demo.
            </p>
          </section>
          <ClaimPreparation incident={incident} appliance={appliance} />
        </div>
        <aside className="stack">
          <RecoveryProtection incident={incident} appliance={appliance} />

          <section className="panel">
            <SectionTitle title="Recovery timeline" />
            <Timeline
              active={booking ? 1 : 0}
              items={[
                "Damage recorded",
                "Inspection scheduled",
                "Inspection report added",
                "Documents prepared",
                "Case closed",
              ]}
            />
            <p className="small muted">
              Inspection outcomes remain pending. Added sample documents do not
              certify an inspection.
            </p>
          </section>
          <Safety>
            Do not power on flood-exposed appliances before professional
            inspection.
          </Safety>
        </aside>
      </div>
    </div>
  );
}
