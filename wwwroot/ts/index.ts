import $ from "jQuery";


$(function () {
    let routes: Map<string, () => void> = new Map<string, () => void>();
    const apiKey: string = "13bc28fb46-8d0fcd7abf-rkkq1l";

    routes.set("/Currence-Converter/pages/index.html", () => {
        let currences: string[] = [];
        let $convertBtn = $("#convertBtn");
        let $resetBtn = $("#resetBtn");
        let $firstTypeSelect = $("#firstTypeSelect");
        let $secondTypeSelect = $("#secondTypeSelect");
        let $userValue = $("#amount");
        let $finalAmountDiv = $("#finalAmount");
        let $result = $("#finalValue");
        $finalAmountDiv.hide();

        // get all currences
        $.get(`https://api.fastforex.io/currencies?api_key=${apiKey}`).done((data) => {
            $firstTypeSelect.empty();
            $secondTypeSelect.empty();

            Object.getOwnPropertyNames(data["currencies"]).forEach(elem => {
                if (elem != 'AMD') {
                    $firstTypeSelect.append(`<option>${elem} - ${data["currencies"][elem]}</option>`)
                    currences.push(`${elem} - ${data["currencies"][elem]}`)
                }
            });

            Object.getOwnPropertyNames(data["currencies"]).forEach(elem => {
                if (elem != $firstTypeSelect.val().toString().substring(0, 3) && elem != 'AMD') {
                    $secondTypeSelect.append(`<option>${elem} - ${data["currencies"][elem]}</option>`)
                }
            });
        });

        $firstTypeSelect.on("click", (e) => {

            $secondTypeSelect.empty();
            currences.forEach(elem => {
                if (elem != $firstTypeSelect.val().toString() && elem != 'AMD') {
                    $secondTypeSelect.append(`<option>${elem}</option>`)
                }
            });
        });

        $convertBtn.on("click", (e) => {

            let first = $firstTypeSelect.val().toString().substring(0, 3);
            let second = $secondTypeSelect.val().toString().substring(0, 3);
            $.get(`https://api.fastforex.io/convert?from=${first}&to=${second}&amount=${$userValue.val().toString()}&api_key=${apiKey}`).done((data) => {
                $finalAmountDiv.show();
                $result.text(data["result"][`${second}`]);
            });
        });

        $resetBtn.on("click", (e) => {
            $finalAmountDiv.hide();
            $userValue.val('')
        });

    });

    let result = routes.get(window.location.pathname);

    if (result !== undefined) {
        result();
    }
});

