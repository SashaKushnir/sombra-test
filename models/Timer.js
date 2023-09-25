class Timer {
    constructor({timeLimit, endGameSubscriber}) {
        this._defaultGameTime = timeLimit
        this.leftTime = timeLimit
        this.endGameSubscriber = endGameSubscriber
        this.intervalId = null
        this.isPlaying = true
        this.timerElement = document.getElementById('timer')
        this.gameElement = document.getElementById('game')
    }

    set timeLimit(value) {
        this.leftTime = value
        this._defaultGameTime = value
    }

    gameLost() {
        this.endGameSubscriber({status: 'lost'})
        this.resetTimer()
    }

    addInsideElementListener() {
        console.log('addInsideElementListener', this.isPlaying)
        if (this.isPlaying) {
            const handleMouseInsideElement = () => {
                this.unpauseTimer()
                this.gameElement.removeEventListener('mouseenter', handleMouseInsideElement)
                this.addOutsideElementListener()
            }
            this.gameElement.addEventListener('mouseenter', handleMouseInsideElement);
        }
    }

    addOutsideElementListener() {
        console.log('addOutsideElementListener', this.isPlaying)
        if (this.isPlaying) {
            const handleMouseInsideElement = () => {
                this.pauseTimer()
                this.gameElement.removeEventListener('mouseleave', handleMouseInsideElement)
                this.addInsideElementListener()
            }
            this.gameElement.addEventListener('mouseleave', handleMouseInsideElement);
        }
    }


    startTimer() {
        this.clearGameInterval()
        if (this.isPlaying) {
            this.intervalId = setInterval(() => {
                this.leftTime--
                if (parseInt(this.leftTime) <= 0) {
                    this.clearGameInterval()
                    this.gameLost()
                }
                this.updateTimerValue(this.leftTime)
            }, 1000)
        }
    }

    resetTimer() {
        this.leftTime = this._defaultGameTime
    }

    updateTimerValue(value) {
        this.timerElement.innerHTML = value
    }

    pauseTimer() {
        this.clearGameInterval()
    }

    unpauseTimer() {
        this.startTimer()
    }

    gameFinished() {
        this.clearGameInterval()
    }

    clearGameInterval() {
        if (this.intervalId)
            clearInterval(this.intervalId)
    }

}

