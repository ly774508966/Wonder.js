module wd {
    export abstract class ActionInstant extends Action {
        get isStop() {
            return false;
        }

        get isPause() {
            return false;
        }

        public start() {
        }

        public stop() {
        }

        public pause() {
        }

        public resume() {
        }
    }
}
