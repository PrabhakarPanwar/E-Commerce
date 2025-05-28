// JavaScript code for the website
// Loading animation

document.addEventListener('DOMContentLoaded', function() {
    // Show loading animation
    document.getElementById('load').classList.add('show');
    
    // Get the current time
    const startTime = Date.now();
    
    // Hide loading animation when page is fully loaded, but ensure it shows for at least 2 seconds
    window.addEventListener('load', function() {
        const loadTime = Date.now() - startTime;
        const minDisplayTime = 1000; // 1 seconds minimum
        const maxDisplayTime = 2000; // 2 seconds maximum
        
        // Calculate remaining time to show the loader
        const remainingTime = Math.min(
            Math.max(minDisplayTime - loadTime, 0),
            maxDisplayTime - loadTime
        );
        
        // Hide the loader after the remaining time
        setTimeout(function() {
            document.getElementById('load').classList.remove('show');
        }, remainingTime);
    });
}); 

/*Hamburger Menu*/

document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        })
    }

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}
})

    /*Product Image Change*/

document.addEventListener('DOMContentLoaded', function() {
    var mainImg = document.getElementById("MainImg");
    var smallImg = document.getElementsByClassName("small-img");

    if (mainImg && smallImg.length > 0) {
        for (let i = 0; i < smallImg.length; i++) {
            smallImg[i].onclick = function() {
                mainImg.src = smallImg[i].src;
            }
        }
    }
});

// Cart functionality


document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Add event listeners
    addEventListeners();
    
    // Update cart icon
    updateCartIcon();
});

// Initialize cart data
function initCart() {
    // Check if cart exists in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Get cart items from localStorage
    window.cartData = JSON.parse(localStorage.getItem('cart'));
    
    // Update cart display
    updateCartDisplay();
}

// Add event listeners to cart elements
function addEventListeners() {
    // Add to cart buttons on shop page
    const addToCartButtons = document.querySelectorAll('.cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the product click event from firing
            
            const productElement = this.closest('.pro');
            const productName = productElement.querySelector('h5').textContent;
            const productPrice = parseFloat(productElement.querySelector('h4').textContent.replace('₹', '').replace(',', ''));
            const productImage = productElement.querySelector('img').src;
            const productBrand = productElement.querySelector('span').textContent;
            
            addToCart({
                id: Math.random().toString(36).substr(2, 9),
                name: productName,
                brand: productBrand,
                price: productPrice,
                quantity: 1,
                image: productImage,
                subtotal: productPrice
            });
            
            // Show confirmation message
            showNotification('Product added to cart!');
        });
    });
    
    // Quantity input change on cart page
    const quantityInputs = document.querySelectorAll('#cart table tbody tr td input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const row = this.closest('tr');
            const itemId = row.dataset.id;
            updateQuantity(itemId, parseInt(this.value));
        });
    });
    
    // Remove item buttons on cart page
    const removeButtons = document.querySelectorAll('#cart table tbody tr td a');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const itemId = row.dataset.id;
            removeItem(itemId);
        });
    });
    
    // Apply coupon button on cart page
    const applyCouponButton = document.querySelector('#coupon button');
    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', function() {
            const couponInput = document.querySelector('#coupon input');
            const couponCode = couponInput.value.trim().toUpperCase();
            applyCoupon(couponCode);
        });
    }
    
    // Checkout button on cart page
    const checkoutButton = document.querySelector('#subtotal button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            proceedToCheckout();
        });
    }
}

// Add product to cart
function addToCart(product) {
    // Check if product already exists in cart
    const existingProductIndex = cartData.findIndex(item => 
        item.name === product.name && item.brand === product.brand);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cartData[existingProductIndex].quantity += 1;
        cartData[existingProductIndex].subtotal = 
            cartData[existingProductIndex].price * cartData[existingProductIndex].quantity;
    } else {
        // Add new product to cart
        cartData.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart icon
    updateCartIcon();
}

// Update quantity of an item
function updateQuantity(itemId, newQuantity) {
    const itemIndex = cartData.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cartData[itemIndex].quantity = newQuantity;
        cartData[itemIndex].subtotal = cartData[itemIndex].price * newQuantity;
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cartData));
        
        // Update cart display
        updateCartDisplay();
        
        // Update cart icon
        updateCartIcon();
    }
}

