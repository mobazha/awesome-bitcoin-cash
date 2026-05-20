const DATA_FOR_WEBRING = `https://raw.githubusercontent.com/BitcoinCash1/bch-webring/refs/heads/main/webring.json`;

const template = document.createElement("template");
template.innerHTML = `
<style>
  :host {
    display: block;
    font: 100% system-ui, sans-serif;
    color-scheme: light dark;
  }
  .webring {
    border: 2px solid #09ba8a;
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    background: light-dark(#f0fdf8, #0d2b22);
    color: light-dark(#0a3d2e, #d1f5ea);
    text-align: center;
  }
  .webring h2 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #09ba8a;
  }
  .webring p {
    margin: 0.25rem 0;
    font-size: 0.95rem;
  }
  .webring a {
    color: #09ba8a;
    text-decoration: none;
    font-weight: 500;
  }
  .webring a:hover {
    text-decoration: underline;
  }
  .nav {
    margin-top: 0.75rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .nav a {
    background: #09ba8a;
    color: #fff;
    padding: 0.3rem 0.85rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .nav a:hover {
    background: #07a377;
    text-decoration: none;
  }
</style>

<div class="webring">
  <div id="copy"></div>
</div>`;

class WebRing extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const thisSite = this.getAttribute("site");

    fetch(DATA_FOR_WEBRING)
      .then((response) => response.json())
      .then((sites) => {
        const matchedSiteIndex = sites.findIndex(
          (site) => site.url === thisSite
        );

        if (matchedSiteIndex === -1) {
          this.shadowRoot.querySelector("#copy").innerHTML =
            `<p>Site not found in the webring.</p>`;
          return;
        }

        const matchedSite = sites[matchedSiteIndex];

        const prevSiteIndex =
          matchedSiteIndex === 0 ? sites.length - 1 : matchedSiteIndex - 1;
        const nextSiteIndex =
          matchedSiteIndex === sites.length - 1 ? 0 : matchedSiteIndex + 1;
        const randomSiteIndex = this.getRandomInt(0, sites.length - 1);

        this.shadowRoot.querySelector("#copy").innerHTML = `
          <h2>BCH Webring</h2>
          <p>You are visiting <a href="${matchedSite.url}">${matchedSite.name}</a> by ${matchedSite.owner}</p>
          <nav class="nav">
            <a href="${sites[prevSiteIndex].url}">&#8592; Prev</a>
            <a href="${sites[randomSiteIndex].url}">Random</a>
            <a href="${sites[nextSiteIndex].url}">Next &#8594;</a>
          </nav>`;
      });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

window.customElements.define("bch-webring", WebRing);
