async page => {
  const origin = "__BASE_URL__";
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  for (const viewport of [
    { width: 390, height: 844 },
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
  }

  return "PUBLIC_RESPONSIVE_CONTRACT_OK";
}
