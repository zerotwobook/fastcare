import { useState } from "react";
import {
  Camera,
  CameraOff,
  ClipboardList,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  UserRound,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Appliance } from "./data";
import type { Consultation } from "./careData";
import { Badge } from "./components";
import { ConsultationDetails } from "./consultationDetails";
import { useConversationLayout } from "./useConversationLayout";

export function ConsultationCall({
  session,
  appliance,
  phase,
  timer,
  muted,
  speaker,
  camera,
  onMute,
  onSpeaker,
  onCamera,
  onEnd,
}: {
  session: Consultation;
  appliance: Appliance;
  phase: string;
  timer: string;
  muted: boolean;
  speaker: boolean;
  camera: boolean;
  onMute: () => void;
  onSpeaker: () => void;
  onCamera: () => void;
  onEnd: () => void;
}) {
  useConversationLayout("call");
  const [details, setDetails] = useState(false);
  const video = session.channel === "Video call";
  return (
    <section
      className="chat-room call-room consultation-session"
      aria-label={video ? "Video consultation" : "Voice consultation"}
    >
      <header className="chat-room-header">
        <span className="chat-team-icon">
          {video ? <Video size={21} /> : <Phone size={21} />}
        </span>
        <div className="chat-room-heading">
          <h1>
            {video
              ? "Simulated video consultation"
              : "Simulated voice consultation"}
          </h1>
          <p>{session.team}</p>
        </div>
        <button
          className="btn chat-details-button"
          onClick={() => setDetails(true)}
          aria-haspopup="dialog"
        >
          <ClipboardList size={17} />
          <span>Details</span>
        </button>
      </header>
      <div className="chat-context">
        <span>{appliance.name}</span>
        <span>{appliance.brand}</span>
      </div>
      <div className="call-stage">
        <span className="call-timer" aria-label="Demo call timer">
          {timer}
        </span>
        <div className="technician-placeholder">
          <UserRound size={64} />
          <h2>{session.team}</h2>
          <Badge>
            {phase === "connecting"
              ? "Simulated connecting state"
              : "Simulation running"}
          </Badge>
          <p>No technician connected</p>
        </div>
        {video && (
          <div className="user-video-placeholder">
            {camera ? <UserRound size={30} /> : <CameraOff size={30} />}
            <span>{camera ? "Your sample preview" : "Camera preview off"}</span>
            <small>Placeholder only</small>
          </div>
        )}
      </div>
      <div className="call-controls">
        <button className="btn" aria-pressed={muted} onClick={onMute}>
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
          <span>{muted ? "Unmute demo" : "Mute demo"}</span>
        </button>
        {video ? (
          <button className="btn" aria-pressed={camera} onClick={onCamera}>
            {camera ? <Camera size={20} /> : <CameraOff size={20} />}
            <span>{camera ? "Turn camera off" : "Turn camera on"}</span>
          </button>
        ) : (
          <button className="btn" aria-pressed={speaker} onClick={onSpeaker}>
            {speaker ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{speaker ? "Speaker on" : "Speaker off"}</span>
          </button>
        )}
        <button className="btn primary" onClick={onEnd}>
          <PhoneOff size={20} />
          <span>End demo call</span>
        </button>
      </div>
      <p className="call-disclaimer">
        Simulation only · No microphone or camera is used.
      </p>
      {details && (
        <ConsultationDetails
          session={session}
          appliance={appliance}
          onClose={() => setDetails(false)}
          onEnd={onEnd}
        />
      )}
    </section>
  );
}
