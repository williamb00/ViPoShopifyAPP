import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const scriveUrl = 'https://scrive.com/form/din-riktiga-lank';

  return (
    <s-banner heading="Konsumentkollen">
      <s-stack gap="base">
        <s-text>
          Skydda din identitet och få omedelbara larm vid viktiga förändringar.
        </s-text>

        <s-text>
          Med Konsumentkollen får du bevakning av ditt personnummer dygnet runt.
          Vi larmar dig direkt när något förändras, som kreditupplysningar,
          adressändringar eller misstänkt ID-missbruk.
        </s-text>

        <s-link href={scriveUrl}>Starta bevakning</s-link>
      </s-stack>
    </s-banner>
  );
}