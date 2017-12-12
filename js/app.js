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
            'LTC',
            'ETH',
            'BTC',
        ]
    },
    methods: {
        loadData: function () {
            this.spinner = true;
            fetch(apiPath + 'USDT_' + this.currencyList.join(',USDT_'), {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                mode: 'cors'
            }).then(res => res.json()).then((json) => {

                let row, value;

                for (const key in this.currencyList) {

                    row = json.data.query.results[key].row;
                    value = parseInt(row.col1);

                    if (this.currencyList[key] === this.currency && this.value !== value) {
                        this.down = value < this.value;

                        this.value = value;
                        this.currencyTitle = row.col0;
                    }

                    this.historyList.push(row.col1);

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
            while (this.history[this.currency].length > 60) {
                this.history[this.currency].shift();
            }

            if (typeof chart !== "undefined") {
                if (chart.data.labels.length < this.history[this.currency].length) {
                    chart.data.labels = this.history[this.currency];
                }

                chart.data.datasets[0].data = this.history[this.currency];
                chart.update();
            }
        }
    },
    computed: {
        historyList: function () {
            if (typeof this.history[this.currency] === "undefined") {
                this.history[this.currency] = [];
            }
            return this.history[this.currency]
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
