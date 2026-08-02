async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const isFocused = locator => locator.evaluate(element => document.activeElement === element);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${origin}/#images`);

  const slider = page.locator("#sceneSlider");
  const slideCount = slider.locator(".slide-count");
  const nextControl = slider.locator(".slide-control.next");
  const previousControl = slider.locator(".slide-control.prev");
  const imageTrigger = slider.locator(".slide-image-trigger");
  const lightbox = page.locator("#lightbox");

  await imageTrigger.waitFor();
  assert(
    await imageTrigger.evaluate(element => element.tagName === "BUTTON"),
    "gallery trigger semantics"
  );

  const initialCount = (await slideCount.textContent()).trim();
  await nextControl.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    previous => document.querySelector("#sceneSlider .slide-count")?.textContent.trim() !== previous,
    initialCount
  );
  assert(await isFocused(nextControl), "next focus continuity");

  await previousControl.focus();
  await page.keyboard.press("Space");
  await page.waitForFunction(
    expected => document.querySelector("#sceneSlider .slide-count")?.textContent.trim() === expected,
    initialCount
  );
  assert(await isFocused(previousControl), "previous focus continuity");

  await imageTrigger.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    previous => document.querySelector("#sceneSlider .slide-count")?.textContent.trim() !== previous,
    initialCount
  );
  assert(await isFocused(imageTrigger), "arrow focus continuity");

  await page.evaluate(() => {
    document.body.style.overflow = "scroll";
  });
  await imageTrigger.focus();
  await page.keyboard.press("Space");
  await lightbox.waitFor({ state: "visible" });
  assert(
    await lightbox.evaluate(element => element.contains(document.activeElement)),
    "gallery dialog entry focus"
  );
  await page.keyboard.press("Escape");
  await lightbox.waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.activeElement?.classList.contains("slide-image-trigger"));
  assert(await isFocused(imageTrigger), "gallery focus restore");
  assert(
    await page.evaluate(() => document.body.style.overflow) === "scroll",
    "gallery scroll restore"
  );

  return "PUBLIC_CAROUSEL_ACCESSIBILITY_OK";
}
