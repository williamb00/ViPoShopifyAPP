import { useLoaderData, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // TODO: Hämta detta från DB när vi kopplar klick-tracking
  const clickCount = 0;

  // TODO: Hämta detta från DB när vi kopplar "köp/signeringar" (Scrive/Make → din backend)
  const purchaseCount = 0;

  // TODO: Hämta senaste klick-tid från DB (t.ex. createdAt på senaste WidgetClick)
  // Sätt som ISO-sträng (new Date().toISOString()) eller null om inget finns
  const lastClickAt = null;

  // TODO: Hämta detta från dina settings per shop (confirmationEmail)
  const confirmationEmail = null;

  return {
    shop: session.shop,
    clickCount,
    purchaseCount,
    lastClickAt,
    confirmationEmail,
  };
};

export default function Index() {
  const { shop, clickCount, purchaseCount, lastClickAt, confirmationEmail } =
    useLoaderData();
  const navigate = useNavigate();

  const emailText =
    confirmationEmail && confirmationEmail.trim().length > 0
      ? confirmationEmail
      : "Inte angivet";

  const lastClickText = lastClickAt
    ? new Date(lastClickAt).toLocaleString("sv-SE")
    : "Ingen aktivitet ännu";

  return (
    <s-page heading="Konsumentkollen från ViPo Säkerhetstjänster">
      <s-button slot="primary-action" onClick={() => navigate("/app/additional")}>
        Öppna Settings
      </s-button>

      {/* VÄNSTERKOLUMN: Välkomst + status */}
      <s-section>
        <s-stack direction="block" gap="base">
          <s-heading>Välkommen!</s-heading>
          <s-badge tone="success">Installerad och redo</s-badge>

          <s-paragraph>
            Konsumentkollen är installerad i <s-text emphasis>{shop}</s-text> och
            redo att användas. Nästa steg är att lägga till widgeten i ditt tema
            och välja vilken e‑postadress som ska få bekräftelsemail när en
            signering är klar.
          </s-paragraph>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>Bekräftelsemail</s-heading>
            <s-paragraph>
              Skickas till: <s-text emphasis>{emailText}</s-text>
            </s-paragraph>
            <s-paragraph>
              Ändra mottagare under{" "}
              <s-link href="/app/additional">Settings</s-link>.
            </s-paragraph>
          </s-box>
        </s-stack>
      </s-section>

      {/* VÄNSTERKOLUMN: Aktivitet (klick + köp + senaste klick) */}
      <s-section heading="Aktivitet">
        <s-stack direction="block" gap="base">
          <s-stack direction="inline" gap="base">
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-paragraph>Klick på “Bevaka”</s-paragraph>
              <s-heading>{clickCount}</s-heading>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-paragraph>Sålda tjänster</s-paragraph>
              <s-heading>{purchaseCount}</s-heading>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-paragraph>Senaste klick</s-paragraph>
              <s-text emphasis>{lastClickText}</s-text>
            </s-box>
          </s-stack>

          <s-paragraph>
            Klick visar hur många gånger kunder har tryckt på “Bevaka”. Sålda
            tjänster visar antal genomförda köp/signeringar. Senaste klick hjälper
            dig se om widgeten används just nu.
          </s-paragraph>
        </s-stack>
      </s-section>

      {/* VÄNSTERKOLUMN: Hur man lägger till widgeten */}
      <s-section heading="Lägg till Konsumentkollen-widgeten">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            Du lägger till widgeten via Shopify Theme Editor:
          </s-paragraph>

          <s-unordered-list>
            <s-list-item>
              Gå till <s-text emphasis>Webbshop → Teman</s-text> och klicka{" "}
              <s-text emphasis>Anpassa</s-text>.
            </s-list-item>
            <s-list-item>
              Klicka <s-text emphasis>Lägg till sektion/block</s-text> och välj{" "}
              <s-text emphasis>Konsumentkollen</s-text>.
            </s-list-item>
            <s-list-item>
              Placera widgeten där du vill visa den och spara.
            </s-list-item>
          </s-unordered-list>

          <s-paragraph>
            Tips: Om du inte ser blocket i Theme Editor, kontrollera att appens
            theme extension är aktiverad för ditt tema.
          </s-paragraph>
        </s-stack>
      </s-section>

      {/* VÄNSTERKOLUMN: Flöde + provision */}
      <s-section heading="Så fungerar det (kund → Scrive → bekräftelse)">
        <s-stack direction="block" gap="base">
          <s-unordered-list>
            <s-list-item>
              Kunden klickar på <s-text emphasis>Bevaka</s-text> i widgeten.
            </s-list-item>
            <s-list-item>
              Kunden skickas vidare till en <s-text emphasis>Scrive</s-text>-sida
              för avtalssignering.
            </s-list-item>
            <s-list-item>
              När avtalet är signerat skickas ett{" "}
              <s-text emphasis>bekräftelsemail</s-text> till den e‑postadress du
              valt i <s-text emphasis>Inställningar</s-text>.
            </s-list-item>
            <s-list-item>
              Som butiksägare får du <s-text emphasis>20 % av summan</s-text>{" "}
              som tjänsten säljs för.
            </s-list-item>
          </s-unordered-list>
        </s-stack>
      </s-section>

      {/* HÖGERKOLUMN: Om tjänsten */}
      <s-section slot="aside" heading="Om Konsumentkollen">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            Konsumentkollen hjälper dina kunder att skydda sin identitet med
            bevakning och omedelbara larm vid förändringar kopplade till
            personnummer.
          </s-paragraph>

          <s-paragraph>
            <s-link href="https://vipo.se" target="_blank">
              Läs mer på vipo.se
            </s-link>
          </s-paragraph>
        </s-stack>
      </s-section>

      {/* HÖGERKOLUMN: Support */}
      <s-section slot="aside" heading="Support & tekniska frågor">
        <s-paragraph>
          Behöver du hjälp med installationen eller har tekniska frågor om
          appen?
        </s-paragraph>

        <s-unordered-list>
          <s-list-item>E‑post: william.bjorklund@vipo.se</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
