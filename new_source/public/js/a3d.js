class A3D {
    constructor(window, start_x = 0, start_y = 0, controller_id = "controller", gantry1_id = "gantry1", gantry2_id = "gantry2" ){
        this.animationWidth = 800;
        this.animationHeight = 500;
        window.a3d = this;
        this._window = window;
        this._vendors = ['webkit', 'moz', 'ms'];
        this._prefix = '';
        this._element = this._window.document.createElement('div');
        this._gantry = new Gantry( start_x, start_y );

        for(var i in this._vendors){
            if(['-' + this._vendors[i] + '-transform'] in this._element.style){
                this._prefix = '-' + this._vendors[i] + '-';
            }
        }

        this._gantry1 = this._window.document.getElementById(gantry1_id);
        this._gantry2 = this._window.document.getElementById(gantry2_id);
        
        this.onPidControl = function() {
            console.log("PID Control Input");
            var a3d = window.a3d;
            var pid_kp = window.document.getElementById("pid_kp").value;
            var pid_ki = window.document.getElementById("pid_ki").value;
            var pid_kd = window.document.getElementById("pid_kd").value;
            a3d.setXPID( pid_kp, pid_ki, pid_kd );
            a3d.setYPID( pid_kp, pid_ki, pid_kd );
        };

        this._window.document.getElementById("pid_kp").oninput = this.onPidControl;
        this._window.document.getElementById("pid_ki").oninput = this.onPidControl;
        this._window.document.getElementById("pid_kd").oninput = this.onPidControl;


        this._regex = new RegExp(/\(([^)]+)\)/);

        this._gantry1.style[this._prefix + 'transform'] = 'translate3d(' + start_x + 'px, ' + start_y + 'px, 0)';
        this._gantry2.style[this._prefix + 'transform'] = 'translate3d(' + start_x + 'px, ' + start_y + 'px, 0)';

        setInterval(function(){
            var a3d = window.a3d;
            var offsetX = parseInt(Math.random() * a3d.animationWidth);
            var offsetY = parseInt(Math.random() * a3d.animationHeight);
            a3d._gantry1.style[a3d._prefix + 'transform'] = 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0)';
        }, 2000);

        this.tick();
    }

    getCurrentPosition( element ){
        return { x: parseFloat(this._regex.exec(element.style[this._prefix + 'transform'])[1].split(', ')[0]),
                 y: parseFloat(this._regex.exec(element.style[this._prefix + 'transform'])[1].split(', ')[1]) };
    }

    setCurrentPosition( element, offsetX, offsetY ){
        element.style[this._prefix + 'transform'] = 'translate3d(' + offsetX + 'px,' + offsetY + 'px, 0)';
    }

    setXPID( Kp, Kd, Ki ){
        this._gantry.PIDX_Kp = Kp;
        this._gantry.PIDX_Kd = Kd;
        this._gantry.PIDX_Ki = Ki;
    }

    setYPID( Kp, Kd, Ki ){
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