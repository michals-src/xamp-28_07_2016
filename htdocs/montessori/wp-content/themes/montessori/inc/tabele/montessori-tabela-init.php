<?php

/**
 * P L U G I N
 * 
 * @nazwa Montessori Table Plugin
 * @opis Tworzenie, edycja tabeli, dostosowanych do urządzeń mobilnych
 * @author Michał Sierzputowski
 */

define('MONTESSORI_PLUGIN_NAME', 'tabela');

define('MONTESSORI_TABELA_PATH', get_template_directory() . 'inc/tabele');
define('MONTESSORI_TABELA_URI', get_template_directory_uri() . '/inc/tabele');

require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '.php';
require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-post_type.php';
require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-post.php';
require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-values.php';
require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-modal.php';
require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-fields.php';
// require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-filters.php';
// require_once 'class-montessori-' . MONTESSORI_PLUGIN_NAME. '-viewer.php';

new Montessori\Tabela();