angular.module('labelmaker', [])

  .run(function($rootScope, $interval) {
    console.log('Running!');

    $rootScope.custom = {
      lines: {
        'line 1': 'Airtasker',
        'line 2': 'Example',
        'line 3': 'By Michael',
      }
    };

    $rootScope.pickFile = function(id) {
      angular.element('#'+id)
        .click();
    }

  })

  .directive('bottleLabel', function() {
    return {
      restrict: 'E',
      controller: function($element, $rootScope, $document) {

        var canvas = $element.find('canvas');

        var template = {
          base: [
            {
              type: 'image',
              source: 'concrete.jpg',
              x: 100,
              y: 100,
              width: 1400,
              height: 1800,
              fromCenter: false
            },{
              name: 'colour',
              type: 'rectangle',
              fillStyle: 'red',
              strokeStyle: '#333',
              strokeWidth: 10,
              cornerRadius: 50,
              x: 100,
              y: 100,
              width: 1400,
              height: 1800,
              fromCenter: false,
              compositing: 'multiply'
            },{
              type: 'rectangle',
              strokeStyle: '#EDE8C6',
              strokeWidth: 50,
              cornerRadius: 75,
              x: 75,
              y: 75,
              width: 1450,
              height: 1850,
              fromCenter: false
            },
          ]
        };

        // Draw base layers
        for(var i in template.base) {
          canvas.addLayer(template.base[i]);
        }

        canvas.addLayer({
          type: 'text',
          name: 'line 1',
          fillStyle: '#EDE8C6',
          strokeStyle: '#333',
          strokeWidth: 10,
          x: 800, y: 250,
          fontSize: 250,
          fontFamily: 'Permanent Marker, sans-serif',
        })

        canvas.addLayer({
          type: 'text',
          name: 'line 2',
          fillStyle: '#EDE8C6',
          strokeStyle: '#333',
          strokeWidth: 10,
          x: 800, y: 475,
          fontSize: 220,
          fontFamily: 'Permanent Marker, sans-serif',
        })

        canvas.addLayer({
          type: 'text',
          name: 'line 3',
          fillStyle: '#EDE8C6',
          strokeStyle: '#333',
          strokeWidth: 5,
          x: 800, y: 1700,
          fontSize: 180,
          fontFamily: 'Verdana, sans-serif',
        })

        canvas.addLayer({
          type: 'image',
          source: 'placeholder.png',
          x: 100,
          y: 630,
          width: 1400,
          height: 932,
          fromCenter: false,
          compositing: 'source-over'
        });

        /*canvas.addLayer({
          type: 'image',
          source: 'underwatermatt.jpg',
          name: 'img',
          x: 100,
          y: 630,
          width: 1400,
          height: 932,
          sx: 0,
          sy: 160,
          sWidth: 480,
          sHeight: 320,
          cropFromCenter: false,
          fromCenter: false
        })*/

        canvas.on('mousemove', function(e) {
          var overImage = (
            e.offsetX > 12 && e.offsetX < 150
            && e.offsetY > 65 && e.offsetY < 155);
          canvas.css('cursor', overImage?'all-scroll':'default');
        });

        $document.on('mousemove', function(e) {
          if(startPos) {
            var xShift = e.clientX - startPos.x;
            var yShift = startCrop.y - 2*(e.clientY - startPos.y);
            var img = canvas.getLayer('img');
            yShift = Math.min(yShift, img.sHeight);
            yShift = Math.max(yShift, 160);
            canvas.setLayer('img', {
              //sx: startCrop.x - xShift,
              sy: yShift
            });
            canvas.drawLayers();
          }
        });

        var startPos, startCrop;
        canvas.on('mousedown', function(e) {
          if(canvas.css('cursor') != 'all-scroll') { return; }
          startPos = {
            x: e.clientX,
            y: e.clientY
          };
          var img = canvas.getLayer('img');
          console.log(img);
          startCrop = {
            x: img.sx,
            y: img.sy
          }
        });

        $document.on('mouseup', function() {
          startPos = false;
        })

        canvas.drawLayers();

        $rootScope.$watch('custom.lines', function() {
          for(var i in $rootScope.custom.lines) {
            canvas.setLayer(i, {
              text: $rootScope.custom.lines[i]
            });
          }
          canvas.drawLayers();
        }, true);

        $rootScope.$on('colorChange', function(evt, arg) {
          canvas.setLayer('colour', {
            fillStyle: arg
          });
          canvas.drawLayers();
        })

      },
      template: `
        <canvas width="1600" height="2000" style="width: 100%; height: 100%;"></canvas>
      `
    }
  })

  .directive('colourPick', function() {
    return {
      restrict: 'A',
      scope: {
        'colour-pick': '@'
      },
      controller: function($element, $scope, $rootScope) {
        $scope.thiscol = $element.attr('color');
        $element.click(function() {
          $rootScope.$broadcast('colorChange', $element.attr('color'));
        });
      },
      template: `
        <div class="colour" ng-style="{background: thiscol}"></div>
      `
    }
  })