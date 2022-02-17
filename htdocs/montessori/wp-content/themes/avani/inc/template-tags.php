<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Avani
 */

if ( ! function_exists( 'avani_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function avani_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		$posted_on = sprintf(
			esc_html_x( 'on %s', 'post date', 'avani' ),
			'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
		);

		$byline = sprintf(
			esc_html_x( 'Written by %s', 'post author', 'avani' ),
			'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
		);

		echo '<span class="byline"> ' . $byline . '</span><span class="posted-on">' . $posted_on . '</span>'; // WPCS: XSS OK.
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit Post%s', 'avani' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>'
		);
	}
endif;

if ( ! function_exists( 'avani_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function avani_entry_footer() {
		// Hide category and tag text for pages.
		if ( is_singular( 'post' ) ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', 'avani' ) );
			if ( $categories_list && avani_categorized_blog() ) {
				printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'avani' ) . '</span>', $categories_list ); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', 'avani' ) );
			if ( $tags_list ) {
				printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'avani' ) . '</span>', $tags_list ); // WPCS: XSS OK.
			}
		}
	}
endif;

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function avani_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'avani_categories' ) ) ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,
			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'avani_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so avani_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so avani_categorized_blog should return false.
		return false;
	}
}

if ( ! function_exists( 'avani_the_custom_logo' ) ) :
	/**
	 * Displays the optional custom logo.
	 *
	 * Does nothing if the custom logo is not available.
	 */
	function avani_the_custom_logo() {
		if ( function_exists( 'the_custom_logo' ) ) {
			the_custom_logo();
		}
	}
endif;

if ( ! function_exists( 'avani_the_custom_header' ) ) :
	/**
	 * Displays the custom header.
	 *
	 * Does nothing if the custom header is not available.
	 */
	function avani_the_custom_header() {
		if ( get_header_image() ) {
			if ( 1 === get_theme_mod( 'avani_header_on_home_only', '' ) && ! ( is_home() || is_front_page() ) ) {
				return;
			}
			?>
			<img class="custom-header" src="<?php header_image(); ?>" width="<?php echo absint( get_custom_header()->width ); ?>" height="<?php echo absint( get_custom_header()->height ); ?>" alt="" >
			<?php
		}
	}
endif;

if ( ! function_exists( 'avani_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 *
	 * Create your own avani_post_thumbnail() function to override in a child theme.
	 */
	function avani_post_thumbnail() {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
			return;
		}

		if ( is_singular() ) :
			if ( 1 !== get_theme_mod( 'avani_no_thumbnail_onpost', '' ) ) :
			?>
				<div class="post-thumbnail">
					<?php the_post_thumbnail( 'post-thumbnail', array( 'alt' => the_title_attribute( 'echo=0' ), 'class' => 'aligncenter thumbnails' ) ); ?>
				</div><!-- .post-thumbnail -->
			<?php
			endif;
		else : ?>
			<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true">
				<?php the_post_thumbnail( 'post-thumbnail', array( 'alt' => the_title_attribute( 'echo=0' ), 'class' => 'aligncenter thumbnails' ) ); ?>
			</a>
		<?php
		endif; // End is_singular().
	}
endif;

if ( ! function_exists( 'avani_footer_widgets' ) ) :
	/**
	 * Display footer widgets.
	 *
	 * @return void
	 * @since  0.0.1
	 */
	function avani_footer_widgets() {
		/**
		 * Identify total number of active footer widgets (widget area in-use).
		 * Maximum three widget area supported in footer.
		 */
		$total = 0; // Count active footer widgets area.
		$i = 0; while ( $i < 3 ) {
			$i++;
			if ( is_active_sidebar( 'footer-' . $i ) ) :
				$total++ ;
			endif;
		}
		/**
		 *
		 * Display all active footer widgets area.
		 * Do not display footer-widget areas if they are not in use (footer-widget
		 * area does not contain any widgets).
		 */
		if ( 0 !== $total ) {
			printf( '<div class="footer-widgets">' );
			$i = 0; while ( $i < $total ) {
				$i++;
				if ( is_active_sidebar( 'footer-' . $i ) ) :
					printf( '<div class="footer-widget footer-widget-count-%s">', absint( $total ) );
					dynamic_sidebar( 'footer-' . $i );
					printf( '</div>' );
				endif;
			}
			printf( '</div><!--/# footer-widgets-->' );
		}
	}
endif;

/**
 * Flush out the transients used in avani_categorized_blog.
 */
function avani_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	// Like, beat it. Dig?
	delete_transient( 'avani_categories' );
}
add_action( 'edit_category', 'avani_category_transient_flusher' );
add_action( 'save_post',     'avani_category_transient_flusher' );
