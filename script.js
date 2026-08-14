/* ==========================================================================
   ASTRANTIA — Logique du site
   Vanilla JS, sans dépendance. Chargé après js/products.js.
   Sommaire :
   A. Utilitaires
   B. Images (cascade photo maison → photo de démo → visuel CSS)
   C. Carte produit
   D. Panier (localStorage)
   E. Interface globale (header, menu, recherche, révélations, accordéons)
   F. Page d'accueil
   G. Boutique (recherche / filtres / tri / pagination)
   H. Fiche produit
   I. Page panier
   J. Formulaires (contact, newsletter)
   ========================================================================== */

/* --------------------------------------------------------------------------
   SYSTÈME D'IMAGES — à lire avant toute modification
   --------------------------------------------------------------------------
   Chaque visuel du site tente de charger, dans l'ordre :
     1. votre photo maison        images/produits/<identifiant>.jpg
     2. la photo de démonstration (banque libre de droit)
     3. le visuel CSS de secours  (dégradé + pictogramme)

   Autrement dit : DÉPOSEZ SIMPLEMENT VOTRE PHOTO dans images/produits/
   en la nommant d'après l'identifiant du produit, et elle s'affiche
   partout (grille, fiche, panier, produits similaires). Aucun code à toucher.

   Vues supplémentaires d'une fiche produit :
     images/produits/<identifiant>-2.jpg, -3.jpg, -4.jpg
   Visuels d'ambiance : images/hero/, images/showroom/, images/collections/
   Logo : images/logo.png
   -------------------------------------------------------------------------- */
window.ASTRANTIA_IMG = {
  ok: function (img) {
    img.classList.add("is-loaded");
    var holder = img.closest(".ph") || img.parentNode;
    if (holder && holder.classList) holder.classList.add("has-photo");
  },
  err: function (img) {
    var next = img.getAttribute("data-fb");
    if (next) { img.removeAttribute("data-fb"); img.src = next; return; }
    img.classList.add("is-failed");
    var holder = img.closest(".ph") || img.parentNode;
    if (holder && holder.classList) holder.classList.remove("has-photo");
  }
};

