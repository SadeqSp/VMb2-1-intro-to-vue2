var eventBus = new Vue()

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
                
                <detail-tab :shipping="shipping" :details="details"></detail-tab>

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

            <product-tabs :reviews="reviews"></product-tabs>

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
            ],
            reviews: []
        }
    },
    methods: {               
        addToCart: function() {             
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)   
        },
        updateProduct(index) {       
            this.selectedVariant = index
        },
        decCart() {
            this.$emit('del-from-cart', this.variants[this.selectedVariant].variantId)
        }
    },
    computed: {     
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
    },
    mounted() { // a place to put code that you want to run as soon as the component is mounted to the DOM
        eventBus.$on('review-submitted', productReview => { // eventBus is listening to the 'review-submitted' event 
                                                            // then it will take 'productReview' and do the 'push'
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: /*html*/ `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>errors:</b>
                <ul><li v-for="error in errors">{{ error }}</li></ul>
            </p>

            <p>
                <label for="name">name: </label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="review">review: </label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">rating: </label>
                <select id="rating" v-model.number="rating">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </p>
            <p>
                <label>
                    YES
                    <input type="radio" value="yes" v-model="recom">
                </label>
                <label for="no">NO</label>
                <input id="no" type="radio" value="no" v-model="recom">
            </p>
            <p><input type="submit" value="submit"></p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recom: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) { 
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recom: this.recom
                }
                // sending tha submitted value to its parent (product component)
                eventBus.$emit('review-submitted', productReview)
                // reset tha value after submit
                this.name = null
                this.review = null
                this.rating = null
                this.recom = null
            }
            else {
                if(!this.name) this.errors.push("name required")
                if(!this.review) this.errors.push("say somthing")
                if(!this.rating) this.errors.push("you have to rate")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {          // for accepting 'reviews' as a prop from '<product-tabs :reviews="reviews">'
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span   class="tab"
                    :class="{activeTab: selectedTab === tab}" 
                    v-for="(tab, index) in tabs" 
                    :key="index"
                    @click="selectedTab = tab">
                    {{ tab }}</span>

            <div v-show="selectedTab === 'reviews'">
                <h2>Review</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }} / {{ review.review }} / rating: {{ review.rating }} / recom: {{ review.recom }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'make a review'"></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['reviews', 'make a review'],
            selectedTab: "reviews"
        }
    }
})

// challenge
Vue.component('detail-tab', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: /*html*/ `
        <div>
            <span   class="tab"
                    :class="{activeTab: selectedTab === tab}" 
                    v-for="(tab, index) in tabs" 
                    :key="index"
                    @click="selectedTab = tab">
                    {{ tab }}</span>
            <div v-show="selectedTab === 'shipping'">
                <p>shipping: {{ shipping }}</p>
            </div>
            <div v-show="selectedTab === 'details'">
                <product-details :details="details"></product-details>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['shipping', 'details'],
            selectedTab: 'shipping'
        }
    }

})

// define 'app' after 'component'
var app = new Vue({         
    el: '#app',
    data: {
        premium: true,
        cart: []
    }, 
    methods: {
        updateCart(id) {
            this.cart.push(id)
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