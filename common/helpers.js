class Helpers {
    static getFormattedDate(date) {
        return date.toISOString().split('T')[0];
    }

    static isUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = Helpers;