export function renderManaCost(manaCost?: string) {
    if (!manaCost) return null;
    const symbols = manaCost.match(/\{([^}]+)\}/g) || [];

    return symbols.map((symbol, index) => {
    const clean = symbol.replace(/[{}]/g, "").toUpperCase(); // use uppercase

    const encoded = encodeURIComponent(clean); // handles hybrid like 2/W
    const url = `https://svgs.scryfall.io/card-symbols/${encoded}.svg`;

    return (
        <img
        key={index}
        src={url}
        alt={symbol}
        title={symbol}
        style={{ width: "1.5em", height: "1.5em", marginRight: "0.2em" }}
        />
    );
});
}