(function () {
  "use strict";

  var P = window.ASTRANTIA_PRODUCTS;

  /* =============================== A. UTILS =============================== */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function price(v) { return P.formatPrice(v); }
  function param(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 180);
    };
  }

  /* ============================== B. IMAGES ============================== */
  /* local : chemin du fichier que le commerçant peut déposer
     remote : photo de démonstration (ou "" pour aucune)                   */
  function imgHTML(local, remote, alt) {
    return '<img class="ph__img" src="' + local + '" data-fb="' + (remote || "") +
      '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async"' +
      ' onload="ASTRANTIA_IMG.ok(this)" onerror="ASTRANTIA_IMG.err(this)">';
  }

  function mediaHTML(opts) {
    // opts : { icon, tone, ratio, label, local, remote, alt }
    return '<span class="ph ph--ratio-' + (opts.ratio || "45") + " ph--" + opts.icon +
      '" data-tone="' + opts.tone + '">' +
      imgHTML(opts.local, opts.remote, opts.alt || opts.label) +
      (opts.label ? '<span class="ph-label">' + esc(opts.label) + "</span>" : "") +
      "</span>";
  }

  function productMedia(p, ratio, label, view) {
    var n = view || 1;
    var local = "images/produits/" + p.id + (n > 1 ? "-" + n : "") + ".jpg";
    var remote = (p.gallery && p.gallery[n - 1]) || p.photo;
    return mediaHTML({
      icon: p.icon, tone: p.tone, ratio: ratio, label: label,
      local: local, remote: remote, alt: p.name + " — " + p.brand
    });
  }

  /* Visuels d'ambiance déclarés en HTML : <span data-scene="showroom" …> */
  function initScenes() {
    qsa("[data-scene]").forEach(function (el) {
      var key = el.getAttribute("data-scene");
      var local = el.getAttribute("data-local") || ("images/showroom/" + key + ".jpg");
      var remote = P.scenes[key] || "";
      var alt = el.getAttribute("data-alt") || "Astrantia";
      el.insertAdjacentHTML("afterbegin", imgHTML(local, remote, alt));
    });
  }

  /* Logo : images/logo.png → logo du site actuel → logo texte */
  function initLogos() {
    qsa(".logo[data-logo]").forEach(function (el) {
      el.insertAdjacentHTML("afterbegin",
        '<img class="logo__img" src="images/logo.png"' +
        ' data-fb="https://astrantia.fr/wp-content/themes/idcomweb/img/logo.png"' +
        ' alt="Astrantia — décoration, mobilier & cadeaux"' +
        ' onload="ASTRANTIA_IMG.ok(this)" onerror="ASTRANTIA_IMG.err(this)">');
    });
  }

  /* ========================== C. CARTE PRODUIT =========================== */
  function productCardHTML(p, delay) {
    var badge = "";
    if (p.isNew) badge = '<span class="product-card__badge">Nouveauté</span>';
    else if (p.isBest) badge = '<span class="product-card__badge product-card__badge--dark">Coup de cœur</span>';

    return '<article class="product-card reveal"' + (delay ? ' data-delay="' + delay + '"' : "") + ">" +
      '<div class="product-card__media">' +
        '<a href="produit.html?id=' + p.id + '" aria-label="Voir ' + esc(p.name) + '">' +
          productMedia(p, "45", "") +
        "</a>" + badge +
        '<button type="button" class="product-card__quick" data-add="' + p.id + '">Ajouter au panier</button>' +
      "</div>" +
      '<div class="product-card__body">' +
        '<a href="produit.html?id=' + p.id + '">' +
          '<p class="product-card__cat">' + esc(p.brand) + "</p>" +
          '<h3 class="product-card__name">' + esc(p.name) + "</h3>" +
        "</a>" +
        '<p class="product-card__price">' + price(p.price) + "</p>" +
      "</div></article>";
  }

  /* ============================== D. PANIER ============================== */
  var CART_KEY = "astrantia_cart_v1";
  var PROMO_KEY = "astrantia_promo_v1";
  var PROMOS = { ASTRANTIA10: 0.1, BIENVENUE5: 0.05 };
  var FREE_SHIPPING_FROM = 500;
  var SHIPPING_COST = 39;

  var Cart = {
    read: function () {
      try {
        var raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(raw) ? raw.filter(function (l) { return l && l.id && P.byId(l.id); }) : [];
      } catch (e) { return []; }
    },
    write: function (lines) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(lines)); } catch (e) {}
      Cart.refreshBadge();
      document.dispatchEvent(new CustomEvent("cart:change"));
    },
    add: function (id, qty) {
      var lines = Cart.read(), found = false;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      lines.forEach(function (l) {
        if (l.id === id) { l.qty = Math.min(99, l.qty + qty); found = true; }
      });
      if (!found) lines.push({ id: id, qty: qty });
      Cart.write(lines);
    },
    setQty: function (id, qty) {
      qty = parseInt(qty, 10) || 0;
      var lines = Cart.read().map(function (l) {
        if (l.id === id) l.qty = Math.min(99, Math.max(0, qty));
        return l;
      }).filter(function (l) { return l.qty > 0; });
      Cart.write(lines);
    },
    remove: function (id) {
      Cart.write(Cart.read().filter(function (l) { return l.id !== id; }));
    },
    clear: function () {
      Cart.write([]);
      try { localStorage.removeItem(PROMO_KEY); } catch (e) {}
    },
    count: function () {
      return Cart.read().reduce(function (n, l) { return n + l.qty; }, 0);
    },
    subtotal: function () {
      return Cart.read().reduce(function (t, l) {
        var p = P.byId(l.id);
        return t + (p ? p.price * l.qty : 0);
      }, 0);
    },
    promo: function () {
      try {
        var code = localStorage.getItem(PROMO_KEY) || "";
        return PROMOS[code] ? code : "";
      } catch (e) { return ""; }
    },
    setPromo: function (code) {
      try { localStorage.setItem(PROMO_KEY, code); } catch (e) {}
    },
    totals: function () {
      var sub = Cart.subtotal();
      var code = Cart.promo();
      var discount = code ? Math.round(sub * PROMOS[code]) : 0;
      var base = sub - discount;
      var shipping = sub === 0 ? 0 : (base >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST);
      return { sub: sub, code: code, discount: discount, shipping: shipping, total: base + shipping };
    },
    refreshBadge: function () {
      var n = Cart.count();
      qsa("[data-cart-count]").forEach(function (el) {
        el.textContent = n;
        el.classList.toggle("is-visible", n > 0);
      });
    }
  };

  var toastTimer;
  function toast(message, linkLabel, linkHref) {
    var el = qs(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = "<span>" + esc(message) + "</span>" +
      (linkHref ? '<a href="' + linkHref + '">' + esc(linkLabel) + "</a>" : "");
    requestAnimationFrame(function () { el.classList.add("is-visible"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 4200);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add]");
    if (!btn) return;
    e.preventDefault();
    var p = P.byId(btn.getAttribute("data-add"));
    if (!p) return;
    var qtyInput = btn.getAttribute("data-qty-from") ? qs(btn.getAttribute("data-qty-from")) : null;
    Cart.add(p.id, qtyInput ? qtyInput.value : 1);
    toast(p.name + " a été ajouté à votre panier.", "Voir le panier", "panier.html");
  });

  /* ========================= E. INTERFACE GLOBALE ========================= */
  function initHeader() {
    var header = qs(".site-header");
    var burger = qs("#burger");
    var nav = qs("#mainNav");
    var searchToggle = qs("#searchToggle");
    var searchPanel = qs("#searchPanel");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (burger && nav) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("is-locked", open);
      });
      qsa("a", nav).forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          burger.classList.remove("is-open");
          document.body.classList.remove("is-locked");
        });
      });
    }

    if (searchToggle && searchPanel) {
      searchToggle.addEventListener("click", function () {
        var open = searchPanel.classList.toggle("is-open");
        searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) { var i = qs("input", searchPanel); if (i) i.focus(); }
      });
      var closeBtn = qs("#searchClose");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          searchPanel.classList.remove("is-open");
          searchToggle.setAttribute("aria-expanded", "false");
        });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") searchPanel.classList.remove("is-open");
      });
    }

    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    qsa(".main-nav a").forEach(function (a) {
      var target = a.getAttribute("href").split("?")[0].toLowerCase();
      if (target === here) a.classList.add("is-active");
      if (here === "produit.html" && target === "boutique.html") a.classList.add("is-active");
    });
  }

  var revealObserver = null;
  function initReveal(root) {
    var items = qsa(".reveal:not(.is-visible)", root || document);
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }
    items.forEach(function (el) { revealObserver.observe(el); });
  }

  function initAccordions(root) {
    qsa(".accordion__btn", root || document).forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        var item = btn.closest(".accordion__item");
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initQtyWidgets(root) {
    qsa(".qty", root || document).forEach(function (widget) {
      if (widget.dataset.bound) return;
      widget.dataset.bound = "1";
      var input = qs("input", widget);
      qsa("button", widget).forEach(function (b) {
        b.addEventListener("click", function () {
          var step = b.getAttribute("data-step") === "-1" ? -1 : 1;
          var next = Math.min(99, Math.max(1, (parseInt(input.value, 10) || 1) + step));
          input.value = next;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
    });
  }

  /* ========================== F. PAGE D'ACCUEIL ========================== */
  function initHome() {
    var grid = qs("[data-featured]");
    if (grid) {
      var list = P.featured(parseInt(grid.getAttribute("data-featured"), 10) || 8);
      grid.innerHTML = list.map(function (p, i) {
        return productCardHTML(p, (i % 4) + 1);
      }).join("");
      initReveal(grid);
    }

    qsa("[data-count-collection]").forEach(function (el) {
      var c = el.getAttribute("data-count-collection");
      el.textContent = P.byCollection(c).length + " références";
    });
    qsa("[data-total-products]").forEach(function (el) { el.textContent = P.all.length; });
    qsa("[data-total-brands]").forEach(function (el) { el.textContent = P.brands.length; });
  }

  /* ============================= G. BOUTIQUE ============================= */
  var PAGE_SIZE = 24;

  function initShop() {
    var root = qs("#shop");
    if (!root) return;

    var gridEl = qs("#shopGrid");
    var countEl = qs("#shopCount");
    var sortEl = qs("#shopSort");
    var searchEl = qs("#shopSearch");
    var chipsEl = qs("#shopChips");
    var moreWrap = qs("#shopMore");
    var minEl = qs("#priceMin");
    var maxEl = qs("#priceMax");

    var state = {
      q: param("q"),
      categories: param("categorie") ? param("categorie").split(",") : [],
      collections: param("collection") ? param("collection").split(",") : [],
      brands: param("marque") ? param("marque").split(",") : [],
      matters: param("matiere") ? param("matiere").split(",") : [],
      min: parseInt(param("min"), 10) || null,
      max: parseInt(param("max"), 10) || null,
      sort: param("tri") || "selection",
      shown: PAGE_SIZE
    };

    function buildGroup(containerId, list, key) {
      var box = qs(containerId);
      if (!box) return;
      box.innerHTML = list.map(function (o) {
        var checked = state[key].indexOf(o.value) > -1 ? " checked" : "";
        return '<label class="check"><input type="checkbox" value="' + esc(o.value) +
          '" data-filter="' + key + '"' + checked + '><span class="check__box"></span>' +
          "<span>" + esc(o.value) + "</span>" +
          '<span class="check__count">' + o.count + "</span></label>";
      }).join("");
    }
    buildGroup("#filterCollections", P.collections, "collections");
    buildGroup("#filterCategories", P.categories, "categories");
    buildGroup("#filterBrands", P.brands, "brands");
    buildGroup("#filterMatters", P.matters, "matters");

    if (searchEl) searchEl.value = state.q;
    if (sortEl) sortEl.value = state.sort;
    if (minEl) { minEl.placeholder = P.priceBounds.min; if (state.min) minEl.value = state.min; }
    if (maxEl) { maxEl.placeholder = P.priceBounds.max; if (state.max) maxEl.value = state.max; }

    function compute() {
      var q = state.q ? P.slugify(state.q) : "";
      var terms = q ? q.split("-").filter(Boolean) : [];
      var list = P.all.filter(function (p) {
        if (state.categories.length && state.categories.indexOf(p.category) === -1) return false;
        if (state.collections.length && state.collections.indexOf(p.collection) === -1) return false;
        if (state.brands.length && state.brands.indexOf(p.brand) === -1) return false;
        if (state.matters.length && state.matters.indexOf(p.matter) === -1) return false;
        if (state.min !== null && p.price < state.min) return false;
        if (state.max !== null && p.price > state.max) return false;
        for (var i = 0; i < terms.length; i++) {
          if (p._search.indexOf(terms[i]) === -1) return false;
        }
        return true;
      });

      switch (state.sort) {
        case "prix-asc": list.sort(function (a, b) { return a.price - b.price; }); break;
        case "prix-desc": list.sort(function (a, b) { return b.price - a.price; }); break;
        case "az": list.sort(function (a, b) { return a.name.localeCompare(b.name, "fr"); }); break;
        case "marque":
          list.sort(function (a, b) {
            return a.brand.localeCompare(b.brand, "fr") || a.name.localeCompare(b.name, "fr");
          });
          break;
        case "nouveautes":
          list.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.order - b.order; });
          break;
        default: list.sort(function (a, b) { return a.order - b.order; });
      }
      return list;
    }

    function render() {
      var list = compute();
      var slice = list.slice(0, state.shown);

      if (!slice.length) {
        gridEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' +
          "<h3>Aucun produit ne correspond</h3>" +
          '<p class="muted">Essayez d\'élargir votre recherche ou de réinitialiser les filtres.</p>' +
          '<p><button type="button" class="btn btn--sm" id="emptyReset">Réinitialiser</button></p></div>';
        var er = qs("#emptyReset");
        if (er) er.addEventListener("click", resetAll);
      } else {
        var frag = document.createDocumentFragment();
        var wrap = document.createElement("div");
        wrap.innerHTML = slice.map(function (p, i) { return productCardHTML(p, (i % 4) + 1); }).join("");
        while (wrap.firstChild) frag.appendChild(wrap.firstChild);
        gridEl.innerHTML = "";
        gridEl.appendChild(frag);
      }

      countEl.textContent = list.length + (list.length > 1 ? " produits" : " produit");

      moreWrap.innerHTML = list.length > state.shown
        ? "<p>" + slice.length + " sur " + list.length + " produits affichés</p>" +
          '<button type="button" class="btn" id="loadMore">Afficher plus</button>'
        : (list.length > PAGE_SIZE ? "<p>Vous avez vu l'ensemble de la sélection.</p>" : "");
      var lm = qs("#loadMore");
      if (lm) {
        lm.addEventListener("click", function () {
          state.shown += PAGE_SIZE;
          render();
        });
      }

      renderChips();
      syncURL();
      initReveal(gridEl);
    }

    function renderChips() {
      if (!chipsEl) return;
      var chips = [];
      if (state.q) chips.push({ label: "« " + state.q + " »", type: "q" });
      ["collections", "categories", "brands", "matters"].forEach(function (key) {
        state[key].forEach(function (v) { chips.push({ label: v, type: key, value: v }); });
      });
      if (state.min !== null || state.max !== null) {
        chips.push({
          label: (state.min || P.priceBounds.min) + " € – " + (state.max || P.priceBounds.max) + " €",
          type: "price"
        });
      }
      chipsEl.innerHTML = chips.map(function (c) {
        return '<button type="button" class="chip" data-chip="' + c.type + '" data-value="' +
          esc(c.value || "") + '">' + esc(c.label) + "</button>";
      }).join("");
    }

    function syncURL() {
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.categories.length) p.set("categorie", state.categories.join(","));
      if (state.collections.length) p.set("collection", state.collections.join(","));
      if (state.brands.length) p.set("marque", state.brands.join(","));
      if (state.matters.length) p.set("matiere", state.matters.join(","));
      if (state.min !== null) p.set("min", state.min);
      if (state.max !== null) p.set("max", state.max);
      if (state.sort !== "selection") p.set("tri", state.sort);
      var qsStr = p.toString();
      // Certains navigateurs refusent l'API History en ouverture locale (file://) :
      // le site continue de fonctionner, seule l'URL n'est pas mise à jour.
      try {
        history.replaceState(null, "", qsStr ? "boutique.html?" + qsStr : "boutique.html");
      } catch (e) { /* ignoré volontairement */ }
    }

    function resetAll() {
      state.q = ""; state.categories = []; state.collections = [];
      state.brands = []; state.matters = [];
      state.min = null; state.max = null; state.sort = "selection"; state.shown = PAGE_SIZE;
      if (searchEl) searchEl.value = "";
      if (sortEl) sortEl.value = "selection";
      if (minEl) minEl.value = "";
      if (maxEl) maxEl.value = "";
      qsa("[data-filter]").forEach(function (i) { i.checked = false; });
      render();
    }

    root.addEventListener("change", function (e) {
      var input = e.target.closest("[data-filter]");
      if (!input) return;
      var key = input.getAttribute("data-filter");
      var v = input.value;
      var i = state[key].indexOf(v);
      if (input.checked && i === -1) state[key].push(v);
      if (!input.checked && i > -1) state[key].splice(i, 1);
      state.shown = PAGE_SIZE;
      render();
    });

    if (searchEl) {
      searchEl.addEventListener("input", debounce(function () {
        state.q = searchEl.value.trim();
        state.shown = PAGE_SIZE;
        render();
      }, 160));
    }
    if (sortEl) {
      sortEl.addEventListener("change", function () {
        state.sort = sortEl.value;
        render();
      });
    }
    var applyPrice = debounce(function () {
      state.min = minEl.value ? parseInt(minEl.value, 10) : null;
      state.max = maxEl.value ? parseInt(maxEl.value, 10) : null;
      state.shown = PAGE_SIZE;
      render();
    }, 320);
    if (minEl) minEl.addEventListener("input", applyPrice);
    if (maxEl) maxEl.addEventListener("input", applyPrice);

    if (chipsEl) {
      chipsEl.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        var type = chip.getAttribute("data-chip");
        var value = chip.getAttribute("data-value");
        if (type === "q") { state.q = ""; if (searchEl) searchEl.value = ""; }
        else if (type === "price") {
          state.min = null; state.max = null;
          if (minEl) minEl.value = "";
          if (maxEl) maxEl.value = "";
        } else {
          state[type] = state[type].filter(function (v) { return v !== value; });
          qsa('[data-filter="' + type + '"]').forEach(function (i) {
            if (i.value === value) i.checked = false;
          });
        }
        state.shown = PAGE_SIZE;
        render();
      });
    }

    var resetBtn = qs("#filterReset");
    if (resetBtn) resetBtn.addEventListener("click", resetAll);

    qsa(".filter-group__title").forEach(function (b) {
      b.addEventListener("click", function () {
        b.closest(".filter-group").classList.toggle("is-closed");
      });
    });

    var filtersEl = qs("#filters");
    var openFilters = qs("#filtersToggle");
    var closeFilters = qs("#filtersClose");
    if (openFilters && filtersEl) {
      openFilters.addEventListener("click", function () {
        filtersEl.classList.add("is-open");
        document.body.classList.add("is-locked");
      });
    }
    if (closeFilters && filtersEl) {
      closeFilters.addEventListener("click", function () {
        filtersEl.classList.remove("is-open");
        document.body.classList.remove("is-locked");
      });
    }

    render();
  }

  /* =========================== H. FICHE PRODUIT =========================== */
  function initProduct() {
    var root = qs("#productPage");
    if (!root) return;
    var p = P.byId(param("id")) || P.featured(1)[0];

    if (!p) {
      root.innerHTML = '<div class="container" style="padding:120px 0 140px;text-align:center">' +
        "<h1>Produit introuvable</h1><p class=\"muted\">Cette référence n'existe plus dans notre catalogue.</p>" +
        '<p><a class="btn" href="boutique.html">Retour à la boutique</a></p></div>';
      return;
    }

    document.title = p.name + " — " + p.brand + " | Astrantia";
    var meta = qs('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.name + " (" + p.brand + ") — " + p.description.slice(0, 140));

    var crumb = qs("#productCrumb");
    if (crumb) crumb.textContent = p.name;

    var views = ["Vue d'ensemble", "Détail matière", "Mise en situation", "Profil"];
    var main = qs("#galleryMain");
    var thumbs = qs("#galleryThumbs");
    main.innerHTML = productMedia(p, "43", views[0], 1);
    thumbs.innerHTML = views.map(function (v, i) {
      return '<button type="button" class="gallery__thumb' + (i === 0 ? " is-active" : "") +
        '" data-view="' + (i + 1) + '" aria-label="' + esc(v) + '">' +
        productMedia(p, "11", "", i + 1) + "</button>";
    }).join("");
    thumbs.addEventListener("click", function (e) {
      var b = e.target.closest(".gallery__thumb");
      if (!b) return;
      qsa(".gallery__thumb", thumbs).forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      var n = parseInt(b.getAttribute("data-view"), 10);
      main.innerHTML = productMedia(p, "43", views[n - 1], n);
    });

    qs("#productCategory").textContent = p.brand + " · " + p.category;
    qs("#productName").textContent = p.name;
    qs("#productPrice").textContent = price(p.price);
    qs("#productDesc").textContent = p.description;
    qs("#productRef").textContent = p.ref;
    qs("#productStock").textContent = p.stock;
    qs("#productBrand").textContent = p.brand;
    qs("#productMaterial").textContent = p.material;
    qs("#productDimensions").textContent = p.dimensions;
    qs("#productMatter").textContent = p.matter;
    qs("#productLong").textContent = p.longText;

    qs("#productColors").innerHTML = p.colors.map(function (c, i) {
      return '<button type="button" class="swatch' + (i === 0 ? " is-active" : "") + '">' +
        '<i style="background:' + c.hex + '"></i>' + esc(c.name) + "</button>";
    }).join("");
    qs("#productColors").addEventListener("click", function (e) {
      var b = e.target.closest(".swatch");
      if (!b) return;
      qsa(".swatch", qs("#productColors")).forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
    });

    var addBtn = qs("#productAdd");
    addBtn.setAttribute("data-add", p.id);
    addBtn.setAttribute("data-qty-from", "#productQty");

    var similar = qs("#similarGrid");
    if (similar) {
      similar.innerHTML = P.similar(p, 4).map(function (sp, i) {
        return productCardHTML(sp, (i % 4) + 1);
      }).join("");
    }

    var colLink = qs("#productCollectionLink");
    if (colLink) {
      colLink.href = "boutique.html?marque=" + encodeURIComponent(p.brand);
      colLink.textContent = "Voir toutes les pièces " + p.brand;
    }

    initQtyWidgets(root);
    initAccordions(root);
    initReveal(root);
  }

  /* ============================ I. PAGE PANIER ============================ */
  function initCartPage() {
    var root = qs("#cartPage");
    if (!root) return;
    var linesEl = qs("#cartLines");
    var summaryEl = qs("#cartSummary");
    var emptyEl = qs("#cartEmpty");
    var contentEl = qs("#cartContent");
    var suggestions = qs("#cartSuggestions");
    var checkedOut = false;

    function render() {
      if (checkedOut) return;
      var lines = Cart.read();

      if (!lines.length) {
        emptyEl.hidden = false;
        contentEl.hidden = true;
      } else {
        emptyEl.hidden = true;
        contentEl.hidden = false;

        linesEl.innerHTML = lines.map(function (l) {
          var p = P.byId(l.id);
          return '<div class="cart-line">' +
            '<a href="produit.html?id=' + p.id + '">' + productMedia(p, "11", "") + "</a>" +
            "<div>" +
              '<span class="cart-line__cat">' + esc(p.brand) + "</span>" +
              '<a class="cart-line__name" href="produit.html?id=' + p.id + '">' + esc(p.name) + "</a>" +
              '<p class="muted" style="font-size:13px;margin:2px 0 12px">' + esc(p.material) + "</p>" +
              '<div class="cart-line__actions">' +
                '<div class="qty"><button type="button" data-step="-1" aria-label="Diminuer">−</button>' +
                '<input type="number" min="1" max="99" value="' + l.qty + '" data-qty="' + p.id + '" aria-label="Quantité">' +
                '<button type="button" data-step="1" aria-label="Augmenter">+</button></div>' +
                '<button type="button" class="cart-line__remove" data-remove="' + p.id + '">Retirer</button>' +
              "</div>" +
            "</div>" +
            '<div class="cart-line__price">' + price(p.price * l.qty) +
              (l.qty > 1 ? '<br><span class="muted" style="font-size:12px">' + price(p.price) + " / pièce</span>" : "") +
            "</div></div>";
        }).join("");
        initQtyWidgets(linesEl);
      }

      var t = Cart.totals();
      summaryEl.innerHTML =
        '<div class="summary-row"><span>Sous-total</span><span>' + price(t.sub) + "</span></div>" +
        (t.discount ? '<div class="summary-row"><span>Code ' + esc(t.code) + "</span><span>− " + price(t.discount) + "</span></div>" : "") +
        '<div class="summary-row"><span>Livraison</span><span>' +
          (t.shipping === 0 ? (t.sub === 0 ? "—" : "Offerte") : price(t.shipping)) + "</span></div>" +
        '<div class="summary-row summary-row--total"><span>Total</span><span>' + price(t.total) + "</span></div>" +
        '<p class="muted" style="font-size:12px;margin:14px 0 0">' +
          (t.sub === 0 ? "Votre panier est vide."
            : (t.shipping === 0 ? "Livraison offerte à partir de " + price(FREE_SHIPPING_FROM) + " — ou retrait gratuit en boutique à Attignat."
              : "Plus que " + price(FREE_SHIPPING_FROM - (t.sub - t.discount)) + " pour la livraison offerte. Retrait en boutique toujours gratuit.")) +
        "</p>";

      qsa("[data-cart-total]").forEach(function (el) { el.textContent = price(t.total); });
    }

    linesEl.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove]");
      if (rm) Cart.remove(rm.getAttribute("data-remove"));
    });
    linesEl.addEventListener("change", function (e) {
      var input = e.target.closest("[data-qty]");
      if (input) Cart.setQty(input.getAttribute("data-qty"), input.value);
    });

    var clearBtn = qs("#cartClear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        Cart.clear();
        toast("Votre panier a été vidé.");
      });
    }

    var promoForm = qs("#promoForm");
    if (promoForm) {
      promoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = qs("input", promoForm);
        var code = (input.value || "").trim().toUpperCase();
        if (PROMOS[code]) {
          Cart.setPromo(code);
          toast("Code " + code + " appliqué : −" + (PROMOS[code] * 100) + " %.");
          render();
        } else {
          toast("Ce code promotionnel n'est pas valide.");
        }
        input.value = "";
      });
    }

    var checkout = qs("#checkoutBtn");
    if (checkout) {
      checkout.addEventListener("click", function () {
        if (!Cart.count()) return;
        var t = Cart.totals();
        checkedOut = true;
        Cart.clear();
        emptyEl.hidden = true;
        contentEl.hidden = false;
        contentEl.innerHTML = '<div class="alert alert--ok" style="margin:0"><strong>Commande simulée avec succès.</strong>' +
          "<br>Montant : " + price(t.total) + ". Ce site est une démonstration : aucun paiement n'est traité " +
          "et aucune donnée n'est transmise. En conditions réelles, Astrantia vous recontacterait sous 24 h ouvrées." +
          '<p style="margin:16px 0 0"><a class="btn btn--sm" href="boutique.html">Poursuivre mes achats</a></p></div>';
      });
    }

    if (suggestions) {
      suggestions.innerHTML = P.featured(4).map(function (p, i) {
        return productCardHTML(p, (i % 4) + 1);
      }).join("");
      initReveal(suggestions);
    }

    document.addEventListener("cart:change", render);
    render();
  }

  /* ============================ J. FORMULAIRES ============================ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var PHONE_RE = /^[+0-9][0-9 .\-()]{7,19}$/;

  function setError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.add("has-error");
    var msg = qs(".error-msg", wrap);
    if (msg) msg.textContent = message;
  }
  function clearError(field) {
    var wrap = field.closest(".field");
    if (wrap) wrap.classList.remove("has-error");
  }

  function initContactForm() {
    var form = qs("#contactForm");
    if (!form) return;

    var rules = {
      prenom: function (v) { return v.length >= 2 || "Veuillez indiquer votre prénom."; },
      nom: function (v) { return v.length >= 2 || "Veuillez indiquer votre nom."; },
      email: function (v) { return EMAIL_RE.test(v) || "Adresse e-mail invalide."; },
      telephone: function (v) { return !v || PHONE_RE.test(v) || "Numéro de téléphone invalide."; },
      sujet: function (v) { return !!v || "Veuillez choisir un sujet."; },
      message: function (v) { return v.length >= 15 || "Votre message doit contenir au moins 15 caractères."; }
    };

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var res = rule((field.value || "").trim());
      if (res === true) { clearError(field); return true; }
      setError(field, res);
      return false;
    }

    qsa("input, select, textarea", form).forEach(function (f) {
      f.addEventListener("blur", function () { validateField(f); });
      f.addEventListener("input", function () {
        if (f.closest(".field").classList.contains("has-error")) validateField(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, first = null;
      qsa("input, select, textarea", form).forEach(function (f) {
        if (!validateField(f)) { ok = false; if (!first) first = f; }
      });
      if (!ok) { if (first) first.focus(); return; }

      var prenom = qs('[name="prenom"]', form).value.trim();
      form.innerHTML = '<div class="alert alert--ok"><strong>Merci ' + esc(prenom) +
        ", votre message a bien été transmis.</strong><br>Nous vous répondons sous 24 heures ouvrées. " +
        "Ce site étant une démonstration sans serveur, aucune donnée n'est réellement envoyée ni conservée.</div>" +
        '<a class="btn" href="boutique.html">Découvrir la boutique</a>';
    });
  }

  function initNewsletter() {
    qsa("[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = qs('input[type="email"]', form);
        var v = (input.value || "").trim();
        if (!EMAIL_RE.test(v)) { toast("Merci de saisir une adresse e-mail valide."); input.focus(); return; }
        form.innerHTML = '<p style="margin:0">Merci — votre inscription est enregistrée. ' +
          "Vous recevrez nos nouveautés et nos invitations aux ateliers.</p>";
      });
    });
  }

  /* ============================== DÉMARRAGE ============================== */
  function boot() {
    initLogos();
    initScenes();
    initHeader();
    Cart.refreshBadge();
    initReveal();
    initAccordions();
    initQtyWidgets();
    initHome();
    initShop();
    initProduct();
    initCartPage();
    initContactForm();
    initNewsletter();

    qsa("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
