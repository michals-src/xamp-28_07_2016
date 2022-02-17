<?php if ( isset( $_GET['entry_id'] ) ): ?>
<div id="smuzform-cont" class="entryEditorCont">

<nav class="navbar navbar-inverse mainnavbar">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand">
				<?php smuzform_translate_e( 'Zobacz wiadomość  #'. intval($_GET['entry_id']) )  ?>
			</a>
			
			<ul class="nav navbar-nav navbar-right" id="navBarActionsCont">
				<li class="navBarActionsLi">
					<a id="formEntriesAction" href="<?php echo admin_url( 'admin.php?page=smuz-forms-entry&form_id='.intval($_GET['form_id']) ); ?>"><?php smuzform_translate_e( 'Powrót do kreatora formularza <' ) ?></a>
				</li>
			</ul>
			
		
		</div>


	</div>
</nav>

<div class="container">
	<div class="row entryEditorMainRow">

		<div class="pull-left fieldDataEntryEditor">

			<ul>
			<?php
			$entryFields = $entryManager->getEntry( intval( $_GET['entry_id'] ) );
			foreach ( $entryFields as $key => $field ): ?>

				<li class="fieldInfoCont">
					<div class="fieldLabel">
						<strong><?php esc_html_e( $field['label'] ) ?></strong>
					</div>
					<div class="fieldValue">

					<?php if ( is_array( $field['value'] ) ): ?>

					<?php if ( key( $field['value'] ) == 'name' ): ?>

					<p> <span class="firstName"><?php esc_html_e( $field['value']['name']['firstName'] ) ?> </span><span class="lastName"><?php esc_html_e( $field['value']['name']['lastName'] ) ?></span> </p>
					<?php elseif ( key( $field['value'] ) == 'address' ): ?>

					<div class="addressFieldCont">

						<dl class="dl-horizontal">
							<dt><strong> Ulica: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['streetAddress'] ) ?></dd>

							<dt><strong> Adres 2: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['streetAddress2'] ) ?></dd>

							<dt><strong> Miasto: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['city'] ) ?></dd>

							<dt><strong> Województwo: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['state'] ) ?></dd>

							<dt><strong> Kod pocztowy: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['zip'] ) ?></dd>

							<dt><strong> Kraj: </strong></dt>
								
							<dd><?php esc_html_e( $field['value']['address']['country'] ) ?></dd>
							
						</dl>

					</div>
	
					<?php elseif ( key( $field['value'] ) == 'checkbox' ): ?>

					<ol style="list-style-type: disc">
					<?php foreach ( $field['value']['checkbox'] as $check ): ?>
						<li>
							<?php esc_html_e( $check ) ?>
						</li>
					<?php endforeach; ?>
					<ol>

					<?php elseif ( key( $field['value'] ) == 'fileupload' ): ?>
					<?php

						$path = $field['value']['fileupload']['path'];

						$file_name = $field['value']['fileupload']['pathinfo']['basename'];

						$directory = DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . basename( get_option( 'smuzform_upload_dir' ) ) . DIRECTORY_SEPARATOR . $entryManager->getId() . DIRECTORY_SEPARATOR;

						$download_url = WP_CONTENT_URL . $directory . $file_name;

						if ( empty( $path ) )
							$download_url = '';

					?>
						
						<p><strong>URL: </strong><code>
						<?php esc_attr_e($download_url) ?>
						</code></p>
						
						<p><a <?php echo ( $download_url === '' ) ? 'disabled': '' ?> href="<?php esc_attr_e($download_url) ?>" class="button btn-primary">Download File</a></p>
						
						<p class="message alert"><?php smuzform_translate_e('Nie rozpowszechniaj odnośnika do pobrania pliku. To może narazić bezpieczeństwo lokalizacji adres przesyłania pliku.') ?></p>
					<?php endif; //endhere key check ?>

					<?php else: ?>

					<p><?php esc_html_e( $field['value'] ) ?></p>

					<?php endif; //endhere array check ?>

					</div>
				</li>

			<?php endforeach; ?>
			</ul>
		</div>

		<div class="pull-right InfoContEntryEditor">

			<?php do_action( 'smuzform_admin_edit_entry_rightcol', $entryManager->getId(), $entryManager ) ?>

			<div id="formInfoContEntryEditor">
				<h2><?php smuzform_translate_e( 'Form Information' ) ?></h2>
				<h3><a href="<?php echo admin_url( 'admin.php?page=smuz-forms&form_id='.intval($_GET['form_id']) ); ?>"><?php esc_html_e( $entryManager->getTitle() ) ?></a></h3>
				<p><?php esc_html_e( $entryManager->getDescription() ) ?></p>
			</div>

			<div id="UserInfoContEntryEditor">
				<h2><?php smuzform_translate_e( 'User Information' ) ?></h2>
				
				<?php 
				$userInfo = $entryManager->getEntryUserInfo( intval( $_GET['entry_id'] ) );

				$userAgent = new phpUserAgentStringParser();

				$userAgent = $userAgent->parse( $userInfo->user_agent );
				?>

				<h4><?php smuzform_translate_e( "IP Adres" ) ?></h4>
				<p><strong><?php esc_html_e( $userInfo->user_ip ) ?></strong></p>
	
				<h4><?php smuzform_translate_e( "Przeglądarka" ) ?></h4>
				<p><strong><?php esc_html_e( ucfirst($userAgent['browser_name']) ) ?></strong></p>

				<h4><?php smuzform_translate_e( "System operacyjny" ) ?></h4>
				<p><strong><?php esc_html_e( ucfirst($userAgent['operating_system']) ) ?></strong></p>

				<h4><?php smuzform_translate_e( "Lokalizacja" ) ?></h4>
				<p><strong id="userIpLocation"></strong></p>
				<div id="userIpLocationMap"></div>

				<h4><?php smuzform_translate_e( "Stworzono w" ) ?></h4>
				<p><strong><?php esc_html_e( date( 'M jS, Y - g:i a', strtotime( $userInfo->created_at ) ) ) ?></strong></p>

			</div>

			<?php do_action( 'smuzform_admin_edit_entry_rightcol_end', $entryManager->getId(), $entryManager ) ?>

		</div>

	</div>

	
</div>

<input type="hidden" id="hiddenUserIp" value="<?php esc_html_e( $userInfo->user_ip ) ?>" />

</div>
<?php endif; ?>