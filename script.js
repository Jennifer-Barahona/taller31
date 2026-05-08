const canvas = document.getElementById('canvasProyecto');
const ctx = canvas.getContext('2d');

let xmin, ymin, xmax, ymax;

// CAMBIO: Ahora selecciona un índice aleatorio entre 0 y la cantidad de líneas disponibles
const lineas = [
    { x1: 50, y1: 50, x2: 500, y2: 400, desc: "Caso 1: Cruce diagonal total" },
    { x1: 150, y1: 150, x2: 350, y2: 250, desc: "Caso 2: Totalmente dentro" },
    { x1: 10, y1: 10, x2: 80, y2: 90, desc: "Caso 3: Totalmente fuera" },
    { x1: 250, y1: 20, x2: 250, y2: 430, desc: "Caso 4: Cruce vertical" },
    { x1: 40, y1: 200, x2: 510, y2: 200, desc: "Caso 5: Cruce horizontal" }
];

let caso = Math.floor(Math.random() * lineas.length);

function trazarLineaPersonalizada(x0, y0, x1, y1, color) {
    x0 = Math.round(x0); y0 = Math.round(y0);
    x1 = Math.round(x1); y1 = Math.round(y1);

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    ctx.fillStyle = color;

    while (true) {
        ctx.fillRect(x0, y0, 2, 2); 

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}

function dibujarViewport() {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    let ancho = xmax - xmin;
    let alto = ymax - ymin;
    ctx.strokeRect(xmin, ymin, ancho, alto);
}

const INSIDE = 0; const LEFT = 1; const RIGHT = 2; const BOTTOM = 4; const TOP = 8;

function obtenerCodigo(x, y) {
    let codigo = 0;
    if (x < xmin) codigo |= LEFT;
    else if (x > xmax) codigo |= RIGHT;
    if (y < ymin) codigo |= BOTTOM;
    else if (y > ymax) codigo |= TOP;
    return codigo;
}

function cohenSutherland(x1, y1, x2, y2) {
    let c1 = obtenerCodigo(x1, y1);
    let c2 = obtenerCodigo(x2, y2);
    let aceptar = false;

    while (true) {
        if ((c1 | c2) === 0) {
            aceptar = true; break;
        } else if ((c1 & c2) !== 0) {
            break;
        } else {
            let x, y;
            let puntoFuera = c1 !== 0 ? c1 : c2;
            if (puntoFuera & TOP) {
                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            } else if (puntoFuera & BOTTOM) {
                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            } else if (puntoFuera & RIGHT) {
                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            } else {
                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

            if (puntoFuera === c1) {
                x1 = x; y1 = y; c1 = obtenerCodigo(x1, y1);
            } else {
                x2 = x; y2 = y; c2 = obtenerCodigo(x2, y2);
            }
        }
    }

    if (aceptar) {
        trazarLineaPersonalizada(x1, y1, x2, y2, "red");
        return {x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1)};
    }
    return null;
}

function cambiarLinea(direccion) {
    caso = (caso + direccion + lineas.length) % lineas.length;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarViewport();
    
    let l = lineas[caso];
    
    trazarLineaPersonalizada(l.x1, l.y1, l.x2, l.y2, "#34ce20");
    
    let res = cohenSutherland(l.x1, l.y1, l.x2, l.y2);
    
    let panel = document.getElementById('infoPanel');
    let mensaje = "<b>" + l.desc + "</b><br>";
    if (res) {
        mensaje += "Punto recortado 1: (" + res.x1 + ", " + res.y1 + ")<br>";
        mensaje += "Punto recortado 2: (" + res.x2 + ", " + res.y2 + ")";
    } else {
        mensaje += "Resultado: Fuera de los límites.";
    }
    panel.innerHTML = mensaje;
}

actualizarVentana();