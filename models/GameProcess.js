class GameProcess {
    constructor({cards, formValues, endGameSubscriber}) {
        this.cards = cards;
        this.firstCard = null;
        this.secondCard = null;
        this.endGameSubscriber = endGameSubscriber
        this.listenersArray = []
        this.lockBoard = false;
        this.gap = 5
        this.formValues = formValues
        this.shuffleCards();
        this.createCards();
        this.addClickListeners();
    }

    cardFlipListener(card) {
        return () => {
            card.animeJS = anime.timeline();
            card.animeJS.add({
                targets: card,
                scale: [{value:1}, {value:1.3},{value:1, delay: 250} ],
                rotateY: {value: "+=360", delay: 200},
                easing: "easeInOutSine",
                duration: 400
            });
            function beerCard_enter() {
                if (card.animeJS.reversed) card.animeJS.reverse();
                card.animeJS.play();
            }
            beerCard_enter(false)

            if (this.lockBoard) return;
            if (card === this.firstCard) return;

            card.classList.add('flipped');
            card.innerHTML = card.dataset.card
            if (!this.firstCard) {
                this.firstCard = card;
                return;
            }

            this.secondCard = card;
            this.checkForMatch();
        }
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    removeCardEventListeners() {
        this.listenersArray.forEach((cardListenerObj) => {
            cardListenerObj.element.removeEventListener('click', cardListenerObj.listener)
        })
    }
    createCards() {
        const memoryGame = document.querySelector('.memory-game');
        memoryGame.style.width = this.formValues.values.width + 'px'
        memoryGame.style.height = this.formValues.values.height + 'px'
        const {
            columns,
            cellWidth,
            cellHeight
        }= this.countCardsWidthAndHeight()
        memoryGame.style.gridTemplateColumns = `repeat(auto-fill, minmax(${cellWidth}px, 1fr)`;
        memoryGame.style.gridAutoRows = `minmax(0px, ${cellHeight}px)`;
        memoryGame.style.gridGap = this.gap + 'px'
        this.cards.forEach(cardData => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = cardData.value;
            memoryGame.appendChild(cardElement);
        });
    }

    countCardsWidthAndHeight() {
        const sqrt = Math.sqrt(this.cards.length);
        let columns = Math.ceil(sqrt);
        let rows = Math.floor(sqrt);

        const cellWidth = (this.formValues.values.width - (columns - 1) * this.gap) / columns;
        const cellHeight = (this.formValues.values.height - (rows - 1) * this.gap) / rows;

        return {
            columns,
            rows,
            cellWidth,
            cellHeight,
        };
    }

    addClickListeners() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            this.cardListener = this.cardFlipListener(card).bind(this)
            this.listenersArray.push({listener: this.cardListener, element: card})
            card.addEventListener('click', this.cardListener);
        });
    }

    changeCardsStatuses() {
        this.cards.map((card) => {
            if(card.value === this.firstCard.dataset.card) {
                card.flipped = true
            }
            return card
        })
    }

    checkAllCardsFlippedStatus() {
        return this.cards.every((card) => card.flipped)
    }

    callFinishGameSubscriber() {
        this.endGameSubscriber({status: 'won'})
    }

    checkForMatch() {
        this.lockBoard = true;

        if (this.firstCard.dataset.card === this.secondCard.dataset.card) {
            this.firstCard.removeEventListener('click', this.cardListener);
            this.secondCard.removeEventListener('click', this.cardListener);
            this.changeCardsStatuses()
            this.resetBoard();
            if(this.checkAllCardsFlippedStatus()) {
                this.callFinishGameSubscriber()
            }
        } else {
            setTimeout(() => {
                this.firstCard.classList.remove('flipped');
                this.secondCard.classList.remove('flipped');
                this.firstCard.innerHTML = ''
                this.secondCard.innerHTML = ''
                this.resetBoard();
            }, 1000);
        }
    }

    resetBoard() {
        [this.firstCard, this.secondCard] = [null, null];
        this.lockBoard = false;
    }
}

