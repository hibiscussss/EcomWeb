// Simulated product data
let products = [
    { id: 1, name: "Smartphone", price: 499.99, description: "Latest model smartphone", image: "https://via.placeholder.com/300x200.png?text=Smartphone", category: "Electronics", condition: "new", seller: "John Doe", likes: 10, status: "available", liked: false },
    { id: 2, name: "Laptop", price: 999.99, description: "High-performance laptop", image: "https://via.placeholder.com/300x200.png?text=Laptop", category: "Electronics", condition: "used", seller: "Jane Smith", likes: 15, status: "available", liked: false },
    { id: 3, name: "Headphones", price: 99.99, description: "Noise-cancelling headphones", image: "https://via.placeholder.com/300x200.png?text=Headphones", category: "Electronics", condition: "new", seller: "John Doe", likes: 8, status: "available", liked: false },
];

// Simulated user data
let users = [];

// Simple Base64 encoding/decoding for password "hashing" (NOT SECURE, just for demonstration)
function encodePassword(password) {
    return btoa(password);
}

function decodePassword(encodedPassword) {
    return atob(encodedPassword);
}

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('signup.html') && !window.location.pathname.includes('forgot-password.html')) {
        window.location.href = 'index.html';
    }
    return user;
}

// Signup functionality
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const birthday = document.getElementById('birthday').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;
        
        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Phone number must be exactly 10 digits');
            return;
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=.*[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,64}$/;
        if (!passwordRegex.test(password)) {
            alert('Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        if (password.length > 64) {
            alert('Password must not exceed 64 characters.');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            const mismatchModal = new bootstrap.Modal(document.getElementById('passwordMismatchModal'));
            mismatchModal.show();
            return;
        }

        // Validate age
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Check if user is 18 or older
        if (age < 18) {
            alert('You must be 18 or older to create an account.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            alert('Email already exists');
            return;
        }
        if (users.some(u => u.phone === `63${phone}`)) {
            alert('Phone number already exists');
            return;
        }
        
        const newUser = { name, birthday, email, password: encodePassword(password), phone: `63${phone}` };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Simulate OTP sending
        const otp = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('currentOtp', otp);
        alert(`Your OTP is: ${otp}`);

        const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
        otpModal.show();
    });

    document.getElementById('verifyOtp').addEventListener('click', function() {
        const enteredOtp = document.getElementById('otpInput').value;
        const storedOtp = localStorage.getItem('currentOtp');

        if (enteredOtp === storedOtp) {
            alert('Account created successfully. You can now log in.');
            localStorage.removeItem('currentOtp');
            window.location.href = 'index.html';
        } else {
            alert('Invalid OTP. Please try again.');
        }
    });
}

// Login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && decodePassword(u.password) === password);
        
        if (user) {
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({ email, password: encodePassword(password) }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'marketplace.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    // Check for remembered user
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser.email;
        document.getElementById('password').value = decodePassword(rememberedUser.password);
        document.getElementById('rememberMe').checked = true;
    }
}

// Forgot password functionality
if (document.getElementById('forgotPasswordForm')) {
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (user) {
            // Simulate OTP sending
            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('currentOtp', otp);
            alert(`Your OTP is: ${otp}`);

            const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
            otpModal.show();
        } else {
            alert('Email not found. Please check your email and try again.');
        }
    });

    document.getElementById('verifyOtp').addEventListener('click', function() {
        const enteredOtp = document.getElementById('otpInput').value;
        const storedOtp = localStorage.getItem('currentOtp');

        if (enteredOtp === storedOtp) {
            localStorage.removeItem('currentOtp');
            const resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
            resetPasswordModal.show();
        } else {
            alert('Invalid OTP. Please try again.');
        }
    });

    document.getElementById('resetPassword').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match. Please try again.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === email && decodePassword(u.password) === oldPassword);

        if (userIndex !== -1) {
            users[userIndex].password = encodePassword(newPassword);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Password reset successfully. You can now log in with your new password.');
            window.location.href = 'index.html';
        } else {
            alert('Invalid old password. Please try again.');
        }
    });
}

