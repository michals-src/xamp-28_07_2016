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
define('DB_NAME', 'stayfit');

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
define('AUTH_KEY',         '{aM=_<x{a1:dw_fx3%,O8LUg8aALlN(ay4aM*ylT?{KW73({gu77kI,+b#[F(r}L');
define('SECURE_AUTH_KEY',  'xfpz>x0hToH$ 6]nk|3P};B b[Bz>f$pB=_I{wl94:=gCQSb*Rq_:h;wD|U/s1{M');
define('LOGGED_IN_KEY',    '3 TOBkL*^WQTT19vf`tPq_xy,m&x.!?[htc$xZ6a4/4|R5bGYFqNtCmD&OQ`k-}w');
define('NONCE_KEY',        'q3GbxK8pt(4O6Ned,R^yBwVGXIhw;{s5_T#[L|t},dQ$j-9QmpTJn#XK=s) N%(7');
define('AUTH_SALT',        'H1J3+<_~@}RfZ|9G2WV!Yn%SyIXT!unRwwb To&R?/t2.?!r3:m]td=!;1f?GEw2');
define('SECURE_AUTH_SALT', '5rmQOC{kwt8/,VhQH:,j$)]uw5M&^Njcg_ N.hc3&S=[x3V71;_T=J{:lyjAK$Z[');
define('LOGGED_IN_SALT',   'q%r /x}G=lCwBvkWcrp{UHPF#Up6LRks>971s$,0]@FZ1&%3_7/GXEM@INChcQrH');
define('NONCE_SALT',       'f1ay9}OQWQo ,KU$2Ta]CK^A/zPHm~vr|}ZFzw{{dFNyN0w@U|}L.,F5~YM`e]=v');

/**#@-*/

/**
 * Prefiks tabel WordPressa w bazie danych.
 *
 * Możesz posiadać kilka instalacji WordPressa w jednej bazie danych,
 * jeżeli nadasz każdej z nich unikalny prefiks.
 * Tylko cyfry, litery i znaki podkreślenia, proszę!
 */
$table_prefix  = 'stb';

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
