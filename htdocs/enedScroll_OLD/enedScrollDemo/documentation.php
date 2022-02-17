<?php require_once 'config.php'; ?>
<!doctype html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="favicons/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="favicons/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="favicons/manifest.json">
	<link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#ffffff">
	<link rel="stylesheet" href="http://<?php echo BASE_D; ?>/css/documentation.css">
	<link rel="stylesheet" href="http://<?php echo BASE_D; ?>/css/bootstrap.min.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css">
	<meta charset="utf-8"/>
	<title>enedScroll - Documentation</title>
</head>
<body>

	<?php 

	function pages(){
		return $pages = array(
			'Installation' 	=> array(
				'items'	=> array(
					'Get start'	=> array(
						'role'	=> 'link',
						'url' 	=> 'get-start'
					),
					'Defaults'	=> array(
						'role'	=> 'link',
						'url' 	=> 'defaults',
						'items'	=> array(
							'enedPosition'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.enedPosition'
							),
							'enedSetColor'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.enedSetColor'
							),
							'selectorsSetColor'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.selectorsSetColor'
							),
							'enedColor'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.enedColor'
							),
							'selectorsColor'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.selectorsColor'
							),
							'z-index'	=> array(
								'role'	=> 'link',
								'url' 	=> 'defaults.z-index'
							),
						)
					)
				),
				'role'	=> 'title'
			),
			'Functions'		=> array(
				'role'	=> 'title',
				'items'	=> array(
					'ened'	=> array(
						'role'	=> 'link',
						'url' 	=> 'ened',
						'items'	=> array(
							'selectors'	=> array(
								'role'	=> 'link',
								'url' 	=> 'ened.selectors'
							),
						)
					),
					'set'	=> array(
						'role'	=> 'link',
						'url' 	=> 'set',
						'items'	=> array(
							'before'	=> array(
								'role'	=> 'link',
								'url' 	=> 'set.before'
							),
							'after'	=> array(
								'role'	=> 'link',
								'url' 	=> 'set.after'
							),
							'focusin'	=> array(
								'role'	=> 'link',
								'url' 	=> 'set.focusin'
							),
							'percentage'	=> array(
								'role'	=> 'link',
								'url' 	=> 'set.percentage'
							),
							'data'	=> array(
								'role'	=> 'link',
								'url' 	=> 'set.data'
							),
						)
					),
					'add Space'	=> array(
						'role'	=> 'link',
						'url' 	=> 'addSpace',
					),
					'get'	=> array(
						'role'	=> 'link',
						'url' 	=> 'get',
					),
				)
			),
			'Helpers' => array(
				'role'	=> 'title',
				'items'	=> array(
					'getVal'	=> array(
						'role'	=> 'link',
						'url' 	=> 'getVal',
					),
					'Pin'	=> array(
						'role'	=> 'link',
						'url' 	=> 'pin',
					),
				)
			),
			'Demos'	=> array(
				'role' => 'title',
				'items' => array(
					'Using addSpace' => array(
						'role'	=> 'link',
						'url'	=> 'addSpace.demo'
					),
					'Using pin' => array(
						'role'	=> 'link',
						'url'	=> 'pin.demo'
					),
					'Simple transform animation' => array(
						'role'	=> 'link',
						'url'	=> 'simple.demo'
					),
					'Add class' => array(
						'role'	=> 'link',
						'url'	=> 'addclass.demo'
					)
				)
			)
		);
	}

	function getPage($name){
		$pages = pages();
		foreach ($pages as $key => $value){
			$items = (!empty($value['items'])) ? $value['items'] : '';
			if(!empty($items)){
				if(array_key_exists($name, $items)){
					return $items[$name];
				}else{
					foreach ($items as $key => $value) {
						$items = (!empty($value['items'])) ? $value['items'] : '';
						if(!empty($items)){
							if(array_key_exists($name, $items)){
								return $items[$name];
							}
						}
					}
				}
			}
		}

	}

	function getLink($name){
		if(!empty($name) && !empty(getPage($name)) && !empty(getPage($name)['url']))
		return getPage($name)['url'];
	}

	$pages = pages();

	?>

		<div class="container-fluid">
			<header role="main">
				<h2 class="text">enedScroll</h2>
				<p style="font-size: 16px;">Documentation</p>
			</header>
			<div class="container main-area">
				<div class="row">

					<div class="mobile-nav hidden-md hidden-lg">
						<a href="#" class="open-nav"><i class="glyphicon glyphicon-menu-hamburger"></i></a>
					</div>

					<div class="col-md-3 navigation-scene">

						<ul class="ul-ns nav" role="navigate">

						<?php 

							foreach($pages as $key => $value){
								
								$items = (!empty($value['items'])) ? $value['items'] : array();

								echo '<li>';

									if($value['role'] === 'title'){
										echo '<h5>'. $key .'</h5>';
									}

									foreach($items as $key => $value){
										echo '<ul class="ul-ns">';

											$items = (!empty($value['items'])) ? $value['items'] : array();
											$class = (!empty($items)) ? ' class="parent-item"' : '';
											
											if(!empty($items)){
												echo '<li '.$class.'><a href="#'. $value['url'] .'">'. $key .'</a>';
												echo '<ul class="sub-nav">';
												foreach($items as $key => $value){

														echo '<li><a href="#'. $value['url'] .'">'. $key .'</a></li>';
														$items = (!empty($value['items'])) ? $value['items'] : array();

														if($items){
															
														}
												}
												echo '</ul>';
												echo '</li>';
											}else{
												echo '<li '.$class.'><a href="#'. $value['url'] .'">'. $key .'</a></li>';
											}

										echo '</ul>';
									}

								echo '</li>';

							}

						?>

						</ul>

					</div>

					<div class="col-md-9 doc-content">

						<h2 class="page-header">Installation</h2>
						
						<?php include 'docs/installation/get_start.php'; ?>
						<?php include 'docs/installation/defaults.php'; ?>


						<h2 class="page-header">Functions</h2>
						<?php include 'docs/functions/ened.php'; ?>
						<?php include 'docs/functions/set.php'; ?>
						<?php include 'docs/functions/addspace.php'; ?>
						<?php include 'docs/functions/get.php'; ?>

						<h2 class="page-header">Helpers</h2>
						<?php include 'docs/helpers/getval.php'; ?>
						<?php include 'docs/helpers/pin.php'; ?>

						<h2 class="page-header">Demos</h2>
						<?php include 'docs/demos/addspace.php'; ?>
						<?php include 'docs/demos/pin.php'; ?>
						<?php include 'docs/demos/simple.php'; ?>
						<?php include 'docs/demos/addclass.php'; ?>

					</div>

				</div>
			</div>

		</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-89554230-1', 'auto');
  ga('send', 'pageview');

</script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/bootstrap.min.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/enedscroll.min.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/documentation.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
</body>
</html>