var magnitudeText = document.querySelector("#magnitude")
var coordinateText = document.querySelector("#coordinate")
var cod_fieldText = document.querySelector("#cod_field")


var add_btn = document.querySelector("#add_btn")
var cal_btn = document.querySelector("#cal_btn")

var ctable = document.querySelector("#ctable")
var charge = document.querySelector("#charge")

var type = document.querySelector("#type");
var total = document.querySelector("#total")
var label_fx = document.querySelector("#label_fx")
var label_fy = document.querySelector("#label_fy")
var label_fz = document.querySelector("#label_fz")

var listCharges = []
var last_id = 0;


const ke = 8987551787;
const mc = Math.pow(10, -6);
let calResult;




class Charge {

    constructor(_magnitude, _coordinate) {
        this.magnitude = _magnitude;
        this.coordinate = _coordinate;
    }
}




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

function addOptionCharge(id) {
    charge.append(new Option(`q${id}`, id - 1));
    // $('#charge').find('option').remove().end()
}

function addValues(mag, coor) {

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
    // console.log(mag);
    // console.log(coordinate);


    let charge = new Charge(pfl(mag), coordinate);
    listCharges.push(charge);


    console.log("Agregar carga");
    reloadTable();

}


// Formulas
function calStrength() {
    let charge_id = charge.value;
    let charge_to_cal = listCharges[charge_id];
    let other_charge = listCharges.filter(elem => elem !== charge_to_cal);


    let R12x = 0;
    let R12y = 0;
    let R12z = 0;
    let R12 = 0;
    other_charge.forEach((element) => {
        let q1 = charge_to_cal;
        let q1_co = q1.coordinate
        let q2 = element;
        let q2_co = q2.coordinate;

        let xco = q1_co.X - q2_co.X;
        let yco = q1_co.Y - q2_co.Y;
        let zco = q1_co.Z - q2_co.Z;


        let distance = Math.pow(xco, 2.0) + Math.pow(yco, 2.0) + Math.pow(zco, 2.0);
        let r = Math.sqrt(distance);
        let a = ke * (q1.magnitude * mc) * (q2.magnitude * mc) / Math.pow(r, 3);


        R12x += a * (q2_co.X - q1_co.X);
        R12y += a * (q2_co.Y - q1_co.Y);
        R12z += a * (q2_co.Z - q1_co.Z);

    });

    R12 = Math.sqrt(Math.pow(R12x, 2) + Math.pow(R12y, 2) + Math.pow(R12z, 2));

    calResult = {
        "FX": R12x,
        "FY": R12y,
        "FZ": R12z,
        "R12": R12,
    };

    return calResult;
}

function calElectricField() {



    let values = cod_fieldText.value.split(",");
    console.log(values.length);
    if (values.length < 3) {
        alert("Por favor, digite la coordenadas correctamente!");
        calResult = {
            "FX": 0,
            "FY": 0,
            "FZ": 0,
            "R12": 0,
        };
        return calResult;
    }

    let coordinate = {
        X: pfl(values[0]),
        Y: pfl(values[1]),
        Z: pfl(values[2])
    }


    let R12x = 0;
    let R12y = 0;
    let R12z = 0;
    let R12 = 0;

    listCharges.forEach((element) => {
        let q1 = element;
        let q1_co = q1.coordinate
        let q2_co = coordinate;


        let xco = q1_co.X - q2_co.X;
        let yco = q1_co.Y - q2_co.Y;
        let zco = q1_co.Z - q2_co.Z;

        let distance = Math.pow(xco, 2) + Math.pow(yco, 2) + Math.pow(zco, 2);
        let r = Math.sqrt(distance);
        let a = ke * (q1.magnitude * mc) / Math.pow(r, 3);


        R12x += (a * (q1_co.X - q2_co.X))
        R12y += (a * (q1_co.Y - q2_co.Y))
        R12z += (a * (q1_co.Z - q2_co.Z))

    });

    R12 = Math.sqrt(Math.pow(R12x, 2) + Math.pow(R12y, 2) + Math.pow(R12z, 2));

    calResult = {
        "FX": R12x,
        "FY": R12y,
        "FZ": R12z,
        "R12": R12,
    };

    return calResult;
}

