/* Compte rendu de TP — thèmes de couleurs, niveaux, affichage et densité (panneau « Rendu »).
 *
 * Pour AJOUTER UN THÈME :
 *   1. css/style.css : copier un bloc « :root[data-theme="…"] { --c-… } » et changer le code et les couleurs ;
 *   2. ici : ajouter une entrée dans CRTP.THEMES (code identique, nom affiché, 3 couleurs d’aperçu,
 *      niveau proposé par défaut quand on arrive avec ?theme=code).
 * Les couleurs de l’impression et du .docx sont lues dans les variables CSS du thème actif.
 *
 * Choix mémorisés dans le localStorage (facultatif : tout marche sans).
 * Paramètres d’URL : ?theme=si|sti2d|tsi  ?niveau=1si|1sti2d|tlesi|tsi  ?mode=clair|sombre|contraste
 *                    ?densite=aeree|compacte  ?verrou=1 (masque Thème et Niveau)
 */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});
  var CLE_PREFS = 'compte-rendu-tp:rendu';

  CRTP.THEMES = [
    { code: 'si', nom: 'SI', detail: 'orange et jaune', apercu: ['#8A3A00', '#E65100', '#FFD54F'], niveau: '1si' },
    { code: 'sti2d', nom: 'STI2D', detail: 'verts développement durable', apercu: ['#1A4D2A', '#2E7D32', '#F39C12'], niveau: '1sti2d' },
    { code: 'tsi', nom: 'CPGE TSI', detail: 'bleu, vert et ardoise', apercu: ['#2C3447', '#1A75BB', '#0F7E1F'], niveau: 'tsi' }
  ];

  /* contenu : '1re' (consignes du lycée) ou 'tsi' (consignes de prépa, incertitudes obligatoires) */
  CRTP.NIVEAUX = [
    { code: '1si', nom: '1re SI', cas: ['1re', 'SI'], classes: ['1re SI 1', '1re SI 2', '1re SI 3'], contenu: '1re' },
    { code: '1sti2d', nom: '1re STI2D', cas: ['1re', 'STI2D'], classes: ['1re STI2D 1', '1re STI2D 2', '1re STI2D 3'], contenu: '1re' },
    { code: 'tlesi', nom: 'Tle SI', cas: ['Tle', 'SI'], classes: ['Tle SI 1', 'Tle SI 2', 'Tle SI 3'], contenu: '1re', optionIncertitudes: true },
    { code: 'tsi', nom: 'CPGE TSI', cas: ['CPGE', 'TSI'], classes: ['TSI 1', 'TSI 2'], contenu: 'tsi', incertitudes: true }
  ];

  CRTP.MODES = [
    { code: 'clair', nom: 'Clair' },
    { code: 'sombre', nom: 'Sombre' },
    { code: 'contraste', nom: 'Fort contraste' }
  ];
  CRTP.DENSITES = [
    { code: 'aeree', nom: 'Aérée' },
    { code: 'compacte', nom: 'Compacte' }
  ];

  function trouver(liste, code) {
    for (var i = 0; i < liste.length; i++) if (liste[i].code === code) return liste[i];
    return null;
  }
  CRTP.theme = function (code) { return trouver(CRTP.THEMES, code) || CRTP.THEMES[0]; };
  CRTP.niveau = function (code) { return trouver(CRTP.NIVEAUX, code) || CRTP.NIVEAUX[0]; };
  CRTP.themeValide = function (c) { return !!trouver(CRTP.THEMES, c); };
  CRTP.niveauValide = function (c) { return !!trouver(CRTP.NIVEAUX, c); };

  /* ---------- Lecture des préférences et de l’URL ---------- */

  function lirePrefs() {
    try {
      var t = window.localStorage.getItem(CLE_PREFS);
      var p = t ? JSON.parse(t) : {};
      return p && typeof p === 'object' ? p : {};
    } catch (err) { return {}; }
  }
  function ecrirePrefs(p) {
    try { window.localStorage.setItem(CLE_PREFS, JSON.stringify(p)); } catch (err) { /* facultatif */ }
  }

  function lireURL() {
    var u = {};
    try {
      var p = new URLSearchParams(location.search);
      var th = (p.get('theme') || '').toLowerCase();
      var ni = (p.get('niveau') || '').toLowerCase();
      var mo = (p.get('mode') || '').toLowerCase();
      var de = (p.get('densite') || p.get('densité') || '').toLowerCase();
      if (CRTP.themeValide(th)) u.theme = th;
      if (CRTP.niveauValide(ni)) u.niveau = ni;
      if (trouver(CRTP.MODES, mo)) u.mode = mo;
      if (trouver(CRTP.DENSITES, de)) u.densite = de;
      u.verrou = /^(1|oui|true)$/i.test(p.get('verrou') || '');
    } catch (err) { /* navigateur ancien */ }
    return u;
  }

  var url = lireURL();
  var prefs = lirePrefs();
  var etat = {
    theme: url.theme || (CRTP.themeValide(prefs.theme) ? prefs.theme : 'si'),
    niveau: url.niveau || (url.theme ? CRTP.theme(url.theme).niveau : (CRTP.niveauValide(prefs.niveau) ? prefs.niveau : '1si')),
    mode: url.mode || (trouver(CRTP.MODES, prefs.mode) ? prefs.mode : 'clair'),
    densite: url.densite || (trouver(CRTP.DENSITES, prefs.densite) ? prefs.densite : 'aeree'),
    verrou: !!url.verrou
  };
  var ecouteurs = [];

  /* ---------- Application sur <html> ---------- */

  function poserAttributs() {
    var h = document.documentElement;
    h.setAttribute('data-theme', etat.theme);
    h.setAttribute('data-niveau', etat.niveau);
    h.setAttribute('data-mode', etat.mode);
    h.setAttribute('data-densite', etat.densite);
    h.classList.toggle('verrou', etat.verrou);
    stylePage();
  }

  /* Pied de page imprimé (@page ne lit pas les variables CSS : règle générée) */
  function stylePage() {
    var st = document.getElementById('style-page');
    if (!st) {
      st = document.createElement('style');
      st.id = 'style-page';
      st.media = 'print';
      document.head.appendChild(st);
    }
    var lib = ('Compte rendu de TP — ' + CRTP.niveau(etat.niveau).nom).replace(/["\\]/g, '');
    var marges = etat.densite === 'compacte' ? '10mm 12mm 12mm 12mm' : '14mm 15mm 16mm 15mm';
    st.textContent = '@page { margin: ' + marges + '; @bottom-left { content: "' + lib + '"; } }';
  }

  poserAttributs();

  /* ---------- Panneau ---------- */

  var GROUPES = [
    { cle: 'theme', titre: 'Thème de couleurs', liste: function () { return CRTP.THEMES; }, verrouillable: true },
    { cle: 'niveau', titre: 'Niveau / classe', liste: function () { return CRTP.NIVEAUX; }, verrouillable: true },
    { cle: 'mode', titre: 'Affichage écran', liste: function () { return CRTP.MODES; },
      aide: 'L’impression et le fichier Word restent toujours clairs.' },
    { cle: 'densite', titre: 'Densité', liste: function () { return CRTP.DENSITES; },
      aide: 'Compacte : moins d’espace à l’écran, à l’impression et dans le Word.' }
  ];

  function construirePanneau() {
    var onglet = document.getElementById('rendu-onglet');
    var panneau = document.getElementById('rendu-panneau');
    var corps = document.getElementById('rendu-corps');
    if (!onglet || !panneau || !corps) return;
    corps.innerHTML = '';
    GROUPES.forEach(function (g) {
      var fs = document.createElement('fieldset');
      fs.className = 'rendu-groupe';
      fs.dataset.groupe = g.cle;
      if (g.verrouillable && etat.verrou) fs.hidden = true;
      var lg = document.createElement('legend');
      lg.textContent = g.titre;
      fs.appendChild(lg);
      var zone = document.createElement('div');
      zone.className = 'rendu-choix';
      zone.setAttribute('role', 'group');
      zone.setAttribute('aria-label', g.titre);
      g.liste().forEach(function (opt) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rendu-btn';
        b.dataset.cle = g.cle;
        b.dataset.valeur = opt.code;
        if (opt.apercu) {
          var ap = document.createElement('span');
          ap.className = 'rendu-apercu';
          ap.setAttribute('aria-hidden', 'true');
          opt.apercu.forEach(function (c) {
            var s = document.createElement('span');
            s.style.background = c;
            ap.appendChild(s);
          });
          b.appendChild(ap);
        }
        var t = document.createElement('span');
        t.className = 'rendu-btn-nom';
        t.textContent = opt.nom;
        b.appendChild(t);
        if (opt.detail) b.title = opt.nom + ' : ' + opt.detail;
        b.addEventListener('click', function () {
          var ch = {};
          ch[g.cle] = opt.code;
          CRTP.Rendu.changer(ch, 'panneau');
        });
        zone.appendChild(b);
      });
      fs.appendChild(zone);
      if (g.aide) {
        var p = document.createElement('p');
        p.className = 'rendu-aide';
        p.textContent = g.aide;
        fs.appendChild(p);
      }
      corps.appendChild(fs);
    });
    if (etat.verrou) {
      var v = document.createElement('p');
      v.className = 'rendu-verrou';
      v.textContent = 'Thème « ' + CRTP.theme(etat.theme).nom + ' » et niveau « ' + CRTP.niveau(etat.niveau).nom +
        ' » fixés par le lien du professeur.';
      corps.insertBefore(v, corps.firstChild);
    }
    majBoutons();

    function ouvrir() {
      panneau.hidden = false;
      onglet.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('rendu-ouvert');
      var t = document.getElementById('rendu-titre');
      if (t) t.focus();
    }
    function fermer(rendreFocus) {
      panneau.hidden = true;
      onglet.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('rendu-ouvert');
      if (rendreFocus) onglet.focus();
    }
    onglet.addEventListener('click', function () { if (panneau.hidden) ouvrir(); else fermer(true); });
    document.getElementById('rendu-fermer').addEventListener('click', function () { fermer(true); });
    panneau.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.preventDefault(); fermer(true); } });
    document.addEventListener('pointerdown', function (ev) {
      if (!panneau.hidden && !panneau.contains(ev.target) && !onglet.contains(ev.target)) fermer(false);
    });
    CRTP.Rendu.ouvrir = ouvrir;
    CRTP.Rendu.fermer = fermer;
  }

  function majBoutons() {
    Array.prototype.forEach.call(document.querySelectorAll('.rendu-btn'), function (b) {
      b.setAttribute('aria-pressed', String(etat[b.dataset.cle] === b.dataset.valeur));
    });
  }

  /* Si le paramètre figure déjà dans l’adresse, on le met à jour (sinon un rechargement annulerait le choix). */
  function majURL(ch) {
    try {
      var p = new URLSearchParams(location.search);
      var modif = false;
      Object.keys(ch).forEach(function (k) {
        // ?theme=… règle aussi le niveau : un niveau choisi ensuite doit donc être écrit dans l’adresse
        if (p.has(k) || (k === 'niveau' && p.has('theme'))) { p.set(k, ch[k]); modif = true; }
      });
      if (modif) history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash);
    } catch (err) { /* sans importance */ }
  }

  CRTP.Rendu = {
    etat: function () { return { theme: etat.theme, niveau: etat.niveau, mode: etat.mode, densite: etat.densite, verrou: etat.verrou }; },
    url: function () { return url; },
    prefs: function () { return prefs; },
    /* ch : { theme, niveau, mode, densite } ; source : 'panneau' | 'projet' | 'init' */
    changer: function (ch, source) {
      var reel = {};
      Object.keys(ch || {}).forEach(function (k) {
        var v = ch[k];
        if (k === 'theme' && !CRTP.themeValide(v)) return;
        if (k === 'niveau' && !CRTP.niveauValide(v)) return;
        if (k === 'mode' && !trouver(CRTP.MODES, v)) return;
        if (k === 'densite' && !trouver(CRTP.DENSITES, v)) return;
        if (etat.verrou && (k === 'theme' || k === 'niveau') && source !== 'init') return;
        if (etat[k] !== v) { etat[k] = v; reel[k] = v; }
      });
      poserAttributs();
      majBoutons();
      prefs = { theme: etat.theme, niveau: etat.niveau, mode: etat.mode, densite: etat.densite };
      ecrirePrefs(prefs);
      if (source === 'panneau') majURL(reel);
      if (Object.keys(reel).length) ecouteurs.forEach(function (f) { f(reel, source); });
      return reel;
    },
    ecouter: function (f) { ecouteurs.push(f); },
    construirePanneau: construirePanneau,
    /* Couleur hexadécimale (sans #) d’une variable CSS du thème actif, pour l’export Word */
    couleur: function (nom, defaut) {
      try {
        var v = getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
        var m = /^#([0-9a-f]{6})$/i.exec(v) || /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
        if (m && m.length === 2) return m[1].toUpperCase();
        if (m) return (m[1] + m[1] + m[2] + m[2] + m[3] + m[3]).toUpperCase();
      } catch (err) { /* valeur par défaut */ }
      return defaut;
    }
  };
})();
