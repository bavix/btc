let apiPath = 'https://hm.babichev.net/api/v1.1/currencies?q=USDT_';
let currency = 'BTC';

switch (location.host) {
    case 'ltc.babichev.net':
        currency = 'LTC';
        break;

    case 'eth.babichev.net':
        currency = 'ETH';
        break;

    case 'btc.babichev.net':
        currency = 'BTC';
        break;

    default: apiPath = '/test.php?';
}

const config = {
    type: 'line'
    , data: {
        labels: new Array(60)
        , datasets: [{
            borderColor: 'rgba(35, 43, 43, .3)'
            , data: []
            , fill: false
            , pointRadius: 0
            , lineTension: .8
        }]
    }
    , options: {
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
};

let chart;

window.onload = function () {
    chart = new Chart(document.getElementById('chart').getContext('2d'), config);
};

const vm = new Vue({
    el: '#wrapper',
    data: {
        intervalId: null,
        interval: null,
        currencyTitle: null,
        down: false,
        value: null,
        time: null,
        spinner: true,
        history: [],
        currency: '',
        defaultTitle: '',
        currencyList: [
            'BTC',
            'ETH',
            'LTC',
        ]
    },
    methods: {
        loadData: function () {
            this.spinner = true;
            fetch(apiPath + this.currencyList.join(',USDT_'), {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                mode: 'cors'
            }).then(res => res.json()).then((json) => {

                let row, value, currency;

                for (const key in this.currencyList) {

                    row = json.data.query.results[key].row;
                    value = parseInt(row.col1);
                    currency = this.currencyList[key];

                    if (currency === this.currency && this.value !== value) {
                        this.down = value < this.value;

                        this.value = value;
                        this.currencyTitle = row.col0;
                    }

                    this.historyAt(currency).push(row.col1);

                }

                this.drawChart();

                this.spinner = false;

                document.title = this.value + ' - ' + this.defaultTitle;

            })
        },
        updateTime: function () {
            this.time = moment().format('LTS')
        },
        drawChart: function () {
            while (this.historyAt(this.currency).length > 60) {
                this.historyAt(this.currency).shift();
            }

            if (typeof chart !== "undefined") {
                if (chart.data.labels.length < this.historyAt(this.currency).length) {
                    chart.data.labels = this.historyAt(this.currency);
                }

                chart.data.datasets[0].data = this.historyAt(this.currency);
                chart.update();
            }
        },
        historyAt: function (key) {
            if (typeof this.history[key] === "undefined") {
                this.history[key] = [];
            }
            return this.history[key]
        }
    },
    watch: {
        interval: function () {
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            this.intervalId = setInterval(this.loadData, this.interval);
        },
        currency: function () {
             this.defaultTitle = 'How many USD in one ' + this.currency + '?';
             location.hash = this.currency;
        }
    },
    mounted: function () {
        this.currency = currency;

        if(location.hash) {
            this.currency = location.hash.substr(1,).toUpperCase();
        }

        document.title = this.defaultTitle;

        this.loadData();
        this.interval = 1500;

        this.updateTime();
        setInterval(this.updateTime, 1000);
    }
});
