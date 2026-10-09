# Labrio — compte rendu de TP (1re SI, 1re STI2D, Tle SI, CPGE TSI)

Outil web **statique** qui guide les élèves (1re SI, 1re STI2D, Tle SI et CPGE TSI) pour rédiger un compte rendu de TP complet et bien présenté :
consignes et exemples pour chaque partie, captures d'écran légendées, tableau de mesures avec calcul automatique
de l'écart relatif, calculs « formule littérale → application numérique → résultat avec unité », vérification
en direct, puis export **PDF** (impression) ou **Word (.docx)**.

L'outil fonctionne **hors ligne** (il suffit d'ouvrir `index.html`) et peut être publié gratuitement sur **GitHub Pages**.

## Structure du compte rendu

| N° | Partie | Contenu attendu |
|----|--------|-----------------|
| 0 | En-tête (cartouche) | titre du TP, noms du binôme, classe, date, durée |
| 1 | Problématique / objectif | 1 à 2 phrases, la question à laquelle le TP répond |
| 2 | Matériel et logiciels | Tinkercad, composants avec valeurs, appareils de mesure |
| 3 | Hypothèses et prévisions | loi utilisée, ordre de grandeur attendu |
| 4 | Protocole / démarche | étapes numérotées, schéma, position des appareils de mesure |
| 5 | Résultats | captures légendées, tableau de mesures, calculs |
| 6 | Exploitation / analyse | théorie vs simulation, écart relatif, vérification de la loi, causes des écarts |
| 7 | Conclusion | réponse à la problématique, limites, ouverture |
| 8 | Annexes | facultatif |

Chaque partie a une consigne courte et un exemple dépliable (« Voir un exemple ») tiré du TP
*Simulation Tinkercad de cellules photovoltaïques — lois de Kirchhoff*.

## Thèmes, niveaux et liens à donner

Une poignée **« Rendu »** fixée au bord droit de la page (bouton flottant en bas à droite sur téléphone) ouvre un
panneau avec 4 groupes de boutons. Les choix sont mémorisés dans le navigateur.

| Groupe | Choix | Effet |
|--------|-------|-------|
| Thème de couleurs | SI · STI2D · CPGE TSI | couleurs de l'écran, de l'impression et du Word |
| Niveau / classe | 1re SI · 1re STI2D · Tle SI · CPGE TSI | libellé du cartouche, classes proposées, consignes, exemples, vérifications, colonnes du tableau |
| Affichage écran | Clair · Sombre · Fort contraste | écran seulement (impression et Word restent clairs) |
| Densité | Aérée · Compacte | marges, interlignes, hauteur des zones à l'écran, à l'impression et dans le Word |

Le thème et le niveau sont indépendants (on peut choisir le thème TSI avec le niveau Tle SI) et sont **enregistrés
dans le fichier .json** du projet : ils sont restaurés à l'ouverture.

### Paramètres d'adresse (combinables entre eux et avec `?modele=…`)

| Paramètre | Valeurs | Rôle |
|-----------|---------|------|
| `theme` | `si`, `sti2d`, `tsi` | thème de couleurs ; règle aussi le niveau par défaut (`si` → 1re SI, `sti2d` → 1re STI2D, `tsi` → CPGE TSI) |
| `niveau` | `1si`, `1sti2d`, `tlesi`, `tsi` | niveau (prioritaire sur le niveau déduit du thème) |
| `mode` | `clair`, `sombre`, `contraste` | affichage écran |
| `densite` | `aeree`, `compacte` | densité |
| `verrou` | `1` | masque les groupes Thème et Niveau du panneau (Affichage et Densité restent) : le professeur impose son thème et son niveau ; un .json ouvert par l'élève garde alors ce thème et ce niveau |

### Liens prêts à copier

**CPGE TSI (collègue de prépa)**

```
https://hturpin-lab.github.io/compte-rendu-tp/?theme=tsi&verrou=1
https://hturpin-lab.github.io/compte-rendu-tp/?theme=tsi&verrou=1&modele=exemple-pv-tsi
https://hturpin-lab.github.io/compte-rendu-tp/?theme=tsi&verrou=1&modele=vide-tsi
```

