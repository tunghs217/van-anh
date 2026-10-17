const tour = document.querySelector(".tour");
const progress = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const nextButton = document.querySelector(".next-button");

if (!(tour instanceof HTMLElement) || !(progress instanceof HTMLElement) || !(progressFill instanceof HTMLElement) || !(nextButton instanceof HTMLButtonElement)) {
  throw new Error("The panorama controls could not be initialized.");
}

const updateProgress = () => {
  const maxScroll = tour.scrollWidth - tour.clientWidth;
  const percentage = maxScroll > 0 ? (tour.scrollLeft / maxScroll) * 100 : 0;

  progressFill.style.width = `${percentage}%`;
  progress.setAttribute("aria-valuenow", String(Math.round(percentage)));
  nextButton.disabled = maxScroll === 0 || tour.scrollLeft >= maxScroll - 24;
  nextButton.setAttribute("aria-label", nextButton.disabled ? "End of the room tour" : "Scroll right to explore");
};

const scrollToScene = (target) => {
  const maxScroll = tour.scrollWidth - tour.clientWidth;
  const left = target === tour ? 0 : target.offsetLeft - (tour.clientWidth - target.clientWidth) / 2;

  tour.scrollTo({ left: Math.max(0, Math.min(left, maxScroll)), behavior: "smooth" });
};

document.querySelectorAll(".skip-link[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.hash.slice(1));

    if (target !== tour && !(target instanceof HTMLElement && tour.contains(target))) {
      return;
    }

    event.preventDefault();
    if (window.location.hash !== link.hash) {
      window.history.pushState(null, "", link.hash);
    }
    scrollToScene(target);
  });
});

tour.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

tour.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    event.preventDefault();
    tour.scrollLeft += event.deltaY;
  }
}, { passive: false });

tour.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    tour.scrollBy({
      left: event.key === "ArrowRight" ? tour.clientWidth * 0.72 : -tour.clientWidth * 0.72,
      behavior: "smooth",
    });
  }
});

nextButton.addEventListener("click", () => {
  tour.scrollBy({ left: tour.clientWidth * 0.78, behavior: "smooth" });
});

const initialScene = document.getElementById(window.location.hash.slice(1));
if (initialScene === tour || (initialScene instanceof HTMLElement && tour.contains(initialScene))) {
  const maxScroll = tour.scrollWidth - tour.clientWidth;
  const left = initialScene === tour ? 0 : initialScene.offsetLeft - (tour.clientWidth - initialScene.clientWidth) / 2;
  tour.scrollLeft = Math.max(0, Math.min(left, maxScroll));
}

updateProgress();
