class rteContainer extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      table: "table",
      iframe: "iframe",
    };

    this.classes = {
      tableWrap: "rte__table-wrapper",
      iframeWrap: "rte__iframe-wrapper",
    };
  }

  connectedCallback() {
    this.querySelectorAll(this.selectors.iframe).forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(this.classes.iframeWrap);

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });
    this.querySelectorAll(this.selectors.table).forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add(this.classes.tableWrap);
      wrapper.tabIndex = 0;

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });
  }
}

if (!customElements.get("rte-container")) {
  customElements.define("rte-container", rteContainer);
}
