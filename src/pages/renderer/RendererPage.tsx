import { useState } from "react";
import Editor from "@/components/editor/Editor";
import Renderer from "@/components/renderer/Renderer";
import styles from "@/components/renderer/Renderer.module.css";
import { reference } from "@/utils/constants";

const INITIAL_MARKUP = `[glitter color=hotpink][h1]hej barbie, hej ken[/h1][/glitter]
[shadow color=violet x=2px y=2px][outline color=lightblue width=1][color value=blue][h1]Joooł[/h1][/color][/outline][/shadow]
no a to jest normalny tekst co nie, fajny chyba`;

export default function RendererPage(): JSX.Element {
  const [markup, setMarkup] = useState(INITIAL_MARKUP);

  return (
    <section className={styles.shell} aria-labelledby="renderer-demo-title">
      <div className={styles.layout}>
        <div className={styles.column}>
          <h2 id="renderer-demo-title" className={styles.sectionLabel}>
            Editor
          </h2>

          <Editor value={markup} onChange={setMarkup} />
        </div>

        <div className={styles.column}>
          <h2 className={styles.sectionLabel}>Rendered</h2>
          <div className={styles.previewPanel}>
            <Renderer markup={markup} />
          </div>
        </div>
      </div>

      <details className={styles.details}>
        <summary className={styles.summary}>Markup (storage format)</summary>
        <pre className={styles.reference}>{markup}</pre>
      </details>

      <details className={styles.details}>
        <summary className={styles.summary}>Syntax reference</summary>
        <pre className={styles.reference}>{reference}</pre>
      </details>
    </section>
  );
}
