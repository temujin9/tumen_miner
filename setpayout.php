<?php 
require_once(dirname(__FILE__) . '/mp/common.inc.php');




$payout_address = $_POST['pa'];

if (strlen($payout_address) > 25) {

	$pdo = db_connect();
	$worker_name = "worker_" . $payout_address;


// Insert
	                $q = $pdo->prepare('
                    INSERT INTO worker

                    (name, password)
                        VALUES
                    (:name, :password)
                ');

                $q_args = array(
                    ':name'     => $worker_name,
                    ':password' => "REPLACEME"
                );
            

            $result = $q->execute($q_args);


// Refind


        $q = $pdo->prepare('
            SELECT id, name, password

            FROM worker

            WHERE name = :worker_name
        ');

        $q->execute(array(':worker_name' => $worker_name));

        $row = $q->fetch(PDO::FETCH_ASSOC);
        
        $worker_id = $row['id'];
        
// Setpool

        $q = $pdo->prepare('
            INSERT INTO worker_pool

            (pool_id, worker_id, pool_username, pool_password, priority, enabled)
                VALUES
            (:pool_id, :worker_id, :pool_username, :pool_password, :priority, :enabled)

        ');

//if ($worker_id % 2) {
if (true) {
        $result = $q->execute(array(
            ':pool_id'           => 2,
            ':worker_id'         => $worker_id,
            ':pool_username'     => "kradminer.worker1",
            ':pool_password'     => "REPLACEME",

            ':priority'          => 4,

            ':enabled'           => 1));
            
          } else {  
            
        $result = $q->execute(array(
            ':pool_id'           => 1,
            ':worker_id'         => $worker_id,
            ':pool_username'     => "REPLACEME",
            ':pool_password'     => "REPLACEME",

            ':priority'          => 4,

            ':enabled'           => 1));
           } 

// Earnings

        $q = $pdo->prepare('
            SELECT id, worker_id, result

            FROM submitted_work

            WHERE worker_id = :worker_id
        ');

        $q->execute(array(':worker_id' => $worker_id));

        $earnings = $q->rowCount();
        
        //$worker_id = $row['id'];




	json_success(true, $earnings);

} else {

	json_success(false, 666);
	
}

?>
