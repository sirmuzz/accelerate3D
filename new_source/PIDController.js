class PIDController {
    constructor( Kp = 0.01, Ki = 0.004, Kd = 0.001 ){
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
        this._currentTime = performance.now();
        this._deltaTime = (this._currentTime - this._initialTime) / 1000;
        this._initialTime = this._currentTime;
        delta = target_position - current_position;
        this._proportion = delta;
        this._integral += delta;
        this._derivative = delta / this._deltaTime;
  
        return (currentPosition + (this._proportion * Kp) + (this._integral * Ki) + (this._derivative * Kd));
    }

    get Kp() { return this._Kp; }
    set Kp( val ) { this._Kp = val; }

    get Ki() { return this._Ki; }
    set Ki( val ) { this._Ki = val; }

    get Kd() { return this._Kd; }
    set Kd( val ) { this._Kd = val; }
}

exports.PIDController;