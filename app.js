import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, collection, addDoc  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCq1M-4yxROOTDkMdg-NpmX5QuNlbz4HMc",
    authDomain: "se-food-delivery-project.firebaseapp.com",
    projectId: "se-food-delivery-project",
    storageBucket: "se-food-delivery-project.appspot.com",
    messagingSenderId: "1097206790674",
    appId: "1:1097206790674:web:24fe27183f24a9fc8176cb",
    measurementId: "G-XXBW3DJQ5T"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


const cartDisplay = document.querySelectorAll('.cartBtn');
const addBtns = document.querySelectorAll('.add-btn');
const cartClosed = document.querySelectorAll('.cart-close');
const logoutBtn = document.querySelector('.logout-btn');
const reservationsCollection = collection(db, 'reservations');
const userPhotoURL = localStorage.getItem('userPhotoURL');

document.getElementById('user-avatar').src = userPhotoURL;
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  auth.signOut()
    .then(() => {
      // User logged out successfully
      console.log("User logged out");
      window.location.href = 'login.html'; 
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
      // Handle logout error (display error message to user, etc.)
    });
});


const cartBtn = () => {
     
    console.log('button clicked')
    let cartDisplay = document.getElementById('cart-popup');
    
    cartDisplay.style.display = 'block';
    
}

const cartClose = () =>{
    let cartDisplay = document.getElementById('cart-popup');

    cartDisplay.style.display = 'none';
}

const addCartToFirestore = async (userEmail, cartItems, totalAmount) => {
    try {
      const docRef = await addDoc(collection(db, "receipts"), {
        userEmail: userEmail,
        items: cartItems,
        totalAmount: totalAmount,
        timestamp: new Date()
      });
      console.log("Cart successfully added to Firestore with ID: ", docRef.id);
      clearCart();
    } catch (error) {
      console.error("Error adding cart to Firestore: ", error);
    }
  };

const AddToCart = (event) => {

    const button = event.target;
    const card = button.closest('.card');

    const itemName = card.querySelector('.card-title').textContent;
    const itemPrice = card.querySelector('.item-price').textContent;

    console.log(`Item: ${itemName}, Price: ${itemPrice}`);
    const cartItems = document.getElementById('cart-items').getElementsByTagName('tbody')[0];
    const existingItems = Array.from(cartItems.getElementsByTagName('tr')).find(item => item.cells[0].textContent === itemName);

    if (existingItems) {
        
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

function getCartItems() {
    const cartItems = document.querySelectorAll('#cart-items tbody tr');
    const items = [];
    cartItems.forEach(item => {
      const itemName = item.cells[0].textContent;
      const itemCount = parseInt(item.querySelector('.item-count').textContent);
      const itemPrice = parseFloat(item.querySelector('.item-price').textContent);
      const itemTotal = parseFloat(item.querySelector('.item-total').textContent);
  
      items.push({
        name: itemName,
        count: itemCount,
        price: itemPrice,
        total: itemTotal
      });
    });
    return items;
  }
  
  function clearCart() {
    const cartItems = document.getElementById('cart-items').getElementsByTagName('tbody')[0];
    cartItems.innerHTML = '';
    updateCartTotal();
  }
  
  // Add event listener to Buy button
  document.querySelector('.buy-btn').addEventListener('click', () => {
    const user = auth.currentUser;
  if (user) {
    const userEmail = user.email;
    const cartItems = getCartItems();
    const totalAmount = parseFloat(document.getElementById('cart-total').textContent);
    if (cartItems.length > 0) {
      addCartToFirestore(userEmail, cartItems, totalAmount); // Pass userEmail to addCartToFirestore
    } else {
      console.log("Cart is empty");
    }
  } else {
    console.log("No user logged in");
    // Handle case where no user is logged in (e.g., prompt user to login)
  }
  });

  const reservationForm = document.getElementById('reservation-form');

reservationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email-input').value;
  const username = document.getElementById('username-input').value;
  const date = document.getElementById('date-input').value;
  const persons = parseInt(document.getElementById('persons-select').value); // Convert to number

  const docData = {
    email: email,
    username: username,
    date: date,
    persons: persons
  };

  try {
    const docRef = await addDoc(reservationsCollection, docData);
    console.log("Reservation successfully added to Firestore with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding reservation to Firestore: ", error);
    // Handle error (display error message to user, etc.)
  }
});

  // const reservationForm = document.getElementById('reservation-form');

  // reservationForm.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  
  //   const email = document.getElementById('email-input').value;
  //   const username = document.getElementById('username-input').value;
  //   const date = document.getElementById('date-input').value;
  //   const persons = document.getElementById('persons-select').value;
  
  //   console.log("Submitting reservation:", email, username, date, persons); // Log form data
  
  //   try {
  //     const docRef = await db.collection("reservations").add({
  //       email: email,
  //       username: username,
  //       date: date,
  //       persons: persons
  //     });
  //     console.log("Reservation successfully added to Firestore with ID: ", docRef.id);
  //   } catch (error) {
  //     console.error("Error adding reservation to Firestore: ", error);
  //     // Handle error (display error message to user, etc.)
  //   }
  // });

addBtns.forEach(button => {
    button.addEventListener('click', AddToCart);
});

cartDisplay.forEach(button => {
    button.addEventListener('click', cartBtn);
});

cartClosed.forEach(button => {
    button.addEventListener('click', cartClose);
});


