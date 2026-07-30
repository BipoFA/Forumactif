/**
 * Noëloto 2027 — Générateur de cartons
 *
 * Un carton traditionnel contient 3 lignes, 9 colonnes et 15 numéros :
 * exactement 5 numéros par ligne et au moins 1 numéro par colonne.
 */
(function (root) {
  "use strict";

  const ROWS = 3;
  const COLUMNS = 9;
  const NUMBERS_PER_ROW = 5;
  const NUMBERS_PER_CARD = 15;

  /**
   * Produit un nombre aléatoire sécurisé compris entre 0 inclus
   * et maxExclusive exclu.
   */
  function randomInt(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError(
        "maxExclusive doit être un entier strictement positif."
      );
    }

    const cryptoApi = root.crypto;

    if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
      throw new Error("Une API cryptographique compatible est nécessaire.");
    }

    const limit =
      Math.floor(0x100000000 / maxExclusive) * maxExclusive;

    const buffer = new Uint32Array(1);
    let value;

    do {
      cryptoApi.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);

    return value % maxExclusive;
  }

  /**
   * Mélange un tableau sans modifier le tableau d'origine.
   */
  function shuffle(values) {
    const copy = values.slice();

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = randomInt(index + 1);

      [copy[index], copy[randomIndex]] = [
        copy[randomIndex],
        copy[index]
      ];
    }

    return copy;
  }

  /**
   * Sélectionne plusieurs nombres dans une plage donnée.
   */
  function sampleRange(min, max, quantity) {
    const values = [];

    for (let value = min; value <= max; value += 1) {
      values.push(value);
    }

    return shuffle(values)
      .slice(0, quantity)
      .sort((a, b) => a - b);
  }

  /**
   * Retourne la plage de nombres autorisée pour une colonne.
   */
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

  /**
   * Répartit les 15 numéros entre les 9 colonnes.
   *
   * Chaque colonne contient entre 1 et 3 numéros.
   */
  function generateColumnCounts() {
    const counts = Array(COLUMNS).fill(1);
    let remaining = NUMBERS_PER_CARD - COLUMNS;

    while (remaining > 0) {
      const availableColumns = counts
        .map((count, index) => {
          return count < ROWS ? index : null;
        })
        .filter((index) => index !== null);

      const selectedColumn =
        availableColumns[randomInt(availableColumns.length)];

      counts[selectedColumn] += 1;
      remaining -= 1;
    }

    return counts;
  }

  /**
   * Retourne les lignes pouvant accueillir les numéros d'une colonne.
   */
  function rowCombinations(quantity) {
    if (quantity === 1) {
      return [
        [0],
        [1],
        [2]
      ];
    }

    if (quantity === 2) {
      return [
        [0, 1],
        [0, 2],
        [1, 2]
      ];
    }

    return [[0, 1, 2]];
  }

  /**
   * Répartit les cases occupées afin d'obtenir exactement
   * cinq numéros sur chaque ligne.
   */
  function createPlacement(columnCounts) {
    const placement = Array.from(
      { length: COLUMNS },
      () => []
    );

    const rowCounts = Array(ROWS).fill(0);

    function placeColumn(columnIndex) {
      if (columnIndex === COLUMNS) {
        return rowCounts.every(
          (count) => count === NUMBERS_PER_ROW
        );
      }

      const remainingColumns =
        COLUMNS - columnIndex - 1;

      const combinations = shuffle(
        rowCombinations(columnCounts[columnIndex])
      );

      for (const rows of combinations) {
        const fullRow = rows.some(
          (row) => rowCounts[row] >= NUMBERS_PER_ROW
        );

        if (fullRow) {
          continue;
        }

        rows.forEach((row) => {
          rowCounts[row] += 1;
        });

        const stillPossible = rowCounts.every((count) => {
          return (
            count <= NUMBERS_PER_ROW &&
            count + remainingColumns >= NUMBERS_PER_ROW
          );
        });

        if (stillPossible) {
          placement[columnIndex] = rows;

          if (placeColumn(columnIndex + 1)) {
            return true;
          }
        }

        rows.forEach((row) => {
          rowCounts[row] -= 1;
        });
      }

      placement[columnIndex] = [];

      return false;
    }

    return placeColumn(0) ? placement : null;
  }

  /**
   * Génère une grille traditionnelle de loto.
   */
  function generateGrid() {
    let placement = null;
    let columnCounts = null;

    while (!placement) {
      columnCounts = generateColumnCounts();
      placement = createPlacement(columnCounts);
    }

    const grid = Array.from(
      { length: ROWS },
      () => Array(COLUMNS).fill(null)
    );

    for (
      let column = 0;
      column < COLUMNS;
      column += 1
    ) {
      const [min, max] = getColumnRange(column);

      const numbers = sampleRange(
        min,
        max,
        columnCounts[column]
      );

      const occupiedRows = placement[column]
        .slice()
        .sort((a, b) => a - b);

      occupiedRows.forEach((row, index) => {
        grid[row][column] = numbers[index];
      });
    }

    return grid;
  }

  /**
   * Vérifie qu'une grille respecte toutes les règles.
   */
  function validateGrid(grid) {
    const errors = [];

    const validDimensions =
      Array.isArray(grid) &&
      grid.length === ROWS &&
      grid.every((row) => {
        return (
          Array.isArray(row) &&
          row.length === COLUMNS
        );
      });

    if (!validDimensions) {
      return {
        valid: false,
        errors: [
          "La grille doit contenir 3 lignes et 9 colonnes."
        ]
      };
    }

    const allNumbers = [];

    grid.forEach((row, rowIndex) => {
      const rowNumbers = row.filter(
        (value) => value !== null
      );

      if (rowNumbers.length !== NUMBERS_PER_ROW) {
        errors.push(
          `La ligne ${rowIndex + 1} ne contient pas exactement 5 numéros.`
        );
      }

      allNumbers.push(...rowNumbers);
    });

    for (
      let column = 0;
      column < COLUMNS;
      column += 1
    ) {
      const values = grid
        .map((row) => row[column])
        .filter((value) => value !== null);

      const [min, max] = getColumnRange(column);

      if (values.length < 1 || values.length > 3) {
        errors.push(
          `La colonne ${column + 1} doit contenir entre 1 et 3 numéros.`
        );
      }

      const invalidNumber = values.some((value) => {
        return (
          !Number.isInteger(value) ||
          value < min ||
          value > max
        );
      });

      if (invalidNumber) {
        errors.push(
          `La colonne ${column + 1} contient un numéro hors de sa plage.`
        );
      }

      const incorrectOrder = values.some(
        (value, index) => {
          return (
            index > 0 &&
            value <= values[index - 1]
          );
        }
      );

      if (incorrectOrder) {
        errors.push(
          `La colonne ${column + 1} n'est pas classée par ordre croissant.`
        );
      }
    }

    if (allNumbers.length !== NUMBERS_PER_CARD) {
      errors.push(
        "Le carton ne contient pas exactement 15 numéros."
      );
    }

    if (
      new Set(allNumbers).size !== allNumbers.length
    ) {
      errors.push(
        "Le carton contient des numéros en double."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Produit une signature permettant de comparer deux grilles.
   */
  function gridSignature(grid) {
    return grid
      .map((row) => {
        return row
          .map((value) => value ?? 0)
          .join("-");
      })
      .join("|");
  }

  /**
   * Génère entre un et trois cartons pour un membre.
   */
  function generateCards(
    userId,
    quantity,
    existingCards = []
  ) {
    const normalizedUserId =
      String(userId).trim();

    if (!/^\d+$/.test(normalizedUserId)) {
      throw new Error(
        "L’identifiant Forumactif doit être numérique."
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 3
    ) {
      throw new RangeError(
        "Un membre peut recevoir entre 1 et 3 cartons."
      );
    }

    if (
      !Array.isArray(existingCards) ||
      existingCards.length + quantity > 3
    ) {
      throw new RangeError(
        "La limite de 3 cartons par membre serait dépassée."
      );
    }

    const signatures = new Set(
      existingCards.map((card) => {
        return gridSignature(card.grid);
      })
    );

    const cards = [];

    while (cards.length < quantity) {
      const grid = generateGrid();
      const validation = validateGrid(grid);
      const signature = gridSignature(grid);

      if (
        !validation.valid ||
        signatures.has(signature)
      ) {
        continue;
      }

      const cardNumber =
        existingCards.length + cards.length + 1;

      const card = {
        id: [
          "NL27",
          normalizedUserId,
          String(cardNumber).padStart(2, "0")
        ].join("-"),

        userId: normalizedUserId,
        number: cardNumber,
        cost: [0, 3, 5][cardNumber - 1],
        grid
      };

      cards.push(card);
      signatures.add(signature);
    }

    return cards;
  }

  /*
   * Fonctions rendues accessibles aux autres scripts.
   */
  const api = {
    generateCards,
    generateGrid,
    validateGrid,
    gridSignature
  };

  root.NoelotoGenerator = api;
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : window
);