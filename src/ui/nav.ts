export function initNav(): void {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const burger = document.querySelector<HTMLButtonElement>("[data-burger]");
  const mobile = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-btn]");
  const menuItem = menuBtn?.closest(".nav__item");
  if (!nav) return;

  let lastY = window.scrollY;

  const menuOpen = () => burger?.getAttribute("aria-expanded") === "true";

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-frost", y > 20);
    const goingDown = y > lastY && y > 120;
    nav.classList.toggle("is-hide", goingDown && !menuOpen());
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger?.addEventListener("click", () => {
    const open = menuOpen();
    burger.setAttribute("aria-expanded", String(!open));
    burger.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    if (mobile) mobile.hidden = open;
    nav.classList.remove("is-hide");
  });

  mobile?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (!burger || !mobile) return;
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      mobile.hidden = true;
    });
  });

  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    menuItem?.classList.toggle("is-open", !open);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    menuBtn?.setAttribute("aria-expanded", "false");
    menuItem?.classList.remove("is-open");
    if (burger && mobile) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      mobile.hidden = true;
    }
  });

  document.addEventListener("click", (e) => {
    if (!menuItem || menuItem.contains(e.target as Node)) return;
    menuBtn?.setAttribute("aria-expanded", "false");
    menuItem.classList.remove("is-open");
  });
}
