/*
 *! Form Generator v2.0 Code.
 *
 * Developed by Luiz Felipe Gonçalves <https://luizfelipe.dev>
 * Translated by the French Staff <https://forum.forumactif.com>
 *
 * All Forumotion Support Forums may use this code.
 * DO NOT REDISTRIBUTE OR EDIT WITHOUT THE AUTHOR'S CONSENT.
 *
 * Do not modify the origin of any script or style sheet without contacting
 * the generator's author (Luiz Felipe Gonçalves - https://luizfelipe.dev/).
 *
 * Copyright (c) Luiz Felipe Gonçalves. 2017-current.
 */

/*globals jQuery, Clipboard*/

(function ($) {
	'use strict';
	
	/**
* Variables globales du script :
*/
	var $addField, $editField;
	var number=0;

	$(function () {

			/**
 *! DEBUT DE LA PARTIE 1 !
 */
			var $zone =$('.entry-prev');
			var $table =$('.presets-table table');

			/**
 * Création du modal et de l'overlay (pour générer un nouveau champ) :
 * @role Création du HTML.
 */
			function addField () {
				/**
   * HTML du modal et création d'un nouveau champ :
   */
				$addField =$([ '<div class="modal-wrap">',
					'  <div class="modal add-field">',
					'    <h3>Choisissez le type du nouveau champ.</h3>',
					'    <p class="part-obs">Choisissez le type du nouveau champ que vous souhaitez créer.</p>',
					'    <form class="field-types" id="radio-select-input-type">',
					'      <div class="modal-padding">',
					'        <div class="radio-group">',
					'          <input type="radio" id="text-input" value="text" name="in-type" required />',
					'          <label for="text-input">Champ texte</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="textarea-input" value="textarea" name="in-type" required />',
					'          <label for="textarea-input">Zone de texte</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="date-input" value="date" name="in-type" required />',
					'          <label for="date-input">Date</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="color-input" value="color" name="in-type" required />',
					'          <label for="color-input">Couleur</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="number-input" value="number" name="in-type" required />',
					'          <label for="number-input">Nombre</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="select-u-input" value="selectU" name="in-type" required />',
					'          <label for="select-u-input">Choix unique</label>',
					'        </div> ',
					'        <div class="radio-group">',
					'          <input type="radio" id="select-m-input" value="selectM" name="in-type" required />',
					'          <label for="select-m-input">Choix multiple</label>',
					'        </div>',
					'        <hr class="pa-1-hr" />',
					'        <div class="radio-group">',
					'          <input type="radio" id="add-subtitle" value="subtitle" name="in-type" required />',
					'          <label for="add-subtitle">Titre de la section</label>',
					'        </div>',
					'        <div class="radio-group">',
					'          <input type="radio" id="add-paragraph" value="exp-paragraph" name="in-type" required />',
					'          <label for="add-paragraph">Paragraphe explicatif</label>',
					'        </div>',
					'      </div>',
					'',
					'      <footer class="form-footer">',
					'        <button type="submit" id="radio-to-continue">Continuer</button>',
					'        <a href="javascript:void(0)" class="close-modal">Fermer</a>',
					'      </footer>',
					'    </form>',
					'  </div>',
					'  <div class="modal-overlay"></div>',
					'</div>',
					].join('\n')) .appendTo('body');

				/**
   * Trigger pour fermer le modal lors du clic sur l'overlay ou du lien "fermer" :
   * @role Trigger.
   */
				$addField .find('.modal-overlay, .close-modal') .on('click', closeModal);

				/**
   * Création du choix du type de champ :
   * @role Trigger
   */
				$addField .find('#radio-select-input-type') .on('submit', function (event) {
						event.preventDefault();

						var inputType=$('[name="in-type"]:checked').val();
						generate(inputType);
					});
			}

			/**
 * Fonction pour éditer un champ,
 * a la fois sa position et ses attributs.
 */
			function editField () {
				var $this =$('#edit-field');

				if ($zone.find('.fa-form-group').length===0 && $this.find('i').is('.fa-pencil')) {
					alert('Vous devez créer au moins un champ avant de pouvoir éditer.');
					return;
				}

				if ($this.find('i').is('.fa-check')) {
					$this .find('i.fa') .removeClass('fa-check') .addClass('fa-pencil') .attr('title', 'Modifier un champ créé.');

					$this .parents('.edit-section') .find('i.fa-plus, i.fa-minus') .show();

					$zone .find('.input-edit-trigger') .remove();

					$zone .find('.input-edit-trigger') .remove();

					$zone .find('.fa-move-trigger') .remove();

					return false;
				}

				$this .find('i.fa') .removeClass('fa-pencil') .addClass('fa-check') .attr('title', 'Sauvegarder les modifications.');

				$this .parents('.edit-section') .find('i.fa-plus, i.fa-minus') .hide();

				$zone .find('.fa-form-group') .append('<i class="fa fa-pencil-square input-edit-trigger"></i>');

				/**
   * Trigger pour ouvrir le modal d'édition :
   * @role Trigger
   */
				$zone .find('.input-edit-trigger') .on('click', function () {

						var $this =$(this);
						var $parent =$this.parents('.fa-form-group');

						var inType=$parent.find('input').attr('type');

						if ( !inType) {
							inType=$parent.find('textarea, select, .data-text').prop('tagName').toLowerCase();
						}

						console.log('Tipo: ' + inType);

						var label=$parent.find('label').text();
						var placeholder=$parent.find('input, textarea, select').attr('placeholder');
						var required=$parent.find('input, textarea, select').prop('required');
						var requiredCheckbox;

						if (required) {
							requiredCheckbox='<input type="checkbox" id="is-required-modal" checked />';
						}

						else {
							requiredCheckbox='<input type="checkbox" id="is-required-modal" />';
						}

						$editField =$([ '<div class="modal-wrap">',
							'  <div class="modal edit-field">',
							'    <h3>Edition d\'un champ...</h3>',
							'    <p class="part-obs">Editer les attributs du champ sélectionné ci-dessous :</p>',
							'    <form id="atributes-edition">',
							'      <div class="modal-padding">',
							'        <div class="form-group">',
							'          <label for="edit-input-label">Label :</label>',
							'          <input id="edit-input-label" value="' + label + '" required />',
							'        </div>',
							'        <div class="form-group placeholder-edit">',
							'          <label for="edit-input-placeholder">Placeholder :</label>',
							'          <input id="edit-input-placeholder" value="' + placeholder + '" />',
							'        </div>',
							'        <div class="form-group required-check">',
							'          <label for="is-required-modal">Requis ?</label>',
							'          ' + requiredCheckbox,
							'          <label for="is-required-modal" class="pseudo-checkbox-edition"></label>',
							'        </div>',
							'      </div>',
							'      <footer class="form-footer">',
							'        <button type="submit" id="edit-finish">Sauvegarder</button>',
							'        <a href="javascript:void(0)" class="close-modal">Fermer</a>',
							'      </footer>',
							'    </form>',
							'  </div>',
							'  <div class="modal-overlay"></div>',
							'</div>',
							].join('\n')) .appendTo('body');

						if (inType==='date' || inType==='color' || inType==='select') {
							$('.placeholder-edit').remove();
						}

						if (inType==='color') {
							$('.required-check').remove();
						}

						if (inType==='number') {

							var maxLgt=$parent.find('input[type="number"]').attr('max');
							var minLgt=$parent.find('input[type="number"]').attr('min');

							$editField =$([ '<div class="modal-wrap">',
								'  <div class="modal edit-field">',
								'    <h3>Edition d\'un champ...</h3>',
								'    <p class="part-obs">Editer les attributs du champ sélectionné ci-dessous :</p>',
								'    <form id="atributes-edition">',
								'      <div class="modal-padding">',
								'        <div class="form-group">',
								'          <label for="edit-input-label">Label :</label>',
								'          <input id="edit-input-label" value="' + label + '" required />',
								'        </div>',
								'        <div class="form-group placeholder-edit">',
								'          <label for="edit-input-placeholder">Placeholder :</label>',
								'          <input id="edit-input-placeholder" value="' + placeholder + '" />',
								'        </div>',
								'        <div class="form-group">',
								'          <label for="edit-input-max">Valeur maximale :</label>',
								'          <input type="text" id="edit-input-max" value="' + maxLgt + '" />',
								'        </div>',
								'        <div class="form-group">',
								'          <label for="edit-input-min">Valeur minimale :</label>',
								'          <input type="text" id="edit-input-min" value="' + minLgt + '" />',
								'        </div>',
								'        <div class="form-group required-check">',
								'          <label for="is-required-modal">Requis ?</label>',
								'          ' + requiredCheckbox,
								'          <label for="is-required-modal" class="pseudo-checkbox-edition"></label>',
								'        </div>',
								'      </div>',
								'      <footer class="form-footer">',
								'        <button type="submit" id="edit-finish">Sauvegarder</button>',
								'        <a href="javascript:void(0)" class="close-modal">Fermer</a>',
								'      </footer>',
								'    </form>',
								'  </div>',
								'  <div class="modal-overlay"></div>',
								'</div>',
								].join('\n')) .appendTo('body');
						}

						if (inType==='p' || inType==='h4') {

							if ($('.modal-wrap').length > 0) {
								$('.modal-wrap').remove();
							}

							var expText=$parent.find('.data-text').text();

							$editField =$([ '<div class="modal-wrap">',
								'  <div class="modal edit-field">',
								'    <h3>Edition d\'un champ...</h3>',
								'    <p class="part-obs">Compléter les champs ci-dessous :</p>',
								'    <form id="atributes-edition">',
								'      <div class="modal-padding">',
								'        <div class="form-group">',
								'          <label for="edit-field-text">Texte :</label>',
								'          <input id="edit-field-text" value="' + expText + '" required />',
								'        </div>',
								'      </div>',
								'      <footer class="form-footer">',
								'        <button type="submit" id="edit-finish">Sauvegarder</button>',
								'        <a href="javascript:void(0)" class="close-modal">Fermer</a>',
								'      </footer>',
								'    </form>',
								'  </div>',
								'  <div class="modal-overlay"></div>',
								'</div>',
								].join('\n')) .appendTo('body');

							$editField .find('#atributes-edition') .on('submit', function (event) {
									event.preventDefault();

									var $form =$(this);
									var editedText=$form.find('#edit-field-text').val();

									$parent.find('.data-text').text(editedText);

									closeModal();
								});

							$editField .find('.modal-overlay, .close-modal') .on('click', closeModal);

							return;
						}

						if (inType==='select') {
							$editField =$([ '<div class="modal-wrap">',
								'  <div class="modal edit-field">',
								'    <h3>Edition d\'un champ...</h3>',
								'    <p class="part-obs">Editer les attributs du champ sélectionné ci-dessous :</p>',
								'    <form id="atributes-edition">',
								'      <div class="modal-padding">',
								'        <div class="form-group">',
								'          <label for="edit-input-label">Label :</label>',
								'          <input id="edit-input-label" value="' + label + '" required />',
								'        </div>',
								'        <div class="form-group">',
								'          <label for="edit-vals-select">Valeurs :</label>',
								'          <textarea id="edit-vals-select" class="fa-valores" required></textarea>',
								'        </div>',
								'        <div class="form-group required-check">',
								'          <label for="is-required-modal">Requis ?</label>',
								'          ' + requiredCheckbox,
								'          <label for="is-required-modal" class="pseudo-checkbox-edition"></label>',
								'        </div>',
								'      </div>',
								'      <footer class="form-footer">',
								'        <button type="submit" id="edit-finish">Sauvegarder</button>',
								'        <a href="javascript:void(0)" class="close-modal">Fermer</a>',
								'      </footer>',
								'    </form>',
								'  </div>',
								'  <div class="modal-overlay"></div>',
								'</div>',
								].join('\n')) .appendTo('body');

							var $opt =$parent.find('select option');

							$opt.each(function () {

									var $this =$(this);
									var optText=$this.text();

									if ($this.is(':last-child')) {
										$('#edit-vals-select').text($('#edit-vals-select').text() + optText);
										return;
									}

									$('#edit-vals-select').text($('#edit-vals-select').text() + optText + '\n');
								});
						}

						$editField .find('#atributes-edition') .on('submit', function (event) {
								event.preventDefault();

								var $form =$(this);
								var editedLabel=$form.find('#edit-input-label').val();
								var editedPlaceholder=$form.find('#edit-input-placeholder').val();
								var editedRequiredStatus=$form.find('#is-required-modal').prop('checked');

								$parent.find('label').text(editedLabel);
								$parent.find('input, textarea').attr('placeholder', editedPlaceholder);

								if (inType==='number') {
									var editedMax=$form.find('#edit-input-max').val();
									var editedMin=$form.find('#edited-input-min').val();

									$parent.find('input').attr('max', editedMax);
									$parent.find('input').attr('min', editedMin);
								}

								if (inType==='select') {

									$parent .find('select option') .remove();

									var editedVals=$editField.find('#edit-vals-select').val().split('\n');

									$.each(editedVals, function (index, text) {

											var reg=/\S/gi;

											if ( !reg.test(text)) {
												return;
											}

											$parent .find('select') .append('<option value="' + text + '">' + text + '</option>\n');
										});
								}

								if (editedRequiredStatus) {
									$parent.find('input, textarea, select').attr('required', 'required');
								}

								else {
									$parent.find('input, textarea, select').removeAttr('required');
								}

								closeModal();
							});

						/**
		 * Trigger pour fermer le modal après un clic sur l'overlay ou sur le lien "fermer" :
		 * @role Trigger.
		 */
						$editField .find('.modal-overlay, .close-modal') .on('click', closeModal);

					});

				/**
   * Création du bouton d'édition
   * pour monter ou descendre un groupe d'input.
   */
				var $group =$zone.find('.fa-form-group');

				$group.each(function () {
						var $this =$(this);

						$this.append([ '<i class="fa fa-angle-up fa-move-trigger fa-move-to-top"></i>',
							'<i class="fa fa-angle-down fa-move-trigger fa-move-to-bottom"></i>',
							].join('\n'));
					});

				/**
   * Trigger des boutons pour monter ou descendre un groupe d'input.
   */
				$zone .find('.fa-move-to-top') .on('click', function () {

						var $this =$(this);
						var $group =$this.parents('.fa-form-group');

						$group .insertBefore($this.parents('.fa-form-group').prev());

					});

				$zone .find('.fa-move-to-bottom') .on('click', function () {

						var $this =$(this);
						var $group =$this.parents('.fa-form-group');

						$group .insertAfter($this.parents('.fa-form-group').next());

					});

				$zone .find('.fa-move-trigger, .input-edit-trigger') .on({
					mouseenter: function () {
						$(this) .closest('.fa-form-group') .attr('style', [ '-webkit-box-shadow: inset 0 0 30px -9px rgb(0, 0, 0);',
							'-moz-box-shadow: inset 0 0 30px -9px rgb(0, 0, 0);',
							'-ms-box-shadow: inset 0 0 30px -9px rgb(0, 0, 0);',
							'-o-box-shadow: inset 0 0 30px -9px rgb(0, 0, 0);',
							'box-shadow: inset 0 0 30px -9px rgb(0, 0, 0);',
							].join(' '));
					}

					,

					mouseleave: function () {
						$(this) .closest('.fa-form-group') .removeAttr('style');
					}

					,

					click: function () {
						setTimeout(function () {
								$(this) .closest('.fa-form-group') .removeAttr('style');
							}

							, 800);
					}
				});

		}

		/**
 * Fonction pour supprimer un groupe d'input.
 */
		function removeField () {
			var $this =$('#remove-field');

			if ($zone.find('.fa-form-group').length===0 && $this.find('i').is('.fa-minus')) {
				alert('Vous devez créer au moins un champ avant de le supprimer !');
				return;
			}

			if ($this.find('i').is('.fa-check')) {
				$this .find('i.fa') .removeClass('fa-check') .addClass('fa-minus') .attr('title', 'Cliquez ici pour supprimer un champ.');

				$this .parents('.edit-section') .find('i.fa-plus, i.fa-pencil') .show();

				$zone .find('.input-remove-trigger') .remove();

				return false;
			}

			$this .find('i.fa') .removeClass('fa-minus') .addClass('fa-check') .attr('title', 'Sauvegarder les modifications.');

			$this .parents('.edit-section') .find('i.fa-plus, i.fa-pencil') .hide();

			$zone .find('.fa-form-group') .append('<i class="fa fa-minus-circle input-remove-trigger"></i>');

			$zone .find('.input-remove-trigger') .on('click', function () {
					$(this) .parents('.fa-form-group') .remove();

					console.info('[Generateur] Le champ a été supprimé avec succès !');
				});

		}

		/**
 * Trigger pour créer, éditer et supprimer un champ.
 * @role Trigger.
 */
		$('#add-field').on('click', addField);
		$('#edit-field').on('click', editField);
		$('#remove-field').on('click', removeField);

		var generate=function (type) {

			console.info('[Generator] The selected mode was: ' + type);

			// ID generator:
			number++;
			console.info('[Generator] This new input\'s ID is: ' + number);
			$('body').attr('data-number', number);

			$addField .find('#radio-select-input-type') .remove();

			$addField .find('h3') .text('Paramétrage du champ');

			/**
   * Criação d'un input type texte :
   */
			if (type==='text') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi un champ texte, c\'est-à-dire qui peut contenir tout type de texte.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-placeholder">Placeholder :</label>',
					'      <input type="text" id="input-placeholder" value="" />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Input type texte :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputPlaceholder=$this.find('#input-placeholder').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <input type="text" data-type="text" id="' + inputId + '" placeholder="' + inputPlaceholder + '" ' + inputRequired + ' />',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Input of text generated successfully!');

						closeModal();

					});
			}

			/**
   * Textarea :
   */
			if (type==='textarea') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi une zone de texte, c\'est-à-dire qui peut contenir tout type de texte.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID de la zone (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-placeholder">Placeholder :</label>',
					'      <input type="text" id="input-placeholder" value="" />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création de l'input créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputPlaceholder=$this.find('#input-placeholder').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <textarea data-type="textarea" id="' + inputId + '" placeholder="' + inputPlaceholder + '" ' + inputRequired + '></textarea>',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Textarea generated successfully!');

						closeModal();

					});
			}

			/**
   * Input de type date :
   */
			if (type==='date') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi une date, c\'est-à-dire qui peut contenir seulement une date.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création de l'input créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <input type="date" data-type="date" id="' + inputId + '" ' + inputRequired + ' />',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Input of date generated successfully!');

						closeModal();

					});
			}

			/**
   * Input de type couleur :
   */
			if (type==='color') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi un champ de couleur, c\'est-à-dire qui peut contenir qu\'une couleur</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création de l'input créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <input type="color" data-type="color" id="' + inputId + '" />',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Input of color generated successfully!');

						closeModal();

					});
			}

			/**
   * Création d'un input pour renseigner un nombre :
   */
			if (type==='number') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi un champ nombre, c\'est-à-dire qui peut contenir que des nombres.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-placeholder">Placeholder :</label>',
					'      <input type="text" id="input-placeholder" value="" />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-max">Valeur maximale :</label>',
					'      <input type="text" id="input-max" value="20" />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-min">Valeur minimale</label>',
					'      <input type="text" id="input-min" value="1" />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création du champ créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputPlaceholder=$this.find('#input-placeholder').val();
						var inputMax=$this.find('#input-max').val();
						var inputMin=$this.find('#input-min').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <input type="number" data-type="number" id="' + inputId + '" placeholder="' + inputPlaceholder + '" max="' + inputMax + '" min="' + inputMin + '" ' + inputRequired + ' />',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Input of number generated successfully!');

						closeModal();

					});
			}

			/**
   * Création de l'input d'un choix unique :
   */
			if (type==='selectU') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi un champ "choix unique", c\'est-à-dire qu\'un seul choix pourra être sélectionné parmi une liste prédéfinie.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-vals">Liste de choix (séparer un choix par un retour à la ligne) :</label>',
					'      <textarea id="input-vals" class="fa-valores" required></textarea>',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création du champ créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputVals=$this.find('#input-vals').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <select data-type="select" id="' + inputId + '" ' + inputRequired + ' /></select>',
							'</div>',
							'',
							].join('\n'));

						var valsOfSelect=inputVals.split('\n');

						$.each(valsOfSelect, function (index, text) {

								var reg=/\S/gi;

								if ( !reg.test(text)) {
									return;
								}

								if ($zone.find('select#' + inputId).find('option').length===0) {
									$zone .find('select#' + inputId) .append('\n<!-- First -->\n<option value="' + text + '">' + text + '</option>\n');
									return;
								}

								$zone .find('select#' + inputId) .append('<option value="' + text + '">' + text + '</option>\n');
							});

						console.info('[Generator] Select (single) input generated successfully!');

						closeModal();

					});
			}

			/**
   * Création de l'input choix multiple :
   */
			if (type==='selectM') {
				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi un champ "choix multiple", c\'est-à-dire que plusieurs choix pourront être sélectionnés parmi une liste prédéfinie.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="input-id">ID du champ (automatique) :</label>',
					'      <input type="text" id="input-id" value="fields' + number + '" readonly />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-label">Label :</label>',
					'      <input type="text" id="input-label" value="" required />',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-vals">Liste de choix (séparer un choix par un retour à la ligne) :</label>',
					'      <textarea id="input-vals" required></textarea>',
					'    </div>',
					'    <div class="form-group">',
					'      <label for="input-required">Requis ?</label>',
					'      <input type="checkbox" id="input-required" value="required" checked />',
					'      <label for="input-required" class="pseudo-checkbox"></label>',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Genérer le champ</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * ICréation du champ créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var inputId=$this.find('#input-id').val();
						var inputLabel=$this.find('#input-label').val();
						var inputVals=$this.find('#input-vals').val();
						var inputRequired='';

						if ($('#input-required').is(':checked')) {
							inputRequired='required';
						}

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <label for="' + inputId + '">' + inputLabel + '</label>',
							'  <select multiple data-type="select" id="' + inputId + '" ' + inputRequired + ' /></select>',
							'</div>',
							'',
							].join('\n'));

						var valsOfSelect=inputVals.split('\n');

						$.each(valsOfSelect, function (index, text) {

								var reg=/\S/gi;

								if ( !reg.test(text)) {
									return;
								}

								if ($zone.find('select#' + inputId).find('option').length===0) {
									$zone .find('select#' + inputId) .append('\n<!-- First -->\n<option value="' + text + '">' + text + '</option>\n');
									return;
								}

								$zone .find('select#' + inputId) .append('<option value="' + text + '">' + text + '</option>\n');
							});

						console.info('[Generator] Select (multiple) input generated successfully!');

						closeModal();

					});
			}

			/**
   * Création d'un titre de section
   */
			if (type==='subtitle') {

				$addField .find('h3') .text('Créer un titre de section');

				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi de créer un titre de section.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="subtitle-text">Nom du titre :</label>',
					'      <input type="text" id="subtitle-text" required />',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le titre</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création du champ créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var subText=$this.find('#subtitle-text').val();

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <h4 class="form-subtitle data-text">' + subText +'</h4>',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Subtitle generated successfully!');

						closeModal();

					});
			}

			/**
   * Création d'un paragraphe explicatif :
   */
			if (type==='exp-paragraph') {

				$addField .find('h3') .text('Créer un paragraphe explicatif');

				$addField .find('.modal') .append([ '<p class="part-obs">Vous avez choisi de créer un paragraphe explicatif.</p>',
					'<p class="part-obs">Renseignez les champs ci-dessous :</p>',
					'<form class="configure-input">',
					'  <div class="modal-padding">',
					'    <div class="form-group">',
					'      <label for="par-text">Texte du paragraphe :</label>',
					'      <textarea id="par-text" class="valpar-text" required />',
					'    </div>',
					'  </div>',
					'  <footer class="form-footer">',
					'    <button type="submit" class="button-create-new">Générer le paragraphe</button>',
					'    <a href="javascript:void(0)" class="reset-create-field">Retour</a>',
					'  </footer>',
					'</form>',
					].join('\n'));

				/**
	 * Création du champ créé :
	 */
				$addField .find('.configure-input') .on('submit', function (event) {
						event.preventDefault();

						var $this =$(this);
						var parText=$this.find('#par-text').val();

						$zone.append([ '<div class="fa-form-group clearfix">',
							'  <p class="form-paragraph data-text">' + parText +'</p>',
							'</div>',
							'',
							].join('\n'));

						console.info('[Generator] Exp.-paragraph generated successfully!');

						closeModal();

					});
			}

			/**
   * Trigger du bouton pour revenir à la section des inputs :
   * @role Trigger.
   */
			$addField .find('.reset-create-field') .on('click', function () {

					$addField.remove();
					addField();

					$addField .find('input[value="' + type + '"]') .prop('checked', true);

				});
		}

		;

		/**
 * Fonction pour supprimer tout modal ouvert sur une page. Il suffit d'appeler la fonction suivante :
 * closeModal();
 */
		function closeModal () {
			var $modal =$('.modal-wrap');
			$modal.remove();
		}

		/**
 * Fonction pour identifier si l'éditeur est activé :
 */
		$('#edit-field, #remove-field').on('click', function () {

				if ($('body').is('.is-editing')) {
					$('body').removeClass('is-editing');
					return;
				}

				if ($('.entry-prev').find('.fa-form-group').length > 0) {
					$('body').addClass('is-editing');
				}
			});

		/**
 *! FIN PARTE 1 !
 */

		/**
  *! DEBUT PARTE 2 !
  *
  */

		/**
 * Manu de navigation :
 */
		$('#step-1').on('click', function () {
				$('.global-part-2, .global-part-3').slideUp();
				$('.global-part-1').slideDown();
			});

		$('#step-1, #step-2, .back-part-btn').on('click', function () {
				$('#step-3').addClass('inactive');
				$('.global-part-3').slideUp();
			});

		/**
 * Boutons retour / suivant :
 */
		$('.global-part-2 .back-part-btn').on('click', function () {
				$('.global-part-2, .global-part-3').slideUp();
				$('.global-part-1').slideDown();
			});

		$('.global-part-3 .back-part-btn').on('click', function () {
				$('.global-part-3, .global-part-1').slideUp();
				$('.global-part-2').slideDown();
			});

		/**
 * Actionner / retirer not-allowed,
 * dans le menu ou sur le bouton (ci nécessaire):
 */
		$('#create-text-btn, #step-2').on({
			mouseenter: function () {
				if ($('.entry-prev').find('.fa-form-group').length===0 || $('body').is('.is-editing')) {
					$(this).css('cursor', 'not-allowed');
					return;
				}

				$(this).css('cursor', 'pointer');
			}

			,

			mouseleave: function () {
				$(this).css('cursor', 'pointer');
			}
		});

	/**
 * Bouon PARTIE 1 menant à PARTIE 2 :
 */
	$('#create-text-btn, #step-2, #back-to-2').on('click', function () {
			if ($('.entry-prev').find('.fa-form-group input, .fa-form-group select, .fa-form-group textarea').length===0) {
				alert('Vous devez créer au moins un champ !');
				return;
			}

			if ($('body').is('.is-editing')) {
				alert('Finalisez votre action avant ! (Cliquez sur le bouton d\'édition dans la barre latérale (sidebar))');
				return;
			}

			$('#step-2').removeClass('inactive');
			$('.global-part-1').slideUp();
			$('.global-part-2').slideDown();

			generateTable();
		});

	/**
 * Fénérer la table des {{fields}}:
 */
	function generateTable () {

		$table .find('tbody *') .remove();

		var $target =$zone.find('input, select, textarea');

		$target.each(function () {

				var $this =$(this);
				var eachLabel=$this.prev('label').text();
				var eachField='{{' + $this.attr('id') + '}}';

				$table .find('tbody') .append([ '<tr>',
					'  <td>' + eachLabel + '</td>',
					'  <td>' + eachField + '</td>',
					'</tr>',
					].join('\n'));

			});

		/**
   * Arrangement de l'affichage PARTIE 2.
   */
		var presetesTableHeight=$('.presets-table').height() - 1;
		$('.config-form').css('min-height', presetesTableHeight + 'px');
	}

	/**
 * Savoir quelle sera la destination du formulaire et s'il est en cours de génération :
 */
	var $formFunction =$('#form-function');

	$formFunction.on('change', function () {

			var $this =$(this);
			var func=$this.val();

			$('.config-part').not('[data-toggle="' + func + '"]').slideUp();
			$('.config-part[data-toggle="' + func + '"]').slideDown();

			$('.next-part-fake').remove();

		});

	$('.config-part').on('submit', function (event) {
			event.preventDefault();

			$('.global-part-1, .global-part-2').hide();
			$('.global-part-3').show();
			$('#step-3').removeClass('inactive');

			$('html, body').stop().animate({
				scrollTop: 0
			}

			, 'fast');

		var $this =$(this);
		var $button =$this.find('button.generate-code');
		var typeOfCode=$button.attr('data-code');

		console.log('[Generator] Generating code! Type: ' + typeOfCode);
		generateCode(typeOfCode);
	});

