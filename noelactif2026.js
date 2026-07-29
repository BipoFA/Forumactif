$(function () {
      "use strict";

      const CONFIG = {
        storageKey: "noelactif2026_prototype_v2",
        testMode: true,
        rulesUrl: "#",
        remoteLog: {
          hostname: "xoumi.forumactif.com",
          forumId: 7,
          forumUrl: "/f7-zone-de-tests",
          registryTopicId: 669,
          registryTopicUrl: "/t669-noelactif-2026-registre-des-hottes-du-pere-noel",
          recoveryTopicId: 678,
          recoveryTopicUrl: "/t678-noelactif-2026-registre-des-demandes-de-restauration",
          registryCooldownMs: 11000,
          enabled: true
        },
        debugOwner: {
          username: "Typlo",
          id: 1
        },
        recoverySignature: "noelactif-2026-restauration-v1",
        wheel: [
          { label: "1 ticket — Groumph en chocolat", tickets: 1, weight: 15 },
          { label: "2 tickets — Hotte de papy Chacha", tickets: 2, weight: 20 },
          { label: "3 tickets — Kardo surprise", tickets: 3, weight: 25 },
          { label: "4 tickets — Hydromel de la mère Luzz", tickets: 4, weight: 20 },
          { label: "5 tickets — Peluche Gizmo", tickets: 5, weight: 15 },
          { label: "10 tickets — Jackpot de Pinguino !", tickets: 10, weight: 5 }
        ],
        prizes: {
          gold: {
            label: "Hotte d’or — participation au tirage au sort pour gagner 1 200 crédits et le badge or Noëlactif 2026 à afficher dans son profil",
            tag: "[OR]",
            cost: 60
          },
          silver: {
            label: "Hotte d’argent — participation au tirage au sort pour gagner 1 000 crédits et le badge argent Noëlactif 2026 à afficher dans son profil",
            tag: "[ARGENT]",
            cost: 45
          },
          bronze: {
            label: "Hotte de bronze — participation au tirage au sort pour gagner 800 crédits et le badge bronze Noëlactif 2026 à afficher dans son profil",
            tag: "[BRONZE]",
            cost: 30
          },
          badge: {
            label: "Hotte souvenir — obtention du badge Noëlactif 2026 à afficher dans son profil",
            tag: "[PARTICIPANT]",
            cost: 1
          }
        }
      };

      let state = loadState();
      let currentRotation = state.rotation || 0;
      let spinning = false;
      let resolvedMember = null;
      let memberRequest = null;
      let registryCountdownTimer = null;
      let pendingJournalTimer = null;
      let journalPublicationInProgress = false;

      function memberFromProfileHref(username, profileHref) {
        const href = String(profileHref || "");
        const profileMatch = href.match(/\/u(\d+)(?:-|\/|$|\?)/i)
          || href.match(/[?&]u=(\d+)/i);

        return {
          id: profileMatch ? Number(profileMatch[1]) : -1,
          username: username && username.toLowerCase() !== "invité"
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
          $("#pseudo").text()
          || $(".USERNAME").first().text()
          || ""
        ).trim();
        const profileHref = String(
          $("#noelactif-member-link a").attr("href")
          || $(".USERLINK a").first().attr("href")
          || ""
        );

        if (window.location.hostname === CONFIG.remoteLog.hostname) {
          const member = memberFromProfileHref(username, profileHref);
          if (member.id > 0) {
            resolvedMember = member;
          }
          return member;
        }

        return { id: 12345, username: "MembreTest" };
      }

      function extractForumVariable(html, variableName) {
        const pattern = new RegExp(
          "(?:&#123;|\\{)"
          + variableName
          + "(?:&#125;|\\})</strong>&nbsp;:&nbsp;(.*?)&nbsp;<span",
          "i"
        );
        const match = String(html || "").match(pattern);
        return match ? match[1].trim() : "";
      }

      function resolveForumMember() {
        const current = getMember();
        if (
          window.location.hostname !== CONFIG.remoteLog.hostname
          || current.id > 0
        ) {
          return $.Deferred().resolve(current).promise();
        }

        if (memberRequest) {
          return memberRequest;
        }

        memberRequest = $.get("/popup_help.forum?l=miscvars")
          .then(function (html) {
            const usernameHtml = extractForumVariable(html, "USERNAME");
            const userLinkHtml = extractForumVariable(html, "USERLINK");
            const $username = $("<div>").html(usernameHtml);
            const $userLink = $("<div>").html(userLinkHtml);
            const username = String(
              $username.text()
              || $("#pseudo").text()
              || $(".USERNAME").first().text()
              || ""
            ).trim();
            const profileHref = String(
              $userLink.find("a").attr("href")
              || $userLink.text()
              || ""
            ).trim();

            resolvedMember = memberFromProfileHref(username, profileHref);
            if (resolvedMember.id <= 0) {
              return $.Deferred().reject(
                "L’identifiant numérique du membre reste introuvable."
              ).promise();
            }

            return resolvedMember;
          })
          .always(function () {
            memberRequest = null;
          });

        return memberRequest;
      }

      function remoteLoggingIsAvailable() {
        const member = getMember();
        return CONFIG.remoteLog.enabled
          && window.location.hostname === CONFIG.remoteLog.hostname
          && member.id > 0;
      }

      function memberIsIdentified() {
        const member = getMember();
        return member.id > 0 && member.username && member.username !== "Membre";
      }

      function isDebugOwner() {
        const member = getMember();
        return member.id === CONFIG.debugOwner.id
          && String(member.username).toLowerCase() === CONFIG.debugOwner.username.toLowerCase();
      }

      function renderDebugPanel() {
        $("#noelactif-debug-panel").prop("hidden", !isDebugOwner());
      }

      function initAtelierStory() {
        const $messagesBox = $("#atelier .direct-chat-messages");
        const $replay = $("#noelactif-story-replay");
        const dateLabel = "Mardi 1 décembre 2026";
        const story = [
          {
            name: "Les Lutins",
            avatar: "lutins",
            text: "Chef ! On vient de découvrir une immense roue au fond de l’atelier, juste derrière la réserve de cadeaux. Elle est couverte de lumières et distribue de mystérieux tickets !"
          },
          {
            name: "Groumph",
            avatar: "groumph",
            right: true,
            text: "Je précise que je n’ai touché à rien… Enfin, presque rien. J’ai seulement goûté le « Groumph en chocolat » pour vérifier sa qualité."
          },
          {
            name: "Père Noël",
            avatar: "pere-noel",
            text: "<em>Ho ho ho !</em> Une roue, des tickets et du chocolat qui disparaît mystérieusement… Je crois reconnaître la signature de Pinguino !"
          },
          {
            name: "Les Lutins",
            avatar: "lutins",
            right: true,
            text: "Il a laissé un petit mot : « Une rotation par jour, des tickets à collectionner et de magnifiques cadeaux à gagner. » Il parle aussi d’une moto dans les petites lignes…"
          },
          {
            name: "Père Noël",
            avatar: "pere-noel",
            text: "Pinguino a donc encore imaginé un nouveau jeu pour tenter de s’offrir la moto qu’il n’a pas reçue à Noël dernier !"
          },
          {
            name: "Groumph",
            avatar: "groumph",
            right: true,
            text: "La roue contient aussi une Hotte de papy Chacha, un Kardo surprise, de l’hydromel de la mère Luzz et même une peluche Gizmo ! J’espère que tout cela est comestible…"
          },
          {
            name: "Les Lutins",
            avatar: "lutins",
            text: "Les membres de Forumactif pourront faire tourner la roue chaque jour et collectionner des tickets. Après Noël, ils pourront les déposer dans les Hottes du Père Noël pour participer aux différents tirages !"
          },
          {
            name: "Père Noël",
            avatar: "pere-noel",
            right: true,
            text: "Excellente idée ! Je déclare officiellement ouverte la grande lotterie de Noël et je charge Les Lutins de son organisation. Au travail : les membres de Forumactif arrivent !"
          }
        ];
        let timers = [];
        let started = false;

        if (!$messagesBox.length) {
          return;
        }

        $messagesBox.html(story.map(function (message, index) {
          let avatar;
          let imageUrl;
          if (message.avatar === "groumph") {
            imageUrl = "https://i38.servimg.com/u/f38/11/01/36/00/groump11.png";
          } else if (message.avatar === "pere-noel") {
            imageUrl = "https://i.servimg.com/u/f38/11/01/36/00/image532.png";
          } else {
            imageUrl = "https://i.servimg.com/u/f38/11/01/36/00/image533.png";
          }
          avatar = '<img class="direct-chat-img" src="' + imageUrl + '" alt="' + message.name + '" />';

          return [
            '<div class="direct-chat-msg',
            message.right ? " right" : "",
            " noelactif-story-message",
            index === 0 ? " is-visible" : "",
            '">',
            '<div class="direct-chat-infos clearfix">',
            '<span class="direct-chat-name float-left" style="color:#961613">',
            message.name,
            "</span>",
            '<span class="direct-chat-timestamp float-right">',
            dateLabel,
            "</span>",
            "</div>",
            avatar,
            '<div class="direct-chat-text">',
            message.text,
            "</div>",
            "</div>"
          ].join("");
        }).join(""));

        const $messages = $messagesBox.find(".noelactif-story-message");

        function clearTimers() {
          timers.forEach(function (timer) {
            window.clearTimeout(timer);
          });
          timers = [];
        }

        function revealMessage(index) {
          $messages.eq(index).addClass("is-visible");
          $messagesBox.stop(true).animate(
            { scrollTop: $messagesBox.get(0).scrollHeight },
            320
          );
        }

        function playStory() {
          const reduceMotion = window.matchMedia
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          started = true;
          clearTimers();
          $messages.removeClass("is-visible");
          $messagesBox.stop(true).scrollTop(0);

          if (reduceMotion) {
            $messages.addClass("is-visible");
            $messagesBox.scrollTop(0);
            return;
          }

          $messages.each(function (index) {
            timers.push(window.setTimeout(function () {
              revealMessage(index);
            }, 250 + (index * 2250)));
          });
        }

        $replay.on("click", playStory);

        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(function (entries) {
            if (!started && entries.some(function (entry) {
              return entry.isIntersecting;
            })) {
              observer.disconnect();
              playStory();
            }
          }, { threshold: 0.25 });
          observer.observe($messagesBox.get(0));
        } else {
          playStory();
        }
      }

      function defaultState() {
        return {
          simulatedDay: 1,
          balance: 0,
          rotation: 0,
          lastSpinDay: null,
          topicId: null,
          pendingSpin: null,
          allocations: [],
          pendingAllocation: null,
          pendingJournal: null,
          lastRegistryPostAt: null,
          recoveryRequestSentAt: null,
          history: []
        };
      }

      function loadState() {
        try {
          const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
          if (!saved || !Array.isArray(saved.history)) {
            return defaultState();
          }

          if (!Array.isArray(saved.allocations)) {
            saved.allocations = saved.allocation ? [saved.allocation] : [];
          }

          return saved;
        } catch (error) {
          return defaultState();
        }
      }

      function saveState() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      }

      function weightedDraw() {
        const totalWeight = CONFIG.wheel.reduce((sum, item) => sum + item.weight, 0);
        let cursor = Math.random() * totalWeight;

        for (let index = 0; index < CONFIG.wheel.length; index += 1) {
          cursor -= CONFIG.wheel[index].weight;
          if (cursor < 0) {
            return { ...CONFIG.wheel[index], index };
          }
        }

        return { ...CONFIG.wheel[0], index: 0 };
      }

      function makePrivateMessage(entry) {
        const member = getMember();
        return [
          "[NOELACTIF 2026 — ROTATION]",
          "",
          "Membre : " + member.username,
          "Identifiant : " + member.id,
          "Jour de participation : " + entry.day + " décembre 2026",
          "Horodatage : " + entry.timestamp,
          "Résultat : " + entry.label,
          "Tickets remportés : " + entry.tickets,
          "Numéro de rotation : " + entry.rotation,
          "Solde après rotation : " + entry.balance
        ].join("\n");
      }

      function detectForumError(html) {
        const text = $("<div>").html(html).text().replace(/\s+/g, " ").toLowerCase();
        const knownErrors = [
          "vous n'êtes pas autorisé",
          "vous n’êtes pas autorisé",
          "désolé, mais seuls les",
          "le mode du sujet spécifié n'existe pas",
          "le sujet ou message que vous recherchez n'existe pas",
          "vous ne pouvez pas répondre"
        ];

        return knownErrors.find(function (message) {
          return text.indexOf(message) !== -1;
        }) || null;
      }

      function extractTopicId(html, xhr) {
        const sources = [
          xhr && xhr.responseURL ? xhr.responseURL : "",
          html || ""
        ];

        for (let index = 0; index < sources.length; index += 1) {
          const prettyUrl = sources[index].match(/\/t(\d+)(?:-|\/|#|\?|["'])/i);
          if (prettyUrl) {
            return Number(prettyUrl[1]);
          }

          const classicUrl = sources[index].match(/[?&]t=(\d+)/i);
          if (classicUrl) {
            return Number(classicUrl[1]);
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
            return $.Deferred().reject("Forumactif refuse l’accès au formulaire : " + error).promise();
          }

          const parsed = new DOMParser().parseFromString(html, "text/html");
          const form = parsed.querySelector("form#post, form[name='post']");
          if (!form) {
            return $.Deferred().reject("Le formulaire de publication Forumactif est introuvable.").promise();
          }

          return {
            action: form.getAttribute("action") || "/post",
            fields: $(form).serializeArray()
          };
        });
      }

      function setField(fields, name, value) {
        const filtered = fields.filter(function (field) {
          return field.name !== name;
        });
        filtered.push({ name: name, value: value });
        return filtered;
      }

      function submitForumPost(formData, subject, message) {
        let fields = formData.fields;
        fields = setField(fields, "subject", subject || "");
        fields = setField(fields, "message", message);
        fields = setField(fields, "post", "Envoyer");

        return $.ajax({
          url: formData.action,
          method: "POST",
          data: $.param(fields),
          cache: false
        }).then(function (html, textStatus, xhr) {
          const error = detectForumError(html);
          if (error) {
            return $.Deferred().reject("Forumactif a refusé la publication : " + error).promise();
          }

          return {
            html: html,
            topicId: extractTopicId(html, xhr)
          };
        });
      }

      function createJournalTopic(entry, isFallback) {
        const member = getMember();
        const subject = "[Noëlactif 2026] Journal — "
          + member.username
          + " — ID "
          + member.id
          + (isFallback ? " — secours jour " + entry.day : "");

        return getPostingForm("/post?f=" + CONFIG.remoteLog.forumId + "&mode=newtopic")
          .then(function (formData) {
            return submitForumPost(formData, subject, makePrivateMessage(entry));
          })
          .then(function (result) {
            if (result.topicId) {
              state.topicId = result.topicId;
              saveState();
            }
            return {
              mode: isFallback ? "nouveau sujet de secours" : "nouveau journal",
              topicId: result.topicId
            };
          });
      }

      function replyToJournal(entry) {
        const message = arguments.length > 1 && arguments[1]
          ? arguments[1]
          : makePrivateMessage(entry);

        return getPostingForm("/post?t=" + state.topicId + "&mode=reply")
          .then(function (formData) {
            return submitForumPost(formData, "", message);
          })
          .then(function () {
            return { mode: "réponse au journal", topicId: state.topicId };
          });
      }

      function publishPrivateLog(entry) {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve({ mode: "simulation locale", topicId: null }).promise();
        }

        if (!state.topicId) {
          return createJournalTopic(entry, false);
        }

        return replyToJournal(entry).catch(function () {
          /*
           * Le membre ne peut pas consulter le sujet privé. Si Forumactif refuse
           * malgré tout l'accès direct au formulaire de réponse, une nouvelle
           * trace est créée afin de ne jamais perdre le résultat.
           */
          state.topicId = null;
          saveState();
          return createJournalTopic(entry, true);
        });
      }

      function allocationWindowIsOpen() {
        if (CONFIG.testMode) {
          return state.simulatedDay >= 26 && state.simulatedDay <= 31;
        }

        const now = Date.now();
        const startsAt = new Date("2026-12-26T00:01:00+01:00").getTime();
        const endsAt = new Date("2026-12-31T23:59:59+01:00").getTime();
        return now >= startsAt && now <= endsAt;
      }

      function allocationWindowIsPast() {
        if (CONFIG.testMode) {
          return state.simulatedDay > 31;
        }

        return Date.now() > new Date("2026-12-31T23:59:59+01:00").getTime();
      }

      function selectedPrizeKeys() {
        return $("input[name='noelactif-prize']:checked").map(function () {
          return this.value;
        }).get();
      }

      function validatedPrizeKeys() {
        return (state.allocations || []).reduce(function (keys, allocation) {
          return keys.concat(allocation.keys || []);
        }, []);
      }

      function newlySelectedPrizeKeys() {
        const validated = validatedPrizeKeys();
        return selectedPrizeKeys().filter(function (key) {
          return validated.indexOf(key) === -1;
        });
      }

      function allocationCost(keys) {
        return keys.reduce(function (total, key) {
          return total + (CONFIG.prizes[key] ? CONFIG.prizes[key].cost : 0);
        }, 0);
      }

      function historyDateLabel(entry) {
        if (entry.dateLabel) {
          return entry.dateLabel;
        }

        const day = String(Number(entry.day) || 1).padStart(2, "0");
        return day + "/12/2026";
      }

      function makeAllocationMessage(keys, cost) {
        const member = getMember();
        const lines = [
          "[NOELACTIF 2026 — DÉPÔT DE TICKETS]",
          "",
          "Membre : " + member.username,
          "Identifiant : " + member.id,
          "Date du dépôt : " + new Date().toLocaleString("fr-FR"),
          "Solde avant le dépôt : " + state.balance + " tickets",
          "",
          "Hottes sélectionnées :"
        ];

        keys.forEach(function (key) {
          const prize = CONFIG.prizes[key];
          lines.push(prize.tag + " " + prize.label + " : " + prize.cost + " tickets");
        });

        lines.push(
          "",
          "Tickets déposés : " + cost,
          "Solde restant : " + (state.balance - cost) + " tickets",
          "",
          "Ce dépôt est irréversible. Le membre peut encore utiliser son solde restant dans d’autres hottes."
        );

        return lines.join("\n");
      }

      function publishRegistryLog(message) {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve({ mode: "simulation locale", topicId: null }).promise();
        }

        return getPostingForm(
          "/post?t=" + CONFIG.remoteLog.registryTopicId + "&mode=reply"
        )
          .then(function (formData) {
            return submitForumPost(formData, "", message);
          })
          .then(function () {
            return {
              mode: "registre central des hottes",
              topicId: CONFIG.remoteLog.registryTopicId
            };
          });
      }

      function makeRecoveryRequestMessage() {
        const member = getMember();
        return [
          "[NOELACTIF 2026 — DEMANDE DE RESTAURATION]",
          "",
          "Membre : " + member.username,
          "Identifiant : " + member.id,
          "Date de la demande : " + new Date().toLocaleString("fr-FR"),
          "",
          "Le membre demande un code permettant de restaurer son solde et son historique."
        ].join("\n");
      }

      function publishRecoveryRequest() {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve({ mode: "simulation locale", topicId: null }).promise();
        }

        return getPostingForm(
          "/post?t=" + CONFIG.remoteLog.recoveryTopicId + "&mode=reply"
        )
          .then(function (formData) {
            return submitForumPost(formData, "", makeRecoveryRequestMessage());
          })
          .then(function () {
            return {
              mode: "registre des demandes de restauration",
              topicId: CONFIG.remoteLog.recoveryTopicId
            };
          });
      }

      function registryPageUrls(html) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        const urls = [];

        $(documentNode).find("a[href]").each(function () {
          try {
            const url = new URL(this.getAttribute("href"), window.location.origin);
            const isRegistryTopic = (
              new RegExp("^/t" + CONFIG.remoteLog.registryTopicId + "(?:p\\d+)?(?:-|$)", "i").test(url.pathname)
              || (
                url.searchParams.get("t") === String(CONFIG.remoteLog.registryTopicId)
                && url.pathname.indexOf("/viewtopic") !== -1
              )
            );

            if (url.origin === window.location.origin && isRegistryTopic) {
              urls.push(url.pathname + url.search);
            }
          } catch (error) {
            // Un lien non standard ne doit pas interrompre l’analyse.
          }
        });

        return urls;
      }

      function parseForumDateTime(value) {
        const match = String(value || "").match(
          /(\d{1,2})\/(\d{1,2})\/(\d{4})[^\d]+(\d{1,2}):(\d{2})(?::(\d{2}))?/
        );
        if (!match) {
          return null;
        }
        return new Date(
          Number(match[3]),
          Number(match[2]) - 1,
          Number(match[1]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6] || 0)
        ).getTime();
      }

      function registryEntriesFromPage(html) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        let $posts = $(documentNode).find(".post");

        if (!$posts.length) {
          $posts = $(documentNode).find(".postbody");
        }

        const entries = [];
        $posts.each(function () {
          const $copy = $(this).clone();
          $copy.find("br").replaceWith("\n");
          const text = $copy.text()
            .replace(/\u00a0/g, " ")
            .replace(/\r/g, "")
            .replace(/[ \t]+\n/g, "\n");

          if (text.indexOf("[NOELACTIF 2026 — DÉPÔT DE TICKETS]") === -1) {
            return;
          }

          const usernameMatch = text.match(/Membre\s*:\s*([^\n]+)/i);
          const idMatch = text.match(/Identifiant\s*:\s*(\d+)/i);
          const depositDateMatch = text.match(/Date du dépôt\s*:\s*([^\n]+)/i);
          const remainingMatch = text.match(/Solde restant\s*:\s*(\d+)\s*tickets?/i);
          if (!usernameMatch || !idMatch) {
            return;
          }

          entries.push({
            username: usernameMatch[1].trim(),
            id: Number(idMatch[1]),
            depositAt: depositDateMatch
              ? parseForumDateTime(depositDateMatch[1])
              : null,
            remainingBalance: remainingMatch
              ? Number(remainingMatch[1])
              : null,
            tags: {
              gold: text.indexOf("[OR]") !== -1,
              silver: text.indexOf("[ARGENT]") !== -1,
              bronze: text.indexOf("[BRONZE]") !== -1,
              badge: text.indexOf("[PARTICIPANT]") !== -1
            }
          });
        });

        return entries;
      }

      function pageText($element) {
        const $copy = $element.clone();
        $copy.find("br").replaceWith("\n");
        return $copy.text()
          .replace(/\u00a0/g, " ")
          .replace(/\r/g, "")
          .replace(/[ \t]+\n/g, "\n");
      }

      function paginatedUrls(html, matcher) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        const urls = [];
        $(documentNode).find("a[href]").each(function () {
          try {
            const url = new URL(this.getAttribute("href"), window.location.origin);
            if (
              url.origin === window.location.origin
              && matcher(url)
            ) {
              urls.push(url.pathname + url.search);
            }
          } catch (error) {
            // Les liens non standard sont simplement ignorés.
          }
        });
        return urls;
      }

      function fetchPaginatedPages(startUrl, matcher) {
        const pending = [startUrl];
        const visited = {};
        const pages = [];

        function next() {
          if (!pending.length || pages.length >= 50) {
            return $.Deferred().resolve(pages).promise();
          }
          const url = pending.shift();
          if (visited[url]) {
            return next();
          }
          visited[url] = true;
          return $.get(url).then(function (html) {
            pages.push(html);
            paginatedUrls(html, matcher).forEach(function (pageUrl) {
              if (!visited[pageUrl] && pending.indexOf(pageUrl) === -1) {
                pending.push(pageUrl);
              }
            });
            return next();
          });
        }

        return next();
      }

      function journalTopicsForMember(pages, memberId) {
        const topics = {};
        pages.forEach(function (html) {
          const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
          $(documentNode).find("a[href]").each(function () {
            const title = $(this).text().replace(/\s+/g, " ").trim();
            const href = String(this.getAttribute("href") || "");
            const topicMatch = href.match(/\/t(\d+)(?:p\d+)?(?:-|$)/i);
            const isJournal = /Noëlactif 2026.*Journal/i.test(title);
            const isMember = new RegExp("ID\\s+" + memberId + "(?:\\D|$)", "i").test(title);
            if (topicMatch && isJournal && isMember) {
              topics[topicMatch[1]] = {
                id: Number(topicMatch[1]),
                url: href
              };
            }
          });
        });
        return Object.keys(topics).map(function (id) {
          return topics[id];
        });
      }

      function rotationsFromJournalPage(html, memberId) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        let $posts = $(documentNode).find(".post");
        if (!$posts.length) {
          $posts = $(documentNode).find(".postbody");
        }
        const rotations = [];

        $posts.each(function () {
          const text = pageText($(this));
          if (text.indexOf("[NOELACTIF 2026 — ROTATION]") === -1) {
            return;
          }

          const idMatch = text.match(/Identifiant\s*:\s*(\d+)/i);
          const memberMatch = text.match(/Membre\s*:\s*([^\n]+)/i);
          const dayMatch = text.match(/Jour de participation\s*:\s*(\d+)\s+décembre 2026/i);
          const timestampMatch = text.match(/Horodatage\s*:\s*([^\n]+)/i);
          const resultMatch = text.match(/Résultat\s*:\s*([^\n]+)/i);
          const ticketsMatch = text.match(/Tickets remportés\s*:\s*(\d+)/i);
          const rotationMatch = text.match(/Numéro de rotation\s*:\s*(\d+)/i);

          if (
            !idMatch
            || Number(idMatch[1]) !== Number(memberId)
            || !dayMatch
            || !resultMatch
            || !ticketsMatch
          ) {
            return;
          }

          rotations.push({
            member: memberMatch ? memberMatch[1].trim() : "Membre",
            day: Number(dayMatch[1]),
            rotation: rotationMatch ? Number(rotationMatch[1]) : 0,
            label: resultMatch[1].trim(),
            tickets: Number(ticketsMatch[1]),
            timestamp: timestampMatch ? timestampMatch[1].trim() : "",
            dateLabel: String(Number(dayMatch[1])).padStart(2, "0") + "/12/2026"
          });
        });
        return rotations;
      }

      function recoveryHash(value) {
        const input = CONFIG.recoverySignature + "|" + value;
        let hash = 2166136261;
        for (let index = 0; index < input.length; index += 1) {
          hash ^= input.charCodeAt(index);
          hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36);
      }

      function encodeRecoveryPayload(payload) {
        const json = JSON.stringify(payload);
        const encoded = window.btoa(unescape(encodeURIComponent(json)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/g, "");
        return "NA26." + encoded + "." + recoveryHash(encoded);
      }

      function decodeRecoveryCode(code) {
        const parts = String(code || "").trim().split(".");
        if (parts.length !== 3 || parts[0] !== "NA26" || recoveryHash(parts[1]) !== parts[2]) {
          throw new Error("Ce code est invalide ou incomplet.");
        }
        const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/")
          + "===".slice((parts[1].length + 3) % 4);
        const payload = JSON.parse(decodeURIComponent(escape(window.atob(padded))));
        if (!payload || payload.v !== 1 || !payload.state || !payload.id) {
          throw new Error("Ce code de restauration n’est pas reconnu.");
        }
        return payload;
      }

      function buildRecoveryForMember(memberId) {
        const forumMatcher = function (url) {
          return new RegExp("^/f" + CONFIG.remoteLog.forumId + "(?:p\\d+)?(?:-|$)", "i")
            .test(url.pathname);
        };

        return $.when(
          fetchPaginatedPages(CONFIG.remoteLog.forumUrl, forumMatcher),
          fetchRegistryPages()
        ).then(function (forumResult, registryResult) {
          const forumPages = forumResult;
          const registryPages = registryResult;
          const topics = journalTopicsForMember(forumPages, memberId);
          if (!topics.length) {
            return $.Deferred().reject(
              "Aucun journal Noëlactif trouvé pour l’ID " + memberId + "."
            ).promise();
          }

          const allJournalPages = [];
          function fetchTopic(index) {
            if (index >= topics.length) {
              return $.Deferred().resolve().promise();
            }
            const topic = topics[index];
            const matcher = function (url) {
              return new RegExp("^/t" + topic.id + "(?:p\\d+)?(?:-|$)", "i")
                .test(url.pathname);
            };
            return fetchPaginatedPages(topic.url, matcher).then(function (pages) {
              Array.prototype.push.apply(allJournalPages, pages);
              return fetchTopic(index + 1);
            });
          }

          return fetchTopic(0).then(function () {
            const uniqueRotations = {};
            let rotationOrder = 0;
            allJournalPages.forEach(function (html) {
              rotationsFromJournalPage(html, memberId).forEach(function (entry) {
                const signature = [
                  entry.day,
                  entry.rotation,
                  entry.label,
                  entry.tickets,
                  entry.timestamp
                ].join("|");
                if (!uniqueRotations[signature]) {
                  uniqueRotations[signature] = {
                    entry: entry,
                    order: rotationOrder
                  };
                  rotationOrder += 1;
                }
              });
            });

            const history = Object.keys(uniqueRotations).map(function (signature) {
              return uniqueRotations[signature];
            }).sort(function (a, b) {
              return (a.entry.day - b.entry.day) || (a.order - b.order);
            }).map(function (item) {
              return item.entry;
            });
            if (!history.length) {
              return $.Deferred().reject(
                "Le journal existe, mais aucune rotation exploitable n’a été trouvée."
              ).promise();
            }

            const depositedKeys = {};
            const memberDeposits = [];
            registryPages.forEach(function (html) {
              registryEntriesFromPage(html).forEach(function (entry) {
                if (entry.id === Number(memberId)) {
                  memberDeposits.push(entry);
                  Object.keys(entry.tags).forEach(function (key) {
                    if (entry.tags[key]) {
                      depositedKeys[key] = true;
                    }
                  });
                }
              });
            });
            const keys = Object.keys(depositedKeys);
            const won = history.reduce(function (total, entry) {
              return total + entry.tickets;
            }, 0);
            const deposited = allocationCost(keys);
            const datedDeposits = memberDeposits.filter(function (entry) {
              return entry.depositAt !== null && entry.remainingBalance !== null;
            }).sort(function (a, b) {
              return a.depositAt - b.depositAt;
            });
            const lastDeposit = datedDeposits.length
              ? datedDeposits[datedDeposits.length - 1]
              : null;
            const gainsAfterLastDeposit = lastDeposit
              ? history.reduce(function (total, entry) {
                const rotationAt = parseForumDateTime(entry.timestamp);
                return rotationAt !== null && rotationAt > lastDeposit.depositAt
                  ? total + entry.tickets
                  : total;
              }, 0)
              : null;
            const lastDay = history[history.length - 1].day;
            const restoredState = defaultState();
            restoredState.simulatedDay = lastDay;
            restoredState.balance = Math.max(
              0,
              lastDeposit
                ? lastDeposit.remainingBalance + gainsAfterLastDeposit
                : won - deposited
            );
            restoredState.rotation = history.length;
            restoredState.lastSpinDay = lastDay;
            restoredState.topicId = topics[0].id;
            restoredState.history = history.map(function (entry, index) {
              return $.extend({}, entry, {
                rotation: index + 1,
                balance: history.slice(0, index + 1).reduce(function (total, item) {
                  return total + item.tickets;
                }, 0),
                publicationMode: "journal restauré",
                topicId: topics[0].id
              });
            });
            if (keys.length) {
              restoredState.allocations = [{
                keys: keys,
                cost: deposited,
                submittedAt: new Date().toISOString(),
                publicationMode: "registre central restauré",
                topicId: CONFIG.remoteLog.registryTopicId
              }];
            }

            return {
              code: encodeRecoveryPayload({
                v: 1,
                id: Number(memberId),
                username: history[0].member,
                generatedAt: new Date().toISOString(),
                state: restoredState
              }),
              username: history[0].member,
              rotations: history.length,
              won: won,
              deposited: deposited,
              balance: restoredState.balance,
              hottes: keys.length
            };
          });
        });
      }

      function fetchRegistryPages() {
        const pending = [CONFIG.remoteLog.registryTopicUrl];
        const visited = {};
        const pages = [];
        const maximumPages = 50;

        function next() {
          if (!pending.length || pages.length >= maximumPages) {
            return $.Deferred().resolve(pages).promise();
          }

          const url = pending.shift();
          if (visited[url]) {
            return next();
          }
          visited[url] = true;

          return $.get(url).then(function (html) {
            pages.push(html);
            registryPageUrls(html).forEach(function (pageUrl) {
              if (!visited[pageUrl] && pending.indexOf(pageUrl) === -1) {
                pending.push(pageUrl);
              }
            });
            return next();
          });
        }

        return next();
      }

      function buildRegistryLists(pages) {
        const lists = {
          gold: {},
          silver: {},
          bronze: {},
          badge: {}
        };
        let deposits = 0;

        pages.forEach(function (html) {
          registryEntriesFromPage(html).forEach(function (entry) {
            deposits += 1;
            Object.keys(lists).forEach(function (key) {
              if (entry.tags[key]) {
                lists[key][entry.id] = {
                  id: entry.id,
                  username: entry.username
                };
              }
            });
          });
        });

        Object.keys(lists).forEach(function (key) {
          const members = Object.keys(lists[key]).map(function (id) {
            return lists[key][id];
          }).sort(function (a, b) {
            return a.username.localeCompare(b.username, "fr", {
              sensitivity: "base"
            });
          });
          const output = members.length
            ? members.map(function (member) {
              return member.username + " — ID " + member.id;
            }).join("\n")
            : "Aucun participant.";

          $("[data-registry-count='" + key + "']").text(members.length);
          $("[data-registry-list='" + key + "']").text(output);
        });

        return deposits;
      }

      function registryCooldownRemaining() {
        if (!state.lastRegistryPostAt) {
          return 0;
        }

        return Math.max(
          0,
          CONFIG.remoteLog.registryCooldownMs - (Date.now() - state.lastRegistryPostAt)
        );
      }

      function synchronizeRegistryCountdown(remaining) {
        if (remaining > 0 && !registryCountdownTimer) {
          registryCountdownTimer = window.setInterval(function () {
            renderAllocation();
          }, 250);
        } else if (remaining <= 0 && registryCountdownTimer) {
          window.clearInterval(registryCountdownTimer);
          registryCountdownTimer = null;
        }
      }

      function schedulePendingJournalPublication() {
        if (!state.pendingJournal) {
          if (pendingJournalTimer) {
            window.clearTimeout(pendingJournalTimer);
            pendingJournalTimer = null;
          }
          return;
        }

        if (pendingJournalTimer || journalPublicationInProgress) {
          return;
        }

        const delay = Math.max(0, Number(state.pendingJournal.dueAt) - Date.now());
        pendingJournalTimer = window.setTimeout(function () {
          pendingJournalTimer = null;
          journalPublicationInProgress = true;

          replyToJournal(null, state.pendingJournal.message)
            .done(function () {
              const message = state.pendingJournal.message;
              state.pendingJournal = null;
              saveState();
              $("#noelactif-private-log").text(
                message
                + "\n\nStatut : DÉPÔT AJOUTÉ AU JOURNAL PRIVÉ"
                + (state.topicId ? "\nSujet Forumactif : t" + state.topicId : "")
              );
              renderAllocation();
            })
            .fail(function (error) {
              state.pendingJournal = null;
              saveState();
              renderAllocation();
              $("#noelactif-allocation-state").text(
                "Le dépôt est bien enregistré dans le registre central, mais sa copie dans le journal privé a échoué : "
                + String(error)
              );
            })
            .always(function () {
              journalPublicationInProgress = false;
            });
        }, delay);
      }

      function renderAllocation() {
        const isOpen = allocationWindowIsOpen();
        const $section = $("#noelactif-allocation");
        const validated = validatedPrizeKeys();
        const keys = newlySelectedPrizeKeys();
        const cost = allocationCost(keys);
        const allValidated = validated.length === Object.keys(CONFIG.prizes).length;
        const cooldownRemaining = registryCooldownRemaining();
        const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

        synchronizeRegistryCountdown(cooldownRemaining);
        schedulePendingJournalPublication();

        $("#noelactif-allocation-balance").text(state.balance + " ticket(s)");
        $("#noelactif-allocation-total").text(cost);

        $section.toggleClass("is-locked", !isOpen);
        $("input[name='noelactif-prize']").each(function () {
          const isValidated = validated.indexOf(this.value) !== -1;
          $(this)
            .prop("checked", isValidated || $(this).prop("checked"))
            .prop("disabled", !isOpen || isValidated);
        });

        $("#noelactif-submit-allocation").prop(
          "disabled",
          !isOpen
          || allValidated
          || !keys.length
          || cost > state.balance
          || cooldownRemaining > 0
          || Boolean(state.pendingJournal)
        );

        if (state.pendingJournal && cooldownRemaining > 0 && isOpen) {
          $("#noelactif-allocation-state").text(
            "Le dépôt est enregistré dans le registre central. Copie dans ton journal privé dans "
            + cooldownSeconds
            + (cooldownSeconds > 1 ? " secondes." : " seconde.")
          );
        } else if (state.pendingJournal && isOpen) {
          $("#noelactif-allocation-state").text(
            "Publication du dépôt dans ton journal privé…"
          );
        } else if (cooldownRemaining > 0 && isOpen) {
          $("#noelactif-allocation-state").text(
            "Les lutins terminent le précédent dépôt. Patiente encore "
            + cooldownSeconds
            + (cooldownSeconds > 1 ? " secondes." : " seconde.")
          );
        } else if (allValidated) {
          $("#noelactif-allocation-state").text(
            "Des tickets ont été déposés dans toutes les hottes. Solde restant : "
            + state.balance
            + " ticket(s)."
          );
        } else if (validated.length && !keys.length && isOpen) {
          $("#noelactif-allocation-state").text(
            "Tickets déjà déposés dans : "
            + validated.map(function (key) {
              return CONFIG.prizes[key].label;
            }).join(" ; ")
            + ". Tu peux encore sélectionner un autre tirage avec tes "
            + state.balance
            + " ticket(s) restants."
          );
        } else if (allocationWindowIsPast()) {
          $("#noelactif-allocation-state").text(
            "Les hottes sont fermées depuis le 31 décembre 2026 à 23h59."
          );
        } else if (!isOpen) {
          $("#noelactif-allocation-state").text(
            "Les hottes seront accessibles du 26 décembre 2026 à 00h01 au 31 décembre 2026 à 23h59."
          );
        } else if (cost > state.balance) {
          $("#noelactif-allocation-state").text(
            "Ton solde est insuffisant : retire au moins un tirage avant de valider."
          );
        } else {
          $("#noelactif-allocation-state").text(
            "Il restera " + (state.balance - cost) + " ticket(s) après ce dépôt."
          );
        }
      }

      function render() {
        renderDebugPanel();
        $("#noelactif-balance").text(state.balance);
        $("#noelactif-spins").text(state.rotation);

        if (state.recoveryRequestSentAt) {
          $("#noelactif-request-recovery")
            .prop("disabled", true)
            .text("Demande déjà envoyée");
          $("#noelactif-recovery-request-status").text(
            "Ta demande a bien été transmise aux Lutins. Ils te communiqueront ton code de restauration."
          );
        } else {
          $("#noelactif-request-recovery")
            .prop("disabled", false)
            .html('<i class="fa fa-envelope" aria-hidden="true"></i> Contacter Les Lutins');
          $("#noelactif-recovery-request-status").text("");
        }

        const alreadyPlayed = state.lastSpinDay === state.simulatedDay;
        const hasPendingSpin = state.pendingSpin && state.pendingSpin.day === state.simulatedDay;
        const eventFinished = state.simulatedDay > 25;

        $("#noelactif-spin")
          .prop("disabled", spinning || alreadyPlayed || eventFinished)
          .text(
            eventFinished
              ? "Événement terminé"
              : alreadyPlayed
                ? "Rotation déjà effectuée"
                : hasPendingSpin
                  ? "Réessayer l’envoi"
                  : "Faire tourner la roue"
          );

        $("#noelactif-next-day")
          .prop("disabled", spinning || state.simulatedDay >= 31);

        if (eventFinished) {
          $("#noelactif-status").text(
            state.simulatedDay === 26
              ? "Les rotations sont terminées. Les hottes sont désormais ouvertes."
              : "Les 25 jours de participation sont terminés."
          );
        } else if (hasPendingSpin) {
          $("#noelactif-status").text("Le résultat est conservé : relance l’envoi vers Forumactif.");
        } else if (alreadyPlayed) {
          $("#noelactif-status").text("Reviens demain pour une nouvelle rotation.");
        } else {
          $("#noelactif-status").text("Ta rotation du jour est disponible.");
        }

        const $history = $("#noelactif-history").empty();
        $history.toggleClass("is-scrollable", state.history.length >= 6);
        if (!state.history.length) {
          $history.append("<li>Aucune rotation enregistrée.</li>");
        } else {
          state.history.slice().reverse().forEach(function (entry) {
            $("<li>")
              .append(
                $("<span>").text(historyDateLabel(entry) + " — " + entry.label),
                $("<time>").text((entry.tickets >= 0 ? "+" : "") + entry.tickets)
              )
              .appendTo($history);
          });
        }

        renderAllocation();
      }

      function spinWheel() {
        if (spinning || state.lastSpinDay === state.simulatedDay || state.simulatedDay > 25) {
          return;
        }

        if (
          window.location.hostname === CONFIG.remoteLog.hostname
          && !memberIsIdentified()
        ) {
          $("#noelactif-status").text(
            "Identification du membre en cours…"
          );
          resolveForumMember()
            .done(function () {
              spinWheel();
            })
            .fail(function (error) {
              $("#noelactif-status").text(
                "Impossible d’identifier le membre : " + String(error)
              );
            });
          return;
        }

        spinning = true;
        $("#noelactif-result").stop(true, true).hide();
        render();

        const result = state.pendingSpin
          ? state.pendingSpin.result
          : weightedDraw();

        if (!state.pendingSpin) {
          state.pendingSpin = {
            day: state.simulatedDay,
            result: result
          };
          saveState();
        }

        const segmentAngle = 360 / CONFIG.wheel.length;
        const targetCenter = (result.index * segmentAngle) + (segmentAngle / 2);
        const extraTurns = 6 * 360;
        currentRotation += extraTurns + (360 - targetCenter);

        $("#noelactif-wheel").css("transform", "rotate(" + currentRotation + "deg)");
        $("#noelactif-status").text("La roue tourne…");

        window.setTimeout(function () {
          const entry = {
            day: state.simulatedDay,
            rotation: state.rotation + 1,
            label: result.label,
            tickets: result.tickets,
            balance: state.balance + result.tickets,
            dateLabel: String(state.simulatedDay).padStart(2, "0") + "/12/2026",
            timestamp: new Date().toLocaleString("fr-FR")
          };

          $("#noelactif-status").text(
            remoteLoggingIsAvailable()
              ? "Enregistrement du résultat dans la zone privée…"
              : "Simulation de l’envoi privé…"
          );

          publishPrivateLog(entry)
            .done(function (publication) {
              state.balance = entry.balance;
              state.rotation = entry.rotation;
              state.lastSpinDay = state.simulatedDay;
              state.pendingSpin = null;
              state.history.push({
                ...entry,
                publicationMode: publication.mode,
                topicId: publication.topicId
              });
              saveState();

              $("#noelactif-result-text").text(result.label);
              $("#noelactif-result").fadeIn(250);
              $("#noelactif-private-log").text(
                makePrivateMessage(entry)
                + "\n\nStatut : "
                + publication.mode.toUpperCase()
                + (publication.topicId ? "\nSujet Forumactif : t" + publication.topicId : "")
              );
            })
            .fail(function (error) {
              $("#noelactif-private-log").text(
                makePrivateMessage(entry)
                + "\n\nÉCHEC DE LA PUBLICATION\n"
                + String(error)
                + "\n\nLe résultat reste en attente et sera réutilisé au prochain essai."
              );
            })
            .always(function () {
              spinning = false;
              render();
            });
        }, 5300);
      }

      $("#noelactif-spin").on("click", spinWheel);

      $("#noelactif-next-day").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        if (spinning || state.simulatedDay >= 31) {
          return;
        }

        state.simulatedDay += 1;
        saveState();
        $("#noelactif-result").hide();
        $("#noelactif-private-log").text("Effectue la rotation du jour " + state.simulatedDay + " pour générer un nouveau message.");
        render();
      });

      $("#noelactif-test-allocation").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        if (spinning) {
          return;
        }

        state.simulatedDay = 26;
        saveState();
        $("#noelactif-result").hide();
        $("#noelactif-private-log").text(
          "Mode test : les hottes sont maintenant ouvertes du 26 au 31 décembre."
        );
        render();
        document.getElementById("noelactif-allocation").scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });

      $("#noelactif-test-tickets").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        state.balance += 100;
        saveState();
        render();
      });

      $("#noelactif-analyze-registry").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        const $button = $(this);
        const $analysis = $("#noelactif-registry-analysis").prop("hidden", false);
        $("#noelactif-registry-status").text(
          "Analyse du registre et de ses pages en cours…"
        );
        $button.prop("disabled", true);

        fetchRegistryPages()
          .done(function (pages) {
            const deposits = buildRegistryLists(pages);
            $("#noelactif-registry-status").text(
              deposits
              + " dépôt(s) analysé(s) sur "
              + pages.length
              + " page(s). Les doublons sont retirés grâce à l’identifiant du membre."
            );
            $analysis.get(0).scrollIntoView({
              behavior: "smooth",
              block: "nearest"
            });
          })
          .fail(function () {
            $("#noelactif-registry-status").text(
              "Impossible de lire le registre. Vérifie que Typlo est connecté et peut consulter le sujet t"
              + CONFIG.remoteLog.registryTopicId
              + "."
            );
          })
          .always(function () {
            $button.prop("disabled", false);
          });
      });

      $("#noelactif-generate-recovery").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        const memberId = Number($("#noelactif-recovery-member-id").val());
        const $button = $(this);
        if (!memberId || memberId < 1) {
          $("#noelactif-recovery-admin-status").text(
            "Renseigne d’abord l’identifiant numérique du membre."
          );
          return;
        }

        $button.prop("disabled", true);
        $("#noelactif-generated-recovery-code").val("");
        $("#noelactif-recovery-admin-status").text(
          "Analyse du journal privé et du registre central en cours…"
        );

        buildRecoveryForMember(memberId)
          .done(function (result) {
            $("#noelactif-generated-recovery-code").val(result.code).trigger("select");
            $("#noelactif-recovery-admin-status").text(
              result.username
              + " : "
              + result.rotations
              + " rotation(s), "
              + result.won
              + " ticket(s) gagnés, "
              + result.deposited
              + " déjà déposés dans "
              + result.hottes
              + " hotte(s). Solde restauré : "
              + result.balance
              + " ticket(s)."
            );
          })
          .fail(function (error) {
            $("#noelactif-recovery-admin-status").text(String(error));
          })
          .always(function () {
            $button.prop("disabled", false);
          });
      });

      $("#noelactif-request-recovery").on("click", function () {
        const $button = $(this);
        const $status = $("#noelactif-recovery-request-status");

        if (state.recoveryRequestSentAt) {
          $button.prop("disabled", true).text("Demande déjà envoyée");
          $status.text(
            "Ta demande a déjà été transmise aux Lutins. Il n’est pas nécessaire de la renouveler."
          );
          return;
        }

        if (
          window.location.hostname === CONFIG.remoteLog.hostname
          && !memberIsIdentified()
        ) {
          $status.text("Identification de ton compte Forumactif en cours…");
          resolveForumMember()
            .done(function () {
              $button.trigger("click");
            })
            .fail(function () {
              $status.text("Impossible d’identifier ton compte Forumactif.");
            });
          return;
        }

        $button.prop("disabled", true).text("Envoi de la demande…");
        $status.text("Transmission de ta demande aux Lutins…");

        publishRecoveryRequest()
          .done(function () {
            state.recoveryRequestSentAt = Date.now();
            saveState();
            $button.text("Demande envoyée");
            $status.text(
              "Ta demande a bien été transmise aux Lutins. Ils te communiqueront ton code de restauration."
            );
          })
          .fail(function (error) {
            $button
              .prop("disabled", false)
              .html('<i class="fa fa-envelope" aria-hidden="true"></i> Contacter Les Lutins');
            $status.text(String(error));
          });
      });

      $("#noelactif-restore-participation").on("click", function () {
        const $status = $("#noelactif-recovery-status");
        const code = $("#noelactif-recovery-code").val();

        if (
          window.location.hostname === CONFIG.remoteLog.hostname
          && !memberIsIdentified()
        ) {
          $status.text("Identification du membre en cours…");
          resolveForumMember()
            .done(function () {
              $("#noelactif-restore-participation").trigger("click");
            })
            .fail(function () {
              $status.text("Impossible d’identifier ton compte Forumactif.");
            });
          return;
        }

        try {
          const payload = decodeRecoveryCode(code);
          const member = getMember();
          if (Number(payload.id) !== Number(member.id)) {
            throw new Error(
              "Ce code appartient à un autre membre et ne peut pas être utilisé sur ce compte."
            );
          }
          if (!window.confirm(
            "Restaurer la participation de "
            + payload.username
            + " ? Les données locales actuelles seront remplacées."
          )) {
            return;
          }

          state = $.extend(true, defaultState(), payload.state);
          state.pendingSpin = null;
          state.pendingAllocation = null;
          state.lastRegistryPostAt = null;
          currentRotation = state.rotation || 0;
          $("input[name='noelactif-prize']").prop("checked", false);
          saveState();
          render();
          $("#noelactif-recovery-code").val("");
          $status.text(
            "Participation restaurée : "
            + state.rotation
            + " rotation(s) et "
            + state.balance
            + " ticket(s) disponibles."
          );
        } catch (error) {
          $status.text(error.message || String(error));
        }
      });

      $("input[name='noelactif-prize']").on("change", renderAllocation);

      $("#noelactif-submit-allocation").on("click", function () {
        if (!allocationWindowIsOpen()) {
          return;
        }

        if (registryCooldownRemaining() > 0) {
          renderAllocation();
          return;
        }

        if (
          window.location.hostname === CONFIG.remoteLog.hostname
          && !memberIsIdentified()
        ) {
          $("#noelactif-allocation-state").text(
            "Identification du membre en cours…"
          );
          resolveForumMember()
            .done(function () {
              $("#noelactif-submit-allocation").trigger("click");
            })
            .fail(function (error) {
              $("#noelactif-allocation-state").text(
                "Impossible d’identifier le membre : " + String(error)
              );
            });
          return;
        }

        const keys = newlySelectedPrizeKeys();
        const cost = allocationCost(keys);

        if (!keys.length || cost > state.balance) {
          renderAllocation();
          return;
        }

        const summary = keys.map(function (key) {
          return "• " + CONFIG.prizes[key].label + " (" + CONFIG.prizes[key].cost + " tickets)";
        }).join("\n");

        if (!window.confirm(
          "Confirmer le dépôt de ces tickets ?\n\n"
          + summary
          + "\n\nTickets à déposer : "
          + cost
          + " tickets"
        )) {
          return;
        }

        const message = makeAllocationMessage(keys, cost);
        state.pendingAllocation = { keys: keys, cost: cost };
        saveState();
        $("#noelactif-submit-allocation").prop("disabled", true);
        $("#noelactif-allocation-state").text("Enregistrement du dépôt dans le registre des hottes…");

        publishRegistryLog(message)
          .done(function (publication) {
            state.balance -= cost;
            state.lastRegistryPostAt = Date.now();
            state.allocations = state.allocations || [];
            state.allocations.push({
              keys: keys,
              cost: cost,
              submittedAt: new Date().toISOString(),
              publicationMode: publication.mode,
              topicId: publication.topicId
            });
            state.pendingAllocation = null;
            state.pendingJournal = remoteLoggingIsAvailable()
              ? {
                message: message,
                dueAt: state.lastRegistryPostAt + CONFIG.remoteLog.registryCooldownMs
              }
              : null;
            saveState();
            render();
          })
          .fail(function (error) {
            state.pendingAllocation = null;
            saveState();
            renderAllocation();
            $("#noelactif-allocation-state").text(
              "Échec de la publication : "
              + String(error)
              + " Le dépôt n’a pas été validé et peut être renvoyé."
            );
          });
      });

      $("#noelactif-reset").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        if (!window.confirm("Réinitialiser entièrement la participation de test ?")) {
          return;
        }

        localStorage.removeItem(CONFIG.storageKey);
        state = defaultState();
        currentRotation = 0;
        $("#noelactif-wheel").css("transition", "none").css("transform", "rotate(0deg)");
        window.setTimeout(function () {
          $("#noelactif-wheel").css("transition", "transform 5.2s cubic-bezier(.12,.68,.16,1)");
        }, 30);
        $("#noelactif-result").hide();
        $("#noelactif-private-log").text("Le message envoyé sur Forumactif apparaîtra ici après une rotation.");
        render();
      });

      $("#noelactif-rules-link")
        .attr("href", CONFIG.rulesUrl)
        .on("click", function (event) {
          if (!CONFIG.rulesUrl || CONFIG.rulesUrl === "#") {
            event.preventDefault();
            window.alert("Le règlement de Noëlactif 2026 sera bientôt disponible.");
          }
        });

      initAtelierStory();
      render();
      if (window.location.hostname === CONFIG.remoteLog.hostname) {
        resolveForumMember().done(renderDebugPanel);
      }
    });
