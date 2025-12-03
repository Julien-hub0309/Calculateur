
function removeHighlights() {
    const highlights = document.querySelectorAll(".highlight");
    highlights.forEach(span => {
        const parent = span.parentNode;
        // Check if parent and textContent exist before replacement
        if (parent && span.textContent !== null) {
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize(); // merge adjacent text nodes
        }
    });
}

function highlightText(node, keyword) {
    const regex = new RegExp(`(${keyword})`, "gi");
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    while (walker.nextNode()) {
        // Ensure the text node is not inside a script or style tag and has actual text
        if (walker.currentNode.parentNode.nodeName !== 'SCRIPT' && 
            walker.currentNode.parentNode.nodeName !== 'STYLE' &&
            walker.currentNode.nodeValue.trim().length > 0) {
            textNodes.push(walker.currentNode);
        }
    }

    let found = false; // To track if any highlights were made
    textNodes.forEach(textNode => {
        const value = textNode.nodeValue;
        if (regex.test(value)) {
            const span = document.createElement("span");
            span.innerHTML = value.replace(regex, '<span class="highlight">$&</span>'); // Use $& to insert the matched string
            textNode.parentNode.replaceChild(span, textNode);
            found = true;
        }
    });
    return found; // Return true if any highlights were found
}

function searchKeyword() {
    removeHighlights(); // clean old highlights

    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) {
        // No need for alert, maybe a visual cue instead
        console.log("Veuillez entrer un mot clé.");
        return;
    }

    const contentZones = document.querySelectorAll("main, .glossaire-content, footer");
    let keywordFound = false;
    contentZones.forEach(zone => {
        if (highlightText(zone, keyword)) {
            keywordFound = true;
        }
    });

    if (!keywordFound) {
        alert(`Le mot-clé "${keyword}" n'a pas été trouvé.`);
    }
}

// --- Mobile Navigation Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a nav link is clicked (for single-page feel or fast navigation)
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
            });
        });

        // Close menu if clicked outside (optional, but good for UX)
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }
});

// À ajouter dans script.js
function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------
    // 2. LOGIQUE DE NAVIGATION MOBILE
    // ---------------------------------------------------

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', toggleMenu);
    }
});

/**
 * Fonction pour basculer la classe 'active' sur la liste de navigation
 * pour afficher/masquer le menu sur mobile (utilisé par le CSS @media).
 */
function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    if (navList) {
        navList.classList.toggle('active');
    }
}

function calculer() {
    const Umax = parseFloat(document.getElementById("umax").value);
    const omega = parseFloat(document.getElementById("omega").value);
    const phi = parseFloat(document.getElementById("phi").value);

    if (isNaN(Umax) || isNaN(omega) || isNaN(phi)) {
        document.getElementById("result").innerHTML = "<span class='data-warning'>Veuillez entrer des valeurs valides.</span>";
        return;
    }

    const f = omega / (2 * Math.PI);
    const T = 1 / f;
    const Ueff = Umax / Math.sqrt(2);

    document.getElementById("result").innerHTML =
        `Fréquence f = ${f.toFixed(2)} Hz<br>` +
        `Période T = ${T.toFixed(4)} s<br>` +
        `Valeur efficace Ueff = ${Ueff.toFixed(2)} V`;

    tracerCourbe(Umax, omega, phi, T);
}

function tracerCourbe(Umax, omega, phi, T) {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    const N = 500;
    for (let i = 0; i <= N; i++) {
        const t = (i / N) * T;
        const u = Umax * Math.sin(omega * t + phi);
        const x = (i / N) * canvas.width;
        const y = canvas.height / 2 - u * (canvas.height / (2 * Umax));
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.stroke();
}
