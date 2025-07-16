// Gestion du Bonjour / Bonsoir en fonction de l'heure

$(function() {
    var today = new Date();
    var h = today.getHours();
    if (h > 0 && h < 19) {
        document.getElementById("text_welcome_hours").innerHTML = 'Bonjour'
    }
    else{
        document.getElementById("text_welcome_hours").innerHTML = 'Bonsoir'
    }
});

// Script permettant de gérer le mode dark (Bipo a mal à ses yeux)

$(function() {

  const themeKey = 'forumTheme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      $('body').addClass('dark-mode');
      $('#theme-toggle').text('Mode clair');
    } else {
      $('body').removeClass('dark-mode');
      $('#theme-toggle').text('Mode sombre');
    }
  }

  // Charger le thème au démarrage
  const savedTheme = localStorage.getItem(themeKey) || 'light';
  applyTheme(savedTheme);

  // Gestion du clic toggle
  $('#theme-toggle').on('click', function() {
    const currentTheme = $('body').hasClass('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(themeKey, newTheme);
  });
});





// Script permettant de gérer les badges (Nouveau, à venir, coup de coeur)

$(function () {
  const $gallery = $('.gallery');
  const $sortSelect = $('#sort-forums');
  const $categorySelect = $('#category-filter');
  const $favButton = $('#filter-favorites');
  const $resetButton = $('#reset-filters');

  const favoritesKey = 'forumFavorites';
  let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const initialForums = [];

  $('.forum-card').each(function (index) {
    const $card = $(this);
    const dateStr = $card.data('date');
    const forumDate = new Date(dateStr);
    forumDate.setHours(0, 0, 0, 0);

    const forumId = $card.data('id');
    const isComing = forumDate > now;
    const diffDays = (now - forumDate) / (1000 * 60 * 60 * 24);

    initialForums.push({
      element: $card,
      title: $card.data('title').toLowerCase(),
      date: forumDate,
      category: $card.data('category'),
      id: forumId,
      isComing,
      diffDays,
      index
    });
  });

  function updateFavoriteVisuals() {
    $('.forum-card').each(function () {
      const forumId = $(this).data('id');
      const $btn = $(this).find('.favorite-btn');
      if (favorites.includes(forumId)) {
        $btn.addClass('favorited').attr('aria-label', 'Retirer des favoris').text('★');
      } else {
        $btn.removeClass('favorited').attr('aria-label', 'Ajouter aux favoris').text('☆');
      }
    });
  }

  function toggleFavorite(forumId) {
    if (favorites.includes(forumId)) {
      favorites = favorites.filter(id => id !== forumId);
    } else {
      favorites.push(forumId);
    }
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    updateFavoriteVisuals();
    updateGallery();
  }

  $gallery.on('click', '.favorite-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const forumId = $(this).closest('.forum-card').data('id');
    toggleFavorite(forumId);
  });

  $gallery.on('keydown', '.favorite-btn', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const forumId = $(this).closest('.forum-card').data('id');
      toggleFavorite(forumId);
    }
  });

  function applyBadges($card, forum) {
    $card.removeClass('coming-soon new-forum fav-highlight');
    $card.find('.badge-coming, .badge-new, .badge-fav').remove();

    if (forum.isComing) {
      $card.addClass('coming-soon').append('<div class="badge-coming">À venir</div>');
    } else if (forum.isFavorite) {
      $card.addClass('fav-highlight').append('<div class="badge-fav">Coup de cœur</div>');
    } else if (forum.isNew) {
      $card.addClass('new-forum').append('<div class="badge-new">Nouveau</div>');
    }
  }

  function updateGallery() {
    const sortBy = $sortSelect.val();
    const selectedCategory = $categorySelect.val();
    const filterFavs = $favButton.data('active') === true || $favButton.data('active') === 'true';

    let forums = initialForums.map(forum => {
      const isFavorite = favorites.includes(forum.id);
      const isNew = !isFavorite && !forum.isComing && forum.diffDays >= 0 && forum.diffDays <= 30;
      return {
        ...forum,
        isFavorite,
        isNew
      };
    }).filter(forum => {
      if (selectedCategory !== 'all' && forum.category !== selectedCategory) {
        return false;
      }
      if (filterFavs && !forum.isFavorite) {
        return false;
      }
      return true;
    });

    if (sortBy === 'alpha') {
      forums.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent') {
      forums.sort((a, b) => b.date - a.date);
    } else {
      forums.sort((a, b) => {
        // Ordre : Favoris (non à venir), Coup de coeur, Nouveau, Sans badge, À venir
        const aScore = a.isComing ? 4 : a.isFavorite ? 0 : a.isNew ? 2 : 3;
        const bScore = b.isComing ? 4 : b.isFavorite ? 0 : b.isNew ? 2 : 3;
        if (aScore !== bScore) return aScore - bScore;
        return a.index - b.index;
      });
    }

    $gallery.empty();

    forums.forEach(forum => {
      applyBadges(forum.element, forum);
      $gallery.append(forum.element.show());
    });

    $('#no-result').toggle(forums.length === 0);
    updateFavoriteVisuals();
  }

  $favButton.on('click', function () {
    const active = $(this).data('active') === true || $(this).data('active') === 'true';
    $(this).data('active', !active);
    $(this).toggleClass('active', !active);
    updateGallery();
  });

  $sortSelect.on('change', updateGallery);
  $categorySelect.on('change', updateGallery);

  $resetButton.on('click', function () {
    $sortSelect.val('default');
    $categorySelect.val('all');
    $favButton.data('active', false).removeClass('active');
    updateGallery();
  });

  updateFavoriteVisuals();
  updateGallery();
});













