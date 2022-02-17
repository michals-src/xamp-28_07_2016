<?php get_template_part('content', 'header'); ?>

	<div class="page-portfolio">
		<div class="portfolio-list">

			<div class="container">

			<div class="row portfolio-list-content text-center">
				<?php $images = [
					'https://upload.wikimedia.org/wikipedia/commons/c/c0/Gingerbread_House_Essex_CT.jpg',
					'https://www.wheretostay.com/prop_photos/3000/3853/Coral-House-Villa--Coral-House_Nov_2015_06.jpg',
					'http://www.whitegadget.com/attachments/pc-wallpapers/85254d1320380902-house-house-wallpaper.jpg',
					'http://www.hotel-r.net/im/hotel/ba/house-3.jpg',
					'http://all4desktop.com/data_images/original/4242805-house.jpg',
					'http://kingofwallpapers.com/house/house-011.jpg',
				]; ?>
				<?php for($x=0;$x<=5;$x++): ?>
					
					<div class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-xs-12">

						<a href="<?php echo $images[$x]; ?>" data-lightbox="podgląd">
							<img src="<?php echo $images[$x]; ?>">
						</a>

					</div>

				<?php endfor; ?>

			</div>


			</div>

		</div>
	</div>

<?php get_footer(); ?>