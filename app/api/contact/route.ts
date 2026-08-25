import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactRequestBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody;
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      //   if (process.env.NODE_ENV !== 'production') {
      //     console.warn('RESEND_API_KEY is missing. Skipping email send in development.', {
      //       name,
      //       email,
      //       message,
      //     });
      //     return NextResponse.json({ success: true, devFallback: true }, { status: 200 });
      //   }

      return NextResponse.json({ error: 'Missing RESEND_API_KEY v2 ' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ryanchourkri@gmail.com',
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
