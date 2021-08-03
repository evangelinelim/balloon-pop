

//#region GAME LOGIC AND DATA

//data
let currentPlayer = {}
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let currentPopCount = 0
let currentScore = 0
let gameLength = 10000
let clockID = 0
let timeRemaining = 0
let currentColor = "blue"
let possibleColors = ["blue", "turqoise", "pink", "orange", "green"]

function startGame() {
    document.getElementById("game-controls").classList.remove("hidden")
    document.getElementById("main-controls").classList.add("hidden")
    document.getElementById("scoreboard").classList.add("hidden")
    startClock()
    setTimeout(stopGame, gameLength)
}

function startClock() {
    timeRemaining = gameLength
    drawClock()
    clockID = setInterval(drawClock, 1000)
}

function stopClock() {
    clearInterval(clockID)
}

function drawClock() {
    let countdownElem = document.getElementById("countdown")
    countdownElem.innerText = (timeRemaining / 1000).toString()
    timeRemaining -= 1000
}

function inflate() {

    clickCount++
    height += inflationRate
    width += inflationRate
    checkBalloonPop()
    draw()
}
function checkBalloonPop() {
    if (height >= maxSize) {
        let balloonElem = document.getElementById("balloon")
        balloonElem.classList.remove(currentColor)
        getRandomColor()
        balloonElem.classList.add(currentColor)

        document.getElementById("pop-sound").play()

        currentPopCount++
        height = 0
        width = -15
        console.log("Pop the balloon!")
    }
}

function getRandomColor() {
    let i = Math.floor(Math.random() * possibleColors.length)
    currentColor = possibleColors[i]
}

function draw() {
    let balloon = document.getElementById("balloon")
    let clickCountElem = document.getElementById("click-count")
    let popCountElem = document.getElementById("pop-count")
    let highScoreElem = document.getElementById("high-score")
    let playerNameElem = document.getElementById("player-name")

    balloon.style.height = height + "px"
    balloon.style.width = width + "px"

    clickCountElem.innerText = clickCount.toString()
    popCountElem.innerText = currentPopCount.toString()
    highScoreElem.innerText = currentPlayer.topScore.toString()
    playerNameElem.innerText = currentPlayer.name

}

function stopGame() {
    console.log("Game over")
    document.getElementById("game-controls").classList.add("hidden")
    document.getElementById("main-controls").classList.remove("hidden")
    document.getElementById("scoreboard").classList.remove("hidden")
    stopClock()
    clickCount = 0
    height = 120
    width = 100
    if (currentPopCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }
    currentPopCount = 0
    draw()
    drawScoreboard()
}


//#endregion

//#region USERS
let players = []
loadPlayers()

function setPlayer(event) {
    event.preventDefault()
    let form = event.target
    let playerName = form.playerName.value

    currentPlayer = players.find(player => player.name == playerName)

    if (!currentPlayer) {
        currentPlayer = {
            name: playerName,
            topScore: 0
        }
        players.push(currentPlayer)
        savePlayers()
    }

    form.reset()
    document.getElementById("game").classList.remove("hidden")
    form.classList.add("hidden")
    draw()
    drawScoreboard()
}

function changePlayer() {
    document.getElementById("player-form").classList.remove("hidden")
    document.getElementById("game").classList.add("hidden")
}

function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
    let playersData = JSON.parse(window.localStorage.getItem("players"))

    if (playersData) {
        players = playersData
    }
}

function drawScoreboard() {
    let template = ""
    players.sort((p1, p2) => p2.topScore - p1.topScore)
    players.forEach(player => {
        template += `
        <div class = "d-flex space-between mb-2">
        <span> <i class="fa fa-arrow-up" aria-hidden="true"></i>
        ${player.name}</span>
        <span> Score: ${player.topScore}</span>
        </div>
        `
    })

    document.getElementById("players").innerHTML = template
}

drawScoreboard()
//#endregion