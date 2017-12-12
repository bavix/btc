let apiPath;

if (location.host === 'btc.local') {
    apiPath = '/test.php';
}
else {
    apiPath = 'https://hm.babichev.net/api/v1.1/currencies?q=USDT_BTC';
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
    el: '#square',
    data: {
        intervalId: null,
        interval: null,
        currency: 'Bitcoin',
        down: false,
        value: null,
        time: null,
        spinner: true,
        history: [],
    },
    methods: {
        loadData: function () {
            this.spinner = true;
            fetch(apiPath, {
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
                this.currency = row.col0;
                // this.time = row.col3;
                this.value = value;
                this.spinner = false;
            })
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
        }
    },
    mounted: function () {
        this.loadData();
        this.interval = 1500;
        // setInterval(this.loadData, this.interval);

        setInterval(function () {
            this.time = moment().format('LTS')
        }.bind(this), 1000);
    }
});
