import { validateLead, submitLead, type LeadErrors, type LeadField, type LeadInput } from './leads';

const FIELDS: LeadField[] = ['name', 'phone', 'consent'];

function parts(form: HTMLFormElement) {
  const box = form.closest<HTMLElement>('[data-lead-box]');
  const success = box?.querySelector<HTMLElement>('[data-lead-success]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!box || !success || !submit) throw new Error('Форма заявки собрана без data-lead-box / data-lead-success / submit');
  return { box, success, submit };
}

function showErrors(form: HTMLFormElement, errors: LeadErrors) {
  for (const field of FIELDS) {
    const input = form.elements.namedItem(field) as HTMLInputElement | null;
    const msg = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (!input || !msg) continue;
    const text = errors[field];
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    msg.textContent = text ?? '';
    msg.hidden = !text;
  }
}

/**
 * Поколение формы: resetLeadForm увеличивает его, и отправка, начатая до сброса,
 * после ответа ничего не трогает (Esc во время «Отправляем…» и открытие другой квартиры).
 */
const generation = new WeakMap<HTMLFormElement, number>();
const labels = new WeakMap<HTMLFormElement, string>();

function restoreSubmit(form: HTMLFormElement, submit: HTMLButtonElement) {
  submit.disabled = false;
  submit.textContent = labels.get(form) ?? submit.textContent;
}

/** Подключает валидацию и демо-отправку к форме с data-kind="pick" | "booking". */
export function initLeadForm(form: HTMLFormElement, extra: () => Partial<LeadInput> = () => ({})) {
  const { success, submit } = parts(form);
  const kind = form.dataset.kind as LeadInput['kind'];
  labels.set(form, submit.textContent ?? '');
  generation.set(form, 0);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const data = new FormData(form);
    const result = validateLead({
      kind,
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      budget: data.get('budget')?.toString(),
      purchase: data.get('purchase')?.toString(),
      consent: data.get('consent') === 'on',
      ...extra(),
    });
    if (!result.ok) {
      showErrors(form, result.errors);
      const first = FIELDS.find((f) => result.errors[f]);
      (form.elements.namedItem(first!) as HTMLElement | null)?.focus();
      return;
    }
    showErrors(form, {});
    const gen = generation.get(form);
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    try {
      await submitLead(result.lead);
    } finally {
      // форму успели сбросить: кнопку уже восстановил resetLeadForm
      if (generation.get(form) === gen) restoreSubmit(form, submit);
    }
    if (generation.get(form) !== gen) return;
    form.hidden = true;
    success.hidden = false;
    success.querySelector<HTMLElement>('[data-lead-success-title]')?.focus();
  });
}

/** Возвращает форму в исходное состояние (для повторного открытия окна брони). */
export function resetLeadForm(form: HTMLFormElement) {
  const { success, submit } = parts(form);
  generation.set(form, (generation.get(form) ?? 0) + 1);
  restoreSubmit(form, submit);
  form.reset();
  showErrors(form, {});
  form.hidden = false;
  success.hidden = true;
}
