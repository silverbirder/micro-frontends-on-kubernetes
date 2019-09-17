import fetch from 'node-fetch';

// stores already requested data
let loadedProducts = {};

export default function redFetch() {
    return new Promise((resolve, reject) => {
        const products = loadedProducts;
        if (Object.keys(products).length != 0) {
            resolve(loadedProducts);
        } else {
            fetch(`http://localhost:3003/red/api/products`).then((response) => {
                response.json().then(data => {
                    loadedProducts = data;
                    resolve(data);
                });
            }, reject);
        }
    });
}
