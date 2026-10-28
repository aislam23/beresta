import { describe, it, expect, vi } from 'vitest';
import { validateLead, submitLead, LEAD_ERRORS } from '../../src/lib/leads';

const good = { kind: 'pick' as const, name: 'Анна', phone: '8 900 123-45-67', consent: true, budget: 'До 8 млн ₽', purchase: 'Семейная ипотека' };

describe('validateLead', () => {
  it('пустая форма даёт три ошибки', () => {
    const r = validateLead({ kind: 'pick' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toEqual({ name: LEAD_ERRORS.name, phone: LEAD_ERRORS.phone, consent: LEAD_ERRORS.consent });
  });
  it('имя короче двух символов после обрезки пробелов', () => {
    const r = validateLead({ ...good, name: '  А ' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toEqual(['name']);
  });
  it('имя длиннее 60 символов', () => {
    const r = validateLead({ ...good, name: 'А'.repeat(61) });
    expect(r.ok).toBe(false);
  });
  it('без согласия нельзя', () => {
    const r = validateLead({ ...good, consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.consent).toBe(LEAD_ERRORS.consent);
  });
  it('валидная заявка нормализуется', () => {
    const r = validateLead({ ...good, name: '  Анна  ' });
    expect(r).toEqual({ ok: true, lead: { kind: 'pick', name: 'Анна', phone: '+79001234567', budget: 'До 8 млн ₽', purchase: 'Семейная ипотека', flatType: undefined, consent: true } });
  });
  it('бронь несёт тип квартиры', () => {
    const r = validateLead({ kind: 'booking', name: 'Олег', phone: '+7 843 000-12-12', consent: true, flatType: 'penthouse' });
    expect(r.ok && r.lead.flatType).toBe('penthouse');
  });
});

describe('submitLead', () => {
  it('демо-отправка возвращает ok', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const r = validateLead(good);
    if (!r.ok) throw new Error('fixture');
    await expect(submitLead(r.lead, 0)).resolves.toEqual({ ok: true });
    expect(info).toHaveBeenCalledOnce();
  });
});
