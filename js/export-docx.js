/* Compte rendu de TP — export Word (.docx) avec la bibliothèque « docx » vendorisée (lib/docx.min.js). */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});

  var LARGEUR_UTILE = 9638;          // A4 (11906 twips) − 2 × 2 cm de marge
  var LARGEUR_PX = 640;              // ≈ 17 cm à 96 ppp

  /* options.densite : 'aeree' (défaut) ou 'compacte' (espacements réduits) */
  CRTP.exporterDocx = async function (etat, options) {
    options = options || {};
    var D = window.docx;
    var compact = options.densite === 'compacte';
    var niveau = CRTP.niveau(etat.niveau);
    // Couleurs du thème actif (variables CSS de la palette, indépendantes du mode d’affichage)
    var coul = function (v, d) { return CRTP.Rendu ? CRTP.Rendu.couleur(v, d) : d; };
    var BANDEAU = coul('--c-bandeau', 'CD4800');
    var CARTOUCHE = coul('--c-cartouche', '8A3A00');
    var ENTETE_TAB = coul('--c-entete-tableau', '8A3A00');
    var TITRE = coul('--c-titre', '8A3A00');
    var ACCENT = coul('--c-accent', 'FFD54F');
    var CLAIR = coul('--c-pale', 'FFF3E0');
    var LIGNE = coul('--c-ligne', 'F2F2F2');
    var BORD = coul('--c-champ', 'BFA48A');
    var MOYEN = coul('--c-moyen', 'F57C00');
    var k = compact ? 0.6 : 1;          // facteur d’espacement
    var TAILLE = compact ? 20 : 22;     // demi-points (10 pt / 11 pt)
    function esp(x) { return Math.round(x * k); }
    var Paragraph = D.Paragraph, TextRun = D.TextRun, Table = D.Table, TableRow = D.TableRow, TableCell = D.TableCell;
    var WidthType = D.WidthType, ShadingType = D.ShadingType, AlignmentType = D.AlignmentType, BorderStyle = D.BorderStyle;
    var num = CRTP.numerosFigures(etat);
    var ent = etat.entete;

    function para(texte, opts) {
      opts = opts || {};
      return new Paragraph({
        alignment: opts.align,
        spacing: { after: esp(opts.after != null ? opts.after : 100) },
        keepNext: opts.keepNext,
        children: [new TextRun({ text: texte, bold: opts.bold, italics: opts.italics, color: opts.color, size: opts.size })]
      });
    }

    function paragraphesTexte(t) {
      var lignes = String(t || '').replace(/\r/g, '').split('\n');
      while (lignes.length && !lignes[lignes.length - 1].trim()) lignes.pop();
      while (lignes.length && !lignes[0].trim()) lignes.shift();
      return lignes.map(function (l) { return para(l, { after: l.trim() ? 80 : 40 }); });
    }

    var bordure = { style: BorderStyle.SINGLE, size: 4, color: BORD };
    var bordures = { top: bordure, bottom: bordure, left: bordure, right: bordure };

    function cellule(enfants, opts) {
      opts = opts || {};
      return new TableCell({
        width: { size: opts.largeur, type: WidthType.DXA },
        shading: opts.fond ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fond } : undefined,
        verticalAlign: D.VerticalAlign ? D.VerticalAlign.CENTER : undefined,
        margins: { top: esp(60), bottom: esp(60), left: opts.marge != null ? opts.marge : 100, right: opts.marge != null ? opts.marge : 100 },
        borders: bordures,
        children: enfants
      });
    }

    function run(t, o) { o = o || {}; return new TextRun({ text: t, bold: o.bold, color: o.color, size: o.size, italics: o.italics }); }

    /* ---- Cartouche ---- */
    var l1 = 1300, l3 = 3600, l2 = LARGEUR_UTILE - l1 - l3;
    function ligneInfo(etiq, val) {
      return new Paragraph({ spacing: { after: esp(40) }, children: [run(etiq + ' : ', { bold: true, color: TITRE }), run(val || '')] });
    }
    var cartouche = new Table({
      width: { size: LARGEUR_UTILE, type: WidthType.DXA },
      columnWidths: [l1, l2, l3],
      rows: [new TableRow({
        children: [
          cellule([
            new Paragraph({ alignment: AlignmentType.CENTER, children: [run(niveau.cas[0], { bold: true, color: 'FFFFFF', size: 28 })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [run(niveau.cas[1], { bold: true, color: 'FFFFFF', size: niveau.cas[1].length > 3 ? 28 : 36 })] })
          ], { largeur: l1, fond: CARTOUCHE }),
          cellule([
            new Paragraph({ spacing: { after: esp(60) }, children: [run('COMPTE RENDU DE TP — ' + niveau.nom.toUpperCase(), { bold: true, color: TITRE, size: 18 })] }),
            new Paragraph({ children: [run(ent.titre || 'Titre du TP', { bold: true, size: 28 })] })
          ], { largeur: l2 }),
          cellule([
            ligneInfo('Nom(s)', ent.noms),
            ligneInfo('Classe', ent.classe),
            ligneInfo('Date', CRTP.dateFr(ent.date)),
            ligneInfo('Durée', ent.duree)
          ], { largeur: l3, fond: CLAIR })
        ]
      })]
    });

    var enfants = [cartouche, para('', { after: 120 })];

    function bandeau(n, titre) {
      return new Paragraph({
        heading: D.HeadingLevel.HEADING_1,
        keepNext: true,
        spacing: { before: esp(280), after: esp(140) },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: BANDEAU },
        border: { left: { style: BorderStyle.SINGLE, size: 36, color: ACCENT, space: 4 } },
        children: [run(' ' + n + '. ' + titre, { bold: true, color: 'FFFFFF', size: compact ? 24 : 26 })]
      });
    }

    var sections = CRTP.sectionsPour(etat.niveau);
    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      var donnees = etat.sections[sec.id];
      var vide = !donnees.texte.trim() && !donnees.images.length && !(sec.mesures && (etat.mesures.length || etat.calculs.length));
      if (vide && sec.facultatif) continue;
      enfants.push(bandeau(sec.num, sec.facultatif ? 'Annexes' : sec.titre));
      if (vide) enfants.push(para('(section non remplie)', { italics: true, color: '777777' }));
      else enfants = enfants.concat(paragraphesTexte(donnees.texte));

      for (var i = 0; i < donnees.images.length; i++) {
        var im = donnees.images[i];
        var info = await CRTP.imagePourDocx(im.src);
        var w = Math.round(LARGEUR_PX * im.largeur / 100);
        var h = Math.round(w * info.hauteur / info.largeur);
        if (h > 820) { w = Math.round(w * 820 / h); h = 820; }
        enfants.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          keepNext: true,
          spacing: { before: esp(120), after: esp(60) },
          children: [new D.ImageRun({ type: info.type, data: info.data, transformation: { width: w, height: h },
            altText: { name: 'Figure ' + num[im.id], description: im.legende || 'Figure', title: 'Figure ' + num[im.id] } })]
        }));
        enfants.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: esp(200) },
          children: [run('Figure ' + num[im.id] + ' : ', { bold: true, italics: true, size: 20 }), run(im.legende || '(légende manquante)', { italics: true, size: 20 })]
        }));
      }

      if (sec.mesures && etat.mesures.length) {
        var cols = CRTP.colonnesMesures(etat);
        var inc = CRTP.avecIncertitudes(etat);
        // largeurs relatives des colonnes, ramenées à la largeur utile
        var poids = { grandeur: 2.45, symbole: 1.1, theo: 1.2, uref: 1, mes: 1.2, u: 1, unite: 0.75, ecart: 1, z: 1.8 };
        if (!inc) poids = { grandeur: 2.25, symbole: 1.25, theo: 1.45, mes: 1.7, unite: 0.95, ecart: 2.04 };
        var somme = cols.reduce(function (a, c) { return a + poids[c.cle]; }, 0);
        var largeurs = cols.map(function (c) { return Math.floor(LARGEUR_UTILE * poids[c.cle] / somme); });
        var tailleTab = inc ? 16 : 20;
        var marge = inc ? 50 : 100;
        var lignes = [new TableRow({
          tableHeader: true,
          children: cols.map(function (c, j) {
            var nom = c.cle === 'u' || c.cle === 'uref' ? c.court : c.nom;   // en-têtes courts : colonnes étroites
            return cellule([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(nom, { bold: true, color: 'FFFFFF', size: tailleTab })] })],
              { largeur: largeurs[j], fond: ENTETE_TAB, marge: marge });
          })
        })];
        etat.mesures.forEach(function (m, r) {
          lignes.push(new TableRow({
            cantSplit: true,
            children: cols.map(function (c, j) {
              var t = CRTP.texteCellule(m, c);
              var rouge = c.cle === 'z' && / \(non /.test(t);
              return cellule([new Paragraph({ alignment: j >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
                children: [run(t, { size: tailleTab, bold: rouge, color: rouge ? 'B3261E' : undefined })] })],
                { largeur: largeurs[j], fond: r % 2 ? LIGNE : undefined, marge: marge });
            })
          }));
        });
        enfants.push(para('Tableau de mesures', { bold: true, color: TITRE, keepNext: true, after: 60 }));
        enfants.push(new Table({ width: { size: LARGEUR_UTILE, type: WidthType.DXA }, columnWidths: largeurs, rows: lignes }));
        enfants.push(para('Écart relatif = |valeur mesurée − valeur théorique| / |valeur théorique| × 100', { italics: true, size: 18, color: '555555', after: inc ? 20 : 100 }));
        if (inc) enfants.push(para(CRTP.LEGENDE_Z, { italics: true, size: 18, color: '555555' }));
      }

      if (sec.mesures && etat.calculs.length) {
        enfants.push(para('Calculs', { bold: true, color: TITRE, keepNext: true, after: 60 }));
        etat.calculs.forEach(function (c, k) {
          enfants.push(new Table({
            width: { size: LARGEUR_UTILE, type: WidthType.DXA },
            columnWidths: [LARGEUR_UTILE],
            rows: [new TableRow({ cantSplit: true, children: [cellule([
              new Paragraph({ spacing: { after: esp(40) }, children: [run('Calcul ' + (k + 1) + (c.titre.trim() ? ' — ' + c.titre : ''), { bold: true, color: TITRE })] }),
              new Paragraph({ spacing: { after: esp(20) }, children: [run('Formule : ', { bold: true }), run(c.formule)] }),
              new Paragraph({ spacing: { after: esp(20) }, children: [run('Application numérique : ', { bold: true }), run(c.application)] }),
              new Paragraph({ children: [run('Résultat : ', { bold: true }), run((c.resultat + ' ' + c.unite).trim(), { bold: true })] })
            ], { largeur: LARGEUR_UTILE, fond: CLAIR })] })]
          }));
          enfants.push(para('', { after: compact ? 0 : 60, size: compact ? 8 : undefined }));
        });
      }
    }

    var doc = new D.Document({
      creator: 'Labrio — compte rendu de TP — ' + niveau.nom,
      title: ent.titre || 'Compte rendu de TP',
      description: 'Compte rendu de TP',
      styles: {
        default: { document: { run: { font: 'Arial', size: TAILLE } } },
        paragraphStyles: [{
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Arial', size: 26, bold: true, color: 'FFFFFF' },
          paragraph: { spacing: { before: esp(280), after: esp(140) }, outlineLevel: 0 }
        }]
      },
      sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
        footers: {
          default: new D.Footer({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                run((ent.noms ? ent.noms + ' — ' : '') + 'Compte rendu de TP — ' + niveau.nom + ' — page ', { size: 16, color: '666666' }),
                new TextRun({ children: [D.PageNumber.CURRENT], size: 16, color: '666666' }),
                run(' / ', { size: 16, color: '666666' }),
                new TextRun({ children: [D.PageNumber.TOTAL_PAGES], size: 16, color: '666666' })
              ]
            })]
          })
        },
        children: enfants
      }]
    });
    return D.Packer.toBlob(doc);
  };
})();
