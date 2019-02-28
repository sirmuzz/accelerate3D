class PIDController {
    constructor( Kp = 0.01, Ki = 0.001, Kd = 0.001 ){
        this._currentTime = performance.now();
        this._initialTime = this._currentTime;
        this._deltaTime = 0;

        this._proportion = 0;
        this._integral = 0;
        this._derivative = 0;
        this._Kp = Kp;
        this._Ki = Ki;
        this._Kd = Kd;
    }

    step( target_position, current_position ) {
        var delta = target_position - current_position;

        this._currentTime = performance.now();
        this._deltaTime = (this._currentTime - this._initialTime) / 1000;
        this._initialTime = this._currentTime;

        this._proportion = delta;
        this._integral += delta;
        this._derivative = delta / this._deltaTime;
  
        return (
            current_position + 
            (this._proportion * this._Kp) + 
            (this._integral * this._Ki) + 
            (this._derivative * this._Kd)
        );
    }

    get Kp() { return this._Kp; }
    set Kp( val ) { this._Kp = val; }

    get Ki() { return this._Ki; }
    set Ki( val ) { this._Ki = val; }

    get Kd() { return this._Kd; }
    set Kd( val ) { this._Kd = val; }
}

//exports.PIDController;