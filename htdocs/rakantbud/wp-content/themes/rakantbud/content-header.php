<?php 

get_header(); 

$slipper = array(
	'content'	=>	'<h1><strong>' . RakantbudSettings::get('rb_st_bigHeadertext') . '</strong></h1>
					<p>' . RakantbudSettings::get('rb_st_smallHeadertext') . '</p>'
);
if(is_page() && !is_front_page() || is_single() || is_archive()){
	$slipper['height'] = '350';
	$slipper['content'] =  '<h1 class="text-center"><strong>' . get_the_title() . '</strong></h1>';
}

?>

	<div class="header" role="main">
		<div class="container">

			<div class="row">

				<div class="col-lg-offset-1 col-md-offset-1 col-lg-4 col-md-4 hidden-sm hidden-xs">
					<p style="padding-left:25px;"><strong><?php echo RakantbudSettings::get('rb_st_tag'); ?></strong></p>
				</div>

				<div class="col-lg-7 col-md-7 col-sm-12 col-xs-12 text-right hidden-xs">

					<p style="padding-left:25px;padding-right:15px;display:inline-table;"><i class="glyphicon glyphicon-earphone" style="margin-right:10px;"></i>
						<strong><?php echo RakantbudSettings::get('rb_st_phone'); ?></strong>
					</p>
					<p style="padding-left:10px;padding-right:25px;display:inline-table;"><i class="glyphicon glyphicon-envelope" style="margin-right:10px;"></i>
						<strong><?php echo RakantbudSettings::get('rb_st_email'); ?></strong>
					</p>

				</div>

			</div>

		</div>
			<nav class="navbar navbar-default">
						  <div class="container">
						    <!-- Brand and toggle get grouped for better mobile display -->
						    <div class="navbar-header">
						      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#_mnb-collapse" aria-expanded="false">
						        <span class="sr-only">Toggle navigation</span>
						        <span class="icon-bar"></span>
						        <span class="icon-bar"></span>
						        <span class="icon-bar"></span>
						      </button>
						      <a class="navbar-brand" href="#">
						      	<img src="<?php echo RakantbudSettings::get('rb_st_logo'); ?>" />
						      	<h2 class="title">
						      		<strong class="hidden-sm"><?php echo RakantbudSettings::get('rb_st_name'); ?></strong>
						      	</h2>
						      </a>
						    </div>
						    <?php 
						   		wp_nav_menu(array(
						   			'container_class'		=>	'collapse navbar-collapse',
						   			'container_id'			=>	'_mnb-collapse',
						   			'menu_class'			=>	'nav navbar-nav navbar-right _mnb',
						   			'theme_location'		=>	'Main'
						   		));
						    	
						   	?>
						  </div><!-- /.container -->
					
				</nav>
	</div>

	<div class="slipper shadow-gradient-bottom" style="<?php echo (!empty($slipper['height'])) ? 'height:' . $slipper['height'] . 'px;' : ''; ?>">

		<div class="container content text-center">
			<?php echo $slipper['content']; ?>
		</div>

	</div>