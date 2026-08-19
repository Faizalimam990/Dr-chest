import { DOCTOR } from "@/lib/content";

export interface AppointmentPayload {
  name: string;
  phone: string;
  clinic: string;
  concern: string;
  message: string;
}

/**
 * Opens the visitor's mail client (mailto:) with the appointment request
 * pre-filled. Frontend-only — no backend, no third-party service, no API key,
 * and no patient detail ever transits a server we don't control.
 */
export async function sendAppointmentRequest(data: AppointmentPayload): Promise<void> {
  const subject = `Appointment request — ${data.name} (${data.concern})`;
  const body = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Preferred clinic: ${data.clinic}`,
    `Reason for visit: ${data.concern}`,
    "",
    "Details:",
    data.message,
  ].join("\r\n");

  const url = `mailto:${DOCTOR.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Trigger the mail client without navigating the SPA away.
  window.location.href = url;
}
