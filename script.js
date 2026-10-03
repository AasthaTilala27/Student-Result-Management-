let students = JSON.parse(localStorage.getItem("students")) || [];
document.getElementById("studentForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("studentName").value.trim();
    let rollNo = document.getElementById("rollNo").value.trim();
    let course = document.getElementById("course").value;

    let math = Number(document.getElementById("math").value);
    let science = Number(document.getElementById("science").value);
    let english = Number(document.getElementById("english").value);

    if (math < 0 || math > 100 ||
        science < 0 || science > 100 ||
        english < 0 || english > 100) {

        alert("Marks must be between 0 and 100");
        return;
        }

    let total = math + science + english;
    let percentage = total / 3;
    let status;

    if (math >= 35 && science >= 35 && english >= 35) {
        status = "Pass";
    }
    else {
        status = "Fail";
    }
    let grade;

    if (status == "Fail") {
        grade = "F";
    }
    else if (percentage >= 80) {
        grade = "A";
    }
    else if (percentage >= 70) {
        grade = "B";
    }
    else if (percentage >= 60) {
        grade = "C";
    }
    else if (percentage >= 50) {
        grade = "D";
    }
    else {
        grade = "E";
    }

    let editId = document.getElementById("editId").value;


    if (editId != "") {

        let student = students.find(function(student) {
            return student.id == editId;
        });

        student.name = name;
        student.rollNo = rollNo;
        student.course = course;
        student.math = math;
        student.science = science;
        student.english = english;
        student.total = total;
        student.percentage = percentage;
        student.grade = grade;
        student.status = status;
    }
    else {

        let student = {
            id: Date.now(),
            name: name,
            rollNo: rollNo,
            course: course,
            math: math,
            science: science,
            english: english,
            total: total,
            percentage: percentage,
            grade: grade,
            status: status
        };

        students.push(student);
    }
    saveData();
    resetForm();
    displayStudents();
});


function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";
    let search = document.getElementById("searchInput").value.toLowerCase();
    let course = document.getElementById("courseFilter").value;
    let sort = document.getElementById("sortSelect").value;

    let filteredStudents = students.filter(function(student) {

        let nameMatch = student.name.toLowerCase().includes(search);

        let rollMatch = student.rollNo.toLowerCase().includes(search);

        let courseMatch = course == "All" || student.course == course;

    });

    if (sort == "high") {

        filteredStudents.sort(function(a, b) {
            return b.percentage - a.percentage;
        });

    }
    else if (sort == "low") {
        filteredStudents.sort(function(a, b) {
            return a.percentage - b.percentage;
        });
    }

    filteredStudents.forEach(function(student) {
        let gradeClass = "grade-" + student.grade.toLowerCase();
        let statusClass;
        if (student.status == "Pass") {
            statusClass = "pass";
        }
        else {
            statusClass = "fail";
        }
        let row = `
        
        <tr>

            <td>${student.rollNo}</td>
            <td>
                <b>${student.name}</b>
            </td>

            <td>${student.course}</td>

            <td>${student.math}</td>

            <td>${student.science}</td>

            <td>${student.english}</td>

            <td>
                <b>${student.total}</b>
            </td>

            <td>
                ${student.percentage.toFixed(1)}%
            </td>

            <td>
                <span class="grade ${gradeClass}">
                    ${student.grade}
                </span>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(${student.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>
                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${student.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>
            </td>
        </tr>
        `;
        table.innerHTML += row;
    });

    updateDashboard();
}

function editStudent(id) {

    let student = students.find(function(student) {
        return student.id == id;
    });

    if (!student) {
        return;
    }

    document.getElementById("editId").value = student.id;
    document.getElementById("studentName").value = student.name;
    document.getElementById("rollNo").value = student.rollNo;
    document.getElementById("course").value = student.course;
    document.getElementById("math").value = student.math;
    document.getElementById("science").value = student.science;
    document.getElementById("english").value = student.english;
    document.getElementById("formTitle").innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i> Edit Result';
}
function deleteStudent(id) {

    let answer = confirm("Are you sure you want to delete this student?");


    if (answer == true) {

        students = students.filter(function(student) {
            return student.id != id;
        });
        saveData();
        displayStudents();
    }

}

function resetForm() {

    document.getElementById("studentForm").reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i> Add / Edit Result';
}

function openForm() {

    resetForm();
    document.getElementById("studentName").focus();
}

function updateDashboard() {

    let totalStudents = students.length;
    let passed = students.filter(function(student) {
        return student.status == "Pass";
    }).length;
    let failed = students.filter(function(student) {
        return student.status == "Fail";
    }).length;
    let totalPercentage = 0;
    students.forEach(function(student) {
        totalPercentage = totalPercentage + student.percentage;
    });


    let average = 0;

    if (totalStudents > 0) {
        average = totalPercentage / totalStudents;
    }
    document.getElementById("totalStudents").innerText =
        totalStudents;
    document.getElementById("passedStudents").innerText =
        passed;
    document.getElementById("failedStudents").innerText =
        failed;
    document.getElementById("averagePercentage").innerText =
        average.toFixed(1) + "%";

    let passRate = 0;

    if (totalStudents > 0) {
        passRate = (passed / totalStudents) * 100;
    }

    let failRate = 0;
    if (totalStudents > 0) {
        failRate = (failed / totalStudents) * 100;
    }
    document.getElementById("passRate").innerText =
        passRate.toFixed(1) + "% pass rate";

    document.getElementById("failRate").innerText =
        failRate.toFixed(1) + "% failed";

    updateChart();

}


function updateChart() {

    if (students.length == 0) {

        document.getElementById("mathBar").style.height = "5px";
        document.getElementById("scienceBar").style.height = "5px";
        document.getElementById("englishBar").style.height = "5px";
        document.getElementById("averageBar").style.height = "5px";
        return;
    }


    let mathTotal = 0;
    let scienceTotal = 0;
    let englishTotal = 0;
    let percentageTotal = 0;


    students.forEach(function(student) {

        mathTotal = mathTotal + student.math;
        scienceTotal = scienceTotal + student.science;
        englishTotal = englishTotal + student.english;
        percentageTotal =
            percentageTotal + student.percentage;

    });

    let mathAverage = mathTotal / students.length;
    let scienceAverage = scienceTotal / students.length;
    let englishAverage = englishTotal / students.length;
    let overallAverage =
        percentageTotal / students.length;
    document.getElementById("mathBar").style.height =
        mathAverage + "%";
    document.getElementById("scienceBar").style.height =
        scienceAverage + "%";
    document.getElementById("englishBar").style.height =
        englishAverage + "%";
    document.getElementById("averageBar").style.height =
        overallAverage + "%";

}

displayStudents();