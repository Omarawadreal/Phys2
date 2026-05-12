// ─── Constants ───────────────────────────────────────────────────────────────
const epsilon0 = 8.854187817e-12; // F/m
const ke_const  = 1 / (4 * Math.PI * epsilon0); // N·m²/C²

// ─── Unit prefix exponents ────────────────────────────────────────────────────
const UNIT_EXPONENTS = {
    tera:  12,
    giga:   9,
    mega:   6,
    kilo:   3,
    default:0,
    centi: -2,
    milli: -3,
    micro: -6,
    nano:  -9,
    pico: -12,
    femto:-15
};

// ─── Format result as a × 10^b ───────────────────────────────────────────────
function toSciNotation(value, unit = '') {
    if (!isFinite(value) || isNaN(value)) return 'Invalid input';
    if (value === 0) return '0' + (unit ? ' ' + unit : '');
    const exp  = Math.floor(Math.log10(Math.abs(value)));
    const mant = value / Math.pow(10, exp);
    const mantStr = parseFloat(mant.toPrecision(5)).toString();
    return `${mantStr} × 10^${exp}${unit ? ' ' + unit : ''}`;
}

// ─── Read a numeric field with its prefix selector ───────────────────────────
function readVal(inputId, selectId) {
    const raw = parseFloat(document.getElementById(inputId).value);
    const exp = UNIT_EXPONENTS[document.getElementById(selectId).value] ?? 0;
    return raw * Math.pow(10, exp);
}

function isEmpty(id) {
    return document.getElementById(id).value.trim() === '';
}

function setResult(id, text) {
    document.getElementById(id).value = text;
}

// ─── Calculator switcher ──────────────────────────────────────────────────────
function switchCalculator() {
    document.querySelectorAll('.calc-panel').forEach(p => p.style.display = 'none');
    const selected = document.getElementById('calc_option').value;
    document.getElementById('calc-' + selected).style.display = 'block';
    clearCalculator();
    updateDiagram(selected);
}

function switchEfShape() {
    document.querySelectorAll('.ef-shape-panel').forEach(p => p.style.display = 'none');
    const shape = document.getElementById('ef-shape').value;
    document.getElementById('ef-shape-' + shape).style.display = 'block';
    clearCalculator();
    updateDiagram('electric_field_' + shape);
}

function switchCapShape() {
    document.querySelectorAll('.cap-shape-panel').forEach(p => p.style.display = 'none');
    const shape = document.getElementById('cap-shape').value;
    document.getElementById('cap-shape-' + shape).style.display = 'block';
    clearCalculator();
    updateDiagram('capacitance_' + shape);
}

// ─── Main calculate dispatcher ────────────────────────────────────────────────
function calculate() {
    const selected = document.getElementById('calc_option').value;
    switch (selected) {
        case 'electric_field': calcElectricField(); break;
        case 'coulombs_law':   calcCoulombsLaw();   break;
        case 'ohms_law':       calcOhmsLaw();       break;
        case 'capacitance':    calcCapacitance();   break;
    }
}

// ─── Electric Field ───────────────────────────────────────────────────────────
function calcElectricField() {
    const shape = document.getElementById('ef-shape').value;
    switch (shape) {
        case 'sphere':  calcEfSphere();  break;
        case 'disc':    calcEfDisc();    break;
        case 'ring':    calcEfRing();    break;
        case 'plane':   calcEfPlane();   break;
    }
}

// Sphere: E = Q / (4πε₀r²)  outside; E=0 inside
function calcEfSphere() {
    if (isEmpty('ef-sphere-charge') || isEmpty('ef-sphere-r')) { setResult('ef-sphere-result',''); return; }
    const Q = readVal('ef-sphere-charge','ef-sphere-charge-unit');
    const r = readVal('ef-sphere-r','ef-sphere-r-unit');
    if (r <= 0) { setResult('ef-sphere-result','r must be > 0'); return; }
    const E = ke_const * Math.abs(Q) / (r * r);
    setResult('ef-sphere-result', toSciNotation(E, 'N/C'));
}

