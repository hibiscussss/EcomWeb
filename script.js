// Simulated product data
let products = [
    { id: 1, name: "Smartphone", price: 499.99, description: "Latest model smartphone", image: "https://via.placeholder.com/300x200.png?text=Smartphone", category: "Electronics", condition: "new", seller: "John Doe", likes: 10, status: "available" },
    { id: 2, name: "Laptop", price: 999.99, description: "High-performance laptop", image: "https://via.placeholder.com/300x200.png?text=Laptop", category: "Electronics", condition: "used", seller: "Jane Smith", likes: 15, status: "available" },
    { id: 3, name: "Headphones", price: 99.99, description: "Noise-cancelling headphones", image: "https://via.placeholder.com/300x200.png?text=Headphones", category: "Electronics", condition: "new", seller: "John Doe", likes: 8, status: "available" },
];

// Simulated user data
let users = [];

// Simulated chat data
let chats = {};

// Product categories
const categories = ["Electronics", "Clothing", "Home & Garden", "Sports & Outdoors", "Books", "Toys & Games", "Beauty & Personal Care", "Automotive", "Health & Wellness"];

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
    if (!user && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'index.html';
    }
    return user;
}

// Login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && decodePassword(u.password) === password);
        
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = user.type === 'seller' ? 'seller-dashboard.html' : 'marketplace.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Signup functionality
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const birthday = document.getElementById('birthday').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const userType = document.getElementById('userType').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            alert('Email already exists');
            return;
        }
        
        const newUser = { name, birthday, email, password: encodePassword(password), phone, type: userType };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully');
        window.location.href = 'index.html';
    });
}

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
            product.likes++;
            displayProducts(products);
        }
    }

    // Add to cart
    function addToCart(productId) {
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
    if (user.type !== 'seller') {
        window.location.href = 'marketplace.html';
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
            status: 'available'
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

// Check authentication on page load
checkAuth();

