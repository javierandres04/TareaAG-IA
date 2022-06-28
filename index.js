const cantGeneraciones = 100;
let generaciones = 0;
var img = new Image;
var src = "https://i.picsum.photos/id/9/200/300.jpg?hmac=BguC5kAGl-YR4FEjhjm0b2XWbynYsk3s3QQZUie5aBo"; //"https://picsum.photos/200/300";
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
img.crossOrigin = "Anonymous";
canvas = [];
context = [];
var imgData;
var nImages = 20;
var imageData = [];
var dataVector = [];
var oldDataVector = [];
img.src = src;

//CREAR POBLACION INICIAL

img.onload = function () {
  ctx.drawImage(img, 0, 0);
  imgData = ctx.getImageData(0, 0, 100, 100);
  drawHeader();
  for (let i = 0; i < nImages; i++) {
    if (i % 5 == 0) {
      row = table.insertRow(table.rows.length);
    }
    canvas[i] = document.createElement("canvas");
    canvas[i].width = canvas[i].height = "100";
    context[i] = canvas[i].getContext('2d');
    let canvasObj = {
      Figures: [],
      similarity: 0.0
    };
    getImage(canvasObj);
    dibujarFiguras(context[i], canvasObj);
    //context[i].putImageData(imgData,0,0) ;
    imageData[i] = context[i].getImageData(0, 0, 100, 100);
    context[i].font = 'italic 10pt Calibri';
    context[i].fillText(similarity(imgData, imageData[i]), 10, 95);
    canvasObj.similarity = similarity(imgData, imageData[i]);
    dataVector.push(canvasObj);
    row.appendChild(canvas[i]);
  }
}
//EJECUTAR GENERACIONES

const drawHeader = () => {
  imgData = ctx.getImageData(0, 0, 100, 100);
  table = document.getElementById('table');
  row = table.insertRow(table.rows.length);
  h2 = document.createElement('h2');
  h2.innerText = `Generación: ${generaciones}`
  row.appendChild(h2);
  let canvas = document.createElement('canvas');
  canvas.width = canvas.height = '100';
  canvasContext = canvas.getContext('2d');
  row = table.insertRow(table.rows.length);
  row.appendChild(canvas);
  canvasContext.drawImage(img, 0, 0);
}


const cruzarIndividuos = (canvasObj) => {
  let individuo1 = Math.floor(Math.random() * 20);
  let individuo2 = Math.floor(Math.random() * 20);

  while (individuo1 === individuo2) {
    individuo2 = Math.floor(Math.random() * 20);
  }
  let cantidadFigurasI1 = oldDataVector[individuo1].Figures.length;
  let cantidadFigurasI2 = oldDataVector[individuo2].Figures.length;
  let cantFigurasHijo = Math.floor((cantidadFigurasI1 + cantidadFigurasI2) / 2);
  if (cantFigurasHijo % 2 != 0) {
    cantFigurasHijo += Math.floor(Math.random() * 2);
  }
  let parentsFigures = oldDataVector[individuo1].Figures.concat(oldDataVector[individuo2].Figures);
  let figureIndex = 0;
  let figure;
  for (let i = 0; i < cantFigurasHijo; ++i) {
    figureIndex = Math.floor(Math.random() * parentsFigures.length);
    figure = parentsFigures[figureIndex];
    if (figure.type === 'l') {
      let lineObj = {
        x1: figure.x1,
        y1: figure.y1,
        x2: figure.x2,
        y2: figure.y2,
        lineWidth: figure.lineWidth,
        stroke: figure.stroke,
        type: 'l'
      }
      canvasObj.Figures.push(lineObj);
    }
    else if (figure.type === 'r') {
      let rectangleObj = {
        x1: figure.x1,
        y1: figure.y1,
        x2: figure.x2,
        y2: figure.y2,
        lineWidth: figure.lineWidth,
        stroke: figure.stroke,
        fill: figure.fill,
        type: 'r'
      }
      canvasObj.Figures.push(rectangleObj);
    }
    else {
      let circleObj = {
        x1: figure.x1,
        y1: figure.y1,
        radius: figure.radius,
        stroke: figure.stroke,
        fill: figure.fill,
        type: 'c'
      }
      canvasObj.Figures.push(circleObj);
    }
    parentsFigures.splice(figureIndex, 1);
  }
}

