const baseURL = 'https://hm.babichev.net/api/v1.1';
const apiPath = '/currencies?q=USDT_BTC';

const vm = new Vue({
    el: '#square',
    data: {
        currency: 'Bitcoin',
        down: false,
        value: null,
        time: null,
        spinner: true,
    },
    methods: {
        loadData: function () {
            this.spinner = true;
            fetch(baseURL + apiPath, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                mode: 'cors'
            }).then(res => res.json()).then((json) => {
                const row = json.data.query.results[0].row;
                const value = parseInt(row.col1) + '$';

                if (this.value !== value)
                {
                    this.down = value < this.value;
                }
                
                this.currency = row.col0;
                this.time = row.col3;
                this.value = value;
                this.spinner = false;
            })
        }
    },
    mounted: function () {
        this.loadData();
        setInterval(this.loadData, 1100);
    }
});