// Script permettant de gérer les signalements (warning)

$(function () {
    const DELAI_JOURS = 5;
    
    // Retirer le bouton de signalement pour les invités !
    $.get('/profile?mode=editprofile', function(d) {
      var url = $('#profile_field_3_-10', d)
      if(!url.length)
      {
        $('.forum-link-signaler').attr('disabled', true).css({
          opacity: 0.4,
          cursor: 'not-allowed',
          pointerEvents: 'none',
          filter: 'grayscale(1)'
        }).attr('title', 'Il faut être connecté pour faire un signalement !');
      }
    });

    // Injecte la modale une seule fois
    if (!$('#custom-report-modal').length) {
        const modalHTML = `
        <div id="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9998;"></div>
        <div id="custom-report-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 500px; width: 90%; background: white; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 9999; font-family: 'Segoe UI', sans-serif; overflow: hidden;">
            <div style="padding: 1rem; border-bottom: 1px solid #eee; background-color: #f5f5f5;">
                <h3 style="margin: 0; font-size: 1.2rem;"><i class="fa fa-flag" style="color:#d00; margin-right: 0.5rem;"></i> Signalement</h3>
                <p id="modal-forum-title" style="margin: 0.5rem 0 0; font-weight: bold;"></p>
            </div>
            <div style="padding: 1rem;">
                <p style="margin-bottom: 0.5rem;">Expliquez brièvement le(s) problème(s) constaté(s) :</p>
                <textarea id="modal-report-message" rows="6" style="width: 100%; resize: vertical; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px;"></textarea>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 1rem; background-color: #fafafa; border-top: 1px solid #eee;">
                <button id="modal-cancel-btn" style="background: none; border: none; color: #666; font-weight: bold; cursor: pointer;"><i class="fa fa-times"></i> Annuler</button>
                <button id="modal-send-btn" style="background: #39C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;"><i class="fa fa-paper-plane"></i> Envoyer</button>
            </div>
        </div>
        `;
        $('body').append(modalHTML);
    }

    let forumSignale = null;
    let $boutonActif = null;

    // Désactiver bouton si signalé il y a moins de 5 jours
    $('.forum-card').each(function () {
      const forumId = $(this).data('id');
      const bouton = $(this).find('.forum-link-signaler');
      const stored = localStorage.getItem('signalement_' + forumId);
    
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const signalementDate = new Date(data.date);
          const now = new Date();
          const diffJours = (now - signalementDate) / (1000 * 60 * 60 * 24);
    
          if (diffJours < DELAI_JOURS) {
            bouton.addClass('signaled').attr('disabled', true).css({
              opacity: 0.4,
              cursor: 'not-allowed',
              pointerEvents: 'none',
              filter: 'grayscale(1)'
            }).attr('title', 'Forum déjà signalé récemment');
          } else {
            localStorage.removeItem('signalement_' + forumId);
          }
        } catch (e) {
          localStorage.removeItem('signalement_' + forumId);
        }
      }
    });
    
    // Ouvrir la modale
    $('.gallery').on('click', '.forum-link-signaler:not(.signaled)', function (e) {
      e.preventDefault();
    
      const $card = $(this).closest('.forum-card');
      forumSignale = $card.data('id') || $card.data('title');
      $boutonActif = $(this);
    
      $('#modal-forum-title').text(`Forum concerné : ${$card.data('title')}`);
      $('#modal-report-message').val('');
      $('#modal-overlay, #custom-report-modal').fadeIn(200);
    });
    
    // Fermer modale
    $('#modal-cancel-btn, #modal-overlay').on('click', function () {
      $('#modal-overlay, #custom-report-modal').fadeOut(200);
    });
    
    // Envoyer signalement
    $('#modal-send-btn').on('click', function () {
      const contenu = $('#modal-report-message').val().trim();
    
      if (!contenu) {
        alert("Merci d'indiquer un message pour votre signalement.");
        return;
      }
    
      $('#modal-send-btn').text('En cours d\'envoi...');
      const forumTitre = $card.data('title');
      const message = `Signalement pour le forum : [b]${forumTitre}[/b]\n\n` +
                      `La (les) question(s) suivante(s) concernant son interview ont été posée(s) :\n\n` +
                      `[quote]${contenu}[/quote]\n\n`;
    
      $.post('/post', {
        't': '662',
        'mode': 'reply',
        'tid': $('[name="tid"]:first').val(),
        'post': '1',
        'message': message
      })
      .done(function () {
        const stockage = {
          message: contenu,
          date: new Date().toISOString()
        };
    
        localStorage.setItem('signalement_' + forumSignale, JSON.stringify(stockage));
    
        $boutonActif.addClass('signaled').attr('disabled', true).css({
          opacity: 0.4,
          cursor: 'not-allowed',
          pointerEvents: 'none',
          filter: 'grayscale(1)'
        }).attr('title', 'Forum déjà signalé récemment');
    
        $('#modal-overlay, #custom-report-modal').fadeOut(200);
        alert("Merci ! Votre signalement a bien été transmis.");
      })
      .fail(function () {
        alert("Une erreur est survenue lors de l'envoi du signalement.");
        $('#modal-send-btn').text('Envoyer');
      });
    });    
});