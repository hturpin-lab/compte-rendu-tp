/* Compte rendu de TP — 1re SI
 * Application principale. Aucune donnée n’est envoyée sur internet :
 * l’état vit en mémoire, dans le localStorage (si disponible) et dans les fichiers .json enregistrés.
 */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});
  var SECTIONS = CRTP.SECTIONS;
  var CLE_STOCKAGE = 'compte-rendu-tp:v1';
  var VERSION = 1;

  /* ------------------------------------------------------------------ */
  /* État                                                                */
  /* ------------------------------------------------------------------ */

  function etatVide() {
    var s = {};
    SECTIONS.forEach(function (sec) { s[sec.id] = { texte: '', images: [] }; });
    return {
      app: 'compte-rendu-tp',
      version: VERSION,
      modele: null,
      entete: { titre: '', noms: '', classe: '', date: '', duree: '' },
      sections: s,
      mesures: [],
      calculs: []
    };
  }

  function str(v) { return typeof v === 'string' ? v : (v == null ? '' : String(v)); }

  /* Nettoie un objet venu d’un fichier .json (ou du localStorage). */
  function normaliser(d) {
    if (!d || typeof d !== 'object') throw new Error('Fichier illisible.');
    if (d.app && d.app !== 'compte-rendu-tp') throw new Error('Ce fichier .json n’est pas un compte rendu de TP.');
    var e = etatVide();
    e.modele = d.modele ? str(d.modele) : null;
    var ent = d.entete || {};
    Object.keys(e.entete).forEach(function (k) { e.entete[k] = str(ent[k]); });
    var secs = d.sections || {};
    SECTIONS.forEach(function (sec) {
      var src = secs[sec.id] || {};
      e.sections[sec.id].texte = str(src.texte);
      e.sections[sec.id].images = (Array.isArray(src.images) ? src.images : [])
        .filter(function (im) { return im && /^data:image\//.test(str(im.src)); })
        .map(function (im) {
          var l = Number(im.largeur);
          return { id: nouvelId(), src: str(im.src), legende: str(im.legende), largeur: [50, 75, 100].indexOf(l) >= 0 ? l : 100 };
        });
    });
    e.mesures = (Array.isArray(d.mesures) ? d.mesures : []).map(function (m) {
      m = m || {};
      return { grandeur: str(m.grandeur), symbole: str(m.symbole), theo: str(m.theo), mes: str(m.mes), unite: str(m.unite) };
    });
    e.calculs = (Array.isArray(d.calculs) ? d.calculs : []).map(function (c) {
      c = c || {};
      return { titre: str(c.titre), formule: str(c.formule), application: str(c.application), resultat: str(c.resultat), unite: str(c.unite) };
    });
    return e;
  }

  var compteurId = 0;
  function nouvelId() { compteurId += 1; return 'f' + Date.now().toString(36) + compteurId; }

  var etat = etatVide();

  /* ------------------------------------------------------------------ */
  /* Outils                                                              */
  /* ------------------------------------------------------------------ */

  function $(sel, racine) { return (racine || document).querySelector(sel); }
  function $all(sel, racine) { return Array.prototype.slice.call((racine || document).querySelectorAll(sel)); }

  function echapper(t) {
    return str(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* « 0,5 » « 1 200 » « 2.0 » « 1e-3 » → nombre ; sinon NaN */
  CRTP.nombre = function (t) {
    t = str(t).trim().replace(/[\s  ]/g, '').replace(',', '.');
    if (t === '' || !/^[+\-−]?(\d+\.?\d*|\.\d+)(e[+\-]?\d+)?$/i.test(t)) return NaN;
    return Number(t.replace('−', '-'));
  };

  /* Écart relatif en % (null si impossible) */
  CRTP.ecart = function (theo, mes) {
    var a = CRTP.nombre(theo), b = CRTP.nombre(mes);
    if (!isFinite(a) || !isFinite(b) || a === 0) return null;
    return Math.abs(b - a) / Math.abs(a) * 100;
  };

  CRTP.formatEcart = function (v) {
    if (v == null) return '';
    var d = v < 10 ? 1 : 0;
    return v.toFixed(d).replace('.', ',');
  };

  /* Numérotation des figures dans l’ordre du document */
  CRTP.numerosFigures = function (e) {
    var n = 0, map = {};
    SECTIONS.forEach(function (sec) {
      e.sections[sec.id].images.forEach(function (im) { n += 1; map[im.id] = n; });
    });
    return map;
  };

  function mots(t) {
    return str(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/).filter(Boolean);
  }
  function compterMots(t) { return str(t).trim() ? str(t).trim().split(/\s+/).length : 0; }

  function telecharger(blob, nom) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  function nomFichier(ext) {
    var base = [etat.entete.titre || 'compte-rendu-tp', etat.entete.noms].filter(Boolean).join('_');
    base = base.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 100).replace(/-+$/, '') || 'compte-rendu-tp';
    return 'CR_' + base + '.' + ext;
  }

  function info(message, type) {
    var b = $('#bandeau-info');
    b.textContent = message;
    b.className = 'bandeau-info' + (type ? ' ' + type : '');
    b.hidden = !message;
    clearTimeout(info.t);
    if (message) info.t = setTimeout(function () { b.hidden = true; }, 9000);
  }

  /* ------------------------------------------------------------------ */
  /* Sauvegarde automatique (facultative : l’outil marche sans)          */
  /* ------------------------------------------------------------------ */

  var minuterieSauvegarde = null;
  function etatSauvegarde(t, alerte) {
    var p = $('#etat-sauvegarde');
    p.textContent = t;
    p.classList.toggle('alerte', !!alerte);
  }

  function sauvegarderMaintenant() {
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
      var h = new Date();
      etatSauvegarde('Sauvegardé dans ce navigateur à ' + h.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      etatSauvegarde('Sauvegarde automatique impossible (images trop lourdes ou navigation privée) : pensez à « Enregistrer le projet (.json) ».', true);
    }
  }
  function programmerSauvegarde() {
    clearTimeout(minuterieSauvegarde);
    minuterieSauvegarde = setTimeout(sauvegarderMaintenant, 700);
  }
  function lireSauvegarde() {
    try {
      var t = window.localStorage.getItem(CLE_STOCKAGE);
      return t ? normaliser(JSON.parse(t)) : null;
    } catch (err) { return null; }
  }
  function estVide(e) {
    var vide = !Object.keys(e.entete).some(function (k) { return e.entete[k].trim(); });
    SECTIONS.forEach(function (s) {
      if (e.sections[s.id].texte.trim() || e.sections[s.id].images.length) vide = false;
    });
    return vide && !e.mesures.length && !e.calculs.length;
  }

  /* ------------------------------------------------------------------ */
  /* Construction de l’interface                                          */
  /* ------------------------------------------------------------------ */

  function ajusterHauteur(ta, min) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight + 2, min || 72) + 'px';
  }

  var derniereSection = 'resultats';

  function construireSections() {
    $('#consigne-entete').innerHTML = CRTP.ENTETE.consigne;
    $('#exemple-entete').innerHTML = CRTP.ENTETE.exemple;

    var conteneur = $('#sections');
    var tpl = $('#tpl-section');
    SECTIONS.forEach(function (sec) {
      var frag = tpl.content.cloneNode(true);
      var el = frag.querySelector('section');
      el.id = 'sec-' + sec.id;
      el.dataset.section = sec.id;
      el.setAttribute('aria-labelledby', 'titre-' + sec.id);
      var h2 = el.querySelector('h2');
      h2.id = 'titre-' + sec.id;
      el.querySelector('.num').textContent = sec.num;
      el.querySelector('.bandeau-texte').textContent = sec.titre;
      el.querySelector('.consigne').innerHTML = sec.consigne;
      el.querySelector('.exemple-contenu').innerHTML = sec.exemple;
      var ta = el.querySelector('textarea');
      ta.id = 'texte-' + sec.id;
      ta.placeholder = sec.placeholder || '';
      ta.dataset.section = sec.id;
      var lab = el.querySelector('.label-texte');
      lab.htmlFor = ta.id;
      lab.textContent = sec.mesures ? 'Présentation des résultats' : 'Votre texte';
      var input = el.querySelector('input[type=file]');
      input.id = 'image-' + sec.id;
      input.setAttribute('aria-label', 'Choisir une image pour la section ' + sec.titre);
      el.querySelector('.btn-image').setAttribute('aria-describedby', 'titre-' + sec.id);
      if (sec.mesures) construireZoneMesures(el.querySelector('.zone-mesures'));
      else el.querySelector('.zone-mesures').remove();
      conteneur.appendChild(frag);
    });

    // Évènements par section
    $all('.fiche-section[data-section]').forEach(function (el) {
      var id = el.dataset.section;
      var ta = el.querySelector('textarea');
      ta.addEventListener('input', function () {
        etat.sections[id].texte = ta.value;
        ajusterHauteur(ta);
        modifie();
      });
      var input = el.querySelector('input[type=file]');
      el.querySelector('.btn-image').addEventListener('click', function () { input.click(); });
      input.addEventListener('change', function () {
        ajouterFichiers(id, input.files);
        input.value = '';
      });
      el.addEventListener('focusin', function () { derniereSection = id; });
      el.addEventListener('pointerdown', function () { derniereSection = id; });
      // Glisser-déposer sur toute la section
      el.addEventListener('dragover', function (ev) {
        if (ev.dataTransfer && Array.prototype.indexOf.call(ev.dataTransfer.types, 'Files') >= 0) {
          ev.preventDefault();
          el.classList.add('survol-depot');
        }
      });
      el.addEventListener('dragleave', function (ev) {
        if (!el.contains(ev.relatedTarget)) el.classList.remove('survol-depot');
      });
      el.addEventListener('drop', function (ev) {
        el.classList.remove('survol-depot');
        if (ev.dataTransfer && ev.dataTransfer.files.length) {
          ev.preventDefault();
          ajouterFichiers(id, ev.dataTransfer.files);
        }
      });
    });

    // En-tête
    $all('[data-entete]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        if (inp.tagName === 'TEXTAREA' && /\n/.test(inp.value)) inp.value = inp.value.replace(/\s*\n\s*/g, ' ');
        etat.entete[inp.dataset.entete] = inp.value;
        if (inp.tagName === 'TEXTAREA') ajusterHauteur(inp, 44);
        modifie();
      });
    });
    $('#sec-entete').addEventListener('focusin', function () { derniereSection = 'problematique'; });

    // Coller une capture d’écran (Ctrl+V) n’importe où
    document.addEventListener('paste', function (ev) {
      var items = ev.clipboardData ? ev.clipboardData.items : [];
      var fichiers = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && /^image\//.test(items[i].type)) {
          var f = items[i].getAsFile();
          if (f) fichiers.push(f);
        }
      }
      if (fichiers.length) {
        ev.preventDefault();
        ajouterFichiers(derniereSection, fichiers);
      }
    });

    // Empêcher le navigateur d’ouvrir une image lâchée hors d’une section
    window.addEventListener('dragover', function (ev) { ev.preventDefault(); });
    window.addEventListener('drop', function (ev) { ev.preventDefault(); });
  }

  /* ---------- Tableau de mesures et calculs ---------- */

  function construireZoneMesures(zone) {
    zone.innerHTML =
      '<h3 class="sous-titre" id="titre-mesures">Tableau de mesures</h3>' +
      '<div class="tableau-defile">' +
      '<table class="tableau-mesures" aria-labelledby="titre-mesures">' +
      '<thead><tr><th scope="col">Grandeur</th><th scope="col">Symbole</th><th scope="col">Valeur théorique</th>' +
      '<th scope="col">Valeur simulée / mesurée</th><th scope="col">Unité</th><th scope="col">Écart relatif (%)</th>' +
      '<th scope="col"><span class="visually-hidden">Supprimer</span></th></tr></thead>' +
      '<tbody id="mesures-corps"></tbody></table></div>' +
      '<p class="aide-formule">Écart relatif = |valeur mesurée − valeur théorique| ÷ |valeur théorique| × 100 (calculé automatiquement).</p>' +
      '<button type="button" class="btn" id="btn-ajout-ligne">+ Ajouter une ligne</button>' +
      '<h3 class="sous-titre" id="titre-calculs">Calculs</h3>' +
      '<div class="consigne consigne-regle"><strong>Règle :</strong> formule littérale → application numérique → résultat <strong>avec son unité</strong>.' +
      ' Exemple : U = U1 + U2 + U3 + U4 → U = 0,5 + 0,5 + 0,5 + 0,5 → U = 2,0 V</div>' +
      '<div id="calculs-liste" class="calculs-liste"></div>' +
      '<button type="button" class="btn" id="btn-ajout-calcul">+ Ajouter un calcul</button>';

    zone.querySelector('#btn-ajout-ligne').addEventListener('click', function () {
      etat.mesures.push({ grandeur: '', symbole: '', theo: '', mes: '', unite: '' });
      dessinerMesures();
      modifie();
      var lignes = $all('#mesures-corps tr');
      lignes[lignes.length - 1].querySelector('input').focus();
    });
    zone.querySelector('#btn-ajout-calcul').addEventListener('click', function () {
      etat.calculs.push({ titre: '', formule: '', application: '', resultat: '', unite: '' });
      dessinerCalculs();
      modifie();
      var cartes = $all('#calculs-liste .calcul');
      cartes[cartes.length - 1].querySelector('input').focus();
    });
  }

  var COLONNES = [
    { cle: 'grandeur', nom: 'Grandeur', ph: 'Tension série' },
    { cle: 'symbole', nom: 'Symbole', ph: 'U' },
    { cle: 'theo', nom: 'Valeur théorique', ph: '2,0', num: true },
    { cle: 'mes', nom: 'Valeur simulée / mesurée', ph: '2,00', num: true },
    { cle: 'unite', nom: 'Unité', ph: 'V' }
  ];

  function dessinerMesures() {
    var corps = $('#mesures-corps');
    corps.innerHTML = '';
    etat.mesures.forEach(function (m, i) {
      var tr = document.createElement('tr');
      COLONNES.forEach(function (col) {
        var td = document.createElement('td');
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.value = m[col.cle];
        inp.placeholder = col.ph;
        inp.className = 'cellule' + (col.num ? ' cellule-num' : '') + (col.cle === 'unite' ? ' cellule-unite' : '');
        if (col.num) inp.inputMode = 'decimal';
        inp.setAttribute('aria-label', col.nom + ', ligne ' + (i + 1));
        inp.addEventListener('input', function () {
          m[col.cle] = inp.value;
          majLigne(tr, m);
          modifie();
        });
        td.appendChild(inp);
        tr.appendChild(td);
      });
      var tdE = document.createElement('td');
      tdE.className = 'ecart';
      tdE.setAttribute('aria-live', 'off');
      tr.appendChild(tdE);
      var tdS = document.createElement('td');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-icone';
      b.innerHTML = '<span aria-hidden="true">✕</span>';
      b.setAttribute('aria-label', 'Supprimer la ligne ' + (i + 1));
      b.title = 'Supprimer la ligne';
      b.addEventListener('click', function () {
        etat.mesures.splice(i, 1);
        dessinerMesures();
        modifie();
        var btn = $('#btn-ajout-ligne');
        if (btn) btn.focus();
      });
      tdS.appendChild(b);
      tr.appendChild(tdS);
      majLigne(tr, m);
      corps.appendChild(tr);
    });
  }

  function majLigne(tr, m) {
    var v = CRTP.ecart(m.theo, m.mes);
    var td = tr.querySelector('.ecart');
    td.textContent = v == null ? '' : CRTP.formatEcart(v) + ' %';
    td.title = v == null ? 'Écart incalculable : il faut deux nombres et une valeur théorique non nulle.' : '';
    td.classList.toggle('ecart-fort', v != null && v > 10);
    var u = tr.querySelector('.cellule-unite');
    var aDesValeurs = (m.theo.trim() || m.mes.trim());
    u.classList.toggle('manque', !!aDesValeurs && !m.unite.trim());
    $all('.cellule-num', tr).forEach(function (inp) {
      inp.classList.toggle('invalide', !!inp.value.trim() && !isFinite(CRTP.nombre(inp.value)));
    });
  }

  var CHAMPS_CALCUL = [
    { cle: 'titre', nom: 'Ce que l’on calcule', ph: 'Tension totale en série', large: true },
    { cle: 'formule', nom: 'Formule littérale', ph: 'U = U1 + U2 + U3 + U4' },
    { cle: 'application', nom: 'Application numérique', ph: 'U = 0,5 + 0,5 + 0,5 + 0,5' },
    { cle: 'resultat', nom: 'Résultat', ph: 'U = 2,0' },
    { cle: 'unite', nom: 'Unité', ph: 'V', court: true }
  ];

  function dessinerCalculs() {
    var liste = $('#calculs-liste');
    liste.innerHTML = '';
    etat.calculs.forEach(function (c, i) {
      var carte = document.createElement('fieldset');
      carte.className = 'calcul';
      var lg = document.createElement('legend');
      lg.textContent = 'Calcul ' + (i + 1);
      carte.appendChild(lg);
      var grille = document.createElement('div');
      grille.className = 'calcul-grille';
      CHAMPS_CALCUL.forEach(function (ch) {
        var id = 'calc-' + i + '-' + ch.cle;
        var bloc = document.createElement('div');
        bloc.className = 'calcul-champ' + (ch.large ? ' large' : '') + (ch.court ? ' court' : '');
        var lab = document.createElement('label');
        lab.htmlFor = id;
        lab.textContent = ch.nom;
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.id = id;
        inp.value = c[ch.cle];
        inp.placeholder = ch.ph;
        inp.addEventListener('input', function () { c[ch.cle] = inp.value; modifie(); });
        bloc.appendChild(lab);
        bloc.appendChild(inp);
        grille.appendChild(bloc);
      });
      carte.appendChild(grille);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-discret';
      b.textContent = 'Supprimer ce calcul';
      b.setAttribute('aria-label', 'Supprimer le calcul ' + (i + 1));
      b.addEventListener('click', function () {
        etat.calculs.splice(i, 1);
        dessinerCalculs();
        modifie();
        $('#btn-ajout-calcul').focus();
      });
      carte.appendChild(b);
      liste.appendChild(carte);
    });
  }

  /* ---------- Figures ---------- */

  async function ajouterFichiers(idSection, fichiers) {
    var liste = Array.prototype.slice.call(fichiers || []);
    if (!liste.length) return;
    var ajoutees = 0;
    for (var i = 0; i < liste.length; i++) {
      try {
        var src = await CRTP.compresserImage(liste[i]);
        etat.sections[idSection].images.push({ id: nouvelId(), src: src, legende: '', largeur: 100 });
        ajoutees += 1;
      } catch (err) {
        info(err.message, 'erreur');
      }
    }
    if (ajoutees) {
      dessinerFigures(idSection);
      modifie();
      var legendes = $all('#sec-' + idSection + ' .legende-input');
      if (legendes.length) legendes[legendes.length - 1].focus();
      info(ajoutees > 1 ? ajoutees + ' images ajoutées : écrivez leur légende.' : 'Image ajoutée : écrivez sa légende.');
    }
  }

  function dessinerFigures(idSection) {
    var ol = $('#sec-' + idSection + ' .figures');
    ol.innerHTML = '';
    var images = etat.sections[idSection].images;
    images.forEach(function (im, i) {
      var li = document.createElement('li');
      li.className = 'figure';
      li.dataset.id = im.id;
      var cadre = document.createElement('div');
      cadre.className = 'figure-cadre largeur-' + im.largeur;
      var img = document.createElement('img');
      img.src = im.src;
      img.alt = im.legende || 'Figure sans légende';
      cadre.appendChild(img);
      li.appendChild(cadre);

      var outils = document.createElement('div');
      outils.className = 'figure-outils';
      var idLeg = 'leg-' + im.id;
      outils.innerHTML =
        '<label class="legende-label" for="' + idLeg + '"><span class="figure-num">Figure ?</span> :</label>' +
        '<input type="text" class="legende-input" id="' + idLeg + '" required aria-required="true" placeholder="Légende obligatoire (ex. : montage série dans Tinkercad)">';
      var inpLeg = outils.querySelector('input');
      inpLeg.value = im.legende;
      inpLeg.classList.toggle('manque', !im.legende.trim());
      inpLeg.addEventListener('input', function () {
        im.legende = inpLeg.value;
        img.alt = im.legende || 'Figure sans légende';
        inpLeg.classList.toggle('manque', !im.legende.trim());
        modifie();
      });

      var tailles = document.createElement('div');
      tailles.className = 'figure-tailles';
      tailles.setAttribute('role', 'group');
      tailles.setAttribute('aria-label', 'Largeur de l’image');
      tailles.innerHTML = '<span class="petit" aria-hidden="true">Largeur :</span>';
      [50, 75, 100].forEach(function (l) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-taille';
        b.textContent = l + ' %';
        b.setAttribute('aria-pressed', String(im.largeur === l));
        b.setAttribute('aria-label', 'Largeur ' + l + ' %');
        b.addEventListener('click', function () {
          im.largeur = l;
          cadre.className = 'figure-cadre largeur-' + l;
          $all('.btn-taille', tailles).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          modifie();
        });
        tailles.appendChild(b);
      });

      var actions = document.createElement('div');
      actions.className = 'figure-actions';
      function bouton(txt, label, fn, desactive) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-icone';
        b.innerHTML = '<span aria-hidden="true">' + txt + '</span>';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.disabled = !!desactive;
        b.addEventListener('click', fn);
        actions.appendChild(b);
      }
      bouton('↑', 'Monter la figure', function () { deplacer(idSection, i, -1); }, i === 0);
      bouton('↓', 'Descendre la figure', function () { deplacer(idSection, i, 1); }, i === images.length - 1);
      bouton('✕', 'Supprimer la figure', function () {
        if (!window.confirm('Supprimer cette figure ?')) return;
        images.splice(i, 1);
        dessinerFigures(idSection);
        modifie();
        $('#sec-' + idSection + ' .btn-image').focus();
      });

      var barre = document.createElement('div');
      barre.className = 'figure-barre';
      barre.appendChild(tailles);
      barre.appendChild(actions);
      outils.appendChild(barre);
      li.appendChild(outils);
      ol.appendChild(li);
    });
    numeroterFigures();
  }

  function deplacer(idSection, i, sens) {
    var images = etat.sections[idSection].images;
    var j = i + sens;
    if (j < 0 || j >= images.length) return;
    var t = images[i]; images[i] = images[j]; images[j] = t;
    dessinerFigures(idSection);
    modifie();
  }

  function numeroterFigures() {
    var num = CRTP.numerosFigures(etat);
    $all('.figure').forEach(function (li) {
      var n = num[li.dataset.id];
      li.querySelector('.figure-num').textContent = 'Figure ' + n;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Remplissage de l’interface à partir de l’état                        */
  /* ------------------------------------------------------------------ */

  function afficherEtat() {
    $all('[data-entete]').forEach(function (inp) {
      inp.value = etat.entete[inp.dataset.entete] || '';
      if (inp.tagName === 'TEXTAREA') ajusterHauteur(inp, 44);
    });
    SECTIONS.forEach(function (sec) {
      var ta = $('#texte-' + sec.id);
      ta.value = etat.sections[sec.id].texte;
      ajusterHauteur(ta);
      dessinerFigures(sec.id);
    });
    dessinerMesures();
    dessinerCalculs();
    majVerification();
    rendreImpression();
  }

  function remplacerEtat(nouveau) {
    etat = nouveau;
    afficherEtat();
    sauvegarderMaintenant();
  }

  var minuterieRendu = null;
  function modifie() {
    numeroterFigures();
    majVerification();
    programmerSauvegarde();
    clearTimeout(minuterieRendu);
    minuterieRendu = setTimeout(rendreImpression, 400);
  }

  /* ------------------------------------------------------------------ */
  /* Vérification                                                        */
  /* ------------------------------------------------------------------ */

  CRTP.verifier = function (e) {
    var res = [];
    function ajout(id, ok, texte, cible, aide) { res.push({ id: id, ok: !!ok, texte: texte, cible: cible, aide: aide || '' }); }
    var t = function (id) { return e.sections[id].texte.trim(); };

    var ent = e.entete;
    var manquants = [];
    if (!ent.titre.trim()) manquants.push('titre');
    if (!ent.noms.trim()) manquants.push('noms');
    if (!ent.classe.trim()) manquants.push('classe');
    if (!ent.date.trim()) manquants.push('date');
    ajout('entete', !manquants.length, 'En-tête complet', 'sec-entete',
      manquants.length ? 'Manque : ' + manquants.join(', ') + '.' : '');

    SECTIONS.forEach(function (sec) {
      if (sec.facultatif) return;
      var rempli = t(sec.id).length >= sec.minCar;
      ajout('rempli-' + sec.id, rempli, sec.num + '. ' + sec.titre + ' rédigé(e)', 'sec-' + sec.id,
        rempli ? '' : 'Section vide ou trop courte.');
    });

    var pb = t('problematique');
    var motsPb = mots(pb);
    var verbe = CRTP.VERBES_OBJECTIF.some(function (v) {
      var vv = mots(v)[0];
      return motsPb.some(function (m) { return m.indexOf(vv.slice(0, Math.max(5, vv.length - 2))) === 0; });
    });
    ajout('pb-forme', pb && (/\?\s*$/.test(pb) || verbe), 'Problématique : une question (« ? ») ou un objectif', 'sec-problematique',
      'Terminez par « ? » ou utilisez un verbe d’objectif (vérifier, déterminer, comparer…).');
    var phrases = pb ? pb.split(/[.?!]+(\s|$)/).filter(function (p) { return p && p.trim().length > 3; }).length : 0;
    ajout('pb-court', pb && phrases <= 2 && compterMots(pb) <= 70, 'Problématique : 1 à 2 phrases', 'sec-problematique',
      'Restez court : une ou deux phrases.');

    var num = CRTP.numerosFigures(e);
    var nbFig = Object.keys(num).length;
    ajout('fig-resultats', e.sections.resultats.images.length > 0, 'Résultats : au moins une capture d’écran', 'sec-resultats',
      'Ajoutez la capture de votre simulation.');
    var sansLegende = [];
    SECTIONS.forEach(function (sec) {
      e.sections[sec.id].images.forEach(function (im) { if (!im.legende.trim()) sansLegende.push(num[im.id]); });
    });
    ajout('legendes', nbFig > 0 && !sansLegende.length, 'Chaque figure a une légende', 'sec-resultats',
      nbFig === 0 ? 'Aucune figure pour l’instant.' : (sansLegende.length ? 'Sans légende : figure ' + sansLegende.join(', ') + '.' : ''));

    var lignes = e.mesures.filter(function (m) { return (m.grandeur + m.symbole + m.theo + m.mes).trim(); });
    ajout('tableau', lignes.length > 0, 'Tableau de mesures rempli', 'sec-resultats', 'Ajoutez au moins une ligne de mesure.');
    var sansUnite = [];
    e.mesures.forEach(function (m, i) { if ((m.theo.trim() || m.mes.trim()) && !m.unite.trim()) sansUnite.push(i + 1); });
    ajout('unites', lignes.length > 0 && !sansUnite.length, 'Chaque valeur du tableau a une unité', 'sec-resultats',
      sansUnite.length ? 'Unité manquante ligne ' + sansUnite.join(', ') + '.' : '');
    var nbEcarts = e.mesures.filter(function (m) { return CRTP.ecart(m.theo, m.mes) != null; }).length;
    ajout('ecart', nbEcarts > 0, 'Au moins un écart relatif calculé', 'sec-resultats',
      'Remplissez une valeur théorique et une valeur simulée (nombres).');

    var calculsOk = e.calculs.length > 0 && e.calculs.every(function (c) {
      return c.formule.trim() && c.application.trim() && c.resultat.trim() && c.unite.trim();
    });
    ajout('calculs', calculsOk, 'Calculs : littéral → numérique → résultat + unité', 'sec-resultats',
      e.calculs.length ? 'Un calcul est incomplet (formule, application, résultat ou unité).' : 'Ajoutez au moins un calcul.');

    var ex = mots(t('exploitation'));
    var compare = ex.some(function (m) { return /^(ecart|theori|compar|proche|differen|verifi)/.test(m); });
    ajout('exploitation', compare && compterMots(t('exploitation')) >= 40, 'Exploitation : comparaison théorie / simulation développée', 'sec-exploitation',
      'Au moins 40 mots, avec l’écart et la vérification de la loi.');

    var cles = motsPb.filter(function (m) { return m.length >= 5 && CRTP.MOTS_VIDES.indexOf(m) < 0; });
    var conc = mots(t('conclusion'));
    var communs = cles.filter(function (m, i) { return cles.indexOf(m) === i && conc.indexOf(m) >= 0; });
    ajout('conclusion', cles.length > 0 && communs.length >= 2, 'Conclusion : reprend les mots de la problématique', 'sec-conclusion',
      cles.length ? 'Mots communs trouvés : ' + (communs.length ? communs.slice(0, 4).join(', ') : 'aucun') + '.' : 'Écrivez d’abord la problématique.');

    var total = compterMots(Object.keys(e.sections).map(function (k) { return e.sections[k].texte; }).join(' '));
    ajout('longueur', total >= 250, 'Longueur suffisante (au moins 250 mots)', 'sec-problematique',
      'Actuellement ' + total + ' mot' + (total > 1 ? 's' : '') + '.');
    return res;
  };

  function majVerification() {
    var res = CRTP.verifier(etat);
    var ok = res.filter(function (r) { return r.ok; }).length;
    var pct = Math.round(ok / res.length * 100);
    $('#progression-barre').style.width = pct + '%';
    $('#progression-texte').textContent = ok + ' / ' + res.length + ' points validés (' + pct + ' %)';
    var ul = $('#verif-liste');
    ul.innerHTML = '';
    res.forEach(function (r) {
      var li = document.createElement('li');
      li.className = r.ok ? 'ok' : 'a-faire';
      li.dataset.verif = r.id;
      var a = document.createElement('a');
      a.href = '#' + r.cible;
      a.innerHTML = '<span class="coche" aria-hidden="true">' + (r.ok ? '✓' : '!') + '</span>' +
        '<span class="verif-texte"><span class="visually-hidden">' + (r.ok ? 'Validé : ' : 'À revoir : ') + '</span>' +
        echapper(r.texte) + (!r.ok && r.aide ? '<small>' + echapper(r.aide) + '</small>' : '') + '</span>';
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var cible = document.getElementById(r.cible);
        if (!cible) return;
        cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var champ = cible.querySelector('textarea, input:not([type=file])');
        if (champ) setTimeout(function () { champ.focus({ preventScroll: true }); }, 300);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Rendu pour l’impression / PDF                                        */
  /* ------------------------------------------------------------------ */

  function texteEnHTML(t) {
    t = str(t).replace(/\r/g, '').trim();
    if (!t) return '';
    return t.split(/\n{2,}/).map(function (para) {
      return '<p>' + echapper(para).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function dateFr(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : str(d);
  }
  CRTP.dateFr = dateFr;

  function rendreImpression() {
    var e = etat, num = CRTP.numerosFigures(e), ent = e.entete;
    var h = [];
    h.push('<header class="p-cartouche"><div class="p-case">1re<br>SI</div>' +
      '<div class="p-titre"><div class="p-sur">Compte rendu de TP</div><div class="p-h1">' +
      (echapper(ent.titre) || '<span class="p-vide">Titre du TP</span>') + '</div></div>' +
      '<dl class="p-infos"><dt>Nom(s)</dt><dd>' + echapper(ent.noms) + '</dd>' +
      '<dt>Classe</dt><dd>' + echapper(ent.classe) + '</dd>' +
      '<dt>Date</dt><dd>' + echapper(dateFr(ent.date)) + '</dd>' +
      '<dt>Durée</dt><dd>' + echapper(ent.duree) + '</dd></dl></header>');

    SECTIONS.forEach(function (sec) {
      var s = e.sections[sec.id];
      var vide = !s.texte.trim() && !s.images.length && !(sec.mesures && (e.mesures.length || e.calculs.length));
      if (vide && sec.facultatif) return;
      var titre = sec.facultatif ? 'Annexes' : sec.titre;
      h.push('<section class="p-section"><h2 class="p-bandeau"><span class="p-num">' + sec.num + '</span>' + echapper(titre) + '</h2>');
      h.push(vide ? '<p class="p-vide">(section non remplie)</p>' : texteEnHTML(s.texte));
      s.images.forEach(function (im) {
        h.push('<figure class="p-figure p-l' + im.largeur + '"><img src="' + echapper(im.src) + '" alt="">' +
          '<figcaption><strong>Figure ' + num[im.id] + ' :</strong> ' + echapper(im.legende || '(légende manquante)') + '</figcaption></figure>');
      });
      if (sec.mesures && e.mesures.length) {
        h.push('<table class="p-tableau"><caption>Tableau de mesures</caption><thead><tr><th>Grandeur</th><th>Symbole</th>' +
          '<th>Valeur théorique</th><th>Valeur simulée / mesurée</th><th>Unité</th><th>Écart relatif</th></tr></thead><tbody>');
        e.mesures.forEach(function (m) {
          var v = CRTP.ecart(m.theo, m.mes);
          h.push('<tr><td>' + echapper(m.grandeur) + '</td><td>' + echapper(m.symbole) + '</td><td class="n">' + echapper(m.theo) +
            '</td><td class="n">' + echapper(m.mes) + '</td><td>' + echapper(m.unite) + '</td><td class="n">' +
            (v == null ? '—' : CRTP.formatEcart(v) + ' %') + '</td></tr>');
        });
        h.push('</tbody></table>');
      }
      if (sec.mesures && e.calculs.length) {
        h.push('<div class="p-calculs"><h3>Calculs</h3>');
        e.calculs.forEach(function (c, i) {
          h.push('<div class="p-calcul"><div class="p-calcul-titre">Calcul ' + (i + 1) + (c.titre.trim() ? ' — ' + echapper(c.titre) : '') + '</div>' +
            '<div><span class="p-etiq">Formule :</span> ' + echapper(c.formule) + '</div>' +
            '<div><span class="p-etiq">Application numérique :</span> ' + echapper(c.application) + '</div>' +
            '<div><span class="p-etiq">Résultat :</span> <strong>' + echapper(c.resultat) + ' ' + echapper(c.unite) + '</strong></div></div>');
        });
        h.push('</div>');
      }
      h.push('</section>');
    });
    $('#impression').innerHTML = h.join('');
  }
  CRTP.rendreImpression = function () { rendreImpression(); };

  /* ------------------------------------------------------------------ */
  /* Actions de la barre                                                  */
  /* ------------------------------------------------------------------ */

  function enregistrerJSON() {
    var blob = new Blob([JSON.stringify(etat, null, 2)], { type: 'application/json' });
    telecharger(blob, nomFichier('json'));
    info('Projet enregistré dans vos téléchargements (' + nomFichier('json') + ').');
  }

  function ouvrirJSON(fichier) {
    if (!fichier) return;
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var d = normaliser(JSON.parse(fr.result));
        if (!estVide(etat) && !window.confirm('Ouvrir ce projet remplacera le compte rendu affiché. Continuer ?')) return;
        remplacerEtat(d);
        info('Projet « ' + fichier.name + ' » ouvert.');
        $('#contenu').focus();
      } catch (err) {
        info('Impossible d’ouvrir ce fichier : ' + err.message, 'erreur');
      }
    };
    fr.onerror = function () { info('Lecture du fichier impossible.', 'erreur'); };
    fr.readAsText(fichier);
  }

  async function exporterDocx() {
    var b = $('#btn-docx');
    if (!window.docx) { info('La bibliothèque Word (lib/docx.min.js) n’a pas pu être chargée.', 'erreur'); return; }
    b.disabled = true;
    var ancien = b.textContent;
    b.textContent = 'Création du fichier Word…';
    try {
      var blob = await CRTP.exporterDocx(etat);
      telecharger(blob, nomFichier('docx'));
      info('Fichier Word créé : ' + nomFichier('docx') + '. Il s’ouvre aussi avec LibreOffice.');
    } catch (err) {
      console.error(err);
      info('Erreur pendant la création du fichier Word : ' + err.message, 'erreur');
    } finally {
      b.disabled = false;
      b.textContent = ancien;
    }
  }

  function imprimer() {
    rendreImpression();
    var images = $all('#impression img');
    Promise.all(images.map(function (im) {
      return im.complete ? Promise.resolve() : new Promise(function (ok) { im.onload = im.onerror = ok; });
    })).then(function () { window.print(); });
  }

  function nouveau() {
    if (!estVide(etat) && !window.confirm('Effacer le compte rendu affiché et repartir d’une page blanche ?\n' +
      'Pensez à l’enregistrer (.json) avant si vous voulez le garder.')) return;
    remplacerEtat(etatVide());
    try { history.replaceState(null, '', location.pathname); } catch (err) { /* sans importance */ }
    info('Nouveau compte rendu.');
    $('#ent-titre').focus();
  }

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                            */
  /* ------------------------------------------------------------------ */

  async function chargerModele(nom) {
    if (!/^[a-z0-9_-]{1,60}$/i.test(nom)) throw new Error('Nom de modèle invalide.');
    var rep = await fetch('modeles/' + nom + '.json', { cache: 'no-cache' });
    if (!rep.ok) throw new Error('Modèle « ' + nom + ' » introuvable.');
    var d = normaliser(await rep.json());
    d.modele = nom;
    return d;
  }

  async function demarrer() {
    construireSections();
    $('#btn-nouveau').addEventListener('click', nouveau);
    $('#btn-ouvrir').addEventListener('click', function () { $('#input-ouvrir').click(); });
    $('#input-ouvrir').addEventListener('change', function (ev) {
      ouvrirJSON(ev.target.files[0]);
      ev.target.value = '';
    });
    $('#btn-enregistrer').addEventListener('click', enregistrerJSON);
    $('#btn-imprimer').addEventListener('click', imprimer);
    $('#btn-docx').addEventListener('click', exporterDocx);
    window.addEventListener('beforeprint', rendreImpression);

    var sauvegarde = lireSauvegarde();
    var params = new URLSearchParams(location.search);
    var modele = params.get('modele');

    if (modele) {
      if (sauvegarde && sauvegarde.modele === modele && !estVide(sauvegarde)) {
        etat = sauvegarde;
        info('Votre travail en cours sur ce TP a été rechargé. Bouton « Nouveau » pour repartir de zéro.');
      } else {
        try {
          var d = await chargerModele(modele);
          if (sauvegarde && !estVide(sauvegarde) &&
              !window.confirm('Un autre compte rendu est en cours dans ce navigateur. Le remplacer par le modèle « ' + modele + ' » ?\n' +
                '(Annuler = garder le travail en cours)')) {
            etat = sauvegarde;
          } else {
            etat = d;
            info('Modèle « ' + modele + ' » chargé.');
          }
        } catch (err) {
          etat = sauvegarde || etatVide();
          var horsLigne = location.protocol === 'file:';
          info((horsLigne
            ? 'Le modèle ne peut pas être chargé quand la page est ouverte directement depuis le disque : utilisez « Ouvrir un projet (.json) » et choisissez modeles/' + modele + '.json.'
            : 'Chargement du modèle impossible : ' + err.message), 'erreur');
        }
      }
    } else if (sauvegarde) {
      etat = sauvegarde;
      if (!estVide(etat)) info('Votre travail en cours a été rechargé depuis ce navigateur.');
    }

    afficherEtat();
    if (!lireSauvegarde() && !estVide(etat)) sauvegarderMaintenant();
    try { window.localStorage.getItem(CLE_STOCKAGE); etatSauvegarde(estVide(etat) ? 'Sauvegarde automatique active dans ce navigateur.' : $('#etat-sauvegarde').textContent || 'Sauvegarde automatique active.'); }
    catch (err) { etatSauvegarde('Sauvegarde automatique indisponible : utilisez « Enregistrer le projet (.json) ».', true); }
    document.documentElement.classList.add('pret');
  }

  // Exposé pour les tests et le débogage
  CRTP.etat = function () { return etat; };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
