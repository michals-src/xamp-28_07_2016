<?php 
/**
 * @package Montessori
 */

if(has_nav_menu('primary')): ?>

<nav class="site-navigation clearfix" role="main">
	<div class="clearfix">

		<div class="row">

			<div class="col-sm-7 col-xs-7">
				<button class="roll-navigation collapsed" data-toggle="collapse" data-target="#bs-site-navigation-collapse" aria-expanded="false">
					<span class="glyphicon glyphicon-menu-hamburger"></span>
				</button>
			</div>
			<div class="col-sm-5 col-xs-5 hidden-md hidden-lg">
				<?php if(montessori_has_social_icons()): ?>
				<div class="social-icons-field social-icons-field-mobile">
					<?php if( montessori_has_social_icon_fb() ): ?>
					<a href="https://www.Facebook.com"><span class="social social-fb"></span></a>
					<?php endif; ?>
					<?php if( montessori_has_social_icon_yt() ): ?>
					<a href="https://www.youtube.com"><span class="social social-yt"></span></a>
					<?php endif; ?>
				</div>
				<?php endif; ?>
			</div>

		</div>

	</div>
	<div class="site-navigation-collapse collapse" id="bs-site-navigation-collapse">
	<?php 

		wp_nav_menu(array(
			'theme_location' => 'primary',
			'depth'	=> 1
		));

	?>
	</div>
</nav>

<?php endif; ?>

<?php if(montessori_has_social_icons()): ?>
<div class="social-icons-field hidden-sm hidden-xs">
	<?php if( montessori_has_social_icon_fb() ): ?>
	<a href="<?php echo montessori_get_social_icon_fb_url(); ?>"><span class="social social-fb"></span></a>
	<?php endif; ?>
	<?php if( montessori_has_social_icon_yt() ): ?>
	<a href="<?php echo montessori_get_social_icon_yt_url(); ?>"><span class="social social-yt"></span></a>
	<?php endif; ?>
</div>
<?php endif; ?>