// Disc: E = σ/(2ε₀) * [1 - z/√(z²+R²)]
function calcEfDisc() {
    if (isEmpty('ef-disc-sigma') || isEmpty('ef-disc-z') || isEmpty('ef-disc-R')) { setResult('ef-disc-result',''); return; }
    const sigma = readVal('ef-disc-sigma','ef-disc-sigma-unit');
    const z     = readVal('ef-disc-z','ef-disc-z-unit');
    const R     = readVal('ef-disc-R','ef-disc-R-unit');
    if (z < 0) { setResult('ef-disc-result','z must be ≥ 0'); return; }
    const E = (sigma / (2 * epsilon0)) * (1 - z / Math.sqrt(z*z + R*R));
    setResult('ef-disc-result', toSciNotation(E, 'N/C'));
}

// Ring: E = kQz / (z²+R²)^(3/2)
function calcEfRing() {
    if (isEmpty('ef-ring-charge') || isEmpty('ef-ring-z') || isEmpty('ef-ring-R')) { setResult('ef-ring-result',''); return; }
    const Q = readVal('ef-ring-charge','ef-ring-charge-unit');
    const z = readVal('ef-ring-z','ef-ring-z-unit');
    const R = readVal('ef-ring-R','ef-ring-R-unit');
    const denom = Math.pow(z*z + R*R, 1.5);
    if (denom === 0) { setResult('ef-ring-result','Invalid: z=0 and R=0'); return; }
    const E = ke_const * Q * z / denom;
    setResult('ef-ring-result', toSciNotation(E, 'N/C'));
}

// Infinite plane: E = σ/(2ε₀)
function calcEfPlane() {
    if (isEmpty('ef-plane-sigma')) { setResult('ef-plane-result',''); return; }
    const sigma = readVal('ef-plane-sigma','ef-plane-sigma-unit');
    const E = Math.abs(sigma) / (2 * epsilon0);
    setResult('ef-plane-result', toSciNotation(E, 'N/C'));
}

// ─── Coulomb's Law: F = ke|q₁q₂|/r² ─────────────────────────────────────────
function calcCoulombsLaw() {
    const blankF  = isEmpty('cl-force');
    const blankQ1 = isEmpty('cl-q1');
    const blankQ2 = isEmpty('cl-q2');
    const blankR  = isEmpty('cl-r');
    const blanks  = [blankF, blankQ1, blankQ2, blankR].filter(Boolean).length;

    if (blanks !== 1) {
        setResult('cl-result', 'Leave exactly one field blank.'); return;
    }

    const F  = blankF  ? null : readVal('cl-force','cl-force-unit');
    const q1 = blankQ1 ? null : readVal('cl-q1','cl-q1-unit');
    const q2 = blankQ2 ? null : readVal('cl-q2','cl-q2-unit');
    const r  = blankR  ? null : readVal('cl-r','cl-r-unit');

    if (blankF) {
        const val = ke_const * Math.abs(q1 * q2) / (r * r);
        setResult('cl-result', 'F = ' + toSciNotation(val, 'N'));
    } else if (blankR) {
        const val = Math.sqrt(ke_const * Math.abs(q1 * q2) / Math.abs(F));
        setResult('cl-result', 'r = ' + toSciNotation(val, 'm'));
    } else if (blankQ1) {
        const val = (F * r * r) / (ke_const * Math.abs(q2));
        setResult('cl-result', '|q₁| = ' + toSciNotation(val, 'C'));
    } else {
        const val = (F * r * r) / (ke_const * Math.abs(q1));
        setResult('cl-result', '|q₂| = ' + toSciNotation(val, 'C'));
    }
}

