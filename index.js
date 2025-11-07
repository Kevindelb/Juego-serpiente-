
// VARIABLES GLOBALES
let miInterval

let record = 0;
let puntuaciontotal = 0;

let onOff = false;

let velocidad = 500; 
let comidasConsumidas = 0; 

//CONSTANTES 

const puntuacionActual = document.getElementById("puntuacionActual")
const puntuacionfinal = document.getElementById("puntuacionFinal")
const recordMundial = document.getElementById("recordMundial")

const velocidadMinima = 100; 
const reduccionVelocidad = 50; 

const overlay = document.getElementById('overlay');
const tryagain = document.getElementById('botonComenzar2');


const boton = document.getElementById("botonComenzar") //boton para comenzar la partida
const puntaje = document.getElementById('puntaje');

const pauseBtn = document.getElementById('pausePlayBtn');//boton de pausar 



// Tablero de juego
let matriz 

// Represemta las posiciones donde esta la serpiente
let serpiente = [[3,3],[3,4],[3,5]];

// Representa la direccion en que se mueve la serpiente
let direccion ="ArrowRight";
let poscicionComida;


// FUNCIONES

// CREA una matriz de tantas filas y columnas toda a 0
function crearMatriz (numFilas, numColumnas){
const matriz = [];

for (let i = 0; i < numFilas; i++) {
  matriz[i] = [];
  for (let j = 0; j < numColumnas; j++) {
    matriz[i][j] = 0;
  }
}
return matriz;
}




// muestra la matriz en forma de tabla html
function mostrarMatriz() {
    //abrimos la tabla en una variable llamada html
    let html = '<table>';
    
    //recorremos las filas 
    for (let i = 0; i < matriz.length; i++) {
        //abrimos la table row
        html += '<tr>';
            //en cada fila ponemos un table data con el numero de columnas
            for (let j = 0; j < matriz[i].length; j++) {

                if (matriz[i][j] == 1){
                  html += '<td class="serpiente1">'+ matriz[i][j]+'</td>';
                  }
                else if(matriz[i][j] == 2){
                  html += '<td class="comida">'+ matriz[i][j]+'</td>';
                }
                else if (matriz[i][j] == 3){ // NUEVO: Clase para la cabeza
                  html += '<td class="cabezaSerp">'+ matriz[i][j]+'</td>';
                }
                else{
                   html += '<td>' + matriz[i][j] + '</td>';
                }
            }
        //cerramos las table row
        html += '</tr>';
    }
    
    //cerramos la tabla 
    html += '</table>';
    document.getElementById("tablero").innerHTML = html;
}





//  Pone un 1 a las posiciones de la matriz donde hay serpiente
function colocarSerpiente(){
    for (let i = 0; i < serpiente.length; i++) {
    posicion = serpiente[i];
      
      //si es la ultima posicion del array poner 3 sino poner 1
    if (i === serpiente.length - 1) {
          matriz[posicion[0]][posicion[1]] = 3; 
    }else {
          matriz[posicion[0]][posicion[1]] = 1; 
        }
  }
}




function keyDown(e){
    switch (e.key){
        case "ArrowLeft" : 
        {
            if(direccion!="ArrowRight")
              direccion = e.code;
            break;
        }
        case "ArrowRight" :
          {
            if(direccion!="ArrowLeft")
              direccion = e.code;
            break;
          }
          
        case "ArrowUp" :           
        {
         if(direccion!="ArrowDown")
              direccion = e.code;
            break; 
        }
         
        case "ArrowDown" :
          {
            if(direccion!="ArrowUp")
              direccion = e.code;
            break;
          }
        }           
}
   