/* Pasos
  Cruces
  mutaciones - Probabilidad 5-10%
  aptitud
  selección
*/

document.getElementById('Avanzar').onclick = () => {
  for (let index = 0; index < cantGeneraciones; index++) {
    oldDataVector = dataVector;
    dataVector = [];
    generaciones++;
    if (index == cantGeneraciones - 1) {
      drawHeader();
    }
    for (let i = 0; i < nImages; i++) {
      if (index == cantGeneraciones - 1) {
        if (i % 5 == 0) {
          row = table.insertRow(table.rows.length);
        }
        canvas[i] = document.createElement("canvas");
        canvas[i].width = canvas[i].height = "100";
        context[i] = canvas[i].getContext('2d');
      }
      let canvasObj = {
        Figures: [],
        similarity: 0.0
      };
      cruzarIndividuos(canvasObj);
      dataVector.push(canvasObj);
      if (index == cantGeneraciones - 1) {
        row.appendChild(canvas[i]);
      }
    }
    seleccion();
    if (index == cantGeneraciones - 1) {
      for (let i = 0; i < dataVector.length; i++) {
        dibujarFiguras(context[i], dataVector[i]);
      }
      dataVector.sort(function (a, b) { return a.similarity - b.similarity });
      let mejorIndividuo = document.createElement("p");
      let row = table.insertRow(table.rows.length);
      mejorIndividuo.innerText = `El mejor individuo de la generación ${generaciones} tiene aptitud ${dataVector[0].similarity}`;
      row.appendChild(mejorIndividuo);
    }
  }
}


const mutarColor = (figures) => {
  let figure;
  const cantidadAMutar = Math.floor(Math.random() * figures.length);
  for (let i = 0; i < cantidadAMutar; i++) {
    figure = Math.floor(Math.random() * figures.length);
    if (figures[figure].type === 'l') {
      figures[figure].stroke = generateRandomColor();
    } else {
      figures[figure].stroke = generateRandomColor();
      figures[figure].fill = generateRandomColor();
    }
  }

}

const mutarCoordenadas = (figures) => {
  let figure;
  const cantidadAMutar = Math.floor(Math.random() * figures.length);
  for (let i = 0; i < cantidadAMutar; ++i) {
    figure = Math.floor(Math.random() * figures.length);
    if (figures[figure].type === 'c') {
      figures[figure].x1 = Math.floor((Math.random() * 100) + 1);
      figures[figure].y1 = Math.floor((Math.random() * 100) + 1);
    } else {
      figures[figure].x1 = Math.floor((Math.random() * 100) + 1);
      figures[figure].y1 = Math.floor((Math.random() * 100) + 1);
      figures[figure].x2 = Math.floor((Math.random() * 100) + 1);
      figures[figure].y2 = Math.floor((Math.random() * 100) + 1);
    }
  }
}

const mutarCantidadFiguras = (figures) => {
  desicion = Math.floor(Math.random() * 2);
  if (desicion == 0) {
    figuraElegida = Math.floor(Math.random() * figures.length);
    figures.splice(figuraElegida, 1);
  }
  else {
    const figuraACrear = Math.floor(Math.random() * 3);
    if (figuraACrear == 0) {
      generarLinea(figures);
    }
    else if (figuraACrear == 1) {
      generarRectangulo(figures);
    }
    else {
      generarCirculo(figures);
    }
  }
}

const mutarTamanio = (figures) => {
  let figure;
  const cantidadAMutar = Math.floor(Math.random() * figures.length);
  for (let i = 0; i < cantidadAMutar; i++) {
    figure = Math.floor(Math.random() * figures.length);
    if (figures[figure].type === 'c') {
      figures[figure].radius = Math.floor((Math.random() * 20) + 1);
    }
    figures[figure].lineWidth = Math.floor((Math.random() * 5) + 1);
  }
}


