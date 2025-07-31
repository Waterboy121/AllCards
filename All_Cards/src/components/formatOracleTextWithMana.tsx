// src/components/formatOracleTextWithMana.ts
export function formatOracleTextWithMana(text?: string): string {
    if (!text) return "";

  // Replace all mana symbols like {G}, {2/W}, etc.
    return text.replace(/\{([^}]+)\}/g, (match, symbol) => {
    const clean = encodeURIComponent(symbol.toUpperCase());
    const imgUrl = `https://svgs.scryfall.io/card-symbols/${clean}.svg`;

    return `<img src="${imgUrl}" alt="{${symbol}}" title="{${symbol}}" style="width:1.2em; height:1.2em; vertical-align:middle; margin-right:0.15em;" />`;
    });
}