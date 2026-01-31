class SocialShare extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      copyLink: "[js-social-share-copy-link]",
      nativeShare: "[js-social-share-native-share]",
      standardShare: "[js-social-share-standard-share]",
    };

    this.classes = {
      copySuccess: "copy-success",
      copyError: "copy-error",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.shareData = {
      url: this.dataset.url,
      text: this.dataset.text,
      title: this.dataset.title,
    };

    const eventData = {
      signal: this.controller.signal,
    };

    if (
      navigator.canShare &&
      this.dataset.nativeShareEnabled === "true" &&
      navigator.canShare(this.shareData)
    ) {
      this.dataset.nativeShareSupported = "true";
      this.nativeShare = this.querySelector(this.selectors.nativeShare);

      this.nativeShare.addEventListener(
        "click",
        this.handleNativeShare.bind(this),
        eventData,
      );
    } else {
      this.dataset.nativeShareSupported = "false";
      this.copyLink = this.querySelector(this.selectors.copyLink);

      this.copyLink.addEventListener(
        "click",
        this.handleCopyClick.bind(this),
        eventData,
      );

      // ensure password banner animation doesn't interfere with tooltips
      this.addEventListener(
        "mouseenter",
        () => {
          this.closest(
            ".password__section-block--share.animation-content",
          )?.classList.remove("animation-content");
        },
        { once: true, signal: this.controller.signal },
      );
    }
  }

  handleNativeShare(event) {
    event.preventDefault();

    try {
      navigator.share(this.shareData);
    } catch (error) {
      console.error("Sharing error --", error);
    }
  }

  handleCopyClick(event) {
    const url = event.currentTarget.dataset.url;

    navigator.clipboard
      .writeText(url)
      .then(this.handleCopySuccess.bind(this), this.handleCopyError.bind(this));
  }

  handleCopySuccess() {
    this.copyLink.classList.add(this.classes.copySuccess);

    setTimeout(() => {
      this.copyLink.classList.remove(this.classes.copySuccess);
    }, 2000);
  }

  handleCopyError() {
    this.copyLink.classList.add(this.classes.copyError);

    setTimeout(() => {
      this.copyLink.classList.remove(this.classes.copyError);
    }, 2000);
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("social-share")) {
  customElements.define("social-share", SocialShare);
}
