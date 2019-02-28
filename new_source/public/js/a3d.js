class A3D {
    constructor(window, start_x = 0, start_y = 0, gantry1_id = "gantry1", gantry2_id = "gantry2" ){
        this.animationWidth = 400;
        this.animationHeight = 400;
        this.speed = 1000;
        window.a3d = this;
        this._window = window;
        this._vendors = ['webkit', 'moz', 'ms'];
        this._prefix = '';
        
        this._gantry = new Gantry( start_x, start_y );
        this._gcode_data = "";
        this._lastLine = {x:0, y:0, z:0, e:0, f:0, extruding:false};
        this._relative = false;
        this._interval = 0;

        this._element = this._window.document.createElement('div');
        for(var i in this._vendors){
            if(['-' + this._vendors[i] + '-transform'] in this._element.style){
                this._prefix = '-' + this._vendors[i] + '-';
            }
        }

        this._gantry1 = this._window.document.getElementById(gantry1_id);
        this._gantry2 = this._window.document.getElementById(gantry2_id);

        function onInterval(){
            var a3d = window.a3d;
            var offsetX = parseInt(Math.random() * a3d.animationWidth);
            var offsetY = parseInt(Math.random() * a3d.animationHeight);
            console.log("POSX:" + offsetX + " POSY:" + offsetY);
            a3d._gantry1.style[a3d._prefix + 'transform'] = 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0)';
        }
        
        function onPidControl() {
            var a3d = window.a3d;
            var pid_kp = window.document.getElementById("pid_kp").value;
            var pid_ki = window.document.getElementById("pid_ki").value;
            var pid_kd = window.document.getElementById("pid_kd").value;
            if( isNaN(pid_kp) ){ return; }
            if( isNaN(pid_ki) ){ return; }
            if( isNaN(pid_kd) ){ return; }
            a3d.setPID( pid_kp, pid_ki, pid_kd );
            console.log("PID Change: Kp=" + pid_kp + " Ki=" + pid_ki + " Kd=" + pid_kd);
        };

        function onSize1Change() {
            var sz = window.document.getElementById("g1_size").value;
            var g1 = window.document.getElementById("gantry1");
            g1.style.height = (sz + "px");
            g1.style.width = (sz + "px");
            console.log("Size 1 Change: " + sz);
        };

        function onSize2Change() {
            var sz = window.document.getElementById("g2_size").value;
            var g2 = window.document.getElementById("gantry2");
            g2.style.height = (sz + "px");
            g2.style.width = (sz + "px");
            console.log("Size 2 Change: " + sz);
        };

        function onSpeedChange() {
            var speedometer = document.getElementById('speed');
            var a3d = window.a3d;
            a3d.speed = speedometer.value;

            clearInterval(a3d._interval);
            a3d._interval = setInterval( onInterval, this.speed );
            console.log("Speed Change: " + a3d.speed);
        };

        this._canvas = this._window.document.getElementById('canvas');
        this._canvas.addEventListener("click", showCoords);
        //this._canvas.addEventListener("mousemove", showCoords);
        this._canvas.width = 500;
        this._canvas.height = 500;
        this.draw();

        

        var speedometer = document.getElementById('speed');
        speedometer.addEventListener('change', onSpeedChange);
        this.speed = speedometer.value;

        var g1_sizer = document.getElementById('g1_size');
        var g2_sizer = document.getElementById('g2_size');
        var gantry1 = document.getElementById("gantry1");
        var gantry2 = document.getElementById("gantry2");
        g1_sizer.addEventListener('input', onSize1Change);
        g2_sizer.addEventListener('input', onSize2Change);
        g1_sizer.value = gantry1.offsetWidth;
        g2_sizer.value = gantry2.offsetWidth;

        var pid_kp = window.document.getElementById("pid_kp");
        var pid_ki = window.document.getElementById("pid_ki");
        var pid_kd = window.document.getElementById("pid_kd");

        this.setPID( pid_kp.value, pid_ki.value, pid_kd.value );
        console.log("PID SET TO: Kp=" + pid_kp.value + " Ki=" + pid_ki.value + " Kd=" + pid_kd.value);

        pid_kp.addEventListener('input', onPidControl);
        pid_ki.addEventListener('input', onPidControl);
        pid_kd.addEventListener('input', onPidControl);
        window.document.getElementById('pid_update').addEventListener('click', onPidControl);

        document.getElementById('gcode_file').addEventListener('input', openDialog);

        function openDialog() {
            var gcode_file = document.getElementById("gcode_file").files[0];

            var fileReader = new FileReader();
            fileReader.onload = function(event){
                var a3d = window.a3d;
                a3d.parseGCodeData(a3d._gcode_data);
            };

            fileReader.readAsText(gcode_file, "UTF-8");
        }

        this._regex = new RegExp(/\(([^)]+)\)/);

        this._gantry1.style[this._prefix + 'transform'] = 'translate3d(' + start_x + 'px, ' + start_y + 'px, 0)';
        this._gantry2.style[this._prefix + 'transform'] = 'translate3d(' + start_x + 'px, ' + start_y + 'px, 0)';

        this._interval = setInterval( onInterval, this.speed);

        this.tick();
    }
  
    draw() {
            var width = 500;
            var height = 500;
            var canvas = this._canvas
            if (canvas.getContext) {
                var context = canvas.getContext('2d');

            for(var x=0.5;x<width;x+=10) {
                context.moveTo(x,0);
                context.lineTo(x,width);
            }

            for(var y=0.5; y<height; y+=10) {
                context.moveTo(0,y);
                context.lineTo(height,y);

            }

            context.strokeStyle='grey';
            context.stroke();

            }
    }
  
    

    parseGCodeData( gcode_data ) {
        this._gcode_data = gcode_data;
        console.log("Parsing GCODE...");
        var parser = new GCodeParser({  	
            G1: function(args, line) {
                console.log("G1");
                console.log(args);
                console.log(line);
              // Example: G1 Z1.0 F3000
              //          G1 X99.9948 Y80.0611 Z15.0 F1500.0 E981.64869
              //          G1 E104.25841 F1800.0
              // Go in a straight line from the current (X, Y) point
              // to the point (90.6, 13.8), extruding material as the move
              // happens from the current extruded length to a length of
              // 22.4 mm.
        
              var newLine = {
                x: args.x !== undefined ? absolute(lastLine.x, args.x) : lastLine.x,
                y: args.y !== undefined ? absolute(lastLine.y, args.y) : lastLine.y,
                z: args.z !== undefined ? absolute(lastLine.z, args.z) : lastLine.z,
                e: args.e !== undefined ? absolute(lastLine.e, args.e) : lastLine.e,
                f: args.f !== undefined ? absolute(lastLine.f, args.f) : lastLine.f,
              };
              /* layer change detection is or made by watching Z, it's made by
                 watching when we extrude at a new Z position */
                if (delta(this._lastLine.e, newLine.e) > 0) {
                    newLine.extruding = delta(this._lastLine.e, newLine.e) > 0;
                    if (layer == undefined || newLine.z != layer.z)
                        newLayer(newLine);
                }
                addSegment(this._lastLine, newLine);
                this._lastLine = newLine;
            },
            G21: function(args, line) {
                console.log("G21");
                console.log(args);
                console.log(line);
                // G21: Set Units to Millimeters
                // Example: G21
                // Units from now on are in millimeters. (This is the RepRap default.)
          
                // No-op: So long as G20 is not supported.
              },
          
              G90: function(args, line) {
                console.log("G90");
                console.log(args);
                console.log(line);
                // G90: Set to Absolute Positioning
                // Example: G90
                // All coordinates from now on are absolute relative to the
                // origin of the machine. (This is the RepRap default.)
          
                this._relative = false;
              },
          
              G91: function(args, line) {
                console.log("G91");
                console.log(args);
                console.log(line);
                // G91: Set to Relative Positioning
                // Example: G91
                // All coordinates from now on are relative to the last position.
          
                // TODO!
                this._relative = true;
              },
          
              G92: function(args, line) { // E0
                console.log("G92");
                console.log(args);
                console.log(line);
                // G92: Set Position
                // Example: G92 E0
                // Allows programming of absolute zero point, by reseting the
                // current position to the values specified. This would set the
                // machine's X coordinate to 10, and the extrude coordinate to 90.
                // No physical motion will occur.
          
                // TODO: Only support E0
                var newLine = this._lastLine;
                newLine.x= args.x !== undefined ? args.x : newLine.x;
                newLine.y= args.y !== undefined ? args.y : newLine.y;
                newLine.z= args.z !== undefined ? args.z : newLine.z;
                newLine.e= args.e !== undefined ? args.e : newLine.e;
                this._lastLine = newLine;
              },
          
              M82: function(args, line) {
                console.log("M82");
                console.log(args);
                console.log(line);
                // M82: Set E codes absolute (default)
                // Descriped in Sprintrun source code.
          
                // No-op, so long as M83 is not supported.
              },
          
              M84: function(args, line) {
                console.log("M84");
                console.log(args);
                console.log(line);
                // M84: Stop idle hold
                // Example: M84
                // Stop the idle hold on all axis and extruder. In some cases the
                // idle hold causes annoying noises, which can be stopped by
                // disabling the hold. Be aware that by disabling idle hold during
                // printing, you will get quality issues. This is recommended only
                // in between or after printjobs.
          
                // No-op
              },
          
              'default': function(args, info) {
                console.log(args);
                console.log(info);
                console.error('Unknown command');
              },
            });
        parser.parse(gcode_data);
    }

    getCurrentPosition( element ){
        return { x: parseFloat(this._regex.exec(element.style[this._prefix + 'transform'])[1].split(', ')[0]),
                 y: parseFloat(this._regex.exec(element.style[this._prefix + 'transform'])[1].split(', ')[1]) };
    }

    setCurrentPosition( element, offsetX, offsetY ){
        var radius = this._gantry1.offsetWidth / 2;
        var radius2 = this._gantry2.offsetWidth / 2;
        var posX = offsetX + ( radius - radius2 );
        var posY = offsetY + ( radius - radius2 );
        
        element.style[this._prefix + 'transform'] = 'translate3d(' + posX + 'px,' + posY + 'px, 0)';
    }

    setPID( Kp, Kd, Ki ){
        this._gantry.PIDX_Kp = Kp;
        this._gantry.PIDX_Kd = Kd;
        this._gantry.PIDX_Ki = Ki;

        this._gantry.PIDY_Kp = Kp;
        this._gantry.PIDY_Kd = Kd;
        this._gantry.PIDY_Ki = Ki;
    }

    tick(){
        var a3d = window.a3d;
        window.requestAnimationFrame(a3d.tick);
        var gantry1_pos = a3d.getCurrentPosition(a3d._gantry1);
        a3d._gantry.step( gantry1_pos.x, gantry1_pos.y );
        a3d.setCurrentPosition( a3d._gantry2, a3d._gantry.PosA, a3d._gantry.PosB );
    }



}