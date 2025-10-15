let d = document;

// Declaracion de variables del dom para el navbar
const $ul = d.querySelector(".ul"),
$btn_hamburger = d.querySelector(".nav-hamburger");

$btn_hamburger.addEventListener("click", e=>{
    $ul.classList.toggle("hidden");

});

// Cerrar el navbar cuando se apreta algun link
$ul.addEventListener("click", e =>{
    if(e.target.matches("a")){
        $ul.classList.add("hidden")
    }
});

// cerrar el navbar cuando apretamos fuera del navbar xd
d.addEventListener("click", e=>{
    if(!$ul.contains(e.target) && !$btn_hamburger.contains(e.target)){
        $ul.classList.add("hidden")
    }
});
