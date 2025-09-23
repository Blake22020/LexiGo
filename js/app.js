let profileUser = {};
const preventDefault = (e) => e.preventDefault();
const disableScroll = () => document.addEventListener('touchmove', preventDefault, { passive: false }); // "Никакой прокрутки!"
const enableScroll = () => document.removeEventListener('touchmove', preventDefault, { passive: false }); // "Продолжаем прокрутку!"


class Lesson {
    constructor(reason, time, level, question, options, answer) {
        this.reason = reason,
        this.time = time,
        this.level = level,
        this.question = question,
        this.options = options,
        this.answer = answer
    }
}

function showLesson(lessonNumber) {
    let rawLessons = JSON.parse(localStorage.getItem("lessons"));
    let lessonsInstance = rawLessons.map((lesson) => new Lesson(lesson.reason, lesson.time, lesson.level, lesson.question, lesson.options, lesson.answer));
    let currentLesson = lessonsInstance[lessonNumber - 1];

    hideWay()
    
    console.log(currentLesson.question)
    console.log(currentLesson.options)
    console.log(currentLesson.answer)

    let sortOptions = currentLesson.options;
    sortOptions.sort(() => Math.random - 0.5);

    let lesson = document.getElementById("lesson");
    lesson.style.display = "block";
    setTimeout(() => {
        lesson  = `
            <header>
                <div class="textLogo">
                    <img src="assets/owl.png" alt="owl">
                    <h1>LexiGo</h1>
                </div>
                <a href="#">
                    Главная
                </a>
                <div class="main>
                    <h1>${currentLesson.question}</h1>
                </div>
                <div class="answers">
                    <a href="#">${sortOptions[0]}</a>
                    <a href="#">${sortOptions[1]}</a>
                    <a href="#">${sortOptions[2]}</a>
                    <a href="#">${sortOptions[3]}</a>
                <div>
            </heder>
        `
    }, 2000)
    //FIXME: Сделать так что бы урок показывался на экране
}

function showQuestion(questionId) {
    let question = document.getElementById(questionId);
    question.style.opacity = 0;
    question.style.display = 'flex';

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            question.style.opacity = parseFloat(question.style.opacity) + 0.01;
        }, i * 10); 
    }
}

function hideQuestion(questionId) {
    let question = document.getElementById(questionId);
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            question.style.opacity = parseFloat(question.style.opacity) - 0.01;
        }, i * 10); 
    }
    
    setTimeout(() => {
        question.style.display = 'none';
    }, 1000);
}

function showLoading() {
    showQuestion("loading");
    
    let text = document.querySelector(".start .loading .container p");
    let originalText = "Составляем систему обучения"; 
    text.innerHTML = originalText;
    
    let dotCount = 0;
    let isAdding = true;
    let animationInterval;

    function animateDots() {
        if (isAdding) {
            dotCount++;
            text.innerHTML = originalText + '.'.repeat(dotCount);
            
            if (dotCount === 3) {
                isAdding = false;
            }
        } else {
            dotCount--;
            text.innerHTML = originalText + '.'.repeat(dotCount);
            
            if (dotCount === 0) {
                isAdding = true;
            }
        }
    }

    animationInterval = setInterval(animateDots, 500);
    
    return function stopLoadingAnimation() {
        clearInterval(animationInterval);
        text.innerHTML = originalText; 
    };
}

function start() {
    setTimeout(() => showQuestion("question-1"), 1000);
}

function incrementLesson() {
    let currentLesson = parseInt(localStorage.getItem("lesson"));
    if (currentLesson <= 20) {
        localStorage.setItem("lesson", currentLesson + 1);
    }
    
    updateLessonsDisplay();
    updateBar();

}

function showModalReset() {
    let modalReset = document.getElementById("modal-reset");

    modalReset.style.display = "flex";

    document.body.style.overflow = "hidden"
    disableScroll();

    let yesButton = document.getElementById("reset-yes");
    let noButton = document.getElementById("reset-no");

    yesButton.addEventListener("click", () => {
        localStorage.clear()
        location.reload()
    })

    noButton.addEventListener("click", () => {
        modalReset.style.display = "none";
        document.body.style.overflow = "auto"
    })
}

