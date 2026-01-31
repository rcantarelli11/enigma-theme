import { E as EVENTS } from './events-58bc9098.js';
import { s as srraf } from './srraf.es-487187f3.js';

let loaded$1 = null;

function loadVimeoAPI() {
  if (loaded$1 !== null) return loaded$1

  if (window.Vimeo && window.Vimeo.loaded) {
    loaded$1 = Promise.resolve();
    return loaded$1
  }

  // Otherwise, load API
  loaded$1 = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://player.vimeo.com/api/player.js";
    tag.onload = resolve;
    document.body.appendChild(tag);
  });

  return loaded$1
}

let loaded = null;

function loadYouTubeAPI() {
  // Loading was triggered by a previous call to function
  if (loaded !== null) return loaded

  // API has already loaded
  if (window.YT && window.YT.loaded) {
    loaded = Promise.resolve();
    return loaded
  }

  // Otherwise, load API
  loaded = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });

  return loaded
}

// Global arrays to track active players to more easily control.
const youTubePlayerArr = [];
const vimeoPlayerArr = [];
const internalPlayerArr = [];

const addPlayerToTrackingArr = (source, player) => {
  if (source === "youtube") {
    youTubePlayerArr.push(player);
  }

  if (source === "vimeo") {
    vimeoPlayerArr.push(player);
  }

  if (source === "internal") {
    internalPlayerArr.push(player);
  }
};

/**
 * If a video is played, any previously started video will pause
 * If a slide (scroll slider or media lightbox) changes, a playing video will pause
 */
const pausePlayingVideos = () => {
  youTubePlayerArr.forEach((player) => {
    player.pauseVideo();
  });

  vimeoPlayerArr.forEach((player) => {
    player.pause();
  });

  internalPlayerArr.forEach((player) => {
    player.pause();
  });
};

const clearPlayerTrackingArr = () => {
  youTubePlayerArr.length = 0;
  vimeoPlayerArr.length = 0;
  internalPlayerArr.length = 0;
};

/*
  YouTube specific state control
-------------------------------------------------------------------------- */
/**
 * Use YouTube player functions to alter settigns and state if poster clicked
 * @param {HTMLIFrameElement} player result of YT.Player
 *
 */
const clickPosterToPlayYouTube = (player) => {
  // Clicking the play button will play video with sound
  // This should true for mobile, safari, and low power mode
  if (!player) return

  player.unMute();
  player.playVideo();
};

const onYouTubePlayerStateChange = (event) => {
  // -1 is 'unstarted' likely due to API not being fully loaded
  if (event.data === -1) {
    event.target.mute();
    event.target.playVideo();
  }

  youTubePlayerArr.forEach((player) => {
    // Don't pause most recently played video, 1 = playing
    if (player !== event.target && event.data === 1) {
      player.pauseVideo();
    }
  });

  vimeoPlayerArr.forEach((player) => {
    player.pause();
  });

  internalPlayerArr.forEach((player) => {
    player.pause();
  });
};

/*
  Vimeo specific state control
-------------------------------------------------------------------------- */

/**
 * Use Vimeo player functions to alter settings and state if poster clicked
 * @param {HTMLIFrameElement} player result of Vimeo.Player
 *
 */
const clickPosterToPlayVimeo = (player) => {
  // Clicking play button will play video with sound
  // except on mobile, which will be muted or requires click to play in low power mode
  if (!player) return

  player.getPaused().then(function (paused) {
    if (paused) {
      player.play();
    } else {
      player.setMuted(true);
      player.play();
    }
  });
};