1. outil vierge en CPGE TSI ; 2. compte rendu exemple complet (cellules PV, incertitudes, écarts normalisés) ;
3. squelette vide TSI (à copier pour préparer ses propres TP, voir « Préparer un squelette de TP »).

**SI et STI2D (lycée)**

```
https://hturpin-lab.github.io/compte-rendu-tp/?theme=si&verrou=1                      1re SI
https://hturpin-lab.github.io/compte-rendu-tp/?theme=si&niveau=tlesi&verrou=1         Tle SI
https://hturpin-lab.github.io/compte-rendu-tp/?theme=sti2d&verrou=1                   1re STI2D
https://hturpin-lab.github.io/compte-rendu-tp/?theme=si&verrou=1&modele=exemple-pv    exemple 1re SI
https://hturpin-lab.github.io/compte-rendu-tp/?theme=sti2d&verrou=1&modele=exemple-pv exemple 1re STI2D
```

Sans `verrou=1`, l'élève peut changer lui-même de thème et de niveau dans le panneau.

### Ce que change le niveau CPGE TSI

- **Consignes et exemples de prépa** (vocabulaire du GUM) : problématique avec modèle à valider ; hypothèses de
  modélisation explicites ; protocole justifié (appareils, calibres, résolution, nombre de mesures répétées) ;
  incertitudes-types de type A (s/√n) et de type B (Δ/√3, loi uniforme, Δ tiré de la notice) composées
  quadratiquement ; écriture x = (valeur ± u) unité avec 1 ou 2 chiffres significatifs pour u ; comparaison à une
  référence par l'**écart normalisé** z = |x_mes − x_réf| / √(u(x_mes)² + u(x_réf)²) (u(x_réf) vide = 0) avec le
  critère usuel z ≤ 2 ; validation et limites du modèle ; conclusion argumentée.
