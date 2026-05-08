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

