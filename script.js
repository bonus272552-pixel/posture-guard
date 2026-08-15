// ================================
// POSTURE GUARD - ระบบหลัก
// ================================

// ข้อมูล Sensor จำลอง
let sensorData = {
    screenDistance: 65,
    backDistance: 2
};

// ค่ามาตรฐานที่ได้จากการ Calibration
let correctPosture = {
    screenDistance: 65,
    backDistance: 2
};

// สถิติ
let statistics = {
    alerts: 17,
    tooClose: 5,
    tooFar: 3,
    badBack: 9
};


// ================================
// เปลี่ยนหน้า
// ================================

function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }
}


// ================================
// วิเคราะห์ท่านั่ง
// ================================

function checkPosture() {

    const screen = sensorData.screenDistance;
    const back = sensorData.backDistance;

    let status = "ปกติ";
    let message = "ท่านั่งของคุณอยู่ในตำแหน่งที่เหมาะสม";
    let score = 100;

    // ตรวจระยะจากหน้าจอ
    if (screen < 60) {

        status = "ควรปรับ";
        message = "คุณนั่งใกล้หน้าจอเกินไป";

        score -= 20;

    } else if (screen > 70) {

        status = "ควรปรับ";
        message = "คุณนั่งห่างจากหน้าจอเกินไป";

        score -= 15;
    }


    // ตรวจระยะหลังกับพนักพิง
    if (Math.abs(back - correctPosture.backDistance) > 3) {

        status = "ไม่เหมาะสม";
        message = "ตำแหน่งหลังของคุณไม่ตรงกับค่าที่ตั้งไว้";

        score -= 30;
    }


    // ไม่ให้คะแนนต่ำกว่า 0
    if (score < 0) {
        score = 0;
    }


    // เปลี่ยนสถานะบนหน้าเว็บ
    document.getElementById("postureStatus").textContent = status;

    document.getElementById("postureMessage").textContent = message;

    document.getElementById("score").textContent = score;


    // เปลี่ยนสีไอคอน
    const icon = document.querySelector(".status-icon");

    if (status === "ปกติ") {

        icon.textContent = "🟢";

    } else if (status === "ควรปรับ") {

        icon.textContent = "🟡";

    } else {

        icon.textContent = "🔴";
    }


    // คำแนะนำ
    const advice = document.getElementById("adviceText");

    if (status === "ปกติ") {

        advice.textContent =
            "ท่านั่งของคุณดีมาก รักษาตำแหน่งนี้ไว้!";

    } else if (screen < 60) {

        advice.textContent =
            "ลองเลื่อนเก้าอี้ออกจากหน้าจอเล็กน้อย";

    } else if (screen > 70) {

        advice.textContent =
            "ลองขยับเข้าใกล้หน้าจออีกเล็กน้อย";

    } else {

        advice.textContent =
            "ลองพิงหลังให้ใกล้กับตำแหน่งที่ตั้งไว้";
    }
}


// ================================
// อัปเดตข้อมูล Sensor
// ================================

function updateSensorData(screenDistance, backDistance) {

    sensorData.screenDistance = screenDistance;
    sensorData.backDistance = backDistance;


    // แสดงค่าบน Dashboard
    document.getElementById("screenDistance").textContent =
        screenDistance;

    document.getElementById("backDistance").textContent =
        backDistance;


    // วิเคราะห์ท่านั่งใหม่
    checkPosture();
}


// ================================
// Calibration
// ================================

function startCalibration() {

    const countdown =
        document.getElementById("countdown");

    let number = 3;

    countdown.textContent = number;


    const timer = setInterval(function() {

        number--;

        if (number > 0) {

            countdown.textContent = number;

        } else {

            clearInterval(timer);

            countdown.textContent =
                "✅ บันทึกค่าแล้ว!";


            // บันทึกค่าปัจจุบัน
            correctPosture.screenDistance =
                sensorData.screenDistance;

            correctPosture.backDistance =
                sensorData.backDistance;


            // แสดงค่าที่บันทึก
            const result =
                document.getElementById("calibrationResult");

            result.innerHTML = `
                <h3>✅ ตั้งค่าสำเร็จ</h3>

                <p>
                    📏 ระยะจากหน้าจอ:
                    <b>${correctPosture.screenDistance} cm</b>
                </p>

                <p>
                    🪑 ระยะหลัง–พนักพิง:
                    <b>${correctPosture.backDistance} cm</b>
                </p>

                <p>
                    ค่านี้ถูกบันทึกเป็น
                    <b>ท่านั่งมาตรฐานของคุณ</b>
                </p>
            `;
        }

    }, 1000);
}


// ================================
// จำลอง Sensor
// ================================

// ทุก 5 วินาที เปลี่ยนค่าจำลอง
// เพื่อให้เห็นว่าเว็บสามารถตรวจท่านั่งได้

setInterval(function() {

    const randomScreen =
        Math.floor(Math.random() * 21) + 55;

    const randomBack =
        Math.floor(Math.random() * 7);

    updateSensorData(
        randomScreen,
        randomBack
    );

}, 5000);


// ================================
// เริ่มต้นระบบ
// ================================

checkPosture();
