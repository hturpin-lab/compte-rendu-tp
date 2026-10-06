/* Compte rendu de TP — 1re SI
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
