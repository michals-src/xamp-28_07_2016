<?php

/**
 * Komentarz
 */

namespace Montessori;

use Montessori\TabelaPost;

Class TabelaValues extends TabelaPost{

	/**
	 * @var integer
	 */
	protected $tabela_ID;

	/**
	 * @var boolean
	 */
	protected $exists;

	/**
	 * @var string
	 */
	protected $title;

	/**
	 * Ilość wierszy
	 * @var integer
	 */
	protected $rows;

	/**
	 * Ilość kolumn
	 * @var integer
	 */
	protected $cols;

	/**
	 * @var string
	 */
	protected $table;


	public function __construct( $tabela_id ){

		$this->tabela_ID = $this->post_ID = $tabela_id;

		parent::__construct();

		$this->tableExists();

		$this->tableTitle();

		$this->tableRows();

		$this->tableCols();

		$this->tableGet();

	}

	public function Exists(){

		return $this->exists;

	}

	public function getRows(){

		return $this->rows;

	}

	public function getTitle(){

		return $this->title;

	}

	public function getTableID(){

		return $this->tabela_ID;

	}

	public function getCols(){

		return $this->cols;
		
	}

	public function getTable(){

		return $this->table;
		
	}

	protected function tableGet(){

		$this->table = ' Tabela z postaci array skonwertowana na html przez funkcję convert';

	}

	protected function tableCols(){

		$this->cols = 'ilość kolumn';

	}

	protected function tableRows(){

		$this->rows = 'ilość wierszy';

	}

	protected function tableTitle(){

		$this->title = $this->get( 'post_title' );

	}

	protected function tableExists(){

		$postMeta = $this->Get( 'post_content' );

		$this->exists = ( ! empty( $postMeta ) ) ? true : false;

	}

}