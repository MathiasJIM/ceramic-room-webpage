document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".gallery__carousel .carousel__track");
  const slides = Array.from(
    document.querySelectorAll(".gallery__carousel .carousel__slide img")
  );
  const lightbox = document.getElementById("lightbox");

  if (!track || !lightbox || !slides.length) {
    return;
  }

  const lightboxImage = lightbox.querySelector(".lightbox__image");
  const closeButton = lightbox.querySelector(".lightbox__close");
  const prevButton = lightbox.querySelector(".lightbox__nav--prev");
  const nextButton = lightbox.querySelector(".lightbox__nav--next");
  const backdrop = lightbox.querySelector("[data-lightbox-close]");
  const counter = lightbox.querySelector(".lightbox__counter");
  let currentIndex = 0;
  let startX = 0;

  const updateLightbox = () => {
    lightboxImage.src = slides[currentIndex].src;
    lightboxImage.alt = slides[currentIndex].alt || "Imagen ampliada";
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
  };

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateLightbox();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateLightbox();
  };

  track.addEventListener("click", (event) => {
    const img = event.target.closest("img");
    if (!img) {
      return;
    }
    const index = slides.indexOf(img);
    if (index === -1) {
      return;
    }
    openLightbox(index);
  });

  closeButton.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", showPrev);
  nextButton.addEventListener("click", showNext);

  lightboxImage.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }
      startX = event.touches[0].clientX;
    },
    { passive: true }
  );

  lightboxImage.addEventListener("touchend", (event) => {
    if (!startX) {
      return;
    }
    const endX = event.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showPrev();
      } else {
        showNext();
      }
    }
    startX = 0;
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      showPrev();
    }
    if (event.key === "ArrowRight") {
      showNext();
    }
  });
});
