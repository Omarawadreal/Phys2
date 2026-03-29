function switchCalculator() {
        document.querySelectorAll('.calc-panel').forEach(p => p.style.display = 'none');
        const selected = document.getElementById('calc_option').value;
        document.getElementById('calc-' + selected).style.display = 'block';
        clearCalculator();
    }
 
function calculate() {
    const selected = document.getElementById('calc_option').value;
 
     if (selected === 'electric_field') {
            const F = parseFloat(document.getElementById('ef-force').value);
            const q = parseFloat(document.getElementById('ef-charge').value);
            const r = parseFloat(document.getElementById('ef-distance').value);
            if (isNaN(F) || isNaN(q) || isNaN(r)) {
                document.getElementById('ef-result').value = 'Please fill in all fields.';
                return;
            }
            if (q === 0) { document.getElementById('ef-result').value = 'Charge cannot be zero.'; return; }
            document.getElementById('ef-result').value = (F / q).toFixed(4) + ' N/C';
 
        } else if (selected === 'ohms_law') {
            const V = document.getElementById('ol-voltage').value;
            const I = document.getElementById('ol-current').value;
            const R = document.getElementById('ol-resistance').value;
            const blank = [V, I, R].filter(v => v === '').length;
            if (blank !== 1) {
                document.getElementById('ol-result').value = 'Leave exactly one field blank for the result.';
                return;
            }
            if (V === '') document.getElementById('ol-result').value = 'V = ' + (parseFloat(I) * parseFloat(R)).toFixed(4) + ' V';
            else if (I === '') document.getElementById('ol-result').value = 'I = ' + (parseFloat(V) / parseFloat(R)).toFixed(4) + ' A';
            else document.getElementById('ol-result').value = 'R = ' + (parseFloat(V) / parseFloat(I)).toFixed(4) + ' Ω';
 
        } else if (selected === 'kinetic_energy') {
            const m = parseFloat(document.getElementById('ke-mass').value);
            const v = parseFloat(document.getElementById('ke-velocity').value);
            if (isNaN(m) || isNaN(v)) {
                document.getElementById('ke-result').value = 'Please fill in mass and velocity.';
                return;
            }
            document.getElementById('ke-result').value = (0.5 * m * v * v).toFixed(4) + ' J';
 
        } else if (selected === 'projectile_motion') {
            const v0 = parseFloat(document.getElementById('pm-velocity').value);
            const theta = parseFloat(document.getElementById('pm-angle').value);
            const gInput = document.getElementById('pm-gravity').value;
            const g = gInput === '' ? 9.81 : parseFloat(gInput);
            if (isNaN(v0) || isNaN(theta)) {
                document.getElementById('pm-result').value = 'Please fill in velocity and angle.';
                return;
            }
            const range = (v0 * v0 * Math.sin(2 * theta * Math.PI / 180)) / g;
            document.getElementById('pm-result').value = range.toFixed(4) + ' m';
        }
    }
 
function clearCalculator() {
        document.querySelectorAll('.calc-panel input').forEach(i => i.value = '');
    }