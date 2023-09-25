class GameManager {
    constructor() {

        this.menuElement = document.getElementById('menu')
        this.formElement = document.getElementById('settingsForm')
        this.lostNotificationElement = document.getElementById('loose-notification')
        this.wonNotificationElement = document.getElementById('congratulations')
        this.startPlayButton = document.getElementById('startPlaying')
        this.backToConfigButton = document.getElementById('backToConfig')
        this.timerElement = document.getElementById('timer')
        this.gameElement = document.getElementById('game')
        this.menuElement.style.display = 'none'
        this.formValues = new FormValues(this.readyToPlay.bind(this))
        this.cards = []
        this.startPlayButton.addEventListener('click', () => {
            this.timer.isPlaying = true
            this.timer.addInsideElementListener()

            this.startGame()
        })
        this.backToConfigButton.addEventListener('click', () => {
            this.configSettings()
        })

        this.timer = new Timer({
            timeLimit: this.formValues.values.timeLimit,
            endGameSubscriber: this.endGameSubscriber.bind(this),
        })
    }

    initializeGame() {
        this.createCards()
        this.clearBoard()
        if (!this.gameProcess)
            console.log('reinitializing')
            this.gameProcess = new GameProcess({
                formValues: this.formValues,
                cards: this.cards,
                endGameSubscriber: this.endGameSubscriber.bind(this)
            })
    }

    startGame() {
        this.timer.isPlaying = true
        this.initializeGame()
        this.timer.startTimer()
        this.gameElement.style.display = 'grid'
        this.menuElement.style.display = 'none'
        this.timerElement.style.display = 'block'
    }

    configSettings() {
        this.formElement.style.display = 'flex'
        this.menuElement.style.display = 'none'
        this.gameElement.style.display = 'none'
        this.timerElement.style.display = 'none'
    }

    clearBoard() {
        this.gameElement.innerHTML = ''
    }

    createCards() {
        let res = []
        for (let i = 0; i < this.formValues.values.numberOfSymbols; i++) {
            const letter = String.fromCharCode(97 + (i % 26)); // 97 is the ASCII code for 'a'
            res.push(letter);
        }
        this.cards = [...res, ...res].map((val, index) => ({
            id: index,
            value: val,
            flipped: false
        }))
    }

    endGameSubscriber({status}) {
        this.timerElement.style.display = 'none'
        const hideNotifications = () => {
            this.wonNotificationElement.style.display = 'none'
            this.lostNotificationElement.style.display = 'none'
        }
        switch (status) {
            case  'won':
                this.wonNotificationElement.style.display = 'block'
                break;
            case 'lost':
                this.lostNotificationElement.style.display = 'block'
                break;
        }
        const hideTimeoutId = setTimeout(() => {
            hideNotifications()
            clearTimeout(hideTimeoutId)
        }, 5000)
        this.gameProcess.removeCardEventListeners()
        this.timer.clearGameInterval()
        this.showMenuButtons()
        this.timer.isPlaying = false;
    }


    showMenuButtons() {
        this.menuElement.style.display = 'flex'
        this.startPlayButton.style.display = 'block'
    }

    changeTheme() {
        const body = document.getElementById('body')
        console.log(this.formValues.values.theme, 'this.formValues.values.theme')
        body.style.background = this.formValues.values.theme === 'Black' ? 'black' : 'white'
    }

    readyToPlay() {
        this.gameElement.style.display = 'grid'
        this.timer.timeLimit = this.formValues.values.timeLimit
        this.timerElement.innerHTML = this.formValues.values.timeLimit
        this.timer.isPlaying = true
        this.timer.addInsideElementListener()
        this.changeTheme()
        this.startGame()
    }
}