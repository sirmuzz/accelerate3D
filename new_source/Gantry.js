require('./PIDController');

class Gantry {
    constructor( start_posX = 0.0, start_posY = 0.0 ){
        this._posX = start_posX;
        this._posY = start_posY;
        this._posA = start_posX;
        this._posB = start_posY;

        this._pidX = new PIDController();
        this._pidY = new PIDController();
    }

    get PosX() { return this._posX; }
    get PosY() { return this._posY; }
    get PosA() { return this._posA; }
    get PosB() { return this._posB; }

    set PIDX_Kp( val ) { this._pidX.Kp = val; }
    set PIDX_Kd( val ) { this._pidX.Kd = val; }
    set PIDX_Ki( val ) { this._pidX.Ki = val; }

    set PIDY_Kp( val ) { this._pidX.Kp = val; }
    set PIDY_Kd( val ) { this._pidX.Kd = val; }
    set PIDY_Ki( val ) { this._pidX.Ki = val; }


    step( target_x, target_y ){
        this._posX = target_x;
        this._posY = target_y;
        this._posA = this._pidX.step( target_x, this._posA );
        this._posB = this._pidY.step( target_y, this._posB );
    }
}