import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Phone,
  Video,
  UserRound,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useStore } from "./store";
import { ConsultationChat } from "./consultationChat";
import { ConsultationCall } from "./consultationCall";
import { DEMO_DATE, nextId } from "./data";
import type { Consultation as ConsultationRecord } from "./careData";
import { technicianProfiles } from "./careData";
import {
  Nav,
  Badge,
  PageHead,
  SectionTitle,
  Modal,
  Safety,
  ApplianceArt,
} from "./components";

const topics = [
  "General appliance care",
  "Maintenance question",
  "Repair consultation",
  "Post-flood inspection guidance",
];
const channels = [
  {
    name: "Chat",
    icon: MessageSquare,
    description: "Explore a simulated conversation",
  },
  {
    name: "Voice call",
    icon: Phone,
    description: "Try the demo call controls",
  },
  {
    name: "Video call",
    icon: Video,
    description: "View a simulated video consultation",
  },
];
const questions = [
  "What records should I prepare?",
  "How do I arrange an inspection?",
  "My appliance was exposed to flooding.",
];
const reply =
  "Please keep the appliance model, purchase record, and photos ready. A qualified technician would need to inspect the appliance before assessing its condition or repair needs. Do not power on flood-exposed appliances before professional inspection.";
const summaryText =
  "Sample discussion of appliance records and professional inspection arrangements. No diagnosis was made. Keep photos and documents available for the service visit.";
const inspectionService = (topic: string) =>
  topic.includes("flood") ? "Post-flood inspection" : "Appliance inspection";

