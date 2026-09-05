import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const deliveryError = 'Le message n’a pas pu être envoyé. Réessayez dans quelques instants ou contactez-moi directement par e-mail.';
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function POST(request: Request) {
  let body: ContactRequestBody | null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Le formulaire reçu est invalide.' }, { status: 400 });
  }

  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Veuillez compléter votre nom, votre e-mail et votre message.' }, { status: 400 });
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Veuillez compléter votre nom, votre e-mail et votre message.' }, { status: 400 });
  }
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return NextResponse.json({ error: 'Le formulaire est trop long : 100 caractères pour le nom et 5 000 pour le message au maximum.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Saisissez une adresse e-mail valide pour que je puisse vous répondre.' }, { status: 400 });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: deliveryError }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'contact@ryan-choukri.fr',
      to: 'ryanchourkri@gmail.com',
      replyTo: email,
      subject: `Nouveau message de ${name.replace(/[\r\n]/g, ' ')}`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: deliveryError }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Votre message a bien été envoyé. Merci, je vous répondrai par e-mail.' }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: deliveryError }, { status: 500 });
  }
}