// Remove item from cart
function removeItem(itemId) {
    cartData = cartData.filter(item => item.id !== itemId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart icon
    updateCartIcon();
}

// Apply coupon code
function applyCoupon(code) {
    let discount = 0;
    let message = '';
    
    switch(code) {
        case 'SUMMER10':
            discount = 0.1; // 10% discount
            message = '10% discount applied!';
            break;
        case 'NEWCUST20':
            discount = 0.2; // 20% discount
            message = '20% discount applied!';
            break;
        case 'FREESHIP':
            discount = 0; // No discount, but free shipping
            message = 'Free shipping applied!';
            break;
        default:
            message = 'Invalid coupon code!';
            return;
    }
    
    // Calculate total with discount
    const subtotal = calculateSubtotal();
    const total = subtotal * (1 - discount);
    
    // Update total display
    const totalElement = document.querySelector('#subtotal table tr:last-child td:last-child');
    if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Show message
    showNotification(message);
}

// Calculate subtotal
function calculateSubtotal() {
    return cartData.reduce((total, item) => total + item.subtotal, 0);
}

// Update cart display
function updateCartDisplay() {
    // If on cart page, update the cart table
    const cartTable = document.querySelector('#cart table tbody');
    if (cartTable) {
        // Clear existing rows
        cartTable.innerHTML = '';
        
        // Add rows for each cart item
        cartData.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            row.innerHTML = `
                <td><a href="#"><i class="fa-solid fa-trash"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>₹${item.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td><input type="number" value="${item.quantity}" min="1" max="10"></td>
                <td>₹${item.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            `;
            
            cartTable.appendChild(row);
        });
        
        // Update cart total
        const cartTotalElement = document.querySelector('.cart-total p');
        if (cartTotalElement) {
            const itemCount = cartData.reduce((total, item) => total + item.quantity, 0);
            cartTotalElement.textContent = `Your cart contains ${itemCount} items`;
        }
        
        // Update subtotal
        const subtotalElement = document.querySelector('#subtotal table tr:first-child td:last-child');
        if (subtotalElement) {
            subtotalElement.textContent = `₹${calculateSubtotal().toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        // Update total
        const totalElement = document.querySelector('#subtotal table tr:last-child td:last-child');
        if (totalElement) {
            totalElement.textContent = `₹${calculateSubtotal().toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        // Add event listeners to new elements
        addEventListeners();
    }
}

// Update cart icon with item count
function updateCartIcon() {
    // Calculate total items in cart
    const itemCount = cartData.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart icon in desktop navigation
    const desktopCartIcon = document.querySelector('#bag a');
    if (desktopCartIcon) {
        // Remove existing cart count if any
        const existingCount = desktopCartIcon.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add cart count if there are items
        if (itemCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = itemCount;
            desktopCartIcon.appendChild(countElement);
        }
    }
    
    // Update cart icon in mobile navigation
    const mobileCartIcon = document.querySelector('#mobile a');
    if (mobileCartIcon) {
        // Remove existing cart count if any
        const existingCount = mobileCartIcon.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add cart count if there are items
        if (itemCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = itemCount;
            mobileCartIcon.appendChild(countElement);
        }
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartData.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    showNotification('Proceeding to checkout...');
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Navigation and Authentication Functions
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Update both desktop and mobile navbar links
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        mobileLoginLink.style.display = 'none';
        mobileLogoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        mobileLoginLink.style.display = 'block';
        mobileLogoutLink.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Initialize navigation functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();

    // Mobile menu functionality
    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !bar.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});

// Checkout page functions
function initializeCheckout() {
    const cartSummary = document.getElementById('cart-summary');
    if (!cartSummary) return; // Exit if not on checkout page

    const cartData = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartData.length > 0) {
        cartSummary.value = cartData.map(item => `${item.name} - ${item.quantity} x ₹${item.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`).join('\n');
    } else {
        cartSummary.value = 'Your cart is empty.';
    }

    // Add event listeners for checkout form and back button
    const checkoutForm = document.querySelector('.checkout-container form');
    const backToCartButton = document.getElementById('back-to-cart');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    if (backToCartButton) {
        backToCartButton.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    alert('Order Placed');
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.href = 'shop.html';
}

// Add checkout initialization to the document ready function
document.addEventListener('DOMContentLoaded', function() {
    // ... existing DOMContentLoaded code ...
    initializeCheckout();
});

// Signup page functions

function validateForm(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    let isValid = true;
    
    // Full name validation
    if (fullname.trim().length < 2) {
        document.getElementById('fullnameError').textContent = 'Please enter a valid name';
        document.getElementById('fullnameError').style.display = 'block';
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    // Password validation
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        document.getElementById('confirmPasswordError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {

        alert('Sign up successful! Redirecting to login...');
        window.location.href = 'login.html';
    }
    
    return false;
}

// Login page functions

function validateForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Reset error messages
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        isValid = false;
    }
    
    // Password validation
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
        passwordError.style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        
        alert('Login successful! Redirecting to home page...');
        // Set login status
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'home.html';
    }
    
    return false;
}
    


