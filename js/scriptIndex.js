var searchType = document.getElementById("searchOptions");
var searchBar = document.getElementById("searchBar");

var productsElements = document.querySelectorAll(".card .card-body");
var productsArray = Array.from(productsElements);

var notFoundMessage = document.createElement("p");

var addToCartButtons = document.getElementsByClassName("addToCart");
var cartQuantity = document.getElementById("cartQuantity")
var cartItems = document.getElementById("cartItems")

var likeButtons = document.getElementsByClassName("likeButton")
var cartProductsContainer = document.getElementById("productsContainer")

var searchSection = document.getElementById("searchBarSection")
var productsGridSection = document.getElementById("productsGridSection")
var addedProductsSection = document.getElementById("addedProducts")
var likedProductsSection = document.getElementById("likedProducts")

var homePageLink = document.getElementById("goToHome")
var productsPageLink = document.getElementById("goToProducts")

var totalPrice = document.getElementById("totalPrice");
var favoriteProductsContainer = document.getElementById("favoriteProducts")

function redirectToLogin() {
    let firstName = (document.getElementById("firstNameReg")).value;
    let lastName = (document.getElementById("lastNameReg")).value;
    let email = (document.getElementById("emailReg")).value;
    let password = (document.getElementById("passwordReg")).value

    let buttonReg = document.getElementById("buttonReg").addEventListener("click", function (event) {
        event.preventDefault();
    })

    localStorage.setItem("fname", firstName);
    localStorage.setItem("lname", lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("pass", password);

    window.location.href = 'login.html';
}

function redirectToIndex() {
    let emailText = (document.getElementById("emailLog")).value;
    let passText = (document.getElementById("passwordLog")).value;
    let buttonLog = document.getElementById("buttonLog").addEventListener("click", function (event) {
        event.preventDefault();
    })

    if ((emailText === localStorage.getItem("email")) && (passText === localStorage.getItem("pass"))) {
        localStorage.setItem("loggedIn", true)
        window.location.href = "index.html";
        console.log(loggedIn)
    }
    else {
        console.log("Invalid info")
    }

}

searchBar.addEventListener('input', function () {
    let searchContent = searchBar.value.toLowerCase();
    let productFound = false;

    productsArray.forEach(function (product) {
        let nameElement = product.querySelector('h5:first-child');
        let categoryElement = product.querySelector('p:last-child');
        let parentElement = product.parentElement.parentElement;

        let name = nameElement.textContent.toLowerCase();
        let category = categoryElement.textContent.toLowerCase();

        if (
            (searchType.value == "1" && name.includes(searchContent)) ||
            (searchType.value == "2" && category.includes(searchContent))
        ) {
            parentElement.classList.remove("d-none");
            productFound = true;
        } else {
            parentElement.classList.add("d-none");
        }
    });


    if (productFound) {
        notFoundMessage.classList.add("d-none")
    } else {
        notFoundMessage.classList.remove("d-none")
    }
});


document.addEventListener("DOMContentLoaded", function () {
    let visitorPElement = document.getElementById("visitorName");
    let navLoggedOff = document.getElementById("navLoggedOff");
    let navLoggedIn = document.getElementById("navLoggedIn");
    let isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        navLoggedOff.classList.add("d-none");
        visitorPElement.classList.remove("d-none");
        navLoggedIn.classList.remove("d-none");
        visitorPElement.textContent =
            "Welcome, " +
            localStorage.getItem("fname") +
            " " +
            localStorage.getItem("lname");
    } else {
        navLoggedOff.classList.remove("d-none");
        visitorPElement.classList.add("d-none");
        navLoggedIn.classList.add("d-none");
    }
});

var logoutButton = document.getElementById("logoutBtn");
logoutButton.addEventListener("click", function (event) {
    localStorage.setItem("loggedIn", false);
    location.reload();
});

