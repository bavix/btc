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
            fetch(apiPath + this.currency, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                mode: 'cors'
            }).then(res => res.json()).then((json) => {
                const row = json.data.query.results[0].row;
                const value = parseInt(row.col1);

                if (this.value !== value) {
                    this.down = value < this.value;
                }

                this.history.push(row.col1);
                this.currencyTitle = row.col0;
                // this.time = row.col3;
                this.value = value;
                this.spinner = false;

                document.title = this.value + ' - ' + this.defaultTitle;
            })
        },
        updateTime: function () {
            this.time = moment().format('LTS')
        }
    },
    watch: {
        history: function () {
            while (this.history.length > 60) {
                this.history.shift();
            }

            if (typeof chart !== "undefined") {
                if (chart.data.labels.length < this.history.length) {
                    chart.data.labels = this.history;
                }

                chart.data.datasets[0].data = this.history;
                chart.update();
            }
        },
        interval: function () {
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            this.intervalId = setInterval(this.loadData, this.interval);
        },
        currency: function () {
             this.defaultTitle = 'How many USD in one ' + this.currencyTitle + '?';
             location.hash = this.currency;
        }
    },
    mounted: function () {
        document.title = this.defaultTitle;
        this.currency = currency;

        if(location.hash) {
            this.currency = location.hash.substr(1,).toUpperCase();
        }

        this.loadData();
        this.interval = 1500;

        this.updateTime();
        setInterval(this.updateTime, 1000);
    }
});
