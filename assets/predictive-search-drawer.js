import { E as EVENTS } from './events-58bc9098.js';

class PredictiveSearchDrawer extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      shopifySection: ".shopify-section",
      resultsContainer: ".predictive-search-drawer_results-container",
      searchInput: "search-input",
      searchButton: ".predictive-search-drawer__submit-button",
      footer: ".predictive-search-drawer__footer-content",
      viewAllButtonInResults: "#view-all-results-button",
    };

    this.states = {
      results: "results",
      default: "default",
      empty: "empty",
      loading: "loading",
    };
  }

  connectedCallback() {
    this.dialog = this.closest(this.selectors.dialogParent);
    this.shopifySection = this.closest(this.selectors.shopifySection);
    this.searchInput = this.querySelector(this.selectors.searchInput);
    this.resultsContainer = this.querySelector(this.selectors.resultsContainer);
    this.sectionId = this.dataset.sectionId;
    this.eventController = new AbortController();
    this.queryFetchController = new AbortController();
    this.queryFetchPending = false;

    this.searchTerm = "";
    this.searchButton = this.querySelector(this.selectors.searchButton);
    this.searchButtonLabelTemplate = this.dataset.searchButtonLabel;
    this.footer = this.querySelector(this.selectors.footer);

    this.searchConfig = {
      maxResultsPerCategory: parseInt(this.dataset.maxResultsPerCategory, 10),
      searchableFields: this.dataset.searchableFields,
    };

    this.cachedResults = {};
    if (window?.Shopify?.designMode) {
      this.#bindThemeEditorEvents();
    }

    window.addEventListener(
      EVENTS.PREDICTIVE_SEARCH_DRAWER_OPEN,
      () => {
        this.searchInput.focus();
      },
      { signal: this.eventController.signal },
    );

    this.addEventListener(EVENTS.SEARCH_INPUT_CHANGED, this.onChange);
  }

  #bindThemeEditorEvents() {
    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_SELECT,
      (event) => {
        if (event.target === this.shopifySection) {
          window.dispatchEvent(new Event(EVENTS.PREDICTIVE_SEARCH_DRAWER_OPEN));
        }
      },
      { signal: this.eventController.signal },
    );

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_DESELECT,
      (event) => {
        if (event.target === this.shopifySection) {
          window.dispatchEvent(new Event(EVENTS.PREDICTIVE_SEARCH_DRAWER_CLOSE));
          this.openedViaThemeEditorEvents = false;
        }
      },
      { signal: this.eventController.signal },
    );
  }

  setDisplayedState(state) {
    this.dataset.displayedState = state;
  }

  getQuery() {
    return this.searchInput.getValue()
  }

  clearResults() {
    this.resultsContainer.innerHTML = "";
    this.setDisplayedState(this.states.default);
  }

  renderSearchResults(resultsMarkup) {
    this.resultsContainer.replaceChildren(resultsMarkup);

    this.updateSearchButton(resultsMarkup);
    if (resultsMarkup.dataset.totalResultCount === "0") {
      this.setDisplayedState(this.states.empty);
    } else {
      this.setDisplayedState(this.states.results);
    }
  }

  updateSearchButton(resultsMarkup) {
    const viewAllButtonContainer = resultsMarkup.querySelector(
      this.selectors.viewAllButtonInResults,
    );
    const viewAllButtonMarkup = viewAllButtonContainer?.innerHTML;

    if (viewAllButtonMarkup) {
      const button = new DOMParser()
        .parseFromString(viewAllButtonMarkup, "text/html")
        .querySelector(".btn-wrapper");
      this.footer.replaceChildren(button);
    }
  }

  onChange() {
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      this.clearResults();
    }
    this.setDisplayedState(this.states.loading);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.clearResults();
      return
    }

    this.getSearchResults(this.searchTerm);
  }

  getSearchResults(searchTerm) {
    if (this.queryFetchPending) {
      this.queryFetchController.abort();
      this.queryFetchPending = false;
      this.queryFetchController = new AbortController();
    }

    const queryKey = searchTerm.replace(" ", "-").toLowerCase();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return
    }

    const params = new URLSearchParams();

    params.set("section_id", "predictive-search");
    params.set("q", searchTerm);
    params.set("resources[limit_scope]", "each");
    params.set("resources[limit]", this.searchConfig.maxResultsPerCategory);
    params.set("resources[options][fields]", this.searchConfig.searchableFields);

    this.queryFetchPending = true;
    this.searchInput.setInProgress(true);

    fetch(`${window.theme.routes.predictiveSearch}?${params.toString()}`, {
      signal: this.queryFetchController.signal,
    })
      .then((response) => {
        this.queryFetchPending = false;
        this.searchInput.setInProgress(false);
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error
        }

        return response.text()
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector("#shopify-section-predictive-search").children[0];

        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        this.searchInput.setInProgress(false);
        this.queryFetchPending = false;
        if (error?.code === 20) {
          // Code 20 means the call was cancelled because of controller abort
          return
        }
        throw error
      });
  }

  disconnectedCallback() {
    this.eventController.abort();
    this.queryFetchController.abort();
  }
}

if (!customElements.get("predictive-search-drawer")) {
  customElements.define("predictive-search-drawer", PredictiveSearchDrawer);
}
