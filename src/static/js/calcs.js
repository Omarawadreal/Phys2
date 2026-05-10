function switchCalculator() {
        document.querySelectorAll('.calc-panel').forEach(p => p.style.display = 'none');
        const selected = document.getElementById('calc_option').value;
        document.getElementById('calc-' + selected).style.display = 'block';
        clearCalculator();
    }
const UNIT_EXPONENTS = {
    default: 0,
    kilo:   3,
    centi: -2,
    milli: -3,
    micro: -6,
    nano:  -9,
    pico:  -12
};

const epsilon0 = 8.85e-12; // Permittivity of free space (F/m)
const ke = 1 / (4 * Math.PI * epsilon0); // Coulomb's constant (N·m²/C²)
/*
laws to implement: 
- Coulomb's Law: F = ke * |q1 * q2| / r²
- Electrric force: F = q * E
- Capacitance: C = Q / V [sphere, cylinder, parallel plate]
 
- 



*/

function calculate() {
    const selected = document.getElementById('calc_option').value;
 
     if (selected === 'electric_field') {
            let F = parseFloat(document.getElementById('ef-force').value);
            let q = parseFloat(document.getElementById('ef-charge').value);
                if (!isNaN(F) && !isNaN(q)) {
                F = F * Math.pow(10, UNIT_EXPONENTS[document.getElementById('ef-force-unit').value]);
                q = q * Math.pow(10, UNIT_EXPONENTS[document.getElementById('ef-charge-unit').value]);
                let E = F / q;
                document.getElementById('ef-result').value = E.toExponential().replace('e', ' × 10^') + ' N/C';
            } else {
                document.getElementById('ef-result').value = '';
            }
 
        } else if (selected === 'ohms_law') {
            let V = document.getElementById('ol-voltage').value;
            let I = document.getElementById('ol-current').value;
            let R = document.getElementById('ol-resistance').value;
            let blank = [V, I, R].filter(v => v === '').length;
            if (blank !== 1) {
                document.getElementById('ol-result').value = 'Leave exactly one field blank for the result.';
                return;
            }
            V = V * Math.pow(10, UNIT_EXPONENTS[document.getElementById('ol-voltage-unit').value]);
            I = I * Math.pow(10, UNIT_EXPONENTS[document.getElementById('ol-current-unit').value]);
            R = R * Math.pow(10, UNIT_EXPONENTS[document.getElementById('ol-resistance-unit').value]);
            if (V === '') document.getElementById('ol-result').value = 'V = ' + (parseFloat(I) * parseFloat(R)).toFixed(4) + ' V';
            else if (I === '') document.getElementById('ol-result').value = 'I = ' + (parseFloat(V) / parseFloat(R)).toFixed(4) + ' A';
            else document.getElementById('ol-result').value = 'R = ' + (parseFloat(V) / parseFloat(I)).toFixed(4) + ' Ω';
 
        } else if (selected === 'kinetic_energy') {
            const m = parseFloat(document.getElementById('ke-mass').value);
            const v = parseFloat(document.getElementById('ke-velocity').value);
            if (!isNaN(m) && !isNaN(v)) {
                let ke = 0.5 * m * v * v;
                document.getElementById('ke-result').value = ke.toExponential().replace('e', ' × 10^') + ' J';
            } else {
                document.getElementById('ke-result').value = '';
            }
 
        } else if (selected === 'projectile_motion') {
            const v0 = parseFloat(document.getElementById('pm-velocity').value);
            const theta = parseFloat(document.getElementById('pm-angle').value);
            const gInput = document.getElementById('pm-gravity').value;
            const g = gInput === '' ? 9.81 : parseFloat(gInput);
            if (!isNaN(v0) && !isNaN(theta)) {
                const range = (v0 * v0 * Math.sin(2 * theta * Math.PI / 180)) / g;
                document.getElementById('pm-result').value = range.toExponential().replace('e', ' × 10^') + ' m';
            } else {
                document.getElementById('pm-result').value = '';
            }
        }
    }
 
function clearCalculator() {
        document.querySelectorAll('.calc-panel input').forEach(i => i.value = '');
    }

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.calc-panel input').forEach(input => {
        input.addEventListener('input', calculate);
    });
});