const mutarIndividuo = (canvasObj) => {
  let mutaciones = [mutarTamanio, mutarCoordenadas, mutarColor, mutarCantidadFiguras];
  let mutacion;
  let indiceMutacion = Math.floor(Math.random() * mutaciones.length);
  MutationProbability = Math.floor(Math.random() * 100);

  if (MutationProbability <= 15) {
    mutacion = mutaciones[indiceMutacion];
    mutacion(canvasObj.Figures);
    mutaciones.splice(indiceMutacion, 1);
    for (let i = 0; i < mutaciones.length; i++) {
      MutationProbability = Math.floor(Math.random() * 100);
      if (MutationProbability <= 30) {
        indiceMutacion = Math.floor(Math.random() * mutaciones.length);
        mutacion = mutaciones[indiceMutacion];
        mutacion(canvasObj.Figures);
        mutaciones.splice(indiceMutacion, 1);
      }
    }
  }

}

/*
Siguiente GEN:  20
Mejores:        16 de los 40
peores  : 2
espontaneos: 2
*/
const calcularAptitud = (vectorIndividuos) => {
  let canvas;
  let context;
  let aptitud;
  for (let i = 0; i < vectorIndividuos.length; i++) {
    canvas = document.createElement("canvas");
    canvas.width = canvas.height = "100";
    context = canvas.getContext("2d");
    dibujarFiguras(context, vectorIndividuos[i]);
    imageData[i] = context.getImageData(0, 0, 100, 100);
    context.font = 'italic 10pt Calibri';
    aptitud = similarity(imgData, imageData[i]);
    vectorIndividuos[i].similarity = aptitud;
  }
}

const seleccion = () => {
  let vectorIndividuos = dataVector.concat(oldDataVector);
  for (let i = 0; i < vectorIndividuos.length; i++) {
    mutarIndividuo(vectorIndividuos[i]);
  }
  calcularAptitud(vectorIndividuos);
  dataVector = [];
  vectorIndividuos.sort(function (a, b) { return a.similarity - b.similarity });
  for (let i = 0; i < 16; ++i) {
    //Sacar los más aptos entre cruzados y padres
    dataVector.push(vectorIndividuos[i]);
    vectorIndividuos.splice(i, 1);
  }
  for (let i = 0; i < 2; ++i) {
    randomSeleccionado = Math.floor(Math.random() * vectorIndividuos.length);
    dataVector.push(vectorIndividuos[randomSeleccionado]);
    vectorIndividuos.splice(randomSeleccionado, 1);
  }
  for (let i = 0; i < 2; ++i) {
    let canvasObj = {
      Figures: [],
      similarity: 0.0
    };
    getImage(canvasObj);
    let canvas = document.createElement("canvas");
    canvas.width = canvas.height = "100";
    let context = canvas.getContext("2d");
    dibujarFiguras(context, canvasObj);
    imageData[i] = context.getImageData(0, 0, 100, 100);
    context.font = 'italic 10pt Calibri';
    aptitud = similarity(imgData, imageData[i]);
    canvasObj.similarity = aptitud;
    dataVector.push(canvasObj);
  }
}


const dibujarFiguras = (context, canvasObj) => {
  for (let i = 0; i < canvasObj.Figures.length; i++) {
    let theFigure = canvasObj.Figures[i];
    if (theFigure.type === 'l') {
      drawLine(context, theFigure.x1, theFigure.y1, theFigure.x2, theFigure.y2, theFigure.lineWidth, theFigure.stroke);
    }
    else if (theFigure.type === 'r') {
      drawRectangle(context, theFigure.x1, theFigure.y1, theFigure.x2, theFigure.y2, theFigure.fill, theFigure.lineWidth, theFigure.stroke);
    }
    else {
      drawCircle(context, theFigure.x1, theFigure.y1, theFigure.radius, theFigure.fill, 3, theFigure.stroke);
    }
  }
  if (canvasObj.similarity > 0) {
    context.fillText(canvasObj.similarity, 10, 95);
  }

}