notFoundMessage.textContent = "Product wasn't found";
notFoundMessage.id = "notFoundMessage";
notFoundMessage.classList.add("d-none", "fs-5", "text-center")

document.body.appendChild(notFoundMessage);

var productCounter = 0;
var addedProducts = [];

function addToCart(productsArray, productToBeAdded) {
    // Add to cart

    productsArray.push(productToBeAdded);
    productCounter++;
    createCartItem(productToBeAdded);
    cartQuantity.textContent = productCounter;

    let createdCard = createProductCard();
    let productCol = document.createElement("div");
    let storedMap = new Map(JSON.parse(localStorage.getItem("productQuantity")));

    productCol.classList.add("col");

    var existingImg = createdCard.querySelector("img");
    var imgClone = productToBeAdded.querySelector("img").cloneNode(true);
    imgClone.classList.add("img-fluid", "rounded-start");

    createdCard.firstChild.firstChild.replaceChild(imgClone, existingImg);
    createdCard.querySelector(".card-title").textContent = productToBeAdded.querySelector(".card-title").textContent;
    createdCard.querySelector(".product-price").textContent = productToBeAdded.querySelector(".card-body .card-text:first-of-type").textContent;
    createdCard.querySelector(".product-category").textContent = productToBeAdded.querySelector(".card-body .card-text:last-of-type").textContent;

    for (let [key, value] of storedMap.entries()) {
        if (key === productToBeAdded.querySelector(".card-title").textContent) {
            createdCard.querySelector(".product-quantity span").textContent = value--;
            break;
        }
    }

    createdCard.querySelector("i:first-of-type").addEventListener("click", function () {
        let priceElement = createdCard.querySelector(".product-price");
        let quantityElement = createdCard.querySelector("span");

        let priceText = priceElement.textContent;
        const priceMatch = priceText.match(/\d+(\.\d{1,2})?/);

        if (priceMatch) {
            const pricePerProduct = parseFloat(priceMatch[0]);

            // Ensure quantity is a valid number, defaulting to 0 if not
            let quantity = parseInt(quantityElement.textContent) || 0;
            quantity += 1;

            quantityElement.textContent = quantity; // Increment the quantity

            let updatedTotalPrice = pricePerProduct * quantity;
            totalPrice.textContent = updatedTotalPrice.toFixed(2);
        }
    });



    createdCard.querySelector(".fa-minus").addEventListener("click", function () {
        if (createdCard.querySelector("span").textContent === '0') {
            createdCard.classList.add("d-none");
        }
        else {
            let priceElement = createdCard.querySelector(".product-price");
            let quantityElement = createdCard.querySelector("span");

            let priceText = priceElement.textContent;
            const startIndex = priceText.indexOf(':') + 1;
            const endIndex = priceText.indexOf('$');

            let quantity = parseInt(quantityElement.textContent) - 1;
            quantityElement.textContent = quantity; // Increment the quantity

            if (startIndex !== -1 && endIndex !== -1) {
                const number = parseInt(priceText.slice(startIndex, endIndex).trim());
                let currentTotalPrice = parseInt(totalPrice.textContent);

                let updatedTotalPrice = currentTotalPrice - number;
                totalPrice.textContent = updatedTotalPrice;
            }
        }
    })

    createdCard.querySelector(".btn").addEventListener("click", function () {
        createdCard.classList.add("d-none");
    })




    productCol.appendChild(createdCard);
    cartProductsContainer.appendChild(productCol);
}

function removeFromCart(productsArray, productToBeDeleted) {
    // Remove from cart
    var indexOfProduct = productsArray.indexOf(productToBeDeleted);

    productsArray.forEach(function (currentDiv) {
        if (currentDiv.querySelector(".card-body .card-title").textContent === productToBeDeleted.querySelector(".card-body .card-title").textContent) {
            currentDiv.querySelector(".addToCart").classList.remove("btn-danger");
            currentDiv.querySelector(".addToCart").classList.add("btn-primary");
            currentDiv.querySelector(".addToCart").innerHTML = "add to cart";
        }
    })

    if (indexOfProduct !== -1) {
        productsArray.splice(indexOfProduct, 1);
        deleteCartItem(productToBeDeleted)
    }
    productCounter--;
    if (productCounter < 0)
        productCounter = 0;
    cartQuantity.textContent = productCounter;
}

