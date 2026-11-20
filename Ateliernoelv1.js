(function () {
  if (document.getElementById('noel-choix-guirlande')) return;

  var cle = 'forumactif-guirlande-noel';
  var cleNeige = 'forumactif-neige-noel';
  var cleCurseur = 'forumactif-curseur-noel';

  /* Configuration posée sur le forum avant de charger ce fichier. */
  var configuration = window.AtelierNoelForumactif || {};
  var classesAjoutees = typeof configuration.classesBouton === 'string'
    ? configuration.classesBouton.trim() : '';
  var scriptCharge = document.currentScript;
  var classesDepuisBalise = scriptCharge
    ? scriptCharge.getAttribute('data-bouton-classes') : '';
  var classesBouton = 'atelier-noel-bouton' +
    (classesAjoutees ? ' ' + classesAjoutees : '') +
    (classesDepuisBalise ? ' ' + classesDepuisBalise.trim() : '');
  var mediaMobile = window.matchMedia ? window.matchMedia(
    '(max-width: 767px), (hover: none) and (pointer: coarse)'
  ) : null;

  function estMobile() {
    return mediaMobile ? mediaMobile.matches :
      document.documentElement.clientWidth <= 767;
  }

  function attendreBureau() {
    if (!estMobile()) {
      window.removeEventListener('resize', attendreBureau);
      if (mediaMobile && mediaMobile.removeEventListener) {
        mediaMobile.removeEventListener('change', attendreBureau);
      }
      demarrer();
    }
  }

  var styles = [
    ['ampoules', 'Ampoules'],
    ['boules', 'Boules de Noël'],
    ['etoiles', 'Étoiles'],
    ['sapins', 'Sapins multicolores'],
    ['flocons', 'Flocons'],
    ['fanions', 'Fanions de Noël'],
    ['bougies', 'Bougies'],
    ['aucune', 'Aucune guirlande']
  ];

  function lireChoix() {
    try {
      return localStorage.getItem(cle) || 'ampoules';
    } catch (e) {
      return 'ampoules';
    }
  }

  function enregistrerChoix(valeur) {
    try {
      localStorage.setItem(cle, valeur);
    } catch (e) {
      /* Le choix reste actif sur cette page. */
    }
  }

  function trouverAncrage() {
    var element;

    /* AwesomeBB : sous le <header>. */
    if (document.getElementById('header-banner')) {
      element = document.querySelector('header');

      if (element) {
        return { element: element, bord: 'bas' };
      }
    }

    /*
     * ModernBB : sous sa navigation lorsqu'elle devient fixe.
     */
    if (document.body.id === 'modernbb') {
      element = document.querySelector(
        '#headerbar-top.is-sticky'
      );

      if (element) {
        return {
          element: element,
          bord: 'bas',
          fixe: true
        };
      }
    }

    /* En haut de page : sous la Toolbar. */
    element = document.getElementById('fa_toolbar');

    if (element && element.getBoundingClientRect().height > 0) {
      return { element: element, bord: 'bas' };
    }

    /* Repli si la Toolbar n'existe pas. */
    var selecteurs = [
      '.headerbar',
      '#pun-logo',
      '#logo',
      '#i_logo',
      '#header-banner'
    ];

    for (var i = 0; i < selecteurs.length; i++) {
      element = document.querySelector(selecteurs[i]);

      if (element && element.getBoundingClientRect().height > 0) {
        return { element: element, bord: 'haut' };
      }
    }

    return null;
  }

  function demarrer() {
    if (document.getElementById('noel-choix-guirlande')) return;
    if (estMobile()) {
      window.addEventListener('resize', attendreBureau);
      if (mediaMobile && mediaMobile.addEventListener) {
        mediaMobile.addEventListener('change', attendreBureau);
      }
      return;
    }
    /*
     * ~ est remplacé par un espace après le chargement.
     * Cela protège le CSS de la compression Forumactif.
     */
    var reglesCSS = [
      /* Zone et fil */
      '#noel-guirlande{',
        'position:absolute;',
        'z-index:10;',
        'display:flex;',
        'height:52px;',
        'overflow:hidden;',
        'pointer-events:none;',
        'white-space:nowrap;',
      '}',

      '#noel-guirlande::before{',
        'content:"";',
        'position:absolute;',
        'top:0;',
        'left:0;',
        'right:0;',
        'border-top:2px~solid~#445047;',
      '}',

      /* Tiges et attaches */
      '#noel-guirlande>.element{',
        'position:relative;',
        'flex:0~0~22px;',
        'height:52px;',
        'margin:0~14px~0~0;',
        'box-sizing:border-box;',
      '}',

      '#noel-guirlande>.element::before{',
        'content:"";',
        'position:absolute;',
        'top:0;',
        'left:10px;',
        'width:2px;',
        'height:14px;',
        'background:#445047;',
      '}',

      '#noel-guirlande>.element::after{',
        'content:"";',
        'position:absolute;',
        'top:0;',
        'left:9px;',
        'width:4px;',
        'height:4px;',
        'border-radius:50%;',
        'background:#445047;',
      '}',

      '#noel-guirlande>.element>.motif{',
        'position:absolute;',
        'top:13px;',
        'left:0;',
        'width:22px;',
        'height:26px;',
        'box-sizing:border-box;',
        'transform-origin:50%~0;',
      '}',

      /* Décalage des animations */
      '#noel-guirlande>.element:nth-child(4n+2)>.motif{',
        'animation-delay:-.7s;',
      '}',

      '#noel-guirlande>.element:nth-child(4n+3)>.motif{',
        'animation-delay:-1.5s;',
      '}',

      '#noel-guirlande>.element:nth-child(4n)>.motif{',
        'animation-delay:-2.3s;',
      '}',

      /* 1. Ampoules */
      '#noel-guirlande.ampoules>.element>.motif{',
        'left:4px;',
        'width:14px;',
        'height:24px;',
        'border-radius:45%~45%~50%~50%;',
        'background:#ef5350;',
        'box-shadow:0~0~9px~#ef5350;',
        'animation:noel-lueur~1.8s~ease-in-out~infinite~alternate;',
      '}',

      '#noel-guirlande.ampoules>.element:nth-child(3n+2)>.motif{',
        'background:#ffd54f;',
        'box-shadow:0~0~9px~#ffd54f;',
      '}',

      '#noel-guirlande.ampoules>.element:nth-child(3n)>.motif{',
        'background:#66bb6a;',
        'box-shadow:0~0~9px~#66bb6a;',
      '}',

      '#noel-guirlande.ampoules>.element>.motif::before{',
        'content:"";',
        'position:absolute;',
        'top:-5px;',
        'left:3px;',
        'width:8px;',
        'height:6px;',
        'border-radius:2px;',
        'background:#445047;',
      '}',

      '@keyframes noel-lueur{',
        'from{opacity:1;}',
        'to{opacity:.4;}',
      '}',

      /* 2. Boules */
      '#noel-guirlande.boules>.element>.motif{',
        'border-radius:50%;',
        'background:radial-gradient(',
          'circle~at~32%~27%,',
          '#ffffff,#d62828~48%,#801515',
        ');',
        'animation:noel-balancement~3.6s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.boules>.element:nth-child(3n+2)>.motif{',
        'background:radial-gradient(',
          'circle~at~32%~27%,',
          '#ffffff,#e9ba45~48%,#a46915',
        ');',
      '}',

      '#noel-guirlande.boules>.element:nth-child(3n)>.motif{',
        'background:radial-gradient(',
          'circle~at~32%~27%,',
          '#ffffff,#32885b~48%,#145039',
        ');',
      '}',

      '#noel-guirlande.boules>.element>.motif::before{',
        'content:"";',
        'position:absolute;',
        'top:-5px;',
        'left:7px;',
        'width:8px;',
        'height:6px;',
        'border-radius:2px~2px~0~0;',
        'background:#bfa35a;',
      '}',

      '@keyframes noel-balancement{',
        '0%,100%{transform:rotate(-6deg);}',
        '50%{transform:rotate(6deg);}',
      '}',

      /* 3. Étoiles */
      '#noel-guirlande.etoiles>.element>.motif{',
        'background:#e7b943;',
        'clip-path:polygon(',
          '50%~0%,62%~35%,100%~38%,71%~61%,81%~100%,',
          '50%~78%,19%~100%,29%~61%,0~38%,38%~35%',
        ');',
        'animation:noel-scintille~2.8s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.etoiles>.element:nth-child(even)>.motif{',
        'background:#f4d780;',
      '}',

      '@keyframes noel-scintille{',
        '0%,100%{transform:scale(.88);opacity:.65;}',
        '50%{transform:scale(1.1);opacity:1;}',
      '}',

      /* 4. Sapins */
      '#noel-guirlande.sapins>.element>.motif{',
        'background:linear-gradient(90deg,#155f3d,#48a46d,#155f3d);',
        'clip-path:polygon(',
          '50%~0,86%~42%,72%~42%,100%~84%,',
          '59%~84%,59%~100%,41%~100%,41%~84%,',
          '0~84%,28%~42%,14%~42%',
        ');',
        'animation:noel-sapin~4.4s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.sapins>.element:nth-child(4n+2)>.motif{',
        'background:linear-gradient(90deg,#996a18,#e4bd5e,#996a18);',
      '}',

      '#noel-guirlande.sapins>.element:nth-child(4n+3)>.motif{',
        'background:linear-gradient(90deg,#772038,#c64b5a,#772038);',
      '}',

      '#noel-guirlande.sapins>.element:nth-child(4n)>.motif{',
        'background:linear-gradient(90deg,#367788,#9cd9df,#367788);',
      '}',

      '@keyframes noel-sapin{',
        '0%,100%{transform:rotate(-3deg);}',
        '50%{transform:rotate(3deg);}',
      '}',

      /* 5. Flocons */
      '#noel-guirlande.flocons>.element>.motif{',
        'height:24px;',
        'color:#c7eeff;',
        'background:',
          'linear-gradient(',
            '45deg,transparent~47%,currentColor~49%,',
            'currentColor~51%,transparent~53%',
          '),',
          'linear-gradient(',
            '-45deg,transparent~47%,currentColor~49%,',
            'currentColor~51%,transparent~53%',
          ');',
        'filter:drop-shadow(0~0~3px~#87c9e9);',
        'animation:noel-flocon~3.7s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.flocons>.element>.motif::before{',
        'content:"";',
        'position:absolute;',
        'top:0;',
        'left:10px;',
        'width:2px;',
        'height:24px;',
        'background:currentColor;',
      '}',

      '#noel-guirlande.flocons>.element>.motif::after{',
        'content:"";',
        'position:absolute;',
        'top:11px;',
        'left:0;',
        'width:22px;',
        'height:2px;',
        'background:currentColor;',
      '}',

      '#noel-guirlande.flocons>.element:nth-child(even)>.motif{',
        'color:#eaf8ff;',
      '}',

      '@keyframes noel-flocon{',
        '0%,100%{transform:rotate(-5deg);opacity:.7;}',
        '50%{transform:rotate(5deg);opacity:1;}',
      '}',

      /* 6. Fanions */
      '#noel-guirlande.fanions>.element>.motif{',
        'height:30px;',
        'background:#bb2538;',
        'clip-path:polygon(',
          '0~0,100%~0,100%~100%,50%~75%,0~100%',
        ');',
        'animation:noel-fanion~2.6s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.fanions>.element:nth-child(5n+2)>.motif{',
        'background:#27794c;',
      '}',

      '#noel-guirlande.fanions>.element:nth-child(5n+3)>.motif{',
        'background:#d8ad48;',
      '}',

      '#noel-guirlande.fanions>.element:nth-child(5n+4)>.motif{',
        'background:#82253f;',
      '}',

      '#noel-guirlande.fanions>.element:nth-child(5n)>.motif{',
        'background:#78aeb9;',
      '}',

      '@keyframes noel-fanion{',
        '0%,100%{transform:rotate(-6deg)~skewX(-2deg);}',
        '50%{transform:rotate(6deg)~skewX(2deg);}',
      '}',

      /* 7. Bougies */
      '#noel-guirlande.bougies>.element>.motif{',
        'top:17px;',
        'left:5px;',
        'width:12px;',
        'height:22px;',
        'border-radius:2px~2px~1px~1px;',
        'background:linear-gradient(90deg,#8d2433,#df5a61,#8d2433);',
        'box-shadow:0~2px~4px~#0003;',
      '}',

      '#noel-guirlande.bougies>.element:nth-child(3n+2)>.motif{',
        'background:linear-gradient(90deg,#c5aa70,#fff1ca,#c5aa70);',
      '}',

      '#noel-guirlande.bougies>.element:nth-child(3n)>.motif{',
        'background:linear-gradient(90deg,#246142,#65ad78,#246142);',
      '}',

      '#noel-guirlande.bougies>.element>.motif::before{',
        'content:"";',
        'position:absolute;',
        'top:-13px;',
        'left:3px;',
        'width:6px;',
        'height:12px;',
        'border-radius:80%~20%~70%~40%;',
        'background:radial-gradient(',
          'circle~at~50%~75%,#fff6ad,#ffbd4d~60%,#f07524',
        ');',
        'box-shadow:0~0~7px~#ffbd4d;',
        'transform-origin:50%~100%;',
        'animation:noel-flamme~1.2s~ease-in-out~infinite;',
      '}',

      '#noel-guirlande.bougies>.element>.motif::after{',
        'content:"";',
        'position:absolute;',
        'top:-4px;',
        'left:5px;',
        'width:2px;',
        'height:4px;',
        'background:#514131;',
      '}',

      '#noel-guirlande.bougies>.element:nth-child(3n+2)>.motif::before{',
        'animation-delay:-.4s;',
      '}',

      '#noel-guirlande.bougies>.element:nth-child(3n)>.motif::before{',
        'animation-delay:-.8s;',
      '}',

      '@keyframes noel-flamme{',
        '0%,100%{transform:rotate(-7deg)~scale(.9);opacity:.8;}',
        '50%{transform:rotate(7deg)~scale(1.12);opacity:1;}',
      '}',

      /* Atelier de Noël : panneau et cartes de choix */
      '#noel-choix-guirlande{',
        'position:fixed;right:16px;bottom:16px;z-index:9999;',
        'font:14px~Arial,sans-serif;line-height:1.35;color:#392313;',
      '}',
      '#noel-choix-guirlande>button{',
        'display:flex;align-items:center;cursor:pointer;',
        'padding:8px~11px;border:2px~solid~#f0c368;',
        'border-radius:10px;background:linear-gradient(#b84727,#7e2016);',
        'color:#fff3d3;font:700~14px~Arial,sans-serif;',
        'box-shadow:0~3px~0~#54210f,0~7px~16px~#0004;',
      '}',
      '#noel-choix-guirlande>button::before{',
        'content:"";display:inline-block;flex:none;width:14px;height:14px;',
        'margin-right:9px;background:#ffe6a6;',
        'clip-path:polygon(50%~0,62%~35%,100%~38%,71%~61%,',
          '81%~100%,50%~78%,19%~100%,29%~61%,0~38%,38%~35%);',
      '}',
      '#noel-choix-guirlande>button:hover{',
        'background:linear-gradient(#cb5630,#912718);',
      '}',
      '#noel-choix-guirlande button:focus-visible,',
      '#noel-choix-guirlande input:focus-visible{',
        'outline:3px~solid~#27623d;outline-offset:2px;',
      '}',
      '#noel-options{',
        'position:absolute;right:0;bottom:calc(100%~+~9px);',
        'display:grid;align-content:start;gap:4px;width:350px;',
        'max-width:calc(100vw~-~24px);',
        'max-height:calc(100vh~-~75px);overflow-y:auto;',
        'box-sizing:border-box;padding:8px;',
        'border:2px~solid~#b6813f;border-radius:12px;',
        'background:#f2dfb5;',
        'box-shadow:0~0~0~4px~#542916,0~10px~25px~#0005;',
      '}',
      '#noel-options[hidden]{display:none!important;}',
      '#noel-compte-rebours{',
        'position:relative;overflow:hidden;padding:8px~10px;',
        'border:1px~solid~#c99458;border-radius:9px;',
        'background:linear-gradient(125deg,#76291e,#9c3726);',
        'color:#fff4dd;',
      '}',
      '#noel-compte-rebours-titre{',
        'display:block;margin:0~0~6px;',
        'font:700~12px~Georgia,serif;letter-spacing:.3px;',
      '}',
      '#noel-compte-rebours::after{',
        'content:"";position:absolute;right:12px;top:8px;',
        'width:12px;height:12px;background:#ffe5a5;',
        'clip-path:polygon(50%~0,62%~35%,100%~38%,71%~61%,',
          '81%~100%,50%~78%,19%~100%,29%~61%,0~38%,38%~35%);',
        'animation:noel-scintillement~5s~ease-in-out~infinite;',
      '}',
      '@keyframes~noel-scintillement{',
        '0%,75%,100%{opacity:.35;transform:scale(.85);}',
        '85%{opacity:1;transform:scale(1.15);}',
      '}',
      '#noel-compte-rebours-list{',
        'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;',
      '}',
      '.noel-compteur{',
        'display:flex;align-items:center;justify-content:space-between;',
        'gap:5px;min-width:0;padding:5px~8px;',
        'border:1px~solid~#d29c63;border-radius:7px;',
        'background:#fff8e8;color:#5b2e20;',
      '}',
      '.noel-compteur>span{font:700~10px~Arial,sans-serif;}',
      '.noel-compteur>strong{',
        'font:700~15px~Georgia,serif;white-space:nowrap;',
        'color:#9b2d20;',
      '}',
      '.noel-compteur>strong.noel-message{',
        'font-size:11px;line-height:1.1;white-space:normal;',
        'text-align:right;',
      '}',
      '#noel-guirlandes,#noel-neige,#noel-curseurs{',
        'min-width:0;padding:8px;border:1px~solid~#c39152;',
        'border-radius:9px;background:#f8eccf;',
      '}',
      '#noel-guirlandes,#noel-curseurs{',
        'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;',
      '}',
      '.noel-section-titre{',
        'grid-column:1/-1;display:block;',
        'min-height:22px;margin:0;',
        'color:#542517;font:700~17px~Georgia,serif;',
      '}',
      '#noel-guirlandes>button,#noel-curseurs>button{',
        'position:relative;display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;gap:2px;',
        'min-width:0;min-height:56px;padding:4px~2px;cursor:pointer;',
        'border:1px~solid~#d4b680;border-radius:9px;',
        'background:#fffcf2;color:#51331f;',
        'font:700~10px~Arial,sans-serif;text-align:center;',
      '}',
      '#noel-guirlandes>button:hover,#noel-curseurs>button:hover{',
        'background:#ffe9b6;',
      '}',
      '#noel-guirlandes>button[aria-pressed="true"],',
      '#noel-curseurs>button[aria-pressed="true"]{',
        'border:2px~solid~#28704b;background:#e6f0df;color:#265b39;',
      '}',
      '#noel-guirlandes>button[aria-pressed="true"]::after,',
      '#noel-curseurs>button[aria-pressed="true"]::after{',
        'content:"✓";position:absolute;right:3px;top:3px;',
        'width:14px;height:14px;border-radius:50%;',
        'background:#257447;color:white;font:700~11px/14px~Arial,sans-serif;',
      '}',
      '.noel-garland-icone{',
        'display:flex;align-items:center;justify-content:center;',
        'width:27px;height:28px;',
      '}',
      '#noel-neige{display:flex;flex-direction:column;gap:5px;}',
      '#noel-neige>label,#noel-neige>.noel-intensite,',
      '#noel-neige>#noel-neige-note{margin:0!important;}',
      '#noel-neige>label,.noel-intensite{',
        'display:flex;align-items:center;justify-content:space-between;',
        'gap:6px;min-height:36px;box-sizing:border-box;',
        'padding:5px~8px;border:1px~solid~#d5bb85;',
        'border-radius:8px;background:#fffcf2;',
        'color:#50321f;font:700~11px~Arial,sans-serif;',
      '}',
      '#noel-neige>.noel-intensite{',
        'display:flex;align-items:center;gap:5px;',
      '}',
      '#noel-neige>label{cursor:pointer;}',
      '#noel-neige>label>span{min-width:0;}',
      '#noel-neige>label>input[type="checkbox"]{',
        'appearance:none;-webkit-appearance:none;flex:none;',
        'width:36px;height:20px;margin:0;cursor:pointer;',
        'border:1px~solid~#b1a185;border-radius:12px;',
        'background:#c7bea9;transition:background~.2s;',
      '}',
      '#noel-neige>label>input[type="checkbox"]::before{',
        'content:"";display:block;width:16px;height:16px;',
        'margin:1px;border-radius:50%;background:#fffaf0;',
        'box-shadow:0~0~2px~#0005;transition:transform~.2s;',
      '}',
      '#noel-neige>label>input[type="checkbox"]:checked{',
        'background:#236340;',
      '}',
      '#noel-neige>label>input[type="checkbox"]:checked::before{',
        'transform:translateX(16px);',
      '}',
      '.noel-intensite>span{flex:0~0~43%;min-width:0;}',
      '.noel-reglette{',
        'display:flex;flex:1;flex-direction:column;gap:2px;',
        'justify-content:center;min-width:0;',
      '}',
      '.noel-reglette input[type="range"]{',
        '-webkit-appearance:none;appearance:none;display:block;',
        'width:calc(100%~-~14px);height:18px;margin:0~7px;',
        'padding:0;border:0;background:transparent;cursor:pointer;',
      '}',
      '.noel-reglette input::-webkit-slider-runnable-track{',
        'height:5px;border-radius:9px;background:#cbb58e;',
      '}',
      '.noel-reglette input::-moz-range-track{',
        'height:5px;border-radius:9px;background:#cbb58e;',
      '}',
      '.noel-reglette input::-webkit-slider-thumb{',
        '-webkit-appearance:none;appearance:none;',
        'width:17px;height:17px;margin-top:-6px;',
        'border:2px~solid~#fffaf0;border-radius:50%;',
        'background:#27623d;box-shadow:0~0~0~1px~#27623d;',
      '}',
      '.noel-reglette input::-moz-range-thumb{',
        'width:13px;height:13px;border:2px~solid~#fffaf0;',
        'border-radius:50%;background:#27623d;',
        'box-shadow:0~0~0~1px~#27623d;',
      '}',
      '.noel-reglette-etapes{',
        'display:flex;justify-content:space-between;',
        'color:#806b52;font:9px~Arial,sans-serif;',
      '}',
      '.noel-reglette[data-niveau="douce"] .noel-reglette-etapes span:first-child,',
      '.noel-reglette[data-niveau="normale"] .noel-reglette-etapes span:nth-child(2),',
      '.noel-reglette[data-niveau="abondante"] .noel-reglette-etapes span:last-child{',
        'color:#235e3b;font-weight:700;',
      '}',
      '.noel-reglette input:disabled{opacity:.5;cursor:not-allowed;}',
      '#noel-neige>label>input:disabled{opacity:.5;cursor:not-allowed;}',
      '#noel-neige-note{',
        'padding:5px~8px;border:1px~solid~#d5bb85;',
        'border-radius:8px;background:#fffcf2;',
        'color:#705c46;font:10px~Arial,sans-serif;',
      '}',
      '#noel-neige-note[hidden]{display:none;}',
      '#noel-neige-ciel,#noel-neige-sol{pointer-events:none;}',
      '#noel-curseurs{grid-template-columns:repeat(3,minmax(0,1fr));}',
      '#noel-curseurs{margin-bottom:0!important;}',
      '#noel-curseurs>button{min-height:54px;}',
      '#noel-lien-concours{',
        'display:block;grid-column:1/-1;box-sizing:border-box;',
        'margin:0!important;padding:9px~7px;',
        'border:1px~solid~#d9ab64;border-radius:7px;',
        'background:#9b2d20;color:#fff7e2;',
        'font:700~11px~Arial,sans-serif;text-align:center;',
        'text-decoration:none;',
      '}',
      '#noel-lien-concours:hover{background:#b33c29;}',
      '.noel-icone{',
        'position:relative;',
        'display:block;',
        'flex:none;',
        'width:24px;',
        'height:26px;',
        'box-sizing:border-box;',
      '}',
      '.noel-icone.ampoules{',
        'width:17px;height:23px;border-radius:48%~48%~45%~45%;',
        'background:#db3b3f;box-shadow:0~0~6px~#eebd83;',
      '}',
      '.noel-icone.ampoules::before{',
        'content:"";position:absolute;top:-4px;left:5px;',
        'width:7px;height:5px;border-radius:2px;background:#806552;',
      '}',
      '.noel-icone.fanions{',
        'width:23px;height:27px;background:#a92e37;',
        'clip-path:polygon(0~0,100%~0,100%~100%,50%~74%,0~100%);',
      '}',
      '.noel-icone.aucune{',
        'width:25px;height:25px;border:3px~solid~#844c38;',
        'border-radius:50%;',
      '}',
      '.noel-icone.aucune::before{',
        'content:"";position:absolute;left:9px;top:-6px;',
        'width:5px;height:14px;border:2px~solid~#fffcf2;',
        'border-radius:2px;background:#844c38;',
      '}',
      '.noel-icone.normal{',
        'font:700~25px/26px~Arial,sans-serif;',
        'text-align:center;',
      '}',
      '.noel-icone.flocon{',
        'color:#6ab7db;',
        'font:700~29px/26px~Georgia,serif;',
        'text-align:center;',
        'text-shadow:0~1px~3px~#326789;',
      '}',
      '.noel-icone.etoile{',
        'background:#edb83c;',
        'clip-path:polygon(50%~0%,62%~35%,100%~38%,',
          '71%~61%,81%~100%,50%~78%,19%~100%,',
          '29%~61%,0~38%,38%~35%);',
        'filter:drop-shadow(0~0~3px~#ffd66b);',
      '}',
      '.noel-icone.sapin{',
        'background:linear-gradient(90deg,#16613d,#64ae70,#16613d);',
        'clip-path:polygon(50%~0,82%~40%,68%~40%,',
          '100%~85%,58%~85%,58%~100%,42%~100%,',
          '42%~85%,0~85%,32%~40%,18%~40%);',
      '}',
      '.noel-icone.boule{',
        'width:23px;',
        'height:23px;',
        'margin-top:3px;',
        'border-radius:50%;',
        'background:radial-gradient(circle~at~32%~28%,',
          '#fff,#d84043~42%,#831c27);',
        'box-shadow:0~1px~4px~#79292766;',
      '}',
      '.noel-icone.boule::before{',
        'content:"";',
        'position:absolute;',
        'top:-3px;',
        'left:8px;',
        'width:7px;',
        'height:4px;',
        'background:#d6ad54;',
      '}',
      '.noel-icone.bougie{',
        'width:12px;',
        'height:19px;',
        'margin-top:7px;',
        'margin-left:6px;',
        'border-radius:2px~2px~1px~1px;',
        'background:linear-gradient(90deg,#8d2433,#e26065,#8d2433);',
        'box-shadow:0~2px~4px~#0004;',
      '}',
      '.noel-icone.bougie::before{',
        'content:"";',
        'position:absolute;',
        'top:-12px;',
        'left:3px;',
        'width:6px;',
        'height:10px;',
        'border-radius:80%~20%~70%~40%;',
        'background:radial-gradient(circle~at~50%~75%,',
          '#fff6ad,#ffbd4d~60%,#f07524);',
        'box-shadow:0~0~7px~#ffbd4d;',
        'transform-origin:50%~100%;',
        'animation:noel-flamme~1.2s~ease-in-out~infinite;',
      '}',
      '.noel-icone.bougie::after{',
        'content:"";',
        'position:absolute;',
        'top:-4px;',
        'left:5px;',
        'width:2px;',
        'height:4px;',
        'background:#514131;',
      '}',
      '#noel-motif-curseur{',
        'position:fixed;',
        'left:0;',
        'top:0;',
        'z-index:10000;',
        'display:none;',
        'pointer-events:none;',
        'user-select:none;',
        'will-change:transform;',
        'filter:drop-shadow(0~2px~3px~#0005);',
      '}',
      '@media(hover:none),(pointer:coarse){',
        '#noel-motif-curseur{display:none!important;}',
      '}',

      '@media(max-width:767px),(hover:none)~and~(pointer:coarse){',
        '#noel-choix-guirlande,#noel-guirlande,',
        '#noel-neige-ciel,#noel-neige-sol,#noel-motif-curseur{',
          'display:none!important;',
        '}',
      '}',

      '@media(max-width:420px){',
        '#noel-options{right:-5px;}',
        '.noel-intensite>span{flex-basis:39%;}',
        '.noel-reglette-etapes{font-size:8px;}',
        '.noel-compteur{padding:5px;}',
        '.noel-compteur>span{font-size:9px;}',
        '.noel-compteur>strong{font-size:13px;}',
      '}',

      /* Réduction des animations des guirlandes */
      '@media(prefers-reduced-motion:reduce){',
        '#noel-guirlande>.element>.motif,',
        '#noel-guirlande>.element>.motif::before{',
          'animation:none!important;',
          'transform:none!important;',
          'opacity:1!important;',
        '}',
        '.noel-icone.bougie::before{animation:none!important;}',
        '#noel-compte-rebours::after{animation:none!important;}',
      '}'
    ];

    var css = document.createElement('style');

    css.textContent = reglesCSS.join('').replace(
      /~/g,
      String.fromCharCode(32)
    );

    document.head.appendChild(css);

    var guirlande = document.createElement('div');
    guirlande.id = 'noel-guirlande';
    guirlande.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guirlande);

    var commande = document.createElement('div');
    commande.id = 'noel-choix-guirlande';

    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = classesBouton;
    bouton.textContent = 'L’Atelier de Noël';
    bouton.setAttribute(
      'aria-label',
      'Personnaliser mes décorations de Noël'
    );
    bouton.setAttribute('aria-expanded', 'false');
    bouton.setAttribute('aria-controls', 'noel-options');
    commande.appendChild(bouton);

    var options = document.createElement('div');
    options.id = 'noel-options';
    options.hidden = true;
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', 'Atelier de Noël');

    var entete = document.createElement('header');
    entete.id = 'noel-compte-rebours';
    var titreEntete = document.createElement('span');
    titreEntete.id = 'noel-compte-rebours-titre';
    titreEntete.textContent = 'Les fêtes approchent';
    entete.appendChild(titreEntete);
    var compteurs = document.createElement('div');
    compteurs.id = 'noel-compte-rebours-list';

    function creerCompteur(nom) {
      var bloc = document.createElement('div');
      bloc.className = 'noel-compteur';
      var libelle = document.createElement('span');
      libelle.textContent = nom;
      bloc.appendChild(libelle);
      var valeur = document.createElement('strong');
      bloc.appendChild(valeur);
      compteurs.appendChild(bloc);
      return valeur;
    }

    var valeurNoel = creerCompteur('Noël');
    var valeurNouvelAn = creerCompteur('Nouvel An');
    entete.appendChild(compteurs);
    options.appendChild(entete);

    function actualiserCompteRebours() {
      var maintenant = new Date();
      var annee = maintenant.getFullYear();
      var mois = maintenant.getMonth() + 1;
      var jour = maintenant.getDate();
      var heure = maintenant.getHours();
      var minute = maintenant.getMinutes();
      try {
        var morceaux = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).formatToParts(maintenant);
        for (var t = 0; t < morceaux.length; t++) {
          if (morceaux[t].type === 'year') annee = Number(morceaux[t].value);
          if (morceaux[t].type === 'month') mois = Number(morceaux[t].value);
          if (morceaux[t].type === 'day') jour = Number(morceaux[t].value);
          if (morceaux[t].type === 'hour') heure = Number(morceaux[t].value) % 24;
          if (morceaux[t].type === 'minute') minute = Number(morceaux[t].value);
        }
      } catch (e) {
        /* La date locale sert de repli. */
      }
      var aujourdHui = Date.UTC(annee, mois - 1, jour);
      function joursAvant(a, m, j) {
        return Math.round((Date.UTC(a, m - 1, j) - aujourdHui) / 86400000);
      }
      var joursNoel = joursAvant(annee, 12, 25);
      var joursNouvelAn = joursAvant(
        mois === 1 && jour === 1 ? annee : annee + 1, 1, 1
      );
      function texteRestant(jours) {
        if (jours > 1) return 'J-' + jours;
        var minutesRestantes = jours * 1440 - heure * 60 - minute;
        if (minutesRestantes >= 60) {
          var heures = Math.floor(minutesRestantes / 60);
          var minutes = minutesRestantes % 60;
          return heures + ' h ' + (minutes < 10 ? '0' : '') + minutes;
        }
        return minutesRestantes + ' min';
      }
      valeurNoel.className = joursNoel <= 0 ? 'noel-message' : '';
      valeurNouvelAn.className = joursNouvelAn === 0 ?
        'noel-message' : '';
      valeurNoel.textContent = joursNoel === 0 ? 'Joyeux Noël' :
        (joursNoel < 0 ? 'Joyeuses fêtes' : texteRestant(joursNoel));
      valeurNouvelAn.textContent = joursNouvelAn === 0 ?
        'Bonne année' : texteRestant(joursNouvelAn);
    }
    actualiserCompteRebours();
    window.setInterval(actualiserCompteRebours, 60000);

    function titreSection(texte) {
      var titre = document.createElement('h2');
      titre.className = 'noel-section-titre';
      titre.textContent = texte;
      return titre;
    }

    var panneauGuirlandes = document.createElement('section');
    panneauGuirlandes.id = 'noel-guirlandes';
    var titreGuirlandes = titreSection('Guirlande');
    titreGuirlandes.id = 'noel-guirlandes-titre';
    panneauGuirlandes.setAttribute('aria-labelledby', titreGuirlandes.id);
    panneauGuirlandes.appendChild(titreGuirlandes);
    options.appendChild(panneauGuirlandes);

    commande.appendChild(options);
    document.body.appendChild(commande);

    function placer() {
      if (estMobile()) {
        guirlande.style.visibility = 'hidden';
        return;
      }
      var ancrage = trouverAncrage();

      if (!ancrage) {
        guirlande.style.visibility = 'hidden';
        return;
      }

      guirlande.style.visibility = 'visible';

      var cadre = ancrage.element.getBoundingClientRect();
      var position = getComputedStyle(ancrage.element).position;

      var bord = ancrage.bord === 'bas'
        ? cadre.bottom
        : cadre.top;

      var fixe = ancrage.fixe || position === 'fixed';
      var largeur = document.documentElement.clientWidth;

      guirlande.style.position = fixe ? 'fixed' : 'absolute';
      guirlande.style.top =
        (bord + (fixe ? 0 : window.pageYOffset)) + 'px';

      guirlande.style.left =
        (fixe ? 0 : window.pageXOffset) + 'px';

      guirlande.style.width = largeur + 'px';

      var nombre = Math.ceil(largeur / 36) + 2;

      if (guirlande.children.length !== nombre) {
        guirlande.textContent = '';

        for (var i = 0; i < nombre; i++) {
          var element = document.createElement('span');
          element.className = 'element';

          var motif = document.createElement('span');
          motif.className = 'motif';

          element.appendChild(motif);
          guirlande.appendChild(element);
        }
      }
    }

    var placementProgramme = false;

    function demanderPlacement() {
      if (placementProgramme) return;

      placementProgramme = true;

      window.requestAnimationFrame(function () {
        placementProgramme = false;
        placer();
      });
    }

    function choisir(nom) {
      guirlande.className = nom;
      guirlande.style.display =
        nom === 'aucune' ? 'none' : 'flex';

      enregistrerChoix(nom);

      var boutons = panneauGuirlandes.querySelectorAll('button[data-style]');

      for (var i = 0; i < boutons.length; i++) {
        var actif =
          boutons[i].getAttribute('data-style') === nom;

        boutons[i].setAttribute(
          'aria-pressed',
          actif ? 'true' : 'false'
        );
      }
    }

    for (var j = 0; j < styles.length; j++) {
      (function (style) {
        var choix = document.createElement('button');
        choix.type = 'button';
        choix.setAttribute('data-style', style[0]);
        var ico = document.createElement('span');
        ico.className = 'noel-garland-icone';
        ico.setAttribute('aria-hidden', 'true');
        var forme = style[0] === 'boules' ? 'boule' :
          (style[0] === 'etoiles' ? 'etoile' :
          (style[0] === 'sapins' ? 'sapin' :
          (style[0] === 'flocons' ? 'flocon' :
          (style[0] === 'bougies' ? 'bougie' : style[0]))));
        var dessin = creerIcone(forme);
        ico.appendChild(dessin);
        choix.appendChild(ico);
        var nom = document.createElement('span');
        nom.textContent = style[0] === 'aucune' ? 'Off' :
          (style[0] === 'boules' ? 'Boules' :
          (style[0] === 'sapins' ? 'Sapins' :
          (style[0] === 'fanions' ? 'Fanions' : style[1])));
        choix.setAttribute('aria-label', style[1]);
        choix.appendChild(nom);

        choix.addEventListener('click', function () {
          choisir(style[0]);
        });

        panneauGuirlandes.appendChild(choix);
      })(styles[j]);
    }

    /* Neige : réglages indépendants de la guirlande. */
    var neige = {
      actif: false,
      intensite: 'normale',
      souris: false,
      sol: false
    };

    try {
      var ancien = JSON.parse(localStorage.getItem(cleNeige) || '{}');
      neige.actif = ancien.actif === true;
      neige.souris = ancien.souris === true;
      neige.sol = ancien.sol === true;
      if (/^(douce|normale|abondante)$/.test(ancien.intensite)) {
        neige.intensite = ancien.intensite;
      }
    } catch (e) {
      /* Réglages par défaut si le stockage n'est pas disponible. */
    }

    function sauverNeige() {
      try {
        localStorage.setItem(cleNeige, JSON.stringify(neige));
      } catch (e) {
        /* Les réglages restent actifs pendant cette visite. */
      }
    }

    var panneauNeige = document.createElement('section');
    panneauNeige.id = 'noel-neige';
    panneauNeige.setAttribute('aria-labelledby', 'noel-neige-titre');

    var titreNeige = titreSection('Neige');
    titreNeige.id = 'noel-neige-titre';
    panneauNeige.appendChild(titreNeige);

    function ligneReglage(texte, controle) {
      var ligne = document.createElement('label');
      var libelle = document.createElement('span');
      libelle.textContent = texte;
      ligne.appendChild(libelle);
      ligne.appendChild(controle);
      panneauNeige.appendChild(ligne);
      return controle;
    }

    var neigeActive = document.createElement('input');
    neigeActive.type = 'checkbox';
    neigeActive.checked = neige.actif;
    ligneReglage('Faire tomber la neige', neigeActive);

    var ligneIntensite = document.createElement('div');
    ligneIntensite.className = 'noel-intensite';
    var libelleIntensite = document.createElement('span');
    libelleIntensite.id = 'noel-intensite-libelle';
    libelleIntensite.textContent = 'Intensité de la chute';
    ligneIntensite.appendChild(libelleIntensite);
    var reglette = document.createElement('div');
    reglette.className = 'noel-reglette';
    var intensites = [
      ['douce', 'Douce'],
      ['normale', 'Normale'],
      ['abondante', 'Forte']
    ];
    var intensite = document.createElement('input');
    intensite.type = 'range';
    intensite.min = '0';
    intensite.max = '2';
    intensite.step = '1';
    intensite.setAttribute('aria-labelledby', libelleIntensite.id);
    var etapes = document.createElement('div');
    etapes.className = 'noel-reglette-etapes';
    for (var n = 0; n < intensites.length; n++) {
      var texteVitesse = document.createElement('span');
      texteVitesse.textContent = intensites[n][1];
      etapes.appendChild(texteVitesse);
    }
    function afficherIntensite() {
      var position = 1;
      for (var i = 0; i < intensites.length; i++) {
        if (intensites[i][0] === neige.intensite) position = i;
      }
      intensite.value = String(position);
      intensite.setAttribute('aria-valuetext', intensites[position][1]);
      reglette.setAttribute('data-niveau', neige.intensite);
    }
    reglette.appendChild(intensite);
    reglette.appendChild(etapes);
    ligneIntensite.appendChild(reglette);
    panneauNeige.appendChild(ligneIntensite);
    afficherIntensite();

    var suivreSouris = document.createElement('input');
    suivreSouris.type = 'checkbox';
    suivreSouris.checked = neige.souris;
    ligneReglage('Les flocons suivent la souris', suivreSouris);

    var neigeAuSol = document.createElement('input');
    neigeAuSol.type = 'checkbox';
    neigeAuSol.checked = neige.sol;
    ligneReglage('Neige au pied de page', neigeAuSol);

    var noteNeige = document.createElement('p');
    noteNeige.id = 'noel-neige-note';
    noteNeige.textContent =
      'Passez la souris sur la neige au sol pour la disperser.';
    panneauNeige.appendChild(noteNeige);
    options.appendChild(panneauNeige);

    var ciel = null;
    var sol = null;
    var dessinCiel = null;
    var dessinSol = null;
    var floconsNeige = [];
    var eclats = [];
    var tas = [];
    var largeurNeige = 0;
    var hauteurNeige = 0;
    var largeurSol = 0;
    var debutSol = 0;
    var trame = 0;
    var precedent = 0;
    var derniereMesure = 0;
    var pointeur = null;
    var largeurColonne = 12;
    var hauteurSol = 68;

    function nombreFlocons() {
      var base = 46;
      var mobile = window.innerWidth < 600;
      var reduction = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return Math.round(base * (mobile ? 0.55 : 1) *
        (reduction ? 0.5 : 1));
    }

    function vitesseChute() {
      return {
        douce: 0.55,
        normale: 1,
        abondante: 1.8
      }[neige.intensite] || 1;
    }

    function nouveauFlocon(repartir) {
      return {
        x: Math.random() * largeurNeige,
        y: repartir
          ? Math.random() * hauteurNeige
          : -10 - Math.random() * 35,
        taille: 1.4 + Math.random() * 2.6,
        vitesse: 40 + Math.random() * 45,
        derive: (Math.random() - 0.5) * 21,
        phase: Math.random() * 6.28
      };
    }

    function ajusterNombre() {
      var cible = nombreFlocons();
      while (floconsNeige.length < cible) {
        floconsNeige.push(nouveauFlocon(true));
      }
      if (floconsNeige.length > cible) {
        floconsNeige.length = cible;
      }
    }

    function dimensionnerCanvas(canvas, contexte, largeur, hauteur) {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = largeur + 'px';
      canvas.style.height = hauteur + 'px';
      canvas.width = Math.round(largeur * ratio);
      canvas.height = Math.round(hauteur * ratio);
      contexte.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function dimensionnerNeige() {
      if (!ciel) return;
      var largeur = document.documentElement.clientWidth;
      var hauteur = window.innerHeight;
      if (largeur !== largeurNeige || hauteur !== hauteurNeige) {
        largeurNeige = largeur;
        hauteurNeige = hauteur;
        dimensionnerCanvas(ciel, dessinCiel, largeur, hauteur);
        ajusterNombre();
      }
      if (neige.sol) positionnerSol();
    }

    function positionnerSol() {
      if (!sol) return;
      var largeur = document.documentElement.clientWidth;
      var documentHauteur = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      debutSol = documentHauteur - hauteurSol;
      sol.style.top = debutSol + 'px';
      if (largeur !== largeurSol) {
        largeurSol = largeur;
        dimensionnerCanvas(sol, dessinSol, largeur, hauteurSol);
        var colonnes = Math.ceil(largeur / largeurColonne);
        while (tas.length < colonnes) tas.push(0);
        tas.length = colonnes;
      }
    }

    function dessinerSol() {
      if (!sol) return;
      dessinSol.clearRect(0, 0, largeurSol, hauteurSol);
      dessinSol.fillStyle = 'rgba(244,250,255,.92)';
      for (var i = 0; i < tas.length; i++) {
        var hauteur = tas[i];
        if (hauteur < 0.3) continue;
        var x = i * largeurColonne;
        var y = hauteurSol - hauteur;
        dessinSol.fillRect(x, y + 2, largeurColonne + 1, hauteur);
        dessinSol.beginPath();
        dessinSol.ellipse(
          x + largeurColonne / 2, y + 2,
          largeurColonne / 1.6, Math.min(3.5, hauteur / 3),
          0, 0, Math.PI * 2
        );
        dessinSol.fill();
      }
    }

    function deplacerPointeur(e) {
      if (e.pointerType === 'touch') return;
      pointeur = { x: e.clientX, y: e.clientY };
      if (!neige.sol || !sol) return;

      var ySol = debutSol - window.pageYOffset;
      if (pointeur.y < ySol - 38 ||
          pointeur.y > ySol + hauteurSol + 8) return;

      var centre = Math.floor(pointeur.x / largeurColonne);
      for (var k = centre - 3; k <= centre + 3; k++) {
        if (k < 0 || k >= tas.length || tas[k] < 1) continue;
        var retire = Math.min(tas[k], 1.8);
        tas[k] -= retire;
        if (eclats.length < 75 && Math.random() < 0.8) {
          eclats.push({
            x: k * largeurColonne + Math.random() * largeurColonne,
            y: ySol + hauteurSol - tas[k],
            vx: (Math.random() - 0.5) * 90,
            vy: -45 - Math.random() * 75,
            vie: 0.45 + Math.random() * 0.45
          });
        }
      }
      dessinerSol();
    }

    function perdrePointeur() {
      pointeur = null;
    }

    function animerNeige(temps) {
      if (!ciel) return;
      trame = window.requestAnimationFrame(animerNeige);
      if (document.hidden) {
        precedent = temps;
        return;
      }
      if (temps - precedent < 30) return;
      var delta = Math.min((temps - (precedent || temps)) / 1000, 0.05);
      precedent = temps;

      if (neige.sol && temps - derniereMesure > 600) {
        derniereMesure = temps;
        positionnerSol();
      }

      dessinCiel.clearRect(0, 0, largeurNeige, hauteurNeige);
      dessinCiel.fillStyle = 'rgba(248,252,255,.95)';
      dessinCiel.strokeStyle = 'rgba(192,223,243,.9)';

      var ySol = neige.sol ? debutSol - window.pageYOffset : Infinity;
      var limite = ySol > -10 && ySol < hauteurNeige
        ? ySol + hauteurSol - 5
        : hauteurNeige + 8;

      for (var i = 0; i < floconsNeige.length; i++) {
        var flocon = floconsNeige[i];
        var vent = Math.sin(temps / 950 + flocon.phase) * 10;
        if (neige.souris && pointeur) {
          var dx = pointeur.x - flocon.x;
          var dy = pointeur.y - flocon.y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 160 && distance > 1) {
            vent += (dx / distance) * (160 - distance) * 0.85;
            flocon.y += (dy / distance) * (160 - distance) *
              0.32 * delta;
          }
        }
        flocon.x += (flocon.derive + vent) * delta;
        flocon.y += flocon.vitesse * vitesseChute() * delta;
        if (flocon.x < -8) flocon.x = largeurNeige + 8;
        if (flocon.x > largeurNeige + 8) flocon.x = -8;

        if (flocon.y > limite) {
          if (neige.sol && tas.length) {
            var colonne = Math.max(0, Math.min(
              tas.length - 1,
              Math.floor(flocon.x / largeurColonne)
            ));
            tas[colonne] = Math.min(32, tas[colonne] +
              flocon.taille * 0.3);
          }
          floconsNeige[i] = nouveauFlocon(false);
          continue;
        }

        dessinCiel.beginPath();
        dessinCiel.arc(
          flocon.x, flocon.y, flocon.taille,
          0, Math.PI * 2
        );
        dessinCiel.fill();
        if (flocon.taille > 3.2) dessinCiel.stroke();
      }

      for (var j = eclats.length - 1; j >= 0; j--) {
        var eclat = eclats[j];
        eclat.vie -= delta;
        if (eclat.vie <= 0) {
          eclats.splice(j, 1);
          continue;
        }
        eclat.x += eclat.vx * delta;
        eclat.y += eclat.vy * delta;
        eclat.vy += 100 * delta;
        dessinCiel.globalAlpha = Math.min(1, eclat.vie * 2);
        dessinCiel.fillRect(eclat.x, eclat.y, 3, 3);
      }
      dessinCiel.globalAlpha = 1;
      if (neige.sol) dessinerSol();
    }

    function enleverSol() {
      if (sol) sol.remove();
      sol = null;
      dessinSol = null;
      largeurSol = 0;
      tas = [];
      eclats = [];
    }

    function creerSol() {
      if (sol || !ciel) return;
      sol = document.createElement('canvas');
      sol.id = 'noel-neige-sol';
      sol.setAttribute('aria-hidden', 'true');
      sol.style.cssText = 'position:absolute;left:0;z-index:9997;';
      dessinSol = sol.getContext('2d');
      if (!dessinSol) {
        enleverSol();
        return;
      }
      document.body.appendChild(sol);
      positionnerSol();
    }

    function demarrerNeige() {
      if (ciel) {
        ajusterNombre();
        if (neige.sol) creerSol();
        else enleverSol();
        return;
      }
      ciel = document.createElement('canvas');
      ciel.id = 'noel-neige-ciel';
      ciel.setAttribute('aria-hidden', 'true');
      ciel.style.cssText =
        'position:fixed;top:0;left:0;z-index:9998;';
      dessinCiel = ciel.getContext('2d');
      if (!dessinCiel) {
        ciel = null;
        dessinCiel = null;
        return;
      }
      document.body.appendChild(ciel);
      document.addEventListener('pointermove', deplacerPointeur,
        { passive: true });
      document.addEventListener('pointerout', perdrePointeur);
      window.addEventListener('resize', dimensionnerNeige);
      window.addEventListener('load', positionnerSol);
      dimensionnerNeige();
      if (neige.sol) creerSol();
      trame = window.requestAnimationFrame(animerNeige);
    }

    function arreterNeige() {
      if (!ciel) return;
      window.cancelAnimationFrame(trame);
      document.removeEventListener('pointermove', deplacerPointeur);
      document.removeEventListener('pointerout', perdrePointeur);
      window.removeEventListener('resize', dimensionnerNeige);
      window.removeEventListener('load', positionnerSol);
      ciel.remove();
      ciel = null;
      dessinCiel = null;
      enleverSol();
      floconsNeige = [];
      pointeur = null;
      precedent = 0;
    }

    function actualiserNeige() {
      intensite.disabled = !neige.actif;
      suivreSouris.disabled = !neige.actif;
      neigeAuSol.disabled = !neige.actif;
      noteNeige.hidden = !neige.actif || !neige.sol;
      if (neige.actif && !estMobile()) demarrerNeige();
      else arreterNeige();
      sauverNeige();
    }

    neigeActive.addEventListener('change', function () {
      neige.actif = neigeActive.checked;
      actualiserNeige();
    });
    intensite.addEventListener('input', function () {
      neige.intensite = intensites[Number(intensite.value)][0];
      afficherIntensite();
      actualiserNeige();
    });
    suivreSouris.addEventListener('change', function () {
      neige.souris = suivreSouris.checked;
      actualiserNeige();
    });
    neigeAuSol.addEventListener('change', function () {
      neige.sol = neigeAuSol.checked;
      actualiserNeige();
    });
    actualiserNeige();

    /* Motifs CSS : la flèche native reste visible et cliquable. */
    var curseurs = [
      ['normal', 'Normal'],
      ['flocon', 'Flocon'],
      ['etoile', 'Étoile'],
      ['sapin', 'Sapin'],
      ['boule', 'Boule'],
      ['bougie', 'Bougie']
    ];
    var choixCurseur = 'normal';
    try {
      var curseurMemorise = localStorage.getItem(cleCurseur);
      if (curseurMemorise === 'sucre') {
        curseurMemorise = 'bougie';
      }
      for (var c = 0; c < curseurs.length; c++) {
        if (curseurs[c][0] === curseurMemorise) {
          choixCurseur = curseurMemorise;
          break;
        }
      }
    } catch (e) {
      /* Choix normal si le stockage est indisponible. */
    }

    var panneauCurseurs = document.createElement('section');
    panneauCurseurs.id = 'noel-curseurs';
    panneauCurseurs.setAttribute(
      'aria-labelledby', 'noel-curseurs-titre'
    );
    var titreCurseurs = titreSection('Curseur');
    titreCurseurs.id = 'noel-curseurs-titre';
    panneauCurseurs.appendChild(titreCurseurs);

    function creerIcone(nom) {
      var icone = document.createElement('span');
      icone.className = 'noel-icone ' + nom;
      icone.setAttribute('aria-hidden', 'true');
      if (nom === 'flocon') icone.textContent = '❄';
      if (nom === 'normal') icone.textContent = '↖';
      return icone;
    }

    var motifCurseur = document.createElement('div');
    motifCurseur.id = 'noel-motif-curseur';
    motifCurseur.setAttribute('aria-hidden', 'true');
    document.body.appendChild(motifCurseur);

    function mouvementCurseur(e) {
      if (e.pointerType && e.pointerType !== 'mouse') {
        motifCurseur.style.display = 'none';
        return;
      }
      var x = e.clientX + (e.clientX > window.innerWidth - 40 ? -32 : 14);
      var y = e.clientY + (e.clientY > window.innerHeight - 42 ? -35 : 13);
      motifCurseur.style.transform =
        'translate3d(' + x + 'px,' + y + 'px,0)';
      motifCurseur.style.display = 'block';
    }

    function masquerMotif(e) {
      if (!e || !e.relatedTarget) {
        motifCurseur.style.display = 'none';
      }
    }

    function choisirCurseur(nom) {
      choixCurseur = nom;
      try {
        localStorage.setItem(cleCurseur, nom);
      } catch (e) {
        /* Le choix reste actif sur cette page. */
      }

      motifCurseur.style.display = 'none';
      motifCurseur.textContent = '';
      document.removeEventListener('pointermove', mouvementCurseur);
      document.removeEventListener('pointerout', masquerMotif);
      window.removeEventListener('blur', masquerMotif);

      if (nom !== 'normal') {
        motifCurseur.appendChild(creerIcone(nom));
        if (!window.matchMedia || window.matchMedia(
          '(hover: hover) and (pointer: fine)'
        ).matches) {
          document.addEventListener('pointermove', mouvementCurseur,
            { passive: true });
          document.addEventListener('pointerout', masquerMotif);
          window.addEventListener('blur', masquerMotif);
        }
      }

      var boutonsCurseurs = panneauCurseurs.querySelectorAll('button');
      for (var i = 0; i < boutonsCurseurs.length; i++) {
        boutonsCurseurs[i].setAttribute('aria-pressed',
          boutonsCurseurs[i].getAttribute('data-curseur') === nom
            ? 'true' : 'false');
      }
    }

    for (var m = 0; m < curseurs.length; m++) {
      (function (item) {
        var choix = document.createElement('button');
        choix.type = 'button';
        choix.setAttribute('data-curseur', item[0]);
        choix.setAttribute('aria-label', 'Curseur ' + item[1]);
        choix.appendChild(creerIcone(item[0]));
        var texte = document.createElement('span');
        texte.textContent = item[1];
        choix.appendChild(texte);
        choix.addEventListener('click', function () {
          choisirCurseur(item[0]);
        });
        panneauCurseurs.appendChild(choix);
      })(curseurs[m]);
    }
    options.appendChild(panneauCurseurs);
    choisirCurseur(choixCurseur);

    var lienConcours = document.createElement('a');
    lienConcours.id = 'noel-lien-concours';
    lienConcours.href =
      'https://forum.forumactif.com/h15-noelactif-2026';
    lienConcours.target = '_blank';
    lienConcours.rel = 'noopener noreferrer';
    lienConcours.textContent = 'Découvrir le concours Noëlactif 2026';
    options.appendChild(lienConcours);

    bouton.addEventListener('click', function () {
      options.hidden = !options.hidden;
      if (!options.hidden) actualiserCompteRebours();

      bouton.setAttribute(
        'aria-expanded',
        options.hidden ? 'false' : 'true'
      );
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        options.hidden = true;
        bouton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function (e) {
      if (!commande.contains(e.target)) {
        options.hidden = true;
        bouton.setAttribute('aria-expanded', 'false');
      }
    });

    var choixInitial = lireChoix();
    var choixValide = false;

    for (var k = 0; k < styles.length; k++) {
      if (styles[k][0] === choixInitial) {
        choixValide = true;
        break;
      }
    }

    choisir(choixValide ? choixInitial : 'ampoules');
    placer();

    /* Suivi de la Toolbar */
    var toolbar = document.getElementById('fa_toolbar');

    if (toolbar && window.MutationObserver) {
      var observation = new MutationObserver(demanderPlacement);

      observation.observe(toolbar, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    /* Suivi de la navigation fixe ModernBB */
    var navigationModernBB =
      document.getElementById('headerbar-top');

    if (
      document.body.id === 'modernbb' &&
      navigationModernBB &&
      window.MutationObserver
    ) {
      var observationNavigation =
        new MutationObserver(demanderPlacement);

      observationNavigation.observe(navigationModernBB, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    function adapterAuSupport() {
      if (estMobile()) {
        options.hidden = true;
        bouton.setAttribute('aria-expanded', 'false');
        motifCurseur.style.display = 'none';
      }
      actualiserNeige();
      demanderPlacement();
    }
    window.addEventListener('resize', adapterAuSupport);
    if (mediaMobile && mediaMobile.addEventListener) {
      mediaMobile.addEventListener('change', adapterAuSupport);
    }
    window.addEventListener('load', demanderPlacement);
    window.addEventListener('scroll', demanderPlacement);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();