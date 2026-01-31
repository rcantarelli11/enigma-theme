import { d as debounce } from './debounce-f0994045.js';
import { E as EVENTS } from './events-58bc9098.js';

const { FILTER_REPAINT, FILTER_SORT_CHANGED, SORT_CHANGED } = EVENTS;

class FilterSortForm extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      activeFilterItem: "[js-active-filter-item]",
      clearAllButton: "[js-clear-all-button]",
      clearAllLink: "[js-clear-all-link]",
      form: "[js-filter-sort-form]",
      parentSection: "[js-product-grid-section], [js-result-grid-section]",
      priceFilterInputs: "[js-from-input], [js-to-input]",
      searchSection: "[js-result-grid-section]",
      sortByInput: "input[name='sort_by']",
      swatchLabel: "[js-swatch-label]",
      swatch: "[js-swatch]",
      swatchInput: "[js-filter-swatch-input]",
      swatchWrapper: "[js-filter-swatch-wrapper]",
    };

    this.classes = {
      disabledSwatchLabel: "filter-item__swatch-label--disabled",
      swatchSelected: "swatch--selected",
      removePending: "remove-pending",
    };

    this.events = {
      change: new Event("change", { bubbles: true }),
    };

    this.helpers = {
      sortByRegex: /sort_by=((([a-z]+)-([a-z]+))|([a-z]+))/g,
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.formDebounce = debounce();
    this.parentSection = this.closest(this.selectors.parentSection);

    // If we're on the search page, we need to save the search query
    if (this.parentSection.matches(this.selectors.searchSection)) {
      const currentSearchParams = new URL(window.location.href).searchParams;
      this.searchTerm = currentSearchParams.get("q");
    }

    const eventOptions = { signal: this.controller.signal };

    // Form
    this.form = this.querySelector(this.selectors.form);
    this.defaultSortBy = this.dataset.defaultSortBy;

    this.form.addEventListener(
      "change",
      this.handleFormChange.bind(this),
      eventOptions,
    );

    // Sorting
    this.sortByInput = this.querySelector(this.selectors.sortByInput);

    this.addEventListener(
      SORT_CHANGED,
      this.handleSortChange.bind(this),
      eventOptions,
    );

    // Active filters
    this.initActiveFilterItems();

    // Swatches
    this.initSwatchFilters();

    // Repaint
    this.addEventListener(
      FILTER_REPAINT,
      this.handleRepaint.bind(this),
      eventOptions,
    );

    // "Clear all" link (for when there are no results)
    this.clearAllController = new AbortController();
    this.initClearAllLink();
  }

  handleFormChange() {
    this.formDebounce(this.applyFormChange.bind(this), 600);
  }

  applyFormChange(searchParams) {
    if (searchParams === undefined) {
      const formData = new FormData(this.form);

      // Remove params with empty values
      for (const [key, value] of formData.entries()) {
        if (value === "") {
          formData.delete(key);
        }
      }

      searchParams = new URLSearchParams(formData).toString();
    }

    // If we're on the search page, prepend the search term
    if (this.searchTerm) {
      searchParams = `q=${this.searchTerm}&` + searchParams;
    }

    const sortByParamCheck = searchParams.match(this.helpers.sortByRegex);
    let currentSortBy = this.defaultSortBy;

    if (sortByParamCheck) {
      currentSortBy = sortByParamCheck[0].split("=")[1];

      // If the value of the sort input is the same as the default, we exclude the parameter
      if (currentSortBy === this.defaultSortBy) {
        searchParams = searchParams.replace(this.helpers.sortByRegex, "");

        if (searchParams.indexOf("&") === 0) {
          searchParams = searchParams.replace("&", "");
        }
      }
    }

    const filterSortChangeEvent = new CustomEvent(FILTER_SORT_CHANGED, {
      detail: {
        searchParams,
        sortBy: currentSortBy,
      },
    });

    this.parentSection.dispatchEvent(filterSortChangeEvent);
  }

  handleSortChange(event) {
    this.sortByInput.value = event.detail.sortBy;
    this.applyFormChange();
  }

  initActiveFilterItems() {
    this.activeFiltersController = new AbortController();
    const eventOptions = { signal: this.activeFiltersController.signal };

    this.clearAllButton = this.querySelector(this.selectors.clearAllButton);
    this.activeFilterItems = this.querySelectorAll(
      this.selectors.activeFilterItem,
    );

    if (this.clearAllButton) {
      this.clearAllButton.addEventListener(
        "click",
        this.handleFilterClear.bind(this),
        eventOptions,
      );
    }

    if (this.activeFilterItems) {
      this.activeFilterItems.forEach((item) => {
        item.addEventListener(
          "click",
          this.handleFilterRemove.bind(this),
          eventOptions,
        );
      });
    }
  }

  handleFilterRemove(event) {
    event.currentTarget.classList.add(this.classes.removePending);

    if (event.currentTarget.dataset.type === "price-range") {
      const priceFilterInputs = this.querySelectorAll(
        this.selectors.priceFilterInputs,
      );

      priceFilterInputs.forEach((input) => {
        input.value = "";
      });
    } else {
      // Build an ID to find the filter input associated with the filter that has
      // been removed.
      const { filterLabelHandle, filterValueLabelHandle } =
        event.currentTarget.dataset;
      const removedFilter = this.querySelector(
        `#filter--${filterLabelHandle}-${filterValueLabelHandle}`,
      );

      removedFilter.checked = false;
    }

    this.applyFormChange();
  }

  handleFilterClear() {
    let searchParams = "";

    if (this.sortByInput.value !== this.defaultSortBy) {
      searchParams = `sort_by=${this.sortByInput.value}`;
    }

    this.applyFormChange(searchParams);
  }

  initClearAllLink() {
    this.clearAllLink = this.closest(
      this.selectors.parentSection,
    ).querySelector(this.selectors.clearAllLink);

    if (this.clearAllLink) {
      if (this.clearAllController.signal.aborted) {
        this.clearAllController = new AbortController();
      }

      this.clearAllLink.addEventListener(
        "click",
        this.handleFilterClear.bind(this),
        { signal: this.clearAllController.signal },
      );
    } else {
      this.clearAllController.abort();
    }
  }

  initSwatchFilters() {
    this.swatchFiltersController = new AbortController();
    this.swatchFilters = this.querySelectorAll(this.selectors.swatchLabel);

    this.swatchFilters.forEach((swatchFilter) => {
      swatchFilter.addEventListener(
        "click",
        this.handleSwatchClick.bind(this),
        {
          signal: this.swatchFiltersController.signal,
        },
      );
    });
  }

  handleSwatchClick(event) {
    event.preventDefault();

    if (
      event.currentTarget.classList.contains(this.classes.disabledSwatchLabel)
    )
      return

    const swatchInput = event.currentTarget.querySelector(
      this.selectors.swatchInput,
    );
    const swatch = event.currentTarget.querySelector(this.selectors.swatch);

    if (swatch.classList.contains(this.classes.swatchSelected)) {
      swatch.classList.remove(this.classes.swatchSelected);
    } else {
      swatch.classList.add(this.classes.swatchSelected);
    }

    swatchInput.checked = !swatchInput.checked;
    swatchInput.dispatchEvent(this.events.change);
  }

  handleRepaint() {
    this.activeFiltersController.abort();
    this.initActiveFilterItems();
    this.swatchFiltersController.abort();
    this.initSwatchFilters();
    this.initClearAllLink();
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("filter-sort-form")) {
  customElements.define("filter-sort-form", FilterSortForm);
}
