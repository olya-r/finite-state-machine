class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('No config');
        }
        this.config = config;
        this.state = config.initial;
        this.history = [];
        this.redoStack = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!(state in this.config.states)) {
            throw new Error('Wrong state');
        }
        if (this.state != state) {
            this.history.push(this.state);
            this.state = state;
            this.redoStack = [];
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.changeState(this.config.states[this.state].transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this.config.states);
        }
        const result = [];
        for (const state in this.config.states) {
            if (event in this.config.states[state].transitions) {
                result.push(state);
            }
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length == 0) {
            return false;
        }
        this.redoStack.push(this.state);
        this.state = this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.redoStack.length == 0) {
            return false;
        }
        this.history.push(this.state);
        this.state = this.redoStack.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
