'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, CircleAlert, Linkedin, LoaderCircle, Mail, Send } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { ResumePdfLink } from '@/components/resume/ResumeDocument';
import styles from './ContactPanel.module.css';

type FormValues = { name: string; email: string; message: string };
type Feedback = { state: 'idle' | 'sending' | 'success' | 'error'; message?: string };
type ContactResponse = { success?: boolean; message?: string; error?: string };
const emptyForm: FormValues = { name: '', email: '', message: '' };

export function ContactPanel() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [feedback, setFeedback] = useState<Feedback>({ state: 'idle' });
  const requestRef = useRef<AbortController | null>(null);
  const id = useId();
  const sending = feedback.state === 'sending';

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    []
  );

  function updateField(field: keyof FormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (feedback.state !== 'sending') setFeedback({ state: 'idle' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestRef.current) return;
    const payload = { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };
    if (!payload.name || !payload.email || !payload.message) {
      setFeedback({ state: 'error', message: 'Complétez votre nom, votre e-mail et votre message avant l’envoi.' });
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setFeedback({ state: 'sending' });
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result: ContactResponse | null = await response.json().catch(() => null);
      if (requestRef.current !== controller) return;

      if (!response.ok || result?.success !== true) {
        setFeedback({
          state: 'error',
          message: typeof result?.error === 'string' ? result.error : 'Le message n’a pas pu être envoyé. Réessayez ou contactez-moi directement par e-mail.',
        });
        return;
      }

      setValues(emptyForm);
      setFeedback({ state: 'success', message: typeof result.message === 'string' ? result.message : 'Votre message a bien été envoyé. Merci, je vous répondrai par e-mail.' });
    } catch {
      if (requestRef.current !== controller) return;
      setFeedback({
        state: 'error',
        message: controller.signal.aborted
          ? 'Le serveur met trop de temps à répondre. L’envoi n’a pas pu être confirmé ; vous pouvez me contacter directement par e-mail.'
          : 'Connexion interrompue. Votre message est conservé : vérifiez votre connexion puis réessayez.',
      });
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  return (
    <article className={styles.panel}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contact · {profile.location}</p>
          <h2>On en parle ?</h2>
        </div>
        <span className={styles.stamp} aria-hidden="true">
          <Mail size={25} strokeWidth={2.5} />
        </span>
      </header>
      <p className={styles.intro}>Un projet web, une idée à développer ou simplement envie d’échanger ? Ma boîte de réception est ouverte.</p>

      <form className={styles.composer} onSubmit={handleSubmit} aria-label="Envoyer un message à Ryan" aria-busy={sending}>
        <div className={styles.recipient}>
          <span>À</span>
          <a href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <fieldset className={styles.fields} disabled={sending}>
          <legend className={styles.visuallyHidden}>Votre message — tous les champs sont obligatoires</legend>
          <div className={styles.identity}>
            <div className={styles.field}>
              <label htmlFor={`${id}-name`}>Votre nom</label>
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nom et prénom"
                required
                maxLength={100}
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`}>Votre e-mail</label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
                required
                maxLength={254}
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-message`}>Votre message</label>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={5}
              placeholder="Parlez-moi de votre projet, de vos besoins ou de votre idée…"
              required
              maxLength={5000}
              value={values.message}
              onChange={(event) => updateField('message', event.target.value)}
            />
          </div>
          <div className={styles.footer}>
            <span className={styles.required}>Tous les champs sont obligatoires.</span>
            <button className={styles.submit} type="submit">
              {sending ? <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
              {sending ? 'Envoi en cours…' : 'Envoyer le message'}
            </button>
          </div>
        </fieldset>
        {feedback.state === 'sending' && (
          <p className={styles.visuallyHidden} role="status">
            Envoi du message en cours.
          </p>
        )}
        {(feedback.state === 'success' || feedback.state === 'error') && (
          <div className={styles.feedback} data-state={feedback.state} role={feedback.state === 'error' ? 'alert' : 'status'}>
            {feedback.state === 'success' ? <Check size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
            <p>{feedback.message}</p>
          </div>
        )}
      </form>

      <footer className={styles.alternatives}>
        <span>Pour continuer la conversation</span>
        <div className={styles.links}>
          <a href={`mailto:${profile.email}`}>
            <Mail size={15} aria-hidden="true" />
            E-mail direct
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={15} aria-hidden="true" />
            LinkedIn
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <ResumePdfLink className={styles.resume} />
        </div>
      </footer>
    </article>
  );
}