for (var i = 0; i < addToCartButtons.length; i++) {
    (function (index) {
        addToCartButtons[index].addEventListener("click", function () {
            if (localStorage.getItem("loggedIn") === "true") {
                var selectedProduct = addToCartButtons[index].parentElement.parentElement;

                if (addToCartButtons[index].classList.contains("btn-primary")) {
                    addToCart(addedProducts, selectedProduct)
                    addToCartButtons[index].classList.remove("btn-primary");
                    addToCartButtons[index].classList.add("btn-danger");
                    addToCartButtons[index].innerHTML = "remove from cart";

                } else {
                    removeFromCart(addedProducts, selectedProduct)
                    addToCartButtons[index].classList.remove("btn-danger");
                    addToCartButtons[index].classList.add("btn-primary");
                    addToCartButtons[index].innerHTML = "add to cart";
                }
                console.log(addedProducts)

            } else {
                window.location.href = "login.html";
            }
        });
    })(i);
}

var productQuantity = new Map();

function createCartItem(product) {
    var listItem = document.createElement("li");
    var itemName = document.createElement("div");
    var itemQuantity = document.createElement("div");
    var plusIcon = document.createElement("i")
    var minusIcon = document.createElement("i");
    var itemCounter = 1;
    var counterSpan = document.createElement("span");

    itemName.className = "float-start";
    itemName.textContent = product.querySelector(".card-body .card-title").textContent

    itemQuantity.classList.add("text-end")

    plusIcon.classList.add("fa-solid", "fa-plus", "mx-1");
    plusIcon.style.color = "green";

    minusIcon.classList.add("fa-solid", "fa-minus", "mx-1");
    minusIcon.style.color = "red";

    counterSpan.classList.add("mx-2")

    plusIcon.addEventListener("click", function () {
        itemCounter++
        counterSpan.textContent = itemCounter;
        productQuantity.set(itemName.textContent, itemCounter);
        localStorage.setItem("productQuantity", JSON.stringify(Array.from(productQuantity.entries())));
    })

    minusIcon.addEventListener("click", function () {
        if (itemCounter === 1) {
            removeFromCart(addedProducts, product)
        }
        else {
            itemCounter--;
            counterSpan.textContent = itemCounter;
            productQuantity.set(itemName.textContent, itemCounter);
            localStorage.setItem("productQuantity", JSON.stringify(Array.from(productQuantity.entries())));
        }
    })

    itemQuantity.appendChild(counterSpan);
    itemQuantity.appendChild(plusIcon);
    itemQuantity.appendChild(minusIcon);

    listItem.classList.add("m-2", "d-block")
    listItem.appendChild(itemName);
    listItem.appendChild(itemQuantity);

    cartItems.appendChild(listItem);
}

function deleteCartItem(product) {
    for (var i = 0; i < cartItems.children.length; i++) {
        var productName = cartItems.children[i].firstChild.textContent;
        if (product.querySelector(".card-body .card-title").textContent === productName) {
            cartItems.removeChild(cartItems.children[i]);
        }
    }
}

var likedProducts = []