- **Tableau de mesures** : colonnes supplémentaires u(x_réf) (facultative), u(x_mes) et **écart normalisé z**,
  calculé dès que u(x_mes) est renseigné (l'écart relatif reste affiché). Aussi à l'impression et dans le Word.
- **Vérification** : 4 conseils en plus (une incertitude renseignée, un z calculé, hypothèses de modèle, conclusion
  qui se prononce sur la compatibilité), toujours non bloquants.
- **Tle SI** : consignes de 1re ; une case « Afficher les incertitudes » ajoute les colonnes u et z si on le souhaite.
- 1re SI et 1re STI2D : consignes identiques, seul le libellé change.

### Ajouter un nouveau thème

1. `css/style.css` : copier un bloc `:root[data-theme="…"] { --c-… }`, changer le code (ex. `bts`) et les couleurs.
   Respecter le contraste : texte blanc sur `--c-bandeau`, `--c-cartouche`, `--c-entete-tableau` et `--c-badge`
   ≥ 4,5:1, `--c-sur-accent` lisible sur `--c-accent`.
2. `js/rendu.js` : ajouter une ligne dans le tableau `CRTP.THEMES`
   (`{ code: 'bts', nom: 'BTS', detail: '…', apercu: ['#…', '#…', '#…'], niveau: '1si' }`).
3. `index.html` : ajouter le code à l'expression `/^(si|sti2d|tsi)$/` du petit script d'en-tête (évite un éclair de
   couleurs au chargement ; facultatif).

L'impression et le Word lisent automatiquement les couleurs du thème actif. Un nouveau niveau s'ajoute de même dans
`CRTP.NIVEAUX` (`js/rendu.js`).

### Contraste des couleurs (WCAG AA, calculé par les tests)

| Thème | Texte blanc sur bandeau | sur cartouche / en-têtes | n° de section | titres sur blanc |
|-------|------------------------|--------------------------|---------------|------------------|
| SI | 4,64:1 (#CD4800) | 7,82:1 (#8A3A00) | 5,54:1 (#8A3A00 sur #FFD54F) | 7,82:1 |
| STI2D | 5,13:1 (#2E7D32) | 9,82:1 (#1A4D2A) | 7,9:1 (#1F1A0E sur #F39C12) | 9,82:1 |
| CPGE TSI | 4,88:1 (#1A75BB) | 12,43:1 (#2C3447) | 5,22:1 (blanc sur #0F7E1F) | 6,61:1 (#17609A) |

Ajustement : le bandeau SI utilisait l'orange #E65100 (blanc dessus : 3,79:1, insuffisant) ; il est désormais en
**#CD4800**, même teinte assombrie (4,64:1). #E65100 reste utilisé pour les liserés et bordures. En TSI, le texte
coloré (titres, libellés) utilise #17609A, un bleu un peu plus foncé que #1A75BB.

## Utilisation par l'élève (5 étapes)

1. **Ouvrir l'outil** (lien donné par le professeur, ou `index.html`). Remplir le cartouche : titre, noms, classe, date, durée.
2. **Rédiger chaque partie** en lisant la consigne ; cliquer sur « Voir un exemple » en cas de doute.
3. **Ajouter les images** : bouton « Ajouter une image », glisser-déposer un fichier sur la partie, ou **coller une capture
   d'écran avec Ctrl+V** (cliquer d'abord dans la partie concernée). Écrire la légende de chaque figure (obligatoire) ;
   les figures sont numérotées automatiquement. Choisir la largeur 50 / 75 / 100 %.
4. **Remplir le tableau de mesures et les calculs** (partie 5). L'écart relatif se calcule tout seul :
   |valeur mesurée − valeur théorique| ÷ |valeur théorique| × 100. Surveiller le panneau **Vérification** à droite
   (il conseille, il ne bloque rien).
5. **Enregistrer et rendre** : « Enregistrer le projet (.json) » pour reprendre plus tard (maison / lycée), puis
   « Imprimer / PDF » (choisir « Enregistrer au format PDF ») ou « Télécharger en Word (.docx) ».

Astuce : le travail est aussi sauvegardé automatiquement dans le navigateur utilisé, mais **seul le fichier .json
permet de changer d'ordinateur**. Sur un poste partagé, cliquer sur « Nouveau » en partant.

## Utilisation par le professeur

### Préparer un squelette de TP
1. Ouvrir l'outil, cliquer sur « Nouveau » et remplir ce qui doit être donné aux élèves (titre du TP, problématique,
   matériel, lignes du tableau avec grandeurs, symboles, valeurs théoriques et unités, schémas…).
2. Cliquer sur « Enregistrer le projet (.json) ».
3. Renommer le fichier avec un nom simple, **sans espace ni accent** (lettres, chiffres, tirets), par exemple
   `tp5-moteur-cc.json`, et le placer dans le dossier `modeles/`.

Le fichier `modeles/vide-tp.json` est un squelette vide à copier ; `modeles/exemple-pv.json` est un compte rendu
exemple complet (TP cellules photovoltaïques, avec 2 schémas SVG dessinés dans `img/`). Pour la CPGE TSI :
`modeles/vide-tsi.json` et `modeles/exemple-pv-tsi.json` (même TP en version prépa, avec incertitudes et écarts
normalisés). Un modèle qui contient `"theme"` et `"niveau"` les impose à l'ouverture (sauf paramètres d'adresse).

### Distribuer par lien
Ajouter `?modele=` suivi du nom du fichier (sans `.json`) à l'adresse de l'outil :

```
https://<identifiant>.github.io/compte-rendu-tp/?modele=tp5-moteur-cc
https://<identifiant>.github.io/compte-rendu-tp/?modele=exemple-pv
```

Si l'élève rouvre le même lien plus tard sur le même navigateur, son travail en cours est rechargé (il n'est pas
écrasé par le modèle).

Sans publication en ligne, on peut aussi distribuer le fichier `.json` (ENT, clé USB) : l'élève l'ouvre avec
« Ouvrir un projet (.json) ».

> Remarque : quand `index.html` est ouvert directement depuis le disque (adresse `file://`), le navigateur interdit
> le chargement automatique par `?modele=` ; utiliser alors « Ouvrir un projet (.json) ». Tout le reste fonctionne.

