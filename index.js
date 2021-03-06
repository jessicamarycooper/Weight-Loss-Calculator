//WLC
document.getElementById('results').style.display = 'none';
document.getElementById('back').style.display = 'none';

function checkreqs() {

    var reqs = document.getElementsByClassName('req');
    for (var i = 0; i < reqs.length; i++) {
        if (reqs[i].value === '') {
            return false;
        }
    }
    return true;
}



document.getElementById('submit').onclick = function() {

    if (!checkreqs()) {
        alertbox('Please fill in all the required fields.');
    } else {


        //required
        var gender;

        if (document.getElementById('f').checked) {
            gender = 'female';
        } else {
            gender = 'male';
        }



        var age = document.getElementById('age').value;
        var weight = document.getElementById('lbs').value;
        var feet = document.getElementById('feet').value;
        var inches = document.getElementById('inches').value;

        var activitylevel = document.getElementById('activitylevel').value;


        //optional
        var intendedcals = document.getElementById('intendedcals').value;

        // TODO how to handle dates?
        var finishdate = new Date(document.getElementById('finishdate').value);
        var today = new Date();

        var goalweight = document.getElementById('goalweight').value;
        var goalBMI = document.getElementById('goalBMI').value;
        var framesize = document.getElementById('framesize').value;

        //checks user's input

        if (today.getTime() > finishdate.getTime()) {
            alertbox('I wish I had a time machine too, but unfortunately your finish date cannot be in the past.');
            return false;
        } else if (inches > 11) {
            alertbox('Inches cannot be more than 11');
            return false;
        }


        var height = (Number(feet) * 12) + Number(inches);

        var frame1; // for calculating adjusted bmi
        var frame2; // for calculating adjusted goalbmi and ideal weight range

        switch (framesize) {
            case 'small':
                frame1 = 1.1;
                frame2 = 0.9;
                break;
            case 'large':
                frame1 = 0.9;
                frame2 = 1.1;
                break;
            default:
                frame1 = 1;
                frame2 = 1;
        }

        var BMI = ((weight / (height * height)) * 703) * frame1;

        var goalBMIresult = ((goalBMI * (height * height)) / 703) * frame2;

        var idealweightlow = ((18.5 * (height * height)) / 703) * frame2; //lower limit healthy bmi
        var idealweighthigh = ((25 * (height * height)) / 703) * frame2; //upper limit healthy bmi

        var BMR;
        if (gender == "male") {
            BMR = (6.25 * weight) + (12.7 * height) - (6.76 * age) + 66;
        } else {
            BMR = (4.35 * weight) + (4.7 * height) - (4.68 * age) + 655;
        }

        var TDEE = BMR * activitylevel;

        var lose1 = TDEE - 250; //lose 0.5lbs per week
        var lose2 = TDEE - 500; //lose 1lb p/w
        var lose3 = TDEE - 1000; //lose 2lbs p/w


        var daystofinishdate = (finishdate.getTime() / 86400000) - (today.getTime() / 86400000);

        var daystoreachgoal = ((weight - goalweight) * 3500) / (TDEE - intendedcals);
        var dategoalreached = new Date();

        dategoalreached.setTime(today.getTime() + (daystoreachgoal * 86400000));

        var finishdateweight = weight - (((TDEE - intendedcals) * daystofinishdate) / 3500);

        var calstoreachgoal = TDEE - (((weight - goalweight) * 3500) / daystofinishdate);


        var idealweightrange = '<div class="result">Your ideal weight range is between ' + Math.round(idealweightlow * 10) / 10 + ' lbs and ' + Math.round(idealweighthigh * 10) / 10 + ' lbs.</div>';

        var BMIresults = '<div class="result">Your current BMI is ' + Math.round(BMI * 10) / 10 + '.</div>';

        var BMRresults = '<div class="result">Your BMR is ' + Math.round(BMR) + ' calories per day.</div>';

        var TDEEresults = '<div class="result">Your TDEE is ' + Math.round(TDEE) + ' calories per day.</div>';

        var tolose = '<div class="result">To lose 0.5 lbs per week, consume ' + Math.round(lose1) + ' calories per day.<br> To lose 1 lb per week, consume ' + Math.round(lose2) + ' calories per day.<br>To lose 2 lbs per week, consume ' + Math.round(lose3) + ' calories per day.</div>';





        //goalBMI
        var goalBMIresults;
        if (goalBMI === '') {
            goalBMIresults = '';
        } else {
            goalBMIresults = '<div class="result">To achieve your goal BMI of ' + goalBMI + ' you would need to weigh ' + Math.round(goalBMIresult * 10) / 10 + ' lbs.</div>';
        }


        /////////////// NEW PREDICTOR
        var predictgoaldate;

        if (intendedcals === '' || goalweight === '') {
            predictgoaldate = '';
        } else if (dategoalreached.getTime() < today.getTime()) {
            predictgoaldate = '<div class="result pre">If you consume ' + intendedcals + ' calories per day, you will never reach your goal weight of ' + goalweight + ' lbs' + '.</div>';
        } else {
            predictgoaldate = '<div class="result pre">If you consume ' + intendedcals + ' calories per day, you will reach your goal weight of ' + goalweight + ' lbs on ' + dategoalreached.toDateString() + '.</div>';
        }

        var predictweightondate;

        if (intendedcals === '' || isNaN(finishdate)) { // check if finish date is valid
            predictweightondate = '';
        } else {
            predictweightondate = '<div class="result pre">If you consume ' + intendedcals + ' calories per day, on ' + finishdate.toDateString() + ' you will weigh ' + Math.round(finishdateweight * 10) / 10 + ' lbs.</div>';
        }

        var toreachgoal;
        if (isNaN(finishdate) || goalweight === '') {
            toreachgoal = '';
        } else {
            toreachgoal = '<div class="result pre">To weigh ' + goalweight + ' lbs on ' + finishdate.toDateString() + ' you would need to consume ' + Math.round(calstoreachgoal) + ' calories per day.</div>';
        }

        var predictor = predictgoaldate + predictweightondate + toreachgoal;

        /////////////// 


        var zigzag;
        var macros;
        if (intendedcals === '') {
            zigzag = '';
            macros = '';
        } else {
            zigzag = '<div class="result">Zig Zag Diet Planner<br><br>Day 1 calories: ' + Math.round(intendedcals * 1.4) + '<br>Day 2 calories: ' + Math.round(intendedcals * 0.5) + '<br>Day 3 calories: ' + Math.round(intendedcals * 1.2) + '<br>Day 4 calories: ' + Math.round(intendedcals * 0.9) + '<br>Day 5 calories: ' + Math.round(intendedcals * 1.3) + '<br>Day 6 calories: ' + Math.round(intendedcals * 0.7) + '<br>Day 7 calories: ' + Math.round(intendedcals) + '</div>';


            var losefat = '<br>Low Carb:<br><br>' + Math.round(intendedcals * 0.2) + ' calories or ' + Math.round((intendedcals * 0.2) / 4) + ' grams of carbohydrate per day.<br>' + Math.round(intendedcals * 0.45) + ' calories or ' + Math.round((intendedcals * 0.45) / 4) + ' grams of protein per day.<br>' + Math.round(intendedcals * 0.35) + 'calories or ' + Math.round((intendedcals * 0.35) / 9) + ' grams of fat per day.<br>';

            var maintain = '<br>Moderate:<br><br>' + Math.round(intendedcals * 0.4) + ' calories or ' + Math.round((intendedcals * 0.4) / 4) + ' grams of carbohydrate per day.<br>' + Math.round(intendedcals * 0.3) + ' calories or ' + Math.round((intendedcals * 0.3) / 4) + ' grams of protein per day.<br>' + Math.round(intendedcals * 0.3) + 'calories or ' + Math.round((intendedcals * 0.3) / 9) + ' grams of fat per day.<br>';


            var buildmuscle = '<br>Low Fat:<br><br>' + Math.round(intendedcals * 0.5) + ' calories or ' + Math.round((intendedcals * 0.5) / 4) + ' grams of carbohydrate per day.<br>' + Math.round(intendedcals * 0.3) + ' calories or ' + Math.round((intendedcals * 0.3) / 4) + ' grams of protein per day.<br>' + Math.round(intendedcals * 0.2) + ' calories or ' + Math.round((intendedcals * 0.2) / 9) + ' grams of fat per day.<br>';

            macros = '<div class="result">Macro Planner (Based on your intended calorie intake)<br>' + losefat + maintain + buildmuscle + '<br>';
        }

        var fivetwo = '<div class="result">5:2 Diet Planner<br><br>Two low calorie days of ' + Math.round(TDEE * 0.25) + ' calories per day<br>Five normal calorie days of ' + Math.round(TDEE) + ' calories per day.</div>';

        var conf = '<div class="result conf">You said that you are ' + gender + ', ' + feet + 'ft ' + inches + 'in tall, ' + age + ' years old and weigh ' + weight + 'lbs.</div>';


        var results = conf + idealweightrange + BMIresults + goalBMIresults + BMRresults + TDEEresults + tolose + predictor + zigzag + fivetwo;


        document.getElementById('results').innerHTML = results;
        //puts results in container

        document.getElementById('input').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        document.getElementById('back').style.display = 'block';
        document.body.scrollTop = document.documentElement.scrollTop = 200;
    }
};

document.getElementById('back').onclick = function() {
    document.getElementById('input').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('back').style.display = 'none';
    document.body.scrollTop = document.documentElement.scrollTop = 200;
};

//reloads everything
document.getElementById('clear').onclick = function() {
    history.go(0);
};



function alertbox(alert) {
    document.body.scrollTop = document.documentElement.scrollTop = 200;
    var alertbox = document.getElementById('alertbox');
    alertbox.innerHTML = alert;
    alertbox.style.display = 'block';

}

