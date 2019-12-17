<?php
	error_reporting(0);
	$mail = 'your_mail@gmail.com';
	$subject='Заказ термобелья Columbia';
	$echo_msg = 'Мы вам перезвоним в ближайшее время';
	$message = "<h1>Заказ термобелья Columbia</h1>
	<table>
		<tr>
			<td>Клиент:</td>
			<td><b> $_POST['name'] </b></td>
		</tr>
		<tr>
			<td>Телефон:</td>
			<td><b> $_POST['phone'] </b></td>
		</tr>
	</table>";
	mail($mail, $subject, $message, 'Content-type: text/html; charset=utf-8 \r\n');
	echo $echo_msg;
