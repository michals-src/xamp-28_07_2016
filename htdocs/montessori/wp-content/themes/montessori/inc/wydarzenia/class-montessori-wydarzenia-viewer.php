<?php

/**
 * Komentarz
 */

namespace Montessori;

use Montessori\WydarzeniaValues;
use Montessori\WydarzeniaPost;
use Montessori\WydarzeniaPostType;

use Montessori\Admin\Settings\DefOptions;

Class WydarzeniaViewer extends DefOptions{

	/**
	 * @var integer
	 */
	private $key;

	public function getActions(){

		add_shortcode( 'wydarzenia', array( $this, 'shortcode_callback' ) );

	}

	public function shortcode_callback( $atts ){

		$atts = shortcode_atts( array(
			'type'	=> 'review'
		), $atts);

		$limit = (get_option('montessori_events_limit')) ? get_option('montessori_events_limit') : $this->getOption( 'montessori_events_limit' );
		$range = (get_option('montessori_events_date_range')) ? get_option('montessori_events_date_range') : $this->getOption( 'montessori_events_date_range' );

		$no_title = (get_option('montessori_events_no')) ? get_option('montessori_events_no') : $this->getOption( 'montessori_events_no' );
		$archive_title = (get_option('montessori_events_archive_title')) ? get_option('montessori_events_archive_title') : $this->getOption( 'montessori_events_archive_title' );
		$show_archive = (get_option('montessori_events_archive_show')) ? get_option('montessori_events_archive_show') : $this->getOption( 'montessori_events_archive_show' );

		$args = array(

			'post_type'		=> WydarzeniaPostType::getName(),
			'posts_per_page' => $limit,
			'post_status'	=> 'publish',
			'order'			=> 'ASC',
			'orderby'		=> 'meta_value',
			'meta_key'		=> WydarzeniaPost::getMetaName()[0],
			'meta_query' => array(
				array(
					'key' => WydarzeniaPost::getMetaName()[0],
					'value' => array( date( 'Y-m-d'), date( 'Y-m-d', strtotime( $range ) ) ),
					'compare' => 'BETWEEN',
					'type'	=> 'date'
				)
			)

		);

		$events = new \WP_Query( $args );

		if( $events->have_posts() ):

			$this->key = 0;

			while( $events->have_posts() ): $events->the_post();
			
			?>
			
				<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

				<?php $this->contentEvent(); ?>

				</div>

			<?php

			$this->key++;

			endwhile;

			wp_reset_postdata();

		 else:

		 	?>
				<h3 class="title-as-info"><?php echo $no_title; ?></h2>
		 	<?php

		endif;

		?>
			
			<?php if( ! empty( $show_archive ) ): ?>

				<h4 class="title-as-break"> <?php echo $archive_title; ?> </h4>

				<?php $this->archiveEvents(); ?>

			<?php endif; ?>

		<?php


	}

	public function contentEvent( $settings = array() ){


		$event = new WydarzeniaValues( get_the_ID() );

		?>		

		  <div class="panel panel-default">
		    <div class="panel-heading" role="tab" id="heading-<?php echo get_the_ID(); ?>">
		      <h4 class="panel-title">
		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-<?php echo get_the_ID(); ?>" aria-expanded="false" aria-controls="collapse-<?php echo get_the_ID(); ?>">
		        
		        <div class="row">
		         	
		         	<div class="col-xs-12 col-sm-8 col-md-8">
		         		
		         		<?php the_title(); ?>
		         		
		         	</div>

		         	<div class="col-xs-12 col-sm-4 col-md-4">

		         		<strong style="width: 100%;text-align: right;display: block;color: #777;">
		         			
						<?php 

							$time = strtotime( $event->getDate() );

							$timezone = get_option( 'timezone_string' ) ? get_option( 'timezone_string' ) : date_default_timezone_get();

							date_default_timezone_set( $timezone );

							if( ! empty( $event->getSettings()['shortDate'] ) ){

								$option = 'F';

							}else{

								$option = 'd F, D';

							}

							echo date_i18n( $option, $time );

						?>

		         		</strong>

		         	</div>

		         </div>
		       
		        </a>
		      </h4>
		    </div>
		    <div id="collapse-<?php echo get_the_ID(); ?>" class="panel-collapse collapse <?php echo ( $this->key === 0 && $settings['archive'] !== true ) ? 'in' : '' ; ?>" role="tabpanel" aria-labelledby="heading-<?php echo get_the_ID(); ?>">
		      <div class="panel-body">

		    	<?php the_content( sprintf( '<span class="btn-neutral">%1$s</span>', 'Czytaj więcej') ); ?>
				
				<?php if( current_user_can( 'edit_posts' ) ): ?>

				<div class="panel-body-footer">
					
					<?php edit_post_link(sprintf('<span class="btn btn-default btn-sm">%s</span>', 'Edytuj wydarzenie')); ?>

				</div>

				<?php endif; ?>

		      </div>
		    </div>
		  </div>

		<?php

	}

	protected function archiveEvents(){

		$limit = (get_option('montessori_events_archive_limit')) ? get_option('montessori_events_archive_limit') : $this->getOption( 'montessori_events_archive_limit' );
		$range = (get_option('montessori_events_archive_date_range')) ? get_option('montessori_events_archive_date_range') : $this->getOption( 'montessori_events_archive_date_range' );
		$no_title = (get_option('montessori_events_no')) ? get_option('montessori_events_no') : $this->getOption( 'montessori_events_no' );

		$args = array(

			'post_type'		=> WydarzeniaPostType::getName(),
			'posts_per_page' => $limit,
			'post_status'	=> 'publish',
			'order'			=> 'DESC',
			'orderby'		=> 'meta_value',
			'meta_key'		=> WydarzeniaPost::getMetaName()[0],
			'meta_query' => array(
				array(
					'key' => WydarzeniaPost::getMetaName()[0],
					'value' => array( date( 'Y-m-d', strtotime( $range )), date( 'Y-m-d') ),
					'compare' => 'BETWEEN',
					'type'	=> 'date'
				)
			)

		);

		$events = new \WP_Query( $args );

		if( $events->have_posts() ):


			while( $events->have_posts() ): $events->the_post();
			
			?>
			
				<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

				<?php $this->contentEvent( array( 'archive' => true ) ); ?>

				</div>

			<?php


			endwhile;

			wp_reset_postdata();

		 else:

		 ?>
				<h5 style="margin-top: -15px;margin-bottom: 35px;"><?php echo $no_title; ?></h5>
		 <?php

		endif;

	}

	
}