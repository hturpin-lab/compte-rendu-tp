/* Compte rendu de TP — export Word (.docx) avec la bibliothèque « docx » vendorisée (lib/docx.min.js). */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});

  var ORANGE = 'E65100', ORANGE_FONCE = '8A3A00', JAUNE = 'FFD54F', CLAIR = 'FFF3E0', GRIS = 'F2F2F2';
  var LARGEUR_UTILE = 9638;          // A4 (11906 twips) − 2 × 2 cm de marge
  var LARGEUR_PX = 640;              // ≈ 17 cm à 96 ppp

  CRTP.exporterDocx = async function (etat) {
    var D = window.docx;
    var Paragraph = D.Paragraph, TextRun = D.TextRun, Table = D.Table, TableRow = D.TableRow, TableCell = D.TableCell;
    var WidthType = D.WidthType, ShadingType = D.ShadingType, AlignmentType = D.AlignmentType, BorderStyle = D.BorderStyle;
    var num = CRTP.numerosFigures(etat);
    var ent = etat.entete;

    function para(texte, opts) {
      opts = opts || {};
      return new Paragraph({
        alignment: opts.align,
        spacing: { after: opts.after != null ? opts.after : 100 },
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

    var bordure = { style: BorderStyle.SINGLE, size: 4, color: 'BFA48A' };
    var bordures = { top: bordure, bottom: bordure, left: bordure, right: bordure };

    function cellule(enfants, opts) {
      opts = opts || {};
      return new TableCell({
        width: { size: opts.largeur, type: WidthType.DXA },
        shading: opts.fond ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fond } : undefined,
        verticalAlign: D.VerticalAlign ? D.VerticalAlign.CENTER : undefined,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        borders: bordures,
        children: enfants
      });
    }

    function run(t, o) { o = o || {}; return new TextRun({ text: t, bold: o.bold, color: o.color, size: o.size, italics: o.italics }); }

    /* ---- Cartouche ---- */
    var l1 = 1300, l3 = 3600, l2 = LARGEUR_UTILE - l1 - l3;
    function ligneInfo(etiq, val) {
      return new Paragraph({ spacing: { after: 40 }, children: [run(etiq + ' : ', { bold: true, color: ORANGE_FONCE }), run(val || '')] });
    }
    var cartouche = new Table({
      width: { size: LARGEUR_UTILE, type: WidthType.DXA },
      columnWidths: [l1, l2, l3],
      rows: [new TableRow({
        children: [
          cellule([
            new Paragraph({ alignment: AlignmentType.CENTER, children: [run('1re', { bold: true, color: 'FFFFFF', size: 28 })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [run('SI', { bold: true, color: 'FFFFFF', size: 36 })] })
          ], { largeur: l1, fond: ORANGE }),
          cellule([
            new Paragraph({ spacing: { after: 60 }, children: [run('COMPTE RENDU DE TP', { bold: true, color: ORANGE_FONCE, size: 18 })] }),
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
        spacing: { before: 280, after: 140 },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: ORANGE },
        border: { left: { style: BorderStyle.SINGLE, size: 36, color: JAUNE, space: 4 } },
        children: [run(' ' + n + '. ' + titre, { bold: true, color: 'FFFFFF', size: 26 })]
      });
    }

    for (var s = 0; s < CRTP.SECTIONS.length; s++) {
      var sec = CRTP.SECTIONS[s];
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
          spacing: { before: 120, after: 60 },
          children: [new D.ImageRun({ type: info.type, data: info.data, transformation: { width: w, height: h },
            altText: { name: 'Figure ' + num[im.id], description: im.legende || 'Figure', title: 'Figure ' + num[im.id] } })]
        }));
        enfants.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [run('Figure ' + num[im.id] + ' : ', { bold: true, italics: true, size: 20 }), run(im.legende || '(légende manquante)', { italics: true, size: 20 })]
        }));
      }

      if (sec.mesures && etat.mesures.length) {
        var largeurs = [2250, 1250, 1450, 1700, 950, 2038];
        var entetes = ['Grandeur', 'Symbole', 'Valeur théorique', 'Valeur simulée / mesurée', 'Unité', 'Écart relatif (%)'];
        var lignes = [new TableRow({
          tableHeader: true,
          children: entetes.map(function (t, k) {
            return cellule([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(t, { bold: true, color: 'FFFFFF', size: 20 })] })],
              { largeur: largeurs[k], fond: ORANGE_FONCE });
          })
        })];
        etat.mesures.forEach(function (m, r) {
          var v = CRTP.ecart(m.theo, m.mes);
          var vals = [m.grandeur, m.symbole, m.theo, m.mes, m.unite, v == null ? '—' : CRTP.formatEcart(v) + ' %'];
          lignes.push(new TableRow({
            children: vals.map(function (t, k) {
              return cellule([new Paragraph({ alignment: k >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT, children: [run(t, { size: 20 })] })],
                { largeur: largeurs[k], fond: r % 2 ? GRIS : undefined });
            })
          }));
        });
        enfants.push(para('Tableau de mesures', { bold: true, color: ORANGE_FONCE, keepNext: true, after: 60 }));
        enfants.push(new Table({ width: { size: LARGEUR_UTILE, type: WidthType.DXA }, columnWidths: largeurs, rows: lignes }));
        enfants.push(para('Écart relatif = |valeur mesurée − valeur théorique| / |valeur théorique| × 100', { italics: true, size: 18, color: '555555' }));
      }

      if (sec.mesures && etat.calculs.length) {
        enfants.push(para('Calculs', { bold: true, color: ORANGE_FONCE, keepNext: true, after: 60 }));
        etat.calculs.forEach(function (c, k) {
          enfants.push(new Table({
            width: { size: LARGEUR_UTILE, type: WidthType.DXA },
            columnWidths: [LARGEUR_UTILE],
            rows: [new TableRow({ cantSplit: true, children: [cellule([
              new Paragraph({ spacing: { after: 40 }, children: [run('Calcul ' + (k + 1) + (c.titre.trim() ? ' — ' + c.titre : ''), { bold: true, color: ORANGE_FONCE })] }),
              new Paragraph({ spacing: { after: 20 }, children: [run('Formule : ', { bold: true }), run(c.formule)] }),
              new Paragraph({ spacing: { after: 20 }, children: [run('Application numérique : ', { bold: true }), run(c.application)] }),
              new Paragraph({ children: [run('Résultat : ', { bold: true }), run((c.resultat + ' ' + c.unite).trim(), { bold: true })] })
            ], { largeur: LARGEUR_UTILE, fond: CLAIR })] })]
          }));
          enfants.push(para('', { after: 60 }));
        });
      }
    }

    var doc = new D.Document({
      creator: 'Compte rendu de TP — 1re SI',
      title: ent.titre || 'Compte rendu de TP',
      description: 'Compte rendu de TP',
      styles: {
        default: { document: { run: { font: 'Arial', size: 22 } } },
        paragraphStyles: [{
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Arial', size: 26, bold: true, color: 'FFFFFF' },
          paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 }
        }]
      },
      sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
        footers: {
          default: new D.Footer({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                run((ent.noms ? ent.noms + ' — ' : '') + 'Compte rendu de TP — page ', { size: 16, color: '666666' }),
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
