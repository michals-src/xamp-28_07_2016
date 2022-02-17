<?php

define('MONTESSORI_WYDARZENIA_PATH', get_template_directory() . 'inc/wydarzenia');
define('MONTESSORI_WYDARZENIA_URI', get_template_directory_uri() . '/inc/wydarzenia');

require_once 'class-montessori-wydarzenia.php';
require_once 'class-montessori-wydarzenia-post_type.php';
require_once 'class-montessori-wydarzenia-post.php';
require_once 'class-montessori-wydarzenia-values.php';
require_once 'class-montessori-wydarzenia-fields.php';
require_once 'class-montessori-wydarzenia-viewer.php';
require_once 'class-montessori-wydarzenia-functions.php';

new Montessori\Wydarzenia();