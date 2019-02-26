class Program {

    constructor(){
        this.maxX_ = maxX;
        this.maxY_ = maxY;
        this.maxFlex_ = maxFlex;

        this.codes_ = [];
        this.xyCodes_ = [];
        this.layerStarts_ = [];
        this.l_ = {
            x: 0,
            y: 0
        };
        this.u_ = {
            x: 0,
            y: 0
        };
        this.index_ = 0;
    }

    parse( code ){

    }

    get MaxX() {
        return this.maxX_;
    }

    get MaxY() {
        return this.maxY_;
    }

    get MaxFlex() {
        return this.maxFlex_;
    }

    get NumberOfLayers() {
        return this.layerStarts_.length;
    }

    get Output() {
        return this.output_;
    }

    getLayer( layerNumber ) {
        var start = this.layerStarts_[layerNumber - 1];
        var end = Math.min(this.layerStarts_[layerNumber], this.codes_.length);
        end = end || this.codes_.length;
        var moves = [];
        for (var i = start; i < end; i++) {
            var code = this.codes_[i];
            if (typeof code != "string") {
            if (code.x != null) {
                moves.push( {
                x: code.x,
                y: code.y,
                a: code.a,
                b: code.b,
                m: code.m,
                type_: code.type_,
                text: code.toString()
                })
            }
            }
        }

        var prependCode = null;
        for (i = start; i >= 0; i--) {
            code = this.codes_[i];
            if (typeof code != "string") {
            if (code.x != null) {
                prependCode = {
                x: code.x,
                y: code.y,
                a: code.a,
                b: code.b,
                m: code.m,
                type_: code.type_,
                text: code.toString()
                };
                break;
            }
            }
        }
        if (prependCode != null) {
            moves.unshift(prependCode);
        } else {
            moves.unshift({
            x: 0,
            y: 0,
            a: 0,
            b: 0,
            m: null,
            text: "Starting Point"
            })
        }

        return moves;
    }

    buildOutput_() {
        var s = "";
        for (var i = 0; i < this.codes_.length; i++) {
            var code = this.codes_[i];
            if (typeof code != "string") {
            var line = code.toString();
            s = s.concat(line, "\n")
            } else {
            s = s.concat(code, "\n")
            }
        }
        this.output_ = s;
    }

    calculateABAxis() {
        while (this.index_ < this.xyCodes_.length) {
            this.step();
            this.index_++;
        }
    }

    step() {
        var l1 = this.xyCodes_[this.index_];
        if (l1.x > this.maxX_) {
            this.maxX_ = l1.x;
        }
        if (l1.y > this.maxY_) {
            this.maxY_ = l1.y;
        }
        if (l1.x > this.maxY_) {
            this.maxY_ = l1.x;
        }
        if (l1.y > this.maxX_) {
            this.maxX_ = l1.y;
        }


        var dU0L1 = geo.distance(this.u_, l1);

        // Type 5 - Last step in the program
        if (this.index_ + 1 == this.xyCodes_.length) {
            this.stepType5_(l1, dU0L1);
        } else {
            // Type 1 or 2
            if (dU0L1 > this.maxFlex_) {
            this.stepType1or2_(l1);
            } else {
            this.stepType3or4_(l1);
            }
        }
        this.u_ = l1.getU();
        this.l_ = l1.getL();
    }

    stepType1or2_(l1) {
        var l2 = this.xyCodes_[this.index_ + 1];
        var dL1L2 = geo.distance(l1, l2);
        if (dL1L2 > this.maxFlex_) {
            this.stepType1_(l1, l2)
        } else {
            this.stepType2_(l1, l2, dL1L2)
        }
    }

    setpType1_(l1, l2) {
        var u1 = geo.cutTheCorner(l1, this.l_, l2, this.maxFlex_);
        l1.setU(u1);
        l1.type_ = 1;
    }

    stepType2_(l1, l2, dL1L2) {
        var u1 = geo.cutTheCorner(l1, this.l_, l2, dL1L2 / 2);
        l1.setU(u1);
        l1.type_ = 2;
    }

    stepType3or4_(l1){
        var m1Response = this.findM1_();
        if (m1Response == null) {
            // there are no future steps farther than the
            // max flex distance. Stay where we are.
            l1.setU(this.u_);
        } else {
            var dL0L1 = geo.distance(this.l_, l1);
            if (m1Response.dLm0Lm1 <= this.maxFlex_) {
            //type3
            this.stepType3_(l1, m1Response, dL0L1);
            } else {
            //type4
            this.stepType4_(l1, m1Response, dL0L1);
            }
        }
    }

    stepType3_(l1, m1Response, dL0L1) {
        var lmNeg1 = this.xyCodes_[m1Response.m1 - 2];
        var um0 = geo.cutTheCorner(m1Response.lm0, lmNeg1, m1Response.lm1, this.maxFlex_);
        console.log("scaling factor for type 4: " + dL0L1 / m1Response.pathLength);
        var u1 = geo.scaledPointOnLine(this.u_, um0, dL0L1 / m1Response.pathLength);
        l1.setU(u1);
        l1.m = m1Response.m1;
        l1.type_ = 4;
        };

        a3d.Program.prototype.findM1_ = function() {
        var pathLength = 0;
        for (var m1 = this.index_; m1 < this.xyCodes_.length; m1++) {

            var lm0 = m1 == this.index_ ? this.l_ : this.xyCodes_[m1 - 1];
            var lm1 = this.xyCodes_[m1];

            var dLm0Lm1 = geo.distance(lm0, lm1);
            var dU0Lm1 = geo.distance(this.u_, lm1);
            pathLength += dLm0Lm1;

            if (dU0Lm1 > this.maxFlex_) {
            return {
                'lm1': lm1,
                'lm0': lm0,
                'm1': m1,
                'pathLength': pathLength,
                'dLm0Lm1': dLm0Lm1
            }
            }
        }
        return null;
    }

    stepType5_(l1, dU0L1) {
        if (dU0L1 < this.maxFlex_) {
            // if it is within the max flex distance,
            // then we don't move U
            l1.setU(this.u_);
            l1.type_ = 6;
        } else {
            var u0 = geo.scaledPointOnLine(this.u_, l1, (dU0L1 - this.maxFlex_) / dU0L1);
            l1.setU(u0);
            l1.type_ = 5;
        }
    }

    parse_(code) {
        var lines = code.split("\n");
        for (var i = 0; i < lines.length; i++) {
          var oldLine = lines[i].trim();
          var line = oldLine.toUpperCase();
          if (line.startsWith("G")) {
            this.parseGCode_(line);
          } else {
            if (oldLine.startsWith("; layer")) {
              this.layerStarts_.push(this.codes_.length)
            }
            this.parseOtherLine_(oldLine);
          }
        }
    }

    parseGCode_(line) {
        if (line.startsWith("G1") || line.startsWith("G01")) {
          this.parseG01Code_(line)
        } else {
          this.parseOtherLine_(line)
        }
    }

    parseG01Code_(line) {
        var parts = line.split(" ");
        var g01 = new a3d.Program.G01();
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (part.length > 0) {
            switch(part.charAt(0)) {
              case "X":
                try {
                  g01.x = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "Y":
                try {
                  g01.y = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "Z":
                try {
                  g01.z = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "A":
                try {
                  g01.a = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "B":
                try {
                  g01.b = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "C":
                try {
                  g01.c = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
              case "F":
                try {
                  g01.f = parseFloat(part.slice(1));
                }
                catch(e){}
                break;
            }
          }
        }
        if (g01.isXY()) {
          this.xyCodes_.push(g01);
        }
        // if (g01.isZ()) {
        //   this.layerStarts_.push(this.codes_.length)
        // }
        this.codes_.push(g01);
    }

    parseOtherLine_(line) {
        this.codes_.push(line)
    }

    

}