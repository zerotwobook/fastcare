import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  PanelsTopLeft,
  ClipboardCheck,
  Wrench,
  LifeBuoy,
  FolderClosed,
  Settings,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  RotateCcw,
  House,
  ShieldCheck,
  Camera,
  Check,
  MessageSquare,
  CalendarClock,
} from "lucide-react";
import { Nav, ApplianceForm, Modal } from "./components";
import { useStore } from "./store";
import { ProtectionPlans, MyProtection } from "./protection";
import { Consultation, UrgentSupport } from "./consultation";
import { Maintenance } from "./maintenance";
import { Appointments } from "./home";
import { useMobileViewport } from "./useMobileViewport";
import {
  Overview,
  Appliances,
  ApplianceDetails,
  Preparation,
  BookingNew,
  BookingDetails,
  Recovery,
  ReportDamage,
  RecoveryDetails,
  Documents,
  NotFound,
} from "./pages";
const links = [
  { to: "/overview", label: "Home", icon: LayoutDashboard },
  { to: "/appliances", label: "My Appliances", icon: PanelsTopLeft },
  { to: "/protection", label: "Protection Plans", icon: ShieldCheck },
  { to: "/consultation", label: "Talk to a technician", icon: MessageSquare },
  { to: "/bookings", label: "Appointments", icon: Wrench },
  { to: "/maintenance", label: "Maintenance", icon: CalendarClock },
  { to: "/preparation", label: "Flood Preparation", icon: ClipboardCheck },
  { to: "/recovery", label: "Recovery Center", icon: LifeBuoy },
  { to: "/documents", label: "Documents", icon: FolderClosed },
];
export default function App() {
  useMobileViewport();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, message, reset, toast } = useStore();
  const params = new URLSearchParams(location.search);
  const flood = params.get("mode") === "flood";
  const capture = params.get("capture") === "1";
  const [add, setAdd] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setReady(true));
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    setDrawer(false);
    setNotifications(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = document.querySelector<HTMLElement>(
      "#main-navigation .drawer-close",
    );
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
      if (event.key !== "Tab") return;
      const items = [
        ...document.querySelectorAll<HTMLElement>(
          "#main-navigation a, #main-navigation button",
        ),
      ].filter((el) => el.getClientRects().length > 0);
      const firstItem = items[0],
        lastItem = items.at(-1);
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [drawer]);
  useEffect(() => {
    document.documentElement.dataset.capture = capture ? "true" : "false";
    document.title =
      "Fastcare · " +
      (links.find((l) => location.pathname.startsWith(l.to))?.label ||
        "Your home, under control.");
  }, [capture, location.pathname]);
  const setMode = (mode: string) => {
    const q = new URLSearchParams(location.search);
    q.set("mode", mode);
    navigate(location.pathname + "?" + q.toString());
  };
  const page =
    links.find((l) => location.pathname.startsWith(l.to))?.label ||
    (location.pathname.startsWith("/bookings") ? "Service visit" : "Overview");
  return (
    <div
      className={"app " + (capture ? "capture" : "")}
      data-fonts-ready={ready}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {drawer && (
        <button
          className="drawer-backdrop"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside
        id="main-navigation"
        className={"sidebar sidebar-expanded " + (drawer ? "open" : "")}
        role={drawer ? "dialog" : undefined}
        aria-modal={drawer ? true : undefined}
        aria-label="Navigation menu"
      >
        <button
          className="icon-button drawer-close"
          aria-label="Close menu"
          onClick={() => setDrawer(false)}
        >
          <X size={21} />
        </button>
        <Nav to="/overview" className="brand" onClick={() => setDrawer(false)}>
          <img
            className="fastcare-mark"
            src="/brand/fastcare-icon.svg"
            width="34"
            height="34"
            alt=""
          />
          <span className="fastcare-wordmark">Fastcare</span>
        </Nav>
        <p className="nav-caption">MY HOME</p>
        <nav aria-label="Main navigation">
          {links.map((l, index) => {
            const I = l.icon;
            const active =
              location.pathname === l.to ||
              (l.to !== "/overview" && location.pathname.startsWith(l.to));
            return (
              <div key={l.to}>
                {index === 2 && <p className="nav-caption">CARE & SERVICES</p>}
                {index === 6 && (
                  <p className="nav-caption">FLOOD & DOCUMENTS</p>
                )}
                <Nav
                  to={l.to}
                  className={"nav-item " + (active ? "active" : "")}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setDrawer(false)}
                >
                  <I size={18} />
                  <span>{l.label}</span>
                  {l.to === "/recovery" && data.cases.length > 0 && (
                    <span className="nav-count">{data.cases.length}</span>
                  )}
                </Nav>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <ShieldCheck size={21} />
            <h3>Care beyond the everyday.</h3>
            <p>A little preparation makes the next step clearer.</p>
            <Nav to="/preparation?mode=flood">
              Build your plan
              <ArrowUpRight size={14} />
            </Nav>
          </div>
          <button
            className="nav-item"
            onClick={() => {
              setDrawer(false);
              setModal("settings");
            }}
          >
            <Settings size={18} />
            Settings
          </button>
          <button
            className="demo-profile"
            onClick={() => {
              setDrawer(false);
              setModal("profile");
            }}
          >
            <span className="avatar">DU</span>
            <span>
              Demo User<small>Demo profile</small>
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={drawer}
              aria-controls="main-navigation"
              onClick={() => setDrawer(true)}
            >
              <Menu size={20} />
            </button>
            <Nav
              to="/overview"
              className="breadcrumb-home"
              aria-label="Go to home"
            >
              <House size={16} />
            </Nav>
            <span className="breadcrumb-divider">/</span>
            <span className="desktop-page-label">{page}</span>
            <span className="mobile-page-label">
              {location.pathname === "/overview"
                ? "Fastcare"
                : location.pathname === "/bookings/new"
                  ? "Book a visit"
                  : location.pathname === "/protection/my-plans"
                    ? "My protection"
                    : location.pathname === "/consultation/urgent"
                      ? "Urgent support"
                      : location.pathname.startsWith("/consultation")
                        ? "Consultation"
                        : location.pathname.startsWith("/recovery")
                          ? "Recovery"
                          : location.pathname.startsWith("/preparation")
                            ? "Flood plan"
                            : location.pathname.startsWith("/appliances")
                              ? "Appliances"
                              : location.pathname.startsWith("/protection")
                                ? "Protection"
                                : page}
            </span>
            <span className="prototype-label">
              Interactive prototype · Sample data
            </span>
          </div>
          <div className="topbar-right">
            <button
              className="mobile-mode-button"
              aria-label="Change home mode"
              aria-haspopup="dialog"
              onClick={() => setModal("mode")}
            >
              {flood ? <ShieldCheck size={16} /> : <House size={16} />}
              <span>{flood ? "Flood" : "Normal"}</span>
              <ChevronDown size={13} />
            </button>
            <div className="mode-switch" aria-label="Home mode">
              <button
                className={!flood ? "selected" : ""}
                onClick={() => setMode("normal")}
                aria-pressed={!flood}
              >
                <House size={14} />
                <span>Normal Mode</span>
              </button>
              <button
                className={flood ? "selected" : ""}
                onClick={() => setMode("flood")}
                aria-pressed={flood}
              >
                <ShieldCheck size={14} />
                <span>Flood Mode</span>
              </button>
            </div>
            <div className="topbar-separator" />
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={notifications}
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <i />
              </button>
              {notifications && (
                <div className="notification-panel">
                  <h3>Your home updates</h3>
                  {data.activities.slice(0, 3).map((a) => (
                    <div key={a.id}>
                      <strong>{a.title}</strong>
                      <p>{a.detail}</p>
                    </div>
                  ))}
                  <p className="small muted">
                    Sample notifications · No live alerts
                  </p>
                </div>
              )}
            </div>
            <button
              className="top-avatar avatar"
              aria-label="Demo User profile"
              onClick={() => setModal("profile")}
            >
              DU
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={"/overview" + location.search} replace />}
            />
            <Route
              path="/overview"
              element={<Overview flood={flood} onAdd={() => setAdd(true)} />}
            />
            <Route
              path="/appliances"
              element={<Appliances onAdd={() => setAdd(true)} />}
            />
            <Route path="/appliances/:id" element={<ApplianceDetails />} />
            <Route path="/protection" element={<ProtectionPlans />} />
            <Route path="/protection/my-plans" element={<MyProtection />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/consultation/urgent" element={<UrgentSupport />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/bookings" element={<Appointments />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/bookings/new" element={<BookingNew />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/recovery/new" element={<ReportDamage />} />
            <Route path="/recovery/:id" element={<RecoveryDetails />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <footer className="footer">
            <span>
              <span className="tiny-dot" />
              Interactive prototype · Sample data
            </span>
            <button className="text-link" onClick={() => setModal("settings")}>
              Demo settings
            </button>
          </footer>
        </main>
        {!capture && (
          <div className="presenter-controls">
            <button
              onClick={() => {
                const q = new URLSearchParams(location.search);
                q.set("capture", "1");
                navigate(location.pathname + "?" + q.toString());
              }}
            >
              <Camera size={14} />
              Capture mode
            </button>
            <span />
            <button onClick={() => setModal("reset")}>
              <RotateCcw size={14} />
              Reset demo
            </button>
          </div>
        )}
      </div>
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        {[
          { to: "/overview", label: "Home", icon: House },
          { to: "/appliances", label: "Appliances", icon: PanelsTopLeft },
          { to: "/bookings/new", label: "Book", icon: Wrench },
          { to: "/consultation", label: "Talk", icon: MessageSquare },
          { to: "/maintenance", label: "Care", icon: CalendarClock },
        ].map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.to ||
            (item.to !== "/overview" && location.pathname.startsWith(item.to));
          return (
            <Nav
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </Nav>
          );
        })}
      </nav>
      {message && !capture && (
        <div className="toast" role="status">
          <Check size={18} />
          {message}
          <button aria-label="Dismiss notification" onClick={() => toast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {add && <ApplianceForm onClose={() => setAdd(false)} />}{" "}
      {modal === "mode" && (
        <Modal
          title="Choose a mode"
          subtitle="Switch views without changing your saved records."
          onClose={() => setModal("")}
        >
          <div className="mode-options">
            <button
              aria-pressed={!flood}
              onClick={() => {
                setMode("normal");
                setModal("");
              }}
            >
              <House size={24} />
              <span>
                <strong>Normal Mode</strong>
                <small>Appliances, protection, and everyday care</small>
              </span>
              {!flood && <Check size={19} />}
            </button>
            <button
              aria-pressed={flood}
              onClick={() => {
                setMode("flood");
                setModal("");
              }}
            >
              <ShieldCheck size={24} />
              <span>
                <strong>Flood Mode</strong>
                <small>Preparation, inspection, and recovery</small>
              </span>
              {flood && <Check size={19} />}
            </button>
          </div>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal
          title="Start with a fresh demo?"
          subtitle="Restore the original sample data."
          onClose={() => setModal("")}
        >
          <p className="muted">
            All sample records, plan selections, consultations, maintenance
            packages, moving priorities, and local photo previews will be reset.
          </p>
          <div className="modal-actions">
            <button className="btn" onClick={() => setModal("")}>
              Keep my changes
            </button>
            <button
              className="btn primary"
              onClick={() => {
                reset();
                setModal("");
                navigate("/overview?mode=normal");
              }}
            >
              Reset demo
              <RotateCcw size={16} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "settings" && (
        <Modal
          title="Demo settings"
          subtitle="Your local presentation workspace"
          onClose={() => setModal("")}
        >
          <div className="setting-line">
            <span>Reference date</span>
            <strong>15 November 2026</strong>
          </div>
          <div className="setting-line">
            <span>Storage</span>
            <strong>This browser only</strong>
          </div>
          <div className="setting-line">
            <span>Appearance</span>
            <strong>Monochrome · Inter</strong>
          </div>
          <p className="muted">
            All information is illustrative. No external services are connected.
          </p>
          <div className="button-row">
            <button className="btn" onClick={() => setModal("reset")}>
              Reset demo data
              <RotateCcw size={15} />
            </button>
            <button
              className="btn primary"
              onClick={() => {
                setModal("");
                const q = new URLSearchParams(location.search);
                q.set("capture", capture ? "0" : "1");
                navigate(location.pathname + "?" + q.toString());
              }}
            >
              {capture ? "Exit" : "Enter"} capture mode
              <Camera size={15} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "profile" && (
        <Modal
          title="Demo User"
          subtitle="Personal workspace · Interactive prototype"
          onClose={() => setModal("")}
        >
          <div className="profile-demo">
            <span className="avatar">DU</span>
            <h3>A home for all your appliance care.</h3>
            <p className="muted">
              This sample profile is ready to explore. No sign-in or personal
              information is needed.
            </p>
            <div className="setting-line">
              <span>Home inventory</span>
              <strong>{data.appliances.length} appliances</strong>
            </div>
            <div className="setting-line">
              <span>Workspace</span>
              <strong>Demo home</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
