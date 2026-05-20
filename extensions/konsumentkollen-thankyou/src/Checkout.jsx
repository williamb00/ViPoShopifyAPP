import '@shopify/ui-extensions/preact';
import {render} from 'preact';

const SCRIVE_URL =
  'https://crm.vipo.se/lp/iguard';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  return (
    <s-box
      background="subdued"
      borderRadius="large"
      borderWidth="base"
      padding="large"
    >
      <s-stack gap="large">
        <s-paragraph>
          <s-text type="strong">
            • ETT EXKLUSIVT ERBJUDANDE IGUARDS KUNDER
          </s-text>
        </s-paragraph>

        <s-stack gap="base">
          <s-heading>
            Du har precis handlat tryggt - men alla företag online är inte lika
            pålitliga.
          </s-heading>

          <s-paragraph>
            Vi hjälper dig skydda dina uppgifter om de skulle hamna i fel händer.
          </s-paragraph>
        </s-stack>

        <s-box
          background="base"
          border="base critical"
          borderRadius="base"
          padding="base"
        >
          <s-stack direction="inline" gap="base" alignItems="center">
            <s-icon type="alert-circle" tone="critical" size="base" />
            <s-text>
              Över 800 bedrägeriförsök varje dag - många märker det först när det
              är för sent
            </s-text>
          </s-stack>
        </s-box>

        <s-stack gap="small" alignItems="center">
          <s-paragraph>
            Exklusivt för dig som kund hos iGuard
          </s-paragraph>

          <s-button
            href={SCRIVE_URL}
            target="_blank"
            variant="primary"
            inlineSize="fill"
          >
            Skydda dig nu →
          </s-button>

          <s-paragraph type="small" color="subdued">
            Tar 1 minut · Aktivt skydd inom 24 h
          </s-paragraph>
        </s-stack>
      </s-stack>
    </s-box>
  );
}