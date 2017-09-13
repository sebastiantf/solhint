

class Reporter {
    constructor (tokenStream, config = {}) {
        this.reports = [];
        this.tokenStream = tokenStream;
        this.config = config.rules || {};
    }

    addReport(line, column, severity, message, ruleId) {
        this.reports.push({ line, column, severity, message, ruleId });
    }

    addMessage(interval, defaultSeverity, message, ruleId='') {
        const line = this.tokenStream.get(interval.start).line;
        const charAtLine = this.tokenStream.get(interval.start).column;
        const configSeverity = this.severityOf(ruleId);

        if (this.config[ruleId] !== false) {
            this.addReport(line, charAtLine,  configSeverity || defaultSeverity, message, ruleId);
        }
    }

    severityOf(ruleId) {
        const ruleConfig = this.config[ruleId];
        let curSeverity;

        if (ruleConfig && typeof(ruleConfig) === 'array') {
            curSeverity = ruleConfig[0];
        } else if (ruleConfig) {
            curSeverity = ruleConfig;
        } else {
            return null;
        }

        return Reporter.SEVERITY[curSeverity.toUpperCase()];
    }

    get errorCount() {
        return this
            .reports
            .filter(i => i.severity === Reporter.SEVERITY.ERROR)
            .length;
    }

    get warningCount() {
        return this
            .reports
            .filter(i => i.severity === Reporter.SEVERITY.WARN)
            .length;
    }

    get messages() {
        return this.reports;
    }

    get filePath() {
        return this.file;
    }
}

Reporter.SEVERITY = Object.freeze({ ERROR: 2, WARN: 3 });


module.exports = Reporter;