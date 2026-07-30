/**
 * Noëlactif 2027 — Le grand loto du Pôle Nord
 * Moteur fonctionnel V1
 *
 * Dépendances fournies par la page HTML :
 * - jQuery ;
 * - les éléments dont l'identifiant commence par "noeloto-".
 */
$(function () {
  "use strict";

  const CONFIG = {
    storageKey: "noelactif2027_loto_v1",
    legacyStorageKey: "noelactif2026_forum_test_v2",
    storageVersion: 1,
    maximumCards: 3,
    cardCosts: [0, 3, 5],
    recoverySignature: "noelactif-2027-restauration-v1",

    /*
     * Les registres seront activés lorsque les sujets 2027 existeront.
     */
    remoteLog: {
      enabled: true,
      hostname: "xoumi.forumactif.com",
      privateForumId: 7,
      privateForumUrl: "/f7-zone-de-tests",
      recoveryTopicId: 683,
      recoveryTopicUrl: "/t683-noelactif-2027-demande-de-restauration",
      drawForumId: 10,
      drawForumUrl: "/f10-salle-de-pause",
      drawTopicId: 684,
      drawTopicUrl: "/t684-noelactif-2027tirages-du-loto"
    },

    /*
     * Comptes autorisés sur le forum de test xoumi.forumactif.com.
     * Les identifiants du Forum des Forums seront renseignés lors
     * du passage sur l'environnement définitif.
     */
    administrators: [
      { username: "Typlo", id: 1 }
    ]
  };

  const ROWS = 3;
  const COLUMNS = 9;
  const NUMBERS_PER_ROW = 5;
  const NUMBERS_PER_CARD = 15;

  let resolvedMember = null;
  let memberRequest = null;
  let state = null;
  let draws = [];
  let publicationInProgress = false;

  /*
   * ============================================================
   * Identification du membre
   * ============================================================
   */

  function memberFromProfileHref(username, profileHref) {
    const href = String(profileHref || "");
    const profileMatch =
      href.match(/\/u(\d+)(?:-|\/|$|\?)/i) ||
      href.match(/[?&]u=(\d+)/i);

    return {
      id: profileMatch ? Number(profileMatch[1]) : -1,
      username:
        username && username.toLowerCase() !== "invité"
          ? username
          : "Membre"
    };
  }

  function getMember() {
    if (resolvedMember && resolvedMember.id > 0) {
      return resolvedMember;
    }

    if (typeof window._userdata !== "undefined") {
      resolvedMember = {
        id: Number(window._userdata.user_id || -1),
        username: String(window._userdata.username || "Membre")
      };

      return resolvedMember;
    }

    const username = String(
      $(".USERNAME").first().text() || ""
    ).trim();

    const profileHref = String(
      $(".USERLINK a").first().attr("href") || ""
    );

    resolvedMember = memberFromProfileHref(
      username,
      profileHref
    );

    /*
     * Identité fictive uniquement lorsqu'on ouvre la page
     * hors du Forum des Forums pour les essais locaux.
     */
    if (
      resolvedMember.id <= 0 &&
      window.location.hostname !== CONFIG.remoteLog.hostname
    ) {
      resolvedMember = {
        id: 12345,
        username: "MembreTest"
      };
    }

    return resolvedMember;
  }

  function extractForumVariable(
    html,
    variableName
  ) {
    const pattern = new RegExp(
      "(?:&#123;|\\{)" +
        variableName +
        "(?:&#125;|\\})</strong>&nbsp;:&nbsp;(.*?)&nbsp;<span",
      "i"
    );

    const match = String(
      html || ""
    ).match(pattern);

    return match
      ? match[1].trim()
      : "";
  }

  function resolveForumMember() {
    const current = getMember();

    if (
      window.location.hostname !==
        CONFIG.remoteLog.hostname ||
      current.id > 0
    ) {
      return $.Deferred()
        .resolve(current)
        .promise();
    }

    if (memberRequest) {
      return memberRequest;
    }

    memberRequest = $.get(
      "/popup_help.forum?l=miscvars"
    )
      .then(function (html) {
        const usernameHtml =
          extractForumVariable(
            html,
            "USERNAME"
          );

        const userLinkHtml =
          extractForumVariable(
            html,
            "USERLINK"
          );

        const $username = $("<div>").html(
          usernameHtml
        );

        const $userLink = $("<div>").html(
          userLinkHtml
        );

        const username = String(
          $username.text() ||
            $(".USERNAME").first().text() ||
            ""
        ).trim();

        const profileHref = String(
          $userLink.find("a").attr("href") ||
            $userLink.text() ||
            ""
        ).trim();

        resolvedMember =
          memberFromProfileHref(
            username,
            profileHref
          );

        if (resolvedMember.id <= 0) {
          return $.Deferred()
            .reject(
              "L’identifiant numérique du membre reste introuvable."
            )
            .promise();
        }

        return resolvedMember;
      })
      .always(function () {
        memberRequest = null;
      });

    return memberRequest;
  }

  function memberIsAdministrator() {
    const member = getMember();

    return CONFIG.administrators.some(function (administrator) {
      return (
        administrator.id === member.id &&
        administrator.username.toLowerCase() ===
          member.username.toLowerCase()
      );
    });
  }

  function remoteLoggingIsAvailable() {
    const member = getMember();

    return (
      CONFIG.remoteLog.enabled &&
      window.location.hostname ===
        CONFIG.remoteLog.hostname &&
      member.id > 0
    );
  }

  /*
   * ============================================================
   * Publication dans les sujets Forumactif
   * ============================================================
   */

  function detectForumError(html) {
    const text = $("<div>")
      .html(html)
      .text()
      .replace(/\s+/g, " ")
      .toLowerCase();

    const knownErrors = [
      "vous n'êtes pas autorisé",
      "vous n’êtes pas autorisé",
      "désolé, mais seuls les",
      "le mode du sujet spécifié n'existe pas",
      "le sujet ou message que vous recherchez n'existe pas",
      "vous ne pouvez pas répondre"
    ];

    return (
      knownErrors.find(function (message) {
        return text.indexOf(message) !== -1;
      }) || null
    );
  }

  function topicIdFromAddress(address) {
    const source = String(address || "");
    const prettyUrl = source.match(
      /\/t(\d+)(?:p\d+)?(?:-|\/|#|\?|&|["']|$)/i
    );

    if (prettyUrl) {
      return Number(prettyUrl[1]);
    }

    const classicUrl = source.match(
      /[?&]t=(\d+)/i
    );

    return classicUrl
      ? Number(classicUrl[1])
      : null;
  }

  function extractTopicId(html, xhr) {
    const responseTopicId =
      topicIdFromAddress(
        xhr && xhr.responseURL
          ? xhr.responseURL
          : ""
      );

    if (responseTopicId) {
      return responseTopicId;
    }

    const parsed = new DOMParser().parseFromString(
      html || "",
      "text/html"
    );

    const trustedAddresses = [];

    parsed
      .querySelectorAll(
        "meta[http-equiv='refresh']"
      )
      .forEach(function (meta) {
        const content =
          meta.getAttribute("content") || "";

        const refreshUrl = content.match(
          /url\s*=\s*['"]?([^'";\s]+)/i
        );

        if (refreshUrl) {
          trustedAddresses.push(
            refreshUrl[1]
          );
        }
      });

    parsed
      .querySelectorAll(
        "link[rel='canonical']"
      )
      .forEach(function (link) {
        trustedAddresses.push(
          link.getAttribute("href") || ""
        );
      });

    parsed
      .querySelectorAll("a[href]")
      .forEach(function (link) {
        const label = String(
          link.textContent || ""
        )
          .replace(/\s+/g, " ")
          .trim();

        if (
          /voir (?:votre|le) message|retourner au sujet/i.test(
            label
          )
        ) {
          trustedAddresses.push(
            link.getAttribute("href") || ""
          );
        }
      });

    for (
      let index = 0;
      index < trustedAddresses.length;
      index += 1
    ) {
      const topicId = topicIdFromAddress(
        trustedAddresses[index]
      );

      if (topicId) {
        return topicId;
      }
    }

    return null;
  }

  function getPostingForm(url) {
    return $.ajax({
      url: url,
      method: "GET",
      cache: false
    }).then(function (html) {
      const error = detectForumError(html);

      if (error) {
        return $.Deferred()
          .reject(
            "Forumactif refuse l’accès au formulaire : " +
              error
          )
          .promise();
      }

      const parsed =
        new DOMParser().parseFromString(
          html,
          "text/html"
        );

      const form = parsed.querySelector(
        "form#post, form[name='post']"
      );

      if (!form) {
        return $.Deferred()
          .reject(
            "Le formulaire de publication Forumactif est introuvable."
          )
          .promise();
      }

      return {
        action:
          form.getAttribute("action") ||
          "/post",
        fields: $(form).serializeArray()
      };
    });
  }

  function setField(fields, name, value) {
    const filtered = fields.filter(
      function (field) {
        return field.name !== name;
      }
    );

    filtered.push({
      name: name,
      value: value
    });

    return filtered;
  }

  function submitForumPost(
    formData,
    subject,
    message
  ) {
    let fields = formData.fields;

    fields = setField(
      fields,
      "subject",
      subject || ""
    );

    fields = setField(
      fields,
      "message",
      message
    );

    fields = setField(
      fields,
      "post",
      "Envoyer"
    );

    return $.ajax({
      url: formData.action,
      method: "POST",
      data: $.param(fields),
      cache: false
    }).then(function (html, textStatus, xhr) {
      const error = detectForumError(html);

      if (error) {
        return $.Deferred()
          .reject(
            "Forumactif a refusé la publication : " +
              error
          )
          .promise();
      }

      return {
        html: html,
        topicId: extractTopicId(
          html,
          xhr
        )
      };
    });
  }

  /*
   * ============================================================
   * Lecture des tickets non dépensés en 2026
   * ============================================================
   */

  function readLegacyTicketBalance() {
    try {
      const legacyState = JSON.parse(
        localStorage.getItem(CONFIG.legacyStorageKey)
      );

      if (
        !legacyState ||
        !Number.isFinite(Number(legacyState.balance))
      ) {
        return 0;
      }

      return Math.max(
        0,
        Math.floor(Number(legacyState.balance))
      );
    } catch (error) {
      console.warn(
        "[Noëlactif 2027] Impossible de lire le solde 2026.",
        error
      );

      return 0;
    }
  }

  /*
   * ============================================================
   * Générateur de cartons traditionnels
   * ============================================================
   */

  function randomInt(maxExclusive) {
    if (
      !Number.isInteger(maxExclusive) ||
      maxExclusive <= 0
    ) {
      throw new RangeError(
        "La limite aléatoire doit être un entier positif."
      );
    }

    if (
      !window.crypto ||
      typeof window.crypto.getRandomValues !== "function"
    ) {
      throw new Error(
        "Le navigateur ne permet pas de générer un carton sécurisé."
      );
    }

    const limit =
      Math.floor(0x100000000 / maxExclusive) *
      maxExclusive;

    const buffer = new Uint32Array(1);
    let value;

    do {
      window.crypto.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);

    return value % maxExclusive;
  }

  function shuffle(values) {
    const copy = values.slice();

    for (
      let index = copy.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex = randomInt(index + 1);

      [copy[index], copy[randomIndex]] = [
        copy[randomIndex],
        copy[index]
      ];
    }

    return copy;
  }

  function sampleRange(min, max, quantity) {
    const values = [];

    for (let value = min; value <= max; value += 1) {
      values.push(value);
    }

    return shuffle(values)
      .slice(0, quantity)
      .sort(function (a, b) {
        return a - b;
      });
  }

  function getColumnRange(columnIndex) {
    if (columnIndex === 0) {
      return [1, 9];
    }

    if (columnIndex === 8) {
      return [80, 90];
    }

    return [
      columnIndex * 10,
      columnIndex * 10 + 9
    ];
  }

  function generateColumnCounts() {
    const counts = Array(COLUMNS).fill(1);
    let remaining = NUMBERS_PER_CARD - COLUMNS;

    while (remaining > 0) {
      const availableColumns = counts
        .map(function (count, index) {
          return count < ROWS ? index : null;
        })
        .filter(function (index) {
          return index !== null;
        });

      const selectedColumn =
        availableColumns[
          randomInt(availableColumns.length)
        ];

      counts[selectedColumn] += 1;
      remaining -= 1;
    }

    return counts;
  }

  function rowCombinations(quantity) {
    if (quantity === 1) {
      return [[0], [1], [2]];
    }

    if (quantity === 2) {
      return [[0, 1], [0, 2], [1, 2]];
    }

    return [[0, 1, 2]];
  }

  function createPlacement(columnCounts) {
    const placement = Array.from(
      { length: COLUMNS },
      function () {
        return [];
      }
    );

    const rowCounts = Array(ROWS).fill(0);

    function placeColumn(columnIndex) {
      if (columnIndex === COLUMNS) {
        return rowCounts.every(function (count) {
          return count === NUMBERS_PER_ROW;
        });
      }

      const remainingColumns =
        COLUMNS - columnIndex - 1;

      const combinations = shuffle(
        rowCombinations(
          columnCounts[columnIndex]
        )
      );

      for (const rows of combinations) {
        const rowAlreadyFull = rows.some(
          function (row) {
            return (
              rowCounts[row] >= NUMBERS_PER_ROW
            );
          }
        );

        if (rowAlreadyFull) {
          continue;
        }

        rows.forEach(function (row) {
          rowCounts[row] += 1;
        });

        const stillPossible = rowCounts.every(
          function (count) {
            return (
              count <= NUMBERS_PER_ROW &&
              count + remainingColumns >=
                NUMBERS_PER_ROW
            );
          }
        );

        if (stillPossible) {
          placement[columnIndex] = rows;

          if (placeColumn(columnIndex + 1)) {
            return true;
          }
        }

        rows.forEach(function (row) {
          rowCounts[row] -= 1;
        });
      }

      placement[columnIndex] = [];
      return false;
    }

    return placeColumn(0) ? placement : null;
  }

  function generateGrid() {
    let placement = null;
    let columnCounts = null;

    while (!placement) {
      columnCounts = generateColumnCounts();
      placement = createPlacement(columnCounts);
    }

    const grid = Array.from(
      { length: ROWS },
      function () {
        return Array(COLUMNS).fill(null);
      }
    );

    for (
      let column = 0;
      column < COLUMNS;
      column += 1
    ) {
      const range = getColumnRange(column);
      const numbers = sampleRange(
        range[0],
        range[1],
        columnCounts[column]
      );

      const occupiedRows = placement[column]
        .slice()
        .sort(function (a, b) {
          return a - b;
        });

      occupiedRows.forEach(
        function (row, index) {
          grid[row][column] = numbers[index];
        }
      );
    }

    return grid;
  }

  function validateGrid(grid) {
    if (
      !Array.isArray(grid) ||
      grid.length !== ROWS ||
      grid.some(function (row) {
        return (
          !Array.isArray(row) ||
          row.length !== COLUMNS
        );
      })
    ) {
      return false;
    }

    const allNumbers = [];

    const rowsAreValid = grid.every(function (row) {
      const rowNumbers = row.filter(function (value) {
        return value !== null;
      });

      allNumbers.push.apply(
        allNumbers,
        rowNumbers
      );

      return (
        rowNumbers.length === NUMBERS_PER_ROW
      );
    });

    if (!rowsAreValid) {
      return false;
    }

    for (
      let column = 0;
      column < COLUMNS;
      column += 1
    ) {
      const values = grid
        .map(function (row) {
          return row[column];
        })
        .filter(function (value) {
          return value !== null;
        });

      const range = getColumnRange(column);

      if (
        values.length < 1 ||
        values.length > 3
      ) {
        return false;
      }

      if (
        values.some(function (value) {
          return (
            !Number.isInteger(value) ||
            value < range[0] ||
            value > range[1]
          );
        })
      ) {
        return false;
      }

      if (
        values.some(function (value, index) {
          return (
            index > 0 &&
            value <= values[index - 1]
          );
        })
      ) {
        return false;
      }
    }

    return (
      allNumbers.length === NUMBERS_PER_CARD &&
      new Set(allNumbers).size ===
        allNumbers.length
    );
  }

  function gridSignature(grid) {
    return grid
      .map(function (row) {
        return row
          .map(function (value) {
            return value === null ? 0 : value;
          })
          .join("-");
      })
      .join("|");
  }

  function generateCard(cardNumber) {
    const member = getMember();
    const existingSignatures = new Set(
      state.cards.map(function (card) {
        return gridSignature(card.grid);
      })
    );

    let grid;
    let signature;

    do {
      grid = generateGrid();
      signature = gridSignature(grid);
    } while (
      !validateGrid(grid) ||
      existingSignatures.has(signature)
    );

    return {
      id:
        "NL27-" +
        member.id +
        "-" +
        String(cardNumber).padStart(2, "0"),
      userId: member.id,
      number: cardNumber,
      cost: CONFIG.cardCosts[cardNumber - 1],
      createdAt: new Date().toISOString(),
      grid: grid
    };
  }

  /*
   * ============================================================
   * Sauvegarde locale
   * ============================================================
   */

  function defaultState() {
    const member = getMember();
    const inheritedTickets =
      readLegacyTicketBalance();

    return {
      version: CONFIG.storageVersion,
      userId: member.id,
      username: member.username,
      imported2026Tickets: inheritedTickets,
      ticketBalance: inheritedTickets,
      cards: [],
      journalTopicId: null,
      recoveryRequestSentAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function storedStateIsValid(candidate) {
    const member = getMember();

    if (
      !candidate ||
      candidate.version !==
        CONFIG.storageVersion ||
      Number(candidate.userId) !== member.id ||
      !Number.isInteger(
        Number(candidate.ticketBalance)
      ) ||
      Number(candidate.ticketBalance) < 0 ||
      !Array.isArray(candidate.cards) ||
      candidate.cards.length >
        CONFIG.maximumCards
    ) {
      return false;
    }

    if (
      candidate.journalTopicId !== null &&
      (
        !Number.isInteger(
          Number(candidate.journalTopicId)
        ) ||
        Number(candidate.journalTopicId) < 1
      )
    ) {
      return false;
    }

    const cardsAreValid =
      candidate.cards.every(
        function (card, index) {
          return (
            card &&
            Number(card.userId) === member.id &&
            card.number === index + 1 &&
            card.id ===
              "NL27-" +
                member.id +
                "-" +
                String(index + 1).padStart(
                  2,
                  "0"
                ) &&
            validateGrid(card.grid)
          );
        }
      );

    if (!cardsAreValid) {
      return false;
    }

    const signatures = candidate.cards.map(
      function (card) {
        return gridSignature(card.grid);
      }
    );

    return (
      new Set(signatures).size ===
      signatures.length
    );
  }

  function loadState() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(CONFIG.storageKey)
      );

      if (
        saved &&
        typeof saved.journalTopicId ===
          "undefined"
      ) {
        saved.journalTopicId = null;
      }

      if (
        saved &&
        typeof saved.recoveryRequestSentAt ===
          "undefined"
      ) {
        saved.recoveryRequestSentAt = null;
      }

      if (storedStateIsValid(saved)) {
        return saved;
      }
    } catch (error) {
      console.warn(
        "[Noëlactif 2027] Sauvegarde locale illisible.",
        error
      );
    }

    return defaultState();
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();

    localStorage.setItem(
      CONFIG.storageKey,
      JSON.stringify(state)
    );
  }

  /*
   * ============================================================
   * Affichage des cartons
   * ============================================================
   */

  function createCardElement(card) {
    const $card = $("<article>", {
      class: "noeloto-player-card",
      "data-card-id": card.id
    });

    const $header = $("<header>", {
      class: "noeloto-player-card__header"
    });

    $("<strong>")
      .text("Carton nº " + card.number)
      .appendTo($header);

    $("<span>")
      .text(card.id)
      .appendTo($header);

    const $table = $("<table>", {
      class: "noeloto-player-card__grid",
      "aria-label":
        "Carton de loto numéro " +
        card.number
    });

    const $body = $("<tbody>");

    card.grid.forEach(function (row) {
      const $row = $("<tr>");

      row.forEach(function (number) {
        const $cell = $("<td>");

        if (number === null) {
          $cell
            .addClass("is-empty")
            .attr("aria-hidden", "true");
        } else {
          $cell
            .attr("data-number", number)
            .text(number);
        }

        $cell.appendTo($row);
      });

      $row.appendTo($body);
    });

    $body.appendTo($table);
    $header.appendTo($card);
    $table.appendTo($card);

    return $card;
  }

  function updateCardSlots() {
    for (
      let cardNumber = 1;
      cardNumber <= CONFIG.maximumCards;
      cardNumber += 1
    ) {
      const cardExists =
        Boolean(state.cards[cardNumber - 1]);

      const cost =
        CONFIG.cardCosts[cardNumber - 1];

      const previousCardExists =
        cardNumber === 1 ||
        Boolean(state.cards[cardNumber - 2]);

      const canAfford =
        state.ticketBalance >= cost;

      const $slot = $(
        "#noeloto-card-slot-" +
          cardNumber
      );

      const $button = $(
        "#noeloto-get-card-" +
          cardNumber
      );

      $slot.toggleClass(
        "is-owned",
        cardExists
      );

      if (cardExists) {
        $button
          .prop("disabled", true)
          .text("Carton attribué");
      } else {
        $button.prop(
          "disabled",
          publicationInProgress ||
            !previousCardExists ||
            !canAfford
        );

        if (cardNumber === 1) {
          $button.text(
            "Obtenir gratuitement"
          );
        } else {
          $button.text(
            "Utiliser " +
              cost +
              " tickets"
          );
        }
      }
    }
  }

  function renderCards() {
    const $container =
      $("#noeloto-cards-list");

    $container.empty();

    if (!state.cards.length) {
      $("<div>", {
        id: "noeloto-no-card",
        class: "noeloto-empty-state"
      })
        .append(
          $("<i>", {
            class: "fa fa-ticket fa-2x",
            "aria-hidden": "true"
          })
        )
        .append(
          $("<p>").text(
            "Tu ne possèdes encore aucun carton."
          )
        )
        .appendTo($container);
    } else {
      state.cards.forEach(function (card) {
        createCardElement(card).appendTo(
          $container
        );
      });
    }

    $("#noeloto-card-count").text(
      state.cards.length
    );

    $("#noeloto-ticket-balance").text(
      state.ticketBalance
    );

    updateCardSlots();
  }

  function renderAdministration() {
    $("#noeloto-admin-panel").prop(
      "hidden",
      !memberIsAdministrator()
    );
  }

  function render() {
    renderCards();
    renderDraws();
    renderAdministration();

    $("#noeloto-request-recovery").prop(
      "disabled",
      Boolean(state.recoveryRequestSentAt)
    );
  }

  /*
   * ============================================================
   * Attribution des cartons
   * ============================================================
   */

  function serializedGrid(grid) {
    return grid
      .map(function (row) {
        return row
          .map(function (value) {
            return value === null
              ? "0"
              : String(value);
          })
          .join("-");
      })
      .join(" / ");
  }

  function makeCardMessage(entry) {
    const member = getMember();

    return [
      "[NOËLOTO 2027 — ATTRIBUTION D’UN CARTON]",
      "",
      "Membre : " + member.username,
      "Identifiant : " + member.id,
      "Carton : " + entry.card.id,
      "Numéro du carton : " + entry.card.number,
      "Coût : " + entry.cost + " ticket(s)",
      "Solde avant attribution : " +
        entry.balanceBefore +
        " ticket(s)",
      "Solde après attribution : " +
        entry.balanceAfter +
        " ticket(s)",
      "Grille : " +
        serializedGrid(entry.card.grid),
      "Horodatage : " + entry.timestamp
    ].join("\n");
  }

  function createJournalTopic(entry) {
    const member = getMember();
    const subject =
      "[Noëloto 2027] Journal — " +
      member.username +
      " — ID " +
      member.id;

    return getPostingForm(
      "/post?f=" +
        CONFIG.remoteLog.privateForumId +
        "&mode=newtopic"
    )
      .then(function (formData) {
        return submitForumPost(
          formData,
          subject,
          makeCardMessage(entry)
        );
      })
      .then(function (result) {
        if (!result.topicId) {
          return $.Deferred()
            .reject(
              "Le journal a peut-être été créé, mais Forumactif n’a pas renvoyé son identifiant."
            )
            .promise();
        }

        state.journalTopicId =
          result.topicId;

        saveState();

        return {
          mode: "nouveau journal",
          topicId: result.topicId
        };
      });
  }

  function replyToJournal(message) {
    return getPostingForm(
      "/post?t=" +
        state.journalTopicId +
        "&mode=reply"
    )
      .then(function (formData) {
        return submitForumPost(
          formData,
          "",
          message
        );
      })
      .then(function () {
        return {
          mode: "réponse au journal",
          topicId:
            state.journalTopicId
        };
      });
  }

  function publishCardEntry(entry) {
    if (!remoteLoggingIsAvailable()) {
      return $.Deferred()
        .resolve({
          mode: "simulation locale",
          topicId: null
        })
        .promise();
    }

    if (!state.journalTopicId) {
      return createJournalTopic(entry);
    }

    return replyToJournal(
      makeCardMessage(entry)
    );
  }

  function obtainCard(cardNumber) {
    if (publicationInProgress) {
      return;
    }

    if (
      cardNumber !== state.cards.length + 1 ||
      cardNumber < 1 ||
      cardNumber > CONFIG.maximumCards
    ) {
      $("#noeloto-card-status").text(
        "Les cartons doivent être obtenus dans l’ordre."
      );

      return;
    }

    const cost =
      CONFIG.cardCosts[cardNumber - 1];

    if (state.ticketBalance < cost) {
      $("#noeloto-card-status").text(
        "Tu ne possèdes pas assez de tickets."
      );

      return;
    }

    if (
      cost > 0 &&
      !window.confirm(
        "Utiliser " +
          cost +
          " tickets pour obtenir le carton nº " +
          cardNumber +
          " ?"
      )
    ) {
      return;
    }

    const card = generateCard(cardNumber);
    const entry = {
      card: card,
      cost: cost,
      balanceBefore:
        state.ticketBalance,
      balanceAfter:
        state.ticketBalance - cost,
      timestamp:
        new Date().toISOString()
    };

    publicationInProgress = true;
    updateCardSlots();

    $("#noeloto-card-status").text(
      "Enregistrement du carton dans ton journal privé…"
    );

    publishCardEntry(entry)
      .then(function (publication) {
        state.cards.push(card);
        state.ticketBalance -= cost;
        saveState();
        render();

        $("#noeloto-card-status").text(
          "Ton carton nº " +
            cardNumber +
            " a bien été attribué" +
            (
              publication.topicId
                ? " et enregistré dans le journal t" +
                  publication.topicId +
                  "."
                : "."
            )
        );
      })
      .catch(function (error) {
        $("#noeloto-card-status").text(
          "Le carton n’a pas été attribué : " +
            error
        );
      })
      .always(function () {
        publicationInProgress = false;
        updateCardSlots();
      });
  }

  /*
   * ============================================================
   * Restauration locale provisoire
   * ============================================================
   */

  function encodeRecoveryPayload(payload) {
    return btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify(payload)
        )
      )
    );
  }

  function decodeRecoveryPayload(code) {
    return JSON.parse(
      decodeURIComponent(
        escape(atob(String(code).trim()))
      )
    );
  }

  function buildLocalRecoveryCode() {
    return encodeRecoveryPayload({
      signature: CONFIG.recoverySignature,
      version: CONFIG.storageVersion,
      userId: state.userId,
      generatedAt: new Date().toISOString(),
      state: state
    });
  }

  function restoreFromCode(code) {
    const payload = decodeRecoveryPayload(code);
    const member = getMember();

    if (
      !payload ||
      payload.signature !==
        CONFIG.recoverySignature ||
      payload.version !==
        CONFIG.storageVersion ||
      Number(payload.userId) !== member.id ||
      !storedStateIsValid(payload.state)
    ) {
      throw new Error(
        "Ce code de restauration n’est pas valide pour ce membre."
      );
    }

    state = payload.state;
    saveState();
    render();
  }

  /*
   * ============================================================
   * Demandes de restauration
   * ============================================================
   */

  function makeRecoveryRequestMessage() {
    const member = getMember();

    return [
      "[NOËLOTO 2027 — DEMANDE DE RESTAURATION]",
      "",
      "Membre : " + member.username,
      "Identifiant : " + member.id,
      "Journal connu : " +
        (
          state.journalTopicId
            ? "t" + state.journalTopicId
            : "Aucun"
        ),
      "Cartons visibles localement : " +
        state.cards.length,
      "Horodatage : " +
        new Date().toISOString()
    ].join("\n");
  }

  function publishRecoveryRequest() {
    return getPostingForm(
      "/post?t=" +
        CONFIG.remoteLog.recoveryTopicId +
        "&mode=reply"
    ).then(function (formData) {
      return submitForumPost(
        formData,
        "",
        makeRecoveryRequestMessage()
      );
    });
  }

  /*
   * ============================================================
   * Registre public des tirages
   * ============================================================
   */

  function parseDrawsFromTopic(html) {
    const parsed =
      new DOMParser().parseFromString(
        html,
        "text/html"
      );

    const found = [];

    parsed
      .querySelectorAll(
        ".postbody, .post .content, .content"
      )
      .forEach(function (post) {
        const text = String(
          post.textContent || ""
        ).replace(/\u00a0/g, " ");

        if (
          text.indexOf(
            "[NOËLOTO 2027 — TIRAGE]"
          ) === -1
        ) {
          return;
        }

        const orderMatch = text.match(
          /Ordre\s*:\s*(\d+)/i
        );

        const numberMatch = text.match(
          /Numéro\s*:\s*(\d+)/i
        );

        const dateMatch = text.match(
          /Horodatage\s*:\s*([^\n\r]+)/i
        );

        if (
          !orderMatch ||
          !numberMatch
        ) {
          return;
        }

        const number =
          Number(numberMatch[1]);

        if (
          number < 1 ||
          number > 90
        ) {
          return;
        }

        found.push({
          order: Number(orderMatch[1]),
          number: number,
          timestamp: dateMatch
            ? dateMatch[1].trim()
            : ""
        });
      });

    const uniqueNumbers = new Set();

    return found
      .sort(function (a, b) {
        return a.order - b.order;
      })
      .filter(function (draw) {
        if (
          uniqueNumbers.has(draw.number)
        ) {
          return false;
        }

        uniqueNumbers.add(draw.number);
        return true;
      });
  }

  function renderDraws() {
    const drawnNumbers = new Set(
      draws.map(function (draw) {
        return draw.number;
      })
    );

    $("#noeloto-draw-count").text(
      draws.length
    );

    $(".noeloto-board-number")
      .removeClass("is-drawn")
      .filter(function () {
        return drawnNumbers.has(
          Number(
            $(this).attr("data-number")
          )
        );
      })
      .addClass("is-drawn");

    $(".noeloto-player-card__grid td[data-number]")
      .removeClass("is-drawn")
      .filter(function () {
        return drawnNumbers.has(
          Number(
            $(this).attr("data-number")
          )
        );
      })
      .addClass("is-drawn");

    const $history =
      $("#noeloto-draw-history");

    $history.empty();

    if (!draws.length) {
      $("<li>")
        .text(
          "Aucun numéro n’a encore été tiré."
        )
        .appendTo($history);

      $("#noeloto-current-ball").text("?");
      $("#noeloto-last-draw-date").text(
        "aucun tirage pour le moment"
      );
      $("#noeloto-replay-draw").prop(
        "disabled",
        true
      );

      return;
    }

    draws
      .slice()
      .reverse()
      .forEach(function (draw) {
        $("<li>")
          .text(
            "Tirage nº " +
              draw.order +
              " — boule " +
              draw.number +
              (
                draw.timestamp
                  ? " — " +
                    draw.timestamp
                  : ""
              )
          )
          .appendTo($history);
      });

    const lastDraw =
      draws[draws.length - 1];

    $("#noeloto-current-ball").text(
      lastDraw.number
    );

    $("#noeloto-last-draw-date").text(
      lastDraw.timestamp ||
        "tirage nº " +
          lastDraw.order
    );

    $("#noeloto-replay-draw").prop(
      "disabled",
      false
    );
  }

  function loadDraws() {
    return $.ajax({
      url:
        CONFIG.remoteLog.drawTopicUrl +
        "?change_version=prosilver",
      method: "GET",
      cache: false
    })
      .then(function (html) {
        draws = parseDrawsFromTopic(
          html
        );

        renderDraws();
        return draws;
      })
      .catch(function () {
        $("#noeloto-last-draw-date").text(
          "registre des tirages inaccessible"
        );
      });
  }

  function makeDrawMessage(draw) {
    const member = getMember();

    return [
      "[NOËLOTO 2027 — TIRAGE]",
      "",
      "Ordre : " + draw.order,
      "Numéro : " + draw.number,
      "Effectué par : " +
        member.username +
        " — ID " +
        member.id,
      "Horodatage : " +
        draw.timestamp
    ].join("\n");
  }

  function publishNewDraw() {
    const drawnNumbers = new Set(
      draws.map(function (draw) {
        return draw.number;
      })
    );

    const availableNumbers = [];

    for (
      let number = 1;
      number <= 90;
      number += 1
    ) {
      if (!drawnNumbers.has(number)) {
        availableNumbers.push(number);
      }
    }

    if (!availableNumbers.length) {
      return $.Deferred()
        .reject(
          "Les 90 boules ont déjà été tirées."
        )
        .promise();
    }

    const draw = {
      order: draws.length + 1,
      number:
        availableNumbers[
          randomInt(
            availableNumbers.length
          )
        ],
      timestamp:
        new Date().toISOString()
    };

    return getPostingForm(
      "/post?t=" +
        CONFIG.remoteLog.drawTopicId +
        "&mode=reply"
    )
      .then(function (formData) {
        return submitForumPost(
          formData,
          "",
          makeDrawMessage(draw)
        );
      })
      .then(function () {
        draws.push(draw);
        renderDraws();
        return draw;
      });
  }

  /*
   * ============================================================
   * Événements
   * ============================================================
   */

  $("#noeloto-get-card-1").on(
    "click",
    function () {
      obtainCard(1);
    }
  );

  $("#noeloto-get-card-2").on(
    "click",
    function () {
      obtainCard(2);
    }
  );

  $("#noeloto-get-card-3").on(
    "click",
    function () {
      obtainCard(3);
    }
  );

  $("#noeloto-request-recovery").on(
    "click",
    function () {
      if (!remoteLoggingIsAvailable()) {
        $("#noeloto-recovery-request-status").text(
          "La demande ne peut être envoyée que depuis le forum de test."
        );

        return;
      }

      if (state.recoveryRequestSentAt) {
        $("#noeloto-recovery-request-status").text(
          "Une demande de restauration a déjà été envoyée."
        );

        return;
      }

      $("#noeloto-request-recovery").prop(
        "disabled",
        true
      );

      $("#noeloto-recovery-request-status").text(
        "Envoi de la demande aux Lutins…"
      );

      publishRecoveryRequest()
        .then(function () {
          state.recoveryRequestSentAt =
            new Date().toISOString();

          saveState();

          $("#noeloto-recovery-request-status").text(
            "Ta demande de restauration a bien été envoyée."
          );
        })
        .catch(function (error) {
          $("#noeloto-recovery-request-status").text(
            "La demande n’a pas pu être envoyée : " +
              error
          );

          $("#noeloto-request-recovery").prop(
            "disabled",
            false
          );
        });
    }
  );

  $("#noeloto-restore-participation").on(
    "click",
    function () {
      const code = String(
        $("#noeloto-recovery-code").val() ||
          ""
      ).trim();

      if (!code) {
        $("#noeloto-recovery-status").text(
          "Colle d’abord ton code de restauration."
        );

        return;
      }

      try {
        restoreFromCode(code);

        $("#noeloto-recovery-status").text(
          "Tes cartons et ton solde ont été restaurés."
        );
      } catch (error) {
        $("#noeloto-recovery-status").text(
          error.message
        );
      }
    }
  );

  $("#noeloto-generate-recovery").on(
    "click",
    function () {
      const requestedMemberId = Number(
        $("#noeloto-recovery-member-id").val()
      );

      if (
        !memberIsAdministrator() ||
        requestedMemberId !== state.userId
      ) {
        $("#noeloto-recovery-admin-status").text(
          "La V1 locale ne peut générer que le code du membre actuellement connecté."
        );

        return;
      }

      $("#noeloto-generated-recovery-code").val(
        buildLocalRecoveryCode()
      );

      $("#noeloto-recovery-admin-status").text(
        "Code local généré. L’analyse des registres sera ajoutée ensuite."
      );
    }
  );

  $("#noeloto-admin-draw").on(
    "click",
    function () {
      if (!memberIsAdministrator()) {
        return;
      }

      $("#noeloto-admin-draw")
        .prop("disabled", true);

      $("#noeloto-admin-draw-status").text(
        "Tirage et publication de la nouvelle boule…"
      );

      publishNewDraw()
        .then(function (draw) {
          $("#noeloto-admin-draw-status").text(
            "La boule " +
              draw.number +
              " a été publiée comme tirage nº " +
              draw.order +
              "."
          );
        })
        .catch(function (error) {
          $("#noeloto-admin-draw-status").text(
            "Le tirage a échoué : " +
              error
          );
        })
        .always(function () {
          $("#noeloto-admin-draw")
            .prop("disabled", false);
        });
    }
  );

  $("#noeloto-analyze-registry").on(
    "click",
    function () {
      $("#noeloto-registry-status").text(
        "Chargement du registre public des tirages…"
      );

      loadDraws()
        .then(function (loadedDraws) {
          $("#noeloto-registry-output").val(
            JSON.stringify(
              loadedDraws,
              null,
              2
            )
          );

          $("#noeloto-registry-status").text(
            loadedDraws.length +
              " tirage(s) valide(s) trouvé(s)."
          );
        });
    }
  );

  /*
   * ============================================================
   * Initialisation
   * ============================================================
   */

  $("#noeloto-card-status").text(
    "Identification du membre connecté…"
  );

  resolveForumMember()
    .then(function (member) {
      if (!member || member.id <= 0) {
        return $.Deferred()
          .reject(
            "Impossible d’identifier le membre connecté."
          )
          .promise();
      }

      state = loadState();
      saveState();
      render();
      loadDraws();

      $("#noeloto-card-status").text("");

      /*
       * Outil temporaire de test accessible depuis la console.
       */
      window.Noelactif2027 = {
        getState: function () {
          return JSON.parse(
            JSON.stringify(state)
          );
        },
        getMember: function () {
          return $.extend(
            {},
            getMember()
          );
        },
        validateGrid: validateGrid,
        generateGrid: generateGrid
      };
    })
    .catch(function (error) {
      $("#noeloto-card-status").text(
        String(
          error ||
            "Impossible d’identifier le membre connecté."
        )
      );
    });
});
