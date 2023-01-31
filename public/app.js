//FOR THE NAVBAR MENU 
const humburger = document.querySelector('.humburger');
const navItems = document.querySelector('.nav_items');
const navEmail = document.querySelector('.nav_email');

humburger.addEventListener('click', () => {
    navItems.classList.toggle('nav_items_menu');
    navEmail.classList.toggle('nav_email_menu');
})

const images = document.querySelectorAll('[data-src]');

function preloadImages(img){
    const src = img.getAttribute('data-src');
    if(!src){
        return;
    }
 
    img.src = src;
}


const imgOptions = {};


const imgObserver = new IntersectionObserver((entries,imgObserver)=>{
    entries.forEach(entry=>{
        if(!entry.isIntersecting){
            return;
        }
        else{
            preloadImages(entry.target);
            imgObserver.unobserve(entry.target);
        }
    })
},imgOptions);


images.forEach(image=>{
    imgObserver.observe(image);
})
