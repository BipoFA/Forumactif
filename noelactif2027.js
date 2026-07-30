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
      enabled: false,
      hostname: "forum.forumactif.com",
      forumId: null,
      cardRegistryTopicId: null,
      recoveryTopicId: null
    },

    administrators: [
      { username: "Bipo", id: 112158 },
      { username: "Luzz", id: 50306 },
      { username: "Pinguino", id: 1 },
      { username: "Chacha", id: 110116 },
      { username: "Walt", id: 166230 },
      { username: "chattigre", id: 175350 },
      { username: "Lixyr", id: 108944 },
      { username: "Skouliki", id: 174625 },
      { username: "Tony*", id: 141293 },
      { username: "Lutins", id: 177295 }
    ]
  };

  const ROWS = 3;
  const COLUMNS = 9;
  const NUMBERS_PER_ROW = 5;
  const NUMBERS_PER_CARD = 15;

  let resolvedMember = null;
  let state = null;

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
    renderAdministration();
  }

  /*
   * ============================================================
   * Attribution des cartons
   * ============================================================
   */

  function obtainCard(cardNumber) {
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

    state.cards.push(card);
    state.ticketBalance -= cost;
    saveState();
    render();

    $("#noeloto-card-status").text(
      "Ton carton nº " +
        cardNumber +
        " a bien été attribué."
    );

    /*
     * L'enregistrement dans le sujet privé sera ajouté ici
     * lorsque ses identifiants seront connus.
     */
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
      if (!CONFIG.remoteLog.enabled) {
        $("#noeloto-recovery-request-status").text(
          "Le registre de restauration sera activé lorsque le sujet 2027 sera créé."
        );

        return;
      }
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
      $("#noeloto-admin-draw-status").text(
        "Le registre central des tirages n’est pas encore configuré."
      );
    }
  );

  $("#noeloto-analyze-registry").on(
    "click",
    function () {
      $("#noeloto-registry-status").text(
        "Les identifiants des registres 2027 doivent encore être renseignés."
      );
    }
  );

  /*
   * ============================================================
   * Initialisation
   * ============================================================
   */

  const member = getMember();

  if (!member || member.id <= 0) {
    $("#noeloto-card-status").text(
      "Impossible d’identifier le membre connecté."
    );

    return;
  }

  state = loadState();
  saveState();
  render();

  /*
   * Outil temporaire de test accessible depuis la console.
   */
  window.Noelactif2027 = {
    getState: function () {
      return JSON.parse(
        JSON.stringify(state)
      );
    },
    validateGrid: validateGrid,
    generateGrid: generateGrid
  };
});
