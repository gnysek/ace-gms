<style>body,td{font-size: 10px; font-family: sans-serif;} td{vertical-align: top; width: 200px; overflow: hidden;}</style>

<?php

$file = file('fnames');

$var = array();
$function = array();
$constant = array();
$readonly = array();
$obsolete = array();

foreach ($file as $k => $v) {
	$v = trim($v);
	if (strstr($v,'[')) {
		$v = strstr($v,'[',true);
	}
	if (preg_match('/^\/\//', $v) or empty($v)) {
		//echo $v . '<br/>';
		continue;
	} elseif (strstr($v, '(')) {
		if (strstr($v, '&')) {
			$obsolete[] = str_replace('&','',strstr($v, '(', true));
		} else {
			$function[] = strstr($v, '(', true);
		}
	} elseif (strstr($v, '#')) {
		$constant[] = str_replace('#','',$v);
	} elseif (strstr($v, '*')) {
		$readonly[] = str_replace('*','',$v);
	} else {
		$var[] = $v;
	}
}

$vars = implode('| ', $var);
$functions = implode('| ', $function);
$constants = implode('| ', $constant);
$readonlys = implode('| ', $readonly);
$obsoletes = implode('| ', $obsolete);

echo '<table><tr>';
echo '<th>VARS</th>';
echo '<th>FUNC</th>';
echo '<th>CONST</th>';
echo '<th>R-ONLY</th>';
echo '<th>DEPR</th>';
echo '</tr><tr>';
echo '<td>' . str_replace('|', '|' . PHP_EOL, $vars) . '</td>';
echo '<td>' . str_replace('|', '|' . PHP_EOL, $functions). '</td>';
echo '<td>' . str_replace('|', '|' . PHP_EOL, $constants) . '</td>';
echo '<td>' . str_replace('|', '|' . PHP_EOL, $readonlys) . '</td>';
echo '<td>' . str_replace('|', '|' . PHP_EOL, $obsoletes) . '</td>';
echo '</tr></table>';

file_put_contents('vars.txt', implode(PHP_EOL, $var));
file_put_contents('function.txt', implode(PHP_EOL, $function));
file_put_contents('constant.txt', implode(PHP_EOL, $constant));
file_put_contents('readonly.txt', implode(PHP_EOL, $readonly));
file_put_contents('obsolete.txt', implode(PHP_EOL, $obsolete));

/*****************************************************************************/

$buildItAll = file_get_contents('sample-ace.txt');

$buildItAll = sprintf($buildItAll, $functions, $constants, $vars, $readonlys, $obsoletes, '%', '%');

file_put_contents('ace-gml.js', $buildItAll);
