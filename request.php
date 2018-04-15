<?php

    function generateRandomString($length = 10) {
        $characters = 'bcdefghijklmnopqrstuvwxyz';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $errorArray = array();

    if(!isset($data['ageFrom']) || $data['ageFrom'] <= 0) {
        array_push($errorArray, "Нижняя граница возраста должна быть определёна и не может быть меньше или равена 0");
    }

    if(!isset($data['ageTo'])) {
        array_push($errorArray, "Верхняя граница возраста должна быть определёна");
    }

    if($data['ageTo'] < $data['ageFrom']) {
        array_push($errorArray, "Верхняя граница возраста не может быть меньше нижней");
    }

    if(!isset($data['employeeCount'])) {
        array_push($errorArray, "Необходимо задать количество отображаемых сотрудников");
    }

    if(count($errorArray) != 0) {
        http_response_code(409);

        echo json_encode((object)$errorArray);

        return;
    }

    $employeeCount = $data['employeeCount'];
    $employeeResult = array();

    for ($i = 1; $i <= $employeeCount; $i++) {
        $num0 = (rand(900, 999));
        $num1 = (rand(100, 999));
        $num2 = (rand(10, 99));
        $num3 = (rand(10, 99));

        $randPhone = "+7" . " (" . $num0 . ")" . "-" . $num1 ."-" . $num2 . "-" . $num3;
        $randomName = generateRandomString(6);

        $employeeItem = array(
            "fio" => $randomName . " " . $randomName . " " . $randomName,
            "age" => rand($data['ageFrom'], $data['ageTo']),
            "sex" => $data['sex'] == 0 ? "M" : "Ж",
            "phone" => $randPhone
        );

        array_push($employeeResult, (object)$employeeItem);
    }

    header('Content-Type: application/json');

    echo json_encode($employeeResult);
?>