<?php 
/**
 * Nagłówek
 *
 * @package Montessori
 */
?>
<!doctype html>
<html>
	<head>
		<?php wp_head(); ?>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Przedszkolny oddział Montessori w Białymstoku.">
		<meta name="keywords" content="przedszkole montessori, białystok, bialystok, akademia sukcesu, naszaszkola, oddzial montessori, maria montessori, nauka i zabawa">
		<meta name="robots" content="index, follow">
		<meta name="revisit-after" content="30 days">
		<title><?php bloginfo('title'); ?></title>
	</head>
<body>
<div class="container" role="main">
	
	<div class="row">
		
		<div class="col-md-3 col-sm-12 col-xs-12 left-side">
			
			<div class="brand">

				<header>
					<img src="<?php echo get_template_directory_uri(); ?>/images/img004.png" alt="Przedszkolny oddział Montessori" width="180px">
				</header>

			</div>

			<?php get_sidebar(); ?>

		</div>