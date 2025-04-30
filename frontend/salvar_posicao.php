<?php
$data = json_decode(file_get_contents("php://input"), true);
if ($data && isset($data["id"], $data["lat"], $data["lng"])) {
    $arquivo = "posicoes.json";
    $posicoes = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];

    // Atualiza a posição do usuário
    $posicoes[$data["id"]] = [
        "lat" => $data["lat"],
        "lng" => $data["lng"],
        "tipo" => $data["tipo"],
        "hora" => time()
    ];

    file_put_contents($arquivo, json_encode($posicoes));
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Dados inválidos"]);
}
