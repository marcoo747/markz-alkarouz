import namer from "color-namer";

export function getSafeColorCss(colorValue) {
    if (!colorValue) return "";
    if (typeof colorValue === "string") return colorValue.trim();
    if (typeof colorValue === "object") {
        return String(colorValue.hex_code || colorValue.color || "").trim();
    }
    return "";
}

export function getSafeColorName(colorValue, palette = "basic") {
    const cssColor = getSafeColorCss(colorValue);
    if (!cssColor) return "";

    try {
        const result = namer(cssColor);
        const list = result?.[palette] || result?.basic || result?.ntc;
        return list?.[0]?.name || cssColor;
    } catch {
        return cssColor;
    }
}
