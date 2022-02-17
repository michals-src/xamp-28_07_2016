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
define('DB_NAME', 'rakantbud');

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
define('AUTH_KEY',         'qCBoZU)TQrJo?QZ^2&j9(=_H,Jus$:kIOzSn>W&$oIxl}a*IM%Ixh]fLh[@q2 xx');
define('SECURE_AUTH_KEY',  'dkxOdY-#&RxQ6&);T2nvVmevu<LYGAtc2`.?fi97%l&bj -]f:FP{Y?#pZ%<X93R');
define('LOGGED_IN_KEY',    'CqJB_n4fRP.:!-Cb!=aUa)R[+o:sNn#ijQA:@c_ugy]T?D7&RF([%h~aB[.) xHc');
define('NONCE_KEY',        'rO1U<Wp]GUC6%W8ve87k tGu4pGy933g-T`sjR-@-q(Gnda~oc3cxtZ2QEeS4]8,');
define('AUTH_SALT',        'k?6#|VPTK.fe#G!O{|#p1OZ1!Ou|aYnUu3h} |1X>&(uM)/ h*cnce+=Iz-TfQT@');
define('SECURE_AUTH_SALT', 'VGF,-.{9JgIWR#_~.=:VJ6b*~ZM8m<bb7-dGfWLi@i*HvnU*A~FO;]=T$Pm]9WRg');
define('LOGGED_IN_SALT',   '7rc$?K,[0gij3;zy ckYV^`_e=vl$J3Z|$AT xipobnLv$l.1v2-~*i7[bZ4,As{');
define('NONCE_SALT',       'Zy6hJKrG}XmCg4J)q!|:>_Bp!:Wb$K}hrgUgYW&YSWb!XP{Ad.8758V|m?xr[$*/');

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
