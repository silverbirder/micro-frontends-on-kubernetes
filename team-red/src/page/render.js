function renderOption(variant, sku) {
    const active = sku === variant.sku ? 'active' : '';
    return `
    <a href="/${variant.sku}" class="${active}" type="button" data-sku="${variant.sku}">
      <img src="${variant.thumb}" alt="${variant.name}" />
    </a>
  `;
}

export default function renderPage(variants, sku = 't_porsche') {
    const variant = variants.find(v => sku === v.sku);
    if (!variant) {
        return '<pre>no product not found</pre>';
    }
    return `
    <h1 id="store">The Model Store</h1>
    <blue-basket id="basket"><!--#include virtual="/blue-basket" --></blue-basket>
    <div id="image"><div><img src="${variant.image}" alt="${variant.sku_name}" /></div></div>
    <h2 id="name">${variant.sku} <small>${variant.sku_name}</small></h2>
    <div id="options">${variants.map(v => renderOption(v, sku)).join('')}</div>
    <blue-buy id="buy" price="${variant.price}"><!--#include virtual="/blue-buy?price=${encodeURIComponent(variant.price)}" --></blue-buy>
    <green-recos id="reco" sku="${variant.sku}"><!--#include virtual="/green-recos?sku=${encodeURIComponent(variant.sku)}" --></green-recos>
  `;
}
