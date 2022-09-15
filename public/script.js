
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    const URL = "/model/machinelearning/";
    let model, webcam, labelContainer, maxPredictions;
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        await predict();
    }
    async function predict() {
        // predict can take in an image, video or canvas html element
        // image.src = "https://static.boredpanda.com/blog/wp-content/uploads/2020/06/low-quality-photo-face-depixelizer-28-5ef1f22d0b090__700.jpg";
        const image = new Image(224, 224); // width, height
        image.src = document.getElementById("img").src
        // document.body.appendChild(image);

        // let image = document.getElementById("img")  
        // let tensorImg =   tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        //   prediction = await model.predict(tensorImg).data();

        // var img = new Image();
        //     img.onload = function() {
        //         context.drawImage(img, 0, 0, 28, 28);
        //         data = context.getImageData(0, 0, 28, 28).data;
        //         var input = [];
        //         for(var i = 0; i < data.length; i += 4) {
        //             input.push(data[i + 2] / 255);
        //         }
        //         predict(input);
        //     };
        //     img.src = canvas.toDataURL('image/png');

        // img = new Image();
        // img.onload = function(){
        //   // image  has been loaded
        // };
        // img.src = image_url;

        // let image = document.getElementById("img")  
        // let image = new Image();
        // image.crossOrigin = `Anonymous`;
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement('div'));
        }
        const prediction = await model.predict(image);
        for (let i = 0; i < maxPredictions+1; i++) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tf.loadLayersModel('model/savedirf/model.json').then(function(model) {
// // tf.loadLayersModel('model/model.json').then(function(model) {
//     // window.model = model;
//     console.log("irf",model);
// });
//     tf.loadLayersModel('model/model.json').then(function(model) {
//         // window.model = model;
//         console.log(model);
//     });

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    $('#paint').css({'width': '60%'});
    $('#number').css({'width': '30%', 'font-size': '240px'});
    $('#clear').css({'font-size': '50px'});
} else {
    $('#paint').css({'width': '300px'});
    $('#number').css({'width': '150px', 'font-size': '120px'});
    $('#clear').css({'font-size': '35px'});
}

var cw = $('#paint').width();
$('#paint').css({'height': cw + 'px'});

cw = $('#number').width();
$('#number').css({'height': cw + 'px'});

// From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var compuetedStyle = getComputedStyle(document.getElementById('paint'));
canvas.width = parseInt(compuetedStyle.getPropertyValue('width'));
canvas.height = parseInt(compuetedStyle.getPropertyValue('height'));

var mouse = {x: 0, y: 0};

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
}, false);

context.lineWidth = isMobile ? 60 : 25;
context.lineJoin = 'round';
context.lineCap = 'round';
context.strokeStyle = '#0000FF';

canvas.addEventListener('mousedown', function(e) {
    context.moveTo(mouse.x, mouse.y);
    context.beginPath();
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    $('#number').html('<img id="spinner" src="spinner.gif"/>');
    canvas.removeEventListener('mousemove', onPaint, false);
    var img = new Image();
    img.onload = function() {
        context.drawImage(img, 0, 0, 28, 28);
        data = context.getImageData(0, 0, 28, 28).data;
        var input = [];
        for(var i = 0; i < data.length; i += 4) {
            input.push(data[i + 2] / 255);
        }
        predict(input);
    };
    img.src = canvas.toDataURL('image/png');
}, false);

var onPaint = function() {
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
};

tf.loadLayersModel('model/model.json').then(function(model) {
    window.model = model;
});

// http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
// Set up touch events for mobile, etc
canvas.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    canvas.dispatchEvent(new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    }));
}, false);
canvas.addEventListener('touchend', function (e) {
    canvas.dispatchEvent(new MouseEvent('mouseup', {}));
}, false);
canvas.addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    }));
}, false);

var predict = function(input) {
    if (window.model) {
        window.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then(function(scores){
            scores = scores[0];
            predicted = scores.indexOf(Math.max(...scores));
            $('#number').html(predicted);
        });
    } else {
        // The model takes a bit to load, if we are too fast, wait
        setTimeout(function(){predict(input)}, 50);
    }
}

$('#clear').click(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    $('#number').html('');
});


