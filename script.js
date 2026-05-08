const canvas = document.getElementById('canvasProyecto');
const ctx = canvas.getContext('2d');

let xmin, ymin, xmax, ymax;
let caso = 0;

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

    let ancho = xmax - xmin;
    let alto = ymax - ymin;

    ctx.strokeRect(xmin, ymin, ancho, alto);
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
        codigo = codigo + LEFT;
    } else if (x > xmax) {
        codigo = codigo + RIGHT;
    }

    if (y < ymin) {
        codigo = codigo + BOTTOM;
    } else if (y > ymax) {
        codigo = codigo + TOP;
    }

    return codigo;
}

function cohenSutherland(x1, y1, x2, y2) {
    let c1 = obtenerCodigo(x1, y1);
    let c2 = obtenerCodigo(x2, y2);
    let aceptar = false;

    let p1_recortado = { x: x1, y: y1 };
    let p2_recortado = { x: x2, y: y2 };

    while (true) {
        if (c1 == 0 && c2 == 0) {
            aceptar = true;
            break;
        }
        else if ((c1 & c2) != 0) {
            break;
        }
        else {
            let x, y;
            let puntoFuera;
            if (c1 != 0) {
                puntoFuera = c1;
            } else {
                puntoFuera = c2;
            }

            if (puntoFuera & TOP) { // Se cambió >= 8 por bitwise & para mayor precisión
                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            } else if (puntoFuera & BOTTOM) { // Se cambió >= 4 por &
                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            } else if (puntoFuera & RIGHT) { // Se cambió >= 2 por &
                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            } else {
                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

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

    if (aceptar) {
        trazarLinea(x1, y1, x2, y2, "red", 3);
        return { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1) };
    } else {
        return null;
    }
}


function cambiarLinea(direccion) {
    caso = Math.max(0, Math.min(4, caso + direccion));
    dibujarTodo();
}

function irLinea(index) {
    caso = index;
    dibujarTodo();
}

function actualizarVentana() {
    xmin = parseInt(document.getElementById('x1_in').value);
    ymin = parseInt(document.getElementById('y1_in').value);
    xmax = parseInt(document.getElementById('x2_in').value);
    ymax = parseInt(document.getElementById('y2_in').value);
    dibujarTodo();
}

function dibujarTodo() {
    //Borramos todo lo que hay en el cuadro para dibujar otra vez
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Dibujamos la ventana
    dibujarViewport();

    //Elegimos la línea que toca mostrar
    let lineaActual = lineas[caso];

    //Dibujamos la línea completa 
    trazarLinea(lineaActual.x1, lineaActual.y1, lineaActual.x2, lineaActual.y2, "#eeeeee", 1);

    //Llamamos al algoritmo cohenSutherland 
    let resultado = cohenSutherland(lineaActual.x1, lineaActual.y1, lineaActual.x2, lineaActual.y2);

    //Buscamos el panel
    let panel = document.getElementById('infoPanel');
    let mensaje = "<b>" + lineaActual.desc + "</b><br>";

    //Si la línea se o no avisamos si llega a estar fuera.
    if (resultado != null) {
        mensaje += "Punto recortado 1: (" + resultado.x1 + ", " + resultado.y1 + ")<br>";
        mensaje += "Punto recortado 2: (" + resultado.x2 + ", " + resultado.y2 + ")";
    } else {
        mensaje = mensaje + "Resultado: La línea está fuera de los límites.";
    }
    //mensaje adicional
    panel.innerHTML = mensaje;
}

actualizarVentana();

