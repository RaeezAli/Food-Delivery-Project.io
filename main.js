const btn = document.querySelector('#btn');
const logOut = document.querySelector('.logout-btn');
// const cartBtn = document.querySelector('.cart-btn');
// const cartClose = document.querySelector('.cart-close');
// const AddToCart = document.querySelector('.Add-to-Cart')

// logOut.addEventListener('click', () => {
//     console.log('button clicked')
//     localStorage.removeItem("userData");
//     window.location.href = 'login.html';
// });





// btn.addEventListener('click', () => {
//     console.log('button clicked')
//     window.location.href = 'login.html';
// });

function cartBtn () {
    console.log('button clicked')
    let cartDisplay = document.getElementById('cart-popup');

    cartDisplay.style.display = 'block';

}

function cartClose () {
    let cartDisplay = document.getElementById('cart-popup');

    cartDisplay.style.display = 'none';
}

function AddToCart (itemName , itemPrice) {

    const cartItems = document.getElementById('cart-items').getElementsByTagName('tbody')[0];
const existingItems = Array.from(cartItems.getElementsByTagName('tr')).find(item => item.cells[0].textContent === itemName);

if (existingItems) {
    // Ensure .item-count and .item-total are selected correctly
    const itemCountElement = existingItems.querySelector('.item-count');
    const itemTotalElement = existingItems.querySelector('.item-total');
    
    if (itemCountElement && itemTotalElement) {
        const itemCount = parseInt(itemCountElement.textContent) + 1;
        itemCountElement.textContent = itemCount;

        const itemTotal = parseFloat(itemTotalElement.textContent) + parseFloat(itemPrice);
        itemTotalElement.textContent = itemTotal.toFixed(2);
    } else {
        console.error('Required elements .item-count or .item-total are missing in existingItems');
    }
} else {
    const newRow = cartItems.insertRow();
    newRow.innerHTML = `
        <td>${itemName}</td>
        <td class="item-count">1</td>
        <td class="item-price">${parseFloat(itemPrice).toFixed(2)}</td>
        <td class="item-total">${parseFloat(itemPrice).toFixed(2)}</td>
    `;
}

    updateCartTotal();

}

function updateCartTotal () {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.querySelectorAll('#cart-items tbody tr');

    let totalCount = 0;
    let total = 0;
    cartItems.forEach(item => {
        const itemCount = parseInt(item.querySelector('.item-count').textContent);
        const itemTotal = parseFloat(item.querySelector('.item-total').textContent);

        totalCount += itemCount;
        total += itemTotal;
    });

    cartCount.textContent = totalCount;
    cartTotal.textContent = total.toFixed(2);
}