/**
 * Create a YouTube video player directly from the API
 * @param {HTMLElement} video video player div that will be swapped out with iframe
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const initYouTubeVideo = (video, hadPoster) => {
  const videoId = video.dataset.videoId;

  let autoplay = false;
  if (hadPoster) {
    autoplay = true;
  }

  loadYouTubeAPI().then(() => {
    const player = new window.YT.Player(video, {
      videoId,
      playerVars: {
        enablejsapi: 1,
        cc_load_policy: 0,
        controls: 1,
        iv_load_policy: 3,
        playsinline: 1,
        rel: 0,
        playlist: videoId,
        // eslint-disable-next-line object-shorthand
        autoplay: autoplay,
      },
      events: {
        onReady: () => {
          player.getIframe().tabIndex = "0";
          if (hadPoster) {
            clickPosterToPlayYouTube(player);
          } else {
            player.unMute();
          }

          addPlayerToTrackingArr("youtube", player);
        },
        onStateChange: onYouTubePlayerStateChange,
      },
    });
  });
};

/**
 * Update an existing YouTube iframe to allow for API events and actions
 * @param {HTMLIFrameElement} iframe existing iframe, not originally rendered through the API
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const updateIframeYouTubeVideo = (iframe, hadPoster) => {
  loadYouTubeAPI().then(() => {
    const player = new window.YT.Player(iframe, {
      events: {
        onReady: () => {
          player.getIframe().tabIndex = "0";

          if (hadPoster) {
            clickPosterToPlayYouTube(player);
          } else {
            player.unMute();
          }

          addPlayerToTrackingArr("youtube", player);
        },
        onStateChange: onYouTubePlayerStateChange,
      },
    });
  });
};

/**
 * Create a Vimeo video player directly from the API
 * @param {HTMLElement} video video player div that will be swapped out with iframe
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const initVimeoVideo = (video, hadPoster) => {
  let autoplay = false;
  if (hadPoster) {
    autoplay = true;
  }

  loadVimeoAPI().then(() => {
    const player = new window.Vimeo.Player(video, {
      id: video.dataset.videoId,
      // eslint-disable-next-line object-shorthand
      autoplay: autoplay,
    });

    player.element.tabIndex = "0";
    if (hadPoster) {
      clickPosterToPlayVimeo(player);
    }

    pausePlayingVideos();
    addPlayerToTrackingArr("vimeo", player);
  });
};

/**
 * Update an existing Vimeo iframe to allow for API events and actions
 * @param {HTMLIFrameElement} iframe existing iframe, not originally rendered through the API
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const updateIframeVimeoVideo = (iframe, hadPoster) => {
  loadVimeoAPI().then(() => {
    const player = new window.Vimeo.Player(iframe, {
      muted: true,
    });

    player.element.tabIndex = "0";
    if (hadPoster) {
      clickPosterToPlayVimeo(player);
    }

    addPlayerToTrackingArr("vimeo", player);
  });
};

/**
 * Create new YouTube and Vimeo videos. Initialize YouTube, Vimeo and Shopify videos when triggered.
 * @param {HTMLDivElement} node video container with data to structure triggers with video player created during initialization
 */
const liquidMadeVideoPlayer = (node) => {
  const { showPoster, hasPoster } = node.dataset;
  const playButton = node.querySelector("[js-poster-play-button]");

  if (showPoster && hasPoster) {
    playButton.addEventListener("click", () => {
      node.dataset.videoInitialized = "true";
      _initLiquidMadeVideoPlayer(node, { hadPoster: true });
    });

    playButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        node.dataset.videoInitialized = "true";
        _initLiquidMadeVideoPlayer(node, { hadPoster: true });
      }
    });
  } else {
    _initLiquidMadeVideoPlayer(node, { hadPoster: false });
  }
};

const _initLiquidMadeVideoPlayer = (node, poster) => {
  const internalVideo = node.querySelector("[data-video-internal]");
  const externalVideo = node.querySelector("[data-video-external]");

  if (externalVideo) {
    const { videoProvider } = externalVideo.dataset;

    if (videoProvider === "youtube") {
      initYouTubeVideo(externalVideo, poster.hadPoster);
    } else if (videoProvider === "vimeo") {
      initVimeoVideo(externalVideo, poster.hadPoster);
    }
  } else if (internalVideo && poster.hadPoster) {
    pausePlayingVideos();
    internalVideo.play();

    // Delay adding player to arr to prevent pre-emptive pause
    setTimeout(() => {
      addPlayerToTrackingArr("internal", internalVideo);
    }, 100);
  }
};

