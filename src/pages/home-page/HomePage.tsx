export default function HomePage(): JSX.Element {
  return (
    <div className="app">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main-content");
          if (main) {
            main.setAttribute("tabindex", "-1");
            main.focus();
          }
        }}
      >
        Skip to main content
      </a>
      <header className="page-header">
        <h1>Editor on crack</h1>
      </header>
      <main id="main-content" className="page-content" tabIndex={-1}></main>
    </div>
  );
}
