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