function calEnergy() {
    var list_elements = [];

    getAllPossibleCombinations(listCharges, 2, list_elements);

    let R12 = 0;
    let R12r = 0;

    list_elements.forEach((element) => {
        let q1 = element[0];
        let q1_co = q1.coordinate;
        let q2 = element[1];
        let q2_co = q2.coordinate;


        let xco = q1_co.X - q2_co.X;
        let yco = q1_co.Y - q2_co.Y;
        let zco = q1_co.Z - q2_co.Z;

        let distance = Math.pow(xco, 2) + Math.pow(yco, 2) + Math.pow(zco, 2);
        let r = Math.sqrt(distance);
        let a = ke * (q1.magnitude * mc) * (q2.magnitude * mc) / r;
        R12r += a;

    });

    R12 = R12r;

    calResult = {
        "FX": 0,
        "FY": 0,
        "FZ": 0,
        "R12": R12,
    };

    return calResult;
}


function calPotencial() {

    let R12 = 0;
    let R12r = 0;

    let values = cod_fieldText.value.split(",");
    if (values.length < 3) {
        alert("Por favor, digite la coordenadas correctamente!");
        calResult = {
            "FX": 0,
            "FY": 0,
            "FZ": 0,
            "R12": 0,
        };
        return calResult;
    }


    let coo = {
        X: pfl(values[0]),
        Y: pfl(values[1]),
        Z: pfl(values[2])
    }

    listCharges.forEach((element) => {
        let q1 = element;


        let distance = Math.pow(coo.X, 2) + Math.pow(coo.Y, 2) + Math.pow(coo.Z, 2);
        let r = Math.sqrt(distance);
        let a = ke * (q1.magnitude * mc) / r;
        R12r += a;

    });

    R12 = R12r;

    calResult = {
        "FX": 0,
        "FY": 0,
        "FZ": 0,
        "R12": R12,
    };

    return calResult;
}




add_btn.addEventListener("click", () => {

    let mag = magnitudeText.value.replace(/[^0-9.-]/g, "");
    let coor = coordinateText.value.replace(/[^0-9.,-]/g, "");


    addValues(mag, coor);
});

cal_btn.addEventListener("click", () => {


    if (listCharges.length < 2) {

        alert("Deben de haber mas de dos cargar")
        return;

    }

    let result, f, v;
    switch (type.value) {


        case "fuerza":
            result = calStrength();
            f = 'F'
            v = 'N'
            break;

        case "campo":
            result = calElectricField();
            f = 'E'
            v = 'N/C'
            break;

        case "energia":
            result = calEnergy();
            f = 'U'
            v = 'J'
            break;

        case "potencial":
            result = calPotencial();
            f = 'V'
            v = 'J/C'
            break;
    }


    let id = charge ? parseInt(charge.value) + 1 : '';

    if (type.value == "fuerza" || type.value == "campo") {
        label_fx.innerHTML = `${f}X${id}: ${result.FX}`
        label_fy.innerHTML = `${f}Y${id}: ${result.FY}`
        label_fz.innerHTML = `${f}Z${id}: ${result.FZ}`
        total.innerHTML = `${f}q${id}: ${result.R12}${v}`

    } else {
        total.innerHTML = `${f}: ${result.R12}${v}`
    }


});



//Test
function makeTest() {

    // addValues("8", "0,0,0");
    // addValues("4.5", "0.1,0.173,0");
    // addValues("-3", "0.2,0,0");

    addValues("8", "2,1,1");
    addValues("10", "1,2,3");
}
//makeTest();