<?php
$arquivo = "posicoes.json";
if (file_exists($arquivo)) {
    echo file_get_contents($arquivo);
} else {
    echo json_encode([]);
}
