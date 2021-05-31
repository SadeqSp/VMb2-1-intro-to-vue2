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
                <button @click="decCart">delete</button>
            </div>
        </div>
    `,
    data() {        
        return {
            brand: 'Vue Mastery',    
            product: 'Socks',
            selectedVariant: 0,         
            details: ["80% cotton", "20% polyester", "Gender-natural"], 
            variants: [
                {variantId: 2234, variantColor: "green", variantImage: './assets/g.jpg', variantQuantity: 10}, 
                {variantId: 2235, variantColor: "blue",  variantImage: './assets/b.jpg',  variantQuantity: 5}
            ]
        }
    },
    methods: {      // just like Vue/app         
        addToCart: function() {             
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)   
                                        // ** the second param will be added (and explained) later in lesson
                                        // at first we dont have it

                                        // 1  -  emitting an event ('add-to-cart' is the name of the new event > using in html)
                                        // we should let the parent [the app] know if the button is clicked (because the cart is no longer in compoenent but in 'app')
                                        // by click on btn > do 'addToCart' [in component's template]
                                        // the 'addToCart' is emitted to 'add-to-cart' event
                                        // in [app] > when the 'add-to-cart'/event happens > do the 'updateCart' [a method from the app]
                                        // so if we have more than one instance of our 'product' component all click changes our only CART

                                        // 2  - by adding variantId 9as the 2nd param) we get the id of added product and send it to 'updateCart'/method  
                                        // by now the id of added product will be added to 'cart'/array
                                        // but this isn't good 
                                        //  so we show the length of our array in HTML not the whole array >> {{ cart.length }}
                                        // then we can see the added product's ids in chrome's Vue.devTool
        },
        updateProduct(index) {       
            this.selectedVariant = index
        },
        decCart() {
            this.$emit('del-from-cart', this.variants[this.selectedVariant].variantId)
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
        premium: true,          
        //cart: 0       // this the old version (beginning of lesson)
                        // for knowing wich item is added to cart we use an array instead of '0' (next line)
        cart: []        // then in the methods (cont.: below)
    }, 
    methods: {
        updateCart(id) {
            this.cart.push(id)      // we push the id of added product 
                                    // now we should send 'id' to this method from our component when emitting the 'add-to-cart' event
        }, 
        deleteFrom(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                   this.cart.splice(i, 1);
                }
            }   
        }
    }
})