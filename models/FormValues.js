class FormValues {
    constructor(readyToPlay) {
        this.form = document.getElementById("settingsForm");
        this.readyToPlay = readyToPlay
        this.values = {
            width: null,
            height: null,
            numberOfSymbols: null,
            timeLimit: null,
            theme: 'white'
        };
        // todo remove listeners
        this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    updateFormData() {
        this.values.width = this.form.width.value;
        this.values.height = this.form.height.value;
        this.values.numberOfSymbols = this.form.numberOfSymbols.value;
        this.values.timeLimit = this.form.timeLimit.value;
        this.values.theme = this.form.theme.options[this.form.theme.selectedIndex].text;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.updateFormData()
        const {width, height, timeLimit,  numberOfSymbols} = this.values
        if(!(width && height && timeLimit && numberOfSymbols) ) {
            alert('Some required fields are empty')
            return
        }
        this.form.style.display = 'none'
        this.readyToPlay()
    }
}

