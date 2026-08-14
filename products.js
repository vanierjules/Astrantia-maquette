/* ==========================================================================
   ASTRANTIA — Catalogue central
   Décoration, mobilier & cadeaux — 40c allée des négociants, 01340 Attignat
   --------------------------------------------------------------------------
   Toute la boutique (grille, recherche, filtres, tri, fiches produits,
   produits similaires, panier) se nourrit UNIQUEMENT de ce fichier.

   POUR AJOUTER UN PRODUIT :
   ajoutez une ligne dans le tableau `items` de la famille concernée :
     ["Modèle", prix, "Marque", "Matières", "Dimensions", "Famille de matière"]
   L'identifiant, la référence, la description, les coloris et le visuel sont
   générés automatiquement.

   POUR METTRE VOTRE PROPRE PHOTO :
   déposez un fichier images/produits/<identifiant>.jpg
   (exemple : images/produits/fauteuil-nubes.jpg).
   Elle remplace automatiquement la photo de démonstration, sans toucher au code.

   POUR AJOUTER UNE FAMILLE :
   ajoutez un bloc dans CATALOG. Les filtres de la boutique (catégories,
   univers, marques, matières) se construisent à partir des données.
   ========================================================================== */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Photothèque de démonstration                                     */
  /*    Photos libres de droit (Unsplash, usage commercial autorisé).    */
  /*    Elles ne s'affichent que tant qu'aucune photo maison n'existe    */
  /*    dans images/produits/.                                           */
  /* ------------------------------------------------------------------ */
  var U = "https://images.unsplash.com/photo-";
  var OPT = "?auto=format&fit=crop&w=900&q=70";

  var POOLS = {
    seating: ["1580480055273-228ff5388ef8", "1567538096630-e0c55bd6374c",
              "1601366533287-5ee4c763ae4e", "1611967164521-abae8fba4668",
              "1617364852223-75f57e78dc96", "1586158291800-2665f07bba79",
              "1605702098590-d552a98dc93d", "1579656592043-a20e25a4aa4b",
              "1723804685588-b8e95b2044f3", "1718049719688-764249c6800d",
              "1631700679578-621a258507bb", "1586023492125-27b2c045efd7",
              "1634712282287-14ed57b9cc89", "1634148737510-727f137375e0"],
    tables:  ["1615920606214-6428b3324c74", "1599327286062-40b0a7f2b305",
              "1554295405-abb8fd54f153", "1758977403341-0104135995af",
              "1620954799930-76530e07ea5b", "1567156444932-b578b7a1afe4",
              "1758977404039-6e834be8eca8", "1636138388621-258a72ecb07e",
              "1568347760450-1ef7874c5f5f", "1615803796379-b4cda8e9c09c"],
    lamps:   ["1565814329452-e1efa11c5b89", "1540932239986-30128078f3c5",
              "1636368208791-17b81ed832d2", "1513506003901-1e6a229e2d15",
              "1592622515232-6e3e2a0d3d9a", "1590003689662-0773d48b6417",
              "1559924508-1461423083c5", "1512418408532-5445158b1445",
              "1568563094147-ae8eb3a8a3c0", "1560851668-e96ae9cfe945",
              "1568482224714-7843360d588a", "1604610728890-6f4b631ed081",
              "1553797794-4c4d2c55dbfb", "1578678809569-1a8ead9cb802"],
    decor:   ["1590938401285-eba3a552ece4", "1587740025983-5ad92826ae4f",
              "1605239435870-67df4c54a0b3", "1694830470387-2e0f234ecaf7",
              "1614635824409-75be312e41e9", "1634148737510-727f137375e0",
              "1723750290151-164cb19ebab7", "1567156444932-b578b7a1afe4"],
    outdoor: ["1597088136953-db42ae225804", "1719324923613-ff0884b031ed",
              "1711098256574-7b497260cdc9", "1782073425027-e099f12e3433",
              "1762608675427-09ac2dbd1540", "1759471606534-cbd4aca4d4cb",
              "1783260661056-a19835b6df98", "1769168375647-843e2e822035",
              "1781107882100-82cb2fd8cbfe", "1765097732474-973a92d6fb4c",
              "1777370537254-927d534822e7"],
    interior:["1714872245785-674ae3038d21", "1636138388621-258a72ecb07e",
              "1723750290151-164cb19ebab7", "1568347760450-1ef7874c5f5f",
              "1615803796379-b4cda8e9c09c"]
  };

  function photo(pool, i) {
    var list = POOLS[pool] || POOLS.interior;
    return U + list[i % list.length] + OPT;
  }

  // Visuels d'ambiance utilisés dans les pages (hero, univers, showroom)
  var SCENES = {
    hero:       photo("interior", 0),
    showroom:   photo("interior", 3),
    atelier:    photo("interior", 4),
    mobilier:   photo("seating", 3),
    luminaires: photo("lamps", 1),
    decoration: photo("decor", 0),
    table:      photo("decor", 3),
    exterieur:  photo("outdoor", 1),
    cadeaux:    photo("decor", 4)
  };

  /* ------------------------------------------------------------------ */
  /* 2. Source du catalogue                                              */
  /* ------------------------------------------------------------------ */
  var CATALOG = [
    /* ============================ MOBILIER ============================ */
    {
      category: "Canapés & méridiennes", collection: "Mobilier", icon: "sofa",
      pool: "seating", prefix: "Canapé",
      items: [
        ["Nubes", 3290, "Home Spirit", "Lin lavé, structure hêtre massif", "L 224 × P 98 × H 78 cm", "Textile"],
        ["Malmö", 2890, "Ethnicraft", "Coton épais, chêne massif FSC", "L 210 × P 94 × H 76 cm", "Textile"],
        ["Otello", 3980, "Home Spirit", "Cuir pleine fleur pigmenté", "L 236 × P 100 × H 74 cm", "Cuir"],
        ["Sereno", 2490, "Home Spirit", "Velours de coton déhoussable", "L 198 × P 92 × H 80 cm", "Textile"],
        ["Nordic", 3450, "Ethnicraft", "Bouclette écrue, piètement teck", "L 228 × P 96 × H 75 cm", "Textile"],
        ["Méridienne Lova", 1690, "Home Spirit", "Lin naturel, dossier bas", "L 165 × P 78 × H 72 cm", "Textile"],
        ["Pouf Dune", 390, "Roolf Living", "Toile outdoor déperlante", "Ø 90 × H 42 cm", "Textile"]
      ]
    },
    {
      category: "Fauteuils & assises", collection: "Mobilier", icon: "chair",
      pool: "seating", prefix: "Fauteuil",
      items: [
        ["Kabi", 890, "Ondarreta", "Frêne massif, assise tissu", "L 74 × P 78 × H 76 cm", "Bois"],
        ["Nube", 1290, "Ondarreta", "Laine bouclée, acier laqué", "L 80 × P 82 × H 72 cm", "Textile"],
        ["Ovni", 1490, "New Works", "Cuir grainé, structure noyer", "L 84 × P 86 × H 74 cm", "Cuir"],
        ["Bau", 740, "Bosc", "Chêne massif français, cannage", "L 68 × P 72 × H 78 cm", "Rotin"],
        ["Vela", 980, "Ondarreta", "Velours côtelé, laiton brossé", "L 76 × P 80 × H 75 cm", "Textile"],
        ["Sacco Lounge", 420, "Roolf Living", "Toile technique indoor/outdoor", "L 90 × P 100 × H 80 cm", "Textile"],
        ["Repose-pied Kabi", 320, "Ondarreta", "Frêne massif, assise tissu", "L 52 × P 48 × H 40 cm", "Bois"]
      ]
    },
    {
      category: "Chaises & tabourets", collection: "Mobilier", icon: "chair",
      pool: "seating", prefix: "",
      items: [
        ["Chaise Bai", 290, "Ondarreta", "Hêtre massif, assise contreplaqué", "L 46 × P 52 × H 82 cm", "Bois"],
        ["Chaise Lund", 340, "Ondarreta", "Frêne teinté, assise paille", "L 45 × P 50 × H 80 cm", "Bois"],
        ["Chaise Beech", 420, "Ethnicraft", "Chêne massif FSC, dossier courbé", "L 48 × P 54 × H 81 cm", "Bois"],
        ["Chaise Nolita", 260, "Ondarreta", "Acier époxy, usage intérieur/extérieur", "L 44 × P 48 × H 84 cm", "Métal"],
        ["Tabouret Hoop", 210, "Bosc", "Hêtre massif français", "Ø 34 × H 45 cm", "Bois"],
        ["Tabouret de bar Kimi", 380, "Ondarreta", "Frêne, repose-pied acier noir", "Ø 38 × H 76 cm", "Bois"],
        ["Banc Oak", 690, "Ethnicraft", "Chêne massif huilé", "L 160 × P 36 × H 45 cm", "Bois"]
      ]
    },
    {
      category: "Tables & bureaux", collection: "Mobilier", icon: "table",
      pool: "tables", prefix: "",
      items: [
        ["Table Bok", 2190, "Ethnicraft", "Chêne massif FSC, assemblage tourillon", "L 220 × P 100 × H 76 cm", "Bois"],
        ["Table Osso", 1890, "Ethnicraft", "Chêne massif, piètement ajouré", "L 200 × P 95 × H 75 cm", "Bois"],
        ["Table Guéridon Lyon", 640, "Drugeot Manufacture", "Chêne massif français, plateau rond", "Ø 110 × H 74 cm", "Bois"],
        ["Table basse Loti", 590, "Drugeot Manufacture", "Chêne massif, finition huilée", "L 110 × P 60 × H 38 cm", "Bois"],
        ["Table basse Stone", 890, "Ethnicraft", "Travertin naturel", "Ø 90 × H 34 cm", "Pierre"],
        ["Bureau Ludo", 1140, "Drugeot Manufacture", "Chêne massif, tiroir suspendu", "L 140 × P 65 × H 75 cm", "Bois"],
        ["Console Tenon", 780, "Drugeot Manufacture", "Chêne massif, assemblage apparent", "L 130 × P 36 × H 80 cm", "Bois"]
      ]
    },
    {
      category: "Rangements & bibliothèques", collection: "Mobilier", icon: "storage",
      pool: "tables", prefix: "",
      items: [
        ["Buffet Ligna", 1890, "Ethnicraft", "Chêne massif FSC, quatre portes", "L 190 × P 45 × H 78 cm", "Bois"],
        ["Bibliothèque Nordic", 2290, "Ethnicraft", "Chêne massif, modules empilables", "L 200 × P 38 × H 200 cm", "Bois"],
        ["Vaisselier Anjou", 1690, "Drugeot Manufacture", "Chêne massif, verre cannelé", "L 110 × P 42 × H 185 cm", "Verre"],
        ["Meuble TV Loti", 990, "Drugeot Manufacture", "Chêne massif, deux tiroirs", "L 160 × P 40 × H 46 cm", "Bois"],
        ["Commode Whitebird", 1290, "Ethnicraft", "Chêne massif, six tiroirs", "L 120 × P 45 × H 80 cm", "Bois"],
        ["Chevet Tenon", 390, "Drugeot Manufacture", "Chêne massif français", "L 45 × P 38 × H 52 cm", "Bois"],
        ["Étagère murale Line", 240, "Bosc", "Hêtre massif, fixation invisible", "L 90 × P 22 × H 4 cm", "Bois"]
      ]
    },

    /* =========================== LUMINAIRES =========================== */
    {
      category: "Suspensions", collection: "Luminaires", icon: "lamp",
      pool: "lamps", prefix: "Suspension",
      items: [
        ["Kila", 490, "Luxcambra", "Laiton brossé, verre opalin", "Ø 40 × H 30 cm", "Métal"],
        ["Owl Paper", 260, "Owl Paperlamp", "Papier plissé, montage à la main", "Ø 55 × H 45 cm", "Textile"],
        ["Karman", 380, "New Works", "Aluminium laqué mat", "Ø 34 × H 26 cm", "Métal"],
        ["Terra", 320, "Monochromic", "Grès émaillé tourné main", "Ø 30 × H 28 cm", "Céramique"],
        ["Halo Trio", 890, "Luxcambra", "Trois modules laiton, câblage textile", "L 120 × H 40 cm", "Métal"],
        ["Ribbon", 440, "Owl Paperlamp", "Papier washi, structure bambou", "Ø 60 × H 60 cm", "Textile"],
        ["Cane", 290, "Monochromic", "Rotin tressé, douille noire", "Ø 45 × H 38 cm", "Rotin"]
      ]
    },
    {
      category: "Lampes à poser", collection: "Luminaires", icon: "lamp",
      pool: "lamps", prefix: "Lampe",
      items: [
        ["Bola", 340, "Luxcambra", "Albâtre naturel, socle laiton", "Ø 26 × H 36 cm", "Pierre"],
        ["Atelier", 280, "Monochromic", "Acier patiné, abat-jour lin", "Ø 30 × H 46 cm", "Métal"],
        ["Galet", 390, "Monochromic", "Céramique émaillée, coton écru", "Ø 28 × H 42 cm", "Céramique"],
        ["Portable Ino", 190, "Fermob", "Lampe sans fil rechargeable, aluminium", "Ø 12 × H 26 cm", "Métal"],
        ["Balad", 149, "Fermob", "Lampe nomade LED, usage extérieur", "Ø 19 × H 25 cm", "Métal"],
        ["Lampadaire Ligne", 620, "Luxcambra", "Acier noir, diffuseur coton", "Ø 40 × H 160 cm", "Métal"],
        ["Lampe de bureau Kn", 210, "Kngb", "Métal laqué, bras articulé", "L 45 × H 48 cm", "Métal"]
      ]
    },
    {
      category: "Appliques & éclairage extérieur", collection: "Luminaires", icon: "lamp",
      pool: "lamps", prefix: "",
      items: [
        ["Applique Onde", 240, "Luxcambra", "Laiton massif, verre dépoli", "L 24 × P 14 × H 22 cm", "Verre"],
        ["Applique Cane", 190, "Monochromic", "Rotin tressé, métal noir", "L 28 × P 16 × H 26 cm", "Rotin"],
        ["Borne Aubanne", 690, "Roger Pradier", "Aluminium moulé, verre trempé, IP44", "Ø 18 × H 80 cm", "Métal"],
        ["Applique Bourgogne", 490, "Roger Pradier", "Aluminium, fabrication française", "L 22 × P 24 × H 36 cm", "Métal"],
        ["Lanterne Montana", 560, "Roger Pradier", "Aluminium, verre clair, IP44", "L 26 × P 26 × H 44 cm", "Verre"],
        ["Guirlande Solis", 120, "Fermob", "Guirlande LED extérieure 10 m", "L 1000 cm", "Métal"]
      ]
    },

    /* =========================== DÉCORATION =========================== */
    {
      category: "Objets & sculptures", collection: "Décoration", icon: "decor",
      pool: "decor", prefix: "",
      items: [
        ["Vase Terra", 89, "Monochromic", "Grès émaillé tourné main", "Ø 20 × H 32 cm", "Céramique"],
        ["Vase Onde", 74, "Monochromic", "Céramique mate, pièce unique", "Ø 16 × H 28 cm", "Céramique"],
        ["Sculpture Rabbit", 320, "Qeeboo", "Polyéthylène recyclable, design italien", "L 34 × P 26 × H 80 cm", "Métal"],
        ["Photophore Ambre", 42, "Ichendorf Milano", "Verre soufflé bouche", "Ø 12 × H 14 cm", "Verre"],
        ["Coupe Travertin", 130, "Art Maker", "Travertin massif taillé main", "Ø 28 × H 8 cm", "Pierre"],
        ["Plateau Chêne", 78, "Drugeot Manufacture", "Chêne massif français huilé", "L 46 × P 30 × H 4 cm", "Bois"],
        ["Corbeille Osier", 68, "Haomy", "Osier tressé main", "Ø 40 × H 34 cm", "Rotin"],
        ["Serre-livres Onyx", 145, "Art Maker", "Onyx naturel poli", "L 12 × P 10 × H 16 cm", "Pierre"]
      ]
    },
    {
      category: "Miroirs & cadres", collection: "Décoration", icon: "mirror",
      pool: "decor", prefix: "Miroir",
      items: [
        ["Halo", 320, "Peridesign", "Laiton brossé, verre biseauté", "Ø 80 cm", "Métal"],
        ["Arche", 420, "Drugeot Manufacture", "Chêne massif cintré", "L 70 × H 150 cm", "Bois"],
        ["Ligne", 260, "Peridesign", "Acier noir, format rectangulaire", "L 60 × H 120 cm", "Métal"],
        ["Cane", 190, "Haomy", "Rotin tressé, verre clair", "Ø 70 cm", "Rotin"],
        ["Ovale", 280, "Drugeot Manufacture", "Frêne clair, suspension cuir", "L 55 × H 90 cm", "Bois"],
        ["Bronze", 480, "Peridesign", "Verre bronze, cadre laiton", "L 90 × H 140 cm", "Verre"]
      ]
    },
    {
      category: "Textiles & tapis", collection: "Décoration", icon: "rug",
      pool: "decor", prefix: "",
      items: [
        ["Plaid Alpaga", 180, "Haomy", "Alpaga et laine mérinos", "130 × 190 cm", "Textile"],
        ["Coussin Lin lavé", 54, "Haomy", "Lin lavé, garnissage plumes", "50 × 50 cm", "Textile"],
        ["Coussin Chevron", 62, "Haomy", "Laine tissée main", "45 × 65 cm", "Textile"],
        ["Tapis Berbère", 690, "Haomy", "Laine vierge, nouage traditionnel", "200 × 290 cm", "Textile"],
        ["Tapis Jute", 340, "Haomy", "Jute et coton tissés", "170 × 240 cm", "Textile"],
        ["Rideau Voile", 120, "Au Fil des Couleurs", "Voile de lin, œillets laiton", "140 × 280 cm", "Textile"],
        ["Plaid Bouclette", 145, "Haomy", "Laine bouclée écrue", "140 × 200 cm", "Textile"]
      ]
    },
    {
      category: "Papiers peints & murs", collection: "Décoration", icon: "room",
      pool: "interior", prefix: "Papier peint",
      items: [
        ["Jardin d'Hiver", 190, "Au Fil des Couleurs", "Intissé, impression numérique", "Lé de 68,5 cm × 10 m", "Textile"],
        ["Feuillage", 165, "Au Fil des Couleurs", "Intissé mat, pose encollage mur", "Lé de 68,5 cm × 10 m", "Textile"],
        ["Uni Craie", 120, "Au Fil des Couleurs", "Intissé texturé, teinte unie", "Lé de 68,5 cm × 10 m", "Textile"],
        ["Panoramique Bosquet", 420, "Au Fil des Couleurs", "Panoramique 4 lés, sur mesure", "280 × 300 cm", "Textile"],
        ["Rayure Lin", 148, "Au Fil des Couleurs", "Intissé effet tissé", "Lé de 68,5 cm × 10 m", "Textile"],
        ["Nuancier Peinture", 8, "Au Fil des Couleurs", "Échantillon teinte, 12 × 12 cm", "12 × 12 cm", "Textile"]
      ]
    },

    /* ========================= ART DE LA TABLE ======================== */
    {
      category: "Verrerie & vaisselle", collection: "Art de la table", icon: "decor",
      pool: "decor", prefix: "",
      items: [
        ["Verre Bilia", 28, "Ichendorf Milano", "Verre borosilicate soufflé bouche", "Ø 8 × H 10 cm", "Verre"],
        ["Carafe Herbarium", 74, "Ichendorf Milano", "Verre soufflé, décor botanique", "Ø 10 × H 26 cm", "Verre"],
        ["Assiette Grès", 24, "Monochromic", "Grès émaillé, passe au lave-vaisselle", "Ø 27 cm", "Céramique"],
        ["Bol Grès", 19, "Monochromic", "Grès émaillé mat", "Ø 16 × H 8 cm", "Céramique"],
        ["Pichet Onde", 58, "Monochromic", "Céramique tournée main", "Ø 12 × H 22 cm", "Céramique"],
        ["Set de table Lin", 22, "Haomy", "Lin lavé, ourlet main", "35 × 48 cm", "Textile"],
        ["Planche Chêne", 64, "Drugeot Manufacture", "Chêne massif français", "L 40 × P 22 × H 2 cm", "Bois"]
      ]
    },
    {
      category: "Bougies & senteurs", collection: "Art de la table", icon: "decor",
      pool: "decor", prefix: "",
      items: [
        ["Bougie flambeau", 12, "Ester & Erik", "Cire teintée dans la masse, Danemark", "Ø 2,2 × H 32 cm", "Textile"],
        ["Coffret 12 flambeaux", 118, "Ester & Erik", "Douze bougies, coffret cadeau", "Ø 2,2 × H 32 cm", "Textile"],
        ["Bougie parfumée Figuier", 38, "Les Bougies de Léa", "Cire végétale, fabrication artisanale", "Ø 8 × H 9 cm", "Céramique"],
        ["Bougie parfumée Cèdre", 38, "Les Bougies de Léa", "Cire végétale, mèche coton", "Ø 8 × H 9 cm", "Céramique"],
        ["Photophore Marrakech", 26, "Les Bougies de Marrakech", "Verre soufflé et métal ciselé", "Ø 10 × H 12 cm", "Verre"],
        ["Bougie sculptée", 22, "Les Bougies de Marrakech", "Cire sculptée à la main", "Ø 9 × H 14 cm", "Textile"],
        ["Bougeoir Laiton", 48, "Peridesign", "Laiton massif tourné", "Ø 9 × H 22 cm", "Métal"]
      ]
    },

    /* ============================ EXTÉRIEUR =========================== */
    {
      category: "Mobilier de jardin", collection: "Extérieur", icon: "outdoor",
      pool: "outdoor", prefix: "",
      items: [
        ["Chaise Luxembourg", 189, "Fermob", "Aluminium laqué, 24 coloris, fab. française", "L 52 × P 56 × H 88 cm", "Métal"],
        ["Table Bistro pliante", 219, "Fermob", "Acier laqué, pliante, fab. française", "L 71 × P 71 × H 74 cm", "Métal"],
        ["Fauteuil Bas Luxembourg", 289, "Fermob", "Aluminium laqué mat", "L 66 × P 82 × H 82 cm", "Métal"],
        ["Table Ellipse", 1290, "Les Jardins", "Teck massif FSC, plateau ovale", "L 220 × P 100 × H 75 cm", "Bois"],
        ["Bain de soleil Hegoa", 980, "Les Jardins", "Teck et toile Batyline", "L 200 × P 70 × H 38 cm", "Textile"],
        ["Canapé Ninix", 3480, "Royal Botania", "Inox brossé, coussins Sunbrella", "L 220 × P 90 × H 68 cm", "Métal"],
        ["Fauteuil Alura", 890, "Royal Botania", "Aluminium et corde tressée", "L 70 × P 76 × H 74 cm", "Métal"],
        ["Pouf outdoor Dune", 340, "Roolf Living", "Toile technique déperlante", "Ø 80 × H 40 cm", "Textile"]
      ]
    },
    {
      category: "Parasols & ombrage", collection: "Extérieur", icon: "outdoor",
      pool: "outdoor", prefix: "Parasol",
      items: [
        ["Alu-Smart", 490, "Glatz", "Toile polyester, mât aluminium", "Ø 250 cm", "Textile"],
        ["Sombrano", 1690, "Glatz", "Parasol déporté, rotation 360°", "Ø 350 cm", "Textile"],
        ["Fortero", 1290, "Glatz", "Toile acrylique teintée masse", "Ø 300 cm", "Textile"],
        ["Piètement dalle", 290, "Glatz", "Dalles béton et acier", "L 50 × P 50 cm", "Pierre"],
        ["Voile d'ombrage", 240, "Les Jardins", "Toile technique anti-UV", "300 × 400 cm", "Textile"]
      ]
    },
    {
      category: "Braseros & plancha", collection: "Extérieur", icon: "outdoor",
      pool: "outdoor", prefix: "",
      items: [
        ["Brasero Ofyr Classic 85", 1690, "Ofyr", "Acier corten, plancha intégrée", "Ø 85 × H 100 cm", "Métal"],
        ["Ofyr Island 85", 2890, "Ofyr", "Acier corten et bois, plan de travail", "L 140 × P 85 × H 100 cm", "Métal"],
        ["Brasero Bowl", 390, "Hofats", "Acier inoxydable, design allemand", "Ø 60 × H 35 cm", "Métal"],
        ["Cône de feu", 290, "Hofats", "Acier corten, allumage rapide", "Ø 45 × H 55 cm", "Métal"],
        ["Barbecue The Bastard Large", 890, "The Bastard", "Céramique kamado, couvercle fonte", "Ø 57 × H 118 cm", "Céramique"],
        ["Housse Bastard", 120, "The Bastard", "Toile technique déperlante", "Ø 60 × H 120 cm", "Textile"],
        ["Table à feu Gravity", 640, "Hofats", "Acier laqué, brasero central", "Ø 90 × H 45 cm", "Métal"]
      ]
    },

    /* ============================= CADEAUX ============================ */
    {
      category: "Petits cadeaux", collection: "Cadeaux", icon: "decor",
      pool: "decor", prefix: "",
      items: [
        ["Hoptimist Bumble", 32, "Hoptimist", "Bois et plastique ABS, design danois", "Ø 6 × H 9 cm", "Bois"],
        ["Hoptimist Bimble", 26, "Hoptimist", "Figurine à ressort, coloris assortis", "Ø 5 × H 7 cm", "Bois"],
        ["Carnet Kn", 18, "Kngb", "Papier recyclé, couverture toilée", "A5", "Textile"],
        ["Porte-clés Laiton", 24, "Peridesign", "Laiton massif gravé", "L 6 cm", "Métal"],
        ["Mug Grès", 22, "Monochromic", "Grès émaillé, pièce artisanale", "Ø 8 × H 10 cm", "Céramique"],
        ["Coffret bougies", 46, "Les Bougies de Léa", "Deux bougies parfumées, coffret", "L 20 × P 10 cm", "Céramique"],
        ["Carte cadeau Astrantia", 50, "Astrantia", "Valable un an en boutique", "—", "Textile"],
        ["Sac Mon Dada", 68, "Mon Dada", "Coton recyclé, sérigraphie main", "L 38 × H 42 cm", "Textile"]
      ]
    },
    {
      category: "Jeux & univers enfant", collection: "Cadeaux", icon: "decor",
      pool: "decor", prefix: "",
      items: [
        ["Lampe Rabbit S", 190, "Qeeboo", "Polyéthylène, éclairage LED", "L 24 × P 18 × H 44 cm", "Métal"],
        ["Tabouret Ribbon", 240, "Qeeboo", "Polyéthylène recyclable", "Ø 34 × H 42 cm", "Métal"],
        ["Jeu de quilles bois", 42, "Bosc", "Hêtre massif français, sac coton", "L 30 cm", "Bois"],
        ["Mobile Hoptimist", 38, "Hoptimist", "Bois hêtre et fil coton", "Ø 30 cm", "Bois"],
        ["Coussin enfant", 34, "Haomy", "Coton bio, garnissage recyclé", "35 × 35 cm", "Textile"],
        ["Veilleuse Papier", 58, "Owl Paperlamp", "Papier plissé, LED basse conso", "Ø 20 × H 24 cm", "Textile"]
      ]
    }
  ];

  /* ------------------------------------------------------------------ */
  /* 3. Génération : identifiants, descriptions, coloris, visuels        */
  /* ------------------------------------------------------------------ */
  var COLOR_LIBRARY = {
    "Lin naturel": "#DDD3C2", "Écru": "#EFE9DE", "Beige sable": "#D4C4AC",
    "Anthracite": "#33322F", "Terre cuite": "#B0714E", "Vert olive": "#6E7261",
    "Bleu nuit": "#2E3A4A", "Camel": "#A97B54", "Chêne clair": "#D7BE9B",
    "Noyer": "#7A5738", "Noir mat": "#1E1D1B", "Gris pierre": "#A9A69E"
  };
  var COLOR_NAMES = Object.keys(COLOR_LIBRARY);

  var DESCRIPTIONS = {
    chair: [
      "Une assise au dessin franc, choisie pour son confort autant que pour sa ligne. {brand} soigne particulièrement les proportions et la qualité des garnissages.",
      "{name} trouve sa place aussi bien autour d'une table que dans un coin lecture. Une pièce que l'on garde longtemps, et qui se patine bien.",
      "Signée {brand}, cette assise associe une structure solide à des matières agréables au toucher. Plusieurs finitions disponibles en boutique."
    ],
    sofa: [
      "Assise profonde et garnissage haute résilience : {name} est pensé pour le quotidien, pas seulement pour la photo. Housses déhoussables et nettoyables.",
      "Un canapé aux volumes généreux mais à la ligne basse, qui structure la pièce sans l'alourdir. Fabrication {brand}, finitions personnalisables.",
      "{brand} construit ses assises sur ossature massive. Le confort ne s'affaisse pas au bout de deux saisons — c'est tout l'intérêt."
    ],
    table: [
      "Un plateau massif aux arêtes adoucies, porté par un piètement dessiné pour se faire oublier. Chaque pièce présente un veinage unique.",
      "{name} est proposé en plusieurs longueurs. Les proportions ont été étudiées pour circuler facilement autour de la table.",
      "Fabrication {brand} : assemblages traditionnels, finition huilée naturelle, entretien simple et patine qui se bonifie avec le temps."
    ],
    storage: [
      "Rangement généreux, façades sobres et charnières à fermeture douce. {name} organise sans jamais s'imposer.",
      "Une menuiserie soignée et des volumes calibrés au centimètre, dans la tradition de {brand}. Étagères réglables.",
      "Conçu pour durer : caisson massif, finitions travaillées à la main et passage de câbles dissimulé."
    ],
    lamp: [
      "Une lumière chaude et diffuse, filtrée par un diffuseur choisi pour sa densité. {name} éclaire sans éblouir.",
      "Objet lumineux au dessin minimal, à mi-chemin entre la sculpture et l'usage. Compatible LED, variateur recommandé.",
      "{brand} travaille la matière brute et la douceur du diffuseur. Idéal en éclairage d'appoint, seul ou par trois."
    ],
    decor: [
      "Pièce façonnée à la main : chaque exemplaire présente d'infimes variations de teinte et de texture qui en font un objet unique.",
      "{name} apporte cette touche de matière naturelle qui réchauffe une console, une table ou une étagère. Édition {brand}.",
      "Un objet simple, sans ornement superflu, dont toute la présence tient à la justesse des proportions."
    ],
    rug: [
      "Tissé sur métier traditionnel, il apporte chaleur et confort acoustique. Les nuances irrégulières signent le travail manuel.",
      "Une matière dense et souple, dans des teintes naturelles qui s'accordent avec tous les bois. Sélection {brand}.",
      "{name} délimite l'espace sans le cloisonner. Nettoyage à sec recommandé pour préserver la fibre."
    ],
    mirror: [
      "Un miroir généreux qui démultiplie la lumière naturelle. L'encadrement fin laisse toute la place au reflet.",
      "{name} joue sur la géométrie pure et la finesse du cadre. Fixation murale renforcée fournie.",
      "Le verre légèrement teinté adoucit le reflet et donne de la profondeur au mur qu'il habille."
    ],
    outdoor: [
      "Conçu pour vivre dehors : matériaux sélectionnés pour leur résistance aux UV et à l'humidité. {brand} garantit ses finitions plusieurs années.",
      "{name} prolonge l'intérieur sur la terrasse ou au jardin, avec le même soin apporté aux détails. Pièces détachées disponibles.",
      "Une pièce d'extérieur pensée pour durer, démontable et facile à hiverner. Large choix de coloris chez {brand}."
    ],
    room: [
      "Un décor mural qui change complètement une pièce sans travaux lourds. Pose à l'encollage du mur, dépose sans résidu.",
      "{name} est édité par {brand}, maison spécialisée dans le papier peint depuis plusieurs décennies. Échantillon disponible sur demande.",
      "Impression soignée sur intissé mat. Prévoyez un lé supplémentaire pour les raccords."
    ]
  };

  function slugify(str) {
    return String(str)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’]/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  var products = [];
  var index = 0;
  var poolCounters = {};

  CATALOG.forEach(function (family) {
    family.items.forEach(function (row) {
      var model = row[0], price = row[1], brand = row[2];
      var material = row[3], dimensions = row[4], matterFamily = row[5];
      var name = family.prefix ? family.prefix + " " + model : model;
      var id = slugify(name);

      var tpl = DESCRIPTIONS[family.icon] || DESCRIPTIONS.decor;
      var description = tpl[index % tpl.length]
        .replace(/\{name\}/g, name)
        .replace(/\{brand\}/g, brand);

      poolCounters[family.pool] = (poolCounters[family.pool] || 0) + 1;

      products.push({
        id: id,
        name: name,
        model: model,
        brand: brand,
        category: family.category,
        collection: family.collection,
        matter: matterFamily,
        price: price,
        description: description,
        longText: brand === "Astrantia"
          ? "Disponible immédiatement en boutique à Attignat, ou expédiée sous 48 h."
          : "Pièce " + brand + " sélectionnée par Astrantia. Disponible en boutique à Attignat ou sur commande — comptez 2 à 6 semaines selon la finition. Nos conseillères vous aident à choisir la teinte et les dimensions.",
        material: material,
        dimensions: dimensions,
        colors: [
          COLOR_NAMES[index % COLOR_NAMES.length],
          COLOR_NAMES[(index + 4) % COLOR_NAMES.length],
          COLOR_NAMES[(index + 8) % COLOR_NAMES.length]
        ].map(function (c) { return { name: c, hex: COLOR_LIBRARY[c] }; }),
        icon: family.icon,
        pool: family.pool,
        photo: photo(family.pool, poolCounters[family.pool] - 1),
        tone: (index % 8) + 1,
        isNew: index % 9 === 3,
        isBest: index % 11 === 2,
        stock: index % 13 === 5 ? "Sur commande" : "En stock à Attignat",
        ref: "AST-" + String(1000 + index),
        order: index
      });
      index++;
    });
  });

  /* Photos secondaires de la fiche produit (galerie 4 vues) */
  products.forEach(function (p) {
    var list = POOLS[p.pool];
    var start = list.indexOf(p.photo.replace(U, "").replace(OPT, ""));
    p.gallery = [0, 1, 2, 3].map(function (k) {
      return U + list[(start + k * 3 + list.length) % list.length] + OPT;
    });
  });

  /* ------------------------------------------------------------------ */
  /* 4. API publique                                                     */
  /* ------------------------------------------------------------------ */
  function uniqueSorted(key) {
    var seen = Object.create(null);
    products.forEach(function (p) { seen[p[key]] = (seen[p[key]] || 0) + 1; });
    return Object.keys(seen).sort(function (a, b) {
      return a.localeCompare(b, "fr");
    }).map(function (k) { return { value: k, count: seen[k] }; });
  }

  products.forEach(function (p) {
    p._search = slugify([p.name, p.brand, p.category, p.collection,
                         p.matter, p.material, p.ref].join(" "));
  });

  var COLLECTION_ORDER = ["Mobilier", "Luminaires", "Décoration",
                          "Art de la table", "Extérieur", "Cadeaux"];

  var API = {
    all: products,
    scenes: SCENES,
    categories: uniqueSorted("category"),
    brands: uniqueSorted("brand"),
    matters: uniqueSorted("matter"),
    collections: COLLECTION_ORDER.map(function (c) {
      return { value: c, count: products.filter(function (p) { return p.collection === c; }).length };
    }),
    collectionOrder: COLLECTION_ORDER,
    priceBounds: products.reduce(function (acc, p) {
      return { min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) };
    }, { min: Infinity, max: 0 }),
    slugify: slugify,
    byId: function (id) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) return products[i];
      }
      return null;
    },
    byCollection: function (collection, limit) {
      var list = products.filter(function (p) { return p.collection === collection; });
      return typeof limit === "number" ? list.slice(0, limit) : list;
    },
    featured: function (limit) {
      var ids = ["chaise-luxembourg", "canape-nubes", "suspension-kila", "vase-terra",
                 "table-bok", "bougie-flambeau", "fauteuil-nube", "brasero-ofyr-classic-85"];
      var list = ids.map(API.byId).filter(Boolean);
      return list.slice(0, limit || ids.length);
    },
    similar: function (product, limit) {
      if (!product) return [];
      var same = products.filter(function (p) {
        return p.id !== product.id && p.category === product.category;
      });
      var near = products.filter(function (p) {
        return p.id !== product.id && p.category !== product.category &&
               p.collection === product.collection;
      });
      return same.concat(near).slice(0, limit || 4);
    },
    formatPrice: function (value) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency", currency: "EUR",
        minimumFractionDigits: 0, maximumFractionDigits: 0
      }).format(value);
    }
  };

  global.ASTRANTIA_PRODUCTS = API;
})(window);
