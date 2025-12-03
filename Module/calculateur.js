// --- Contenu original de script.js ... ---

// ... (le contenu existant de script.js) ...

/**
 * Calcule les paramètres d'un signal sinusoïdal (f, T, Ueff) à partir de Umax et omega.
 * Basé sur la logique du script Python fourni.
 */
function calculateSinusoidal() {
    const umaxInput = document.getElementById('umax');
    const wInput = document.getElementById('w');
    const phiInput = document.getElementById('phi'); // Pas utilisé pour les calculs principaux mais pour la cohérence

    const resultF = document.getElementById('result-f');
    const resultT = document.getElementById('result-T');
    const resultUeff = document.getElementById('result-Ueff');
    const calculatorBox = document.querySelector('.converter-box'); // Utilisation de la même classe pour le style

    // Récupération des valeurs numériques
    const Umax = parseFloat(umaxInput ? umaxInput.value : NaN);
    const omega = parseFloat(wInput ? wInput.value : NaN);

    // Réinitialisation de l'affichage
    resultF.textContent = '-- Hz';
    resultT.textContent = '-- s';
    resultUeff.textContent = '-- V';
    calculatorBox.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
    resultF.classList.remove('data-error');
    resultF.classList.add('data-good');

    // Validation des entrées (Doivent être des nombres positifs pour Umax et omega>0 pour la division)
    if (isNaN(Umax) || isNaN(omega) || Umax < 0 || omega <= 0) {
        // Affichage de l'erreur dans le style Électrique/Acier
        resultF.textContent = 'ERREUR: Entrées Invalides.';
        resultT.textContent = 'Vérifiez Umax ≥ 0 et ω > 0.';
        resultUeff.textContent = 'Calcul impossible.';
        
        resultF.classList.remove('data-good');
        resultF.classList.add('data-error');

        // Renforce l'alerte visuelle
        calculatorBox.style.boxShadow = '0 0 20px var(--color-error)';
        return;
    }

    // --- LOGIQUE DE CALCUL (comme dans le script Python) ---

    // f = omega / (2 * np.pi)
    const f = omega / (2 * Math.PI);
    
    // T = 1 / f
    const T = 1 / f;
    
    // Ueff = Umax / np.sqrt(2)
    const Ueff = Umax / Math.sqrt(2);
    
    // --- AFFICHAGE DES RÉSULTATS ---
    resultF.textContent = `${f.toFixed(2)} Hz`;
    resultT.textContent = `${T.toFixed(4)} s`;
    resultUeff.textContent = `${Ueff.toFixed(2)} V`;
    
    // Mise en évidence du résultat
    calculatorBox.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
}

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------
    // 1. LOGIQUE DU CONVERTISSEUR DE TENSION
    // ---------------------------------------------------

    const calculateButtonDivisor = document.getElementById('calculate-btn-divisor');
    if (calculateButtonDivisor) {
        // Renommage pour éviter le conflit d'ID si calculate-btn existe aussi sur cette page
        calculateButtonDivisor.addEventListener('click', calculateVoltageDivider);
    }

    // Ajout du listener pour le nouveau calculateur sinusoïdal
    const calculateButtonSinusoidal = document.getElementById('calculate-btn-sinusoidal');
    if (calculateButtonSinusoidal) {
        calculateButtonSinusoidal.addEventListener('click', calculateSinusoidal);
    }
    
    // ... (Le reste du code, y compris calculateVoltageDivider, reste inchangé) ...
    // ... (Le reste du code, y compris toggleMenu, reste inchangé) ...
});