/**
 * PARTIE 3:
 * Fonction pour générer le code :
 * Copier / coller 
 */

var $install =$('.install-wrapper');

var generateCode=function (codeType) {

	$.getScript('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');

	if (codeType==='topiccode') {
		$install.find('h2.part-title span.html-form-type').text('Nouveau sujet');

		var POSTformTitle=$('.part-fa-newtopic #fa-form-title').val();
		var POSTtopicTitle=$('.part-fa-newtopic #fa-newtopic-title').val();
		var POSTforumValue=$('.part-fa-newtopic #fa-newtopic-number').val();
		var POSTtopicMessage=$('.part-fa-newtopic #fa-newtopic-message').val().trim();

		registerForm('NEW_TOPIC', POSTformTitle);

		var POSTgeneratedCode=[ '<!DOCTYPE html>',
		'<html>',
		'<!-- ->',
		'/**',
		' * Ce formulaire a été généré via <forum.forumactif.com>.',
		' * Generateur développé par Luiz Felipe G. <https://luizfelipe.dev>',
		' * Traduit par l\'équipe du support français de Forumactif',
		' *',
		' * En cas de problème, n\'hésitez pas à ouvrir un sujet dans l\'entraide !',
		' */',
		'<!- -->',
		'<head>',
		'  <meta charset="UTF-8" />',
		'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
		'  <meta http-equiv="X-UA-Compatible" content="ie=edge" />',
		'  <title>' + POSTformTitle + '</title>',
		'',
		'  <link rel="stylesheet" href="https://bipofa.github.io/Forumactif/form-styles.css" />',
		'</head>',
		'<body>',
		'',
		'  <form id="fa-generated-form">',
		'    <div class="fa-form-wrapper">',
		'      <h1>' + POSTformTitle + '</h1>',
		'      <!-- BEGIN Generated HTML Code -->',
		'      ' + $('.entry-prev').html().trim(),
		'      <!-- END Generated HTML Code -->',
		'    </div>',
		'    <div class="fa-submit">',
		'      <button class="post-button" type="submit">Publier !</button>',
		'    </div>',
		'  </form>',
		'',
		'',
		'',
		'  <!-- Javascript\'s -->',
		'  <!-- Il n\'est pas recommandé d\'éditer le code qui se trouve en-dessous de cette ligne si vous n\'avez pas les compétences nécessaires. -->',
		'',
		'  <textarea style="display: none;" id="fa-generated-message">' + POSTtopicMessage + '</textarea>',
		'  <input type="hidden" id="fa-generated-title" value="' + POSTtopicTitle + '" />',
		'',
		'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" type="text/javascript"></script>',
		'  <script src="https://bipofa.github.io/Forumactif/form-fields-generator.js" type="text/javascript"></script>',
		'  <script type="text/javascript">',
		'    (function ($) {',
		'    	\'use strict\';',
		'',
		'    	$(window).on(\'load\', function () {',
		'    		$(\'#fa-generated-form\').on(\'submit\', function (event) {',
		'         event.preventDefault();',
		'         $(this).find(\'button[type="submit"]\').text(\'En cours de publication...\');',
		'         setTimeout(function () {',
		'    			  $.post(\'/post\', {',
		'    			  	subject: $(\'#fa-generated-title\').val().trim(),',
		'    				  f: ' + POSTforumValue + ',',
		'    			  	message: $(\'#fa-generated-message\').val().trim(),',
		'    			  	mode: \'newtopic\',',
		'    			  	tid: $(\'[name="tid"]:first\').val(),',
		'    			  	post: 1,',
		'    		  	}).done(function () {',
		'    			  	alert(\'Le sujet a été posté avec succès ! Vous allez être redirigé sur le nouveau sujet créé !\');',
		'    			  	location.pathname = \'/f' + POSTforumValue + '-\';',
		'    			  }).fail(function () {',
		'    			  	alert(\'Une erreur est survenue ! Réessayez plus tard ! \');',
		'    			  });',
		'         }, 600);',
		'    		});',
		'    	});',
		'    }(jQuery));',
		'  </script>',
		'</body>',
		'</html>',
		].join('\n');

		$('#generated-code-zone pre').text(POSTgeneratedCode);
	}

	// fin

	if (codeType==='postcode') {
		$install.find('h2.part-title span.html-form-type').text('Répondre au sujet');

		var REPLYformTitle=$('.part-fa-newpost #fa-form-title').val();
		var REPLYtopicValue=$('.part-fa-newpost #fa-newpost-number').val();
		var REPLYtopicMessage=$('.part-fa-newpost #fa-newpost-message').val().trim();

		registerForm('REPLY', REPLYformTitle);


		var REPLYgeneratedCode=[ '<!DOCTYPE html>',
		'<html>',
		'<!-- ->',
		'/**',
		' * Ce formulaire a été généré via <forum.forumactif.com>.',
		' * Generateur développé par Luiz Felipe G. <https://luizfelipe.dev>',
		' * Traduit par l\'équipe du support français de Forumactif',
		' *',
		' * En cas de problème, n\'hésitez pas à ouvrir un sujet dans l\'entraide !',
		' */',
		'<!- -->',
		'<head>',
		'  <meta charset="UTF-8" />',
		'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
		'  <meta http-equiv="X-UA-Compatible" content="ie=edge" />',
		'  <title>' + REPLYformTitle + '</title>',
		'',
		'  <link rel="stylesheet" href="https://bipofa.github.io/Forumactif/form-styles.css" />',
		'</head>',
		'<body>',
		'',
		'  <form id="fa-generated-form">',
		'    <div class="fa-form-wrapper">',
		'      <h1>' + REPLYformTitle + '</h1>',
		'      <!-- BEGIN Generated HTML Code -->',
		'      ' + $('.entry-prev').html().trim(),
		'      <!-- END Generated HTML Code -->',
		'    </div>',
		'    <div class="fa-submit">',
		'      <button class="post-button" type="submit">Publier !</button>',
		'    </div>',
		'  </form>',
		'',
		'',
		'',
		'  <!-- Javascript\'s -->',
		'  <!-- It is not recommended the edition below this line. -->',
		'',
		'  <textarea style="display: none;" id="fa-generated-message">' + REPLYtopicMessage + '</textarea>',
		'',
		'  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" type="text/javascript"></script>',
		'  <script src="https://bipofa.github.io/Forumactif/form-fields-generator.js" type="text/javascript"></script>',
		'  <script type="text/javascript">',
		'    (function ($) {',
		'    	\'use strict\';',
		'',
		'    	$(window).on(\'load\', function () {',
		'    		$(\'#fa-generated-form\').on(\'submit\', function (event) {',
		'         event.preventDefault();',
		'         $(this).find(\'button[type="submit"]\').text(\'En cours de publication...\');',
		'         setTimeout(function () {',
		'    		  	$.post(\'/post\', {',
		'    			  	t: ' + REPLYtopicValue + ',',
		'    				  message: $(\'#fa-generated-message\').val().trim(),',
		'    				  mode: \'reply\',',
		'    				  tid: $(\'[name="tid"]:first\').val(),',
		'    				  post: 1,',
		'    		  	}).done(function () {',
		'    				  alert(\'Le message a été posté avec succès ! Vous allez être redirigé sur le message !\');',
		'             location.href = \'http://\' + location.host + \'/t' + REPLYtopicValue + '-?view=newest\';',
		'    			  }).fail(function () {',
		'    				  alert(\'Une erreur est survenue ! Réessayez plus tard ! \');',
		'    			  });',
		'         }, 600);',
		'    		});',
		'    	});',
		'    }(jQuery));',
		'  </script>',
		'</body>',
		'</html>',
		].join('\n');

		$('#generated-code-zone pre').text(REPLYgeneratedCode);
	}

	// fin coller

	function registerForm(type, title) {
		var MAPPINGS= {
			text: dataType('text'),
			textarea: dataType('textarea'),
			date: dataType('date'),
			color: dataType('color'),
			number: dataType('number'),
			select: dataType('select', ':not([multiple])'),
			selectMultiple: dataType('select', '[multiple]'),
			subtitle: '.data-text.form-subtitle',
			paragraph: '.data-text.form-paragraph'
		}

		;

		function dataType(selector, customSelector) {
			return '[data-type="' + selector + '"]' + (customSelector || '');
		}

		var fieldList=$('.entry-prev') .find('[data-type], .data-text') .map(function(index, node) {
				var $node =$(node);
				var currentName;

				$.each(MAPPINGS, function(name, selector) {
						if ($node.is(selector)) {
							currentName=name;
							return false;
						}
					});

				return currentName;
			}) .get() .join();
	}

	/**
   * Générer le code à nouveau si la personne quitte la partie 3 (retour):
   */
	$('#back-to-2, #step-1, #step-2').on('click', function () {
			$install.find('h3 span.form-type').text('');
		});
}

;

/**
 * Bouton copie.
 */
$('<a>', {
	class: 'fa fa-clipboard',
	id: 'fa-copy-content',
	style: [ 'position: absolute;',
	'top: 15px;',
	'right: 32px;',
	'z-index: 99;',
	'color: #3b3b3b;',
	'text-decoration: none!important;',
	].join(' ')
}).prependTo('.code-zone-to-append code');

new Clipboard('#fa-copy-content', {
target: function(trigger) {
	return trigger.nextElementSibling;
}
});

console.info('Les scripts ont été chargés avec succès !\n[ @version 1.2 ]');
});
}

(jQuery));