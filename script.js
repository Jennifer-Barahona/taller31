const canvas = document.getElementById('canvasProyecto');
const ctx = canvas.getContext('2d');

let xmin, ymin, xmax, ymax;
let escenaActual = 0;

const lineas = [
    { x1: 50, y1: 50, x2: 500, y2: 400, desc: "Caso 1: Cruce diagonal total" },
    { x1: 150, y1: 150, x2: 350, y2: 250, desc: "Caso 2: Totalmente dentro" },
    { x1: 10, y1: 10, x2: 80, y2: 90, desc: "Caso 3: Totalmente fuera" },
    { x1: 250, y1: 20, x2: 250, y2: 430, desc: "Caso 4: Cruce vertical" },
    { x1: 40, y1: 200, x2: 510, y2: 200, desc: "Caso 5: Cruce horizontal" }
];

//tratazar la ventana
function dibujarViewport() {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
}
//trazar la linea
function trazarLinea(x1, y1, x2, y2, color, grosor) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


const INSIDE = 0; // 0000
const LEFT = 1; // 0001
const RIGHT = 2; // 0010
const BOTTOM = 4; // 0100
const TOP = 8; // 1000

function obtenerCodigo(x, y) {
    let codigo = 0; 
    if (x < xmin) {
        codigo = codigo + LEFT;   // Si es izquierda, suma 1
    } else if (x > xmax) {
        codigo = codigo + RIGHT;  // Si es derecha, suma 2
    }

    if (y < ymin) {
        codigo = codigo + BOTTOM; // Si es abajo, suma 4
    } else if (y > ymax) {
        codigo = codigo + TOP;    // Si es arriba, suma 8
    }

    return codigo;
}

function cohenSutherland(x1, y1, x2, y2) {
    let c1 = obtenerCodigo(x1, y1);
    let c2 = obtenerCodigo(x2, y2);
    let aceptar = false;
    
    // Guardamos para devolverlos al final
    let p1_recortado = {x: x1, y: y1};
    let p2_recortado = {x: x2, y: y2};


    while (true) {
        //Si ambos códigos son 0 la línea está dentro
        if (c1 == 0 && c2 == 0) {
            aceptar = true; 
            break; 
        } 
        //Si comparten un bit (están del mismo lado fuera)
        else if ((c1 & c2) != 0) { 
            break; 
        } 
        //Hay que cortar un pedazo de la línea
        else {
            let x, y;
            //Miramos cual punto esta afuera para recortar
            let puntoFuera;
            if (c1 != 0) {
                puntoFuera = c1;
            } else {
                puntoFuera = c2;
            }

            // Calculamos para saber donde choca la linea con el borde 
            if (puntoFuera >= 8) { //Arriba(TOP)
                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            } else if (puntoFuera >= 4) { //Abajo(BOTTOM)
                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            } else if (puntoFuera >= 2) { //Derech(RIGHT)
                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            } else { //Izquierda(LEFT)
                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

            //Cambiamos el punto viejo por el nuevo punto recortado
            if (puntoFuera == c1) {
                x1 = x; y1 = y;
                p1_recortado.x = x; p1_recortado.y = y;
                c1 = obtenerCodigo(x1, y1);
            } else {
                x2 = x; y2 = y;
                p2_recortado.x = x; p2_recortado.y = y;
                c2 = obtenerCodigo(x2, y2);
            }
        }
    }

    // Si al final se decide que la linea de puede ver entonces la dibujamos
    if (aceptar) {
        trazarLinea(x1, y1, x2, y2, "red", 3);
        return {p1: p1_recortado, p2: p2_recortado};
    } else {
        return null;
    }
}


function cambiarLinea(direccion) {
    caso = Math.max(0, Math.min(4, caso + direccion));
    renderizar();
}

function irLinea(index) {
    caso = index;
    renderizar();
}

function actualizarVentana() {
    xmin = parseInt(document.getElementById('x1_in').value);
    ymin = parseInt(document.getElementById('y1_in').value);
    xmax = parseInt(document.getElementById('x2_in').value);
    ymax = parseInt(document.getElementById('y2_in').value);
    renderizar();
}

