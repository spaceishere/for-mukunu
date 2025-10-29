import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = (await request.json()) as {
      to?: string;
      subject?: string;
      text?: string;
      html?: string;
    };

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: "to, subject болон (text эсвэл html)-ийн аль нэг нь шаардлагатай" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!user || !pass) {
      return NextResponse.json(
        { error: "SMTP_USER болон SMTP_PASS дутуу байна (Gmail бол App Password хэрэгтэй)" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    return NextResponse.json({ success: true, id: info.messageId });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Тодорхойгүй алдаа" },
      { status: 500 }
    );
  }
}
