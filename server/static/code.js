var magnitudeText = document.querySelector("#magnitude")
var coordinateText = document.querySelector("#coordinate")
var add_btn = document.querySelector("#add_btn")
var cal_btn = document.querySelector("#cal_btn")

var ctable = document.querySelector("#ctable")
var charge = document.querySelector("#charge")
var total = document.querySelector("#total")
var listCharges = []
var last_id = 0;




var pfl = function (n) {
    return parseFloat(n)
}

add_btn.addEventListener("click", () => {

    let mag = magnitudeText.value.replace(/[^0-9.-]/g, "");
    let coor = coordinateText.value.replace(/[^0-9.,-]/g, "");



    let values = coor.split(",");
    if (!values.length == 3) {
        alert("la coordenada esta mal digitadad")
        return;
    }


    let coordinate = {
        X: pfl(values[0]),
        Y: pfl(values[1]),
        Z: pfl(values[2])
    }
    console.log(mag);
    console.log(coordinate);


    let charge = new ElectricCharge(pfl(mag), coordinate);
    listCharges.push(charge);


    console.log("Agregar carga");
    reloadTable();
});

function reloadTable() {

    $("#ctable").find("tr:gt(0)").remove();
    $('#charge').find('option').remove().end()

    listCharges.forEach((charge, index) => {
        let id = index + 1
        let row = ctable.insertRow(id)
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        let co = charge.coordinate
        let ma = charge.magnitude

        cell1.innerHTML = `q${id}`;
        cell2.innerHTML = ma;
        cell3.innerHTML = `${co.X},${co.Y},${co.Z}`;

        addOptionCharge(id);
    })

}

addOptionCharge = function (id) {
    charge.append(new Option(`q${id}`, id - 1));
    // $('#charge').find('option').remove().end()
}


class ElectricCharge {

    constructor(_magnitude, _coordinate) {
        this.magnitude = _magnitude;
        this.coordinate = _coordinate;
    }
}

reloadTable();






cal_btn.addEventListener("click", () => {

    if (listCharges.length < 2) {

        alert("Deben de haber mas de dos cargar para calcular la fuerza")
        return;

    }


    let cstren = calStrength().toFixed(3);
    let id= parseInt(charge.value) +1;
    total.innerHTML= `Fq${id}: ${cstren}N`

})

const ke = 8987551787;
const mc = Math.pow(10, -6);
let cstreng = 0.0;

function calStrength() {

    let charge_id = charge.value;
    let charge_to_cal = listCharges[charge_id];
    let other_charge = listCharges.filter(elem => elem !== charge_to_cal);


    let F12x = 0;
    let F12y = 0;
    let F12z = 0;
    let F12 = 0;

    other_charge.forEach((element) => {
        let q1 = charge_to_cal;
        let q1_co = q1.coordinate
        let q2 = element;
        let q2_co = q2.coordinate;


        let distance = Math.pow((q1_co.X - q2_co.X), 2) + Math.pow((q1_co.X - q2_co.X), 2) + Math.pow((q1_co.Z - q2_co.Z), 2);
        let r = Math.sqrt(distance);
        let a = ke * (q1.magnitude * mc) * (q2.magnitude * mc) / Math.pow(r, 3);


        F12x += a * (q2_co.X - q1_co.X);
        F12y += a * (q2_co.Y - q1_co.Y);
        F12z += a * (q2_co.Z - q1_co.Z);

    });

    F12 = Math.sqrt(Math.pow(F12x, 2) + Math.pow(F12y, 2) + Math.pow(F12z, 2));
    cstreng = F12;
    return cstreng;
}