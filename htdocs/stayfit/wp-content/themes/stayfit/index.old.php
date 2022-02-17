\<?php get_header(); ?>
<div class="prez row">
	<div class="prez-wall">
		<img src="<?php echo get_template_directory_uri(); ?>/images/d78e8d.png">
	</div>
	<header class="clearfix" role="main">
			<h1 class="header-brand">
				<img src="<?php echo get_template_directory_uri(); ?>/images/j348ds.png" width="36px">
				<strong><a href="#">Stayfit</a></strong>
			</h1>
			<nav class="row">
				<ul class="nav header-nav">
					<li class="active"><a href="#"> Start </a></li>
					<li><a href="#"> Cennik </a></li>
					<li><a href="#"> Cennik </a></li>
					<li><a href="#"> Grafik </a></li>
				</ul>
			</nav>
	</header>
	<div class="container text-center site-wrapper">
		<div class="site-wrapper-inner">
				<div class="container">
					<div class="text-wall">
						<h1><strong>Witaj świecie</strong></h1>
						<p class="lead">Przykładowa strona <?php echo get_the_title(); ?></p>
					</div>
				</div>
		</div>
	</div>
</div>
<!--
<div class="section">
		<div class="row oferta">
			
			<div class="col-md-4 col-md-offset-2 oferta-wall" style="margin-top:150px;">

					<div class="oferta-image" style="background: #000 url(<?php echo get_template_directory_uri(); ?>/images/image_1.png) center no-repeat;">
						<div class="site-wrapper">
							<div class="site-wrapper-inner">
								<p class="text-center oferta-image-text">
									Podczas ćwiczeń angażowane są wszystkie grupy mięśniowe powodują ich wzmocnienie i wytrzymałość. Zajęcia są prowadzone w tempie zmiennym (interwał) dzięki czemu poprzez wyższe tętno jest spalane więcej tkanki tłuszczowej.
								</p>
							</div>
						</div>
					</div>


			</div>
			<div class="col-md-5 col-md-offset-1 oferta-links" style="margin-top:20px;">
				<h2>Oferta</h2>
				<ul>
					<li class="active"><a href="#">Trening personalny</a></li>
					<li><a href="#">Trening 2</a></li>
					<li><a href="#">Pilates</a></li>
					<li><a href="#">Pilates</a></li>
					<li><a href="#">Pilates</a></li>
					<li><a href="#">Pilates</a></li>
					<li><a href="#">Pilates</a></li>
					<li><a href="#">Pilates</a></li>
				</ul>

			</div>
	</div>
</div>
-->
<div class="section">
<?php 

	use fb\fb;
	$fb = new fb();

	$me = $fb->me(['feed.limit(5){message,created_time,from}', 'link', 'name']);

?>
	<div class="container artykuly">
		<div class="row clearfix">

			<div class="static-information col-md-5 col-xs-12 text-right">
				<h2 style=" color: #153761; margin-bottom: 45px; display: block; font-weight: 700; font-size: 48px;">O nas</h2>
				<p style="color:#8699b5;font-size:16px;">Klub prowadzi szereg zajęć fitness poprawiające wygląd sylwetki, wzmocnienia mięśni, zmniejszenia obwodu ud, ujędrnienia ciała, pozbycia się cellulitu czy poprawy kondycji. Można również skorzystać z treningów personalnych pod okiem doświadczonych trenerów, treningu obwodowego oraz zajęć wzmacniających mięśnie kręgosłupa. Nasz klub wyróżnia się mniejszymi grupami dzięki czemu instruktor może poświecić więcej czasu dla osoby ćwiczącej. Doświadczeni instruktorzy pomogą dla Twojego ciała i zdrowia nabrać swietnej kondycji oraz wspaniałego wyglądu.</p>
				<div class="fb-like" data-href="<?php echo $me->link; ?>" data-layout="standard" data-action="like" data-size="large" data-show-faces="false" data-share="true"></div>
			</div>
			<div class="col-md-6 col-xs-12 artykuly-field">
			<?php 
				foreach ($me->feed as $key => $item) {

					$message = preg_replace('|(https?://([\d\w\.-]+\.[\d\w\.]{2,3}\/)([\w\d\-]+)\/[^\s\.-]+)|i', '<a href="$1">$1</a>', $item['message']);
					$from = $fb->getFields($item['from'], ['link','name']);
					?>

						<article class="col-md-12 col-xs-12 _fa">
							<div class=" article-container">
								<header>
									<a href="<?php echo $from->link; ?>"><?php echo $from->name; ?></a>
									<date><?php echo $item['created_time']->format('d M Y'); ?></date>
								</header>
								<field class="row">
									
									<p><?php echo nl2br($message); ?></p>
									<?php 
										$attachments = $fb->getFields($item, array('attachments'))->attachments[0];

										if($attachments['type'] === 'photo'){
											
											$images = $fb->getImage($attachments['target']);

											$num = count($images->images) - 4;

											echo '<picture><img src="' . $images->images[$num]['source'] . '" width="'.$images->images[$num]['width'].'" height="'.$images->images[$num]['height'].'" class="_ai"/></picture>';
											
											preg_match('/^.{0,340}(?:.*?)\b/siu', $images->name, $matches);
											print_r($matches[0]);

											//echo '<p>'. nl2br($images->name) .'</p>';
										}

										if($item['story']){
											echo '<div class="_astx">' . $item['story'] . '</div>';
										}

									?>
								
								</field>
							</div>
						</article>

					<?php
				}


			?>
		  </div>


		</div>
		
	</div>

</div>

<?php get_footer(); ?>