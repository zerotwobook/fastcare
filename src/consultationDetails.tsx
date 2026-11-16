import { ArrowRight } from "lucide-react";
import type { Appliance } from "./data";
import type { Consultation } from "./careData";
import { ApplianceArt, DetailLine, Modal, Nav, Safety } from "./components";

export function ConsultationDetails({
  session,
  appliance,
  onClose,
  onEnd,
}: {
  session: Consultation;
  appliance: Appliance;
  onClose: () => void;
  onEnd: () => void;
}) {
  const service = session.topic.toLowerCase().includes("flood")
    ? "Post-flood inspection"
    : "Appliance inspection";
  return (
    <Modal
      title="Conversation details"
      subtitle="Demo consultation · Sample data"
      className="chat-details-sheet"
      onClose={onClose}
    >
      <div className="chat-detail-appliance">
        <ApplianceArt category={appliance.category} />
        <div>
          <h3>{appliance.name}</h3>
          <p>
            {appliance.brand} · {appliance.room}
          </p>
        </div>
      </div>
      <DetailLine label="Topic">{session.topic}</DetailLine>
      <DetailLine label="Sample team">{session.team}</DetailLine>
      <h3 className="care-heading">Conversation summary</h3>
      <p className="muted">{session.summary}</p>
      <Safety>
        Do not power on flood-exposed appliances before professional inspection.
      </Safety>
      <div className="chat-detail-actions">
        <Nav
          className="btn primary full"
          to={
            "/bookings/new?appliance=" +
            session.applianceId +
            "&service=" +
            encodeURIComponent(service)
          }
        >
          Book an inspection
          <ArrowRight size={16} />
        </Nav>
        <Nav className="btn full" to={"/appliances/" + session.applianceId}>
          View appliance details
        </Nav>
        <button
          className="text-link"
          onClick={() => {
            onClose();
            onEnd();
          }}
        >
          {session.channel === "Chat" ? "End demo chat" : "End demo call"}
        </button>
      </div>
    </Modal>
  );
}
