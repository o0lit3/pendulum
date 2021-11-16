class Pendulum {
    constructor(canvas) {
        this.container = document.getElementById(canvas);
        this.canvas = this.container.getElementsByTagName('canvas')[0];
        this.context = this.canvas.getContext('2d');
        this.canvas.width = document.getElementsByClassName('column left')[0].clientWidth;
        this.canvas.height = document.getElementsByClassName('column left')[0].clientHeight;

        var play = document.getElementsByName('play')[0];
        var reset = document.getElementsByName('reset')[0];
        var randomize = document.getElementsByName('randomize')[0];
        var settings = document.getElementsByClassName('setting');
        var pendulum = this;

        var drawLine = function(line) {
            pendulum.context.beginPath();
            pendulum.context.moveTo(line.x0, line.y0);
            pendulum.context.lineTo(line.x, line.y);
            pendulum.context.strokeStyle = 'red';
            pendulum.context.lineWidth = 5;
            pendulum.context.stroke();
        }

        var drawCircle = function(circle) {
            pendulum.context.beginPath();
            pendulum.context.arc(circle.x, circle.y, circle.mass, 0, 2 * Math.PI, false);
            pendulum.context.fillStyle = 'rgba(0, 0, 0, 1)';
            pendulum.context.fill();
        }

        var drawOutline = function() {
            pendulum.context.beginPath();
            pendulum.context.arc(pendulum.center.x, pendulum.center.y, pendulum.center.r, 0, 2 * Math.PI);
            pendulum.context.strokeStyle = 'blue';
            pendulum.context.lineWidth = 5;
            pendulum.context.stroke();
        }

        var sector = function(circle, point) {
            var divisor = pendulum.notes.length / 2 | 0;
            var point = Math.atan2(point.y - circle.y, point.x - circle.x);
            var steps = 0;

            for (var i = divisor + 1; steps < pendulum.notes.length; i = ++i % pendulum.notes.length, steps++) {
                var x = Math.cos(i * Math.PI / divisor) * circle.r + circle.x;
                var y = Math.sin(i * Math.PI / divisor) * circle.r + circle.y;
                var sect = Math.atan2(y - circle.y, x - circle.x);

                if (point < sect) {
                    return i;
                }
            }

            return -1;
        }

        var render = function() {
            var mu = 1 + pendulum.mass1 / pendulum.mass2;

            var d2phi1 = (
              pendulum.gravity * (
                Math.sin(pendulum.phi2) * Math.cos(pendulum.phi1 - pendulum.phi2) - mu * Math.sin(pendulum.phi1)
              ) - (
                pendulum.len2 * pendulum.dphi2 * pendulum.dphi2 + (
                  pendulum.len1 * pendulum.dphi1 * pendulum.dphi1 * Math.cos(pendulum.phi1 - pendulum.phi2)
                )
              ) * Math.sin(pendulum.phi1 - pendulum.phi2)
            ) / (
              pendulum.len1 * (mu - Math.cos(pendulum.phi1 - pendulum.phi2) * Math.cos(pendulum.phi1 - pendulum.phi2))
            );

            var d2phi2 = (
              mu * pendulum.gravity * (
                Math.sin(pendulum.phi1) * Math.cos(pendulum.phi1 - pendulum.phi2) - Math.sin(pendulum.phi2)
              ) + (
                mu * pendulum.len1 * pendulum.dphi1 * pendulum.dphi1 + (
                  pendulum.len2 * pendulum.dphi2 * pendulum.dphi2 * Math.cos(pendulum.phi1 - pendulum.phi2)
                )
              ) * Math.sin(pendulum.phi1 - pendulum.phi2)
            ) / (
              pendulum.len2 * (mu - Math.cos(pendulum.phi1 - pendulum.phi2) * Math.cos(pendulum.phi1 - pendulum.phi2))
            );

            pendulum.dphi1 += d2phi1 * pendulum.time;
            pendulum.dphi2 += d2phi2 * pendulum.time;

            pendulum.move();

            if (!pendulum.flipping && pendulum.distance(pendulum.circle2) > pendulum.center.r - pendulum.circle2.mass / 2) {
                var i = sector(pendulum.center, pendulum.circle2);
                var octave = 1 + (7 / pendulum.octaves) | 0 + (i / pendulum.music.scale.length) | 0;
                var reverb = octave * pendulum.reverb;

                pendulum.flipping = true;
                pendulum.sound.play(pendulum.notes[i], octave, reverb);
                pendulum.dphi2 = (Math.abs(pendulum.dphi1) + 0.5) * (pendulum.dphi2 < 0 ? 1 : -1);
                pendulum.dphi1 /= 3;
                pendulum.move();
            } else if (pendulum.distance(pendulum.circle2) > pendulum.center.r - pendulum.circle2.mass / 2) {
                pendulum.flipping = true;
            } else {
                pendulum.flipping = false;
            }

            pendulum.line1.x = pendulum.circle1.x;
            pendulum.line1.y = pendulum.circle1.y;
            pendulum.line2.x0 = pendulum.circle1.x;
            pendulum.line2.y0 = pendulum.circle1.y;
            pendulum.line2.x = pendulum.circle2.x;
            pendulum.line2.y = pendulum.circle2.y;

            pendulum.context.clearRect(0, 0, pendulum.canvas.width, pendulum.canvas.height);

            drawOutline()
            drawLine(pendulum.line1);
            drawLine(pendulum.line2);
            drawCircle(pendulum.circle1);
            drawCircle(pendulum.circle2);
        }

        play.addEventListener('click', function() {
            if (!pendulum.started) {
                pendulum.started = true;
                play.innerHTML = 'Pause';
                clearInterval(pendulum.interval);
                pendulum.interval = setInterval(function() { requestAnimationFrame(render); }, 5);
            } else {
                pendulum.started = false;
                clearInterval(pendulum.interval);
                play.innerHTML = 'Play';
            }
        });

        reset.addEventListener('click', function() {
            clearInterval(pendulum.interval);
            play.innerHTML = 'Play';
            pendulum.started = false;
            pendulum.init();
            render();
        });

        randomize.addEventListener('click', function() {
            pendulum.rand(document.getElementsByName('key')[0]);
            pendulum.rand(document.getElementsByName('mode')[0]);
            pendulum.srnd(document.getElementsByName('phi1')[0]);
            pendulum.srnd(document.getElementsByName('phi2')[0]);
            reset.click();
        });

        Array.from(settings).forEach(function(setting) {
            setting.addEventListener('change', function() {
                reset.click();
            });
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(pendulum.interval);
                play.innerHTML = 'Play';
                pendulum.started = false;
            }
        });

        //window.addEventListener('blur', function() {
        //    clearInterval(pendulum.interval);
        //    play.innerHTML = 'Play';
        //    pendulum.started = false;
        //});

        reset.click();
   }

    distance(point) {
        return Math.sqrt(Math.pow(this.center.x - point.x, 2) + Math.pow(this.center.y - point.y, 2));
    }

    move() {
        this.phi1 += this.dphi1 * this.time;
        this.phi2 += this.dphi2 * this.time;
    
        this.circle1.x = this.center.x + this.len1 * Math.sin(this.phi1);
        this.circle1.y = this.center.y + this.len1 * Math.cos(this.phi1);

        this.circle2.x = this.center.x + this.len1 * Math.sin(this.phi1) + (
          this.len2 * Math.sin(this.phi2)
        );

        this.circle2.y = this.center.y + this.len1 * Math.cos(this.phi1) + (
          this.len2 * Math.cos(this.phi2)
        );
    }

    vocalize(instrument) {
        if (instrument.value == 'guitar') {
            this.reverb = 1;
            return new Guitar();
        }

        if (instrument.value == 'grand piano') {
            this.reverb = 16;
            return new GrandPiano();
        }

        this.reverb = 1;
        return new Piano();
    }

    rand(select) {
        var items = select.getElementsByTagName('option');
        var index = Math.floor(Math.random() * items.length);

        select.selectedIndex = index;
    }

    srnd(input) {
        var precision = 100;
        var num = Math.floor(Math.random() * (2 * Math.PI * precision - 1 * precision) + 1 * precision) / precision;

        input.value = Math.round((num - Math.PI) * 100) / 100;
    }

    init() {
        this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2, r: 2 * this.canvas.height / 5 };

        this.len1 = this.center.r * parseFloat(document.getElementsByName('len1')[0].value);
        this.len2 = this.center.r * parseFloat(document.getElementsByName('len2')[0].value);

        this.dphi1 = 0;
        this.dphi2 = 0;

        this.mass1 = parseFloat(document.getElementsByName('mass1')[0].value);
        this.mass2 = parseFloat(document.getElementsByName('mass2')[0].value);
        this.phi1 = parseFloat(document.getElementsByName('phi1')[0].value);
        this.phi2 = parseFloat(document.getElementsByName('phi2')[0].value);
        this.gravity = parseInt(document.getElementsByName('gravity')[0].value);
        this.flipping = false;
        this.sound = this.vocalize(document.getElementsByName('instrument')[0]);
        this.key = document.getElementsByName('key')[0].value;
        this.mode = document.getElementsByName('mode')[0].value;
        this.octaves = parseFloat(document.getElementsByName('octaves')[0].value);
        this.music = new Music(this.key, this.mode);
        this.time = 0.05;
        this.notes = [];

        for (var i = 0; i < this.octaves; i++) {
            this.notes = this.notes.concat(this.music.scale);
        }

        this.line1 = { x0: this.center.x, y0: this.center.y, x: 0, y: 0 };
        this.line2 = { x0: 0, y0: 0, x: 0, y: 0 };
        this.circle1 = { mass: this.mass1 };
        this.circle2 = { mass: this.mass2 };

        this.move();

        if (this.distance(this.circle2) > this.center.r - this.circle2.mass / 2) {
            this.phi2 = this.phi1 > 0 ? this.phi1 - Math.PI / 2 : this.phi1 + Math.PI / 2;
            this.move();
        }
    }
}
