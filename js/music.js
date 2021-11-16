class Music {
    constructor(key, mode, rhythm, tempo) {
        this.chromatic = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

        this.modes = {
            major: [1, 1, 0.5, 1, 1, 1, 0.5],
            dorian: [1, 0.5, 1, 1, 1, 0.5, 1],
            phrygian: [0.5, 1, 1, 1, 0.5, 1, 1],
            lydian: [1, 1, 1, 0.5, 1, 1, 0.5],
            mixolydian: [1, 1, 0.5, 1, 1, 0.5, 1],
            minor: [1, 0.5, 1, 1, 0.5, 1, 1],
            locrian: [0.5, 1, 1, 0.5, 1, 1, 1],
            'melodic minor': [1, 0.5, 1, 1, 1, 1, 0.5],
            'dorian b2': [0.5, 1, 1, 1, 1, 0.5, 1],
            'lydian augmented': [1, 1, 1, 1, 0.5, 1, 0.5],
            'lydian dominant': [1, 1, 1, 0.5, 1, 0.5, 1],
            'mixolydian b6': [1, 1, 0.5, 1, 0.5, 1, 1],
            'half-diminished': [1, 0.5, 1, 0.5, 1, 1, 1],
            'altered': [0.5, 1, 0.5, 1, 1, 1, 1],
            'harmonic major': [1, 1, 0.5, 1, 0.5, 1, 1],
            'harmonic minor': [1, 0.5, 1, 1, 0.5, 1.5, 0.5],
            'major pentatonic': [1, 1, 1.5, 1, 1.5],
            'minor pentatonic': [1.5, 1, 1, 1.5, 1],
            suspended: [1, 1.5, 1, 1.5, 1],
            'blues minor': [1.5, 1, 1.5, 1, 1],
            'blues major': [1, 1.5, 1, 1, 1.5],
            blues: [1.5, 1, 0.5, 0.5, 1.5, 1],
            whole: [1, 1, 1, 1, 1, 1, 1],
        };

        this.rhythms = {
            '3/4': [0, 0.333, 0.666],
            '4/4': [0, 0.25, 0.5, 0.75],
            '2/4': [0, 0.5],
        };

        this.tempos = {
            largo: 60,
            adagio: 76,
            andante: 108,
            moderato: 120,
            allegro: 156,
            presto: 240,
        };

        this.key = key ? key : this.chromatic[Math.floor(Math.random() * this.chromatic.length)];
        this.root = this.chromatic.indexOf(this.key);
        this.mode = mode ? mode : Object.keys(this.modes)[Math.floor(Object.keys(this.modes).length * Math.random())];
        this.rhythm = rhythm ? rhythm : Object.keys(this.rhythms)[Math.floor(Object.keys(this.rhythms).length * Math.random())];
        this.steps = this.modes[this.mode];
        this.tempo = tempo ? tempo : Object.keys(this.tempos)[Math.floor(Object.keys(this.tempos).length * Math.random())];
        this.bpm = this.tempos[this.tempo];
        this.scale = [this.key];

        this.tonic = this.chromatic.indexOf(this.key);
        this.second = this.tonic + 2 * this.modes[this.mode][0];
        this.third = this.second + 2 * this.modes[this.mode][1];
        this.fourth = this.third + 2 * this.modes[this.mode][2];
        this.fifth = this.fourth + 2 * this.modes[this.mode][3];
        this.sixth = this.fifth + 2 * this.modes[this.mode][4];
        this.seventh = this.sixth + 2 * this.modes[this.mode][5];

        this.tonic = this.chromatic[this.tonic % this.chromatic.length];
        this.second = this.chromatic[this.second % this.chromatic.length];
        this.third = this.chromatic[this.third % this.chromatic.length];
        this.fourth = this.chromatic[this.fourth % this.chromatic.length];
        this.fifth = this.chromatic[this.fifth % this.chromatic.length];
        this.sixth = this.chromatic[this.sixth % this.chromatic.length];
        this.seventh = this.chromatic[this.seventh % this.chromatic.length];

        for (var i = 0, n = 2 * this.steps[i]; this.scale.length <= this.steps.length; n += 2 * this.steps[++i]) {
            this.scale.push(this.chromatic[(this.root + n) % this.chromatic.length]);
        }
    }
}
