var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: './assets/g.jpg',
        inStock: true,
        details: ["80% cotton", "20% polyester", "Gender-natural"],
        variants: [
            {variantId: 2234, variantColor: "green", variantImage: './assets/g.jpg'},
            {variantId: 2235, variantColor: "blue",  variantImage: './assets/b.jpg'}
        ],
        cart: 0
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(variantImage) {
            this.image = variantImage
        }
    }
})