import { useState } from "react";
import Renderer from "@/components/renderer/Renderer";
import styles from "@/components/renderer/Renderer.module.css";
import { reference } from "@/utils/constants";

export default function RendererPage(): JSX.Element {
  const [markup, setMarkup] = useState(`
miała matka syna
![https://www.tapeciarnia.pl/tapety/normalne/135970_krowa_pastwisko_leb.jpg]{wrap=left,shape=circle,width=300px,alt=description}
[wavy]syna jedynego[/wavy]
[rainbow]chciała go wychować[/rainbow]
[shadow color=#00eeff x=2px y=2px blur=1px][italic]na pana wielkiego[/italic][/shadow]
[strike color=red]co tu się kurwa odpierdala[/strike]
no a to jest normalny tekst co nie, fajny chyba
[highlight color=pink]gówno[/highlight]
[highlight color=black][color value=yellow]żółte napisy dla konfederatów[/color][/highlight]
[shake]dupa[/shake]
[typewriter speed=120]ale napierdalam z tym tekstem[/typewriter]
[size size=2em]duży tekst dla dużych ludzi[/size]
[neon]neony też są oczywiście, ale nieco chujowe[/neon]
[glitter color=hotpink][h1]hej barbie, hej ken[/h1][/glitter]
[gradient colors=blue,hotpink direction=90deg]gradientowa rewolucja[/gradient]
[shadow color=violet x=2px y=2px][outline color=lightblue width=1][color value=blue][h1]Joooł[/h1][/color][/outline][/shadow]`);

  return (
    <section className={styles.shell} aria-labelledby="renderer-demo-title">
      <div className={styles.layout}>
        <div className={styles.column}>
          <h2 id="renderer-demo-title" className={styles.sectionLabel}>
            Markup
          </h2>

          <textarea
            className={styles.markupTextarea}
            value={markup}
            onChange={(event) => setMarkup(event.target.value)}
            aria-label="Custom markup"
            placeholder="Type any markup here..."
          />
        </div>

        <div className={styles.column}>
          <h2 className={styles.sectionLabel}>Rendered</h2>
          <div className={styles.previewPanel}>
            <Renderer markup={markup} />
          </div>
        </div>
      </div>

      <details className={styles.details}>
        <summary className={styles.summary}>Syntax reference</summary>
        <pre className={styles.reference}>{reference}</pre>
      </details>
    </section>
  );
}
