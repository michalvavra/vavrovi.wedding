import { env } from "cloudflare:workers";
import { parsePhoneNumber } from "awesome-phonenumber";
import { z } from "zod";

const formSchema = z.object({
  "invite-id": z.string().trim().min(1, "Invite id is required."),
  message: z.string().trim().min(1, "Message is required."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .transform((value, ctx) => {
      const phoneNumber = parsePhoneNumber(value, { regionCode: "CZ" });

      if (!phoneNumber.valid) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid phone number.",
        });
        return z.NEVER;
      }

      return phoneNumber.number.e164;
    }),
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

  const { message, phone, "invite-id": inviteId } = parsed.data;

  try {
    await env.DB.prepare(
      "insert into rsvp_submissions (invite_id, message, phone) values (?, ?, ?)",
    )
      .bind(inviteId, message, phone)
      .run();
  } catch (error) {
    console.error("[api/rsvp]: insert error", {inviteId, error});

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
