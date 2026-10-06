# Compte rendu de TP — 1re Sciences de l'Ingénieur

Outil web **statique** qui guide les élèves de 1re SI pour rédiger un compte rendu de TP complet et bien présenté :
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
exemple complet (TP cellules photovoltaïques, avec 2 schémas SVG dessinés dans `img/`).

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
  bandeaux de section, numéros de page, figures jamais coupées. Cocher « Graphiques d'arrière-plan » si les bandeaux
  orange n'apparaissent pas (Firefox).
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
├── css/style.css         affichage écran (charte SI orange/jaune)
├── css/print.css         mise en page d'impression A4
├── js/sections.js        titres, consignes et exemples des parties
├── js/images.js          compression des images (canvas, 1600 px max, JPEG 0,85)
├── js/export-docx.js     export Word
├── js/app.js             application (état, vérification, sauvegarde, impression)
├── lib/docx.min.js       bibliothèque docx 9.8.1 (copie locale, MIT)
├── lib/LICENSE-docx.txt  licence de la bibliothèque docx
├── modeles/exemple-pv.json   compte rendu exemple complet (cellules PV)
├── modeles/vide-tp.json      squelette vide pour le professeur
├── img/                  schémas SVG de l'exemple et icône
├── LICENSE               licence MIT de l'outil
└── .nojekyll             indique à GitHub Pages de publier les fichiers tels quels
```

## Navigateurs

Testé avec Chromium (ordinateur 1366×768, tablette, téléphone). Fonctionne avec les navigateurs récents
(Chrome, Edge, Firefox, Safari). Le collage d'images (Ctrl+V) dépend du navigateur et du système ; en cas de souci,
enregistrer la capture puis utiliser « Ajouter une image ».

## Licence

Outil sous licence MIT (voir `LICENSE`). Bibliothèque docx © Dolan Miu, licence MIT (voir `lib/LICENSE-docx.txt`).
