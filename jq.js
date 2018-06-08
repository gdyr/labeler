$(function() {

  var canvas1 = $('#label');
  canvas1.css('cursor', 'zoom-in');

  var image;
  var imagePos = {};

  var canvases = [canvas1, $('#hq')];
  for(var i in canvases) {

    var s = 1 + i*3

    var dim = {
      w: canvases[i][0].getContext('2d').canvas.width,
      h: canvases[i][0].getContext('2d').canvas.height
    };

    canvases[i].addLayer({
      name: 'rect',
      type: 'rectangle',
      fillStyle: 'steelblue',
      x: dim.w/2,
      y: dim.h/2,
      width: dim.w - s*200, height: dim.h - s*200,
    });

    canvases[i].addLayer({
      name: 'text',
      type: 'text',
      fillStyle: '#9cf',
      x: dim.w/2,
      y: dim.h/2,
      fontSize: 48*s,
      fontFamily: 'Verdana, sans-serif',
      text: 'Hello' + (label ? ' ' + label : '')
    });

    canvases[i].addLayer({
      name: 'img',
      type: 'image',
      visible: false,
      draggable: true,
      fromCenter: false,
      mouseover: function() {
        $(this).css('cursor', 'all-scroll');
      },
      mouseout: function() {
        $(this).css('cursor', 'zoom-in');
      },
      dragstop: function(layer) {
        imagePos.y = layer.y// - layer.height/2;
        imagePos.x = layer.x// - layer.width/2;
        console.log(imagePos, layer.height, layer.width);
      }
    });
    
  }

  function redraw(canvas, s) {

    if(!s) { s = 1; }

    var dim = {
      w: canvas[0].getContext('2d').canvas.width,
      h: canvas[0].getContext('2d').canvas.height
    };

    var label = $("#text").val();
    canvas.setLayer('text', {
      text: 'Hello' + (label ? ' ' + label : '')
    });

    if(image) {
      var area = {width: dim.w - s*300, height: dim.h - s*300};
      var rs = area.width / area.height;
      var ri = image.width / image.height;
      var imageDim = {
        w: rs > ri ? image.width * area.height / image.height : area.width,
        h: rs > ri ? area.height : image.height * area.width / image.width
      };
      if(!imagePos.x) { imagePos.x = dim.w/2 - imageDim.w/2};
      if(!imagePos.y) { imagePos.y = dim.h/2 - imageDim.h/2};
      canvas.setLayer('img', {
        source: image.src,
        x: imagePos.x * s,
        y: imagePos.y * s,
        width: imageDim.w,
        height: imageDim.h,
        visible: true
      })
      console.log('imagerender?');
    } else {
      //placeLabel();
    }

    console.log(canvas)

    canvas.drawLayers();

  }

  redraw(canvas1);

  $('#load').click(function() {
    var file = $('#file')[0].files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function() {
      image = new Image();
      image.src = reader.result;
      image.onload = function() { redraw(canvas1); }
    }, false);
    if(file) { reader.readAsDataURL(file); }
  })
  
  $('#text').on('keyup', function() {
    setTimeout(function() {
      redraw(canvas1);
    });
  });

  $("#save").click(function() {
    redraw($('#hq'), 4);
    var image = $('#hq')[0].toDataURL('image/jpg');
    $("#save").attr('href',image);
  })

  $('#zoomed').click(function() {
    $('#zoomed').addClass('hidden');
  })

  canvas1.click(function() {
    if(canvas1.css('cursor') != 'zoom-in') { return; }
    redraw($('#hq'), 4);
    $('#zoomed').removeClass('hidden');
  })

});