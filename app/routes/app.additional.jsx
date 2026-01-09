import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // TODO: Hämta från DB per shop (Prisma)
  // Exempel:
  // const settings = await db.shopSettings.findUnique({ where: { shop: session.shop } })
  // return { shop: session.shop, settings: settings ?? { ...defaults } }

  return {
    shop: session.shop,
    settings: {
      widgetEnabled: true,
      placement: "cart",
      confirmationEmail: "",
    },
  };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "save-settings") return { ok: false };

  const confirmationEmail = String(formData.get("confirmationEmail") || "").trim();
  const widgetEnabled = String(formData.get("widgetEnabled") || "false") === "true";
  const placement = String(formData.get("placement") || "cart");

  // Minimal validering (räcker för v1)
  if (!confirmationEmail) {
    return { ok: false, error: "Ange en e‑postadress för bekräftelsemail." };
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(confirmationEmail);
  if (!emailOk) {
    return { ok: false, error: "E‑postadressen ser inte ut att vara giltig." };
  }

  // TODO: Spara i DB kopplat till session.shop
  // await db.shopSettings.upsert({
  //   where: { shop: session.shop },
  //   update: { confirmationEmail, widgetEnabled, placement },
  //   create: { shop: session.shop, confirmationEmail, widgetEnabled, placement },
  // });

  return {
    ok: true,
    message: "Inställningarna sparades.",
    settings: { confirmationEmail, widgetEnabled, placement },
  };
};

export default function AdditionalPage() {
  const { shop, settings } = useLoaderData();
  const fetcher = useFetcher();

  const [widgetEnabled, setWidgetEnabled] = useState(settings.widgetEnabled);
  const [placement, setPlacement] = useState(settings.placement);
  const [confirmationEmail, setConfirmationEmail] = useState(settings.confirmationEmail);

  const isSaving = fetcher.state === "submitting" || fetcher.state === "loading";
  const error = fetcher.data?.ok === false ? fetcher.data?.error : null;
  const saved = fetcher.data?.ok === true;

  useEffect(() => {
    // När action returnerar nya settings, synca state
    if (fetcher.data?.settings) {
      setWidgetEnabled(fetcher.data.settings.widgetEnabled);
      setPlacement(fetcher.data.settings.placement);
      setConfirmationEmail(fetcher.data.settings.confirmationEmail);
    }
  }, [fetcher.data]);

  const save = () => {
    fetcher.submit(
      {
        intent: "save-settings",
        widgetEnabled: widgetEnabled ? "true" : "false",
        placement,
        confirmationEmail,
      },
      { method: "POST" },
    );
  };

  return (
    <s-page heading="Konsumentkollen – Inställningar">
      {/* ----------------------- Widget Status ----------------------- */}
      <s-section heading="Widget status">
        <s-card>
          <s-paragraph>
            Slå på/av Konsumentkollen-widgeten för din butik.
            <br />
            Om du stänger av widgeten behöver du även ta bort blocket i Theme
            Editor om du inte vill att den ska visas.
          </s-paragraph>

          <s-switch
            checked={widgetEnabled}
            onChange={(e) => {
              const next =
                e?.target?.checked ??
                e?.detail?.checked ??
                !widgetEnabled;
              setWidgetEnabled(Boolean(next));
            }}
          >
            Aktiv
          </s-switch>
        </s-card>
      </s-section>

      {/* ----------------------- Confirmation Email (replaces Scrive) ----------------------- */}
      <s-section heading="Bekräftelsemail">
        <s-card>
          <s-paragraph>
            Välj vilken e‑postadress som ska få bekräftelse när en kund har
            signerat avtalet via Konsumentkollen. Kunden får även sin egen
            bekräftelse.
          </s-paragraph>

          <s-text-field
            label="E‑postadress för bekräftelsemail"
            type="email"
            value={confirmationEmail}
            placeholder="t.ex. order@dinbutik.se"
            onInput={(e) => {
              const next = e?.target?.value ?? e?.detail?.value ?? "";
              setConfirmationEmail(String(next));
            }}
          ></s-text-field>

          {error && <s-badge tone="critical">{error}</s-badge>}
          {saved && <s-badge tone="success">Sparat</s-badge>}
        </s-card>
      </s-section>

      {/* ----------------------- Preview (ASIDE LAYOUT) ----------------------- */}
      <s-section slot="aside" heading="Förhandsvisning av widgeten">
        <s-card>
          <s-paragraph>
            Så här kan Konsumentkollen-widgeten se ut i din butik (exempel):
          </s-paragraph>

          <s-box
            padding="base"
            background="subdued"
            borderWidth="base"
            borderRadius="large"
          >
            <s-heading level="3">Konsumentkollen</s-heading>
            <s-paragraph>
              Skydda din identitet med bevakning och omedelbara larm.
            </s-paragraph>

            <s-button variant="primary" size="large">
              Bevaka
            </s-button>
          </s-box>
        </s-card>
      </s-section>

      {/* ----------------------- Info (ASIDE) ----------------------- */}
      <s-section slot="aside" heading="Info">
        <s-card>
          <s-paragraph>
            Dessa inställningar gäller för butiken{" "}
            <s-text emphasis>{shop}</s-text>.
          </s-paragraph>
          <s-paragraph>
            Utseende och exakt placering hanteras i Shopify Theme Editor.
          </s-paragraph>
        </s-card>
      </s-section>

      {/* ----------------------- Save Button ----------------------- */}
      <s-section>
        <s-button
          variant="primary"
          size="large"
          onClick={save}
          {...(isSaving ? { loading: true } : {})}
        >
          Spara inställningar
        </s-button>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);

