async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const intersects = (first, second) => first[0] < second[2] && first[2] > second[0] && first[1] < second[3] && first[3] > second[1];
  const contains = (outer, inner) => inner[0] >= outer[0] && inner[1] >= outer[1] && inner[2] <= outer[2] && inner[3] <= outer[3];

  for (const [width, height] of [[320, 960], [360, 960], [390, 900], [768, 1024], [1100, 900], [1180, 900], [1280, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${origin}/`);
    await page.locator(".region-button").first().waitFor();
    for (const [selector, count] of [[".region-button", 20], ["details.reader-chapter", 6], ["details.start-scenario", 6], ["figure.start-comic", 3]]) {
      assert(await page.locator(selector).count() === count, `content ${width}`);
    }

    const state = await page.evaluate(() => {
      const box = selector => {
        const { left, top, right, bottom, width, height } = document.querySelector(selector).getBoundingClientRect();
        return [left, top, right, bottom, width, height];
      };
      const portrait = selector => {
        const image = document.querySelector(selector);
        const bounds = box(selector);
        const trimX = (24 / image.naturalWidth) * bounds[4];
        const trimY = (24 / image.naturalHeight) * bounds[5];
        return { box: bounds, opaque: [bounds[0] + trimX, bounds[1] + trimY, bounds[2] - trimX, bounds[3] - trimY] };
      };
      const ren = portrait(".guide-portrait.ren img");
      const duran = portrait(".guide-portrait.duran img");
      const guides = box(".hero-guides");
      const visible = portrait => Math.max(0, Math.min(portrait.box[3], guides[3]) - Math.max(portrait.box[1], guides[1])) / guides[5];
      return {
        ren,
        duran,
        guides,
        copy: box(".hero-copy"),
        hero: box(".hero"),
        profiles: [box(".ren-profile"), box(".duran-profile")],
        headDelta: Math.abs(ren.opaque[1] - duran.opaque[1]),
        top: [(ren.box[1] - guides[1]) / guides[5], (duran.box[1] - guides[1]) / guides[5]],
        visible: [visible(ren), visible(duran)],
        scroll: [document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.scrollWidth]
      };
    });

    assert(state.scroll[1] <= state.scroll[0] + 1 && state.scroll[2] <= state.scroll[0] + 1, `overflow ${width}`);
    assert(state.ren.box[5] / state.duran.box[5] >= 1.18 && state.ren.box[5] / state.duran.box[5] <= 1.24, `portrait ratio ${width}`);
    assert(state.headDelta <= 12, `head alignment ${width}`);
    assert(!intersects(state.ren.box, state.copy) && !intersects(state.duran.box, state.copy), `portrait overlaps copy ${width}`);
    assert(!intersects(state.ren.opaque, state.duran.opaque), `opaque portraits overlap ${width}`);
    if (width <= 1180) assert(state.guides[1] >= state.copy[3], `guides not stacked ${width}`);
    assert(state.top.every(value => value >= 0 && value <= 0.35), `guide start ${width}`);
    assert(state.visible.every(value => value >= 0.68), `guide occupancy ${width}`);
    assert(!intersects(state.profiles[0], state.profiles[1]), `profiles overlap ${width}`);
    for (const [index, profile] of state.profiles.entries()) {
      const portrait = index ? state.duran.box : state.ren.box;
      assert(profile[4] > 0 && profile[5] > 0 && contains(state.hero, profile) && profile[0] >= 0 && profile[2] <= width, `profile containment ${width}:${index}`);
      assert(profile[1] >= portrait[1] + portrait[5] * 0.6, `caption obscures upper portrait ${width}:${index}`);
    }
    if (width > 360 && width <= 680) {
      assert(state.ren.box[5] >= 340 && state.duran.box[5] >= 280, `mobile portrait size ${width}`);
    }
  }

  return "PUBLIC_RESPONSIVE_CONTRACT_OK";
}