export function Consultation() {
  const { data, update, toast } = useStore();
  const [params] = useSearchParams();
  const capture = params.get("capture") === "1";
  const preview = params.get("preview") === "video";
  const initialId = data.appliances.some(
    (a) => a.id === params.get("appliance"),
  )
    ? params.get("appliance")!
    : data.appliances[0]?.id || "";
  const [applianceId, setApplianceId] = useState(initialId);
  const [topic, setTopic] = useState(params.get("topic") || topics[0]);
  const [channel, setChannel] = useState(
    preview ? "Video call" : params.get("channel") || "Chat",
  );
  const appliance = data.appliances.find((a) => a.id === applianceId)!;
  const available = technicianProfiles.filter((t) =>
    t.brands.includes(appliance?.brand),
  );
  const [team, setTeam] = useState(available[0]?.name || "");
  const [session, setSession] = useState<ConsultationRecord | null>(() =>
    preview
      ? {
          id: "capture-preview",
          applianceId: initialId,
          topic: "Post-flood inspection guidance",
          channel: "Video call",
          team: available[0]?.name || "Sample technician",
          date: DEMO_DATE,
          status: "Demo session",
          summary: summaryText,
          messages: [],
        }
      : null,
  );
  const [phase, setPhase] = useState("connecting");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [camera, setCamera] = useState(true);
  const [summary, setSummary] = useState<ConsultationRecord | null>(null);
  useEffect(() => {
    if (!available.some((t) => t.name === team))
      setTeam(available[0]?.name || "");
  }, [applianceId, team]);
  useEffect(() => {
    if (!session || session.channel === "Chat") return;
    if (preview) {
      setPhase("active");
      return;
    }
    setPhase("connecting");
    const timer = setTimeout(() => setPhase("active"), 1200);
    return () => clearTimeout(timer);
  }, [session?.id]);
  useEffect(() => {
    if (!session || session.channel === "Chat" || phase !== "active" || capture)
      return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [session?.id, phase, capture]);
  if (!appliance)
    return <PageHead title="Add an appliance to start a consultation" />;
  const sessionAppliance =
    data.appliances.find((a) => a.id === session?.applianceId) || appliance;
  const start = () => {
    const entry: ConsultationRecord = {
      id: nextId("CS"),
      applianceId,
      topic,
      channel,
      team,
      date: DEMO_DATE,
      status: "Demo session",
      summary: summaryText,
      messages: [
        {
          role: "technician",
          text: "Welcome to this simulated consultation. You can explore preparation questions or arrange a professional inspection.",
        },
      ],
    };
    setSession(entry);
    setElapsed(0);
    setMuted(false);
    setCamera(true);
    setSpeaker(true);
    update((d) => ({
      ...d,
      consultations: [...d.consultations, entry],
      activities: [
        {
          id: nextId("act"),
          title: "Demo consultation started",
          detail: appliance.name + " · " + channel,
          date: DEMO_DATE,
        },
        ...d.activities,
      ],
    }));
  };
  const send = (text: string) => {
    if (!session || !text.trim()) return;
    const messages: ConsultationRecord["messages"] = [
      ...session.messages,
      { role: "user", text: text.trim() },
      { role: "technician", text: reply },
    ];
    setSession({ ...session, messages });
    update((d) => ({
      ...d,
      consultations: d.consultations.map((c) =>
        c.id === session.id ? { ...c, messages } : c,
      ),
    }));
  };
  const end = () => {
    if (!session) return;
    setSummary(session);
    setSession(null);
    update((d) => ({
      ...d,
      consultations: d.consultations.map((c) =>
        c.id === session.id ? { ...c, status: "Ended — demo" } : c,
      ),
    }));
    toast("Demo consultation ended");
  };
  const seconds = capture ? 134 : elapsed;
  const timerLabel =
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0");
  if (session?.channel === "Chat") {
    return (
      <ConsultationChat
        session={session}
        appliance={sessionAppliance}
        questions={questions}
        onSend={send}
        onEnd={end}
      />
    );
  }
  if (session)
    return (
      <ConsultationCall
        session={session}
        appliance={sessionAppliance}
        phase={phase}
        timer={timerLabel}
        muted={muted}
        speaker={speaker}
        camera={camera}
        onMute={() => setMuted(!muted)}
        onSpeaker={() => setSpeaker(!speaker)}
        onCamera={() => setCamera(!camera)}
        onEnd={end}
      />
    );
  return (
    <div className="care-page consultation-page">
      <PageHead
        title="Talk to a technician"
        description="Appliance care, maintenance questions, and repair coordination."
      >
        <Nav className="btn" to="/consultation/urgent?mode=flood">
          Urgent technician support
          <ArrowUpRight size={16} />
        </Nav>
      </PageHead>
      <div className="consultation-layout">
        <section className="panel consultation-setup">
          <SectionTitle title="What would you like to discuss?" />
          <div className="form">
            <div className="form-grid">
              <label>
                Appliance
                <select
                  value={applianceId}
                  onChange={(e) => setApplianceId(e.target.value)}
                >
                  {data.appliances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.brand}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Topic
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset className="channel-options">
              <legend>Consultation channel</legend>
              {channels.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    type="button"
                    key={c.name}
                    className={channel === c.name ? "selected" : ""}
                    aria-pressed={channel === c.name}
                    onClick={() => setChannel(c.name)}
                  >
                    <Icon size={25} />
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                  </button>
                );
              })}
            </fieldset>
            <label>
              Sample technician team
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a sample team
                </option>
                {available.map((t) => (
                  <option key={t.name}>{t.name}</option>
                ))}
              </select>
            </label>
            {available.length ? (
              <div className="team-availability">
                <UserRound size={23} />
                <div>
                  <h3>{team}</h3>
                  <p>
                    Sample technician ·{" "}
                    {available.find((t) => t.name === team)?.availability}
                  </p>
                  <p>
                    Supported sample brands ·{" "}
                    {available.find((t) => t.name === team)?.brands.join(", ")}
                  </p>
                </div>
              </div>
            ) : (
              <Safety>
                Brand support has not been specified for this appliance. Choose
                an Aster, Nova, or Northline sample appliance to explore the
                consultation flow.
              </Safety>
            )}
            <button className="btn primary" disabled={!team} onClick={start}>
              Start demo {channel.toLowerCase()}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <aside className="stack">
          <section className="panel consultation-profile">
            <ApplianceArt category={appliance.category} />
            <h2>{appliance.name}</h2>
            <p>
              {appliance.brand} · {appliance.room}
            </p>
            <Badge>{appliance.status}</Badge>
            <Nav className="btn full" to={"/appliances/" + appliance.id}>
              View appliance details
              <ArrowUpRight size={16} />
            </Nav>
          </section>
          <Safety>
            Simulated conversation. No technician is connected. Call and video
            controls operate locally without camera or microphone access.
          </Safety>
        </aside>
      </div>
      {!session && data.consultations.length > 0 && (
        <section className="panel consultation-history">
          <SectionTitle title="Recent demo consultations" />
          {data.consultations
            .slice(-3)
            .reverse()
            .map((c) => (
              <div className="document-row" key={c.id}>
                <MessageSquare size={18} />
                <div className="grow">
                  <h3>
                    {data.appliances.find((a) => a.id === c.applianceId)?.name}{" "}
                    · {c.channel}
                  </h3>
                  <p>
                    {c.topic} · {c.team}
                  </p>
                </div>
                <Badge>{c.status}</Badge>
              </div>
            ))}
        </section>
      )}
      {summary && (
        <Modal
          title="Demo consultation summary"
          onClose={() => setSummary(null)}
        >
          <Badge>Simulated {summary.channel.toLowerCase()}</Badge>
          <h3 className="care-heading">
            {data.appliances.find((a) => a.id === summary.applianceId)?.name}
          </h3>
          <p className="muted">{summaryText}</p>
          <div className="modal-actions">
            <button className="btn" onClick={() => setSummary(null)}>
              Return to consultation
            </button>
            <Nav
              className="btn primary"
              to={
                "/bookings/new?appliance=" +
                summary.applianceId +
                "&service=" +
                encodeURIComponent(inspectionService(summary.topic))
              }
              onClick={() => setSummary(null)}
            >
              Book inspection
              <ArrowRight size={16} />
            </Nav>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function UrgentSupport() {
  const { data, update } = useStore();
  const [applianceId, setApplianceId] = useState(data.appliances[0]?.id || "");
  const [issue, setIssue] = useState("Flood exposure");
  const [channel, setChannel] = useState("Chat");
  const appliance = data.appliances.find((a) => a.id === applianceId);
  const teams = technicianProfiles.filter((t) =>
    t.brands.includes(appliance?.brand || ""),
  );
  const [team, setTeam] = useState(teams[0]?.name || "");
  const [reference, setReference] = useState("");
  useEffect(() => {
    if (!teams.some((t) => t.name === team)) setTeam(teams[0]?.name || "");
  }, [applianceId, team]);
  return (
    <div className="care-page urgent-page">
      <PageHead
        title="Urgent technician support"
        description="Organize appliance support and professional inspection after safe access."
      >
        <Badge>Flood scenario preview</Badge>
      </PageHead>
      {reference && (
        <div className="confirmation" role="status">
          <Check size={22} />
          <div>
            <h3>Demo request recorded</h3>
            <p>{reference} · Saved locally. No technician has been notified.</p>
          </div>
        </div>
      )}
      <div className="consultation-layout">
        <section className="panel">
          <div className="form">
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
            <div className="form-grid">
              <label>
                Support issue
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                >
                  {[
                    "Flood exposure",
                    "Inspection request",
                    "Repair coordination",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Demo consultation channel
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  {channels.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <h3>Sample providers</h3>
            <div className="provider-list">
              {teams.map((t) => (
                <button
                  className={"provider " + (team === t.name ? "selected" : "")}
                  key={t.name}
                  onClick={() => setTeam(t.name)}
                  aria-pressed={team === t.name}
                >
                  <UserRound size={24} />
                  <div className="grow">
                    <h3>{t.name}</h3>
                    <p>{t.specialty}</p>
                    <p>Sample availability · {t.availability}</p>
                  </div>
                  <span className="radio-dot" />
                </button>
              ))}
            </div>
            {!teams.length && (
              <p className="muted">
                No sample provider lists this brand. You can still explore an
                inspection request.
              </p>
            )}
            <div className="button-row">
              <button
                className="btn primary"
                disabled={!team}
                onClick={() => {
                  const id = nextId("CB");
                  update((d) => ({
                    ...d,
                    callbacks: [
                      ...d.callbacks,
                      {
                        id,
                        applianceId,
                        issue,
                        channel,
                        team,
                        date: DEMO_DATE,
                      },
                    ],
                    activities: [
                      {
                        id: nextId("act"),
                        title: "Demo callback request recorded",
                        detail: appliance?.name + " · " + issue,
                        date: DEMO_DATE,
                      },
                      ...d.activities,
                    ],
                  }));
                  setReference(id);
                }}
              >
                Request demo callback
                <ArrowRight size={16} />
              </button>
              <Nav
                className="btn"
                to={
                  "/bookings/new?appliance=" +
                  applianceId +
                  "&service=Post-flood+inspection"
                }
              >
                Schedule inspection
              </Nav>
            </div>
            <Nav
              className="text-link"
              to={
                "/consultation?appliance=" +
                applianceId +
                "&topic=Post-flood+inspection+guidance&channel=" +
                encodeURIComponent(channel)
              }
            >
              Open simulated consultation
              <ArrowUpRight size={16} />
            </Nav>
          </div>
        </section>
        <aside className="stack">
          <section className="panel">
            <ShieldCheckIcon />
            <h2>Appliance support, with a clear next step.</h2>
            <p className="muted">
              Record the issue, prepare appliance details, and arrange qualified
              inspection support.
            </p>
            <p className="small muted">
              Sample availability is illustrative. Response times are not
              guaranteed.
            </p>
          </section>
          <Safety>
            Appliance support only. This is not an emergency rescue service.
          </Safety>
          <Safety>
            Do not handle electrical equipment in floodwater. Follow official
            local guidance.
          </Safety>
        </aside>
      </div>
    </div>
  );
}
function ShieldCheckIcon() {
  return (
    <div className="service-icon">
      <Phone size={25} />
    </div>
  );
}
