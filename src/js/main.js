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
}

function closeMenu() {
    $ul.classList.remove("max-h-96","opacity-100","translate-y-0","pointer-events-auto");
    $ul.classList.add("max-h-0","opacity-0","-translate-y-2","pointer-events-none");
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

function textoAleatorios(){
    const Textos = [];

    Textos[0] = "Seguridad"; 
    Textos[1] = "Confianza";
    Textos[2] = "Privacidad"; 
    Textos[3] = "Responsabilidad"; 
    Textos[4] = "Respaldo"; 
    Textos[5] = "Integridad";

    let aleat = Math.random() * (Textos.length);
    aleat = Math.floor(aleat);

    return Textos[aleat];
}

function cambioDinamico(){
    const elementoTexto = d.querySelector(".textos-aleatorios");

    setInterval(()=>{
        elementoTexto.innerText = textoAleatorios();
    }, 3000)
}

$p_banner.innerText = textoAleatorios();
cambioDinamico();