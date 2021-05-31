Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: /*html*/ `
        <div class="product">

            <div class="product-image">
                <img v-bind:src="image">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>User is premium: {{ premium }}</p>
                <p>shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)">
                </div>

                <button v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                        >add to cart</button>
                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>

            </div>

        </div>
    `,
    data() {        // 'data' is now a function that returns data
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,      
            details: ["80% cotton", "20% polyester", "Gender-natural"],     // this data will be send like 'premium' (from app) as value in <product-details>
            variants: [
                {variantId: 2234, variantColor: "green", variantImage: './assets/g.jpg', variantQuantity: 10},
                {variantId: 2235, variantColor: "blue",  variantImage: './assets/b.jpg',  variantQuantity: 0}
            ],
            cart: 0
        }
    },
    methods: {      // just like Vue/app         
        addToCart: function() {             
            this.cart += 1
        },
        updateProduct(index) {       
            this.selectedVariant = index
        }
    },
    computed: {     // just like Vue/app
        title() {   
            return this.brand + ' ' + this.product
        }, 
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if(this.premium) {
                return "FREE"
            }
            return 2.99
        }
    }
})

// define 'app' after 'component'
var app = new Vue({         
    el: '#app',
    data: {
        premium: true   // [HTML > :premium(prop)="premium(this data)"]
                        // < this data will be send as a value for 'premium'/attr, to the component's prop  
                        // then be used in template  >>  <p>{{ premium }}</p> 
    }
})