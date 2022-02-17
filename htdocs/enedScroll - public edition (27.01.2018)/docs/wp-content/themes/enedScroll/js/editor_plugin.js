// http://tinymce.moxiecode.com/wiki.php/API3:class.tinymce.Plugin

(function() {

	tinymce.create('tinymce.plugins.myBtns', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished its initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {

			//this command will be executed when the button in the toolbar is clicked
			ed.addCommand('mceHeader', function() {

				selection = tinyMCE.activeEditor.selection.getContent();

				//prompt for a tag to use
				//tag = prompt('Tag:');
				//tinyMCE.activeEditor.selection.setContent('<' + tag + '>' + selection + '</' + tag + '>');

				tinyMCE.activeEditor.selection.setContent('<header><p>' + selection + '</p></header>');

			});
			ed.addCommand('mceRow', function() {

				selection = tinyMCE.activeEditor.selection.getContent();

				//prompt for a tag to use
				//tag = prompt('Tag:');
				//tinyMCE.activeEditor.selection.setContent('<' + tag + '>' + selection + '</' + tag + '>');

				tinyMCE.activeEditor.selection.setContent('<div class="row"><p>' + selection + '</p></div>');

			});
			ed.addCommand('mceI', function() {

				selection = tinyMCE.activeEditor.selection.getContent();

				//prompt for a tag to use
				//tag = prompt('Tag:');
				//tinyMCE.activeEditor.selection.setContent('<' + tag + '>' + selection + '</' + tag + '>');

				tinyMCE.activeEditor.selection.setContent('<i class="lighting">' + selection + '</i>');

			});

			ed.addButton('HeaderBtn', {
				title : 'Dodaj nagłówek',
				cmd : 'mceHeader',
				//image : url + '/your-icon.gif'
				image : 'https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/List.png'
			});

			ed.addButton('RowBtn', {
				title : 'Dodaj wiersz',
				cmd : 'mceRow',
				//image : url + '/your-icon.gif'
				image : 'https://findicons.com/files/icons/818/aquaticus_social/64/netvibes.png'
			});

			ed.addButton('IBtn', {
				title : 'Dodaj podświetlenie',
				cmd : 'mceI',
				//image : url + '/your-icon.gif'
				image : 'https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/Magic_wand.png'
			});

		},

	});

	// Register plugin
	tinymce.PluginManager.add('HeaderBtn', tinymce.plugins.myBtns);
})();