import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, message } = (await request.json()) as {
      to?: string;
      message?: string;
    };

    if (!to || !message) {
      return NextResponse.json(
        { error: "to болон message шаардлагатай" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;

    if (!accountSid || !authToken || !from) {
      return NextResponse.json(
        { error: "Twilio тохиргоо дутуу байна" },
        { status: 500 }
      );
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams();
    body.set("To", to);
    body.set("From", from);
    body.set("Body", message);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Twilio алдаа: ${errText}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, sid: data.sid });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Тодорхойгүй алдаа" },
      { status: 500 }
    );
  }
}