function showWay() {
    let mainElement = document.getElementById('main');
    mainElement.style.display = 'block';
    
    setTimeout(() => {
        mainElement.style.opacity = 1;
    }, 50);

    
    let lessons = document.querySelectorAll(".main main .container .grid .lesson");
    
    lessons.forEach(lesson => {
        let lessonNumber = parseInt(lesson.getAttribute("res"));

        if (lessonNumber >= 10) {
            lesson.classList.add("double-digit");
        }

        lesson.addEventListener("click", () => {
            if(parseInt(lesson.getAttribute("res")) == localStorage.getItem("lesson")) {
                showLesson(lessonNumber);
                incrementLesson();
            }
        })
    });

    let ressetBeutton = document.getElementById("reset");
    ressetBeutton.addEventListener("click", () => {
        showModalReset();
    })

    updateLessonsDisplay();
    updateBar();
}

function hideWay() {
    let mainElement = document.getElementById('main');
    mainElement.style.display = 'none';
}

function updateBar() {
    let bar = document.getElementById("bar");
    let progress = document.getElementById("bar-progress");

    progress.style.width = ((parseInt(localStorage.getItem("lesson")) - 1) / 20) * 100 + "%";
}
 

function updateLessonsDisplay() {
    let currentLesson = parseInt(localStorage.getItem("lesson"));
    let lessons = document.querySelectorAll(".main main .container .grid .lesson");
    
    lessons.forEach(lesson => {
        let lessonNum = parseInt(lesson.getAttribute("res"));
        
        lesson.classList.remove("active");
        
        if (lessonNum < currentLesson) {
            lesson.classList.add("active");
        }
        
        if (lessonNum == currentLesson) {
            lesson.classList.add("current");
        } else {
            if (lesson.classList.contains("current")) {
                lesson.classList.remove("current");
            }
        }
    });
}

async function generateLessons() {
    let res = [];

    let lessons = await fetch("js/lessons.json").then((r) => r.json())
    for(let lesson of lessons) {
        let classLesson = new Lesson(lesson.reason, lesson.time, lesson.level, lesson.question, lesson.options, lesson.answer);

        let coincidences = 0;

        if(localStorage.getItem("reason") == classLesson.reason) {
            coincidences++;
        } 

        if(localStorage.getItem("time") == classLesson.time) {
            coincidences++;
        }

        if(localStorage.getItem("level") == classLesson.level) {
            coincidences++;
        }

        if(coincidences == 3) {
            res.push(classLesson)
        }

        if(res.length == 20) {
            break;
        }
    }
    
    return res;
}

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("isStarted") !== "true" ) {
        start()
        let buttonsSetLanguage = document.querySelectorAll(".start .question-1 .answers .card");

        buttonsSetLanguage.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("language", button.getAttribute("res"));
            console.log(localStorage.getItem("language"));
            profileUser["language"] = localStorage.getItem("language"),

            hideQuestion("question-1")
            setTimeout(() => showQuestion("question-2"), 1000) ;
        })})

        let buttonsFor = document.querySelectorAll(".start .question-2 .answers .card");

        buttonsFor.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("reason", button.getAttribute("res"));
            console.log(localStorage.getItem("reason"));
            profileUser["reason"] = localStorage.getItem("reason"),

            hideQuestion("question-2")
            setTimeout(() => showQuestion("question-3"), 1000) ;
        })})

        buttonsTime = document.querySelectorAll(".start .question-3 .answers .card");

        buttonsTime.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("time", button.getAttribute("res"));
            console.log(localStorage.getItem("time"));
            profileUser["time"] = localStorage.getItem("time"),

            hideQuestion("question-3")
            setTimeout(() => showQuestion("question-4"), 1000) ;

        })})

        buttonsLevel = document.querySelectorAll(".start .question-4 .answers .card");

        buttonsLevel.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("level", button.getAttribute("res"));
            hideQuestion("question-4")
            console.log(localStorage.getItem("level"));
            profileUser["level"] = localStorage.getItem("level");
            const stopAnimation = showLoading();
            localStorage.setItem("isStarted", true);
            
            setTimeout(() => {
                stopAnimation(); 
                hideQuestion("loading");

            }, 7000);

            localStorage.setItem("lesson", 1);
            setTimeout(() => showWay(), 8000)
            generateLessons().then((lessons) => {
                localStorage.setItem("lessons", JSON.stringify(lessons));
                let rawLessons = JSON.parse(localStorage.getItem("lessons"));
                let lessonsInstance = rawLessons.map((lesson) => new Lesson(lesson.reason, lesson.time, lesson.level, lesson.question, lesson.options, lesson.answer));
            })
        })})
    } else {
        setTimeout(() => showWay(), 1000)
    }
})