// ─── Ohm's Law: V = IR ────────────────────────────────────────────────────────
function calcOhmsLaw() {
    const blankV = isEmpty('ol-voltage');
    const blankI = isEmpty('ol-current');
    const blankR = isEmpty('ol-resistance');
    const blanks = [blankV, blankI, blankR].filter(Boolean).length;

    if (blanks !== 1) {
        setResult('ol-result', 'Leave exactly one field blank.'); return;
    }

    const V = blankV ? null : readVal('ol-voltage','ol-voltage-unit');
    const I = blankI ? null : readVal('ol-current','ol-current-unit');
    const R = blankR ? null : readVal('ol-resistance','ol-resistance-unit');

    if (blankV) setResult('ol-result', 'V = ' + toSciNotation(I * R, 'V'));
    else if (blankI) setResult('ol-result', 'I = ' + toSciNotation(V / R, 'A'));
    else setResult('ol-result', 'R = ' + toSciNotation(V / I, 'Ω'));
}

// ─── Capacitance ──────────────────────────────────────────────────────────────
function calcCapacitance() {
    const shape = document.getElementById('cap-shape').value;
    switch (shape) {
        case 'sphere':   calcCapSphere();   break;
        case 'cylinder': calcCapCylinder(); break;
        case 'parallel': calcCapParallel(); break;
    }
}

// Sphere: C = 4πε₀R
function calcCapSphere() {
    if (isEmpty('cap-sphere-R')) { setResult('cap-sphere-result',''); return; }
    const R = readVal('cap-sphere-R','cap-sphere-R-unit');
    if (R <= 0) { setResult('cap-sphere-result','R must be > 0'); return; }
    const C = 4 * Math.PI * epsilon0 * R;
    setResult('cap-sphere-result', toSciNotation(C, 'F'));
}

// Coaxial cylinders: C = 2πε₀L / ln(b/a)
function calcCapCylinder() {
    if (isEmpty('cap-cyl-L') || isEmpty('cap-cyl-a') || isEmpty('cap-cyl-b')) { setResult('cap-cyl-result',''); return; }
    const L = readVal('cap-cyl-L','cap-cyl-L-unit');
    const a = readVal('cap-cyl-a','cap-cyl-a-unit');
    const b = readVal('cap-cyl-b','cap-cyl-b-unit');
    if (b <= a || a <= 0) { setResult('cap-cyl-result','Need b > a > 0'); return; }
    const C = (2 * Math.PI * epsilon0 * L) / Math.log(b / a);
    setResult('cap-cyl-result', toSciNotation(C, 'F'));
}

// Parallel plates: C = ε₀A/d
function calcCapParallel() {
    if (isEmpty('cap-pp-A') || isEmpty('cap-pp-d')) { setResult('cap-pp-result',''); return; }
    const A = readVal('cap-pp-A','cap-pp-A-unit');
    const d = readVal('cap-pp-d','cap-pp-d-unit');
    if (d <= 0 || A <= 0) { setResult('cap-pp-result','A and d must be > 0'); return; }
    const C = epsilon0 * A / d;
    setResult('cap-pp-result', toSciNotation(C, 'F'));
}

// ─── Clear ────────────────────────────────────────────────────────────────────
function clearCalculator() {
    document.querySelectorAll('.calc-panel input[type="number"], .calc-panel input[type="text"]')
        .forEach(i => i.value = '');
}

// ─── Diagram switcher ─────────────────────────────────────────────────────────
function updateDiagram(key) {
    const diagrams = document.querySelectorAll('.diagram-panel');
    diagrams.forEach(d => d.style.display = 'none');
    const el = document.getElementById('diagram-' + key);
    if (el) el.style.display = 'block';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.calc-panel input').forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Also recalculate when unit selects change
    document.querySelectorAll('.calc-panel select').forEach(sel => {
        if (sel.id !== 'calc_option' && sel.id !== 'ef-shape' && sel.id !== 'cap-shape') {
            sel.addEventListener('change', calculate);
        }
    });

    // Init diagram
    updateDiagram('electric_field_sphere');
});