<?php
$amount = 10.00;
$ref = "HFCB" . time();
$qrData = "PAYMENT|REF:$ref|AMOUNT:$amount";
?>

<!DOCTYPE html>
<html>
<body style="text-align:center;">

<h1>Scan to Pay</h1>
<p>Ref: <?php echo $ref; ?></p>
<p>Amount: $<?php echo $amount; ?></p>

<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=<?php echo urlencode($qrData); ?>">

</body>
</html>