## Confidentialité (RGPD)

- **Aucune donnée n'est envoyée sur internet** : pas de serveur, pas de compte, pas de statistiques, pas de police
  ou de bibliothèque chargée depuis un CDN. Tout le code est dans ce dossier.
- Le texte et les images restent **dans le navigateur de l'élève** (mémoire + `localStorage` de ce navigateur) et
  dans les fichiers qu'il enregistre lui-même (.json, .pdf, .docx).
- Si le `localStorage` est indisponible (navigation privée, blocage), l'outil fonctionne quand même : il faut alors
  penser à enregistrer le .json.
- GitHub Pages ne fait qu'héberger les fichiers de l'outil ; il ne reçoit pas le contenu des comptes rendus.

## Formats d'export

- **PDF** : bouton « Imprimer / PDF » puis destination « Enregistrer au format PDF ». Mise en page A4 avec cartouche,
  bandeaux de section aux couleurs du thème, numéros de page, figures jamais coupées. Cocher « Graphiques
  d'arrière-plan » si les bandeaux colorés n'apparaissent pas (Firefox).
- **Word (.docx)** : titres, cartouche, tableau de mesures, calculs, images et légendes, numéros de page.
  Généré dans le navigateur avec la bibliothèque [docx](https://github.com/dolanmiu/docx) (v9.8.1, licence MIT),
  copiée localement dans `lib/`.
- **OpenDocument (.odt)** : pas d'export direct. LibreOffice Writer ouvre le .docx sans problème ; pour obtenir un
  .odt, l'ouvrir dans LibreOffice puis *Fichier > Enregistrer sous… > Texte ODF (.odt)*.

## Publier sur GitHub Pages (pas à pas, sans connaître GitHub)

### 1. Créer un compte
1. Aller sur <https://github.com> et cliquer sur **Sign up**.
2. Choisir une adresse e-mail (de préférence professionnelle), un mot de passe et un **identifiant** (*username*),
   par exemple `hturpin-si`. Cet identifiant apparaîtra dans l'adresse du site.
3. Valider l'e-mail de confirmation. Le plan gratuit (*Free*) suffit.

### 2. Créer le dépôt
1. Une fois connecté, cliquer sur **+** (en haut à droite) puis **New repository**.
2. *Repository name* : `compte-rendu-tp`.
3. Cocher **Public** (obligatoire pour GitHub Pages gratuit).
4. Ne rien cocher d'autre (pas de README, pas de licence : ils sont déjà dans le dossier) et cliquer sur **Create repository**.

### 3. Téléverser les fichiers (glisser-déposer)
1. Sur la page du dépôt vide, cliquer sur le lien **uploading an existing file**
   (ou *Add file > Upload files*).
2. Ouvrir le dossier `compte-rendu-tp` sur l'ordinateur, **sélectionner tout son contenu** (fichiers et dossiers
   `css`, `js`, `lib`, `modeles`, `img`, ainsi que `index.html`, `README.md`, `LICENSE`, `.nojekyll`) et le glisser
   dans la page. Il faut glisser le **contenu** du dossier, pas le dossier lui-même, pour que `index.html` soit à la racine.
   - Le fichier `.nojekyll` est caché par défaut : sous Windows, *Affichage > Afficher > Éléments masqués* ;
     sous macOS, touches **Cmd + Maj + .** dans le Finder. Il est conseillé mais pas indispensable.
3. En bas, dans *Commit changes*, écrire un message (ex. « Première version ») et cliquer sur **Commit changes**.

### 4. Activer GitHub Pages
1. Dans le dépôt, cliquer sur **Settings** (onglet en haut), puis **Pages** (menu de gauche).
2. Section *Build and deployment* : *Source* = **Deploy from a branch**.
3. *Branch* : choisir **main** et le dossier **/ (root)**, puis **Save**.
4. Attendre 1 à 2 minutes et recharger la page : l'adresse du site s'affiche en haut :
   **`https://<identifiant>.github.io/compte-rendu-tp/`**

