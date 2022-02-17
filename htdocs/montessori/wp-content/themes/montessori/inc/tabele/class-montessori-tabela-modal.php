<?php

/**
 * 
 */

namespace Montessori;

class Modal{

	/**
	 * @var array
	 */
	protected $args;

	public function __construct( $args = array() ){

		global $pagenow;

		if( in_array( $pagenow, array('post-new.php', 'post.php') ) )

		if( !empty( $args ) )

		$this->prepareArgs( $args );

		$this->preapreModal();

	}

	protected function preapreModal(){

		if( ! empty( $this->args) )

		$this->modalHeader();
		$this->modalContent();
		$this->modalFooter();

	}

	protected function prepareArgs( $args ){

		$default = array(
			'id'					 => false,
			'container_id'			 => false,
			'title'					 => false,
			'modal_class'			 => false,
			'modal_container_class'  => false,
			'callback'				 => array()
		);

		$args = array_merge($default, $args);

		

		$this->args = $args;

	}

	protected function modalHeader(){

		?>
		
		<div class="modal-field <?php  echo ( ! empty( $args['modal_class'] ) ) ? $args['modal_class'] : ''; ?>"<?php  echo ( ! empty( $this->args['id'] ) ) ? 'id="' . $this->args['id'] . '"' : ''; ?>>
			
			<div class="modal-exit">

				<div class="dashicons dashicons-no"></div>

			</div>

			<div class="modal <?php  echo ( ! empty( $args['modal_container_class'] ) ) ? $args['modal_container_class'] : ''; ?>" <?php  echo ( ! empty( $this->args['container_id'] ) ) ? 'id="' . $this->args['container_id'] . '"' : ''; ?>>
				
				<div class="modal-content">

					<h1 class="modal-title"><?php  echo ( ! empty( $this->args['title'] ) ) ?$this->args['title'] : ''; ?></h1>

		<?php

	}

	protected function modalContent(){

		$class = $this->args['callback'][0];
		$method = $this->args['callback'][1];

		if(method_exists($class, $method))

		return $class->$method();
	}

	protected function modalFooter(){

		?>
			
				</div><!-- .modal-content -->
			</div><!-- .modal -->
		</div><!-- .modal-field -->

		<?php

	}



}