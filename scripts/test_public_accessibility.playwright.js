async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const isFocused = locator => locator.evaluate(element => document.activeElement === element);
  const lightbox = page.locator("#lightbox");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${origin}/#read`);

  const libraryNav = page.locator(".nav-library");
  assert(await libraryNav.count() === 1, "library nav");
  await libraryNav.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.location.hash === "#library");
  assert(await page.locator("#library").isVisible(), "library section visibility");

  const libraryLink = page.getByRole("link", {
    name: "\ube44\ub808\uc2a4 5083 \uc774\uc57c\uae30 \uc11c\uace0\ub97c \uc0c8 \ucc3d\uc5d0\uc11c \uc5f4\uae30",
    exact: true
  });
  assert(await libraryLink.count() === 1, "library accessible link");
  assert(
    await libraryLink.getAttribute("href") ===
      "https://vireth-starting-records.musueman.chatgpt.site/reader",
    "library canonical href"
  );
  assert(await libraryLink.getAttribute("target") === "_blank", "library target");
  assert(
    (await libraryLink.getAttribute("rel"))?.split(/\s+/).includes("noopener"),
    "library rel"
  );

  await page.goto(`${origin}/#read`);
  await page.locator("details.reader-chapter").first().locator("summary").click();

  const readerTrigger = page.locator(".reader-image-trigger").first();
  await readerTrigger.waitFor();
  assert(
    await readerTrigger.evaluate(element => element.tagName === "BUTTON"),
    "reader trigger semantics"
  );
  await page.evaluate(() => {
    document.body.style.overflow = "auto";
  });
  await readerTrigger.focus();
  await page.keyboard.press("Enter");
  await lightbox.waitFor({ state: "visible" });

  assert(await lightbox.getAttribute("aria-modal") === "true", "aria-modal");
  assert(
    await lightbox.evaluate(element => element.contains(document.activeElement)),
    "dialog entry focus"
  );

  const dialogButtons = lightbox.locator("button:visible:not([disabled])");
  const firstDialogButton = dialogButtons.first();
  const lastDialogButton = dialogButtons.last();
  assert(await dialogButtons.count() >= 2, "dialog controls");

  await firstDialogButton.focus();
  await page.keyboard.press("Shift+Tab");
  assert(await isFocused(lastDialogButton), "Shift+Tab wrap");

  await lastDialogButton.focus();
  await page.keyboard.press("Tab");
  assert(await isFocused(firstDialogButton), "Tab wrap");

  await page.keyboard.press("Escape");
  await lightbox.waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.activeElement?.classList.contains("reader-image-trigger"));
  assert(await isFocused(readerTrigger), "reader focus restore");
  assert(
    await page.evaluate(() => document.body.style.overflow) === "auto",
    "reader scroll restore"
  );

  await page.goto(`${origin}/glossary.html`);
  const glossarySearch = page.getByLabel("\uace0\uc720\uba85\uc0ac \uac80\uc0c9", { exact: true });
  assert(await glossarySearch.count() === 1, "search label");
  assert(
    await glossarySearch.evaluate(element => element.id === "glossarySearch"),
    "search label target"
  );

  return "PUBLIC_LIGHTBOX_ACCESSIBILITY_OK";
}
