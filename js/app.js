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

function showWay() {
    let mainElement = document.getElementById('main');
    mainElement.style.display = 'block';
    
    setTimeout(() => {
        mainElement.style.opacity = 1;
    }, 50);

    
    let lessons = document.querySelectorAll(".main main .container .grid .lesson");
    
    lessons.forEach(lesson => {
        if (parseInt(lesson.getAttribute("res")) >= 10) {
            lesson.style.fontSize = "48px"; 
        }

        lesson.addEventListener("click", () => {
            if(parseInt(lesson.getAttribute("res")) == localStorage.getItem("lesson")) {
                incrementLesson();
            }
        })
    });
    updateLessonsDisplay();
    updateBar();
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

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("isStarted") !== "true" ) {
        start()
        let buttonsSetLanguage = document.querySelectorAll(".start .question-1 .answers .card");

        buttonsSetLanguage.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("language", button.getAttribute("res"));
            console.log(localStorage.getItem("language"));

            hideQuestion("question-1")
            setTimeout(() => showQuestion("question-2"), 1000) ;
        })})

        let buttonsFor = document.querySelectorAll(".start .question-2 .answers .card");

        buttonsFor.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("reason", button.getAttribute("res"));
            console.log(localStorage.getItem("reason"));

            hideQuestion("question-2")
            setTimeout(() => showQuestion("question-3"), 1000) ;
        })})

        buttonsTime = document.querySelectorAll(".start .question-3 .answers .card");

        buttonsTime.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("time", button.getAttribute("res"));
            console.log(localStorage.getItem("time"));

            hideQuestion("question-3")
            setTimeout(() => showQuestion("question-4"), 1000) ;

        })})

        buttonsLevel = document.querySelectorAll(".start .question-4 .answers .card");

        buttonsLevel.forEach(button => { button.addEventListener("click", () => {
            localStorage.setItem("level", button.getAttribute("res"));
            hideQuestion("question-4")
            console.log(localStorage.getItem("level"));
            const stopAnimation = showLoading();
            localStorage.setItem("isStarted", true);
            
            setTimeout(() => {
                stopAnimation(); 
                hideQuestion("loading");

            }, 7000);

            localStorage.setItem("lesson", 1);
            setTimeout(() => showWay(), 8000)
        })})
    } else {
        setTimeout(() => showWay(), 1000)
    }
})