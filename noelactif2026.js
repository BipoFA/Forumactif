$(function () {
      "use strict";

      const CONFIG = {
        storageKey: "noelactif2026_forum_test_v2",
        testMode: true,
        emergencyStop: false,
        emergencyMessage: "Les Lutins effectuent actuellement une intervention technique. La grande lotterie de Noël est temporairement suspendue. Reviens dans quelques instants !",
        albumCompletionBonus: 6,
        rulesUrl: "#",
        remoteLog: {
          hostname: "forum.forumactif.com",
          privateForumId: 110,
          privateForumUrl: "/f110-signalements-d-archives",
          publicForumId: 110,
          publicForumUrl: "/f110-signalements-d-archives",
          rotationTopicId: 413364,
          rotationTopicUrl: "/t413364-noelactif-2026-participation-des-membres",
          registryTopicId: 413332,
          registryTopicUrl: "/t413332-noelactif-2026-registre-des-hottes-du-pere-noel",
          recoveryTopicId: 413333,
          recoveryTopicUrl: "/t413333-noelactif-2026-registre-des-demandes-de-restauration",
          registryCooldownMs: 11000,
          enabled: true
        },
        debugOwners: [
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
        ],
        shopTesters: [
          { username: "Lutins", id: 177295 }
        ],
        recoverySignature: "noelactif-2026-restauration-v1",
        wheel: [
          { label: "1 ticket — Groumph en chocolat", tickets: 1, weight: 15 },
          { label: "2 tickets — Hotte de papy Chacha", tickets: 2, weight: 20 },
          { label: "3 tickets — Kardo surprise", tickets: 3, weight: 25 },
          { label: "4 tickets — Hydromel de la mère Luzz", tickets: 4, weight: 20 },
          { label: "5 tickets — Peluche Gizmo", tickets: 5, weight: 15 },
          { label: "10 tickets — Jackpot de Pinguino !", tickets: 10, weight: 5 }
        ],
        rewardImages: {
          1: "https://i.servimg.com/u/f38/11/01/36/00/groump12.png",
          2: "https://i.servimg.com/u/f38/11/01/36/00/hotte-10.png",
          3: "https://i.servimg.com/u/f38/11/01/36/00/kardo-10.png",
          4: "https://i.servimg.com/u/f38/11/01/36/00/hydrom10.png",
          5: "https://i.servimg.com/u/f38/11/01/36/00/peluch10.png",
          10: "https://i38.servimg.com/u/f38/11/01/36/00/jackpo11.png"
        },
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

      function activateEmergencyStop() {
        if (!CONFIG.emergencyStop) {
          return false;
        }

        $("<style>", {
          id: "noelactif-emergency-style",
          text: [
            "body.noelactif-emergency-locked{overflow:hidden!important;}",
            "#noelactif-emergency-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:clamp(16px,4vw,42px);overflow-y:auto;background:radial-gradient(circle at 50% 20%,rgba(202,145,55,.2),transparent 35%),rgba(18,8,3,.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}",
            "#noelactif-emergency-dialog{position:relative;width:min(680px,100%);padding:clamp(28px,5vw,46px);color:#392313;border:2px solid #d9aa50;border-radius:24px;background:linear-gradient(rgba(255,249,218,.97),rgba(240,218,161,.98));box-shadow:0 0 0 6px rgba(75,31,14,.9),0 18px 55px rgba(0,0,0,.68),inset 0 0 28px rgba(125,69,24,.18);text-align:center;}",
            "#noelactif-emergency-dialog:before{content:'';position:absolute;inset:9px;pointer-events:none;border:1px solid rgba(151,91,31,.34);border-radius:16px;}",
            "#noelactif-emergency-dialog>*{position:relative;z-index:1;}",
            "#noelactif-emergency-dialog .noelactif-emergency-icon{display:block;margin:0 0 12px;color:#9d2d1c;font-size:3rem;line-height:1;}",
            "#noelactif-emergency-dialog h2{margin:0 0 16px;color:#742714;font:700 clamp(1.65rem,4vw,2.25rem)/1.15 Georgia,'Times New Roman',serif;}",
            "#noelactif-emergency-dialog p{max-width:540px;margin:0 auto;color:#392313;font-size:1rem;line-height:1.7;}",
            "#noelactif-emergency-dialog .noelactif-emergency-signature{margin-top:18px;color:#176238;font-weight:700;}"
          ].join("")
        }).appendTo("head");

        $("<div>", {
          id: "noelactif-emergency-overlay",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": "noelactif-emergency-title"
        }).append(
          $("<div>", { id: "noelactif-emergency-dialog" }).append(
            $("<span>", {
              class: "noelactif-emergency-icon",
              "aria-hidden": "true",
              text: "🎄"
            }),
            $("<h2>", {
              id: "noelactif-emergency-title",
              text: "Atelier temporairement fermé"
            }),
            $("<p>").text(CONFIG.emergencyMessage),
            $("<p>", {
              class: "noelactif-emergency-signature",
              text: "Les Lutins de Forumactif"
            })
          )
        ).appendTo("body");

        $("body")
          .addClass("noelactif-emergency-locked")
          .children()
          .not("#noelactif-emergency-overlay")
          .attr("aria-hidden", "true");
        $("#noelactif-emergency-dialog").attr("tabindex", "-1").trigger("focus");
        return true;
      }

      if (activateEmergencyStop()) {
        return;
      }

      Object.keys(CONFIG.rewardImages).forEach(function (tickets) {
        const image = new Image();
        image.src = CONFIG.rewardImages[tickets];
      });

      let state = loadState();
      let currentRotation = 0;
      let spinning = false;
      let resolvedMember = null;
      let memberRequest = null;
      let registryCountdownTimer = null;
      let pendingJournalTimer = null;
      let journalPublicationInProgress = false;
      let centrallyCheckedSpinDay = null;
      let centrallyBlockedSpinDay = null;
      let centralSyncInProgress = false;
      let centralRewardTickets = [];

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
        return CONFIG.debugOwners.some(function (owner) {
          return member.id === owner.id
            && String(member.username).toLowerCase() === owner.username.toLowerCase();
        });
      }

      function hasEarlyShopAccess() {
        if (!CONFIG.testMode) {
          return false;
        }

        const member = getMember();
        return CONFIG.shopTesters.some(function (tester) {
          return member.id === tester.id
            && String(member.username).toLowerCase() === tester.username.toLowerCase();
        });
      }

      function renderDebugPanel() {
        const authorized = isDebugOwner();
        $("#noelactif-debug-panel").prop("hidden", !authorized);
        if (authorized) {
          $(".noelactif-admin-details > .noelactif-note").text(
            "Espace technique réservé à l’équipe de test autorisée. "
            + "Les actions effectuées ici peuvent publier une trace réelle sur le forum."
          );
        }
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
          forumUrl: "",
          forumUrlDeclaredAt: null,
          topicId: null,
          pendingSpin: null,
          allocations: [],
          pendingAllocation: null,
          pendingJournal: null,
          lastRegistryPostAt: null,
          recoveryRequestSentAt: null,
          manualAdjustments: [],
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
          if (!Array.isArray(saved.manualAdjustments)) {
            saved.manualAdjustments = [];
          }

          return saved;
        } catch (error) {
          return defaultState();
        }
      }

      function saveState() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      }

      function normalizeForumUrl(value) {
        let candidate = String(value || "").trim();
        if (!candidate) {
          throw new Error("Indique l’adresse du forum qui recevra les crédits.");
        }
        if (!/^https?:\/\//i.test(candidate)) {
          candidate = "https://" + candidate;
        }

        let parsed;
        try {
          parsed = new URL(candidate);
        } catch (error) {
          throw new Error("Cette adresse ne semble pas valide.");
        }

        if (
          (parsed.protocol !== "https:" && parsed.protocol !== "http:")
          || !parsed.hostname
          || parsed.username
          || parsed.password
        ) {
          throw new Error("Saisis une adresse de forum complète et valide.");
        }

        return parsed.origin + "/";
      }

      function openForumModal(isEditing) {
        $("#noelactif-forum-url").val(state.forumUrl || "");
        $("#noelactif-forum-error").text("");
        $("#noelactif-cancel-forum").prop("hidden", !isEditing || !state.forumUrl);
        $("#noelactif-forum-overlay").attr("aria-hidden", "false");
        $("body").addClass("noelactif-forum-modal-open");
        window.setTimeout(function () {
          $("#noelactif-forum-url").trigger("focus");
        }, 50);
      }

      function closeForumModal() {
        if (!state.forumUrl) {
          return;
        }
        $("body").removeClass("noelactif-forum-modal-open");
        $("#noelactif-forum-overlay").attr("aria-hidden", "true");
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

      function rotationTotalTickets(entry) {
        return (
          (Number(entry && entry.tickets) || 0)
          + (Number(entry && entry.bonusTickets) || 0)
        );
      }

      function collectionTicketsFromEntries(entries) {
        const knownTickets = CONFIG.wheel.map(function (item) {
          return Number(item.tickets);
        });
        const collected = {};

        (entries || []).forEach(function (entry) {
          const tickets = Number(entry.tickets);
          if (knownTickets.indexOf(tickets) !== -1) {
            collected[tickets] = true;
          }
        });

        return Object.keys(collected).map(Number).sort(function (a, b) {
          return a - b;
        });
      }

      function currentCollectionTickets() {
        return collectionTicketsFromEntries(
          (state.history || []).concat(
            centralRewardTickets.map(function (tickets) {
              return { tickets: tickets };
            })
          )
        );
      }

      function completesAlbumWith(tickets) {
        const collected = currentCollectionTickets();
        const reward = Number(tickets);
        return collected.length === CONFIG.wheel.length - 1
          && collected.indexOf(reward) === -1;
      }

      function renderAlbum() {
        const collected = currentCollectionTickets();
        const $album = $("#noelactif-album");

        if (!$album.children().length) {
          CONFIG.wheel.forEach(function (item) {
            $("<img>", {
              "class": "noelactif-album-item",
              "data-tickets": item.tickets,
              src: CONFIG.rewardImages[item.tickets],
              alt: item.label,
              title: item.label + " — à découvrir"
            }).appendTo($album);
          });
        }

        $album.find(".noelactif-album-item").each(function () {
          const $item = $(this);
          const tickets = Number($item.attr("data-tickets"));
          const isCollected = collected.indexOf(tickets) !== -1;
          const wheelItem = CONFIG.wheel.find(function (item) {
            return Number(item.tickets) === tickets;
          });

          $item
            .toggleClass("is-collected", isCollected)
            .attr("title", wheelItem.label + (
              isCollected ? " — collectionnée" : " — à découvrir"
            ));
        });

        $("#noelactif-album-count").text(
          collected.length
          + " récompense(s)"
          + " sur "
          + CONFIG.wheel.length
        );
      }

      function makePrivateMessage(entry) {
        const member = getMember();
        return [
          "[NOELACTIF 2026 — ROTATION]",
          "",
          "Membre : " + member.username,
          "Identifiant : " + member.id,
          "Forum bénéficiaire : " + state.forumUrl,
          "Jour de participation : " + entry.day + " décembre 2026",
          "Horodatage : " + entry.timestamp,
          "Résultat : " + entry.label,
          "Tickets remportés : " + entry.tickets,
          "Bonus album : " + (Number(entry.bonusTickets) || 0),
          "Numéro de rotation : " + entry.rotation,
          "Solde après rotation : " + entry.balance
        ].join("\n");
      }

      function rotationRegistryMatcher(url, topicId) {
        const expectedTopicId = Number(
          topicId || CONFIG.remoteLog.rotationTopicId
        );
        return (
          new RegExp(
            "^/t"
            + expectedTopicId
            + "(?:p\\d+)?(?:-|$)",
            "i"
          ).test(url.pathname)
          || (
            url.searchParams.get("t") === String(expectedTopicId)
            && url.pathname.indexOf("/viewtopic") !== -1
          )
        );
      }

      function makeRotationToken() {
        return [
          getMember().id,
          state.simulatedDay,
          Date.now(),
          Math.random().toString(36).slice(2, 12)
        ].join("-");
      }

      function makeRotationRegistryMessage(entry, token) {
        const member = getMember();
        const rewardImage = CONFIG.rewardImages[Number(entry.tickets)] || "";
        const completedAlbumImages = CONFIG.wheel.map(function (reward) {
          const image = CONFIG.rewardImages[Number(reward.tickets)] || "";
          return image ? "[img(58px,58px)]" + image + "[/img]" : "";
        }).join(" ");
        const albumCelebration = entry.completesAlbum
          ? [
            "",
            "[table style=\"width:100%; max-width:650px; height:330px; margin:10px auto; border:2px solid #c9953e; border-radius:8px; background-image:url(https://i38.servimg.com/u/f38/11/01/36/00/call_a10.png); background-position:center; background-size:cover; background-repeat:no-repeat;\"]",
            "[tr][td style=\"height:88px; padding:0 55px; color:#ffe4a3; vertical-align:middle;\"]",
            "[center][size=18] [b]ALBUM DE NOËL COMPLÉTÉ ![/b] [/size][/center]",
            "[/td][/tr]",
            "[tr][td style=\"height:185px; padding:4px 68px; color:#392313; vertical-align:middle;\"]",
            "[center][size=16][color=#176238][b]" + member.username + "[/b][/color] vient de réunir les six récompenses de la lotterie ![/size]",
            completedAlbumImages,
            "[size=14][color=#961613][b]Bonus de collection : +" + (Number(entry.bonusTickets) || CONFIG.albumCompletionBonus) + " tickets ![/b][/color][/size]",
            "[size=12][color=#8a6a43][i]Les Lutins célèbrent officiellement cet exploit dans le grand registre de l’atelier ![/i][/color][/size][/center]",
            "[/td][/tr]",
            "[tr][td style=\"height:57px; padding:5px 75px 24px; color:#8a6a43; vertical-align:top;\"]",
            "[center][size=10][color=#8a6a43]Les six trésors de Noël sont désormais réunis.[/color][/size][/center]",
            "[/td][/tr][/table]"
          ]
          : [];
        const displayDay = Number(entry.day) === 1
          ? "1[sup]er[/sup]"
          : String(entry.day);
        return [
          "[table style=\"width:100%; max-width:650px; height:380px; margin:auto; border:2px solid #c9953e; border-radius:8px; background-image:url(https://i38.servimg.com/u/f38/11/01/36/00/call_a10.png); background-position:center; background-size:cover; background-repeat:no-repeat;\"]",
          "[tr][td style=\"height:88px; padding:0 55px; color:#ffe4a3; vertical-align:middle;\"]",
          "[center][size=18] [b]UN NOUVEAU PASSAGE DANS L’ATELIER ![/b] [/size][/center]",
          "[/td][/tr]",
          "[tr][td style=\"height:225px; padding:0 68px; color:#392313; vertical-align:middle;\"]",
          "[center][size=16][color=#176238][b]"
            + member.username
            + "[/b][/color] vient de faire tourner la grande roue de Noël ![/size]",
          "La roue s’est arrêtée sur…",
          "[size=18][color=#961613][b] "
            + entry.label
            + " [/b][/color][/size]",
          "[img(105px,105px)]" + rewardImage + "[/img]",
          "[size=12][color=#8a6a43][i]Les Lutins ont soigneusement consigné son passage dans le grand registre de l’atelier.[/i][/color][/size][/center]",
          "[/td][/tr]",
          "[tr][td style=\"height:67px; padding:6px 75px 28px; color:#8a6a43; vertical-align:top;\"]",
          "[center][size=10][color=#8a6a43]Passage enregistré le "
            + displayDay
            + " décembre 2026.[/color][/size][/center]",
          "[/td][/tr][/table]"
        ].concat(albumCelebration, [
          "",
          "[table style=\"display:none; width:0; height:0; margin:0; padding:0;\"][tr][td style=\"display:none; color:#fff4d2; font-size:1px; line-height:0;\"]",
          "[NOELACTIF 2026 — ROTATION CENTRALE]",
          "Membre : " + member.username,
          "Identifiant : " + member.id,
          "Jour de participation : " + entry.day + " décembre 2026",
          "Date de participation : " + entry.dateLabel,
          "Horodatage : " + entry.timestamp,
          "Résultat : " + entry.label,
          "Tickets remportés : " + entry.tickets,
          "Bonus album : " + (Number(entry.bonusTickets) || 0),
          "Album complété : " + (entry.completesAlbum ? "OUI" : "NON"),
          "Jeton technique : " + token,
          "[/td][/tr][/table]"
        ]).join("\n");
      }

      function rotationEntriesFromPage(html) {
        const documentNode = new DOMParser().parseFromString(
          String(html || ""),
          "text/html"
        );
        let $posts = $(documentNode).find(".post");
        if (!$posts.length) {
          $posts = $(documentNode).find(".postbody");
        }

        const entries = [];
        $posts.each(function (order) {
          const text = pageText($(this));
          if (text.indexOf("[NOELACTIF 2026 — ROTATION CENTRALE]") === -1) {
            return;
          }

          const idMatch = text.match(/Identifiant\s*:\s*(\d+)/i);
          const memberMatch = text.match(/Membre\s*:\s*([^\n]+)/i);
          const dayMatch = text.match(
            /Jour de participation\s*:\s*(\d+)\s+décembre 2026/i
          );
          const resultMatch = text.match(/Résultat\s*:\s*([^\n]+)/i);
          const ticketsMatch = text.match(/Tickets remportés\s*:\s*(\d+)/i);
          const bonusMatch = text.match(/Bonus album\s*:\s*(\d+)/i);
          const albumMatch = text.match(/Album complété\s*:\s*(OUI|NON)/i);
          const timestampMatch = text.match(/Horodatage\s*:\s*([^\n]+)/i);
          const tokenMatch = text.match(/Jeton technique\s*:\s*([^\s]+)/i);
          const postIdSource = String(
            $(this).attr("id")
            || $(this).find("[id^='p'], a[name^='p']").first().attr("id")
            || $(this).find("a[name^='p']").first().attr("name")
            || ""
          );
          const postIdMatch = postIdSource.match(/p?(\d+)/i);

          if (!idMatch || !dayMatch || !resultMatch || !ticketsMatch) {
            return;
          }

          entries.push({
            id: Number(idMatch[1]),
            username: memberMatch ? memberMatch[1].trim() : "Membre",
            day: Number(dayMatch[1]),
            label: resultMatch[1].trim(),
            tickets: Number(ticketsMatch[1]),
            bonusTickets: bonusMatch ? Number(bonusMatch[1]) : 0,
            completesAlbum: albumMatch ? albumMatch[1].toUpperCase() === "OUI" : false,
            timestamp: timestampMatch ? timestampMatch[1].trim() : "",
            token: tokenMatch ? tokenMatch[1].trim() : "",
            postId: postIdMatch ? Number(postIdMatch[1]) : Number.MAX_SAFE_INTEGER,
            order: order
          });
        });

        return entries;
      }

      function rotationSuccessorTopicId(pages, currentTopicId) {
        let latestPost = null;

        pages.forEach(function (html, pageOrder) {
          const documentNode = new DOMParser().parseFromString(
            String(html || ""),
            "text/html"
          );
          let $posts = $(documentNode).find(".post");
          if (!$posts.length) {
            $posts = $(documentNode).find(".postbody");
          }

          $posts.each(function (postOrder) {
            const $post = $(this);
            const rawId = String($post.attr("id") || "");
            const idMatch = rawId.match(/(?:^|[^0-9])p?(\d+)(?:$|[^0-9])/i);
            const postId = idMatch
              ? Number(idMatch[1])
              : (pageOrder * 10000) + postOrder;

            if (!latestPost || postId > latestPost.id) {
              latestPost = {
                id: postId,
                element: this
              };
            }
          });
        });

        if (!latestPost) {
          return null;
        }

        let successorId = null;
        $(latestPost.element).find("a[href]").each(function () {
          if (successorId !== null) {
            return;
          }
          try {
            const url = new URL(
              this.getAttribute("href"),
              window.location.origin
            );
            const candidateId = Number(url.searchParams.get("t"));
            if (
              url.origin === window.location.origin
              && url.pathname.indexOf("/viewtopic") !== -1
              && candidateId
              && candidateId !== Number(currentTopicId)
            ) {
              successorId = candidateId;
            }
          } catch (error) {
            // Les liens non standard sont ignorés.
          }
        });

        return successorId;
      }

      function validRotationRegistrySuccessor(html) {
        const documentNode = new DOMParser().parseFromString(
          String(html || ""),
          "text/html"
        );
        const heading = [
          $(documentNode).find("h1, .page-title, .topic-title").text(),
          documentNode.title || ""
        ].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const text = $(documentNode).text();

        return (
          /noelactif\s*2026/i.test(heading)
          && /participation\s+des\s+membres/i.test(heading)
          && /NOELACTIF 2026\s*[—-]\s*ROTATION CENTRALE/i.test(text)
        );
      }

      function resolveRotationRegistryChain() {
        const visited = {};
        const topics = [];
        const pages = [];
        const maximumTopics = 20;

        function finish(activeTopicId) {
          return {
            pages: pages,
            topics: topics,
            activeTopicId: Number(activeTopicId)
          };
        }

        function follow(topicId, topicUrl) {
          const numericTopicId = Number(topicId);
          if (
            !numericTopicId
            || visited[numericTopicId]
            || topics.length >= maximumTopics
          ) {
            return $.Deferred().resolve(
              finish(topics.length
                ? topics[topics.length - 1].id
                : CONFIG.remoteLog.rotationTopicId)
            ).promise();
          }

          visited[numericTopicId] = true;
          return fetchPaginatedPages(
            topicUrl,
            function (url) {
              return rotationRegistryMatcher(url, numericTopicId);
            },
            150
          ).then(function (topicPages) {
            topics.push({
              id: numericTopicId,
              url: topicUrl
            });
            Array.prototype.push.apply(pages, topicPages);

            const successorId = rotationSuccessorTopicId(
              topicPages,
              numericTopicId
            );
            if (!successorId || visited[successorId]) {
              return finish(numericTopicId);
            }

            const successorUrl = "/viewtopic.php?t=" + successorId;
            return $.get(successorUrl).then(function (successorHtml) {
              if (!validRotationRegistrySuccessor(successorHtml)) {
                return finish(numericTopicId);
              }
              return follow(successorId, successorUrl);
            }, function () {
              return finish(numericTopicId);
            });
          });
        }

        return follow(
          CONFIG.remoteLog.rotationTopicId,
          CONFIG.remoteLog.rotationTopicUrl
        );
      }

      function fetchRotationRegistryPages() {
        return resolveRotationRegistryChain().then(function (chain) {
          return chain.pages;
        });
      }

      function centralRotationsFor(memberId, day) {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve([]).promise();
        }

        return fetchRotationRegistryPages().then(function (pages) {
          const entries = [];
          pages.forEach(function (html, pageOrder) {
            rotationEntriesFromPage(html).forEach(function (entry) {
              if (
                entry.id === Number(memberId)
                && entry.day === Number(day)
              ) {
                entry.pageOrder = pageOrder;
                entries.push(entry);
              }
            });
          });

          return entries.sort(function (a, b) {
            if (a.postId !== b.postId) {
              return a.postId - b.postId;
            }
            if (a.pageOrder !== b.pageOrder) {
              return a.pageOrder - b.pageOrder;
            }
            return a.order - b.order;
          });
        });
      }

      function canonicalCentralRotationsFor(memberId) {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve([]).promise();
        }

        return fetchRotationRegistryPages().then(function (pages) {
          const entries = [];
          pages.forEach(function (html, pageOrder) {
            rotationEntriesFromPage(html).forEach(function (entry) {
              if (entry.id === Number(memberId)) {
                entry.pageOrder = pageOrder;
                entries.push(entry);
              }
            });
          });

          entries.sort(function (a, b) {
            if (a.postId !== b.postId) {
              return a.postId - b.postId;
            }
            if (a.pageOrder !== b.pageOrder) {
              return a.pageOrder - b.pageOrder;
            }
            return a.order - b.order;
          });

          const canonicalByDay = {};
          entries.forEach(function (entry) {
            if (!canonicalByDay[entry.day]) {
              canonicalByDay[entry.day] = entry;
            }
          });

          return Object.keys(canonicalByDay)
            .map(function (day) {
              return canonicalByDay[day];
            })
            .sort(function (a, b) {
              return a.day - b.day;
            });
        });
      }

      function synchronizeParticipationFromCentral() {
        if (
          centralSyncInProgress
          || !remoteLoggingIsAvailable()
          || !memberIsIdentified()
        ) {
          return $.Deferred().resolve({
            imported: 0,
            unchanged: true
          }).promise();
        }

        centralSyncInProgress = true;
        const member = getMember();
        const $status = $("#noelactif-status");
        render();
        $status.text("Synchronisation avec le registre des Lutins…");

        return $.when(
          canonicalCentralRotationsFor(member.id),
          fetchRegistryPages()
        ).then(function (centralEntries, registryPages) {
          centralRewardTickets = collectionTicketsFromEntries(centralEntries);
          const localByDay = {};
          (state.history || []).forEach(function (entry) {
            if (!localByDay[Number(entry.day)]) {
              localByDay[Number(entry.day)] = entry;
            }
          });

          let imported = 0;
          let centralGainChanged = false;
          centralEntries.forEach(function (entry) {
            if (!localByDay[entry.day]) {
              imported += 1;
            } else if (
              rotationTotalTickets(localByDay[entry.day])
              !== rotationTotalTickets(entry)
            ) {
              centralGainChanged = true;
            }
            localByDay[entry.day] = {
              day: entry.day,
              rotation: 0,
              label: entry.label,
              tickets: entry.tickets,
              bonusTickets: entry.bonusTickets || 0,
              completesAlbum: Boolean(entry.completesAlbum),
              balance: 0,
              dateLabel: String(entry.day).padStart(2, "0") + "/12/2026",
              timestamp: entry.timestamp,
              publicationMode: "registre central synchronisé",
              topicId: CONFIG.remoteLog.rotationTopicId
            };
          });

          const mergedHistory = Object.keys(localByDay)
            .map(function (day) {
              return localByDay[day];
            })
            .sort(function (a, b) {
              return Number(a.day) - Number(b.day);
            });

          let cumulativeBalance = 0;
          mergedHistory.forEach(function (entry, index) {
            cumulativeBalance += rotationTotalTickets(entry);
            entry.rotation = index + 1;
            entry.balance = cumulativeBalance;
          });

          const depositedKeys = {};
          const memberDeposits = [];
          registryPages.forEach(function (html) {
            registryEntriesFromPage(html).forEach(function (entry) {
              if (entry.id === Number(member.id)) {
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
          const previousValidatedKeys = validatedPrizeKeys();
          const newDepositFound = keys.some(function (key) {
            return previousValidatedKeys.indexOf(key) === -1;
          });
          const shouldRecalculate = (
            imported > 0
            || newDepositFound
            || centralGainChanged
          );

          if (shouldRecalculate) {
            const manualAdjustments = state.manualAdjustments || [];
            const manuallyAdded = manualAdjustments.reduce(function (total, entry) {
              return total + (Number(entry.tickets) || 0);
            }, 0);
            const won = mergedHistory.reduce(function (total, entry) {
              return total + rotationTotalTickets(entry);
            }, 0);
            const datedDeposits = memberDeposits.filter(function (entry) {
              return entry.depositAt !== null && entry.remainingBalance !== null;
            }).sort(function (a, b) {
              return a.depositAt - b.depositAt;
            });
            const lastDeposit = datedDeposits.length
              ? datedDeposits[datedDeposits.length - 1]
              : null;
            const gainsAfterLastDeposit = lastDeposit
              ? mergedHistory.reduce(function (total, entry) {
                const rotationAt = parseForumDateTime(entry.timestamp);
                return rotationAt !== null && rotationAt > lastDeposit.depositAt
                  ? total + rotationTotalTickets(entry)
                  : total;
              }, 0)
              : null;
            const manualAfterLastDeposit = lastDeposit
              ? manualAdjustments.reduce(function (total, entry) {
                return entry.addedAt !== null && entry.addedAt > lastDeposit.depositAt
                  ? total + (Number(entry.tickets) || 0)
                  : total;
              }, 0)
              : null;

            state.balance = Math.max(
              0,
              lastDeposit
                ? lastDeposit.remainingBalance
                  + gainsAfterLastDeposit
                  + manualAfterLastDeposit
                : won + manuallyAdded - allocationCost(keys)
            );
          }

          state.history = mergedHistory;
          state.rotation = mergedHistory.length;
          if (centralEntries.length) {
            const latestDay = centralEntries[centralEntries.length - 1].day;
            state.lastSpinDay = latestDay;
            if (CONFIG.testMode) {
              state.simulatedDay = Math.max(state.simulatedDay, latestDay);
            }
            if (latestDay === state.simulatedDay) {
              centrallyBlockedSpinDay = latestDay;
            }
          }

          if (keys.length) {
            state.allocations = [{
              keys: keys,
              cost: allocationCost(keys),
              submittedAt: new Date().toISOString(),
              publicationMode: "registre des hottes synchronisé",
              topicId: CONFIG.remoteLog.registryTopicId
            }];
          }

          saveState();
          return {
            imported: imported,
            rotations: mergedHistory.length,
            balance: state.balance,
            updated: shouldRecalculate,
            unchanged: !shouldRecalculate
          };
        }).always(function () {
          centralSyncInProgress = false;
        });
      }

      function publishCentralRotation(entry) {
        if (!remoteLoggingIsAvailable()) {
          return $.Deferred().resolve({
            accepted: true,
            mode: "simulation locale",
            topicId: null,
            retried: false
          }).promise();
        }

        const token = makeRotationToken();
        const message = makeRotationRegistryMessage(entry, token);
        let retried = false;
        let publishedTopicId = CONFIG.remoteLog.rotationTopicId;

        function submitRotationMessage() {
          return resolveRotationRegistryChain().then(function (chain) {
            publishedTopicId = chain.activeTopicId;
            return getPostingForm(
              "/post?t=" + publishedTopicId + "&mode=reply"
            );
          }).then(function (formData) {
            return submitForumPost(formData, "", message);
          }).then(function () {
            state.lastRegistryPostAt = Date.now();
            saveState();
          });
        }

        function centralEntriesAfter(delay) {
          const deferred = $.Deferred();
          window.setTimeout(function () {
            centralRotationsFor(getMember().id, entry.day)
              .done(deferred.resolve)
              .fail(deferred.reject);
          }, delay);
          return deferred.promise();
        }

        function verifyRotationPublication() {
          return centralEntriesAfter(1500).then(function (entries) {
            if (entries.length) {
              return entries;
            }

            /*
             * Une seconde lecture sans republier évite les doublons si le
             * premier message met simplement un peu de temps à apparaître.
             */
            return centralEntriesAfter(900);
          });
        }

        return submitRotationMessage()
          .then(verifyRotationPublication)
          .then(function (entries) {
            if (entries.length) {
              return entries;
            }

            /*
             * Forumactif peut interrompre l'envoi lorsqu'une autre réponse a
             * été publiée entre l'ouverture du formulaire et sa validation.
             * Le même bulletin et le même jeton sont alors renvoyés une fois,
             * à partir d'un formulaire neuf.
             */
            retried = true;
            return submitRotationMessage().then(verifyRotationPublication);
          })
          .then(function (entries) {
            if (!entries.length) {
              return $.Deferred().reject(
                "La rotation n’apparaît pas dans le registre central après la relance automatique."
              ).promise();
            }

            return {
              accepted: entries[0].token === token,
              canonical: entries[0],
              topicId: publishedTopicId,
              mode: retried
                ? "registre central des rotations — relance automatique"
                : "registre central des rotations",
              retried: retried
            };
          });
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
        function topicIdFromAddress(address) {
          const source = String(address || "");
          const prettyUrl = source.match(
            /\/t(\d+)(?:p\d+)?(?:-|\/|#|\?|&|["']|$)/i
          );
          if (prettyUrl) {
            return Number(prettyUrl[1]);
          }

          const classicUrl = source.match(/[?&]t=(\d+)/i);
          if (classicUrl) {
            return Number(classicUrl[1]);
          }

          return null;
        }

        /*
         * L'adresse finale de la requête est la source la plus fiable. Il ne
         * faut surtout pas rechercher le premier lien /t... dans tout le HTML :
         * les menus Forumactif contiennent d'autres sujets (FAQ, annonces...).
         */
        const responseTopicId = topicIdFromAddress(
          xhr && xhr.responseURL ? xhr.responseURL : ""
        );
        if (responseTopicId) {
          return responseTopicId;
        }

        const parsed = new DOMParser().parseFromString(html || "", "text/html");
        const trustedAddresses = [];

        parsed.querySelectorAll("meta[http-equiv='refresh']").forEach(function (meta) {
          const content = meta.getAttribute("content") || "";
          const refreshUrl = content.match(/url\s*=\s*['"]?([^'";\s]+)/i);
          if (refreshUrl) {
            trustedAddresses.push(refreshUrl[1]);
          }
        });

        parsed.querySelectorAll("link[rel='canonical']").forEach(function (link) {
          trustedAddresses.push(link.getAttribute("href") || "");
        });

        parsed.querySelectorAll("script").forEach(function (script) {
          const code = script.textContent || "";
          const redirectPatterns = [
            /(?:window\.)?location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/ig,
            /(?:window\.)?location\.replace\(\s*['"]([^'"]+)['"]/ig
          ];

          redirectPatterns.forEach(function (pattern) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
              trustedAddresses.push(match[1]);
            }
          });
        });

        parsed.querySelectorAll("a[href]").forEach(function (link) {
          const label = (link.textContent || "").replace(/\s+/g, " ").trim();
          if (
            /voir (?:votre|le) message|cliquez ici.*message|retourner au sujet/i.test(label)
          ) {
            trustedAddresses.push(link.getAttribute("href") || "");
          }
        });

        for (let index = 0; index < trustedAddresses.length; index += 1) {
          const trustedTopicId = topicIdFromAddress(trustedAddresses[index]);
          if (trustedTopicId) {
            return trustedTopicId;
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

        return getPostingForm("/post?f=" + CONFIG.remoteLog.privateForumId + "&mode=newtopic")
          .then(function (formData) {
            return submitForumPost(formData, subject, makePrivateMessage(entry));
          })
          .then(function (result) {
            if (!result.topicId) {
              return $.Deferred().reject(
                "Le journal a peut-être été créé, mais Forumactif n’a pas renvoyé son identifiant. "
                + "La rotation reste en attente afin d’éviter toute publication dans un autre sujet."
              ).promise();
            }

            state.topicId = result.topicId;
            saveState();
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
        if (hasEarlyShopAccess()) {
          return true;
        }

        if (CONFIG.testMode) {
          return state.simulatedDay >= 26 && state.simulatedDay <= 31;
        }

        const now = Date.now();
        const startsAt = new Date("2026-12-26T00:01:00+01:00").getTime();
        const endsAt = new Date("2026-12-31T23:59:59+01:00").getTime();
        return now >= startsAt && now <= endsAt;
      }

      function allocationWindowIsPast() {
        if (hasEarlyShopAccess()) {
          return false;
        }

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
          "Forum bénéficiaire : " + state.forumUrl,
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
          "Forum bénéficiaire : " + (state.forumUrl || "Non renseigné"),
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

      function fetchPaginatedPages(startUrl, matcher, maximumPages) {
        const pending = [startUrl];
        const visited = {};
        const pages = [];
        const pageLimit = Number(maximumPages) || 50;

        function next() {
          if (!pending.length || pages.length >= pageLimit) {
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
                url: href,
                title: title
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
          const forumUrlMatch = text.match(/Forum bénéficiaire\s*:\s*(https?:\/\/[^\s]+)/i);
          const resultMatch = text.match(/Résultat\s*:\s*([^\n]+)/i);
          const ticketsMatch = text.match(/Tickets remportés\s*:\s*(\d+)/i);
          const bonusMatch = text.match(/Bonus album\s*:\s*(\d+)/i);
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
            forumUrl: forumUrlMatch ? forumUrlMatch[1].trim() : "",
            day: Number(dayMatch[1]),
            rotation: rotationMatch ? Number(rotationMatch[1]) : 0,
            label: resultMatch[1].trim(),
            tickets: Number(ticketsMatch[1]),
            bonusTickets: bonusMatch ? Number(bonusMatch[1]) : 0,
            timestamp: timestampMatch ? timestampMatch[1].trim() : "",
            dateLabel: String(Number(dayMatch[1])).padStart(2, "0") + "/12/2026"
          });
        });
        return rotations;
      }

      function forumUrlsFromJournalPage(html, memberId) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        let $posts = $(documentNode).find(".post");
        if (!$posts.length) {
          $posts = $(documentNode).find(".postbody");
        }
        const forumUrls = [];

        $posts.each(function () {
          const text = pageText($(this));
          const idMatch = text.match(/Identifiant\s*:\s*(\d+)/i);
          if (!idMatch || Number(idMatch[1]) !== Number(memberId)) {
            return;
          }

          const matches = text.match(/Forum bénéficiaire\s*:\s*https?:\/\/[^\s]+/gi) || [];
          matches.forEach(function (match) {
            const forumUrl = match.replace(/^Forum bénéficiaire\s*:\s*/i, "").trim();
            if (forumUrl) {
              forumUrls.push(forumUrl);
            }
          });
        });

        return forumUrls;
      }

      function manualAdjustmentsFromJournalPage(html, memberId) {
        const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
        let $posts = $(documentNode).find(".post");
        if (!$posts.length) {
          $posts = $(documentNode).find(".postbody");
        }
        const adjustments = [];

        $posts.each(function () {
          const text = pageText($(this));
          if (text.indexOf("[NOELACTIF 2026 — AJOUT MANUEL DE TICKETS]") === -1) {
            return;
          }

          const idMatch = text.match(/Identifiant\s*:\s*(\d+)/i);
          const ticketsMatch = text.match(/Tickets ajoutés\s*:\s*(\d+)/i);
          const dateMatch = text.match(/Date de l’ajout\s*:\s*([^\n]+)/i);
          const reasonMatch = text.match(/Motif\s*:\s*([^\n]+)/i);
          const adminMatch = text.match(/Ajout effectué par\s*:\s*([^\n]+)/i);
          if (
            !idMatch
            || Number(idMatch[1]) !== Number(memberId)
            || !ticketsMatch
            || Number(ticketsMatch[1]) < 1
          ) {
            return;
          }

          adjustments.push({
            tickets: Number(ticketsMatch[1]),
            timestamp: dateMatch ? dateMatch[1].trim() : "",
            addedAt: dateMatch ? parseForumDateTime(dateMatch[1]) : null,
            reason: reasonMatch ? reasonMatch[1].trim() : "",
            addedBy: adminMatch
              ? adminMatch[1].replace(/\s+—\s+ID\s+\d+.*$/i, "").trim()
              : "les Lutins"
          });
        });

        return adjustments;
      }

      function memberNameFromJournalTitle(title) {
        const match = String(title || "").match(
          /Journal\s*—\s*(.*?)\s*—\s*ID\s+\d+/i
        );
        return match && match[1].trim() ? match[1].trim() : "Membre";
      }

      function makeManualTicketMessage(memberId, username, tickets, reason) {
        const admin = getMember();
        return [
          "[NOELACTIF 2026 — AJOUT MANUEL DE TICKETS]",
          "",
          "Membre : " + username,
          "Identifiant : " + memberId,
          "Tickets ajoutés : " + tickets,
          "Motif : " + reason,
          "Ajout effectué par : " + admin.username + " — ID " + admin.id,
          "Date de l’ajout : " + new Date().toLocaleString("fr-FR")
        ].join("\n");
      }

      function publishManualTicketAdjustment(memberId, tickets, reason) {
        const forumMatcher = function (url) {
          return new RegExp("^/f" + CONFIG.remoteLog.privateForumId + "(?:p\\d+)?(?:-|$)", "i")
            .test(url.pathname);
        };

        return fetchPaginatedPages(CONFIG.remoteLog.privateForumUrl, forumMatcher)
          .then(function (forumPages) {
            const topics = journalTopicsForMember(forumPages, memberId)
              .sort(function (a, b) {
                return b.id - a.id;
              });
            if (!topics.length) {
              return $.Deferred().reject(
                "Aucun journal Noëlactif trouvé pour l’ID " + memberId
                + ". Aucun ticket n’a été ajouté."
              ).promise();
            }

            const topic = topics[0];
            const username = memberNameFromJournalTitle(topic.title);
            const message = makeManualTicketMessage(
              memberId,
              username,
              tickets,
              reason
            );

            return getPostingForm("/post?t=" + topic.id + "&mode=reply")
              .then(function (formData) {
                return submitForumPost(formData, "", message);
              })
              .then(function () {
                return {
                  memberId: memberId,
                  username: username,
                  tickets: tickets,
                  topicId: topic.id,
                  message: message
                };
              });
          });
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
          return new RegExp("^/f" + CONFIG.remoteLog.privateForumId + "(?:p\\d+)?(?:-|$)", "i")
            .test(url.pathname);
        };

        return $.when(
          fetchPaginatedPages(CONFIG.remoteLog.privateForumUrl, forumMatcher),
          fetchRegistryPages(),
          fetchRotationRegistryPages()
        ).then(function (forumResult, registryResult, rotationResult) {
          const forumPages = forumResult;
          const registryPages = registryResult;
          const rotationPages = rotationResult;
          const topics = journalTopicsForMember(forumPages, memberId);

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
            const uniqueAdjustments = {};
            const recordedForumUrls = [];
            let rotationOrder = 0;
            allJournalPages.forEach(function (html) {
              Array.prototype.push.apply(
                recordedForumUrls,
                forumUrlsFromJournalPage(html, memberId)
              );
              rotationsFromJournalPage(html, memberId).forEach(function (entry) {
                const signature = [
                  entry.day,
                  entry.rotation,
                  entry.label,
                  entry.tickets,
                  entry.bonusTickets || 0,
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
              manualAdjustmentsFromJournalPage(html, memberId).forEach(function (entry) {
                const signature = [
                  entry.tickets,
                  entry.timestamp,
                  entry.reason
                ].join("|");
                if (!uniqueAdjustments[signature]) {
                  uniqueAdjustments[signature] = entry;
                }
              });
            });

            const journalHistory = Object.keys(uniqueRotations).map(function (signature) {
              return uniqueRotations[signature];
            }).sort(function (a, b) {
              return (a.entry.day - b.entry.day) || (a.order - b.order);
            }).map(function (item) {
              return item.entry;
            });

            const centralByDay = {};
            rotationPages.forEach(function (html) {
              rotationEntriesFromPage(html).forEach(function (entry) {
                if (entry.id !== Number(memberId)) {
                  return;
                }
                const current = centralByDay[entry.day];
                if (
                  !current
                  || entry.postId < current.postId
                  || (
                    entry.postId === current.postId
                    && entry.order < current.order
                  )
                ) {
                  centralByDay[entry.day] = entry;
                }
              });
            });

            const centralHistory = Object.keys(centralByDay)
              .map(function (day) {
                const entry = centralByDay[day];
                return {
                  member: entry.username,
                  forumUrl: "",
                  day: entry.day,
                  rotation: 0,
                  label: entry.label,
                  tickets: entry.tickets,
                  bonusTickets: entry.bonusTickets || 0,
                  timestamp: entry.timestamp,
                  dateLabel: String(entry.day).padStart(2, "0") + "/12/2026"
                };
              })
              .sort(function (a, b) {
                return a.day - b.day;
              });

            const history = centralHistory.length
              ? centralHistory
              : journalHistory;
            if (!history.length) {
              return $.Deferred().reject(
                "Aucune rotation exploitable n’a été trouvée pour l’ID "
                + memberId
                + "."
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
              return total + rotationTotalTickets(entry);
            }, 0);
            const manualAdjustments = Object.keys(uniqueAdjustments).map(function (signature) {
              return uniqueAdjustments[signature];
            });
            const manuallyAdded = manualAdjustments.reduce(function (total, entry) {
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
                  ? total + rotationTotalTickets(entry)
                  : total;
              }, 0)
              : null;
            const manualAdditionsAfterLastDeposit = lastDeposit
              ? manualAdjustments.reduce(function (total, entry) {
                return entry.addedAt !== null && entry.addedAt > lastDeposit.depositAt
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
                ? lastDeposit.remainingBalance
                  + gainsAfterLastDeposit
                  + manualAdditionsAfterLastDeposit
                : won + manuallyAdded - deposited
            );
            restoredState.rotation = history.length;
            restoredState.lastSpinDay = lastDay;
            restoredState.topicId = topics.length ? topics[0].id : null;
            restoredState.forumUrl = recordedForumUrls.length
              ? recordedForumUrls[recordedForumUrls.length - 1]
              : history.slice().reverse().reduce(function (forumUrl, entry) {
                return forumUrl || entry.forumUrl || "";
              }, "");
            restoredState.forumUrlDeclaredAt = restoredState.forumUrl
              ? new Date().toISOString()
              : null;
            restoredState.history = history.map(function (entry, index) {
              return $.extend({}, entry, {
                rotation: index + 1,
                balance: history.slice(0, index + 1).reduce(function (total, item) {
                  return total + rotationTotalTickets(item);
                }, 0),
                publicationMode: centralHistory.length
                  ? "registre des rotations restauré"
                  : "journal restauré",
                topicId: topics.length ? topics[0].id : null
              });
            });
            restoredState.manualAdjustments = manualAdjustments;
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
              manuallyAdded: manuallyAdded,
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

          const pending = state.pendingJournal;
          if (pending.kind === "rotation") {
            $("#noelactif-status").text(
              "Enregistrement du résultat dans ton journal…"
            );
          }
          const publication = pending.kind === "rotation"
            ? publishPrivateLog(pending.entry)
            : replyToJournal(null, pending.message);

          publication
            .done(function (result) {
              const message = state.pendingJournal.message;
              const kind = state.pendingJournal.kind;
              state.pendingJournal = null;
              saveState();
              $("#noelactif-private-log").text(
                message
                + (
                  kind === "rotation"
                    ? "\n\nStatut : ROTATION AJOUTÉE AU JOURNAL PRIVÉ"
                    : "\n\nStatut : DÉPÔT AJOUTÉ AU JOURNAL PRIVÉ"
                )
                + (
                  result && result.topicId
                    ? "\nSujet Forumactif : t" + result.topicId
                    : state.topicId
                      ? "\nSujet Forumactif : t" + state.topicId
                      : ""
                )
              );
              render();
            })
            .fail(function (error) {
              const kind = state.pendingJournal.kind;
              state.pendingJournal = null;
              saveState();
              render();
              if (kind === "rotation") {
                $("#noelactif-status").text(
                  "La rotation est bien enregistrée dans le registre central, "
                  + "mais sa copie dans ton journal a échoué : "
                  + String(error)
                );
              } else {
                $("#noelactif-allocation-state").text(
                  "Le dépôt est bien enregistré dans le registre central, mais sa copie dans le journal privé a échoué : "
                  + String(error)
                );
              }
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
        const pendingAllocationJournal = state.pendingJournal
          && state.pendingJournal.kind !== "rotation";

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
          || Boolean(pendingAllocationJournal)
        );

        if (pendingAllocationJournal && cooldownRemaining > 0 && isOpen) {
          $("#noelactif-allocation-state").text(
            "Le dépôt est enregistré dans le registre central. Copie dans ton journal privé dans "
            + cooldownSeconds
            + (cooldownSeconds > 1 ? " secondes." : " seconde.")
          );
        } else if (pendingAllocationJournal && isOpen) {
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
        renderAlbum();

        if (state.forumUrl) {
          $("#noelactif-beneficiary").prop("hidden", false);
          $("#noelactif-beneficiary-link")
            .attr("href", state.forumUrl)
            .text(state.forumUrl);
        } else {
          $("#noelactif-beneficiary").prop("hidden", true);
          openForumModal(false);
        }

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
            .html('<i class="fa fa-envelope" aria-hidden="true"></i> Contacter les Lutins');
          $("#noelactif-recovery-request-status").text("");
        }

        const alreadyPlayed = state.lastSpinDay === state.simulatedDay
          || centrallyBlockedSpinDay === state.simulatedDay;
        const hasPendingSpin = state.pendingSpin && state.pendingSpin.day === state.simulatedDay;
        const eventFinished = state.simulatedDay > 25;

        $("#noelactif-spin")
          .prop(
            "disabled",
            spinning
            || centralSyncInProgress
            || alreadyPlayed
            || eventFinished
            || !state.forumUrl
          )
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
        } else if (centrallyBlockedSpinDay === state.simulatedDay) {
          $("#noelactif-status").text(
            "Une rotation a déjà été enregistrée aujourd’hui pour ton compte, "
            + "peut-être depuis un autre appareil ou un autre navigateur."
          );
        } else if (alreadyPlayed) {
          $("#noelactif-status").text("Reviens demain pour une nouvelle rotation.");
        } else {
          $("#noelactif-status").text("Ta rotation du jour est disponible.");
        }

        const $history = $("#noelactif-history").empty();
        const inventoryItems = [];

        state.history.forEach(function (entry) {
          const rotationAt = parseForumDateTime(entry.timestamp);
          const fallbackAt = Number(entry.day) * 86400000;
          inventoryItems.push({
            type: "rotation",
            dateLabel: historyDateLabel(entry),
            label: entry.label,
            tickets: Number(entry.tickets) || 0,
            sortAt: rotationAt !== null ? rotationAt : fallbackAt
          });

          if (Number(entry.bonusTickets) > 0) {
            inventoryItems.push({
              type: "albumBonus",
              dateLabel: historyDateLabel(entry),
              label: "Bonus : album de Noël complété",
              tickets: Number(entry.bonusTickets),
              sortAt: (rotationAt !== null ? rotationAt : fallbackAt) + 1
            });
          }
        });

        (state.manualAdjustments || []).forEach(function (entry) {
          const addedAt = entry.addedAt !== null && entry.addedAt !== undefined
            ? Number(entry.addedAt)
            : parseForumDateTime(entry.timestamp);
          const dateMatch = String(entry.timestamp || "").match(
            /(\d{1,2}\/\d{1,2}\/\d{4})/
          );
          const dateLabel = dateMatch
            ? dateMatch[1].split("/").map(function (part, index) {
              return index < 2 ? part.padStart(2, "0") : part;
            }).join("/")
            : "Décembre 2026";
          inventoryItems.push({
            type: "manualBonus",
            dateLabel: dateLabel,
            label: "Bonus : Ticket(s) offert(s) par "
              + (entry.addedBy || "les Lutins"),
            tickets: Number(entry.tickets) || 0,
            sortAt: Number.isFinite(addedAt) ? addedAt : 0
          });
        });

        inventoryItems.sort(function (a, b) {
          return b.sortAt - a.sortAt;
        });
        $history.toggleClass("is-scrollable", inventoryItems.length >= 6);

        if (!inventoryItems.length) {
          $history.append("<li>Aucune rotation enregistrée.</li>");
        } else {
          inventoryItems.forEach(function (item) {
            const $line = $("<li>");
            const $amount = $("<time>").text(
              (item.tickets >= 0 ? "+" : "") + item.tickets
            );

            if (item.type === "albumBonus") {
              $line.css({
                color: "#8c5a08",
                borderLeft: "4px solid #d3a12f",
                background: "rgba(211, 161, 47, .12)",
                paddingLeft: "10px"
              });
              $amount.css({ color: "#8c5a08" });
            } else if (item.type === "manualBonus") {
              $line.css({
                color: "#176238",
                borderLeft: "4px solid #2d7a47",
                background: "rgba(45, 122, 71, .1)",
                paddingLeft: "10px"
              });
              $amount.css({ color: "#176238" });
            }

            $line.append(
              $("<span>").text(item.dateLabel + " — " + item.label),
              $amount
            ).appendTo($history);
          });
        }

        renderAllocation();
      }

      function spinWheel() {
        if (
          spinning
          || centralSyncInProgress
          || state.lastSpinDay === state.simulatedDay
          || state.simulatedDay > 25
        ) {
          return;
        }

        if (!state.forumUrl) {
          openForumModal(false);
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

        if (
          remoteLoggingIsAvailable()
          && centrallyCheckedSpinDay !== state.simulatedDay
        ) {
          spinning = true;
          render();
          $("#noelactif-status").text(
            "Vérification de ta participation du jour…"
          );

          canonicalCentralRotationsFor(getMember().id)
            .done(function (entries) {
              centralRewardTickets = collectionTicketsFromEntries(entries);
              if (entries.some(function (entry) {
                return entry.day === Number(state.simulatedDay);
              })) {
                centrallyBlockedSpinDay = state.simulatedDay;
                return;
              }

              centrallyCheckedSpinDay = state.simulatedDay;
              spinning = false;
              spinWheel();
            })
            .fail(function (error) {
              $("#noelactif-status").text(
                "Impossible de vérifier le registre des rotations : "
                + String(error)
                + " La roue reste bloquée par sécurité."
              );
            })
            .always(function () {
              if (centrallyCheckedSpinDay !== state.simulatedDay) {
                spinning = false;
                render();
              }
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
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;
        const desiredRotation = (360 - targetCenter) % 360;
        const adjustment = (
          desiredRotation
          - normalizedRotation
          + 360
        ) % 360;
        currentRotation += extraTurns + adjustment;

        $("#noelactif-wheel").css("transform", "rotate(" + currentRotation + "deg)");
        $("#noelactif-status").text("La roue tourne…");

        window.setTimeout(function () {
          const completesAlbum = completesAlbumWith(result.tickets);
          const bonusTickets = completesAlbum
            ? CONFIG.albumCompletionBonus
            : 0;
          const entry = {
            day: state.simulatedDay,
            rotation: state.rotation + 1,
            label: result.label,
            tickets: result.tickets,
            bonusTickets: bonusTickets,
            balance: state.balance + result.tickets + bonusTickets,
            dateLabel: String(state.simulatedDay).padStart(2, "0") + "/12/2026",
            timestamp: new Date().toLocaleString("fr-FR"),
            completesAlbum: completesAlbum
          };

          $("#noelactif-status").text(
            remoteLoggingIsAvailable()
              ? "Enregistrement de la rotation dans le registre central…"
              : "Simulation de l’envoi privé…"
          );

          publishCentralRotation(entry)
            .done(function (publication) {
              if (!publication.accepted) {
                centrallyCheckedSpinDay = null;
                state.pendingSpin = null;
                saveState();
                $("#noelactif-result").hide();
                $("#noelactif-private-log").text(
                  "ROTATION REFUSÉE\n\n"
                  + "Une autre rotation a été enregistrée avant celle-ci pour ce compte "
                  + "et cette journée. Aucun ticket supplémentaire n’a été crédité."
                );
                $("#noelactif-status").text(
                  "Une autre rotation a été enregistrée avant celle-ci. "
                  + "Cette tentative n’est pas comptabilisée."
                );
                return;
              }

              state.balance = entry.balance;
              state.rotation = entry.rotation;
              state.lastSpinDay = state.simulatedDay;
              state.pendingSpin = null;
              state.history.push({
                ...entry,
                publicationMode: publication.mode,
                topicId: publication.topicId
              });
              state.pendingJournal = remoteLoggingIsAvailable()
                ? {
                  kind: "rotation",
                  entry: entry,
                  message: makePrivateMessage(entry),
                  dueAt: state.lastRegistryPostAt
                    + CONFIG.remoteLog.registryCooldownMs
                }
                : null;
              saveState();

              $("#noelactif-result-text").text(result.label);
              const resultImage = CONFIG.rewardImages[Number(result.tickets)] || "";
              $("#noelactif-result-image")
                .off("error.noelactif")
                .on("error.noelactif", function () {
                  $(this).hide();
                })
                .attr({
                  src: resultImage,
                  alt: result.label
                })
                .toggle(Boolean(resultImage));
              $("#noelactif-result").fadeIn(250);
              $("#noelactif-private-log").text(
                makePrivateMessage(entry)
                + "\n\nStatut : ROTATION ENREGISTRÉE DANS LE REGISTRE CENTRAL"
                + (
                  publication.topicId
                    ? "\nRegistre Forumactif : t" + publication.topicId
                    : ""
                )
                + (
                  state.pendingJournal
                    ? "\nCopie dans le journal privé après le délai Forumactif."
                    : ""
                )
              );
              schedulePendingJournalPublication();
            })
            .fail(function (error) {
              centrallyCheckedSpinDay = null;
              $("#noelactif-private-log").text(
                makePrivateMessage(entry)
                + "\n\nÉCHEC DE LA PUBLICATION\n"
                + String(error)
                + "\n\nLe résultat reste en attente et sera réutilisé au prochain essai. "
                + "Aucun ticket n’a été crédité."
              );
            })
            .always(function () {
              spinning = false;
              render();
            });
        }, 5300);
      }

      $("#noelactif-spin").on("click", spinWheel);

      $("#noelactif-edit-forum").on("click", function () {
        openForumModal(true);
      });

      $("#noelactif-cancel-forum").on("click", closeForumModal);

      $("#noelactif-save-forum").on("click", function () {
        try {
          const forumUrl = normalizeForumUrl($("#noelactif-forum-url").val());
          state.forumUrl = forumUrl;
          state.forumUrlDeclaredAt = new Date().toISOString();
          saveState();
          closeForumModal();
          render();
          $("#noelactif-status").text(
            "L’adresse du forum bénéficiaire est enregistrée. Elle sera ajoutée à ton journal de participation."
          );
        } catch (error) {
          $("#noelactif-forum-error").text(error.message || String(error));
        }
      });

      $("#noelactif-forum-url").on("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          $("#noelactif-save-forum").trigger("click");
        }
      });

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
              "Impossible de lire le registre. Vérifie que ton compte est autorisé et peut consulter le sujet t"
              + CONFIG.remoteLog.registryTopicId
              + "."
            );
          })
          .always(function () {
            $button.prop("disabled", false);
          });
      });

      $("#noelactif-add-manual-tickets").on("click", function () {
        if (!isDebugOwner()) {
          return;
        }

        const memberId = Number($("#noelactif-manual-member-id").val());
        const tickets = Number($("#noelactif-manual-ticket-count").val());
        const reason = String($("#noelactif-manual-ticket-reason").val() || "").trim();
        const $button = $(this);
        const $status = $("#noelactif-manual-ticket-status");

        if (!Number.isInteger(memberId) || memberId < 1) {
          $status.text("Renseigne un identifiant numérique valide.");
          return;
        }
        if (!Number.isInteger(tickets) || tickets < 1) {
          $status.text("Le nombre de tickets doit être un entier strictement positif.");
          return;
        }
        if (!reason) {
          $status.text("Le motif de cet ajout est obligatoire.");
          return;
        }
        if (!window.confirm(
          "Confirmer l’ajout manuel de "
          + tickets
          + " ticket(s) au membre ID "
          + memberId
          + " ?\n\nMotif : "
          + reason
          + "\n\nUne trace réelle sera publiée dans son journal privé."
        )) {
          return;
        }

        $button.prop("disabled", true);
        $status.text("Recherche du journal et publication de l’ajout en cours…");

        publishManualTicketAdjustment(memberId, tickets, reason)
          .done(function (result) {
            $("#noelactif-recovery-member-id").val(memberId);
            $("#noelactif-private-log").text(
              result.message
              + "\n\nStatut : AJOUT MANUEL ENREGISTRÉ"
              + "\nSujet Forumactif : t"
              + result.topicId
            );
            $("#noelactif-manual-member-id").val("");
            $("#noelactif-manual-ticket-count").val("");
            $("#noelactif-manual-ticket-reason").val("");
            $status.text(
              result.tickets
              + " ticket(s) ont été ajoutés à "
              + result.username
              + " dans le journal t"
              + result.topicId
              + ". Tu peux maintenant générer son nouveau code de restauration."
            );
          })
          .fail(function (error) {
            $status.text(String(error));
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
              + result.manuallyAdded
              + " ticket(s) ajoutés manuellement, "
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
              .html('<i class="fa fa-envelope" aria-hidden="true"></i> Contacter les Lutins');
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
          currentRotation = 0;
          $("#noelactif-wheel")
            .css("transition", "none")
            .css("transform", "rotate(0deg)");
          window.setTimeout(function () {
            $("#noelactif-wheel").css(
              "transition",
              "transform 5.2s cubic-bezier(.12,.68,.16,1)"
            );
          }, 30);
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

        if (!state.forumUrl) {
          openForumModal(false);
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
        centrallyCheckedSpinDay = null;
        centrallyBlockedSpinDay = null;
        centralRewardTickets = [];
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
        resolveForumMember().done(function () {
          renderDebugPanel();
          synchronizeParticipationFromCentral()
            .done(function (result) {
              render();
              if (result.updated) {
                $("#noelactif-status").text(
                  "Ta participation a été synchronisée avec le registre des Lutins : "
                  + result.imported
                  + " rotation(s) récupérée(s), "
                  + result.balance
                  + " ticket(s) disponibles."
                );
              }
            })
            .fail(function (error) {
              render();
              $("#noelactif-status").text(
                "La synchronisation automatique est momentanément indisponible : "
                + String(error)
                + " Une vérification sera tout de même effectuée avant la rotation."
              );
            });
        });
      }
    });
