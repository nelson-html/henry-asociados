let d = document;

// Declaracion de variables del dom para el navbar
const $ul = d.querySelector(".ul"),
$btn_hamburger = d.querySelector(".nav-hamburger"),
$p_banner = d.querySelector(".textos-aleatorios");

/* $btn_hamburger.addEventListener("click", e=>{
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
}); */

function openMenu() {
    $ul.classList.remove("max-h-0","opacity-0","-translate-y-2","pointer-events-none");
    $ul.classList.add("max-h-96","opacity-100","translate-y-0","pointer-events-auto");
    $btn_hamburger.src = "assets/x-mark.avif";
    $btn_hamburger.classList.remove("max-h-12")
    $btn_hamburger.classList.add("max-h-8")
}

function closeMenu() {
    $ul.classList.remove("max-h-96","opacity-100","translate-y-0","pointer-events-auto");
    $ul.classList.add("max-h-0","opacity-0","-translate-y-2","pointer-events-none");
    $btn_hamburger.src = "assets/menu-right.png";
    $btn_hamburger.classList.add("max-h-12")
    $btn_hamburger.classList.remove("max-h-8")
    
}

$btn_hamburger.addEventListener("click", () => {
    const isClosed = $ul.classList.contains("max-h-0");
    isClosed ? openMenu() : closeMenu();
});

$ul.addEventListener("click", (e) => {
    if (e.target.matches("a")) closeMenu();
});

d.addEventListener("click", (e) => {
    if (!$ul.contains(e.target) && !$btn_hamburger.contains(e.target)) closeMenu();
});

// textos aleatorios del banner de inicio

const textos = ["Seguridad","Confianza","Privacidad","Responsabilidad","Respaldo","Integridad"];
const $el = d.querySelector(".textos-aleatorios");

function siguiente() {
   // salir
$el.classList.remove("fade-in");
$el.classList.add("fade-out");

setTimeout(() => {
      // cambiar texto cuando ya está oculto
    const next =
         textos[Math.floor(Math.random() * textos.length)];
    $el.innerText = next;

      // entrar
    requestAnimationFrame(() => {
        $el.classList.remove("fade-out");
        $el.classList.add("fade-in");
    });
   }, 250); // igual al tiempo de transición
}

setInterval(siguiente, 3000);

// cambio de titulo xd

d.addEventListener("visibilitychange", () =>{
    if(d.hidden){
        d.title = "No te vayas, te ayudaremos";
    }else{
        d.title = "Gracias por volver🫡";
    }
})