for (var i = 0; i < likeButtons.length; i++) {
    (function (index) {
        likeButtons[index].addEventListener("click", function (event) {
            event.preventDefault();
            if (localStorage.getItem("loggedIn") === "true") {
                var selectedProduct = likeButtons[index].parentElement.parentElement;

                if (likeButtons[index].querySelector(".fa-heart").classList.contains("text-secondary")) {
                    likedProducts.push(selectedProduct)
                    likeButtons[index].querySelector(".fa-heart").classList.remove("text-secondary");
                    likeButtons[index].querySelector(".fa-heart").classList.add("text-danger");
                    favoriteProductsContainer.appendChild(selectedProduct.cloneNode(true));

                } else {
                    var indexOfProduct = likedProducts.indexOf(selectedProduct);

                    if (indexOfProduct !== -1) {
                        likedProducts.splice(indexOfProduct, 1);
                    }
                    likeButtons[index].querySelector(".fa-heart").classList.remove("text-danger");
                    likeButtons[index].querySelector(".fa-heart").classList.add("text-secondary");
                }
                console.log(likedProducts)


            } else {
                window.location.href = "login.html";
            }
        });
    })(i);
}


productsPageLink.addEventListener("click", function (event) {

    if ((!searchSection.classList.contains("d-none")) && (!productsGridSection.classList.contains("d-none"))) {
        searchSection.classList.add("d-none");
        productsGridSection.classList.add("d-none");
        addedProductsSection.classList.remove("d-none");
        likedProductsSection.classList.remove("d-none");
    }
})

homePageLink.addEventListener("click", function (event) {

    if ((searchSection.classList.contains("d-none")) && (productsGridSection.classList.contains("d-none"))) {
        searchSection.classList.remove("d-none");
        productsGridSection.classList.remove("d-none");
        addedProductsSection.classList.add("d-none");
        likedProductsSection.classList.add("d-none");
    }
})



function createProductCard() {
    let cardDiv = document.createElement("div")
    let cardRowDiv = document.createElement("div")
    let cardImgDiv = document.createElement("div")
    let cardImg = document.createElement("img")
    let cardTextDiv = document.createElement("div")
    let cardBodyDiv = document.createElement("div")
    let cardProductName = document.createElement("h5")
    let cardProductCategory = document.createElement("p")
    let cardProductPrice = document.createElement("p")
    let cardQuantityDiv = document.createElement("div")
    let cardProductQuantity = document.createElement("span")
    let cardPlusIcon = document.createElement("i")
    let cardMinusIcon = document.createElement("i")
    let cardRemoveButton = document.createElement("button")

    cardDiv.classList.add("card", "mb-3")
    cardRowDiv.classList.add("row", "g-0")
    cardImgDiv.classList.add("col-mid-4")
    cardImg.classList.add("img-fluid", "rounded-start")
    cardTextDiv.classList.add("col-mid-8")
    cardBodyDiv.classList.add("card-body")
    cardProductName.classList.add("card-title")
    cardProductCategory.classList.add("card-text", "product-category")
    cardProductPrice.classList.add("card-text", "product-price")
    cardQuantityDiv.classList.add("card-text", "product-quantity")
    cardProductQuantity.classList.add("card-text")
    cardPlusIcon.classList.add("fa-solid", "fa-plus", "mx-1");
    cardMinusIcon.classList.add("fa-solid", "fa-minus", "mx-1");
    cardRemoveButton.classList.add("btn", "btn-danger", "text-capitalize", "m-3")
    cardRemoveButton.innerText = "Remove From Cart"

    cardQuantityDiv.appendChild(cardProductQuantity)
    cardQuantityDiv.appendChild(cardPlusIcon)
    cardQuantityDiv.appendChild(cardMinusIcon)
    cardQuantityDiv.appendChild(cardRemoveButton)

    cardBodyDiv.appendChild(cardProductName)
    cardBodyDiv.appendChild(cardProductCategory)
    cardBodyDiv.appendChild(cardProductPrice)
    cardBodyDiv.appendChild(cardQuantityDiv)

    cardTextDiv.appendChild(cardBodyDiv)
    cardImgDiv.appendChild(cardImg)

    cardRowDiv.appendChild(cardImgDiv)
    cardRowDiv.appendChild(cardTextDiv)

    cardDiv.appendChild(cardRowDiv)

    return cardDiv;
}