import { normalizePhone } from './phone';

export type LeadKind = 'pick' | 'booking';
export type LeadField = 'name' | 'phone' | 'consent';
export type LeadErrors = Partial<Record<LeadField, string>>;

export interface Lead {
  kind: LeadKind;
  name: string;
  /** +7XXXXXXXXXX */
  phone: string;
  budget?: string;
  purchase?: string;
  flatType?: string;
  consent: true;
}

export interface LeadInput {
  kind: LeadKind;
  name?: string;
  phone?: string;
  budget?: string;
  purchase?: string;
  flatType?: string;
  consent?: boolean;
}

export const LEAD_ERRORS = {
  name: 'Напишите, как к вам обращаться',
  phone: 'Проверьте номер телефона',
  consent: 'Нужно согласие на обработку данных',
} as const;

export function validateLead(input: LeadInput): { ok: true; lead: Lead } | { ok: false; errors: LeadErrors } {
  const errors: LeadErrors = {};
  const name = (input.name ?? '').trim();
  if (name.length < 2 || name.length > 60) errors.name = LEAD_ERRORS.name;
  const phone = normalizePhone(input.phone ?? '');
  if (!phone) errors.phone = LEAD_ERRORS.phone;
  if (input.consent !== true) errors.consent = LEAD_ERRORS.consent;
  if (!phone || Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    lead: { kind: input.kind, name, phone, budget: input.budget, purchase: input.purchase, flatType: input.flatType, consent: true },
  };
}

/**
 * Единственная точка отправки заявок. Сейчас это демо: данные никуда не уходят.
 * Когда появится CRM, меняется только тело этой функции.
 */
export async function submitLead(lead: Lead, delayMs = 600): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  console.info('[demo] заявка не отправлена, сайт учебный', lead);
  return { ok: true };
}