const generarLinea = (figures) => {
  x1 = Math.floor((Math.random() * 100) + 1);
  x2 = Math.floor((Math.random() * 100) + 1);
  y1 = Math.floor((Math.random() * 100) + 1);
  y2 = Math.floor((Math.random() * 100) + 1);
  stroke = generateRandomColor();
  lineWidth = Math.floor((Math.random() * 5) + 1);

  let lineObj = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    lineWidth: lineWidth,
    stroke: stroke,
    type: 'l'
  }
  figures.push(lineObj);
  return lineObj;
}

const generarRectangulo = (figures) => {
  x1 = Math.floor((Math.random() * 100) + 1);
  x2 = Math.floor((Math.random() * 100) + 1);
  y1 = Math.floor((Math.random() * 100) + 1);
  y2 = Math.floor((Math.random() * 100) + 1);
  fill = generateRandomColor();
  stroke = generateRandomColor();
  lineWidth = Math.floor((Math.random() * 5) + 1);

  let rectangleObj = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    lineWidth: lineWidth,
    stroke: stroke,
    fill: fill,
    type: 'r'
  }
  figures.push(rectangleObj);
  return rectangleObj;
}

const generarCirculo = (figures) => {
  x1 = Math.floor((Math.random() * 100) + 1);
  y1 = Math.floor((Math.random() * 100) + 1);
  fill = generateRandomColor();
  stroke = generateRandomColor();
  radius = Math.floor((Math.random() * 20) + 1);
  lineWidth = Math.floor((Math.random() * 5) + 1);

  let circleObj = {
    x1: x1,
    y1: y1,
    radius: radius,
    stroke: stroke,
    fill: fill,
    type: 'c'
  }
  figures.push(circleObj);
  return circleObj;
}



const generateRandomColor = () => {
  return "#" + Math.floor((Math.random() * 10)) +
    Math.floor((Math.random() * 10)) +
    Math.floor((Math.random() * 10)) +
    Math.floor((Math.random() * 10)) +
    Math.floor((Math.random() * 10)) +
    Math.floor((Math.random() * 10));
}

function getImage(canvasObj) {
  nCircles = Math.floor((Math.random() * 3) + 1);
  nLines = Math.floor((Math.random() * 3) + 1);
  nRectangles = Math.floor((Math.random() * 3) + 1);

  for (var i = 0; i < nCircles; i++) {
    circulo = generarCirculo(canvasObj.Figures);
  }

  for (var i = 0; i < nLines; i++) {
    linea = generarLinea(canvasObj.Figures);
  }

  for (var i = 0; i < nRectangles; i++) {
    rectangulo = generarRectangulo(canvasObj.Figures);
  }
}

function drawRectangle(context, x1, y1, x2, y2, fill, lineWidth, stroke) {
  context.beginPath();
  context.rect(x1, y1, x2, y2);
  context.fillStyle = fill;
  context.fill();
  context.lineWidth = lineWidth;
  //context.strokeStyle = stroke;
  //context.stroke();
}

function drawLine(context, x1, y1, x2, y2, lineWidth, stroke) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = lineWidth;
  context.strokeStyle = stroke;
  context.stroke();
}

function drawCircle(context, x, y, radius, fill, lineWidth, stroke) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = fill;
  context.fill();
  context.lineWidth = lineWidth;
  //context.strokeStyle = stroke;
  //context.stroke();
}


function similarity(imageData1, imageData2) {
  data2 = imageData2.data;
  data1 = imageData1.data;
  suma = 0;
  for (var i = 0; i < data1.length; i += 4) {
    suma += Math.pow((data1[i] - data2[i]), 2);
    suma += Math.pow((data1[i + 1] - data2[i + 1]), 2);
    suma += Math.pow((data1[i + 2] - data2[i + 2]), 2);

  }
  return Math.pow(suma, 1 / 2);
}