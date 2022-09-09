// Gestion de la neige
$(function() {
    $.getScript("https://illiweb.com/rs3/10/frm/snow.js");
});

// Gestion de la musique
$(function() {
    $('.musique').click(function() {
        if(!$('.footer_musique iframe').length) {
            $('.footer_musique').html('<iframe width="0" height="0" src="https://www.youtube.com/embed/R1gskElaLNo?autoplay=1" frameborder="0" allow="autoplay" allowfullscreen></iframe>');
            $('header.page-header .musique span.volume').html('<i class="fa fa-volume-off"></i>')
        } 
        else if ($('.footer_musique iframe').length) {
            $('.footer_musique iframe').remove();
            $('header.page-header .musique span.volume').html('<i class="fa fa-volume-up"></i>')
        }
    });
});

// Gestion de la connexion du membre
$(function() {   
    $.get('/profile?mode=editprofile', function(d) {
        var url = $('#profile_field_3_-10', d)
        if(!url.length)
        {
            $('div#warning').css("display","block");
            $('div#jeu').css("display","none");
            $('div#button').css("display","none");
            $('div#warning2').css("display","none");
        }
    });
});

// Gestion de la participation du membre
$(function() { 
    $.get('/privmsg?folder=outbox', function(d) {
        var mps = $('.pmlist span em a[href^="/u"]', d).filter(function(mpsnumb){
            return mpsnumb === "Lutins";
        }).closest('dt').wrapInner('<li/>').find('li');
        console.log(mps);
        if(mps >= 1)
        {
            $('div#jeu').css("display","none");
            $('div#button').css("display","none");
            $('div#warning2').css("display","block");
        }    
      });
  });

// Gestion de l'envoi de la participation
$(function() {
    'use strict';
    $(window).on('load', function () {
        $('#generated-form').on('submit', function (event) {
            event.preventDefault();
            $(this).find('input[type="submit"]').text('En cours de publication...');
            setTimeout(function () {
                $.post('/privmsg', {
                    username: 'Lutins',
                    subject: 'Concours Noëlactif 2022',
                    message: '[table class=\"list-in-tutos\"][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data1').val() + '[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data2').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data3').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data4').val() +'[/td][td][/td][td][/td][td]' + $('#data5').val() +'[/td][td][/td][td]' + $('#data6').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data7').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td]' + $('#data8').val() +'[/td][td]' + $('#data9').val() +'[/td][td]' + $('#data10').val() +'[/td][td]' + $('#data11').val() +'[/td][td]' + $('#data12').val() +'[/td][td]' + $('#data13').val() +'[/td][td]' + $('#data14').val() +'[/td][td]' + $('#data15').val() +'[/td][td]' + $('#data16').val() +'[/td][td]' + $('#data17').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data18').val() +'[/td][td]' + $('#data19').val() +'[/td][td]' + $('#data20').val() +'[/td][td]' + $('#data21').val() +'[/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td]' + $('#data22').val() +'[/td][td][/td][td][/td][td]' + $('#data23').val() +'[/td][td][/td][td][/td][td]' + $('#data24').val() +'[/td][td][/td][td]' + $('#data25').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data26').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td]' + $('#data27').val() +'[/td][td][/td][td][/td][td]' + $('#data28').val() +'[/td][td][/td][td][/td][td]' + $('#data29').val() +'[/td][td][/td][td]' + $('#data30').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data31').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td]' + $('#data32').val() +'[/td][td][/td][td]' + $('#data33').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data34').val() +'[/td][td][/td][td]' + $('#data35').val() +'[/td][td]' + $('#data36').val() +'[/td][td][/td][td]' + $('#data37').val() +'[/td][td][/td][td][/td][td][/td][td]' + $('#data38').val() +'[/td][td]' + $('#data39').val() +'[/td][td]' + $('#data40').val() +'[/td][td]' + $('#data41').val() +'[/td][td]' + $('#data42').val() +'[/td][td][/td][/tr][tr][td][/td][td]' + $('#data43').val() +'[/td][td]' + $('#data44').val() +'[/td][td]' + $('#data45').val() +'[/td][td]' + $('#data46').val() +'[/td][td]' + $('#data47').val() +'[/td][td]' + $('#data48').val() +'[/td][td]' + $('#data49').val() +'[/td][td][/td][td]' + $('#data50').val() +'[/td][td][/td][td]' + $('#data51').val() +'[/td][td][/td][td][/td][td]' + $('#data52').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data53').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td]' + $('#data54').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data55').val() +'[/td][td][/td][td][/td][td][/td][td]' + $('#data56').val() +'[/td][td]' + $('#data57').val() +'[/td][td]' + $('#data58').val() +'[/td][td]' + $('#data59').val() +'[/td][td]' + $('#data60').val() +'[/td][td]' + $('#data61').val() +'[/td][td]' + $('#data62').val() +'[/td][td]' + $('#data63').val() +'[/td][td]' + $('#data64').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td]' + $('#data65').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data66').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data67').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data68').val() +'[/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td]' + $('#data69').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data70').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td]' + $('#data71').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data72').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data73').val() +'[/td][td]' + $('#data74').val() +'[/td][td]' + $('#data75').val() +'[/td][td]' + $('#data76').val() +'[/td][td]' + $('#data77').val() +'[/td][td]' + $('#data78').val() +'[/td][td]' + $('#data79').val() +'[/td][td]' + $('#data80').val() +'[/td][td]' + $('#data81').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td]' + $('#data82').val() +'[/td][td]' + $('#data83').val() +'[/td][td]' + $('#data84').val() +'[/td][td]' + $('#data85').val() +'[/td][td]' + $('#data86').val() +'[/td][td]' + $('#data87').val() +'[/td][td]' + $('#data88').val() +'[/td][td]' + $('#data89').val() +'[/td][td]' + $('#data90').val() +'[/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr][/table]',
                    mode: 'post',
                    post: 1,
                    folder: 'inbox',
                    usergroup: 1,
                }).done(function () {
                    alert('Le message privé a été envoyé avec succès aux Lutins ! Vous allez être redirigé sur la page du concours !');
                    location.pathname = '/h13-';
                }).fail(function () {
                    alert('Une erreur est survenue ! Réessayez plus tard ou contacter Bipo !');
                });
            }, 600);
        });
    });
});