
(function() {
	tinymce.create('tinymce.plugins.icitspots', {

		init : function(ed, url) {
			var t = this;

			t.url = url;
			

			
			//replace shortcode before editor content set
			ed.onBeforeSetContent.add(function(ed, o) {
				o.content = t._do_spot(o.content);
			});
			
			//replace shortcode as its inserted into editor (which uses the exec command)
			ed.onExecCommand.add(function(ed, cmd) {
			    if (cmd ==='mceInsertContent'){
					tinyMCE.activeEditor.setContent( t._do_spot(tinyMCE.activeEditor.getContent()) );
				}
			});
			//replace the image back to shortcode on save
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = t._get_spot(o.content);
			});
		},

		_do_spot : function(co) {
			return co.replace(/\[icitspot([^\]]*)\]/g, function(a,b){
				return '<img src="/wp-content/plugins/tinymce-graphical-shortcode/tinymce-plugin/icitspots/images/t.gif" class="wpSpot mceItem" title="icitspot'+tinymce.DOM.encode(b)+'" />';
			});
		},

		_get_spot : function(co) {

			function getAttr(s, n) {
				n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
				return n ? tinymce.DOM.decode(n[1]) : '';
			};

			return co.replace(/(?:<p[^>]*>)*(<img[^>]+>)(?:<\/p>)*/g, function(a,im) {
				var cls = getAttr(im, 'class');

				if ( cls.indexOf('wpSpot') != -1 )
					return '<p>['+tinymce.trim(getAttr(im, 'title'))+']</p>';

				return a;
			});
		},

		getInfo : function() {
			return {
				longname : 'Spots shortcode replace',
				author : 'Simon Dunton',
				authorurl : 'http://www.wpsites.co.uk',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('icitspots', tinymce.plugins.icitspots);
})();