function movimientoSerpiente(){
  
  // Mover la serpiente en la direccion actual
  let cabeza = serpiente[serpiente.length - 1];
  let nuevaCabeza =[];

  switch(direccion){

    case "ArrowRight":{
      nuevaCabeza[0]= cabeza[0];
      nuevaCabeza[1]= cabeza[1]+1;
      
      break;
      
    }
    case "ArrowLeft":{
      nuevaCabeza[0]= cabeza[0];
      nuevaCabeza[1]= cabeza[1]-1;
    
      break;
    }
    case "ArrowUp":{
      nuevaCabeza[0]= cabeza[0]-1;
      nuevaCabeza[1]= cabeza[1];

      break;
    }
    case "ArrowDown":{
      nuevaCabeza[0]= cabeza[0]+1;
      nuevaCabeza[1]= cabeza[1];
      break;
    }      
  }
  
  if(record<= puntuaciontotal){
    record = puntuaciontotal
    recordMundial.innerHTML = record;
    guardarCookie();
  }


  // Si se sale de los limites de la matriz -> GAme Over
  if (nuevaCabeza[0] == matriz.length || nuevaCabeza[0] == -1 || nuevaCabeza[1]==-1 || nuevaCabeza[1] == matriz[0].length ){
    GameOver();

  }else if(matriz[nuevaCabeza[0]][nuevaCabeza[1]]==2){ // Si como bola
    // Cambiar el array serpiente
    serpiente.push(nuevaCabeza);
    colocarSerpiente()
    colocarComida()
    mostrarMatriz()
    puntuaciontotal += 10;
    puntuacionActual.innerHTML =  puntuaciontotal;
    puntuacionfinal.innerHTML = puntuaciontotal;
    
    comidasConsumidas++;
    if (comidasConsumidas % 5 === 0) {
      if(velocidad >= velocidadMinima){
        velocidad = velocidad - reduccionVelocidad ;
        
        clearInterval(miInterval);
        miInterval = setInterval(movimientoSerpiente, velocidad);
      }
    }
  
  }else if (matriz[nuevaCabeza[0]][nuevaCabeza[1]] == 1 ){
    GameOver();

  }else{ //Si no -> continua el juego, la serpiente crece
    // Cambiar el array serpiente
    serpiente.push(nuevaCabeza);
  
    // Quitar cola
    let cola = serpiente.shift();
    matriz[cola[0]][cola[1]] = 0;

    colocarSerpiente()
    mostrarMatriz()
   }
}


function colocarComida (){
  let fila;
  let columna;
  do{
    fila = Math.floor(Math.random()*10);
    columna = Math.floor(Math.random()*20);
  }while(matriz[fila][columna] == 1);
  
  matriz[fila][columna] = 2;
}



function GameOver(){
  clearInterval(miInterval);
  puntuaciontotal = 0;
  puntuacionActual.innerHTML = puntuaciontotal;
  // Mostrar el overlay CAMBIANDO el stilo de none a bloque
  overlay.style.display = 'block';    
  pauseBtn.classList.add('oculto');
  // Event listener del botón - PASAMOS LA FUNCIÓN que borra el overlay e incia de nuevo 
  tryagain.addEventListener('click', intentaDenuevo);
}




// Función para cerrar el overlay
function intentaDenuevo() {
    overlay.style.display = 'none';
    iniciar();
  }

  

function pause(){
			if (!onOff) {
				onOff = true;
				clearInterval(miInterval);
        pauseBtn.classList.add('paused');
			
			} else {
				onOff = false;
				miInterval = setInterval(movimientoSerpiente, velocidad);
        pauseBtn.classList.remove('paused');
				
			}
	}


function iniciar()
  {
    //oculto esto
    boton.classList.add("oculto") // oculto el boton principal para que no se vea en el juego
    document.getElementById('imagenInicio').classList.add('oculto');//OCULTO LA IMAGEN DE INICIO
    
    //muestro esto
    puntaje.style.display = 'block'; //para que se muestre el puntaje
    document.getElementById('pausePlayBtn').classList.remove('oculto');//MUESTRO BOTON DE PAUSA
    
    
    //reseteo variables
    serpiente = [[3,3],[3,4],[3,5]]; //para poner siempre la serpiente en el mismo punto de incio
    direccion = "ArrowRight"; //para que cuando empieze siempre se vaya pa la derecha
    onOff= false; // TRUE ES PAUSADO , FALSE ES EN JUEGO 
    velocidad = 500;
    comidasConsumidas = 0;


    matriz = crearMatriz(10,20) 
    colocarSerpiente()
    mostrarMatriz()
    miInterval = setInterval(movimientoSerpiente,500)
    colocarComida();
  }

  function guardarCookie() {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = "recordSnake=" + record + ";expires=" + fecha.toUTCString() + ";path=/";
}

 function mostrarCookie() {
    const cookies = document.cookie.split('; ');
    let recordGuardado = null;
    
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith('recordSnake=')) {
            recordGuardado = cookies[i];
            break;
        }
    }
    
    if (recordGuardado) {
        record = parseInt(recordGuardado.split('=')[1]);
        recordMundial.innerHTML = record;
    }
} 


// MAIN
document.addEventListener("keydown", keyDown)
boton.addEventListener("click", iniciar)
document.getElementById('pausePlayBtn').addEventListener('click', pause);
window.addEventListener('load', mostrarCookie);
  
  
  
 





