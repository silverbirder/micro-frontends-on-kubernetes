/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */
import render from './render';

class BlueBuy extends HTMLElement {
    static get observedAttributes() {
        return ['price'];
    }

    connectedCallback() {
        this.addToCart = this.addToCart.bind(this);
        const price = this.getAttribute('price');
        this.log('connected', price);
        this.render();
        this.firstChild.addEventListener('click', this.addToCart);
    }

    addToCart() {
        window.blue.count += 1;
        this.log('event sent "blue:basket:changed"');
        this.dispatchEvent(new CustomEvent('blue:basket:changed', {
            bubbles: true,
        }));
    }

    render() {
        const price = this.getAttribute('price');
        this.innerHTML = render(price);
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this.log('attributeChanged', attr, oldValue, newValue);
        this.render();
    }

    disconnectedCallback() {
        this.firstChild.removeEventListener('click', this.addToCart);
        const price = this.getAttribute('price');
        this.log('disconnected', price);
    }

    log(...args) {
        console.log('🔘 blue-buy', ...args);
    }
}

export default BlueBuy;
