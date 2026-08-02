async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  for (const viewport of [
    { width: 390, height: 900 },
    { width: 1280, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${origin}/`);
    await page.locator(".region-button").first().waitFor();

    assert(await page.locator(".region-button").count() === 20, `regions ${viewport.width}`);
    assert(await page.locator("details.reader-chapter").count() === 6, `chapters ${viewport.width}`);
    assert(await page.locator("details.start-scenario").count() === 6, `starts ${viewport.width}`);
    assert(await page.locator("figure.start-comic").count() === 3, `comics ${viewport.width}`);

    const layout = await page.evaluate(() => ({
      rootClient: document.documentElement.clientWidth,
      rootScroll: document.documentElement.scrollWidth,
      bodyScroll: document.body.scrollWidth
    }));
    assert(layout.rootScroll <= layout.rootClient + 1, `root overflow ${viewport.width}`);
    assert(layout.bodyScroll <= layout.rootClient + 1, `body overflow ${viewport.width}`);

    const guides = await page.evaluate(() => {
      const bounds = selector => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      const opaqueTop = selector => {
        const image = document.querySelector(selector);
        const rect = image.getBoundingClientRect();
        return rect.top + (24 / image.naturalHeight) * rect.height;
      };
      const ren = bounds(".guide-portrait.ren img");
      const duran = bounds(".guide-portrait.duran img");
      return {
        ren,
        duran,
        headTopDelta: Math.abs(opaqueTop(".guide-portrait.ren img") - opaqueTop(".guide-portrait.duran img")),
        profileRects: [bounds(".ren-profile"), bounds(".duran-profile")]
      };
    });
    const heightRatio = guides.ren.height / guides.duran.height;
    assert(heightRatio >= 1.18 && heightRatio <= 1.24, `portrait height ratio ${viewport.width}: ${heightRatio.toFixed(3)}`);
    assert(guides.headTopDelta <= 12, `portrait head-top delta ${viewport.width}: ${guides.headTopDelta.toFixed(1)}px`);
    for (const [index, profile] of guides.profileRects.entries()) {
      assert(profile.width > 0 && profile.height > 0, `profile dimensions ${viewport.width}:${index}`);
      assert(profile.right > 0 && profile.left < viewport.width && profile.bottom > 0 && profile.top < viewport.height, `profile visibility ${viewport.width}:${index}`);
    }
  }

  return "PUBLIC_RESPONSIVE_CONTRACT_OK";
}
