/* Compte rendu de TP — traitement des images (tout reste dans le navigateur). */
(function () {
  'use strict';

  var CRTP = (window.CRTP = window.CRTP || {});
  var MAX_COTE = 1600;           // px, plus grand côté conservé
  var PNG_PETIT = 300 * 1024;    // un PNG plus léger que ça et pas trop grand est gardé tel quel
  var TAILLE_MAX = 25 * 1024 * 1024;

  function lireDataURL(fichier) {
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onload = function () { ok(fr.result); };
      fr.onerror = function () { ko(new Error('Lecture du fichier impossible.')); };
      fr.readAsDataURL(fichier);
    });
  }

  function chargerImage(src) {
    return new Promise(function (ok, ko) {
      var img = new Image();
      img.onload = function () { ok(img); };
      img.onerror = function () { ko(new Error('Ce fichier n’est pas une image lisible.')); };
      img.src = src;
    });
  }

  /* Renvoie une dataURL compressée (JPEG 0,85, max 1600 px) ;
   * les petits PNG et les SVG sont gardés tels quels. */
  CRTP.compresserImage = async function (fichier) {
    if (!fichier || !/^image\//.test(fichier.type)) {
      throw new Error('Le fichier « ' + (fichier && fichier.name || '?') + ' » n’est pas une image.');
    }
    if (fichier.size > TAILLE_MAX) {
      throw new Error('Image trop lourde (plus de 25 Mo).');
    }
    var src = await lireDataURL(fichier);
    if (fichier.type === 'image/svg+xml') return src;
    var img = await chargerImage(src);
    var w = img.naturalWidth, h = img.naturalHeight;
    var echelle = Math.min(1, MAX_COTE / Math.max(w, h));
    if (fichier.type === 'image/png' && fichier.size <= PNG_PETIT && echelle === 1) return src;
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * echelle));
    c.height = Math.max(1, Math.round(h * echelle));
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';              // fond blanc (le JPEG n’a pas de transparence)
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var jpeg = c.toDataURL('image/jpeg', 0.85);
    // Une capture d’écran PNG reste parfois plus légère et plus nette en PNG.
    if (fichier.type === 'image/png') {
      var png = c.toDataURL('image/png');
      if (png.length < jpeg.length) return png;
    }
    return jpeg;
  };

  function base64VersOctets(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* Pour l’export Word : octets + type + dimensions naturelles.
   * Les SVG, GIF, WebP… sont convertis en PNG (rendu ×2 pour la netteté). */
  CRTP.imagePourDocx = async function (src) {
    var img = await chargerImage(src);
    var w = img.naturalWidth || 800, h = img.naturalHeight || 600;
    var m = /^data:image\/(png|jpeg|jpg);base64,(.*)$/i.exec(src);
    if (m) {
      return { type: m[1].toLowerCase() === 'png' ? 'png' : 'jpg', data: base64VersOctets(m[2]), largeur: w, hauteur: h };
    }
    var k = Math.min(2, 2400 / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.round(w * k);
    c.height = Math.round(h * k);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    var png = c.toDataURL('image/png');
    return { type: 'png', data: base64VersOctets(png.split(',')[1]), largeur: w, hauteur: h };
  };
})();