/**
 * When triggered, append and initialize prepared YouTube, Vimeo and Shopify videos.
 * @param {HTMLDivElement} videoContainer container with data to structure triggers and initialization
 * @param {HTMLElement} video iframe (YouTube & Vimeo) or video element (Shopify) to append
 */
const domMadeVideoPlayer = (videoContainer, video) => {
  const { videoType, showPoster } = videoContainer.dataset;

  if (showPoster === "true") {
    const playButton = videoContainer.querySelector("[js-poster-play-button]");

    playButton.addEventListener("click", () => {
      videoContainer.setAttribute("data-video-initialized", "true");
      videoContainer.appendChild(video);

      _initDomMadeVideoPlayer(video, videoType, { hadPoster: true });
    });

    playButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        videoContainer.setAttribute("data-video-initialized", "true");
        videoContainer.appendChild(video);

        _initDomMadeVideoPlayer(video, videoType, { hadPoster: true });
      }
    });
  } else {
    videoContainer.appendChild(video);
    _initDomMadeVideoPlayer(video, videoType, { hadPoster: false });
  }
};

const _initDomMadeVideoPlayer = (video, videoType, poster) => {
  if (videoType === "youtube") {
    updateIframeYouTubeVideo(video.id, poster.hadPoster);
  } else if (videoType === "vimeo") {
    updateIframeVimeoVideo(video, poster.hadPoster);
  } else {
    if (poster.hadPoster === true) {
      // Only play Shopify video element if poster removed
      pausePlayingVideos();
      addPlayerToTrackingArr("internal", video);
      video.play();
    }
  }
};

const { icons } = window.theme;

