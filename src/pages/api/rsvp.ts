import { env } from "cloudflare:workers";
import { z } from "zod";

const isDev = import.meta.env.DEV;

const turnstileTokenSchema = isDev
  ? z.string().optional()
  : z.string().trim().min(1, "Turnstile token is required.");

const formSchema = z.object({
  "invite-id": z.string().trim().min(1, "Invite id is required."),
  "cf-turnstile-response": turnstileTokenSchema,
  message: z.string().trim().min(1, "Message is required."),
  phone: z.string().trim().optional().transform((value) => value ?? ""),
});

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function POST({ request }: { request: Request }) {
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const formData = await request.formData();
  const entries = Object.fromEntries(formData);
  const parsed = formSchema.safeParse(entries);

  if (!parsed.success) {
    console.error("[api/rsvp]: parse error", { error: parsed.error });
    if (wantsJson) {
      return jsonResponse({ ok: false, error: "Invalid form data." }, 400);
    }

    return new Response("Invalid form data.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const {
    message,
    phone,
    "invite-id": inviteId,
    "cf-turnstile-response": turnstileToken,
  } = parsed.data;

  if (!isDev) {
    if (!env.TURNSTILE_SECRET_KEY) {
      console.error("[api/rsvp]: missing Turnstile secret key");
      if (wantsJson) {
        return jsonResponse(
          { ok: false, error: "Turnstile not configured." },
          500,
        );
      }
      return new Response("Turnstile not configured.", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    try {
      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: turnstileToken ?? "",
          }),
        },
      );
      const verifyPayload = await verifyResponse.json();

      if (!verifyPayload?.success) {
        console.error("[api/rsvp]: turnstile failed", {
          inviteId,
          response: verifyPayload,
        });
        if (wantsJson) {
          return jsonResponse({ ok: false, error: "Turnstile failed." }, 400);
        }
        return new Response("Turnstile failed.", {
          status: 400,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    } catch (error) {
      console.error("[api/rsvp]: turnstile verify error", { inviteId, error });
      if (wantsJson) {
        return jsonResponse({ ok: false, error: "Turnstile failed." }, 500);
      }
      return new Response("Turnstile failed.", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  }

  try {
    await env.DB.prepare(
      "insert into rsvp_submissions (invite_id, message, phone) values (?, ?, ?)",
    )
      .bind(inviteId, message, phone)
      .run();
  } catch (error) {
    console.error("[api/rsvp]: insert error", { inviteId, error });

    if (wantsJson) {
      return jsonResponse({ ok: false, error: "Failed to save RSVP." }, 500);
    }

    return new Response("Failed to save RSVP.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  console.info("[api/rsvp]: sent", { inviteId, phone, userMessage: message });

  if (wantsJson) {
    return jsonResponse({ ok: true });
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return Response.redirect(referer, 303);
  }

  return new Response("Děkujeme.", {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
