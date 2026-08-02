async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  for (const viewport of [
    { width: 390, height: 900 },
    { width: 768, height: 1024 },
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
      const intersectionHeight = (first, second) => Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
      const intersects = (first, second) => first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
      const opaqueTop = selector => {
        const image = document.querySelector(selector);
        const rect = image.getBoundingClientRect();
        return rect.top + (24 / image.naturalHeight) * rect.height;
      };
      const ren = bounds(".guide-portrait.ren img");
      const duran = bounds(".guide-portrait.duran img");
      const guideLayer = bounds(".hero-guides");
      const heroCopy = bounds(".hero-copy");
      const captions = [bounds(".ren-profile"), bounds(".duran-profile")];
      return {
        ren,
        duran,
        guideLayer,
        heroCopy,
        captions,
        headTopDelta: Math.abs(opaqueTop(".guide-portrait.ren img") - opaqueTop(".guide-portrait.duran img")),
        intersectsCopy: [intersects(ren, heroCopy), intersects(duran, heroCopy)],
        figureTopOccupancy: [(ren.top - guideLayer.top) / guideLayer.height, (duran.top - guideLayer.top) / guideLayer.height],
        visibleOccupancy: [intersectionHeight(ren, guideLayer) / guideLayer.height, intersectionHeight(duran, guideLayer) / guideLayer.height]
      };
    });
    const heightRatio = guides.ren.height / guides.duran.height;
    assert(heightRatio >= 1.18 && heightRatio <= 1.24, `portrait height ratio ${viewport.width}: ${heightRatio.toFixed(3)}`);
    assert(guides.headTopDelta <= 12, `portrait head-top delta ${viewport.width}: ${guides.headTopDelta.toFixed(1)}px`);
    assert(guides.intersectsCopy.every(intersects => !intersects), `portrait overlaps copy ${viewport.width}`);
    if (viewport.width <= 1000) {
      assert(guides.guideLayer.top >= guides.heroCopy.bottom, `guide layer is not stacked below copy ${viewport.width}`);
    }
    assert(guides.figureTopOccupancy.every(occupancy => occupancy >= 0 && occupancy <= 0.35), `guide figure start ${viewport.width}: ${guides.figureTopOccupancy.map(occupancy => occupancy.toFixed(2)).join(",")}`);
    assert(guides.visibleOccupancy.every(occupancy => occupancy >= 0.68), `guide figure occupancy ${viewport.width}: ${guides.visibleOccupancy.map(occupancy => occupancy.toFixed(2)).join(",")}`);
    for (const [index, profile] of guides.captions.entries()) {
      assert(profile.width > 0 && profile.height > 0, `profile dimensions ${viewport.width}:${index}`);
      assert(profile.right > 0 && profile.left < viewport.width && profile.bottom > 0 && profile.top < viewport.height, `profile visibility ${viewport.width}:${index}`);
      const portrait = index === 0 ? guides.ren : guides.duran;
      assert(profile.top >= portrait.top + portrait.height * 0.6, `caption obscures upper portrait ${viewport.width}:${index}`);
    }
    if (viewport.width <= 680) {
      assert(guides.ren.height >= 340, `Ren mobile height ${guides.ren.height.toFixed(1)}px`);
      assert(guides.duran.height >= 280, `Duran mobile height ${guides.duran.height.toFixed(1)}px`);
    }
  }

  return "PUBLIC_RESPONSIVE_CONTRACT_OK";
}
