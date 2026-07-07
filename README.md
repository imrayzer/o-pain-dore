# Ô Pain Doré — Site web

Site vitrine de la boulangerie-pâtisserie **Ô Pain Doré** (Chez Fab & Fat), Rabastens (81).
Site statique : `index.html` + `css/style.css` + `js/main.js`. Aucune installation requise.

---

## ▶️ Voir le site en local

Ouvre simplement `index.html` dans un navigateur, **ou** lance un petit serveur :

```bash
npx serve .
```

---

## 🎨 1. Ajouter le logo

Dépose ton logo ici : **`assets/logo.png`**

- Ton logo actuel (doré sur fond noir) fonctionne **tel quel** : au chargement, le site
  **détoure automatiquement le fond noir** (il devient transparent), il ne reste que le doré.
- Idéalement fournis-le en **haute résolution** (largeur ≥ 1000 px), fond noir ou transparent.
- Tant qu'aucun fichier n'est présent, le site affiche une version texte élégante (repli).

Le logo apparaît alors dans le **hero** (haut de page) et dans le **pied de page**.

---

## 📸 2. Ajouter tes photos (galerie + hero)

1. Dépose tes photos dans `assets/` (ex. `croissant.jpg`, `tarte.jpg`…).
2. Dis-moi lesquelles vont où, ou remplace dans `index.html` chaque bloc :

```html
<div class="gallery-placeholder" data-emoji="🥐" style="...">
  <span class="gallery-name">Le croissant<br />pur beurre</span>
</div>
```

par une image :

```html
<img src="assets/croissant.jpg" alt="Croissant pur beurre" />
```

Format conseillé : **JPG/WebP**, ~1200 px de large, < 400 Ko chacune.

---

## 🕒 3. Horaires (déjà renseignés)

- Lundi : **fermé**
- Mardi → Samedi : **7h–13h30 · 15h30–19h**
- Dimanche : **7h–13h**

À modifier dans `index.html`, section « Horaires ».

---

## 📝 4. Formulaire de commande / devis

Aujourd'hui, à l'envoi, le formulaire **ouvre l'application e-mail** du client avec la
demande pré-remplie, adressée à `maxdeleris@orange.fr`
(modifiable dans `js/main.js` → variable `BAKERY_EMAIL`).

**Recommandé pour recevoir les demandes automatiquement (sans ouvrir l'e-mail du client) :**
créer un compte gratuit **[Formspree](https://formspree.io)** (ou Web3Forms), puis me donner
l'URL du formulaire — je branche l'envoi direct en 2 minutes. Les demandes arrivent alors
directement dans ta boîte mail.

---

## ⭐ 5. Avis Google en direct

Les avis affichés sont pour l'instant des **exemples de mise en page**. Pour afficher tes
**vrais avis Google, mis à jour automatiquement**, deux options :

- **Widget clé en main (le plus simple)** : [Elfsight](https://elfsight.com/google-reviews-widget/)
  ou [Trustindex](https://www.trustindex.io) — tu crées le widget avec ta fiche Google, on colle
  un petit code. Gratuit pour une version de base.
- **Officiel (Google Places API)** : nécessite une clé API Google Maps ; affichage 100 % maison
  mais un peu plus technique.

Donne-moi le **lien de ta fiche Google Business** et l'option choisie, je m'en occupe.

---

## 🚀 6. Mettre en ligne

Options gratuites et simples :

- **Netlify** ou **Vercel** : glisser-déposer le dossier, en ligne en 1 minute (formulaire
  Netlify Forms inclus gratuitement).
- **GitHub Pages**.
- Ton hébergeur actuel via FTP.

On pourra aussi brancher un **nom de domaine** type `opaindore.fr`.

---

## ✅ À me fournir pour finaliser

- [ ] Le fichier **logo** (haute résolution) → `assets/logo.png`
- [ ] Tes **photos** de produits/boutique
- [ ] **Adresse exacte** + **téléphone** (placeholders à remplacer)
- [ ] Lien **fiche Google Business** (pour les avis)
- [ ] Choix pour le **formulaire** (mail simple ou Formspree)
