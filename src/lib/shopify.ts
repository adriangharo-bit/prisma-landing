import { ShopifyCustomer } from "./types";

const API_VERSION = "2024-01";

function baseUrl(): string {
  const store = process.env.SHOPIFY_STORE;
  if (!store) throw new Error("SHOPIFY_STORE is not configured");
  return `https://${store}/admin/api/${API_VERSION}`;
}

function headers(): HeadersInit {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) throw new Error("SHOPIFY_ADMIN_TOKEN is not configured");
  return {
    "X-Shopify-Access-Token": token,
    "Content-Type": "application/json",
  };
}

export function buildRegistrationNote(code: string, date = new Date()): string {
  const dateStr = date.toISOString().slice(0, 10);
  return `Sorteo PRISMA — código: ${code} — ${dateStr}`;
}

export function extractCodeFromNote(note: string | null): string {
  if (!note) return "";
  const match = note.match(/código:\s*([^\s—]+)/i);
  return match?.[1] ?? "";
}

export async function findCustomerByEmail(
  email: string
): Promise<ShopifyCustomer | null> {
  const url = `${baseUrl()}/customers/search.json?query=${encodeURIComponent(
    `email:${email}`
  )}&fields=id,email,tags,first_name,note,created_at`;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Shopify search failed: ${res.status}`);
  }
  const data = (await res.json()) as { customers: ShopifyCustomer[] };
  return data.customers[0] ?? null;
}

export async function createCustomer(params: {
  name: string;
  email: string;
  code: string;
}): Promise<ShopifyCustomer> {
  const res = await fetch(`${baseUrl()}/customers.json`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      customer: {
        first_name: params.name,
        email: params.email,
        tags: "prisma-sorteo",
        accepts_marketing: true,
        note: buildRegistrationNote(params.code),
        send_email_welcome: false,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify create customer failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { customer: ShopifyCustomer };
  return data.customer;
}

function mergeTags(existingTags: string, newTag: string): string {
  const tags = existingTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (!tags.includes(newTag)) tags.push(newTag);
  return tags.join(", ");
}

export async function addTagToCustomer(
  customer: ShopifyCustomer,
  newTag: string,
  note?: string
): Promise<ShopifyCustomer> {
  const res = await fetch(`${baseUrl()}/customers/${customer.id}.json`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      customer: {
        id: customer.id,
        tags: mergeTags(customer.tags ?? "", newTag),
        ...(note ? { note } : {}),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify update customer failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { customer: ShopifyCustomer };
  return data.customer;
}

export async function getAllRegistrants(): Promise<ShopifyCustomer[]> {
  const customers: ShopifyCustomer[] = [];
  let url: string | undefined = `${baseUrl()}/customers.json?tag=prisma-sorteo&limit=250`;

  while (url) {
    const res: Response = await fetch(url, { headers: headers() });
    if (!res.ok) {
      throw new Error(`Shopify list customers failed: ${res.status}`);
    }
    const data = (await res.json()) as { customers: ShopifyCustomer[] };
    customers.push(...data.customers);

    const linkHeader = res.headers.get("Link");
    const nextUrl = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    url = nextUrl;
  }

  return customers.filter((c) =>
    (c.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .includes("prisma-sorteo")
  );
}