C'est cette adresse (éventuellement suivie de `?modele=…`) qu'on donne aux élèves, par exemple via l'ENT ou un QR code.

### 5. Mettre à jour

**Passage à la version 2 (thèmes, niveaux, CPGE TSI)** : re-téléverser (*Add file > Upload files*, en respectant
les dossiers) les fichiers suivants, qui remplacent les anciens :

- `index.html`, `README.md`
- `css/style.css`, `css/print.css`
- `js/app.js`, `js/sections.js`, `js/export-docx.js`, `js/rendu.js` (nouveau)
- `modeles/exemple-pv-tsi.json` (nouveau), `modeles/vide-tsi.json` (nouveau)

Inchangés : `lib/`, `img/`, `js/images.js`, `modeles/exemple-pv.json`, `modeles/vide-tp.json`, `LICENSE`.
Les projets .json déjà enregistrés par les élèves s'ouvrent toujours (ils prennent le thème et le niveau courants).

Mises à jour courantes :
- **Ajouter un modèle** : dans le dépôt, ouvrir le dossier `modeles`, *Add file > Upload files*, déposer le .json,
  *Commit changes*.
- **Modifier un fichier** : cliquer sur le fichier, puis sur le crayon (*Edit*), modifier, *Commit changes* ;
  ou le re-téléverser avec le même nom (il est remplacé).
- La mise en ligne prend 1 à 2 minutes. Si les élèves voient l'ancienne version, recharger avec **Ctrl+F5**.

### Variante en ligne de commande (git)
```bash
cd compte-rendu-tp
git init -b main                     # déjà fait si le dossier contient .git
git add .
git commit -m "Première version"
git remote add origin https://github.com/<identifiant>/compte-rendu-tp.git
git push -u origin main
# puis Settings > Pages > Deploy from a branch > main / (root)

# mises à jour suivantes :
git add .
git commit -m "Ajout du modèle TP5"
git push
```
(GitHub demande un *personal access token* à la place du mot de passe : *Settings > Developer settings >
Personal access tokens*, ou utiliser GitHub Desktop.)

## Arborescence

```
compte-rendu-tp/
├── index.html            page unique de l'outil
├── css/style.css         affichage écran : thèmes SI / STI2D / TSI, modes, densité
├── css/print.css         mise en page d'impression A4 (couleurs du thème actif)
├── js/sections.js        titres, consignes et exemples des parties (lycée et CPGE TSI)
├── js/rendu.js           thèmes, niveaux, panneau « Rendu », paramètres d'adresse
├── js/images.js          compression des images (canvas, 1600 px max, JPEG 0,85)
├── js/export-docx.js     export Word
├── js/app.js             application (état, vérification, sauvegarde, impression)
├── lib/docx.min.js       bibliothèque docx 9.8.1 (copie locale, MIT)
├── lib/LICENSE-docx.txt  licence de la bibliothèque docx
├── modeles/exemple-pv.json   compte rendu exemple complet (cellules PV)
├── modeles/vide-tp.json      squelette vide pour le professeur
├── modeles/exemple-pv-tsi.json  exemple CPGE TSI (incertitudes, écarts normalisés)
├── modeles/vide-tsi.json     squelette vide CPGE TSI
├── img/                  schémas SVG de l'exemple et icône
├── LICENSE               licence de l'outil (tous droits réservés, usage pédagogique gratuit)
└── .nojekyll             indique à GitHub Pages de publier les fichiers tels quels
```

## Navigateurs

Testé avec Chromium (ordinateur 1366×768, tablette, téléphone). Fonctionne avec les navigateurs récents
(Chrome, Edge, Firefox, Safari). Le collage d'images (Ctrl+V) dépend du navigateur et du système ; en cas de souci,
enregistrer la capture puis utiliser « Ajouter une image ».

## Licence

© 2026 Henri Turpin — tous droits réservés ; usage pédagogique gratuit de l'outil en ligne autorisé (voir `LICENSE`). Bibliothèque docx © Dolan Miu, licence MIT (voir `lib/LICENSE-docx.txt`).
