//FOR THE NAVBAR MENU 
const humburger = document.querySelector('.humburger');
const navItems = document.querySelector('.nav_items');
const navEmail = document.querySelector('.nav_email');

humburger.addEventListener('click', () => {
    navItems.classList.toggle('nav_items_menu');
    navEmail.classList.toggle('nav_email_menu');
})





