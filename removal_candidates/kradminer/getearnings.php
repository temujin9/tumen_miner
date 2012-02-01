<?php 
require_once(dirname(__FILE__) . '/mp/common.inc.php');




$payout_address = $_POST['pa'];

if (strlen($payout_address) == 34) {

	$pdo = db_connect();
	$worker_name = "worker_" . $payout_address;





// Refind


        $q = $pdo->prepare('
            SELECT id, name, password

            FROM worker

            WHERE name = :worker_name
        ');

        $q->execute(array(':worker_name' => $worker_name));

        $row = $q->fetch(PDO::FETCH_ASSOC);
        
        $worker_id = $row['id'];
        

// Earnings

        $q = $pdo->prepare('
            SELECT id, worker_id, result

            FROM submitted_work

            WHERE worker_id = :worker_id AND paid = 0
        ');

        $q->execute(array(':worker_id' => $worker_id));

        //$earnings = (($q->rowCount() / 2) * 0.000184) . " BTC";
		$earnings = ($q->rowCount() / 2);
        //$worker_id = $row['id'];




	json_success(true, $earnings);

} else {

	json_success(false, 666);
	
}

?>
