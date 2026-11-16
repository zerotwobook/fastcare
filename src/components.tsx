import { useEffect, useRef, useState } from "react";
import type { ReactNode, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Plus,
  ShieldCheck,
  X,
  Upload,
  MapPin,
  ArrowRight,
  Clock,
  TriangleAlert,
} from "lucide-react";
import { useStore } from "./store";
import { DEMO_DATE, dateLabel, nextId } from "./data";
import type { Appliance, Doc } from "./data";
export function Nav({
  to,
  children,
  className = "",
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  const l = useLocation();
  const [path, query] = to.split("?");
  const current = new URLSearchParams(l.search);
  const q = new URLSearchParams();
  for (const key of ["mode", "capture"]) {
    const value = current.get(key);
    if (value) q.set(key, value);
  }
  new URLSearchParams(query).forEach((v, k) => q.set(k, v));
  return (
    <Link
      to={path + (q.size ? "?" + q.toString() : "")}
      className={className}
      aria-current={
        className.split(/\s+/).includes("active") ? "page" : undefined
      }
      {...rest}
    >
      {children}
    </Link>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={
        "badge " +
        (String(children).includes("inspection") ? "badge-outline" : "")
      }
    >
      <span className="status-dot" />
      {children}
    </span>
  );
}
export function SectionTitle({
  title,
  children,
  kicker,
}: {
  title: string;
  children?: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="section-title">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function PageHead({
  title,
  description,
  children,
  kicker,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="page-head">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="head-actions">{children}</div>}
    </div>
  );
}
export function Empty({
  title = "No matching records",
  detail = "Try a different search or clear your filters.",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="empty">
      <FileText size={32} />
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
export function Safety({ children }: { children: ReactNode }) {
  return (
    <div className="safety">
      <ShieldCheck size={19} />
      <p>{children}</p>
    </div>
  );
}
export function Disclosure({
  title,
  description,
  children,
  open = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="disclosure panel" open={open || undefined}>
      <summary>
        <span>
          <strong>{title}</strong>
          {description && <small>{description}</small>}
        </span>
        <ChevronRight size={18} />
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
export function PageSections({ items }: { items: [string, string][] }) {
  return (
    <nav className="page-sections" aria-label="On this page">
      {items.map(([id, label]) => (
        <a key={id} href={"#" + id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
export function ApplianceArt({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const washer = category === "Washing machine",
    fridge = category === "Refrigerator",
    tv = category === "Television",
    ac = category === "Air conditioner",
    micro = category === "Microwave";
  return (
    <svg
      className={"appliance-art " + className}
      viewBox="0 0 240 200"
      fill="none"
      role="img"
      aria-label={category + " illustration"}
    >
      <ellipse cx="120" cy="179" rx="70" ry="6" fill="#e9e9e9" />
      {washer ? (
        <>
          <rect
            x="65"
            y="25"
            width="111"
            height="151"
            rx="7"
            fill="#f5f5f5"
            stroke="#aaa"
            strokeWidth="1.5"
          />
          <path d="M66 57H175" stroke="#bbb" />
          <rect x="76" y="35" width="29" height="10" rx="2" fill="#ddd" />
          <circle cx="141" cy="42" r="6" fill="#fff" stroke="#999" />
          <circle cx="160" cy="42" r="2" fill="#777" />
          <circle cx="120" cy="111" r="42" fill="#e1e1e1" stroke="#aaa" />
          <circle cx="120" cy="111" r="34" fill="#333" />
          <circle cx="120" cy="111" r="27" fill="#4b4b4b" />
          <path d="M99 112Q120 95 141 113Q130 139 106 129Z" fill="#777" />
          <path
            d="M98 93Q105 83 117 83"
            stroke="#aaa"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="76" y="161" width="17" height="5" rx="2" fill="#ccc" />
        </>
      ) : fridge ? (
        <>
          <rect
            x="74"
            y="16"
            width="94"
            height="161"
            rx="7"
            fill="#eee"
            stroke="#aaa"
            strokeWidth="1.5"
          />
          <path d="M75 76H167" stroke="#aaa" />
          <path
            d="M86 38V61M86 88V123"
            stroke="#777"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M81 20H159" stroke="#fff" strokeWidth="3" />
        </>
      ) : tv ? (
        <>
          <rect x="23" y="36" width="194" height="117" rx="5" fill="#222" />
          <rect x="29" y="42" width="182" height="104" rx="2" fill="#ddd" />
          <path
            d="M29 122L83 68L130 110L157 83L211 135V146H29Z"
            fill="#bcbcbc"
          />
          <path d="M29 145L108 96L159 146Z" fill="#aaa" />
          <circle cx="169" cy="65" r="12" fill="#eee" />
          <path
            d="M90 154L76 175M151 154L165 175"
            stroke="#555"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      ) : ac ? (
        <>
          <rect
            x="23"
            y="61"
            width="194"
            height="70"
            rx="13"
            fill="#f5f5f5"
            stroke="#aaa"
            strokeWidth="1.5"
          />
          <path d="M29 107H211M35 116H205M42 123H198" stroke="#bbb" />
          <rect x="181" y="77" width="15" height="6" rx="2" fill="#ccc" />
          <path
            d="M68 147V157M120 147V168M172 147V157"
            stroke="#ccc"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : micro ? (
        <>
          <rect
            x="31"
            y="59"
            width="179"
            height="104"
            rx="8"
            fill="#eee"
            stroke="#aaa"
            strokeWidth="1.5"
          />
          <rect x="42" y="70" width="123" height="79" rx="3" fill="#333" />
          <rect x="50" y="78" width="107" height="63" fill="#555" />
          <path d="M61 127L142 86" stroke="#777" strokeWidth="8" />
          <rect x="176" y="74" width="22" height="18" rx="2" fill="#555" />
          <circle cx="187" cy="114" r="9" fill="#ddd" stroke="#999" />
          <path d="M187 108V113" stroke="#666" />
          <rect x="177" y="137" width="20" height="5" rx="2" fill="#aaa" />
        </>
      ) : (
        <>
          <rect
            x="66"
            y="111"
            width="111"
            height="50"
            rx="8"
            fill="#ddd"
            stroke="#999"
          />
          <circle cx="105" cy="133" r="27" fill="#eee" stroke="#999" />
          <circle cx="105" cy="133" r="17" fill="#ccc" stroke="#aaa" />
          <rect
            x="123"
            y="66"
            width="45"
            height="51"
            rx="6"
            fill="#eee"
            stroke="#999"
          />
          <path
            d="M145 67V48H185V66M71 133H45V99"
            stroke="#aaa"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          <path d="M74 163V173M164 163V173" stroke="#777" strokeWidth="5" />
        </>
      )}
    </svg>
  );
}
export function HomeArt() {
  return (
    <svg
      className="home-art"
      viewBox="0 0 400 230"
      fill="none"
      aria-hidden="true"
    >
      <path d="M48 151L199 224L354 144L202 71Z" fill="#eee" />
      <path
        d="M92 104L201 47L309 104V167L201 221L92 169Z"
        fill="#f7f7f7"
        stroke="#bbb"
      />
      <path d="M201 47V221M92 104L201 157L309 104" stroke="#bbb" />
      <path
        d="M72 103L201 32L330 102L309 113L201 57L92 114Z"
        fill="#ddd"
        stroke="#aaa"
      />
      <path d="M201 32V57L309 113L330 102Z" fill="#ccc" />
      <path d="M222 154L262 133V190L222 211Z" fill="#ddd" stroke="#aaa" />
      <path d="M111 126L145 142V170L111 154Z" fill="#e1e1e1" stroke="#aaa" />
      <path d="M128 135V162M111 140L145 156" stroke="#aaa" />
      <path d="M273 128L296 116V144L273 157Z" fill="#ddd" stroke="#aaa" />
      <path d="M40 176L66 164M333 175L360 160M164 28L181 19" stroke="#ccc" />
      <circle cx="327" cy="46" r="25" fill="#fff" stroke="#bbb" />
      <path
        d="M317 46L324 53L337 39"
        stroke="#333"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const el = ref.current!;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    el.showModal();
    const close = (e: Event) => {
      e.preventDefault();
      closeRef.current();
    };
    el.addEventListener("cancel", close);
    return () => {
      el.removeEventListener("cancel", close);
      el.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={"modal " + (wide ? "modal-wide " : "") + className}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ApplianceForm({
  appliance,
  onClose,
}: {
  appliance?: Appliance;
  onClose: () => void;
}) {
  const { update, toast } = useStore();
  const [photo, setPhoto] = useState(appliance?.photo || "");
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const entry: Appliance = {
      id: appliance?.id || nextId("appliance"),
      name: String(f.get("name")),
      category: String(f.get("category")),
      brand: String(f.get("brand")).trim(),
      room: String(f.get("room")),
      model: String(f.get("model")),
      purchase: String(f.get("purchase")),
      warranty: String(f.get("warranty")),
      next: appliance?.next || "",
      status: appliance?.status || "Up to date",
    };
    update((d) => ({
      ...d,
      appliances: appliance
        ? d.appliances.map((a) => (a.id === entry.id ? entry : a))
        : [...d.appliances, entry],
      activities: [
        {
          id: nextId("act"),
          title: appliance ? "Appliance updated" : "Appliance added",
          detail: entry.name,
          date: DEMO_DATE,
        },
        ...d.activities,
      ],
    }));
    if (photo) sessionStorage.setItem("photo-" + entry.id, photo);
    toast(
      appliance
        ? "Appliance updated in this demo"
        : "Appliance added to this demo",
    );
    onClose();
  };
  return (
    <Modal
      title={appliance ? "Edit appliance" : "Add an appliance"}
      subtitle="A little information. Better care for your home."
      onClose={onClose}
    >
      <form onSubmit={save} className="form">
        <label>
          Appliance name
          <input
            name="name"
            required
            defaultValue={appliance?.name}
            placeholder="e.g. Front-load Washing Machine"
          />
        </label>
        <label>
          Brand
          <input
            name="brand"
            required
            defaultValue={appliance?.brand}
            list="sample-brands"
            placeholder="e.g. Aster"
          />
          <datalist id="sample-brands">
            <option>Aster</option>
            <option>Nova</option>
            <option>Northline</option>
          </datalist>
        </label>
        <div className="form-grid">
          <label>
            Category
            <select
              name="category"
              defaultValue={appliance?.category || ""}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {[
                "Washing machine",
                "Refrigerator",
                "Television",
                "Air conditioner",
                "Microwave",
                "Water pump",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Room
            <select name="room" required defaultValue={appliance?.room || ""}>
              <option value="" disabled>
                Select room
              </option>
              {[
                "Laundry Room",
                "Kitchen",
                "Living Room",
                "Bedroom",
                "Utility Area",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Model <span className="muted">(optional)</span>
          <input
            name="model"
            defaultValue={appliance?.model}
            placeholder="Model name or number"
          />
        </label>
        <div className="form-grid">
          <label>
            Purchase date
            <input
              type="date"
              name="purchase"
              required
              max={DEMO_DATE}
              defaultValue={appliance?.purchase}
            />
          </label>
          <label>
            Warranty end date <span className="muted">(optional)</span>
            <input
              type="date"
              name="warranty"
              min={appliance?.purchase}
              defaultValue={appliance?.warranty}
            />
          </label>
        </div>
        <label className="upload">
          <Upload size={22} />
          <span>
            {photo
              ? "Photo selected · change photo"
              : "Choose an appliance photo (optional)"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const r = new FileReader();
                r.onload = () => setPhoto(String(r.result));
                r.readAsDataURL(file);
              }
            }}
          />
          {photo && (
            <img
              className="photo-preview"
              src={photo}
              alt="Selected appliance preview"
            />
          )}
        </label>
        <p className="small muted">
          Photo previews stay in this browser session and are never uploaded.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            {appliance ? "Save changes" : "Add appliance"}
            <Plus size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function DocumentPreview({
  doc,
  onClose,
}: {
  doc: Doc;
  onClose: () => void;
}) {
  const { data } = useStore();
  const a = data.appliances.find((a) => a.id === doc.applianceId);
  const sample = `SAMPLE DOCUMENT\nFastcare interactive prototype\n\n${doc.type}\n${a?.name}\n${doc.name}\nDate: ${dateLabel(doc.date)}\n\nIllustrative record only. Not proof of purchase, inspection, insurance coverage, or a claim decision.\nNo personal information is included.`;
  const download = () => {
    const url = URL.createObjectURL(new Blob([sample], { type: "text/plain" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = `SAMPLE-${doc.type.replaceAll(" ", "-")}.txt`;
    el.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Modal
      title="Document preview"
      subtitle="An illustrative local record"
      onClose={onClose}
    >
      <div className="sample-paper">
        <div className="sample-stamp">SAMPLE DOCUMENT</div>
        <FileText size={30} />
        <h2>{doc.type}</h2>
        <p>{doc.name}</p>
        <hr />
        <dl>
          <dt>Appliance</dt>
          <dd>{a?.name}</dd>
          <dt>Record date</dt>
          <dd>{dateLabel(doc.date)}</dd>
          <dt>Document source</dt>
          <dd>Fastcare demo library</dd>
        </dl>
        <p className="small muted">
          Illustrative record only. Not proof of purchase, inspection, insurance
          coverage, or a claim decision.
        </p>
      </div>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>
          Close
        </button>
        <button className="btn primary" onClick={download}>
          Download sample .txt
          <ArrowUpRight size={16} />
        </button>
      </div>
    </Modal>
  );
}
export function AddDocument({
  applianceId,
  onClose,
}: {
  applianceId?: string;
  onClose: () => void;
}) {
  const { data, update, toast } = useStore();
  return (
    <Modal
      title="Add a demo document"
      subtitle="Create a sample record. No file is sent anywhere."
      onClose={onClose}
    >
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const aId = String(f.get("appliance"));
          const type = String(f.get("type"));
          update((d) => {
            const existing = d.documents.find(
              (x) => x.applianceId === aId && x.type === type && !x.available,
            );
            return {
              ...d,
              documents: existing
                ? d.documents.map((x) =>
                    x.id === existing.id
                      ? {
                          ...x,
                          available: true,
                          date: DEMO_DATE,
                          name: String(f.get("name")),
                          status: "Draft" as const,
                        }
                      : x,
                  )
                : [
                    ...d.documents,
                    {
                      id: nextId("doc"),
                      applianceId: aId,
                      type,
                      name: String(f.get("name")),
                      date: DEMO_DATE,
                      available: true,
                      status: "Draft" as const,
                    },
                  ],
            };
          });
          toast("Sample document added");
          onClose();
        }}
      >
        <label>
          Appliance
          <select name="appliance" defaultValue={applianceId} required>
            {data.appliances.map((a) => (
              <option value={a.id} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Document type
          <select name="type">
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
        </label>
        <label>
          Record name
          <input
            name="name"
            required
            placeholder="e.g. Sample purchase receipt"
          />
        </label>
        <Safety>
          Records added here are samples for this prototype. An added inspection
          report does not certify that an appliance is safe.
        </Safety>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Add sample document</button>
        </div>
      </form>
    </Modal>
  );
}
export function Timeline({
  items,
  active,
}: {
  items: string[];
  active: number;
}) {
  return (
    <ol className="timeline">
      {items.map((s, i) => (
        <li
          key={s}
          className={i < active ? "done" : i === active ? "current" : "future"}
        >
          <span className="timeline-node">
            {i < active ? (
              <Check size={13} />
            ) : i === active ? (
              <Clock size={13} />
            ) : (
              <span />
            )}
          </span>
          <div>
            <strong>{s}</strong>
            <p>
              {i < active
                ? "Recorded in this demo"
                : i === active
                  ? "Current stage"
                  : "Pending"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function ApplianceRow({ a }: { a: Appliance }) {
  return (
    <Nav to={"/appliances/" + a.id} className="appliance-row">
      <div className="mini-art">
        <ApplianceArt category={a.category} />
      </div>
      <div className="grow">
        <h3>{a.name}</h3>
        <p>
          {a.brand} · {a.room}
        </p>
      </div>
      <Badge>{a.status}</Badge>
      <ChevronRight size={16} />
    </Nav>
  );
}
export function DetailLine({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="detail-line">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}
export {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Plus,
  ShieldCheck,
  Upload,
  MapPin,
  Clock,
  TriangleAlert,
};
