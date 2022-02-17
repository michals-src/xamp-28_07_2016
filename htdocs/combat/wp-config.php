<?php
/**
 * Podstawowa konfiguracja WordPressa.
 *
 * Skrypt wp-config.php używa tego pliku podczas instalacji.
 * Nie musisz dokonywać konfiguracji przy pomocy przeglądarki internetowej,
 * możesz też skopiować ten plik, nazwać kopię "wp-config.php"
 * i wpisać wartości ręcznie.
 *
 * Ten plik zawiera konfigurację:
 *
 * * ustawień MySQL-a,
 * * tajnych kluczy,
 * * prefiksu nazw tabel w bazie danych,
 * * ABSPATH.
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Ustawienia MySQL-a - możesz uzyskać je od administratora Twojego serwera ** //
/** Nazwa bazy danych, której używać ma WordPress */
define('DB_NAME', 'combat');

/** Nazwa użytkownika bazy danych MySQL */
define('DB_USER', 'root');

/** Hasło użytkownika bazy danych MySQL */
define('DB_PASSWORD', '');

/** Nazwa hosta serwera MySQL */
define('DB_HOST', 'localhost');

/** Kodowanie bazy danych używane do stworzenia tabel w bazie danych. */
define('DB_CHARSET', 'utf8mb4');

/** Typ porównań w bazie danych. Nie zmieniaj tego ustawienia, jeśli masz jakieś wątpliwości. */
define('DB_COLLATE', '');

/**#@+
 * Unikatowe klucze uwierzytelniania i sole.
 *
 * Zmień każdy klucz tak, aby był inną, unikatową frazą!
 * Możesz wygenerować klucze przy pomocy {@link https://api.wordpress.org/secret-key/1.1/salt/ serwisu generującego tajne klucze witryny WordPress.org}
 * Klucze te mogą zostać zmienione w dowolnej chwili, aby uczynić nieważnymi wszelkie istniejące ciasteczka. Uczynienie tego zmusi wszystkich użytkowników do ponownego zalogowania się.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'lm*xjG2lO62xMNe$^]a>$LcwoZ&VyZYjM<xITS4SK)>D:#oJh5Jz1[L3<LYq6&/w');
define('SECURE_AUTH_KEY',  'tEA~>&NVzY!w:L6JgKB+Tjl=eX#j^Q_HPSB`6adqMBz!])*yqSZN([#FP7KUIP>X');
define('LOGGED_IN_KEY',    '5]_8.)f-ZUMo2E<<5s<Adz@xvK|z`h6(^yfcj )L=A(E%Y_7w=[/3E;(z# ,G2_G');
define('NONCE_KEY',        '@Og3yHGk^+(> r)[W:faAb[aQh6qhA(.jP8j09CqKit[]puT%lZKI*].(,#p8<q1');
define('AUTH_SALT',        '^gje]1g+ZB_Ql~K.>E3[{)-M/sV,@Y}KG%T<Yx%4>Z!{A]alz$J]r2@=?YUB}/ p');
define('SECURE_AUTH_SALT', 'Km57 Pw/*F00?8;T9Qmps?6K>3&r[L$ALfm$B%p#o?)odS{>%gP1kM/Ag-P{ck$Z');
define('LOGGED_IN_SALT',   '@0@[;lW/$gh6nME}H@=ne(7{ jH6Op`7O>|e/[l/uL]y7a|$-QU^v xDh[U@lKFz');
define('NONCE_SALT',       'aA6JM7nMbuS3LA0qP25T4q+Xs`W!z(.$f&BR<!B/fHP2l)qAmOe7vI3&oCI<VxA ');

/**#@-*/

/**
 * Prefiks tabel WordPressa w bazie danych.
 *
 * Możesz posiadać kilka instalacji WordPressa w jednej bazie danych,
 * jeżeli nadasz każdej z nich unikalny prefiks.
 * Tylko cyfry, litery i znaki podkreślenia, proszę!
 */
$table_prefix  = 'wp_';

/**
 * Dla programistów: tryb debugowania WordPressa.
 *
 * Zmień wartość tej stałej na true, aby włączyć wyświetlanie
 * ostrzeżeń podczas modyfikowania kodu WordPressa.
 * Wielce zalecane jest, aby twórcy wtyczek oraz motywów używali
 * WP_DEBUG podczas pracy nad nimi.
 *
 * Aby uzyskać informacje o innych stałych, które mogą zostać użyte
 * do debugowania, przejdź na stronę Kodeksu WordPressa.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* To wszystko, zakończ edycję w tym miejscu! Miłego blogowania! */

/** Absolutna ścieżka do katalogu WordPressa. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Ustawia zmienne WordPressa i dołączane pliki. */
require_once(ABSPATH . 'wp-settings.php');