function setupMediaLightbox(node) {
  const lightboxMedia = node.querySelectorAll(".lightbox-media");

  if (!lightboxMedia.length) return

  let mediaLightbox;

  import(flu.chunks.photoswipe).then(({ PhotoSwipeLightbox, PhotoSwipe }) => {
    mediaLightbox = new PhotoSwipeLightbox({
      gallery: node,
      children: "a",
      showHideAnimationType: "zoom",
      pswpModule: PhotoSwipe,
      mainClass: "pswp--product-lightbox",
      bgOpacity: 1,
      arrowPrevSVG: icons.leftChevronWithStem,
      arrowNextSVG: icons.rightChevronWithStem,
      closeSVG: icons.close,
      zoomSVG: icons.zoom,
      preloadFirstSlide: true,
    });

    // Add ability to check for video present within lightbox
    mediaLightbox.addFilter("itemData", (itemData) => {
      const videoUrl = itemData.element.dataset.videoUrl;

      if (videoUrl) {
        itemData.videoUrl = videoUrl;
      }
      return itemData
    });

    mediaLightbox.on("contentLoad", (e) => {
      const { content } = e;

      if (content.type === "video") {
        e.preventDefault();

        let {
          externalVideoHost,
          externalVideoId,
          showPoster,
          videoPoster,
          videoAspectRatio,
          isBackgroundVideo,
        } = content.data.element.dataset;

        // Build photoswipe div in advance of iframeContainer being appended
        content.element = document.createElement("div");
        content.element.className = "pswp__video-container";

        // Build video container to append to photoswipe div
        const videoContainer = document.createElement("div");

        if (videoAspectRatio < 1) {
          // Additional class to account for portrait videos to override styling and prevent cropping.
          videoContainer.className =
            "lightbox-video__container mismatched-aspect-video";
        } else {
          videoContainer.className = "lightbox-video__container";
        }

        videoContainer.style.setProperty(
          "--video-aspect-ratio",
          videoAspectRatio,
        );

        let video;

        isBackgroundVideo = isBackgroundVideo === "true";
        if (isBackgroundVideo) {
          video = document.createElement("video");
          video.playsInline = true;
          video.controls = false;
          video.autoplay = true;
          video.muted = true;
          video.src = content.data.videoUrl;
        } else {
          if (
            externalVideoHost === "vimeo" ||
            externalVideoHost === "youtube"
          ) {
            // Build iframe for external videos
            video = document.createElement("iframe");
            video.setAttribute("allowfullscreen", "");
            video.id = `lightbox-video-${externalVideoId}`;
            videoContainer.setAttribute("data-video-type", externalVideoHost);
          } else {
            // Build video element for Shopify videos
            video = document.createElement("video");
            video.playsInline = true;
            video.controls = true;
          }

          video.src = content.data.videoUrl;
        }

        showPoster = showPoster === "true";
        if (showPoster && !isBackgroundVideo) {
          // Show poster and play button until clicked to play
          videoContainer.setAttribute("data-show-poster", true);

          if (externalVideoHost) {
            video.setAttribute("allow", "autoplay");
          }

          const posterTemplate = node.querySelector(
            "[js-lightbox-video-poster-container]",
          );
          const currentPoster = posterTemplate.content.cloneNode(true);
          videoContainer.appendChild(currentPoster);

          let posterImage;

          if (videoPoster) {
            posterImage = videoContainer.querySelector(
              "[js-lightbox-video-poster]",
            );
            posterImage.src = videoPoster;
          } else {
            posterImage = videoContainer.querySelector(".poster-placeholder");
          }
          // Append videoContainer with poster
          content.element.appendChild(videoContainer);
        } else {
          videoContainer.setAttribute("data-has-poster", false);
          content.element.appendChild(videoContainer);
        }

        domMadeVideoPlayer(videoContainer, video);
      }
    });

    mediaLightbox.on("afterInit", () => {
      const initSlideVideo = mediaLightbox.pswp.currSlide.data.type === "video";

      if (initSlideVideo) {
        const initialVideoPlayButton =
          mediaLightbox.pswp.currSlide.content.element.firstChild.childNodes[1];

        // Removes poster to reveal video when opening lightbox
        initialVideoPlayButton.click();
      }
    });

    mediaLightbox.init();

    if (window.Shopify?.designMode) {
      node.addEventListener("shopify:section:load", () => {
        // Re-init lightbox after theme editor re-render to allow it to keep working
        mediaLightbox.init();
      });
    }

    // Hide nav ui elements if single image
    mediaLightbox.on("firstUpdate", () => {
      const { pswp, options } = mediaLightbox;
      const mediaCount = options.dataSource.items.length;

      if (mediaCount === 1) {
        pswp.element.classList.add("pswp--is-single-image");
      }
    });

    // Remove video to stop playing and reset to poster
    mediaLightbox.on("contentDeactivate", ({ content }) => {
      if (content.type === "video") {
        pausePlayingVideos();
      }
    });

    mediaLightbox.on("close", () => {
      clearPlayerTrackingArr();
    });
  });
}

function setupModelViewer(node) {
  const modelEls = node.querySelectorAll("model-viewer");

  if (modelEls.length !== 0) {
    initModels();
  }

  function initModels() {
    window.Shopify.loadFeatures([
      {
        name: "model-viewer-ui",
        version: "1.0",
        onLoad: initModelViewers,
      },
    ]);

    window.Shopify.loadFeatures([
      {
        name: "shopify-xr",
        version: "1.0",
        onLoad: initShopifyXr,
      },
    ]);
  }

  function initModelViewers(errors) {
    if (errors) return

    modelEls.forEach((model) => {
      initCustomModelButtons(model);
    });
  }

  function initShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener("shopify_xr_initialized", () => {
        initShopifyXr();
      });
    } else {
      document.querySelectorAll("[id^='ModelJSON-']").forEach((modelJSON) => {
        window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
        modelJSON.remove();
      });

      window.ShopifyXR.setupXRElements();
    }
  }

  function initCustomModelButtons(model) {
    const viewer = new window.Shopify.ModelViewerUI(model);

    const parentContainer = model.closest(".product-media__item");
    const poster = parentContainer.querySelector(".model-viewer__poster");
    const closeBtn = parentContainer.querySelector(
      ".model-viewer__close-button",
    );

    poster.addEventListener("click", () => {
      parentContainer.classList.add("model-viewer__active");
      viewer.play();
    });

    poster.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        parentContainer.classList.add("model-viewer__active");
        viewer.play();
      }
    });

    closeBtn.addEventListener("click", () => {
      parentContainer.classList.remove("model-viewer__active");
      viewer.pause();
    });

    closeBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        parentContainer.classList.remove("model-viewer__active");
        viewer.pause();
      }
    });
  }
}

