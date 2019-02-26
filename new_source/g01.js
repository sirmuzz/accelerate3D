class G01 {
    constructor() {
        this.x = null;
        this.y = null;
        this.z = null;
        this.a = null;
        this.b = null;
        this.c = null;
        this.f = null;
        this.m = null;
        this.type_ = null;
    }

    isXY() {
        return this.x != null || this.y != null;
    }
      
    isZ() {
        return this.z != null;
    }
      
    setU(p) {
        this.a = p.x;
        this.b = p.y;
    }
      
    setL(p) {
        this.x = p.x;
        this.y = p.y;
    }
      
    getU() {
        return {
          x: this.a,
          y: this.b
        }
    }
      
     getL() {
        return {
          x: this.x,
          y: this.y
        }
    }
      
    toString() {
        var line = "G01"
          + (this.x == null ? "" : " X" + this.x.toFixed(3))
          + (this.y == null ? "" : " Y" + this.y.toFixed(3))
          + (this.z == null ? "" : " Z" + this.z.toFixed(3))
          + (this.a == null ? "" : " A" + this.a.toFixed(3))
          + (this.b == null ? "" : " B" + this.b.toFixed(3))
          + (this.c == null ? "" : " C" + this.c.toFixed(4))
          + (this.f == null ? "" : " F" + this.f.toFixed(0))
          + (this.type_ == null ? "" : " ; type: " + this.type_);
      
        return line;
    }
}
