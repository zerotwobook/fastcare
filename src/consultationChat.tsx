import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  MessageSquare,
  Plus,
  Send,
  X,
} from "lucide-react";
import type { Appliance } from "./data";
import type { Consultation } from "./careData";
import { ConsultationDetails } from "./consultationDetails";
import { useConversationLayout } from "./useConversationLayout";

export function ConsultationChat({
  session,
  appliance,
  questions,
  onSend,
  onEnd,
}: {
  session: Consultation;
  appliance: Appliance;
  questions: string[];
  onSend: (text: string) => void;
  onEnd: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [details, setDetails] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [showLatest, setShowLatest] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLButtonElement>(null);
  const capture =
    new URLSearchParams(window.location.search).get("capture") === "1";
  const scrollToLatest = (smooth = false) => {
    const el = messagesRef.current;
    if (el)
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth && !capture ? "smooth" : "instant",
      });
    setShowLatest(false);
  };

  useConversationLayout("chat");

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToLatest());
    return () => cancelAnimationFrame(frame);
  }, [session.id, session.messages.length]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "0px";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  }, [draft]);

  useEffect(() => {
    if (!suggestions) return;
    const close = (event: PointerEvent) => {
      if (!suggestionsRef.current?.contains(event.target as Node))
        setSuggestions(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSuggestions(false);
        inputRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [suggestions]);

  const send = (text: string) => {
    if (!text.trim()) return;
    onSend(text);
    setDraft("");
    setSuggestions(false);
    inputRef.current?.focus({ preventScroll: true });
  };
  return (
    <section className="chat-room" aria-label="Technician chat">
      <header className="chat-room-header">
        <span className="chat-team-icon">
          <MessageSquare size={21} />
        </span>
        <div className="chat-room-heading">
          <h1>{session.team}</h1>
          <p>Demo chat · No technician connected</p>
        </div>
        <button
          className="btn chat-details-button"
          onClick={() => {
            setSuggestions(false);
            inputRef.current?.blur();
            setDetails(true);
          }}
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
      <div className="chat-timeline">
        <div
          ref={messagesRef}
          className="chat-messages-scroll"
          role="log"
          aria-label="Conversation messages"
          aria-live="polite"
          aria-relevant="additions text"
          tabIndex={0}
          onScroll={() => {
            const el = messagesRef.current;
            if (el)
              setShowLatest(
                el.scrollHeight - el.scrollTop - el.clientHeight > 100,
              );
          }}
        >
          <p className="chat-start-note">This is a simulated conversation.</p>
          {session.messages.map((message, index) => (
            <div
              key={index}
              className={
                "chat-message " +
                (message.role === "user" ? "from-user" : "from-technician")
              }
            >
              <span className="chat-message-author">
                {message.role === "user" ? "You" : "Demo technician"}
              </span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        {showLatest && (
          <button
            ref={latestRef}
            className="chat-jump-latest"
            onClick={() => {
              scrollToLatest(true);
              messagesRef.current?.focus({ preventScroll: true });
            }}
          >
            <ArrowDown size={15} />
            Latest messages
          </button>
        )}
      </div>
      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <div className="chat-suggestions-wrap" ref={suggestionsRef}>
          <button
            type="button"
            className="icon-button chat-suggestions-trigger"
            aria-label="Suggested questions"
            aria-expanded={suggestions}
            aria-controls="chat-suggested-questions"
            onClick={() => setSuggestions(!suggestions)}
          >
            {suggestions ? <X size={21} /> : <Plus size={21} />}
          </button>
          {suggestions && (
            <div
              id="chat-suggested-questions"
              className="chat-suggestions-popover"
            >
              <div>
                <strong>Suggested questions</strong>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Close suggested questions"
                  onClick={() => setSuggestions(false)}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              {questions.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => send(question)}
                >
                  {question}
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          )}
        </div>
        <textarea
          ref={inputRef}
          rows={1}
          aria-label="Consultation message"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => setSuggestions(false)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              send(draft);
            }
          }}
        />
        <button
          type="submit"
          className="btn primary chat-send"
          aria-label="Send"
          disabled={!draft.trim()}
        >
          <Send size={19} />
          <span>Send</span>
        </button>
      </form>
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
