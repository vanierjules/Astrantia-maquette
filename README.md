# Astrantia — site e-commerce

Maquette complète du site d'Astrantia — décoration, mobilier & cadeaux, 40c allée des négociants, 01340 Attignat.
HTML5 + CSS3 + JavaScript vanilla. **Aucune dépendance, aucun build** : ouvrez `index.html` et tout fonctionne.

## Structure

```
astrantia/
├── index.html          Accueil : hero, univers, sélection, marques, services, boutique
├── boutique.html       Catalogue : recherche, filtres (univers/catégorie/marque/matière/prix), tri
├── produit.html        Fiche dynamique — produit.html?id=chaise-luxembourg
├── collections.html    Les six univers, en pages éditoriales
├── a-propos.html       La maison, l'accompagnement, l'éthique, mentions légales
├── contact.html        Formulaire validé + coordonnées réelles
├── panier.html         Panier, code promo, retrait boutique, commande simulée
├── robots.txt / sitemap.xml
├── css/style.css       Design system complet (1 230 lignes, commenté)
├── js/products.js      LE CATALOGUE — 130 produits, 31 marques
├── js/script.js        Toute la logique + le système d'images
└── images/             hero/ produits/ collections/ showroom/ + logo.png
```

## Vos photos s'affichent toutes seules

Chaque visuel tente de charger, dans l'ordre :

1. **votre photo** — `images/produits/<identifiant>.jpg`
2. la photo de démonstration (banque libre de droit, déjà en place)
3. le visuel CSS de secours

Autrement dit : **déposez `images/produits/chaise-luxembourg.jpg` et la photo apparaît partout** — grille, fiche produit, panier, produits similaires. Aucun code à toucher, aucune liste à tenir à jour.

- Vues supplémentaires d'une fiche : `<identifiant>-2.jpg`, `-3.jpg`, `-4.jpg`
- Ambiances : `images/hero/accueil.jpg`, `images/collections/mobilier.jpg`, `images/showroom/boutique.jpg`…
- Logo : `images/logo.png` (à défaut, le logo actuel d'astrantia.fr est utilisé, puis le logo texte)

L'identifiant d'un produit est son nom en minuscules, sans accent, mots reliés par des tirets. Il est visible dans l'URL de sa fiche.

## Le catalogue

Tout part de `js/products.js`. Un produit = une ligne :

```js
["Modèle", 189, "Fermob", "Aluminium laqué", "L 52 × P 56 × H 88 cm", "Métal"]
```

Identifiant, référence, description, coloris, photo et présence dans les filtres sont générés automatiquement. Les filtres de la boutique (6 univers, 19 catégories, 31 marques, 8 familles de matière) se construisent à partir des données : ajouter une marque suffit à créer sa case.

## Fonctionnalités

- Recherche multi-termes insensible aux accents (nom, marque, catégorie, matière, référence)
- Filtres cumulables avec compteurs et étiquettes supprimables · 6 tris dont « par marque »
- URL partageable : `boutique.html?marque=Fermob&collection=Extérieur&tri=prix-asc`
- Panier persistant, codes `ASTRANTIA10` / `BIENVENUE5`, livraison offerte dès 500 €, retrait gratuit en boutique
- Fiches produits dynamiques, galerie 4 vues, pièces assorties
- Bandeau des marques distribuées (logos repris d'astrantia.fr)
- SEO complet, responsive mobile/tablette/desktop, accessibilité clavier et ARIA

## Avant la mise en ligne

- Remplacer les photos de démonstration par les visuels de la boutique
- Ajouter `images/logo.png`
- Vérifier les horaires exacts et compléter les mentions légales si besoin
- Le formulaire de contact et la newsletter sont simulés : les brancher sur un service type Formspree ou Brevo
- Le paiement est simulé : brancher Stripe ou PayPal pour vendre réellement

## Vérifications effectuées

0 lien mort · 130 produits sans doublon d'identifiant · structure HTML équilibrée sur les 7 pages · CSS et JS sans erreur de syntaxe · parcours testés automatiquement (recherche, filtres, tri, pagination, panier, promo, commande, validation du formulaire) · cascade d'images testée aux trois niveaux.
