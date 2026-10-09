/* Compte rendu de TP — 1re SI / 1re STI2D / Tle SI / CPGE TSI
 * Configuration des sections : titres, consignes et exemples
 * (exemples tirés du TP « Simulation Tinkercad de cellules photovoltaïques — lois de Kirchhoff »).
 */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});

  CRTP.SECTIONS = [
    {
      id: 'problematique',
      num: 1,
      titre: 'Problématique / objectif',
      consigne:
        'En <strong>1 à 2 phrases</strong>, écrivez la question à laquelle le TP répond (terminez par « ? ») ' +
        'ou l’objectif (« Vérifier que… », « Déterminer… »).',
      exemple:
        '<p>Comment associer des cellules photovoltaïques pour obtenir la tension et le courant nécessaires ' +
        'à une charge, et les lois de Kirchhoff (loi des mailles, loi des nœuds) permettent-elles de prévoir les valeurs obtenues ?</p>',
      placeholder: 'Comment… ? / L’objectif est de vérifier que…',
      minCar: 15
    },
    {
      id: 'materiel',
      num: 2,
      titre: 'Matériel et logiciels',
      consigne:
        'Faites une <strong>liste</strong> (un élément par ligne, commencez par « - ») : logiciel utilisé, ' +
        'composants <strong>avec leurs valeurs</strong>, appareils de mesure.',
      exemple:
        '<ul><li>Logiciel de simulation en ligne Tinkercad Circuits (compte classe)</li>' +
        '<li>8 cellules photovoltaïques modélisées par des sources 0,5 V / 450 mA</li>' +
        '<li>2 résistances de charge : R1 = 4,7 Ω (série) et R2 = 2,2 Ω (série/parallèle)</li>' +
        '<li>5 voltmètres (multimètres en mode V continu)</li>' +
        '<li>3 ampèremètres (multimètres en mode A continu)</li></ul>',
      placeholder: '- Tinkercad Circuits\n- …',
      minCar: 15
    },
    {
      id: 'hypotheses',
      num: 3,
      titre: 'Hypothèses et prévisions',
      consigne:
        'Indiquez la <strong>loi utilisée</strong> et ce que vous prévoyez <strong>avant</strong> la simulation ' +
        '(valeur ou ordre de grandeur attendu, avec l’unité).',
      exemple:
        '<p>D’après la loi des mailles, en série les tensions s’additionnent : 4 cellules de 0,5 V donnent ' +
        'U = 4 × 0,5 = 2,0 V. D’après la loi des nœuds, en parallèle les courants s’additionnent : ' +
        '2 branches de 450 mA donnent I = 0,9 A.</p>',
      placeholder: 'D’après la loi …, on s’attend à obtenir environ … (unité).',
      minCar: 15
    },
    {
      id: 'protocole',
      num: 4,
      titre: 'Protocole / démarche',
      consigne:
        'Écrivez les <strong>étapes numérotées</strong> (1., 2., 3.…). Ajoutez le <strong>schéma du montage</strong> ' +
        'et précisez où sont placés les appareils de mesure (voltmètre en dérivation, ampèremètre en série).',
      exemple:
        '<ol><li>Placer 4 cellules en série dans Tinkercad et les relier à la résistance R1 = 4,7 Ω.</li>' +
        '<li>Brancher un voltmètre en dérivation aux bornes de chaque cellule, puis aux bornes de l’ensemble.</li>' +
        '<li>Lancer la simulation et relever U1, U2, U3, U4 et U.</li>' +
        '<li>Réaliser 2 branches de 4 cellules en parallèle, remplacer R1 par R2 = 2,2 Ω ; placer un ampèremètre en série dans chaque branche et dans la branche principale.</li>' +
        '<li>Relever I1, I2 et I, faire une capture d’écran de chaque montage.</li></ol>',
      placeholder: '1. …\n2. …\n3. …',
      minCar: 30
    },
    {
      id: 'resultats',
      num: 5,
      titre: 'Résultats',
      consigne:
        'Ajoutez vos <strong>captures d’écran légendées</strong>, remplissez le <strong>tableau de mesures</strong> ' +
        '(toujours avec l’unité) et présentez vos <strong>calculs</strong>. Le texte sert à présenter ce que montrent les figures.',
      exemple:
        '<p>La figure 1 montre le montage série : chaque voltmètre affiche 0,50 V et le voltmètre ' +
        'global affiche 2,00 V. La figure 2 montre le montage série/parallèle : les ampèremètres de branche ' +
        'affichent 0,455 A chacun, l’ampèremètre principal 0,909 A.</p>',
      placeholder: 'La figure 1 montre…',
      minCar: 15,
      mesures: true
    },
    {
      id: 'exploitation',
      num: 6,
      titre: 'Exploitation / analyse',
      consigne:
        'Comparez <strong>théorie et simulation</strong> en vous appuyant sur l’<strong>écart relatif</strong>, ' +
        'dites si la loi est <strong>vérifiée</strong> et proposez des <strong>causes possibles</strong> des écarts.',
      exemple:
        '<p>Loi des mailles : U1 + U2 + U3 + U4 = 4 × 0,50 = 2,00 V, égale à la tension U ' +
        'mesurée (2,00 V) : la loi est vérifiée. ' +
        'Loi des nœuds au nœud M : I1 + I2 = 0,455 + 0,455 = 0,910 A ≈ I = 0,909 A (arrondis d’affichage) : la loi est vérifiée. ' +
        'Écart avec la prévision de 0,90 A : e = |0,909 − 0,90| / 0,90 × 100 ≈ 1,0 %, dû au choix de R2 = 2,2 Ω au lieu de 2,22 Ω.</p>',
      placeholder: 'La valeur simulée … est proche de la valeur théorique … : l’écart relatif est de … %. La loi … est donc …',
      minCar: 15
    },
    {
      id: 'conclusion',
      num: 7,
      titre: 'Conclusion',
      consigne:
        'Répondez à la <strong>problématique</strong> (reprenez ses mots), indiquez les <strong>limites</strong> ' +
        'de l’étude et proposez une <strong>ouverture</strong> (suite possible, application réelle).',
      exemple:
        '<p>Pour obtenir 2,0 V et 0,9 A, il faut associer les cellules photovoltaïques en 2 branches parallèles ' +
        'de 4 cellules en série ; les lois de Kirchhoff permettent bien de prévoir la tension et le courant ' +
        '(écarts d’environ 1 %). Limite : la simulation suppose un éclairement constant. ' +
        'Ouverture : mesurer un vrai panneau au soleil et comparer.</p>',
      placeholder: 'Pour répondre à la problématique, …',
      minCar: 15
    },
    {
      id: 'annexes',
      num: 8,
      titre: 'Annexes (facultatif)',
      consigne:
        'Facultatif : captures supplémentaires, calculs détaillés, documentation technique, lien vers le projet Tinkercad.',
      exemple:
        '<p>Annexe A : capture du projet Tinkercad complet. Annexe B : extrait de la fiche technique d’une cellule ' +
        '(tension 0,5 V, courant 450 mA au point de puissance maximale).</p>',
      placeholder: 'Annexe A : …',
      minCar: 0,
      facultatif: true
    }
  ];

  CRTP.ENTETE = {
    consigne:
      'Indiquez le <strong>titre exact du TP</strong>, les <strong>noms du binôme</strong>, la classe, la date et la durée.',
    exemple:
      '<p><strong>Titre :</strong> TP 4 — Simulation Tinkercad de cellules photovoltaïques : lois de Kirchhoff<br>' +
      '<strong>Noms :</strong> Léa MARTIN et Hugo PAYET — <strong>Classe :</strong> 1re SI 2 — ' +
      '<strong>Date :</strong> 06/10/2026 — <strong>Durée :</strong> 2 h</p>'
  };

  CRTP.REGLE_CALCUL =
    '<strong>Règle :</strong> formule littérale → application numérique → résultat <strong>avec son unité</strong>.' +
    ' Exemple : U = U1 + U2 + U3 + U4 → U = 0,5 + 0,5 + 0,5 + 0,5 → U = 2,0 V';

  /* ------------------------------------------------------------------ */
  /* Niveau CPGE TSI : consignes et exemples de prépa (vocabulaire GUM)  */
  /* Seuls les champs redéfinis ici remplacent ceux de CRTP.SECTIONS.    */
  /* ------------------------------------------------------------------ */

  CRTP.SECTIONS_TSI = {
    problematique: {
      consigne:
        'En <strong>1 à 2 phrases</strong>, posez la problématique : la ou les <strong>grandeurs à déterminer</strong> ' +
        'et le <strong>modèle à valider</strong> (« Le modèle … permet-il de prévoir … ? », « Déterminer … et confronter au modèle … »).',
      exemple:
        '<p>Une association de 2 branches de 4 cellules en série peut-elle alimenter une charge R2 = 2,2 Ω sous 2 V, ' +
        'et le modèle des sources idéales associé aux lois de Kirchhoff prévoit-il l’intensité débitée de façon ' +
        '<strong>compatible</strong> avec la mesure, compte tenu des incertitudes ?</p>',
      placeholder: 'Le modèle … permet-il de prévoir … ? / Déterminer … et confronter la mesure au modèle …'
    },
    materiel: {
      consigne:
        'Liste du matériel (un élément par ligne, « - ») : composants <strong>avec valeur et tolérance</strong>, ' +
        'appareils de mesure <strong>avec calibre, résolution et précision</strong> (notice constructeur).',
      exemple:
        '<ul><li>8 alimentations stabilisées réglées à E = 0,500 V (limitation 0,50 A), modélisant les cellules (0,5 V ; 450 mA)</li>' +
        '<li>Résistances de puissance R1 = 4,7 Ω et R2 = 2,2 Ω, tolérance ± 1 %</li>' +
        '<li>Voltmètre numérique 6000 points, calibre 6 V : résolution 0,001 V, précision ± (0,5 % + 2 digits)</li>' +
        '<li>Ampèremètre numérique 6000 points, calibre 6 A : résolution 0,001 A, précision ± (1,2 % + 3 digits)</li></ul>',
      placeholder: '- Alimentation …\n- Multimètre …, calibre …, résolution …, précision ± (… % + … digits)\n- …'
    },
    hypotheses: {
      titre: 'Modélisation : hypothèses et prévisions',
      consigne:
        'Énoncez les <strong>hypothèses de modélisation</strong> de façon explicite (ce qui est négligé, domaine de validité), ' +
        'le <strong>modèle</strong> retenu (lois, équations) et les <strong>prévisions numériques</strong>, ' +
        'avec leur incertitude-type quand elles dépendent de grandeurs mesurées ou tolérancées.',
      exemple:
        '<p><strong>Hypothèses :</strong> chaque cellule est modélisée par une source de tension idéale E = 0,500 V ' +
        '(résistance interne négligée) ; fils et ampèremètres de résistance négligeable ; voltmètres de résistance infinie ; ' +
        'cellules identiques et également éclairées.</p>' +
        '<p><strong>Modèle :</strong> loi des mailles U = 4E = 2,000 V ; loi d’Ohm I = U / R ; loi des nœuds I = I1 + I2.</p>' +
        '<p><strong>Prévisions :</strong> courant nominal 0,45 A par branche, d’où I = 2 × 0,45 = 0,90 A ; ' +
        'avec R2 = 2,2 Ω (± 1 %) : I = U / R2 = 0,909 A, ' +
        'u(I)/I = √[(u(U)/U)² + (u(R2)/R2)²] = √[(0,35 %)² + (0,58 %)²] ≈ 0,67 %, soit u ≈ 0,006 A.</p>',
      placeholder: 'Hypothèses : on néglige …, on suppose … Modèle : … Prévision : x = … (u ≈ …)'
    },
    protocole: {
      titre: 'Protocole justifié',
      consigne:
        'Étapes numérotées avec le <strong>schéma</strong>, et <strong>justification des choix</strong> : appareils, ' +
        '<strong>calibres</strong> (le plus petit calibre compatible avec la valeur attendue), <strong>résolution</strong>, ' +
        'nombre <strong>n de mesures répétées</strong> pour une évaluation de type A.',
      exemple:
        '<ol><li>Associer 4 sources en série et les relier à R1 = 4,7 Ω ; mesurer U1 à U4 et U au voltmètre en dérivation. ' +
        'Calibre 6 V : plus petit calibre supérieur à 2 V attendus, résolution 0,001 V.</li>' +
        '<li>Réaliser 2 branches de 4 sources en parallèle sur R2 = 2,2 Ω ; ampèremètres en série dans chaque branche ' +
        'et dans la branche principale. Calibre 6 A (0,9 A attendu ; le calibre 600 mA serait dépassé).</li>' +
        '<li>Répéter n = 5 fois la mesure de I (ouverture puis fermeture du circuit) pour évaluer la dispersion (type A).</li>' +
        '<li>Relever la notice des appareils pour l’évaluation de type B.</li></ol>',
      placeholder: '1. … (calibre … car …)\n2. …\n3. Répéter n = … fois la mesure de … '
    },
    resultats: {
      consigne:
        'Résultats bruts (figures légendées, tableau) puis <strong>incertitudes-types</strong> : ' +
        '<strong>type A</strong> u = s / √n (s : écart-type expérimental de n mesures) ; ' +
        '<strong>type B</strong> u = Δ / √3 pour une loi uniforme de demi-largeur Δ ' +
        '(Δ tiré de la notice constructeur ; pour la seule lecture d’un affichage, u = résolution / √12, ' +
        'certains énoncés retiennent résolution / √3). Composer : u = √(u<sub>A</sub>² + u<sub>B</sub>²). ' +
        'Écriture : <strong>x = (valeur ± u) unité</strong>, u avec 1 ou 2 chiffres significatifs, valeur arrondie à la même décimale. ' +
        'Renseignez les colonnes <strong>u</strong> du tableau : z est calculé automatiquement.',
      exemple:
        '<p>Mesures répétées de I (n = 5) : 0,909 ; 0,911 ; 0,908 ; 0,910 ; 0,907 A → moyenne 0,909 A, ' +
        's = 1,6 × 10⁻³ A, u<sub>A</sub> = s / √5 = 0,7 × 10⁻³ A.</p>' +
        '<p>Type B (notice, calibre 6 A) : Δ = 1,2 % × 0,909 + 3 × 0,001 = 0,014 A, u<sub>B</sub> = Δ / √3 = 0,008 0 A.</p>' +
        '<p>u(I) = √(u<sub>A</sub>² + u<sub>B</sub>²) = 0,008 1 A : <strong>I = (0,909 ± 0,008) A</strong> ' +
        '(type B dominant). De même U = (2,000 ± 0,007) V et I1 = I2 = (0,455 ± 0,005) A.</p>',
      placeholder: 'La figure 1 montre… Mesures répétées : … → x = (… ± …) unité'
    },
    exploitation: {
      titre: 'Exploitation : validation du modèle',
      consigne:
        'Confrontez chaque résultat à sa référence (prévision du modèle, valeur attendue) par l’<strong>écart normalisé</strong> ' +
        'z = |x<sub>mes</sub> − x<sub>réf</sub>| / u(x<sub>mes</sub>), ou z = |x<sub>mes</sub> − x<sub>réf</sub>| / √(u<sub>mes</sub>² + u<sub>réf</sub>²) ' +
        'si la référence a une incertitude. Critère usuel : <strong>z ≤ 2 → compatibles</strong>. ' +
        'Discutez la <strong>validité et les limites du modèle</strong> et la source d’incertitude dominante.',
      exemple:
        '<p>Loi des nœuds : I1 + I2 = (0,910 ± 0,007) A et I = (0,909 ± 0,008) A ; ' +
        'z = 0,001 / √(0,008² + 0,007²) ≈ 0,09 ≤ 2 : compatibles, la loi des nœuds est validée.</p>' +
        '<p>Prévision « courant nominal » 0,90 A (sans incertitude) : z = |0,909 − 0,90| / 0,008 ≈ 1,1 ≤ 2 : compatible. ' +
        'Modèle I = U / R2 = (0,909 ± 0,006) A : z < 0,1. Le modèle des sources idéales est validé à ce niveau de précision ; ' +
        'l’incertitude de type B de l’ampèremètre domine (u<sub>B</sub> ≈ 11 u<sub>A</sub>).</p>' +
        '<p>Limite : avec de vraies cellules, la tension baisse quand le courant augmente (caractéristique I(U) non linéaire) : ' +
        'le modèle de source idéale n’est valable qu’au voisinage du point de fonctionnement choisi.</p>',
      placeholder: 'z = |… − …| / … = … ≤ 2 : compatibles. Le modèle … est validé / mis en défaut car …'
    },
    conclusion: {
      consigne:
        '<strong>Conclusion argumentée</strong> : répondez à la problématique en vous <strong>prononçant sur la compatibilité</strong> ' +
        '(valeurs de z), indiquez les <strong>limites</strong> du modèle et du protocole, puis une piste d’amélioration.',
      exemple:
        '<p>L’association de 2 branches de 4 cellules alimente R2 sous U = (2,000 ± 0,007) V avec I = (0,909 ± 0,008) A. ' +
        'Les écarts normalisés sont tous inférieurs à 2 (z ≈ 0,09 pour la loi des nœuds, z ≈ 1,1 pour la prévision à 0,90 A) : ' +
        'mesures et modèle des sources idéales sont <strong>compatibles</strong>. Limite : modèle valable au voisinage du point de ' +
        'fonctionnement, pour un éclairement constant. Amélioration : un ampèremètre plus précis réduirait u(I), ' +
        'et le relevé de la caractéristique I(U) d’une vraie cellule éprouverait le modèle.</p>',
      placeholder: 'Les écarts normalisés (z = …) montrent que … sont compatibles / incompatibles. Le modèle … Limites : …'
    },
    annexes: {
      consigne:
        'Facultatif : relevés complets, calculs d’incertitude détaillés, extraits de notice, script de traitement (Python).'
    }
  };

  CRTP.ENTETE_TSI = {
    consigne:
      'Indiquez le <strong>titre exact du TP</strong>, les <strong>noms du binôme</strong>, la classe, la date et la durée.',
    exemple:
      '<p><strong>Titre :</strong> TP 4 — Association de cellules photovoltaïques : validation d’un modèle, incertitudes<br>' +
      '<strong>Noms :</strong> Léa MARTIN et Hugo PAYET — <strong>Classe :</strong> TSI 1 — ' +
      '<strong>Date :</strong> 06/10/2026 — <strong>Durée :</strong> 2 h</p>'
  };

  CRTP.REGLE_CALCUL_TSI =
    '<strong>Règle :</strong> formule littérale → application numérique → résultat <strong>avec son unité et son incertitude</strong>. ' +
    'Exemple : u(I) = √(u<sub>A</sub>² + u<sub>B</sub>²) → √(0,000 7² + 0,008 0²) → u(I) = 0,008 A, ' +
    'donc I = (0,909 ± 0,008) A';

  /* Sections du niveau demandé (consignes de prépa pour la CPGE TSI, du lycée sinon). */
  CRTP.sectionsPour = function (codeNiveau) {
    var tsi = CRTP.niveau && CRTP.niveau(codeNiveau).contenu === 'tsi';
    var surcharges = tsi ? CRTP.SECTIONS_TSI : {};
    return CRTP.SECTIONS.map(function (s) {
      var o = {}, k;
      for (k in s) o[k] = s[k];
      var sur = surcharges[s.id] || {};
      for (k in sur) o[k] = sur[k];
      return o;
    });
  };
  CRTP.entetePour = function (codeNiveau) {
    return CRTP.niveau && CRTP.niveau(codeNiveau).contenu === 'tsi' ? CRTP.ENTETE_TSI : CRTP.ENTETE;
  };

  CRTP.VERBES_OBJECTIF = [
    'vérifier', 'déterminer', 'montrer', 'mesurer', 'comparer', 'calculer', 'étudier', 'valider',
    'justifier', 'identifier', 'dimensionner', 'caractériser', 'analyser', 'choisir', 'évaluer',
    'prévoir', 'démontrer', 'simuler', 'tester', 'expliquer', 'objectif'
  ];

  CRTP.MOTS_VIDES = (
    'alors aussi autre autres avant avec avoir cette celle celui ceux comme comment dans donc dont elle elles ' +
    'encore entre être était fait faire leur leurs mais même nous notre nous ouvert pour pourquoi quand quelle ' +
    'quelles quels quel sans selon sont sous tout tous toute toutes très vous votre vers voici obtenir permet ' +
    'permettent peut peuvent cela ceci afin ainsi lors plus moins quoi faut tp travaux objectif problématique'
  ).split(' ');
})();
