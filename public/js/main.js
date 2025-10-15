let d = document;

// Declaracion de variables del dom para el navbar
const $ul = d.querySelector(".ul"),
$btn_hamburger = d.querySelector(".nav-hamburger");

$btn_hamburger.addEventListener("click", e=>{
    $ul.classList.toggle("hidden");

})