// Simulated chat data
let chats = {};

// Product categories
const categories = ["Electronics", "Clothing", "Home & Garden", "Sports & Outdoors", "Books", "Toys & Games", "Beauty & Personal Care", "Automotive", "Health & Wellness"];


// Marketplace functionality
if (document.getElementById('productList')) {
    const user = checkAuth();

    // Populate category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Display products
    function displayProducts(productsToShow) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        productsToShow.forEach(product => {
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            <p class="card-text">Seller: ${product.seller}</p>
                            <button class="btn btn-primary view-product" data-id="${product.id}">View Details</button>
                            <button class="btn btn-outline-primary like-product" data-id="${product.id}">
                                <i class="bi bi-heart"></i> ${product.likes}
                            </button>
                            <button class="btn btn-outline-secondary add-to-cart" data-id="${product.id}">
                                <i class="bi bi-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                showProductDetails(productId);
            });
        });

        document.querySelectorAll('.like-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                likeProduct(productId);
            });
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }

    // Show product details
    function showProductDetails(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            const modalBody = document.getElementById('productModalBody');
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="${product.image}" class="img-fluid" alt="${product.name}">
                    </div>
                    <div class="col-md-6">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <p>Seller: ${product.seller}</p>
                        <p>Condition: ${product.condition}</p>
                        <p>Category: ${product.category}</p>
                        <button class="btn btn-primary buy-now" data-id="${product.id}">Buy Now</button>
                        <button class="btn btn-outline-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="btn btn-outline-secondary favorite" data-id="${product.id}">
                            <i class="bi bi-star"></i> Favorite
                        </button>
                        <button class="btn btn-outline-danger report" data-id="${product.id}">Report</button>
                        <button class="btn btn-outline-info chat" data-id="${product.id}">Chat with Seller</button>
                    </div>
                </div>
            `;
            const productModal = new bootstrap.Modal(document.getElementById('productModal'));
            productModal.show();

            // Add event listeners to buttons
            document.querySelector('.buy-now').addEventListener('click', function() {
                buyNow(this.getAttribute('data-id'));
            });

            document.querySelector('.add-to-cart').addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });

            document.querySelector('.favorite').addEventListener('click', function() {
                addToFavorites(this.getAttribute('data-id'));
            });

            document.querySelector('.report').addEventListener('click', function() {
                reportProduct(this.getAttribute('data-id'));
            });

            document.querySelector('.chat').addEventListener('click', function() {
                openChat(this.getAttribute('data-id'));
            });
        }
    }

    // Like product
    function likeProduct(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            if (product.liked) {
                product.likes--;
                product.liked = false;
            } else {
                product.likes++;
                product.liked = true;
            }
            displayProducts(products);
        }
    }

    // Add to cart
    function addToCart(productId) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(productId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
        alert(`Product ${productId} added to cart`);
    }

    // Buy now
    function buyNow(productId) {
        alert(`Proceeding to checkout for product ${productId}`);
    }

    // Add to favorites
    function addToFavorites(productId) {
        alert(`Product ${productId} added to favorites`);
    }

    // Report product
    function reportProduct(productId) {
        alert(`Product ${productId} reported`);
    }

    // Open chat
    function openChat(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
            document.getElementById('chatModalLabel').textContent = `Chat with ${product.seller}`;
            chatModal.show();
        }
    }

    // Initial display
    displayProducts(products);

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', function(e) {
        const category = e.target.value;
        const filteredProducts = category ? products.filter(product => product.category === category) : products;
        displayProducts(filteredProducts);
    });

    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', function(e) {
        const sortBy = e.target.value;
        let sortedProducts = [...products];
        switch (sortBy) {
            case 'date':
                // Assuming products are already sorted by date
                break;
            case 'price_asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
        }
        displayProducts(sortedProducts);
    });

    // Chat functionality
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const message = document.getElementById('chatInput').value;
        if (message.trim()) {
            const chatMessages = document.getElementById('chatMessages');
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', 'sent');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            document.getElementById('chatInput').value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
}

// Seller dashboard functionality
if (document.getElementById('sellerProductList')) {
    const user = checkAuth();
    if (!user) {
        window.location.href = 'index.html';
    }

    // Display seller's products
    function displaySellerProducts() {
        const sellerProductList = document.getElementById('sellerProductList');
        sellerProductList.innerHTML = '';
        const sellerProducts = products.filter(product => product.seller === user.name);
        sellerProducts.forEach(product => {
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text>$${product.price.toFixed(2)}</p>
                            <p class="card-text">Likes: ${product.likes}</p>
                            <p class="card-text">Status: ${product.status}</p>
                            <button class="btn btn-primary edit-product" data-id="${product.id}">Edit</button>
                            <button class="btn btn-danger delete-product" data-id="${product.id}">Delete</button>
                            <button class="btn btn-success ${product.status === 'sold' ? 'disabled' : ''}" onclick="markAsSold(${product.id})">
                                ${product.status === 'sold' ? 'Sold' : 'Mark as Sold'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            sellerProductList.innerHTML += productCard;
        });

        // Add event listeners to buttons
        document.querySelectorAll('.edit-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                editProduct(productId);
            });
        });

        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                deleteProduct(productId);
            });
        });
    }

    // Edit product
    function editProduct(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productCondition').value = product.condition;

            const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
            addProductModal.show();

            document.getElementById('addProductForm').onsubmit = function(e) {
                e.preventDefault();
                product.name = document.getElementById('productName').value;
                product.description = document.getElementById('productDescription').value;
                product.price = parseFloat(document.getElementById('productPrice').value);
                product.category = document.getElementById('productCategory').value;
                product.condition = document.getElementById('productCondition').value;

                displaySellerProducts();
                addProductModal.hide();
            };
        }
    }

    // Delete product
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id != productId);
            displaySellerProducts();
        }
    }

    // Mark product as sold
    function markAsSold(productId) {
        const product = products.find(p => p.id == productId);
        if (product && product.status !== 'sold') {
            product.status = 'sold';
            displaySellerProducts();
        }
    }

    // Add new product
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newProduct = {
            id: products.length + 1,
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            condition: document.getElementById('productCondition').value,
            image: 'https://via.placeholder.com/300x200.png?text=' + document.getElementById('productName').value,
            seller: user.name,
            likes: 0,
            status: 'available',
            liked: false
        };
        products.push(newProduct);
        displaySellerProducts();
        const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        addProductModal.hide();
    });

    // Populate category select
    const categorySelect = document.getElementById('productCategory');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Initial display of seller's products
    displaySellerProducts();
}

// Logout functionality
if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Function to update cart count
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.textContent = `Cart (${cartItems.length})`;
    }
}

// Function to load user profile picture
function loadProfilePicture() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profilePicture = document.getElementById('profilePicture');
    if (user && user.profilePicture) {
        profilePicture.src = user.profilePicture;
    } else {
        profilePicture.src = 'https://via.placeholder.com/40';
    }
}

// Check authentication on page load
checkAuth();

// Call updateCart and loadProfilePicture if productList exists
if (document.getElementById('productList')) {
    loadProfilePicture();
    updateCart();
}


// Cart animation
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('login-page')) {
        const cartImage = document.querySelector('.cart-animation img');
        cartImage.classList.add('animate__animated', 'animate__slideInRight');
        
        cartImage.addEventListener('animationend', function() {
            setTimeout(() => {
                cartImage.style.animation = 'cartSlide 3s ease-in-out forwards';
            }, 1000);
        });
    }
});