class ProductMedia extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      activeThumb: ".product-thumbnails__item-link.active",
      carouselTabIndex: "[js-update-carousel-tabindex]",
      initialMediaContainer: "[data-initial-slide]",
      iframe: "iframe",
      image: ".image",
      mainMediaContainer: ".product-media__items",
      media: ".media",
      mediaItemWrapper: "[js-media-item-wrapper]",
      mobileLoopButton: ".scroll-slider__mobile-loop-nav",
      thumb: "[js-product-thumbnail]",
      thumbById: (id) => `[data-thumbnail-id='${id}']`,
      mediaById: (id) => `[data-slide-index='${id}']`,
      thumbContainer: "[js-product-thumbnails]",
      thumbGradient: ".product-thumbnails__end-cap-gradient",
      video: "video",
      videoPlayerContainer: "[js-video-player-container]",
      videoPoster: ".video-poster-container",
      viewInYourSpace: "[js-in-your-space]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    this.initActiveMedia();

    // Listen for variant change, handle media depending on media grouping setting
    this.addEventListener(
      EVENTS.PRODUCT_VARIANT_CHANGED,
      (event) => {
        if (event.detail.hasMediaGrouping) {
          this.handleRepaint(event);
        } else {
          this.updateActiveMainMediaToVariant(event);
        }
      },
      { signal: this.controller.signal },
    );

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_LOAD,
      this.handleLeftThumbnailContainerHeight(),
      {
        signal: this.controller.signal,
      },
    );
  }

  initActiveMedia() {
    this.media = this.querySelector(this.selectors.media);

    if (this.media === null) return

    this.activeMediaController = new AbortController();
    this.hasSingleMedia = this.dataset.hasSingleMedia === "true";

    this.mediaLayout = this.dataset.mediaLayout;
    this.mainMediaContainer = this.querySelector(
      this.selectors.mainMediaContainer,
    );
    this.initialMediaContainer = this.querySelector(
      this.selectors.initialMediaContainer,
    );

    // Setup media lightbox
    if (this.dataset.hasProductLightbox === "true") {
      setupMediaLightbox(this.mainMediaContainer);
    }

    // Setup model viewer
    setupModelViewer(this.mainMediaContainer);

    // Load video players
    this.videoPlayerContainers = this.querySelectorAll(
      this.selectors.videoPlayerContainer,
    );
    this.videoPlayerContainers.forEach((video) => liquidMadeVideoPlayer(video));

    //
    // Desktop carousel & all Mobile layouts
    //
    // Load thumbnail indicators
    if (this.mediaLayout === "thumbnails" && this.dataset.thumbnailPosition) {
      this.thumbnailPosition = this.dataset.thumbnailPosition;
    }

    if (!this.hasSingleMedia) {
      this.activeThumb = this.querySelector(this.selectors.activeThumb);
      this.activeMediaId = this.activeThumb.dataset.thumbnailId;
      this.scrollerId = this.dataset.scrollerId;

      // Listen for carousel sliding
      document.addEventListener(
        EVENTS.SCROLL_SLIDER_CHANGED(this.scrollerId),
        (event) => {
          const currentMediaEl = event.detail.currentElement;
          const previousMediaEl = event.detail.previousElement;
          this.mobileLoopButton = this.querySelector(
            this.selectors.mobileLoopButton,
          );

          if (currentMediaEl) {
            if (currentMediaEl !== this.mobileLoopButton) {
              this.updateActiveThumbnails(currentMediaEl.dataset.mediaItemId);
            }

            if (currentMediaEl.dataset.mediaType === "model") {
              this.initViewInYourSpace(currentMediaEl.dataset.mediaItemId);
            }
          }

          // Pause & Add poster back to any active iframes
          if (this.mediaLayout === "thumbnails") {
            if (currentMediaEl) {
              this.updateCarouselA11yNav(currentMediaEl);
            }

            if (previousMediaEl) {
              const prevMediaType = previousMediaEl.dataset.mediaType;

              if (
                prevMediaType === "external_video" ||
                prevMediaType === "video"
              ) {
                const injectedVideoIframe = previousMediaEl.querySelector(
                  this.selectors.iframe,
                );
                const injectedVideoElement = previousMediaEl.querySelector(
                  this.selectors.video,
                );

                if (injectedVideoIframe || injectedVideoElement) {
                  pausePlayingVideos();
                }
              }
            }
          }
        },
        { signal: this.activeMediaController.signal },
      );

      //
      // Desktop carousel layouts only
      //
      if (this.mediaLayout === "thumbnails") {
        this.initThumbnailListeners();

        // Set tabindex within carousels
        this.querySelectorAll(this.selectors.carouselTabIndex).forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
      }
    }
  }

  handleLeftThumbnailContainerHeight() {
    if (!this.initialMediaContainer) return

    this.videoPoster = this.querySelector(this.selectors.videoPoster);
    const initialMedia = this.initialMediaContainer.querySelector(
      this.selectors.media,
    );
    const mediaEl = this.videoPoster ? this.videoPoster : initialMedia;

    // Allow for slight delay to improve container height within T.E.
    setTimeout(() => {
      this.style.setProperty(
        "--left-thumbnail-container-height",
        `${mediaEl.offsetHeight}px`,
      );
    }, 0);
  }

  initThumbnailListeners() {
    // Listen for page loaded to get left thumbnail column height
    if (this.thumbnailPosition === "left") {
      const initialImg = this.initialMediaContainer.querySelector(
        this.selectors.image,
      );

      initialImg
        .decode()
        .then(() => {
          this.handleLeftThumbnailContainerHeight();
        })
        .then(() => {
          initialImg.classList.add("initial-image");
        });
    }

    const smallDesktop = 1023; // 1023 to make sure 1024 is properly styled
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw !== pvw && vw > smallDesktop) {
        this.handleLeftThumbnailContainerHeight();
      }
    });

    // Listen for thumbnail container scroll to apply gradients
    this.thumbContainer = this.querySelector(this.selectors.thumbContainer);
    this.thumbGradient = this.querySelector(this.selectors.thumbGradient);

    this.thumbContainer.addEventListener(
      "scroll",
      () => {
        this.updateThumbGradientOpacity();
      },
      {
        signal: this.activeMediaController.signal,
      },
    );

    // Listen for thumbnail clicks
    this.thumbnailItems = this.querySelectorAll(this.selectors.thumb);
    this.thumbnailItems.forEach((item) => {
      item.addEventListener(
        "click",
        () => {
          this.updateActiveMainMedia(parseInt(item.dataset.thumbnailIndex));
          this.updateActiveThumbnails(item.dataset.thumbnailId);
        },
        { signal: this.activeMediaController.signal },
      );
    });
  }

  initViewInYourSpace(currentActiveMediaId) {
    this.querySelector(this.selectors.viewInYourSpace).setAttribute(
      "data-shopify-model3d-id",
      currentActiveMediaId,
    );
  }

  updateActiveMainMedia(currentThumbnailIndex) {
    const isDesktopViewport =
      (window.innerWidth || document.documentElement.clientWidth) > 1024;

    if (isDesktopViewport && this.mediaLayout === "columns") {
      const featuredMediaEl = this.querySelector(
        `${this.selectors.mediaById(currentThumbnailIndex)}`,
      );

      featuredMediaEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }

    // Scroll slider event included for Column layouts for mobile carousel coverage
    document.dispatchEvent(
      new CustomEvent(EVENTS.SCROLL_SLIDER_GO_TO_SLIDE(this.scrollerId), {
        detail: {
          slideIndex: currentThumbnailIndex,
          behavior: "instant",
        },
      }),
    );
  }

  updateActiveMainMediaToVariant(event) {
    const newMediaId = event.detail.newFeaturedMedia;
    this.mediaItemWrappers = this.querySelectorAll(
      this.selectors.mediaItemWrapper,
    );

    let newMediaIndex;
    for (const media of this.mediaItemWrappers) {
      if (media.dataset.mediaItemId === newMediaId) {
        newMediaIndex = parseInt(media.dataset.slideIndex);
        break
      }
    }

    this.updateActiveMainMedia(newMediaIndex);
  }

  updateActiveThumbnails(currentActiveMediaId) {
    const lastActiveThumbnail = this.querySelector(this.selectors.activeThumb);

    let activeThumbnail = this.querySelector(
      `${this.selectors.thumbById(currentActiveMediaId)}`,
    );

    // Media grouping may create null activeThumbnails
    if (activeThumbnail === null) {
      const firstMediaId = this.querySelector(this.selectors.media).dataset
        .mediaId;

      activeThumbnail = this.querySelector(
        `${this.selectors.thumbById(firstMediaId)}`,
      );
    }

    if (activeThumbnail !== lastActiveThumbnail) {
      // Add and remove active thumbnail indicator
      activeThumbnail.classList.add("active");
      lastActiveThumbnail.classList.remove("active");
      this.activeMediaId = currentActiveMediaId;

      // Scroll active thumbnail into view
      if (this.mediaLayout === "thumbnails") {
        const scrollAttribute =
          this.thumbnailPosition === "left" ? "scrollTop" : "scrollLeft";

        const scrollDistance =
          this.thumbnailPosition === "left"
            ? activeThumbnail.offsetTop -
              activeThumbnail.getBoundingClientRect().height * 2
            : activeThumbnail.offsetLeft -
              activeThumbnail.getBoundingClientRect().width * 2;

        this.thumbContainer[scrollAttribute] = scrollDistance;
      }
    }
  }

  updateThumbGradientOpacity() {
    let beforeOpacity = 0;
    let afterOpacity = 1;

    if (this.thumbnailPosition === "left") {
      if (this.thumbContainer.scrollTop !== 0) {
        beforeOpacity = 1;
      }

      const thumbContainerScrollHeight =
        this.thumbContainer.scrollHeight - this.thumbGradient.offsetHeight;
      const thumbContainerMaxScroll = this.thumbContainer.scrollTop + 1;
      if (thumbContainerMaxScroll >= thumbContainerScrollHeight) {
        afterOpacity = 0;
      }
    } else if (this.thumbnailPosition === "below") {
      if (this.thumbContainer.scrollLeft !== 0) {
        beforeOpacity = 1;
      }

      const thumbContainerScrollWidth =
        this.thumbContainer.scrollWidth - this.thumbGradient.offsetWidth;
      const thumbContainerMaxScroll = this.thumbContainer.scrollLeft + 1;

      if (thumbContainerMaxScroll >= thumbContainerScrollWidth) {
        afterOpacity = 0;
      }
    }

    this.thumbGradient.style.setProperty(
      "--thumb-opacity-before",
      beforeOpacity,
    );
    this.thumbGradient.style.setProperty("--thumb-opacity-after", afterOpacity);
  }

  updateCarouselA11yNav(currentActiveMediaEl) {
    this.allTabIndexEls = this.querySelectorAll(this.selectors.carouselTabIndex);
    this.currentTabIndexEls = currentActiveMediaEl.querySelectorAll(
      this.selectors.carouselTabIndex,
    );

    this.allTabIndexEls.forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });

    this.currentTabIndexEls.forEach((el) => {
      el.removeAttribute("tabindex");
    });
  }

  handleRepaint(event) {
    // In the case that Media Grouping image order creates conflicts, prevent repaint
    if (event.detail.mediaSize > 0) {
      this.activeMediaController.abort();
      this.controller.abort();
      this.connectedCallback();
      this.initActiveMedia();
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-media")) {
  customElements.define("product-media", ProductMedia);
}
